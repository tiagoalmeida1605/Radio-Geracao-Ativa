const trackNoticias = document.getElementById("home-news-track");
const trackVideos = document.getElementById("home-videos-track");

function criarElemento(tag, classe, texto = "") {
    const elemento = document.createElement(tag);

    if (classe) elemento.className = classe;
    if (texto) elemento.textContent = texto;

    return elemento;
}

function formatarData(valor) {
    if (!valor) return "";

    const data = String(valor);

    let partes = data.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (partes) {
        return `${partes[3]}/${partes[2]}/${partes[1]}`;
    }

    partes = data.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);

    if (partes) {
        return `${partes[1]}/${partes[2]}/${partes[3]}`;
    }

    return data;
}

function obterImagemSegura(valor) {
    if (typeof valor !== "string" || !valor.trim()) {
        return null;
    }

    if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(valor)) {
        return valor;
    }

    try {
        const url = new URL(valor, window.location.origin);

        if (
            url.protocol === "https:" ||
            (
                url.protocol === "http:" &&
                url.origin === window.location.origin
            )
        ) {
            return url.href;
        }
    } catch {
        // Imagem inválida: será exibido o cartão alternativo.
    }

    return null;
}

function criarAreaImagem(origem, titulo) {
    const area = criarElemento("div", "home-card-image");
    const imagemSegura = obterImagemSegura(origem);

    function mostrarAlternativa() {
        area.replaceChildren();
        area.classList.add("home-card-image-placeholder");
        area.appendChild(criarElemento("span", "", "RGA"));
    }

    if (!imagemSegura) {
        mostrarAlternativa();
        return area;
    }

    const imagem = document.createElement("img");

    imagem.src = imagemSegura;
    imagem.alt = titulo;
    imagem.loading = "lazy";
    imagem.decoding = "async";
    imagem.addEventListener("error", mostrarAlternativa, { once: true });

    area.appendChild(imagem);

    return area;
}

function criarCard(item, tipo) {
    const titulo = String(item.titulo || "Conteúdo da RGA");
    const artigo = criarElemento("article", "home-content-card");
    const link = document.createElement("a");

    link.className = "home-content-card-link";

    if (tipo === "noticia") {
        link.href = "./pages/publi.html";
    } else {
        let url;

        try {
            url = new URL(item.url);
        } catch {
            return null;
        }

        if (
            url.protocol !== "https:" ||
            !["youtube.com", "www.youtube.com", "youtu.be"]
                .includes(url.hostname)
        ) {
            return null;
        }

        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }

    link.appendChild(criarAreaImagem(item.imagem, titulo));

    const corpo = criarElemento("div", "home-content-card-body");

    const categoria = tipo === "noticia"
        ? "Notícia"
        : item.tipo === "playlist" ? "Playlist" : "Vídeo";

    corpo.appendChild(
        criarElemento("span", "home-card-category", categoria)
    );

    if (tipo === "noticia" && item.data) {
        corpo.appendChild(
            criarElemento("span", "home-card-date", formatarData(item.data))
        );
    }

    corpo.appendChild(criarElemento("h3", "", titulo));

    const resumo = tipo === "noticia"
        ? item.resumo
        : item.descricao;

    if (resumo) {
        corpo.appendChild(
            criarElemento("p", "home-card-description", resumo)
        );
    }

    corpo.appendChild(
        criarElemento(
            "span",
            "home-card-cta",
            tipo === "noticia"
                ? "Ler publicação"
                : "Assistir no YouTube"
        )
    );

    link.appendChild(corpo);
    artigo.appendChild(link);

    return artigo;
}

function mostrarMensagem(track, mensagem) {
    track.replaceChildren(
        criarElemento("p", "home-feed-feedback", mensagem)
    );
}

function renderizarConteudos(track, conteudos, tipo) {
    track.replaceChildren();

    if (!conteudos.length) {
        mostrarMensagem(
            track,
            tipo === "noticia"
                ? "Ainda não há notícias disponíveis. Confira os vídeos recentes da rádio."
                : "Nenhum vídeo disponível no momento."
        );

        return;
    }

    conteudos.forEach((item) => {
        const card = criarCard(item, tipo);

        if (card) {
            track.appendChild(card);
        }
    });

    if (!track.children.length) {
        mostrarMensagem(track, "Nenhum conteúdo disponível no momento.");
    }
}

function configurarControles() {
    document.querySelectorAll("[data-scroll-target]").forEach((botao) => {
        botao.addEventListener("click", () => {
            const track = document.getElementById(
                botao.dataset.scrollTarget
            );

            if (!track) return;

            const direcao = Number(botao.dataset.scrollDirection);

            track.scrollBy({
                left: direcao * track.clientWidth * 0.8,
                behavior: "smooth"
            });
        });
    });
}

async function carregarHome() {
    try {
        const resposta = await fetch("/api/home-feed", {
            headers: { Accept: "application/json" }
        });

        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (!dados.ok) {
            throw new Error(dados.erro || "Falha ao consultar o feed.");
        }

        renderizarConteudos(
            trackNoticias,
            dados.noticias || [],
            "noticia"
        );

        renderizarConteudos(
            trackVideos,
            dados.videos || [],
            "video"
        );

        document.getElementById("home-news-controls").hidden =
            !(dados.noticias || []).length;

        document.getElementById("home-videos-controls").hidden =
            !(dados.videos || []).length;

    } catch (erro) {
        console.error("[RGA Home] Não foi possível carregar o feed:", erro);

        mostrarMensagem(
            trackNoticias,
            "Não foi possível carregar as notícias agora."
        );

        mostrarMensagem(
            trackVideos,
            "Não foi possível carregar os vídeos agora."
        );
    }
}

configurarControles();
carregarHome();
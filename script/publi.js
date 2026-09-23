/**
 * Rádio Geração Ativa
 * Notícias
 *
 * Fonte de dados:
 * Firebase Realtime Database → noticias
 */

import { database } from "./firebase-config.js";
import { onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { resolveIcon, renderIconMarkup, ICON_MAP, ICON_DEFAULT } from "./icon-catalog.js";
import { PUBLICATION_TAGS, normalizarTagsPublicacao } from "./publication-tags.js";

console.debug("[RGA Notícias] Using centralized Firebase config");

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    })[caractere]);
}


document.addEventListener("DOMContentLoaded", async () => {
    // ==========================================================
    // REFERÊNCIAS DO HTML
    // ==========================================================

    const gridNoticias = document.getElementById("grid-noticias");
    if (!gridNoticias) {
        console.error("[RGA Notícias] Elemento #grid-noticias não encontrado");
        return;
    }

    const modal = document.getElementById("noticiaModal");
    if (!modal) {
        console.error("[RGA Notícias] Elemento #noticiaModal não encontrado");
        return;
    }

    const closeModalBtn = document.getElementById("closeModal");
    if (!closeModalBtn) {
        console.error("[RGA Notícias] Elemento #closeModal não encontrado");
        return;
    }

    // Referências dos campos dentro do Modal
    const modalImg = document.getElementById("modalImg");
    if (!modalImg) {
        console.error("[RGA Notícias] Elemento #modalImg não encontrado");
        return;
    }

    const modalTitulo = document.getElementById("modalTitulo");
    if (!modalTitulo) {
        console.error("[RGA Notícias] Elemento #modalTitulo não encontrado");
        return;
    }

    const modalData = document.getElementById("modalData");
    if (!modalData) {
        console.error("[RGA Notícias] Elemento #modalData não encontrado");
        return;
    }

    const modalTexto = document.getElementById("modalTexto");
    if (!modalTexto) {
        console.error("[RGA Notícias] Elemento #modalTexto não encontrado");
        return;
    }

    const filtrosTags = document.getElementById("filtros-tags");
    const modalNoticiaTags = document.getElementById("modalNoticiaTags");
    if (!filtrosTags || !modalNoticiaTags) {
        console.error("[RGA Notícias] Elementos de tags não encontrados");
        return;
    }


    // ==========================================================
    // VALIDAÇÕES INICIAIS
    // ==========================================================

    if (!gridNoticias) {
        console.error("Elemento #grid-noticias não encontrado.");
        return;
    }


    if (
        !modal ||
        !closeModalBtn ||
        !modalImg ||
        !modalTitulo ||
        !modalData ||
        !modalTexto
    ) {
        console.error("Elementos do modal de notícia não foram encontrados.");
        return;
    }


    // ==========================================================
    // FORMATAÇÃO DE DATA (CORRIGIDO)
    // ==========================================================

    function formatarDataExibicao(data) {
        if (!data) return "";
        try {
            // Tenta parsear como ISO (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
                const [ano, mes, dia] = data.split("-");
                return `${dia}/${mes}/${ano}`;
            }
            // Tenta parsear como BR (DD/MM/YYYY)
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
                return data;
            }
            // Tenta parsear como BR com hífen (DD-MM-YYYY)
            if (/^\d{2}-\d{2}-\d{4}$/.test(data)) {
                const [dia, mes, ano] = data.split("-");
                return `${dia}/${mes}/${ano}`;
            }
            return data;
        } catch {
            return data;
        }
    }

    let noticiasCarregadas = [];
    let tagAtiva = "";

    function obterTagsDisponiveis() {
        return normalizarTagsPublicacao([
            ...PUBLICATION_TAGS,
            ...noticiasCarregadas.flatMap((noticia) => normalizarTagsPublicacao(noticia.tags))
        ]);
    }

    function chaveTag(tag) {
        return String(tag ?? "")
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR");
    }

    function noticiasFiltradas() {
        if (!tagAtiva) {
            return noticiasCarregadas;
        }

        const chaveAtiva = chaveTag(tagAtiva);
        return noticiasCarregadas.filter((noticia) =>
            normalizarTagsPublicacao(noticia.tags).some((tag) => chaveTag(tag) === chaveAtiva)
        );
    }

    function renderizarFiltrosTags() {
        const tags = obterTagsDisponiveis();
        if (tagAtiva && !tags.includes(tagAtiva)) {
            tagAtiva = "";
        }

        filtrosTags.innerHTML = `
            <button type="button" class="filtro-tag ${!tagAtiva ? "active" : ""}" data-tag="" aria-pressed="${!tagAtiva}">Todas</button>
            ${tags.map((tag) => `
                <button type="button" class="filtro-tag ${tagAtiva === tag ? "active" : ""}" data-tag="${escaparHtml(tag)}" aria-pressed="${tagAtiva === tag}">${escaparHtml(tag)}</button>
            `).join("")}
        `;

        filtrosTags.querySelectorAll(".filtro-tag").forEach((botao) => {
            botao.addEventListener("click", () => {
                tagAtiva = botao.dataset.tag || "";
                renderizarFiltrosTags();
                renderizarNoticias(noticiasFiltradas());
            });
        });
    }

    function renderizarTagsModal(tags) {
        modalNoticiaTags.innerHTML = tags.map((tag) =>
            `<span class="noticia-tag">${escaparHtml(tag)}</span>`
        ).join("");
        modalNoticiaTags.hidden = tags.length === 0;
    }


    // ==========================================================
    // ABRIR MODAL
    // ==========================================================

    function abrirModal(noticia) {
        modalTitulo.textContent = noticia.titulo || "";

        const dataFormatada = formatarDataExibicao(noticia.data);

        modalData.textContent = dataFormatada ? "Publicado em " + dataFormatada : "Data indefinida";

        // CORREÇÃO: campo conteudo vs texto
        modalTexto.textContent = noticia.conteudo || noticia.texto || "";
        renderizarTagsModal(normalizarTagsPublicacao(noticia.tags));

        if (noticia.imagem) {
            modalImg.src = noticia.imagem;
            modalImg.style.display = "block";
        } else {
            modalImg.src = "";
            modalImg.style.display = "none";
        }

        modal.classList.add("active");
        document.body.classList.add("modal-aberto");
        closeModalBtn.focus();
    }


    // ==========================================================
    // FECHAR MODAL
    // ==========================================================

    function fecharModal() {
        modal.classList.remove("active");
        document.body.classList.remove("modal-aberto");
    }


    // ==========================================================
    // EVENTOS DO MODAL
    // ==========================================================

    closeModalBtn.addEventListener("click", fecharModal);

    // Fecha clicando no fundo escuro
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            fecharModal();
        }
    });

    // Fecha com ESC
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
            fecharModal();
        }
    });


    // ==========================================================
    // CARREGAR NOTÍCIAS PELA API
    // ==========================================================

    function renderizarNoticias(noticias) {
        try {
            gridNoticias.innerHTML = `<p style="text-align: center; width: 100%; color: #666; font-weight: 600;">Carregando publicações...</p>`;
            gridNoticias.innerHTML = "";

            // --------------------------------------------------
            // BANCO VAZIO
            // --------------------------------------------------
            if (noticias.length === 0) {
                const mensagemVazia = tagAtiva
                    ? "Nenhuma publicação encontrada nesta categoria."
                    : "Nenhuma publicação encontrada. Volte mais tarde!";
                gridNoticias.innerHTML = `<p class="noticias-feedback" role="status">${mensagemVazia}</p>`;
                return;
            }

            // --------------------------------------------------
            // RENDERIZAR NOTÍCIAS
            // --------------------------------------------------
            noticias.forEach((noticia) => {
                const card = document.createElement("article");
                card.className = "noticia-card";
                card.setAttribute("tabindex", "0");
                card.setAttribute("role", "button");
                card.setAttribute("aria-label", `Ler notícia: ${escaparHtml(noticia.titulo) || "Sem título"}`);

                const dataFormatada = formatarDataExibicao(noticia.data);
                const tagsNoticia = normalizarTagsPublicacao(noticia.tags);

                // IMAGEM
                const imagemHTML = noticia.imagem
                    ? `<img src="${escaparHtml(noticia.imagem)}" alt="Prévia da notícia" class="noticia-img-preview" loading="lazy">`
                    : "";

                // CARD
                const iconeNomeNoticia = resolveIcon(noticia.icone || "");
                const iconeItemNoticia = ICON_MAP[iconeNomeNoticia] || ICON_MAP[ICON_DEFAULT];
                const iconeLabelNoticia = iconeItemNoticia.label;
                const tagsHTML = tagsNoticia.length > 0
                    ? `<div class="noticia-tags" aria-label="Categorias: ${escaparHtml(tagsNoticia.join(", "))}">${tagsNoticia.map((tag) => `<span class="noticia-tag">${escaparHtml(tag)}</span>`).join("")}</div>`
                    : "";

                card.innerHTML = `
                    ${imagemHTML}
                    <div class="noticia-content-preview">
                        <span class="tag">
                            ${renderIconMarkup(iconeNomeNoticia)}
                            <span class="tag-label">${iconeLabelNoticia}</span>
                        </span>
                        <span class="noticia-data">
                            📅 ${escaparHtml(dataFormatada)}
                        </span>
                        ${tagsHTML}
                        <h3>${escaparHtml(noticia.titulo)}</h3>
                        <p>${escaparHtml(noticia.resumo)}</p>
                        <span class="leia-mais">Ler publicação completa →</span>
                    </div>
                `;

                // CLIQUE
                card.addEventListener("click", () => abrirModal(noticia));

                // TECLADO
                card.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        abrirModal(noticia);
                    }
                });

                gridNoticias.appendChild(card);
            });

        } catch (error) {
            console.error("Erro ao carregar notícias:", error);
            gridNoticias.innerHTML = `<p style="text-align: center; width: 100%; color: #b00020; font-weight: 600;">Não foi possível carregar as publicações. Tente novamente mais tarde.</p>`;
        }
    }

    const noticiasRef = ref(database, "noticias");
    onValue(noticiasRef, (snapshot) => {
        console.debug("[RGA Notícias] Dados recebidos do Firebase");
        const dados = snapshot.val();
        console.debug("[RGA Notícias] Valor:", dados);

        if (dados && typeof dados === 'object') {
            console.debug("[RGA Notícias] Dados são objeto válido, processando...");
            try {
                // Handle both objects and arrays
                noticiasCarregadas = Array.isArray(dados) ? dados : Object.values(dados);
                renderizarFiltrosTags();
                renderizarNoticias(noticiasFiltradas());
            } catch (error) {
                console.error("[RGA Notícias] Erro ao renderizar notícias:", error);
                if (gridNoticias) {
                    gridNoticias.innerHTML = `<p class="noticias-feedback">Erro ao processar os dados das notícias. Tente novamente mais tarde.</p>`;
                }
            }
        } else {
            console.debug("[RGA Notícias] Dados não são objeto ou são null:", dados);
            noticiasCarregadas = [];
            renderizarFiltrosTags();
            renderizarNoticias(noticiasFiltradas());
        }
    }, (error) => {
        console.error("[RGA Notícias] Erro ao carregar notícias:", error);
        if (gridNoticias) {
            gridNoticias.innerHTML = `<p class="noticias-feedback">Não foi possível carregar as publicações. Tente novamente mais tarde.</p>`;
        } else {
            console.error("[RGA Notícias] #grid-noticias não disponível para mostrar mensagem de erro");
        }
    });
});

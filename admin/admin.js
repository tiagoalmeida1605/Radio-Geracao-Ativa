import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, remove, get } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// 1. CONFIGURAÇÃO DO FIREBASE (Configurado Corretamente)
const firebaseConfig = {
    apiKey: "AIzaSyBNCSo_-gKlWZnxRY06hEH8YumECD4Yj54",
    authDomain: "radiogeracaoativa-playlist.firebaseapp.com",
    projectId: "radiogeracaoativa-playlist",
    storageBucket: "radiogeracaoativa-playlist.firebasestorage.app",
    messagingSenderId: "437305061004",
    appId: "1:437305061004:web:ee41f4d58d11d20af615a9",
    measurementId: "G-SFVF2382KW",
    databaseURL: "https://radiogeracaoativa-playlist-default-rtdb.firebaseio.com/"
};

// Inicializa o Firebase no formato modular
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 🔑 CONTAS DO PAINEL
const CONTAS = [
    { papel: "admin",      hash: "f374d04f033f52346e2153151af9cfe761fab6959bbd92e54f0a37738d8963aa" },
    { papel: "publicador", hash: "df396909399def576a471a3402484be047541c590ea72c6eced89aa6a65b3f6c" },
    { papel: "playlist",   hash: "4f1a2dc11ff8f84b5e936f345665580ba9317a96eb3e414e8fdf058d0151308d" }
];

const NOMES_PAPEL = {
    admin: "Administrador",
    publicador: "Publicador de Notícias",
    playlist: "Gerente de Playlists"
};

async function criptografarSenha(texto) {
    const msgBuffer = new TextEncoder().encode(texto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const telaBloqueio = document.getElementById("bloqueio-tela");
const conteudoPainel = document.getElementById("conteudo-painel");
const formBloqueio = document.getElementById("form-bloqueio-rga");
const cardSenha = document.getElementById("cardSenha");
const inputUsuario = document.getElementById("input-usuario-rga");
const inputSenha = document.getElementById("input-senha-rga");
const erroLogin = document.getElementById("erroLogin");
const btnToggleSenha = document.getElementById("btnToggleSenha");
const textoContaLogada = document.getElementById("textoContaLogada");
const btnSair = document.getElementById("btnSair");

const hashSalvo = sessionStorage.getItem("rga_autenticado");
const papelSalvo = sessionStorage.getItem("rga_papel");
const contaSalva = CONTAS.find(c => c.hash === hashSalvo && c.papel === papelSalvo);
if (contaSalva) {
    liberarPainel(contaSalva.papel);
}

btnToggleSenha.addEventListener("click", () => {
    const estaOculta = inputSenha.type === "password";
    inputSenha.type = estaOculta ? "text" : "password";
    btnToggleSenha.textContent = estaOculta ? "🙈" : "👁️";
    btnToggleSenha.setAttribute("aria-label", estaOculta ? "Ocultar senha" : "Mostrar senha");
    inputSenha.focus();
});

formBloqueio.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuarioDigitado = inputUsuario.value.trim().toLowerCase();
    const credenciaisDigitadas = `${usuarioDigitado}:${inputSenha.value}`;
    const hashDigitado = await criptografarSenha(credenciaisDigitadas);

    const contaEncontrada = CONTAS.find(c => c.hash === hashDigitado);

    if (contaEncontrada) {
        sessionStorage.setItem("rga_autenticado", contaEncontrada.hash);
        sessionStorage.setItem("rga_papel", contaEncontrada.papel);
        erroLogin.classList.remove("mostrar");
        liberarPainel(contaEncontrada.papel);
    } else {
        mostrarErroLogin();
    }
});

btnSair.addEventListener("click", () => {
    sessionStorage.removeItem("rga_autenticado");
    sessionStorage.removeItem("rga_papel");
    location.reload();
});

function mostrarErroLogin() {
    erroLogin.classList.add("mostrar");
    inputSenha.value = "";
    inputSenha.focus();

    cardSenha.classList.remove("erro");
    void cardSenha.offsetWidth;
    cardSenha.classList.add("erro");
}

function aplicarPermissoes(papel) {
    document.querySelectorAll("[data-papel]").forEach((secao) => {
        const papeisPermitidos = secao.dataset.papel.split(",");
        secao.style.display = papeisPermitidos.includes(papel) ? "" : "none";
    });
}

function liberarPainel(papel) {
    telaBloqueio.style.display = "none";
    conteudoPainel.style.display = "block";

    aplicarPermissoes(papel);
    textoContaLogada.textContent = `Logado como: ${NOMES_PAPEL[papel] || papel}`;

    if (papel === "admin" || papel === "playlist") {
        inicializarGerenciadorPlaylists();
    }
    if (papel === "admin" || papel === "publicador") {
        inicializarGerenciadorNoticias();
    }
}

/* ==========================================================================
   SISTEMA DE PLAYLISTS
   ========================================================================== */
function inicializarGerenciadorPlaylists() {
    const formPlaylist = document.getElementById("form-playlist");
    const inputId = document.getElementById("playlist-id");
    const inputIcone = document.getElementById("playlist-icone");
    const inputTitulo = document.getElementById("playlist-titulo");
    const inputDesc = document.getElementById("playlist-desc");
    const inputUrl = document.getElementById("playlist-url");
    const btnLimpar = document.getElementById("btn-limpar-form");
    const listaContainer = document.getElementById("lista-playlists-admin");

    function filtrarIdPlaylist(valor) {
        let urlInserida = valor.trim();
        if (urlInserida.includes("list=")) {
            return urlInserida.split("list=")[1].split("&")[0];
        }
        return urlInserida;
    }

    const playlistsRef = ref(database, "playlists");
    onValue(playlistsRef, (snapshot) => {
        listaContainer.innerHTML = "";
        const dadosFirebase = snapshot.val();

        if (!dadosFirebase) {
            listaContainer.innerHTML = '<p class="txt-ajuda">Nenhuma playlist cadastrada na nuvem do Firebase.</p>';
            return;
        }

        Object.keys(dadosFirebase).forEach((key) => {
            const dados = dadosFirebase[key];
            const iconeDisplay = dados.icone || "📹";

            const item = document.createElement("div");
            item.className = "item-playlist-admin";
            item.innerHTML = `
                <div>
                    <strong>${iconeDisplay} ${dados.titulo}</strong>
                    <p>${dados.descricao}</p>
                    <small>ID YouTube: ${dados.playlistId}</small>
                </div>
                <div class="botoes-acoes">
                    <button class="btn-edit btn-edit-playlist" data-id="${key}">✏️ Editar</button>
                    <button class="btn-delete btn-delete-playlist" data-id="${key}">❌ Remover</button>
                </div>
            `;
            listaContainer.appendChild(item);
        });

        document.querySelectorAll(".btn-edit-playlist").forEach(btn => {
            btn.addEventListener("click", () => carregarFormParaEdicao(btn.getAttribute("data-id")));
        });

        document.querySelectorAll(".btn-delete-playlist").forEach(btn => {
            btn.addEventListener("click", () => apagarPlaylist(btn.getAttribute("data-id")));
        });
    });

    formPlaylist.addEventListener("submit", (e) => {
        e.preventDefault();

        const idAtual = inputId.value;
        const itemPlaylist = {
            icone: inputIcone.value || "📹",
            titulo: inputTitulo.value.trim(),
            descricao: inputDesc.value.trim(),
            playlistId: filtrarIdPlaylist(inputUrl.value)
        };

        if (idAtual) {
            set(ref(database, "playlists/" + idAtual), itemPlaylist)
                .then(() => alert("🔄 Alterações guardadas na nuvem!"))
                .catch(err => alert("Erro ao atualizar: " + err.message));
        } else {
            push(ref(database, "playlists"), itemPlaylist)
                .then(() => alert("✨ Nova playlist inserida na nuvem!"))
                .catch(err => alert("Erro ao salvar: " + err.message));
        }

        limparFormulario();
    });

    function carregarFormParaEdicao(id) {
        get(ref(database, "playlists/" + id)).then((snapshot) => {
            const item = snapshot.val();
            if (item) {
                inputId.value = id;
                inputIcone.value = item.icone || "📹";
                inputTitulo.value = item.titulo;
                inputDesc.value = item.descricao;
                inputUrl.value = `https://www.youtube.com/playlist?list=${item.playlistId}`;
                document.getElementById("btn-salvar-playlist").textContent = "Substituir Dados";
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    function apagarPlaylist(id) {
        if (confirm("Tens a certeza que desejas remover esta playlist permanentemente da nuvem?")) {
            remove(ref(database, "playlists/" + id))
                .then(() => alert("🗑️ Playlist removida com sucesso!"))
                .catch(err => alert("Erro ao remover: " + err.message));
        }
    }

    function limparFormulario() {
        inputId.value = "";
        formPlaylist.reset();
        document.getElementById("btn-salvar-playlist").textContent = "Salvar Playlist";
    }

    btnLimpar.addEventListener("click", limparFormulario);
}

/* ==========================================================================
   GERENCIADOR DE NOTÍCIAS (CORRIGIDO E SUPORTANDO UPLOAD LOCAL DE IMAGEM)
   ========================================================================== */
function inicializarGerenciadorNoticias() {
    const formNoticia = document.getElementById("form-noticia");
    const inputId = document.getElementById("noticia-id");
    const inputTitulo = document.getElementById("noticia-titulo");
    const inputResumo = document.getElementById("noticia-resumo");
    const inputConteudo = document.getElementById("noticia-conteudo");
    const inputImagem = document.getElementById("noticia-imagem");
    const inputData = document.getElementById("noticia-data");
    const btnLimpar = document.getElementById("btn-limpar-form-noticia");
    const listaContainer = document.getElementById("lista-noticias-admin");

    // Novas referências visuais de preview para a imagem
    const previewContainer = document.getElementById("preview-imagem-admin");
    const imgPreview = document.getElementById("img-preview-noticia");

    // Função Auxiliar: Converte arquivo de imagem para string Base64 texto
    function arquivoParaBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    function formatarDataExibicao(dataISO) {
        if (!dataISO) return "";
        const [ano, mes, dia] = dataISO.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    const noticiasRef = ref(database, "noticias");
    onValue(noticiasRef, (snapshot) => {
        listaContainer.innerHTML = "";
        const dadosFirebase = snapshot.val();

        if (!dadosFirebase) {
            listaContainer.innerHTML = '<p class="txt-ajuda">Nenhuma notícia publicada na nuvem do Firebase.</p>';
            return;
        }

        Object.keys(dadosFirebase).forEach((key) => {
            const dados = dadosFirebase[key];

            const item = document.createElement("div");
            item.className = "item-playlist-admin";
            item.innerHTML = `
                <div>
                    <strong>📰 ${dados.titulo || ''}</strong>
                    <p>${dados.resumo || ''}</p>
                    <small>Publicado em: ${formatarDataExibicao(dados.data)}</small>
                </div>
                <div class="botoes-acoes">
                    <button class="btn-edit btn-edit-noticia" data-id="${key}">✏️ Editar</button>
                    <button class="btn-delete btn-delete-noticia" data-id="${key}">❌ Remover</button>
                </div>
            `;
            listaContainer.appendChild(item);
        });

        document.querySelectorAll(".btn-edit-noticia").forEach(btn => {
            btn.addEventListener("click", () => carregarNoticiaParaEdicao(btn.getAttribute("data-id")));
        });

        document.querySelectorAll(".btn-delete-noticia").forEach(btn => {
            btn.addEventListener("click", () => apagarNoticia(btn.getAttribute("data-id")));
        });
    });

    // Evento transformado em ASYNC para poder esperar o carregamento do arquivo
    formNoticia.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idAtual = inputId.value;

        let imagemString = "";

        // Verifica se o usuário escolheu algum arquivo
        if (inputImagem.files && inputImagem.files[0]) {
            imagemString = await arquivoParaBase64(inputImagem.files[0]);
        } else if (idAtual) {
            // Se está editando e não enviou arquivo novo, recupera a imagem que já estava lá
            const snapshot = await get(ref(database, "noticias/" + idAtual));
            const item = snapshot.val();
            if (item && item.imagem) {
                imagemString = item.imagem;
            }
        }

        const itemNoticia = {
            titulo: inputTitulo.value.trim(),
            resumo: inputResumo.value.trim(),
            conteudo: inputConteudo.value.trim(),
            imagem: imagemString,
            data: inputData.value
        };

        if (idAtual) {
            set(ref(database, "noticias/" + idAtual), itemNoticia)
                .then(() => alert("🔄 Notícia atualizada na nuvem!"))
                .catch(err => alert("Erro ao atualizar: " + err.message));
        } else {
            push(ref(database, "noticias"), itemNoticia)
                .then(() => alert("✨ Notícia publicada na nuvem!"))
                .catch(err => alert("Erro ao publicar: " + err.message));
        }

        limparFormularioNoticia();
    });

    function carregarNoticiaParaEdicao(id) {
        get(ref(database, "noticias/" + id)).then((snapshot) => {
            const item = snapshot.val();
            if (item) {
                inputId.value = id;
                inputTitulo.value = item.titulo || '';
                inputResumo.value = item.resumo || '';
                inputConteudo.value = item.conteudo || '';

                // Limpa o seletor de arquivos por segurança
                inputImagem.value = "";

                // Se houver uma imagem salva, exibe a miniatura no painel
                if (item.imagem) {
                    imgPreview.src = item.imagem;
                    previewContainer.style.display = "block";
                } else {
                    previewContainer.style.display = "none";
                }

                inputData.value = item.data || '';
                document.getElementById("btn-salvar-noticia").textContent = "Substituir Notícia";
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    function apagarNoticia(id) {
        if (confirm("Tens a certeza que desejas remover esta notícia permanentemente da nuvem?")) {
            remove(ref(database, "noticias/" + id))
                .then(() => alert("🗑️ Notícia removida com sucesso!"))
                .catch(err => alert("Erro ao remover: " + err.message));
        }
    }

    function limparFormularioNoticia() {
        inputId.value = "";
        formNoticia.reset();
        if (previewContainer) previewContainer.style.display = "none";
        document.getElementById("btn-salvar-noticia").textContent = "Publicar Notícia";
    }

    btnLimpar.addEventListener("click", limparFormularioNoticia);
}
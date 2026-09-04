import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, remove, get } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import {
    NOMES_PAPEL,
    PAPEIS_VALIDOS,
    autenticarUsuario,
    encerrarSessao,
    observarAutenticacao,
    obterPapel
} from "../script/admin-auth.js?v=2";

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
const gerenciadoresInicializados = new Set();

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    })[caractere]);
}

function mensagemFirebase(error, acao) {
    const codigo = error?.code || "";

    if (codigo === "PERMISSION_DENIED" || codigo === "permission-denied") {
        return `O Firebase recusou a permissão para ${acao}.`;
    }

    if (codigo === "NETWORK_ERROR" || codigo === "unavailable") {
        return `Não foi possível conectar ao Firebase para ${acao}.`;
    }

    return `Não foi possível ${acao}. Tente novamente.`;
}

observarAutenticacao(async (usuario) => {
    if (!usuario) {
        mostrarTelaLogin();
        return;
    }

    try {
        const papel = await obterPapel(usuario);
        if (PAPEIS_VALIDOS.has(papel)) {
            liberarPainel(papel);
        } else {
            await encerrarSessao();
            mostrarErroLogin("Esta conta não possui permissão para acessar o painel.");
        }
    } catch (error) {
        await encerrarSessao();
        mostrarErroLogin("Não foi possível validar a conta administrativa.");
        console.error("Erro ao validar papel administrativo:", error);
    }
});

btnToggleSenha?.addEventListener("click", () => {
    const estaOculta = inputSenha.type === "password";
    inputSenha.type = estaOculta ? "text" : "password";
    btnToggleSenha.textContent = estaOculta ? "🙈" : "👁️";
    btnToggleSenha.setAttribute("aria-label", estaOculta ? "Ocultar senha" : "Mostrar senha");
    inputSenha.focus();
});

formBloqueio?.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        await autenticarUsuario(inputUsuario.value, inputSenha.value);
        erroLogin.classList.remove("mostrar");
    } catch (error) {
        const mensagensErro = {
            "auth/invalid-credential": "E-mail ou senha incorretos.",
            "auth/user-not-found": "E-mail ou senha incorretos.",
            "auth/wrong-password": "E-mail ou senha incorretos.",
            "auth/missing-role": "Esta conta não possui um papel administrativo válido.",
            "auth/network-request-failed": "Não foi possível conectar ao Firebase. Tente novamente."
        };

        mostrarErroLogin(
            mensagensErro[error.code] ||
            (error.code === "PERMISSION_DENIED"
                ? "O Firebase recusou a leitura do papel desta conta."
                : "Não foi possível concluir o login. Tente novamente.")
        );
        console.error("Erro no login administrativo:", error);
    }
});

btnSair?.addEventListener("click", () => {
    encerrarSessao().catch((error) => {
        console.error("Erro ao encerrar sessão:", error);
    });
});

function mostrarTelaLogin() {
    telaBloqueio.style.display = "block";
    conteudoPainel.style.display = "none";
}

function mostrarErroLogin(mensagem = "E-mail ou senha incorretos.") {
    erroLogin.textContent = mensagem;
    erroLogin.classList.add("mostrar");
    inputSenha.value = "";
    inputSenha.focus();

    cardSenha.classList.remove("erro");
    void cardSenha.offsetWidth;
    cardSenha.classList.add("erro");
}

function aplicarPermissoes(papel) {
    document.querySelectorAll("[data-papel]").forEach((secao) => {
        const papeisPermitidos = secao.dataset.papel
            .split(",")
            .map((valor) => valor.trim());
        secao.style.display = papeisPermitidos.includes(papel) ? "" : "none";
    });
}

function liberarPainel(papel) {
    if (!PAPEIS_VALIDOS.has(papel)) {
        encerrarSessao();
        return;
    }

    telaBloqueio.style.display = "none";
    conteudoPainel.style.display = "block";

    aplicarPermissoes(papel);
    textoContaLogada.textContent = `Logado como: ${NOMES_PAPEL[papel] || papel}`;

    if (papel === "admin") {
        inicializarGerenciadorManutencao();
    }
    if (papel === "admin" || papel === "playlist") {
        inicializarGerenciadorPlaylists();
    }
    if (papel === "admin" || papel === "publicador") {
        inicializarGerenciadorNoticias();
    }
}

/* ==========================================================================
   CONFIGURAÇÃO DO MODO DE MANUTENÇÃO
   ========================================================================== */
function inicializarGerenciadorManutencao() {
    if (gerenciadoresInicializados.has("manutencao")) {
        return;
    }

    const toggleManutencao = document.getElementById("toggle-manutencao");
    const statusManutencao = document.getElementById("status-manutencao");
    const formManutencao = document.getElementById("form-manutencao");
    const feedbackManutencao = document.getElementById("feedback-manutencao");
    const btnSalvar = document.getElementById("btn-salvar-manutencao");

    if (!toggleManutencao || !statusManutencao || !formManutencao || !feedbackManutencao || !btnSalvar) {
        return;
    }

    gerenciadoresInicializados.add("manutencao");

    const manutencaoRef = ref(database, "configuracoes/manutencao");

    onValue(manutencaoRef, (snapshot) => {
        const configuracao = snapshot.val();
        const manutencaoAtiva = Boolean(configuracao?.ativo);

        toggleManutencao.checked = manutencaoAtiva;
        statusManutencao.textContent = manutencaoAtiva ? "ATIVADO" : "DESATIVADO";
        statusManutencao.classList.toggle("ativo", manutencaoAtiva);
    }, (error) => {
        statusManutencao.textContent = "INDISPONÍVEL";
        feedbackManutencao.textContent = "Não foi possível ler o status: " + error.message;
    });

    formManutencao.addEventListener("submit", (e) => {
        e.preventDefault();

        btnSalvar.disabled = true;
        feedbackManutencao.textContent = "Salvando configuração...";

        const novoEstado = {
            ativo: toggleManutencao.checked,
            atualizadoEm: new Date().toISOString()
        };

        set(manutencaoRef, novoEstado)
            .then(() => {
                feedbackManutencao.textContent = toggleManutencao.checked
                    ? "Modo de manutenção ativado para visitantes."
                    : "Modo de manutenção desativado.";
            })
            .catch(err => {
                feedbackManutencao.textContent = mensagemFirebase(err, "salvar a manutenção");
            })
            .finally(() => {
                btnSalvar.disabled = false;
            });
    });
}

/* ==========================================================================
   SISTEMA DE PLAYLISTS
   ========================================================================== */
function inicializarGerenciadorPlaylists() {
    if (gerenciadoresInicializados.has("playlists")) {
        return;
    }

    const formPlaylist = document.getElementById("form-playlist");
    const inputId = document.getElementById("playlist-id");
    const inputIcone = document.getElementById("playlist-icone");
    const inputTitulo = document.getElementById("playlist-titulo");
    const inputDesc = document.getElementById("playlist-desc");
    const inputUrl = document.getElementById("playlist-url");
    const btnLimpar = document.getElementById("btn-limpar-form");
    const listaContainer = document.getElementById("lista-playlists-admin");

    if (!formPlaylist || !inputId || !inputIcone || !inputTitulo || !inputDesc || !inputUrl || !btnLimpar || !listaContainer) {
        return;
    }

    gerenciadoresInicializados.add("playlists");

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
                    <strong>${escaparHtml(iconeDisplay)} ${escaparHtml(dados.titulo)}</strong>
                    <p>${escaparHtml(dados.descricao)}</p>
                    <small>ID YouTube: ${escaparHtml(dados.playlistId)}</small>
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
    }, (error) => {
        listaContainer.innerHTML = `<p class="txt-ajuda">Não foi possível carregar as playlists: ${error.message}</p>`;
    });

    formPlaylist.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idAtual = inputId.value;
        const itemPlaylist = {
            icone: inputIcone.value || "📹",
            titulo: inputTitulo.value.trim(),
            descricao: inputDesc.value.trim(),
            playlistId: filtrarIdPlaylist(inputUrl.value)
        };

        try {
            if (idAtual) {
                await set(ref(database, "playlists/" + idAtual), itemPlaylist);
                alert("🔄 Alterações guardadas na nuvem!");
            } else {
                await push(ref(database, "playlists"), itemPlaylist);
                alert("✨ Nova playlist inserida na nuvem!");
            }

            limparFormulario();
        } catch (error) {
            alert(mensagemFirebase(error, "salvar o vídeo"));
        }
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
                document.getElementById("btn-salvar-playlist").textContent = "Atualizar Vídeo";
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    function apagarPlaylist(id) {
        if (confirm("Tens a certeza que desejas remover esta playlist permanentemente da nuvem?")) {
            remove(ref(database, "playlists/" + id))
                .then(() => alert("🗑️ Playlist removida com sucesso!"))
                .catch(err => alert(mensagemFirebase(err, "remover o vídeo")));
        }
    }

    function limparFormulario() {
        inputId.value = "";
        formPlaylist.reset();
        document.getElementById("btn-salvar-playlist").textContent = "Salvar Vídeo";
    }

    btnLimpar.addEventListener("click", limparFormulario);
}

/* ==========================================================================
   GERENCIADOR DE NOTÍCIAS (CORRIGIDO E SUPORTANDO UPLOAD LOCAL DE IMAGEM)
   ========================================================================== */
function inicializarGerenciadorNoticias() {
    if (gerenciadoresInicializados.has("noticias")) {
        return;
    }

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

    if (!formNoticia || !inputId || !inputTitulo || !inputResumo || !inputConteudo || !inputImagem || !inputData || !btnLimpar || !listaContainer) {
        return;
    }

    gerenciadoresInicializados.add("noticias");

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
                    <strong>📰 ${escaparHtml(dados.titulo)}</strong>
                    <p>${escaparHtml(dados.resumo)}</p>
                    <small>Publicado em: ${escaparHtml(formatarDataExibicao(dados.data))}</small>
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
    }, (error) => {
        listaContainer.innerHTML = `<p class="txt-ajuda">Não foi possível carregar as notícias: ${error.message}</p>`;
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

        try {
            if (idAtual) {
                await set(ref(database, "noticias/" + idAtual), itemNoticia);
                alert("🔄 Notícia atualizada na nuvem!");
            } else {
                await push(ref(database, "noticias"), itemNoticia);
                alert("✨ Notícia publicada na nuvem!");
            }

            limparFormularioNoticia();
        } catch (error) {
            alert(mensagemFirebase(error, "salvar a notícia"));
        }
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
                .catch(err => alert(mensagemFirebase(err, "remover a notícia")));
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

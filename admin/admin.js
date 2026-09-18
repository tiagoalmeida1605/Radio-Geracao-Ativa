import { ref, onValue, set, push, remove, get } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import {
    auth,
    database,
    firebaseApp,
    NOMES_PAPEL,
    PAPEIS_VALIDOS,
    autenticarUsuario,
    encerrarSessao,
    observarAutenticacao,
    obterPerfil
} from "../script/admin-auth.js?v=4";
import { ICON_DEFAULT, ICON_MAP, resolveIcon, renderIconMarkup } from "../script/icon-catalog.js";

const telaBloqueio = document.getElementById("bloqueio-tela");
if (!telaBloqueio) {
    console.error("[RGA Admin] Elemento #bloqueio-tela não encontrado");
}

const conteudoPainel = document.getElementById("conteudo-painel");
if (!conteudoPainel) {
    console.error("[RGA Admin] Elemento #conteudo-painel não encontrado");
}

const formBloqueio = document.getElementById("form-bloqueio-rga");
if (!formBloqueio) {
    console.error("[RGA Admin] Elemento #form-bloqueio-rga não encontrado");
}

const cardSenha = document.getElementById("cardSenha");
if (!cardSenha) {
    console.error("[RGA Admin] Elemento #cardSenha não encontrado");
}

const inputUsuario = document.getElementById("input-usuario-rga");
if (!inputUsuario) {
    console.error("[RGA Admin] Elemento #input-usuario-rga não encontrado");
}

const inputSenha = document.getElementById("input-senha-rga");
if (!inputSenha) {
    console.error("[RGA Admin] Elemento #input-senha-rga não encontrado");
}

const erroLogin = document.getElementById("erroLogin");
if (!erroLogin) {
    console.error("[RGA Admin] Elemento #erroLogin não encontrado");
}

const btnToggleSenha = document.getElementById("btnToggleSenha");
if (!btnToggleSenha) {
    console.error("[RGA Admin] Elemento #btnToggleSenha não encontrado");
}

const textoContaLogada = document.getElementById("textoContaLogada");
if (!textoContaLogada) {
    console.error("[RGA Admin] Elemento #textoContaLogada não encontrado");
}

const btnSair = document.getElementById("btnSair");
if (!btnSair) {
    console.error("[RGA Admin] Elemento #btnSair não encontrado");
}
const gerenciadoresInicializados = new Set();
const PLAYLIST_ICON_CATALOG = [
    { name: "video", label: "Vídeo", category: "Áudio", tags: ["video", "filme", "camera"] },
    { name: "radio", label: "Rádio", category: "Áudio", tags: ["radio", "broadcast", "wave"] },
    { name: "mic", label: "Microfone", category: "Áudio", tags: ["microfone", "mic", "podcast"] },
    { name: "headphones", label: "Fones", category: "Áudio", tags: ["fones", "audio", "ouvido"] },
    { name: "speaker", label: "Alto-falante", category: "Áudio", tags: ["altofalante", "audio", "som"] },
    { name: "volume2", label: "Volume", category: "Áudio", tags: ["volume", "som", "audio"] },
    { name: "music", label: "Música", category: "Música", tags: ["musica", "nota", "melodia"] },
    { name: "album", label: "Álbum", category: "Música", tags: ["album", "disco", "playlist"] },
    { name: "disc3", label: "Disco", category: "Música", tags: ["disco", "vinil", "musica"] },
    { name: "guitar", label: "Guitarra", category: "Música", tags: ["guitarra", "instrumento", "rock"] },
    { name: "drum", label: "Bateria", category: "Música", tags: ["bateria", "instrumento", "ritmo"] },
    { name: "music4", label: "Notas", category: "Música", tags: ["notas", "musica", "melodia"] },
    { name: "newspaper", label: "Jornal", category: "Conteúdo", tags: ["jornal", "noticia", "artigo"] },
    { name: "file-text", label: "Arquivo", category: "Conteúdo", tags: ["arquivo", "documento", "texto"] },
    { name: "info", label: "Informação", category: "Conteúdo", tags: ["info", "informacao", "dica"] },
    { name: "star", label: "Estrela", category: "Conteúdo", tags: ["estrela", "destaque", "favorito"] },
    { name: "sparkles", label: "Sparkles", category: "Conteúdo", tags: ["sparkles", "brilho", "destaque"] },
    { name: "megaphone", label: "Megafone", category: "Conteúdo", tags: ["megafone", "anuncio", "comunicacao"] },
    { name: "bookmark", label: "Marca", category: "Conteúdo", tags: ["bookmark", "marcador", "salvar"] },
    { name: "user", label: "Usuário", category: "Pessoas", tags: ["usuario", "pessoa", "perfil"] },
    { name: "users", label: "Equipe", category: "Pessoas", tags: ["equipe", "grupo", "usuarios"] },
    { name: "briefcase-business", label: "Apresentador", category: "Pessoas", tags: ["apresentador", "trabalho", "perfil"] },
    { name: "message-square", label: "Mensagem", category: "Comunicação", tags: ["mensagem", "chat", "comunicacao"] },
    { name: "phone", label: "Telefone", category: "Comunicação", tags: ["telefone", "ligacao", "contato"] },
    { name: "mail", label: "E-mail", category: "Comunicação", tags: ["email", "mail", "mensagem"] },
    { name: "send", label: "Enviar", category: "Comunicação", tags: ["enviar", "share", "compartilhar"] },
    { name: "share-2", label: "Compartilhar", category: "Comunicação", tags: ["compartilhar", "share", "social"] },
    { name: "calendar", label: "Calendário", category: "Programação", tags: ["calendario", "agenda", "evento"] },
    { name: "clock3", label: "Relógio", category: "Programação", tags: ["relogio", "hora", "tempo"] },
    { name: "timer-reset", label: "Timer", category: "Programação", tags: ["timer", "tempo", "programacao"] },
    { name: "sun", label: "Sol", category: "Programação", tags: ["sol", "dia", "amanhecer"] },
    { name: "moon", label: "Lua", category: "Programação", tags: ["lua", "noite", "noturno"] },
    { name: "monitor", label: "Monitor", category: "Tecnologia", tags: ["monitor", "desktop", "tela"] },
    { name: "laptop", label: "Laptop", category: "Tecnologia", tags: ["laptop", "notebook", "pc"] },
    { name: "smartphone", label: "Smartphone", category: "Tecnologia", tags: ["smartphone", "celular", "mobile"] },
    { name: "code2", label: "Código", category: "Tecnologia", tags: ["codigo", "programacao", "dev"] },
    { name: "globe", label: "Globo", category: "Tecnologia", tags: ["globo", "mundo", "web"] },
    { name: "wifi", label: "Wi-Fi", category: "Tecnologia", tags: ["wifi", "internet", "conexao"] },
    { name: "cloud", label: "Nuvem", category: "Tecnologia", tags: ["nuvem", "cloud", "storage"] },
    { name: "server", label: "Servidor", category: "Tecnologia", tags: ["servidor", "dados", "infra"] },
    { name: "database", label: "Banco de dados", category: "Tecnologia", tags: ["dados", "database", "storage"] },
    { name: "link", label: "Link", category: "Tecnologia", tags: ["link", "referencia", "url"] },
    { name: "church", label: "Igreja", category: "Espiritualidade", tags: ["igreja", "church", "templo"] },
    { name: "cross", label: "Cruz", category: "Espiritualidade", tags: ["cruz", "religiao", "santo"] },
    { name: "book-open", label: "Livro", category: "Espiritualidade", tags: ["livro", "bible", "estudo"] },
    { name: "heart", label: "Coração", category: "Social", tags: ["coracao", "amor", "social"] },
    { name: "thumbs-up", label: "Curtida", category: "Social", tags: ["curtida", "like", "aprovacao"] },
    { name: "home", label: "Casa", category: "Objetos", tags: ["casa", "inicio", "home"] },
    { name: "camera", label: "Câmera", category: "Objetos", tags: ["camera", "foto", "imagens"] },
    { name: "image", label: "Imagem", category: "Objetos", tags: ["imagem", "foto", "visual"] },
    { name: "folder", label: "Pasta", category: "Objetos", tags: ["pasta", "arquivo", "organizar"] },
    { name: "gift", label: "Presente", category: "Objetos", tags: ["presente", "gift", "promo"] },
    { name: "flag", label: "Bandeira", category: "Objetos", tags: ["bandeira", "destino", "marca"] },
    { name: "sunrise", label: "Nascer do sol", category: "Natureza", tags: ["sol", "nascer", "natureza"] },
    { name: "sunset", label: "Pôr do sol", category: "Natureza", tags: ["sol", "por", "natureza"] },
    { name: "leaf", label: "Folha", category: "Natureza", tags: ["folha", "natureza", "verde"] },
    { name: "flower2", label: "Flor", category: "Natureza", tags: ["flor", "natureza", "beleza"] },
    { name: "tree-palm", label: "Árvore", category: "Natureza", tags: ["arvore", "floresta", "natureza"] },
    { name: "settings", label: "Configurações", category: "Sistema", tags: ["configuracoes", "settings", "ajustes"] },
    { name: "check", label: "Check", category: "Sistema", tags: ["check", "confirmado", "ok"] },
    { name: "badge-check", label: "Verificado", category: "Sistema", tags: ["verificado", "check", "confirmado"] },
    { name: "alert-circle", label: "Alerta", category: "Sistema", tags: ["alerta", "aviso", "importante"] },
    { name: "bell", label: "Sino", category: "Sistema", tags: ["sino", "alerta", "notificacao"] },
    { name: "lock", label: "Cadeado", category: "Sistema", tags: ["cadeado", "seguranca", "privado"] },
    { name: "eye", label: "Olho", category: "Sistema", tags: ["olho", "visualizar", "preview"] },
    { name: "filter", label: "Filtro", category: "Sistema", tags: ["filtro", "buscar", "ordenar"] },
    { name: "search", label: "Busca", category: "Sistema", tags: ["busca", "search", "pesquisa"] },
    { name: "plus", label: "Adicionar", category: "Sistema", tags: ["adicionar", "novo", "plus"] },
    { name: "play", label: "Play", category: "Áudio", tags: ["play", "reproducao", "assistir"] },
    { name: "podcast", label: "Podcast", category: "Áudio", tags: ["podcast", "audio", "programa"] },
    { name: "waves", label: "Ondas", category: "Áudio", tags: ["ondas", "audio", "som"] },
    { name: "gamepad2", label: "Gamepad", category: "Entretenimento", tags: ["gamepad", "jogo", "esporte"] },
    { name: "trophy", label: "Troféu", category: "Entretenimento", tags: ["trofeu", "campeonato", "premio"] },
    { name: "football", label: "Futebol", category: "Entretenimento", tags: ["futebol", "esporte", "campeonato"] },
    { name: "sparkle", label: "Brilho", category: "Conteúdo", tags: ["brilho", "destaque", "especial"] }
];
const PLAYLIST_ICON_MAP = Object.fromEntries(PLAYLIST_ICON_CATALOG.map((item) => [item.name, item]));
const PLAYLIST_EMOJI_MAP = {
    "📹": "video",
    "📻": "radio",
    "🎙️": "mic",
    "🎧": "headphones",
    "🎤": "mic",
    "🎬": "video",
    "📰": "newspaper",
    "⚽": "football",
    "🏆": "trophy",
    "🎮": "gamepad2",
    "🎶": "music",
    "🧠": "brain",
    "🔥": "sparkles",
    "😂": "laugh",
    "🔔": "bell",
    "📚": "book-open",
    "🌤️": "sun",
    "🏠": "home",
    "📷": "camera",
    "📡": "radio",
    "💡": "sparkles",
    "🎵": "music"
};

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    })[caractere]);
}

function obterEntradaIcone(icone) {
    if (!icone) return PLAYLIST_ICON_DEFAULT;
    if (PLAYLIST_ICON_MAP[icone]) return icone;
    const valorNormalizado = String(icone).trim().replace(/\uFE0F/g, "");
    return PLAYLIST_EMOJI_MAP[valorNormalizado] || PLAYLIST_ICON_DEFAULT;
}

function renderizarMarkupIcone(icone) {
    const nome = obterEntradaIcone(icone);
    const item = PLAYLIST_ICON_MAP[nome] || PLAYLIST_ICON_MAP[PLAYLIST_ICON_DEFAULT];
    return `<svg data-lucide="${escaparHtml(nome)}" class="lucide-icon" aria-hidden="true"></svg><span class="sr-only">${escaparHtml(item.label)}</span>`;
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

function diagnosticarOperacao(caminho) {
    console.debug("Operação Firebase", {
        caminho,
        uid: auth.currentUser?.uid || null,
        projeto: firebaseApp.options.projectId,
        autenticado: Boolean(auth.currentUser)
    });
}

observarAutenticacao(async (usuario) => {
    console.debug("[RGA Admin] Estado de autenticação mudou:", usuario ? usuario.uid : "null");

    if (!usuario) {
        console.debug("[RGA Admin] Usuário deslogado, mostrando tela de login");
        mostrarTelaLogin();
        return;
    }

    try {
        console.debug("[RGA Admin] Obtendo perfil do usuário:", usuario.uid);
        const perfil = await obterPerfil(usuario);
        console.debug("[RGA Admin] Perfil obtido:", perfil);

        if (perfil && PAPEIS_VALIDOS.has(perfil.papel)) {
            console.debug("[RGA Admin] Perfil válido, liberando painel para papel:", perfil.papel);
            liberarPainel(perfil.papel, perfil.nome);
        } else {
            console.debug("[RGA Admin] Perfil inválido ou papel não autorizado");
            await encerrarSessao();
            mostrarErroLogin("Esta conta não possui permissão para acessar o painel.");
        }
    } catch (error) {
        console.error("[RGA Admin] Erro ao validar papel administrativo:", error);
        await encerrarSessao();
        mostrarErroLogin("Não foi possível validar a conta administrativa.");
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
    console.debug("[RGA Admin] Formulário de login submetido");
    e.preventDefault();

    if (!inputUsuario || !inputSenha) {
        console.error("[RGA Admin] Elementos de input não encontrados");
        mostrarErroLogin("Erro interno de configuração. Contate o administrador.");
        return;
    }

    const email = inputUsuario.value.trim();
    const senha = inputSenha.value;

    console.debug("[RGA Admin] Tentando autenticar usuário:", email);

    try {
        await autenticarUsuario(email, senha);
        console.debug("[RGA Admin] Autenticação bem-sucedida");
        erroLogin.classList.remove("mostrar");
    } catch (error) {
        console.warn("[RGA Admin] Falha na autenticação:", error);
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
    if (telaBloqueio) {
        telaBloqueio.style.display = "block";
    }
    if (conteudoPainel) {
        conteudoPainel.style.display = "none";
    }
}

function mostrarErroLogin(mensagem = "E-mail ou senha incorretos.") {
    if (erroLogin) {
        erroLogin.textContent = mensagem;
        erroLogin.classList.add("mostrar");
    }
    if (inputSenha) {
        inputSenha.value = "";
        inputSenha.focus();
    }

    if (cardSenha) {
        cardSenha.classList.remove("erro");
        // Trigger reflow for animation
        void cardSenha.offsetWidth;
        cardSenha.classList.add("erro");
    }
}

function aplicarPermissoes(papel) {
    document.querySelectorAll("[data-papel]").forEach((secao) => {
        const papeisPermitidos = secao.dataset.papel
            .split(",")
            .map((valor) => valor.trim());
        secao.style.display = papeisPermitidos.includes(papel) ? "" : "none";
    });
}

function liberarPainel(papel, nome = NOMES_PAPEL[papel]) {
    if (!PAPEIS_VALIDOS.has(papel)) {
        encerrarSessao();
        return;
    }

    if (telaBloqueio) {
        telaBloqueio.style.display = "none";
    }
    if (conteudoPainel) {
        conteudoPainel.style.display = "block";
    }

    aplicarPermissoes(papel);
    if (textoContaLogada) {
        textoContaLogada.textContent = `Olá, ${nome || NOMES_PAPEL[papel] || "usuário autorizado"}`;
    }

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

function inicializarSeletorIcones() {
    const inputIcone = document.getElementById("playlist-icone");
    const picker = document.getElementById("playlist-icon-picker");
    const pickerButton = document.getElementById("playlist-icone-selected");
    const preview = document.getElementById("playlist-icone-preview");
    const label = document.getElementById("playlist-icone-label");
    const busca = document.getElementById("playlist-icone-busca");
    const filtros = document.getElementById("playlist-icon-filtros");
    const grid = document.getElementById("playlist-icon-grid");

    if (!inputIcone || !picker || !pickerButton || !preview || !label || !busca || !filtros || !grid) {
        return;
    }

    const categorias = ["Todos", ...new Set(PLAYLIST_ICON_CATALOG.map((item) => item.category))];
    let categoriaAtiva = "Todos";

    function atualizarVisualizacao(valor) {
        const nome = obterEntradaIcone(valor);
        const item = PLAYLIST_ICON_MAP[nome] || PLAYLIST_ICON_MAP[PLAYLIST_ICON_DEFAULT];
        inputIcone.value = nome;
        preview.innerHTML = renderizarMarkupIcone(nome);
        label.textContent = item.label;
        pickerButton.setAttribute("aria-label", `Ícone selecionado: ${item.label}`);

        const itens = grid.querySelectorAll(".icon-picker-item");
        itens.forEach((botao) => {
            const estaSelecionado = botao.dataset.iconName === nome;
            botao.classList.toggle("selected", estaSelecionado);
            botao.setAttribute("aria-selected", String(estaSelecionado));
        });

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function renderizarFiltros() {
        filtros.innerHTML = categorias.map((categoria) => `
            <button type="button" class="icon-picker-filter ${categoria === categoriaAtiva ? "active" : ""}" data-filter="${escaparHtml(categoria)}">
                ${escaparHtml(categoria)}
            </button>
        `).join("");

        filtros.querySelectorAll(".icon-picker-filter").forEach((botao) => {
            botao.addEventListener("click", () => {
                categoriaAtiva = botao.dataset.filter;
                renderizarFiltros();
                renderizarGrid();
            });
        });
    }

    function renderizarGrid() {
        const termoBusca = busca.value.trim().toLowerCase();
        const itens = PLAYLIST_ICON_CATALOG.filter((item) => {
            const categoriaOk = categoriaAtiva === "Todos" || item.category === categoriaAtiva;
            const textoBusca = `${item.label} ${item.tags.join(" ")}`.toLowerCase();
            return categoriaOk && (!termoBusca || textoBusca.includes(termoBusca));
        });

        if (itens.length === 0) {
            grid.innerHTML = '<p class="icon-picker-empty">Nenhum ícone encontrado para essa busca.</p>';
            return;
        }

        grid.innerHTML = itens.map((item) => `
            <button
                type="button"
                class="icon-picker-item ${obterEntradaIcone(inputIcone.value) === item.name ? "selected" : ""}"
                data-icon-name="${escaparHtml(item.name)}"
                aria-label="Selecionar ícone ${escaparHtml(item.label)}"
                aria-selected="${obterEntradaIcone(inputIcone.value) === item.name}"
                title="${escaparHtml(item.label)}"
            >
                <svg data-lucide="${escaparHtml(item.name)}" class="lucide-icon" aria-hidden="true"></svg>
                <span class="icon-picker-item-name">${escaparHtml(item.label)}</span>
            </button>
        `).join("");

        grid.querySelectorAll(".icon-picker-item").forEach((botao) => {
            botao.addEventListener("click", () => {
                atualizarVisualizacao(botao.dataset.iconName);
            });
        });

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    busca.addEventListener("input", renderizarGrid);
    pickerButton.addEventListener("click", () => {
        picker.classList.toggle("is-open");
        pickerButton.setAttribute("aria-expanded", String(picker.classList.contains("is-open")));
    });

    pickerButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            pickerButton.click();
        }
    });

    renderizarFiltros();
    renderizarGrid();
    atualizarVisualizacao(inputIcone.value || PLAYLIST_ICON_DEFAULT);
    window.RGAPlaylistIconPicker = { atualizarVisualizacao };
}

/* ==========================================================================
   INICIALIZAR SELETOR DE ÍCONES PARA NOTÍCIAS
   ========================================================================== */
function inicializarSeletorIconesNoticias() {
    const inputIcone = document.getElementById("noticia-icone");
    const picker = document.getElementById("noticia-icon-picker");
    const pickerButton = document.getElementById("noticia-icone-selected");
    const preview = document.getElementById("noticia-icone-preview");
    const label = document.getElementById("noticia-icone-label");
    const busca = document.getElementById("noticia-icone-busca");
    const filtros = document.getElementById("noticia-icon-filtros");
    const grid = document.getElementById("noticia-icon-grid");

    if (!inputIcone || !picker || !pickerButton || !preview || !label || !busca || !filtros || !grid) {
        return;
    }

    const categorias = ["Todos", ...new Set(PLAYLIST_ICON_CATALOG.map((item) => item.category))];
    let categoriaAtiva = "Todos";

    function atualizarVisualizacao(valor) {
        const nome = obterEntradaIcone(valor);
        const item = PLAYLIST_ICON_MAP[nome] || PLAYLIST_ICON_MAP[PLAYLIST_ICON_DEFAULT];
        inputIcone.value = nome;
        preview.innerHTML = renderizarMarkupIcone(nome);
        label.textContent = item.label;
        pickerButton.setAttribute("aria-label", `Ícone selecionado: ${item.label}`);

        const itens = grid.querySelectorAll(".icon-picker-item");
        itens.forEach((botao) => {
            const estaSelecionado = botao.dataset.iconName === nome;
            botao.classList.toggle("selected", estaSelecionado);
            botao.setAttribute("aria-selected", String(estaSelecionado));
        });

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function renderizarFiltros() {
        filtros.innerHTML = categorias.map((categoria) => `
            <button type="button" class="icon-picker-filter ${categoria === categoriaAtiva ? "active" : ""}" data-filter="${escaparHtml(categoria)}">
                ${escaparHtml(categoria)}
            </button>
        `).join("");

        filtros.querySelectorAll(".icon-picker-filter").forEach((botao) => {
            botao.addEventListener("click", () => {
                categoriaAtiva = botao.dataset.filter;
                renderizarFiltros();
                renderizarGrid();
            });
        });
    }

    function renderizarGrid() {
        const termoBusca = busca.value.trim().toLowerCase();
        const itens = PLAYLIST_ICON_CATALOG.filter((item) => {
            const categoriaOk = categoriaAtiva === "Todos" || item.category === categoriaAtiva;
            const textoBusca = `${item.label} ${item.tags.join(" ")}`.toLowerCase();
            return categoriaOk && (!termoBusca || textoBusca.includes(termoBusca));
        });

        if (itens.length === 0) {
            grid.innerHTML = '<p class="icon-picker-empty">Nenhum ícone encontrado para essa busca.</p>';
            return;
        }

        grid.innerHTML = itens.map((item) => `
            <button
                type="button"
                class="icon-picker-item ${obterEntradaIcone(inputIcone.value) === item.name ? "selected" : ""}"
                data-icon-name="${escaparHtml(item.name)}"
                aria-label="Selecionar ícone ${escaparHtml(item.label)}"
                aria-selected="${obterEntradaIcone(inputIcone.value) === item.name}"
                title="${escaparHtml(item.label)}"
            >
                <svg data-lucide="${escaparHtml(item.name)}" class="lucide-icon" aria-hidden="true"></svg>
                <span class="icon-picker-item-name">${escaparHtml(item.label)}</span>
            </button>
        `).join("");

        grid.querySelectorAll(".icon-picker-item").forEach((botao) => {
            botao.addEventListener("click", () => {
                atualizarVisualizacao(botao.dataset.iconName);
            });
        });

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    busca.addEventListener("input", renderizarGrid);
    pickerButton.addEventListener("click", () => {
        picker.classList.toggle("is-open");
        pickerButton.setAttribute("aria-expanded", String(picker.classList.contains("is-open")));
    });

    pickerButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            pickerButton.click();
        }
    });

    renderizarFiltros();
    renderizarGrid();
    atualizarVisualizacao(inputIcone.value || PLAYLIST_ICON_DEFAULT);
    window.RGANoticiaIconPicker = { atualizarVisualizacao };
}

/* ==========================================================================
   CONFIGURAÇÃO DO MODO DE MANUTENÇÃO
   ========================================================================== */

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

        diagnosticarOperacao("configuracoes/manutencao");

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

    inicializarSeletorIcones();

    const formPlaylist = document.getElementById("form-playlist");    const inputId = document.getElementById("playlist-id");
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

    function extrairMidiaYouTube(valor) {
        const entrada = valor.trim();
        let url;

        // O Admin antigo aceitava o ID puro de uma playlist (ex.: PL...).
        // Mantemos esse atalho e só analisamos como URL quando houver um domínio/caminho.
        if (!/[./]/.test(entrada) && !entrada.includes("://")) {
            return { tipo: "playlist", playlistId: entrada };
        }

        try {
            url = new URL(entrada.includes("://") ? entrada : `https://${entrada}`);
        } catch {
            // IDs legados sem URL continuam sendo playlists, como no fluxo anterior.
            return { tipo: "playlist", playlistId: entrada };
        }

        const playlistId = url.searchParams.get("list");
        if (playlistId) return { tipo: "playlist", playlistId };

        const host = url.hostname.replace(/^www\./, "");
        let videoId = "";
        if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] || "";
        if (host.endsWith("youtube.com")) {
            videoId = url.searchParams.get("v") ||
                url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] || "";
        }

        if (videoId) return { tipo: "video", videoId };
        throw new Error("Informe um link válido de playlist ou vídeo do YouTube.");
    }

    const playlistsRef = ref(database, "playlists");
    onValue(playlistsRef, (snapshot) => {
        listaContainer.innerHTML = "";
        const dadosFirebase = snapshot.val();

        // Handle case where data is not an object (null, primitive, or array)
        if (!dadosFirebase || typeof dadosFirebase !== 'object' || Array.isArray(dadosFirebase)) {
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
                    <strong>
                        <span class="icon-inline">${renderizarMarkupIcone(iconeDisplay)}</span>
                        ${escaparHtml(dados.titulo)}
                    </strong>
                    <p>${escaparHtml(dados.descricao)}</p>
                    <small>${dados.tipo === "video" ? "Vídeo" : "Playlist"}: ${escaparHtml(dados.tipo === "video" ? dados.videoId : dados.playlistId)}</small>
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
        let midia;
        try {
            midia = extrairMidiaYouTube(inputUrl.value);
        } catch (error) {
            alert(error.message);
            inputUrl.focus();
            return;
        }

        const itemPlaylist = {
            icone: inputIcone.value || PLAYLIST_ICON_DEFAULT,
            titulo: inputTitulo.value.trim(),
            descricao: inputDesc.value.trim(),
            ...midia
        };

        try {
            if (idAtual) {
                diagnosticarOperacao(`playlists/${idAtual}`);
                await set(ref(database, "playlists/" + idAtual), itemPlaylist);
                alert("🔄 Alterações guardadas na nuvem!");
            } else {
                diagnosticarOperacao("playlists");
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
                inputIcone.value = obterEntradaIcone(item.icone || PLAYLIST_ICON_DEFAULT);
                if (window.RGAPlaylistIconPicker && typeof window.RGAPlaylistIconPicker.atualizarVisualizacao === "function") {
                    window.RGAPlaylistIconPicker.atualizarVisualizacao(inputIcone.value);
                }
                inputTitulo.value = item.titulo;
                inputDesc.value = item.descricao;
                inputUrl.value = item.tipo === "video"
                    ? `https://www.youtube.com/watch?v=${item.videoId || ""}`
                    : `https://www.youtube.com/playlist?list=${item.playlistId || ""}`;
                document.getElementById("btn-salvar-playlist").textContent = "Atualizar conteúdo";
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    function apagarPlaylist(id) {
        if (confirm("Tens a certeza que desejas remover esta playlist permanentemente da nuvem?")) {
            diagnosticarOperacao(`playlists/${id}`);
            remove(ref(database, "playlists/" + id))
                .then(() => alert("🗑️ Playlist removida com sucesso!"))
                .catch(err => alert(mensagemFirebase(err, "remover o vídeo")));
        }
    }

    function limparFormulario() {
        inputId.value = "";
        formPlaylist.reset();
        inputIcone.value = PLAYLIST_ICON_DEFAULT;
        if (window.RGAPlaylistIconPicker && typeof window.RGAPlaylistIconPicker.atualizarVisualizacao === "function") {
            window.RGAPlaylistIconPicker.atualizarVisualizacao(PLAYLIST_ICON_DEFAULT);
        }
        document.getElementById("btn-salvar-playlist").textContent = "Salvar conteúdo";
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

    inicializarSeletorIconesNoticias();

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

        // Handle case where data is not an object (null, primitive, or array)
        if (!dadosFirebase || typeof dadosFirebase !== 'object' || Array.isArray(dadosFirebase)) {
            listaContainer.innerHTML = '<p class="txt-ajuda">Nenhuma notícia publicada na nuvem do Firebase.</p>';
            return;
        }

        Object.keys(dadosFirebase).forEach((key) => {
            const dados = dadosFirebase[key];

            const item = document.createElement("div");
            item.className = "item-playlist-admin";
            item.innerHTML = `
                <div>
                    <strong>
                        <span class="tag">
                            ${renderizarMarkupIcone(dados.icone || "newspaper")}
                            <span class="tag-label">${PLAYLIST_ICON_MAP[resolveIcon(dados.icone || "newspaper")]?.label || "Notícia"}</span>
                        </span>
                        ${escaparHtml(dados.titulo)}
                    </strong>
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
            icone: inputIcone.value || "newspaper",
            data: inputData.value
        };

        try {
            if (idAtual) {
                diagnosticarOperacao(`noticias/${idAtual}`);
                await set(ref(database, "noticias/" + idAtual), itemNoticia);
                alert("🔄 Notícia atualizada na nuvem!");
            } else {
                diagnosticarOperacao("noticias");
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
                inputIcone.value = obterEntradaIcone(item.icone || "newspaper");
                if (window.RGANoticiaIconPicker && typeof window.RGANoticiaIconPicker.atualizarVisualizacao === "function") {
                    window.RGANoticiaIconPicker.atualizarVisualizacao(inputIcone.value);
                }

                // Limpa o seletor de arquivos por segurança
                inputImagem.value = "";

                // Se houver uma imagem salva, exibe a miniatura no painel
                if (item.imagem) {
                    imgPreview.src = item.imagem;
                    previewContainer.hidden = false;
                } else {
                    previewContainer.hidden = true;
                }

                inputData.value = item.data || '';
                document.getElementById("btn-salvar-noticia").textContent = "Substituir Notícia";
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    function apagarNoticia(id) {
        if (confirm("Tens a certeza que desejas remover esta notícia permanentemente da nuvem?")) {
            diagnosticarOperacao(`noticias/${id}`);
            remove(ref(database, "noticias/" + id))
                .then(() => alert("🗑️ Notícia removida com sucesso!"))
                .catch(err => alert(mensagemFirebase(err, "remover a notícia")));
        }
    }

    function limparFormularioNoticia() {
        inputId.value = "";
        formNoticia.reset();
        inputIcone.value = "newspaper";
        if (window.RGANoticiaIconPicker && typeof window.RGANoticiaIconPicker.atualizarVisualizacao === "function") {
            window.RGANoticiaIconPicker.atualizarVisualizacao("newspaper");
        }
        if (previewContainer) previewContainer.hidden = true;
        document.getElementById("btn-salvar-noticia").textContent = "Publicar Notícia";
    }

    btnLimpar.addEventListener("click", limparFormularioNoticia);
}

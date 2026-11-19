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
} from "../script/admin-auth.js";
import {
    ICON_CATALOG,
    ICON_DEFAULT,
    ICON_MAP,
    resolveIcon,
    renderIconMarkup
} from "../script/icon-catalog.js";
import { PUBLICATION_TAGS, normalizarTagsPublicacao } from "../script/publication-tags.js";

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
const PLAYLIST_ICON_DEFAULT = ICON_DEFAULT;
const NOTICIA_ICON_DEFAULT = "newspaper";
const PLAYLIST_ICON_CATALOG = ICON_CATALOG;
const PLAYLIST_ICON_MAP = ICON_MAP;
let cacheNoticiasDashboard = [];
let cachePlaylistsDashboard = {};
let dashboardNewsActions = null;
let filtrosDashboardInicializados = false;

document.body.classList.add("admin-v2");

function atualizarMetricasDashboard({ noticias, playlists } = {}) {
    const metricNoticias = document.getElementById("metricNoticias");
    const metricVideos = document.getElementById("metricVideos");
    const metricPlaylists = document.getElementById("metricPlaylists");
    const metricCategorias = document.getElementById("metricCategorias");

    if (metricNoticias && Array.isArray(noticias)) {
        metricNoticias.textContent = String(noticias.length);
    }
    if (metricVideos && playlists) {
        const itens = Object.values(playlists);
        metricVideos.textContent = String(itens.filter((item) => item?.tipo === "video").length);
    }
    if (metricPlaylists && playlists) {
        const itens = Object.values(playlists);
        metricPlaylists.textContent = String(itens.filter((item) => item?.tipo !== "video").length);
    }
    if (metricCategorias && Array.isArray(noticias)) {
        const categorias = new Set();
        noticias.forEach((item) => {
            if (Array.isArray(item.tags)) item.tags.forEach((tag) => {
                if (String(tag || "").trim()) categorias.add(String(tag).trim());
            });
        });
        metricCategorias.textContent = String(categorias.size);
    }
}

function formatarDataDashboard(dataISO) {
    if (!dataISO) return "Sem data";
    const partes = String(dataISO).split("-");
    if (partes.length !== 3) return String(dataISO);
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function atualizarStatusDashboard(estado, mensagem) {
    const status = document.getElementById("adminHeaderStatus");
    const dot = document.querySelector(".admin-live-dot");
    if (status) status.textContent = mensagem;
    if (dot) {
        dot.className = "admin-live-dot";
        dot.classList.add(`admin-live-dot--${estado}`);
    }
}

function renderizarPublicacoesPorMes() {
    const container = document.getElementById("graficoNoticiasMes");
    if (!container) return;

    const hoje = new Date();
    const meses = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - offset, 1);
        const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
        const rotulo = data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
        meses.push({ chave, rotulo, total: 0 });
    }

    cacheNoticiasDashboard.forEach((item) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(item.data)) return;
        const chave = item.data.slice(0, 7);
        const mes = meses.find((itemMes) => itemMes.chave === chave);
        if (mes) mes.total += 1;
    });

    const maximo = Math.max(1, ...meses.map((mes) => mes.total));
    container.replaceChildren();
    const escala = document.createElement("div");
    escala.className = "monthly-chart-bars";
    meses.forEach((mes) => {
        const coluna = document.createElement("div");
        coluna.className = "monthly-chart-column";
        const valor = document.createElement("strong");
        valor.textContent = String(mes.total);
        const barra = document.createElement("span");
        barra.className = "monthly-chart-bar";
        barra.style.height = `${Math.max(8, (mes.total / maximo) * 72)}px`;
        const legenda = document.createElement("small");
        legenda.textContent = mes.rotulo;
        coluna.append(valor, barra, legenda);
        escala.appendChild(coluna);
    });
    container.appendChild(escala);
}

function renderizarCategorias() {
    const container = document.getElementById("graficoCategorias");
    if (!container) return;

    const contagem = new Map();
    cacheNoticiasDashboard.forEach((item) => {
        item.tags.forEach((tag) => contagem.set(tag, (contagem.get(tag) || 0) + 1));
    });
    const categorias = [...contagem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    container.replaceChildren();

    if (!categorias.length) {
        const vazio = document.createElement("p");
        vazio.className = "analytics-empty";
        vazio.textContent = "Nenhuma categoria utilizada nas notícias.";
        container.appendChild(vazio);
        return;
    }

    const maximo = Math.max(1, ...categorias.map(([, total]) => total));
    categorias.forEach(([categoria, total]) => {
        const linha = document.createElement("div");
        linha.className = "category-chart-row";
        const nome = document.createElement("span");
        nome.textContent = categoria;
        const trilha = document.createElement("div");
        trilha.className = "category-chart-track";
        const barra = document.createElement("span");
        barra.style.width = `${(total / maximo) * 100}%`;
        const valor = document.createElement("strong");
        valor.textContent = String(total);
        trilha.appendChild(barra);
        linha.append(nome, trilha, valor);
        container.appendChild(linha);
    });
}

function renderizarTiposConteudo() {
    const container = document.getElementById("graficoTiposConteudo");
    if (!container) return;

    const itens = Object.values(cachePlaylistsDashboard);
    const videos = itens.filter((item) => item?.tipo === "video").length;
    const playlists = itens.filter((item) => item?.tipo === "playlist").length;
    container.replaceChildren();

    if (!videos && !playlists) {
        const vazio = document.createElement("p");
        vazio.className = "analytics-empty";
        vazio.textContent = "Nenhum conteúdo audiovisual válido cadastrado.";
        container.appendChild(vazio);
        return;
    }

    const total = videos + playlists;
    [
        ["Vídeos", videos, "video"],
        ["Playlists", playlists, "playlist"]
    ].forEach(([nome, quantidade, tipo]) => {
        const linha = document.createElement("div");
        linha.className = "content-type-row";
        const rotulo = document.createElement("span");
        rotulo.textContent = nome;
        const valor = document.createElement("strong");
        valor.textContent = `${quantidade} · ${Math.round((quantidade / total) * 100)}%`;
        linha.dataset.tipo = tipo;
        linha.append(rotulo, valor);
        container.appendChild(linha);
    });
}

function atualizarResumoFiltros(totalFiltrado) {
    const resumo = document.getElementById("resumoFiltrosNoticias");
    if (!resumo) return;
    const total = cacheNoticiasDashboard.length;
    const exibidos = Math.min(totalFiltrado, 8);
    resumo.textContent = `Exibindo ${exibidos} de ${total} resultados`;
}

function renderizarUltimasNoticias() {
    const tbody = document.getElementById("listaUltimasNoticias");
    const busca = document.getElementById("filtroNoticiasBusca");
    const categoria = document.getElementById("filtroNoticiasCategoria");
    const dataInicial = document.getElementById("filtroNoticiasDataInicial");
    const dataFinal = document.getElementById("filtroNoticiasDataFinal");
    if (!tbody) return;

    const termo = busca?.value.trim().toLocaleLowerCase("pt-BR") || "";
    const categoriaSelecionada = categoria?.value || "";
    const dataInicialSelecionada = dataInicial?.value || "";
    const dataFinalSelecionada = dataFinal?.value || "";
    const filtradas = cacheNoticiasDashboard
        .filter((item) => !termo || item.titulo.toLocaleLowerCase("pt-BR").includes(termo))
        .filter((item) => !categoriaSelecionada || item.tags.includes(categoriaSelecionada))
        .filter((item) => !dataInicialSelecionada || !item.data || item.data >= dataInicialSelecionada)
        .filter((item) => !dataFinalSelecionada || !item.data || item.data <= dataFinalSelecionada)
        .sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));

    if (!filtradas.length) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");
        celula.colSpan = 4;
        celula.className = "recent-empty";
        celula.textContent = cacheNoticiasDashboard.length
            ? "Nenhuma notícia corresponde aos filtros."
            : "Nenhuma notícia cadastrada.";
        linha.appendChild(celula);
        tbody.replaceChildren(linha);
        atualizarResumoFiltros(filtradas.length);
        return;
    }

    const linhas = filtradas.slice(0, 8).map((item) => {
        const linha = document.createElement("tr");

        const titulo = document.createElement("td");
        const tituloTexto = document.createElement("span");
        tituloTexto.className = "recent-title";
        tituloTexto.textContent = item.titulo || "Notícia sem título";
        titulo.appendChild(tituloTexto);

        const categoriaCelula = document.createElement("td");
        const categoriaTexto = document.createElement("span");
        categoriaTexto.className = "recent-category";
        categoriaTexto.textContent = item.tags[0] || "Sem categoria";
        categoriaCelula.appendChild(categoriaTexto);

        const dataCelula = document.createElement("td");
        dataCelula.textContent = formatarDataDashboard(item.data);

        const acoes = document.createElement("td");
        const conteinerAcoes = document.createElement("div");
        conteinerAcoes.className = "recent-actions";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "recent-action recent-action-edit";
        editar.dataset.id = item.id;
        editar.setAttribute("aria-label", `Editar ${item.titulo || "notícia"}`);
        editar.innerHTML = '<i data-lucide="pencil" aria-hidden="true"></i>';

        const remover = document.createElement("button");
        remover.type = "button";
        remover.className = "recent-action recent-action-delete";
        remover.dataset.id = item.id;
        remover.setAttribute("aria-label", `Remover ${item.titulo || "notícia"}`);
        remover.innerHTML = '<i data-lucide="trash-2" aria-hidden="true"></i>';

        editar.addEventListener("click", () => {
            document.getElementById("secao-noticias")?.scrollIntoView({ behavior: "smooth" });
            if (dashboardNewsActions?.editar) dashboardNewsActions.editar(item.id);
        });
        remover.addEventListener("click", () => {
            if (dashboardNewsActions?.remover) dashboardNewsActions.remover(item.id);
        });

        conteinerAcoes.append(editar, remover);
        acoes.appendChild(conteinerAcoes);
        linha.append(titulo, categoriaCelula, dataCelula, acoes);
        return linha;
    });

    tbody.replaceChildren(...linhas);
    atualizarResumoFiltros(filtradas.length);
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}

function inicializarFiltrosDashboard() {
    if (filtrosDashboardInicializados) return;
    filtrosDashboardInicializados = true;
    const busca = document.getElementById("filtroNoticiasBusca");
    const categoria = document.getElementById("filtroNoticiasCategoria");
    const dataInicial = document.getElementById("filtroNoticiasDataInicial");
    const dataFinal = document.getElementById("filtroNoticiasDataFinal");
    const limpar = document.getElementById("btnLimparFiltrosNoticias");

    busca?.addEventListener("input", renderizarUltimasNoticias);
    categoria?.addEventListener("change", renderizarUltimasNoticias);
    dataInicial?.addEventListener("change", renderizarUltimasNoticias);
    dataFinal?.addEventListener("change", renderizarUltimasNoticias);
    limpar?.addEventListener("click", () => {
        if (busca) busca.value = "";
        if (categoria) categoria.value = "";
        if (dataInicial) dataInicial.value = "";
        if (dataFinal) dataFinal.value = "";
        renderizarUltimasNoticias();
    });

    document.querySelectorAll("[data-admin-nav]").forEach((link) => {
        link.addEventListener("click", () => {
            const titulo = document.getElementById("adminPageTitle");
            if (titulo) titulo.textContent = link.dataset.adminNav === "visão geral" ? "Visão geral" : link.dataset.adminNav;
        });
    });

    document.querySelectorAll("[data-mobile-nav]").forEach((link) => {
        link.addEventListener("click", () => {
            document.querySelectorAll("[data-mobile-nav]").forEach((item) => item.classList.toggle("active", item === link));
        });
    });

    document.getElementById("btnMenuMobileAdmin")?.addEventListener("click", () => {
        document.getElementById("menuBtn")?.click();
    });
}

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    })[caractere]);
}

function obterEntradaIcone(icone, padrao = PLAYLIST_ICON_DEFAULT) {
    return resolveIcon(icone || padrao);
}

function renderizarMarkupIcone(icone) {
    return renderIconMarkup(obterEntradaIcone(icone));
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
    btnToggleSenha.innerHTML = `<i data-lucide="${estaOculta ? "eye-off" : "eye"}" aria-hidden="true"></i>`;
    btnToggleSenha.setAttribute("aria-label", estaOculta ? "Ocultar senha" : "Mostrar senha");
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
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
    const mobileNav = document.getElementById("adminMobileNav");
    if (mobileNav) mobileNav.hidden = true;
    atualizarStatusDashboard("idle", "Aguardando autenticação");
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

    document.querySelectorAll("[data-mobile-nav]").forEach((link) => {
        if (link.dataset.mobileNav === "vídeos e playlists" && !(papel === "admin" || papel === "playlist")) {
            link.hidden = true;
        } else if (link.dataset.mobileNav === "notícias" && !(papel === "admin" || papel === "publicador")) {
            link.hidden = true;
        } else {
            link.hidden = false;
        }
    });

    const mobileNav = document.getElementById("adminMobileNav");
    if (mobileNav) {
        const linksVisiveis = Array.from(mobileNav.querySelectorAll("[data-mobile-nav], button")).filter((elemento) => !elemento.hidden).length;
        mobileNav.style.gridTemplateColumns = `repeat(${linksVisiveis}, 1fr)`;
    }
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

    inicializarFiltrosDashboard();
    aplicarPermissoes(papel);
    const mobileNav = document.getElementById("adminMobileNav");
    if (mobileNav) mobileNav.hidden = false;
    atualizarStatusDashboard("loading", "Carregando dados");
    if (textoContaLogada) {
        textoContaLogada.textContent = `Olá, ${nome || NOMES_PAPEL[papel] || "usuário autorizado"}`;
    }

    if (papel === "admin") {
        inicializarModuloPainel("manutenção", inicializarGerenciadorManutencao);
    }
    if (papel === "admin" || papel === "playlist") {
        inicializarModuloPainel("vídeos e playlists", inicializarGerenciadorPlaylists);
    }
    if (papel === "admin" || papel === "publicador") {
        inicializarModuloPainel("notícias", inicializarGerenciadorNoticias);
    }
}

function inicializarModuloPainel(nome, inicializar) {
    try {
        inicializar();
    } catch (error) {
        console.error(`[RGA Admin] Não foi possível inicializar o módulo de ${nome}:`, error);
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
        const nome = obterEntradaIcone(valor, NOTICIA_ICON_DEFAULT);
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
                class="icon-picker-item ${obterEntradaIcone(inputIcone.value, NOTICIA_ICON_DEFAULT) === item.name ? "selected" : ""}"
                data-icon-name="${escaparHtml(item.name)}"
                aria-label="Selecionar ícone ${escaparHtml(item.label)}"
                aria-selected="${obterEntradaIcone(inputIcone.value, NOTICIA_ICON_DEFAULT) === item.name}"
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
    atualizarVisualizacao(inputIcone.value || NOTICIA_ICON_DEFAULT);
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
        atualizarStatusDashboard("synced", "Sincronizado");
    }, (error) => {
        statusManutencao.textContent = "INDISPONÍVEL";
        feedbackManutencao.textContent = mensagemFirebase(error, "carregar o status da manutenção");
        atualizarStatusDashboard(
            error?.code === "PERMISSION_DENIED" ? "denied" : "error",
            error?.code === "PERMISSION_DENIED" ? "Acesso negado" : "Problema de conexão"
        );
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
        if (!entrada) {
            throw new Error("URL ou ID vazio. Informe um link válido do YouTube.");
        }

        // Se for apenas letras/números (ID puro)
        if (/^[a-zA-Z0-9_-]+$/.test(entrada)) {
            // IDs de vídeo do YouTube têm 11 caracteres
            if (entrada.length === 11) {
                return { tipo: "video", videoId: entrada };
            }
            // Playlist IDs podem ter mais caracteres
            return { tipo: "playlist", playlistId: entrada };
        }

        let url;
        try {
            url = new URL(entrada.includes("://") ? entrada : `https://${entrada}`);
        } catch {
            throw new Error("URL inválida. Informe um link válido do YouTube.");
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
        cachePlaylistsDashboard = dadosFirebase && typeof dadosFirebase === "object" ? dadosFirebase : {};
        atualizarMetricasDashboard({ playlists: dadosFirebase && typeof dadosFirebase === "object" ? dadosFirebase : {} });
        renderizarTiposConteudo();
        atualizarStatusDashboard("synced", "Sincronizado");

        // Handle case where data is not an object (null or primitive)
        if (!dadosFirebase || typeof dadosFirebase !== 'object') {
            listaContainer.innerHTML = '<p class="txt-ajuda">Nenhuma playlist cadastrada na nuvem do Firebase.</p>';
            return;
        }

        Object.keys(dadosFirebase).forEach((key) => {
            const dados = dadosFirebase[key];
            const iconeDisplay = dados.icone || PLAYLIST_ICON_DEFAULT;

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
                    <button class="btn-edit btn-edit-playlist" data-id="${key}"><i data-lucide="pencil" aria-hidden="true"></i>Editar</button>
                    <button class="btn-delete btn-delete-playlist" data-id="${key}"><i data-lucide="trash-2" aria-hidden="true"></i>Remover</button>
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

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }, (error) => {
        listaContainer.innerHTML = `<p class="txt-ajuda">${mensagemFirebase(error, "carregar os vídeos e playlists")}</p>`;
        atualizarStatusDashboard(
            error?.code === "PERMISSION_DENIED" ? "denied" : "error",
            error?.code === "PERMISSION_DENIED" ? "Acesso negado" : "Problema de conexão"
        );
    });

    formPlaylist.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idAtual = inputId.value;
        let midia;
        try {
            midia = extrairMidiaYouTube(inputUrl.value);
        } catch (error) {
            RGA.toast({ title: "Link inválido", message: error.message, type: "error" });
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
                RGA.toast({ title: "Conteúdo atualizado", message: "Alterações guardadas na nuvem.", type: "success" });
            } else {
                diagnosticarOperacao("playlists");
                await push(ref(database, "playlists"), itemPlaylist);
                RGA.toast({ title: "Conteúdo publicado", message: "Novo conteúdo inserido na nuvem.", type: "success" });
            }

            limparFormulario();
        } catch (error) {
            RGA.toast({ title: "Não foi possível salvar", message: mensagemFirebase(error, "salvar o vídeo"), type: "error" });
        }
    });

    function carregarFormParaEdicao(id) {
        get(ref(database, "playlists/" + id))
            .then((snapshot) => {
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
            })
            .catch((error) => RGA.toast({ title: "Erro ao carregar", message: mensagemFirebase(error, "carregar o vídeo ou playlist"), type: "error" }));
    }

    async function apagarPlaylist(id) {
        const confirmado = await RGA.confirm({
            title: "Remover playlist?",
            message: "Esta playlist será removida permanentemente da nuvem.",
            confirmText: "Remover",
            cancelText: "Cancelar",
            type: "danger"
        });
        if (!confirmado) return;

        try {
            diagnosticarOperacao(`playlists/${id}`);
            await remove(ref(database, "playlists/" + id));
            RGA.toast({ title: "Playlist removida", message: "O conteúdo foi removido com sucesso.", type: "success" });
        } catch (error) {
            RGA.toast({ title: "Não foi possível remover", message: mensagemFirebase(error, "remover o vídeo"), type: "error" });
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
    const inputIcone = document.getElementById("noticia-icone");
    const inputTitulo = document.getElementById("noticia-titulo");
    const inputResumo = document.getElementById("noticia-resumo");
    const inputConteudo = document.getElementById("noticia-conteudo");
    const inputImagem = document.getElementById("noticia-imagem");
    const inputData = document.getElementById("noticia-data");
    const selectTagDisponivel = document.getElementById("noticia-tag-disponivel");
    const inputTagPersonalizada = document.getElementById("noticia-tag-personalizada");
    const tagsSelecionadasContainer = document.getElementById("noticia-tags-selecionadas");
    const statusTags = document.getElementById("noticia-tags-status");
    const btnAdicionarTag = document.getElementById("btn-adicionar-noticia-tag");
    const btnLimpar = document.getElementById("btn-limpar-form-noticia");
    const listaContainer = document.getElementById("lista-noticias-admin");

    // Novas referências visuais de preview para a imagem
    const previewContainer = document.getElementById("preview-imagem-admin");
    const imgPreview = document.getElementById("img-preview-noticia");

    if (!formNoticia || !inputId || !inputIcone || !inputTitulo || !inputResumo || !inputConteudo || !inputImagem || !inputData || !selectTagDisponivel || !inputTagPersonalizada || !tagsSelecionadasContainer || !statusTags || !btnAdicionarTag || !btnLimpar || !listaContainer) {
        return;
    }

    gerenciadoresInicializados.add("noticias");
    dashboardNewsActions = {
        editar: carregarNoticiaParaEdicao,
        remover: apagarNoticia
    };

    inicializarSeletorIconesNoticias();

    let tagsSelecionadas = [];

    function atualizarOpcoesTags() {
        const opcoes = normalizarTagsPublicacao([...PUBLICATION_TAGS, ...tagsSelecionadas]);
        const tagsDisponiveis = opcoes.filter((tag) => !tagsSelecionadas.includes(tag));

        selectTagDisponivel.innerHTML = `
            <option value="">Selecionar uma categoria</option>
            ${tagsDisponiveis.map((tag) => `<option value="${escaparHtml(tag)}">${escaparHtml(tag)}</option>`).join("")}
        `;
        selectTagDisponivel.disabled = tagsDisponiveis.length === 0;
    }

    function renderizarTagsSelecionadas() {
        if (tagsSelecionadas.length === 0) {
            tagsSelecionadasContainer.innerHTML = '<p class="noticia-tags-vazia">Nenhuma categoria selecionada.</p>';
        } else {
            tagsSelecionadasContainer.innerHTML = tagsSelecionadas.map((tag) => `
                <span class="noticia-tag-admin">
                    <span>${escaparHtml(tag)}</span>
                    <button type="button" class="btn-remover-noticia-tag" data-tag="${escaparHtml(tag)}" aria-label="Remover categoria ${escaparHtml(tag)}">
                        <i data-lucide="x" aria-hidden="true"></i>
                    </button>
                </span>
            `).join("");

            tagsSelecionadasContainer.querySelectorAll(".btn-remover-noticia-tag").forEach((botao) => {
                botao.addEventListener("click", () => {
                    tagsSelecionadas = tagsSelecionadas.filter((tag) => tag !== botao.dataset.tag);
                    renderizarTagsSelecionadas();
                    atualizarOpcoesTags();
                    statusTags.textContent = `Categoria ${botao.dataset.tag} removida.`;
                });
            });
        }

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function definirTagsSelecionadas(tags) {
        tagsSelecionadas = normalizarTagsPublicacao(tags);
        inputTagPersonalizada.value = "";
        renderizarTagsSelecionadas();
        atualizarOpcoesTags();
    }

    function adicionarTagSelecionada() {
        const novaTag = (inputTagPersonalizada.value || selectTagDisponivel.value).trim();
        if (!novaTag) {
            statusTags.textContent = "Selecione ou escreva uma categoria para adicionar.";
            selectTagDisponivel.focus();
            return;
        }

        const tagsAtualizadas = normalizarTagsPublicacao([...tagsSelecionadas, novaTag]);
        if (tagsAtualizadas.length === tagsSelecionadas.length) {
            statusTags.textContent = "Essa categoria já foi selecionada.";
            return;
        }

        tagsSelecionadas = tagsAtualizadas;
        inputTagPersonalizada.value = "";
        renderizarTagsSelecionadas();
        atualizarOpcoesTags();
        statusTags.textContent = `Categoria ${novaTag} adicionada.`;
    }

    btnAdicionarTag.addEventListener("click", adicionarTagSelecionada);
    inputTagPersonalizada.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            adicionarTagSelecionada();
        }
    });
    definirTagsSelecionadas([]);

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
        const entradasNoticias = dadosFirebase && typeof dadosFirebase === "object"
            ? Object.entries(dadosFirebase).map(([id, dados]) => ({
                id,
                titulo: String(dados?.titulo || ""),
                data: String(dados?.data || ""),
                tags: normalizarTagsPublicacao(dados?.tags)
            }))
            : [];
        cacheNoticiasDashboard = entradasNoticias;

        const filtroCategoria = document.getElementById("filtroNoticiasCategoria");
        if (filtroCategoria) {
            const categorias = [...new Set(entradasNoticias.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b));
            const valorAtual = filtroCategoria.value;
            filtroCategoria.replaceChildren(new Option("Todas as categorias", ""));
            categorias.forEach((categoria) => filtroCategoria.appendChild(new Option(categoria, categoria)));
            if (categorias.includes(valorAtual)) filtroCategoria.value = valorAtual;
        }
        atualizarMetricasDashboard({ noticias: entradasNoticias });
        renderizarPublicacoesPorMes();
        renderizarCategorias();
        renderizarUltimasNoticias();
        atualizarStatusDashboard("synced", "Sincronizado");

        // Handle case where data is not an object (null or primitive)
        if (!dadosFirebase || typeof dadosFirebase !== 'object') {
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
                    <button class="btn-edit btn-edit-noticia" data-id="${key}"><i data-lucide="pencil" aria-hidden="true"></i>Editar</button>
                    <button class="btn-delete btn-delete-noticia" data-id="${key}"><i data-lucide="trash-2" aria-hidden="true"></i>Remover</button>
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

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }, (error) => {
        listaContainer.innerHTML = `<p class="txt-ajuda">${mensagemFirebase(error, "carregar as notícias")}</p>`;
        atualizarStatusDashboard(
            error?.code === "PERMISSION_DENIED" ? "denied" : "error",
            error?.code === "PERMISSION_DENIED" ? "Acesso negado" : "Problema de conexão"
        );
    });

    // Evento transformado em ASYNC para poder esperar o carregamento do arquivo
    formNoticia.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idAtual = inputId.value;

        try {
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
                icone: obterEntradaIcone(inputIcone.value, NOTICIA_ICON_DEFAULT),
                tags: normalizarTagsPublicacao(tagsSelecionadas),
                data: inputData.value
            };

            if (idAtual) {
                diagnosticarOperacao(`noticias/${idAtual}`);
                await set(ref(database, "noticias/" + idAtual), itemNoticia);
                RGA.toast({ title: "Notícia atualizada", message: "As alterações foram guardadas na nuvem.", type: "success" });
            } else {
                diagnosticarOperacao("noticias");
                await push(ref(database, "noticias"), itemNoticia);
                RGA.toast({ title: "Notícia publicada", message: "A notícia foi publicada na nuvem.", type: "success" });
            }

            limparFormularioNoticia();
        } catch (error) {
            RGA.toast({ title: "Não foi possível salvar", message: mensagemFirebase(error, "salvar a notícia"), type: "error" });
        }
    });

    function carregarNoticiaParaEdicao(id) {
        get(ref(database, "noticias/" + id))
            .then((snapshot) => {
                const item = snapshot.val();
                if (item) {
                    inputId.value = id;
                    inputTitulo.value = item.titulo || '';
                    inputResumo.value = item.resumo || '';
                    inputConteudo.value = item.conteudo || '';
                    definirTagsSelecionadas(item.tags);
                    inputIcone.value = obterEntradaIcone(item.icone, NOTICIA_ICON_DEFAULT);
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
            })
            .catch((error) => RGA.toast({ title: "Erro ao carregar", message: mensagemFirebase(error, "carregar a notícia"), type: "error" }));
    }

    async function apagarNoticia(id) {
        const confirmado = await RGA.confirm({
            title: "Remover notícia?",
            message: "Esta notícia será removida permanentemente da nuvem.",
            confirmText: "Remover",
            cancelText: "Cancelar",
            type: "danger"
        });
        if (!confirmado) return;

        try {
            diagnosticarOperacao(`noticias/${id}`);
            await remove(ref(database, "noticias/" + id));
            RGA.toast({ title: "Notícia removida", message: "A notícia foi removida com sucesso.", type: "success" });
        } catch (error) {
            RGA.toast({ title: "Não foi possível remover", message: mensagemFirebase(error, "remover a notícia"), type: "error" });
        }
    }

    function limparFormularioNoticia() {
        inputId.value = "";
        formNoticia.reset();
        definirTagsSelecionadas([]);
        inputIcone.value = "newspaper";
        if (window.RGANoticiaIconPicker && typeof window.RGANoticiaIconPicker.atualizarVisualizacao === "function") {
            window.RGANoticiaIconPicker.atualizarVisualizacao("newspaper");
        }
        if (previewContainer) previewContainer.hidden = true;
        document.getElementById("btn-salvar-noticia").textContent = "Publicar Notícia";
    }

    btnLimpar.addEventListener("click", limparFormularioNoticia);
}

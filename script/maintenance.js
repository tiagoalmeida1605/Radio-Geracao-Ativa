import { database } from "./firebase-config.js";
import { onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { auth, observarAutenticacao, obterPapel } from "./admin-auth.js?v=3";

const CAMINHO_CONFIGURACAO = "configuracoes/manutencao";

function estaNaPaginaManutencao() {
    return window.location.pathname.endsWith("manutencao.html");
}

function obterUrlManutencao() {
    const pathname = window.location.pathname;

    if (pathname.includes("/pages/")) {
        return new URL("manutencao.html", window.location.href).href;
    }

    return new URL("pages/manutencao.html", window.location.href).href;
}

function redirecionarParaManutencao() {
    if (estaNaPaginaManutencao()) {
        return;
    }

    window.location.replace(obterUrlManutencao());
}

function aplicarEstadoManutencao(ativo, usuario) {
    if (window.location.pathname.includes("/admin")) {
        return;
    }

    if (ativo && !usuario) {
        redirecionarParaManutencao();
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("/admin")) {
        return;
    }

    const manutencaoRef = ref(database, CAMINHO_CONFIGURACAO);

    let manutencaoAtiva = false;
    let usuarioAutorizado = false;

    const avaliarAcesso = () => aplicarEstadoManutencao(manutencaoAtiva, usuarioAutorizado);

    observarAutenticacao(async (usuario) => {
        try {
            usuarioAutorizado = Boolean(usuario && await obterPapel(usuario));
        } catch (error) {
            usuarioAutorizado = false;
            console.warn("Erro ao validar papel durante a manutenção:", error);
        }

        avaliarAcesso();
    });

    onValue(manutencaoRef, (snapshot) => {
        const configuracao = snapshot.val();
        manutencaoAtiva = Boolean(configuracao?.ativo);
        avaliarAcesso();
    }, (error) => {
        console.warn("Erro ao ler status de manutenção:", error);
        manutencaoAtiva = false;
        avaliarAcesso();
    });
});

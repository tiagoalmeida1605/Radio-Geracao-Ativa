import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { observarAutenticacao } from "./admin-auth.js";

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

const CAMINHO_CONFIGURACAO = "configuracoes/manutencao";

const app = initializeApp(firebaseConfig, "rga-maintenance");
const database = getDatabase(app);

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
    let usuarioAtual = null;

    const avaliarAcesso = () => aplicarEstadoManutencao(manutencaoAtiva, usuarioAtual);

    observarAutenticacao((usuario) => {
        usuarioAtual = usuario;
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

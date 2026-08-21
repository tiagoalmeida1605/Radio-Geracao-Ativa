import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { obterContaAutenticada } from "./admin-auth.js";

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



function obterSiteShell() {
    return document.getElementById("siteShell");
}

function fecharMenuMobile() {
    const menu = document.getElementById("nav-Menu");
    const menuOverlay = document.getElementById("menuOverlay");
    const menuBtn = document.getElementById("menuBtn");

    menu?.classList.remove("active");
    menuOverlay?.classList.remove("active");
    document.body.classList.remove("menu-aberto");

    if (menuBtn) {
        menuBtn.textContent = "☰";
    }
}

function definirFundoInativo(inativo) {
    const siteShell = obterSiteShell();

    if (!siteShell) {
        return;
    }

    if (inativo) {
        siteShell.setAttribute("aria-hidden", "true");
        if ("inert" in siteShell) {
            siteShell.inert = true;
        }
        return;
    }

    siteShell.removeAttribute("aria-hidden");
    if ("inert" in siteShell) {
        siteShell.inert = false;
    }
}

function mostrarManutencao() {
    fecharMenuMobile();
    
    const overlay = document.getElementById("maintenanceOverlay");
    if (overlay) {
        overlay.style.display = "flex";
        const card = overlay.querySelector(".maintenance-card");
        card?.focus({ preventScroll: true });
    }

    document.body.classList.add("maintenance-active");
    definirFundoInativo(true);
}

function ocultarManutencao() {
    document.body.classList.remove("maintenance-active");
    definirFundoInativo(false);

    const overlay = document.getElementById("maintenanceOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

function aplicarEstadoManutencao(ativo) {
    if (ativo && !obterContaAutenticada()) {
        mostrarManutencao();
        return;
    }

    ocultarManutencao();
}

document.addEventListener("DOMContentLoaded", () => {
    // Evita rodar no painel administrativo por segurança
    if (window.location.pathname.includes("/admin")) {
        return;
    }

    const manutencaoRef = ref(database, CAMINHO_CONFIGURACAO);

    onValue(manutencaoRef, (snapshot) => {
        const configuracao = snapshot.val();
        aplicarEstadoManutencao(Boolean(configuracao?.ativo));
    }, (error) => {
        console.warn("Erro ao ler status de manutenção:", error);
        aplicarEstadoManutencao(false); // Default seguro: não bloqueia em caso de erro
    });
});

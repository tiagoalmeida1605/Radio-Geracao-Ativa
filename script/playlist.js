/**
 * Conteúdo de vídeo da Rádio Geração Ativa.
 * Registros legados sem `tipo` continuam sendo tratados como playlists.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { renderIconMarkup, escaparHtml, resolveIcon, ICON_MAP, ICON_DEFAULT } from "./icon-catalog.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNCSo_-gKlWZnxRY06hEH8YumECD4Yj54",
    authDomain: "radiogeracaoativa-playlist.firebaseapp.com",
    databaseURL: "https://radiogeracaoativa-playlist-default-rtdb.firebaseio.com",
    projectId: "radiogeracaoativa-playlist",
    storageBucket: "radiogeracaoativa-playlist.firebasestorage.app",
    messagingSenderId: "437305061004",
    appId: "1:437305061004:web:ee41f4d58d11d20af615a9",
    measurementId: "G-SFVF2382KW"
};

const database = getDatabase(initializeApp(firebaseConfig, "rga-public-playlists"));

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[caractere]);
}

function obterMidia(item) {
    const tipo = item.tipo === "video" ? "video" : "playlist";
    const id = String((tipo === "video" ? item.videoId : item.playlistId) || "").trim();

    return {
        tipo,
        embedUrl: tipo === "video"
            ? `https://www.youtube.com/embed/${encodeURIComponent(id)}`
            : `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(id)}`,
        externalUrl: tipo === "video"
            ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`
            : `https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const gridDinamica = document.getElementById("grid-dinamica");
    if (!gridDinamica) return;

    function mostrarFeedback(mensagem, erro = false) {
        gridDinamica.innerHTML = `<p class="playlist-feedback${erro ? " is-error" : ""}" role="status">${escaparHtml(mensagem)}</p>`;
    }

    function renderizarConteudos(conteudos) {
        gridDinamica.innerHTML = "";
        if (conteudos.length === 0) {
            mostrarFeedback("Nenhum vídeo ou playlist foi adicionado pela administração ainda.");
            return;
        }

        conteudos.forEach((conteudo) => {
            const midia = obterMidia(conteudo);
            const artigo = document.createElement("article");
            artigo.className = "playlist-card";
            artigo.dataset.tipo = midia.tipo;

            const proporcaoInformada = String(conteudo.proporcao || "").trim();
            const proporcao = /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(proporcaoInformada)
                ? proporcaoInformada
                : "16 / 9";
            artigo.style.setProperty("--video-ratio", proporcao);

            // Obter o label do ícone para exibição como categoria TAG
            const iconeNome = resolveIcon(conteudo.icone || "");
            const iconeItem = ICON_MAP[iconeNome] || ICON_MAP[ICON_DEFAULT];
            const iconeLabel = iconeItem.label;

            artigo.innerHTML = `
                <div class="playlist-header">
                    <div>
                        <span class="tag">
                            ${renderIconMarkup(conteudo.icone)}
                            <span class="tag-label">${iconeLabel}</span>
                        </span>
                        <h2>${escaparHtml(conteudo.titulo || "Conteúdo da Rádio Geração Ativa")}</h2>
                    </div>
                </div>
                <p class="playlist-description">${escaparHtml(conteudo.descricao || "")}</p>
                <div class="playlist-video">
                    <iframe src="${midia.embedUrl}" title="${escaparHtml(conteudo.titulo || midia.tipo === 'video' ? 'Vídeo' : 'Playlist')} - Rádio Geração Ativa" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                <a class="playlist-btn" href="${midia.externalUrl}" target="_blank" rel="noopener noreferrer">
                    ${midia.tipo === "video" ? "Assistir vídeo" : "Abrir playlist"}
                </a>`;
            gridDinamica.appendChild(artigo);
        });

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    onValue(ref(database, "playlists"), (snapshot) => {
        const val = snapshot.val();
        if (val && typeof val === 'object' && !Array.isArray(val)) {
            renderizarConteudos(Object.values(val));
        } else {
            // Handle case where data is not an object (null, primitive, or array)
            renderizarConteudos([]);
        }
    }, (error) => {
        console.error("Erro ao carregar conteúdos:", error);
        mostrarFeedback("Não foi possível carregar os vídeos e playlists. Tente novamente mais tarde.", true);
    });
});

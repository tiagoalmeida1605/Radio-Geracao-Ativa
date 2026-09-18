/**
 * Conteúdo de vídeo da Rádio Geração Ativa.
 * Registros legados sem `tipo` continuam sendo tratados como playlists.
 */

import { database } from "./firebase-config.js";
import { onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { renderIconMarkup, escaparHtml, resolveIcon, ICON_MAP, ICON_DEFAULT } from "./icon-catalog.js";

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
    if (!gridDinamica) {
        console.error("[RGA Playlist] Elemento #grid-dinamica não encontrado");
        return;
    }

    function mostrarFeedback(mensagem, erro = false) {
        if (gridDinamica) {
            gridDinamica.innerHTML = `<p class="playlist-feedback${erro ? " is-error" : ""}" role="status">${escaparHtml(mensagem)}</p>`;
        } else {
            console.error("[RGA Playlist] Tentativa de mostrar feedback mas #grid-dinamica não está disponível");
        }
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
        console.debug("[RGA Playlist] Dados recebidos do Firebase");
        const val = snapshot.val();
        console.debug("[RGA Playlist] Valor:", val);

        if (val && typeof val === 'object' && !Array.isArray(val)) {
            console.debug("[RGA Playlist] Dados são objeto válido, processando...");
            try {
                renderizarConteudos(Object.values(val));
            } catch (error) {
                console.error("[RGA Playlist] Erro ao renderizar conteúdos:", error);
                mostrarFeedback("Erro ao processar os dados dos vídeos e playlists. Tente novamente mais tarde.", true);
            }
        } else {
            console.debug("[RGA Playlist] Dados não são objeto ou são null:", val);
            renderizarConteudos([]);
        }
    }, (error) => {
        console.error("[RGA Playlist] Erro ao carregar conteúdos:", error);
        mostrarFeedback("Não foi possível carregar os vídeos e playlists. Tente novamente mais tarde.", true);
    });
});

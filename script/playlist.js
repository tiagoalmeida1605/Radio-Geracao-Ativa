/**
 * Rádio Geração Ativa
 * Playlists / Vídeos
 *
 * Fonte de dados:
 * Firebase Realtime Database → playlists
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

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
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    })[caractere]);
}


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // ======================================================
        // REFERÊNCIA DO HTML
        // ======================================================

        const gridDinamica =
            document.getElementById(
                "grid-dinamica"
            );


        if (!gridDinamica) {
            console.error(
                "Elemento #grid-dinamica não encontrado."
            );

            return;
        }


        // ======================================================
        // CARREGAR PLAYLISTS PELA API
        // ======================================================

        function renderizarPlaylists(playlists) {
            try {

                gridDinamica.innerHTML = `
                    <p
                        style="
                            text-align: center;
                            width: 100%;
                            color: #666;
                            font-weight: 600;
                        "
                    >
                        Carregando playlists...
                    </p>
                `;


                gridDinamica.innerHTML =
                    "";


                // ==================================================
                // BANCO VAZIO
                // ==================================================

                if (
                    playlists.length === 0
                ) {
                    gridDinamica.innerHTML = `
                        <p
                            style="
                                text-align: center;
                                width: 100%;
                                color: #666;
                                font-weight: 600;
                            "
                        >
                            Nenhuma playlist foi adicionada
                            pelo administrador ainda.
                        </p>
                    `;

                    return;
                }


                // ==================================================
                // RENDERIZAR PLAYLISTS
                // ==================================================

                playlists.forEach(
                    (playlist) => {

                        const iconeDisplay =
                            playlist.icone ||
                            "📹";


                        const article =
                            document.createElement(
                                "article"
                            );


                        article.className =
                            "playlist-card";

                        const proporcaoInformada =
                            String(playlist.proporcao || "").trim();

                        const proporcao =
                            /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(
                                proporcaoInformada
                            )
                                ? proporcaoInformada
                                : "16 / 9";

                        article.style.setProperty(
                            "--video-ratio",
                            proporcao
                        );


                        article.innerHTML = `
                            <div
                                class="playlist-header"
                            >
                                <span
                                    class="playlist-icon"
                                    aria-hidden="true"
                                >
                                    ${escaparHtml(iconeDisplay)}
                                </span>

                                <h2>
                                    ${escaparHtml(playlist.titulo)}
                                </h2>
                            </div>


                            <p
                                class="playlist-description"
                            >
                                ${escaparHtml(playlist.descricao)}
                            </p>


                            <div
                                class="playlist-video"
                            >
                                <iframe
                                    src="https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
                                        playlist.playlistId || ""
                                    )}"
                                    title="${
                                        escaparHtml(playlist.titulo) ||
                                        "Playlist da Rádio Geração Ativa"
                                    } - Rádio Geração Ativa"
                                    loading="lazy"
                                    allowfullscreen
                                >
                                </iframe>
                            </div>


                            <a
                                class="playlist-btn"
                                href="https://www.youtube.com/playlist?list=${encodeURIComponent(
                                    playlist.playlistId || ""
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Abrir Playlist
                            </a>
                        `;


                        gridDinamica.appendChild(
                            article
                        );
                    }
                );


            } catch (error) {

                console.error(
                    "Erro ao carregar playlists:",
                    error
                );


                gridDinamica.innerHTML = `
                    <p
                        style="
                            text-align: center;
                            width: 100%;
                            color: #b00020;
                            font-weight: 600;
                        "
                    >
                        Não foi possível carregar as playlists.
                        Tente novamente mais tarde.
                    </p>
                `;
            }
        }


        const playlistsRef = ref(database, "playlists");
        onValue(playlistsRef, (snapshot) => {
            const dados = snapshot.val() || {};
            renderizarPlaylists(Object.values(dados));
        }, (error) => {
            console.error("Erro ao carregar playlists:", error);
            gridDinamica.innerHTML = `
                <p class="playlist-feedback">
                    Não foi possível carregar as playlists. Tente novamente mais tarde.
                </p>
            `;
        });
    }
);
/**
 * Rádio Geração Ativa
 * Playlists / Vídeos
 *
 * Fonte de dados:
 * Cloudflare Worker → Firestore
 *
 * API:
 * https://rga-api.rga-api.workers.dev/api/playlists
 */

const API_URL =
    "https://rga-api.rga-api.workers.dev/api/playlists";


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

        async function carregarPlaylists() {
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


                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                if (!response.ok) {
                    throw new Error(
                        `API respondeu com HTTP ${response.status}.`
                    );
                }


                const resultado =
                    await response.json();


                if (
                    !resultado.ok
                ) {
                    throw new Error(
                        resultado.error ||
                        "A API não conseguiu carregar as playlists."
                    );
                }


                const playlists =
                    Array.isArray(
                        resultado.items
                    )
                        ? resultado.items
                        : [];


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
                                    ${iconeDisplay}
                                </span>

                                <h2>
                                    ${playlist.titulo || ""}
                                </h2>
                            </div>


                            <p
                                class="playlist-description"
                            >
                                ${playlist.descricao || ""}
                            </p>


                            <div
                                class="playlist-video"
                            >
                                <iframe
                                    src="https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
                                        playlist.playlistId || ""
                                    )}"
                                    title="${
                                        playlist.titulo ||
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


        // ======================================================
        // INICIALIZAR
        // ======================================================

        await carregarPlaylists();
    }
);
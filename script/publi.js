/**
 * Rádio Geração Ativa
 * Notícias
 *
 * Fonte de dados:
 * Firebase Realtime Database → noticias
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

const database = getDatabase(initializeApp(firebaseConfig, "rga-public-news"));

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    })[caractere]);
}


document.addEventListener("DOMContentLoaded", async () => {
    // ==========================================================
    // REFERÊNCIAS DO HTML
    // ==========================================================

    const gridNoticias =
        document.getElementById("grid-noticias");

    const modal =
        document.getElementById("noticiaModal");

    const closeModalBtn =
        document.getElementById("closeModal");

    // Referências dos campos dentro do Modal
    const modalImg =
        document.getElementById("modalImg");

    const modalTitulo =
        document.getElementById("modalTitulo");

    const modalData =
        document.getElementById("modalData");

    const modalTexto =
        document.getElementById("modalTexto");


    // ==========================================================
    // VALIDAÇÕES INICIAIS
    // ==========================================================

    if (!gridNoticias) {
        console.error(
            "Elemento #grid-noticias não encontrado."
        );

        return;
    }


    if (
        !modal ||
        !closeModalBtn ||
        !modalImg ||
        !modalTitulo ||
        !modalData ||
        !modalTexto
    ) {
        console.error(
            "Elementos do modal de notícia não foram encontrados."
        );

        return;
    }


    // ==========================================================
    // FORMATAÇÃO DE DATA
    // ==========================================================

    function formatarDataExibicao(
        dataISO
    ) {
        if (!dataISO) {
            return "";
        }

        if (
            dataISO.includes("-")
        ) {
            const partes =
                dataISO.split("-");

            if (
                partes.length === 3
            ) {
                const [
                    ano,
                    mes,
                    dia
                ] = partes;

                return `${dia}/${mes}/${ano}`;
            }
        }

        return dataISO;
    }


    // ==========================================================
    // ABRIR MODAL
    // ==========================================================

    function abrirModal(
        noticia
    ) {
        modalTitulo.textContent =
            noticia.titulo || "";


        const dataFormatada =
            formatarDataExibicao(
                noticia.data
            );


        modalData.textContent =
            dataFormatada
                ? "Publicado em " +
                  dataFormatada
                : "Data indefinida";


        modalTexto.textContent =
            noticia.conteudo || "";


        if (noticia.imagem) {
            modalImg.src =
                noticia.imagem;

            modalImg.style.display =
                "block";

        } else {
            modalImg.src = "";

            modalImg.style.display =
                "none";
        }


        modal.classList.add(
            "active"
        );

        document.body.classList.add(
            "modal-aberto"
        );


        closeModalBtn.focus();
    }


    // ==========================================================
    // FECHAR MODAL
    // ==========================================================

    function fecharModal() {
        modal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "modal-aberto"
        );
    }


    // ==========================================================
    // EVENTOS DO MODAL
    // ==========================================================

    closeModalBtn.addEventListener(
        "click",
        fecharModal
    );


    // Fecha clicando no fundo escuro
    modal.addEventListener(
        "click",
        (event) => {
            if (
                event.target === modal
            ) {
                fecharModal();
            }
        }
    );


    // Fecha com ESC
    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "active"
                )
            ) {
                fecharModal();
            }
        }
    );


    // ==========================================================
    // CARREGAR NOTÍCIAS PELA API
    // ==========================================================

    function renderizarNoticias(noticias) {
        try {
            gridNoticias.innerHTML = `
                <p
                    style="
                        text-align: center;
                        width: 100%;
                        color: #666;
                        font-weight: 600;
                    "
                >
                    Carregando publicações...
                </p>
            `;


            gridNoticias.innerHTML =
                "";


            // --------------------------------------------------
            // BANCO VAZIO
            // --------------------------------------------------

            if (
                noticias.length === 0
            ) {
                gridNoticias.innerHTML = `
                    <p
                        style="
                            text-align: center;
                            width: 100%;
                            color: #666;
                            font-weight: 600;
                        "
                    >
                        Nenhuma publicação encontrada.
                        Volte mais tarde!
                    </p>
                `;

                return;
            }


            // --------------------------------------------------
            // RENDERIZAR NOTÍCIAS
            // --------------------------------------------------

            noticias.forEach(
                (noticia) => {
                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "noticia-card";


                    card.setAttribute(
                        "tabindex",
                        "0"
                    );


                    card.setAttribute(
                        "role",
                        "button"
                    );


                    card.setAttribute(
                        "aria-label",
                        `Ler notícia: ${
                            escaparHtml(noticia.titulo) ||
                            "Sem título"
                        }`
                    );


                    const dataFormatada =
                        formatarDataExibicao(
                            noticia.data
                        );


                    // ------------------------------------------------
                    // IMAGEM
                    // ------------------------------------------------

                    const imagemHTML =
                        noticia.imagem
                            ? `
                                <img
                                    src="${escaparHtml(noticia.imagem)}"
                                    alt="Prévia da notícia"
                                    class="noticia-img-preview"
                                    loading="lazy"
                                >
                              `
                            : "";


                    // ------------------------------------------------
                    // CARD
                    // ------------------------------------------------

                    card.innerHTML = `
                        ${imagemHTML}

                        <div
                            class="noticia-content-preview"
                        >
                            <span
                                class="noticia-data"
                            >
                                📅 ${escaparHtml(dataFormatada)}
                            </span>

                            <h3>
                                ${escaparHtml(noticia.titulo)}
                            </h3>

                            <p>
                                ${escaparHtml(noticia.resumo)}
                            </p>

                            <span
                                class="leia-mais"
                            >
                                Ler publicação completa ➔
                            </span>
                        </div>
                    `;


                    // ------------------------------------------------
                    // CLIQUE
                    // ------------------------------------------------

                    card.addEventListener(
                        "click",
                        () => {
                            abrirModal(
                                noticia
                            );
                        }
                    );


                    // ------------------------------------------------
                    // TECLADO
                    // ------------------------------------------------

                    card.addEventListener(
                        "keydown",
                        (event) => {
                            if (
                                event.key ===
                                    "Enter" ||
                                event.key ===
                                    " "
                            ) {
                                event.preventDefault();

                                abrirModal(
                                    noticia
                                );
                            }
                        }
                    );


                    gridNoticias.appendChild(
                        card
                    );
                }
            );

        } catch (error) {
            console.error(
                "Erro ao carregar notícias:",
                error
            );


            gridNoticias.innerHTML = `
                <p
                    style="
                        text-align: center;
                        width: 100%;
                        color: #b00020;
                        font-weight: 600;
                    "
                >
                    Não foi possível carregar as publicações.
                    Tente novamente mais tarde.
                </p>
            `;
        }
    }


    const noticiasRef = ref(database, "noticias");
    onValue(noticiasRef, (snapshot) => {
        const dados = snapshot.val() || {};
        renderizarNoticias(Object.values(dados));
    }, (error) => {
        console.error("Erro ao carregar notícias:", error);
        gridNoticias.innerHTML = `
            <p class="noticias-feedback">
                Não foi possível carregar as publicações. Tente novamente mais tarde.
            </p>
        `;
    });
});
/**
 * Rádio Geração Ativa
 * Notícias
 *
 * Fonte de dados:
 * Firebase Realtime Database → noticias
 */

import { database } from "./firebase-config.js";
import { onValue, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { resolveIcon, renderIconMarkup, ICON_MAP, ICON_DEFAULT } from "./icon-catalog.js";

console.debug("[RGA Notícias] Using centralized Firebase config");

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

    const gridNoticias = document.getElementById("grid-noticias");
    if (!gridNoticias) {
        console.error("[RGA Notícias] Elemento #grid-noticias não encontrado");
        return;
    }

    const modal = document.getElementById("noticiaModal");
    if (!modal) {
        console.error("[RGA Notícias] Elemento #noticiaModal não encontrado");
        return;
    }

    const closeModalBtn = document.getElementById("closeModal");
    if (!closeModalBtn) {
        console.error("[RGA Notícias] Elemento #closeModal não encontrado");
        return;
    }

    // Referências dos campos dentro do Modal
    const modalImg = document.getElementById("modalImg");
    if (!modalImg) {
        console.error("[RGA Notícias] Elemento #modalImg não encontrado");
        return;
    }

    const modalTitulo = document.getElementById("modalTitulo");
    if (!modalTitulo) {
        console.error("[RGA Notícias] Elemento #modalTitulo não encontrado");
        return;
    }

    const modalData = document.getElementById("modalData");
    if (!modalData) {
        console.error("[RGA Notícias] Elemento #modalData não encontrado");
        return;
    }

    const modalTexto = document.getElementById("modalTexto");
    if (!modalTexto) {
        console.error("[RGA Notícias] Elemento #modalTexto não encontrado");
        return;
    }


    // ==========================================================
    // VALIDAÇÕES INICIAIS
    // ==========================================================

    if (!gridNoticias) {
        console.error("Elemento #grid-noticias não encontrado.");
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
        console.error("Elementos do modal de notícia não foram encontrados.");
        return;
    }


    // ==========================================================
    // FORMATAÇÃO DE DATA (CORRIGIDO)
    // ==========================================================

    function formatarDataExibicao(data) {
        if (!data) return "";
        try {
            // Tenta parsear como ISO (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
                const [ano, mes, dia] = data.split("-");
                return `${dia}/${mes}/${ano}`;
            }
            // Tenta parsear como BR (DD/MM/YYYY)
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
                return data;
            }
            // Tenta parsear como BR com hífen (DD-MM-YYYY)
            if (/^\d{2}-\d{2}-\d{4}$/.test(data)) {
                const [dia, mes, ano] = data.split("-");
                return `${dia}/${mes}/${ano}`;
            }
            return data;
        } catch {
            return data;
        }
    }


    // ==========================================================
    // ABRIR MODAL
    // ==========================================================

    function abrirModal(noticia) {
        modalTitulo.textContent = noticia.titulo || "";

        const dataFormatada = formatarDataExibicao(noticia.data);

        modalData.textContent = dataFormatada ? "Publicado em " + dataFormatada : "Data indefinida";

        // CORREÇÃO: campo conteudo vs texto
        modalTexto.textContent = noticia.conteudo || noticia.texto || "";

        if (noticia.imagem) {
            modalImg.src = noticia.imagem;
            modalImg.style.display = "block";
        } else {
            modalImg.src = "";
            modalImg.style.display = "none";
        }

        modal.classList.add("active");
        document.body.classList.add("modal-aberto");
        closeModalBtn.focus();
    }


    // ==========================================================
    // FECHAR MODAL
    // ==========================================================

    function fecharModal() {
        modal.classList.remove("active");
        document.body.classList.remove("modal-aberto");
    }


    // ==========================================================
    // EVENTOS DO MODAL
    // ==========================================================

    closeModalBtn.addEventListener("click", fecharModal);

    // Fecha clicando no fundo escuro
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            fecharModal();
        }
    });

    // Fecha com ESC
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
            fecharModal();
        }
    });


    // ==========================================================
    // CARREGAR NOTÍCIAS PELA API
    // ==========================================================

    function renderizarNoticias(noticias) {
        try {
            gridNoticias.innerHTML = `<p style="text-align: center; width: 100%; color: #666; font-weight: 600;">Carregando publicações...</p>`;
            gridNoticias.innerHTML = "";

            // --------------------------------------------------
            // BANCO VAZIO
            // --------------------------------------------------
            if (noticias.length === 0) {
                gridNoticias.innerHTML = `<p style="text-align: center; width: 100%; color: #666; font-weight: 600;">Nenhuma publicação encontrada. Volte mais tarde!</p>`;
                return;
            }

            // --------------------------------------------------
            // RENDERIZAR NOTÍCIAS
            // --------------------------------------------------
            noticias.forEach((noticia) => {
                const card = document.createElement("article");
                card.className = "noticia-card";
                card.setAttribute("tabindex", "0");
                card.setAttribute("role", "button");
                card.setAttribute("aria-label", `Ler notícia: ${escaparHtml(noticia.titulo) || "Sem título"}`);

                const dataFormatada = formatarDataExibicao(noticia.data);

                // IMAGEM
                const imagemHTML = noticia.imagem
                    ? `<img src="${escaparHtml(noticia.imagem)}" alt="Prévia da notícia" class="noticia-img-preview" loading="lazy">`
                    : "";

                // CARD
                const iconeNomeNoticia = resolveIcon(noticia.icone || "");
                const iconeItemNoticia = ICON_MAP[iconeNomeNoticia] || ICON_MAP[ICON_DEFAULT];
                const iconeLabelNoticia = iconeItemNoticia.label;

                card.innerHTML = `
                    ${imagemHTML}
                    <div class="noticia-content-preview">
                        <span class="tag">
                            ${renderIconMarkup(iconeNomeNoticia)}
                            <span class="tag-label">${iconeLabelNoticia}</span>
                        </span>
                        <span class="noticia-data">
                            📅 ${escaparHtml(dataFormatada)}
                        </span>
                        <h3>${escaparHtml(noticia.titulo)}</h3>
                        <p>${escaparHtml(noticia.resumo)}</p>
                        <span class="leia-mais">Ler publicação completa →</span>
                    </div>
                `;

                // CLIQUE
                card.addEventListener("click", () => abrirModal(noticia));

                // TECLADO
                card.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        abrirModal(noticia);
                    }
                });

                gridNoticias.appendChild(card);
            });

        } catch (error) {
            console.error("Erro ao carregar notícias:", error);
            gridNoticias.innerHTML = `<p style="text-align: center; width: 100%; color: #b00020; font-weight: 600;">Não foi possível carregar as publicações. Tente novamente mais tarde.</p>`;
        }
    }

    const noticiasRef = ref(database, "noticias");
    onValue(noticiasRef, (snapshot) => {
        console.debug("[RGA Notícias] Dados recebidos do Firebase");
        const dados = snapshot.val();
        console.debug("[RGA Notícias] Valor:", dados);

        if (dados && typeof dados === 'object' && !Array.isArray(dados)) {
            console.debug("[RGA Notícias] Dados são objeto válido, processando...");
            try {
                renderizarNoticias(Object.values(dados));
            } catch (error) {
                console.error("[RGA Notícias] Erro ao renderizar notícias:", error);
                if (gridNoticias) {
                    gridNoticias.innerHTML = `<p class="noticias-feedback">Erro ao processar os dados das notícias. Tente novamente mais tarde.</p>`;
                }
            }
        } else {
            console.debug("[RGA Notícias] Dados não são objeto ou são null:", dados);
            renderizarNoticias([]);
        }
    }, (error) => {
        console.error("[RGA Notícias] Erro ao carregar notícias:", error);
        if (gridNoticias) {
            gridNoticias.innerHTML = `<p class="noticias-feedback">Não foi possível carregar as publicações. Tente novamente mais tarde.</p>`;
        } else {
            console.error("[RGA Notícias] #grid-noticias não disponível para mostrar mensagem de erro");
        }
    });
});

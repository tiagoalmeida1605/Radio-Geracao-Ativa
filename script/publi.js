import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Conectando no SEU projeto do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBNCSo_-gKlWZnxRY06hEH8YumECD4Yj54",
    authDomain: "radiogeracaoativa-playlist.firebaseapp.com",
    projectId: "radiogeracaoativa-playlist",
    storageBucket: "radiogeracaoativa-playlist.firebasestorage.app",
    messagingSenderId: "437305061004",
    appId: "1:437305061004:web:ee41f4d58d11d20af615a9",
    databaseURL: "https://radiogeracaoativa-playlist-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    // Referências do HTML
    const gridNoticias = document.getElementById("grid-noticias");
    const modal = document.getElementById("noticiaModal");
    const closeModalBtn = document.getElementById("closeModal");

    // Referências dos campos dentro do Modal
    const modalImg = document.getElementById("modalImg");
    const modalTitulo = document.getElementById("modalTitulo");
    const modalData = document.getElementById("modalData");
    const modalTexto = document.getElementById("modalTexto");

    function formatarDataExibicao(dataISO) {
        if (!dataISO) return "";
        if (dataISO.includes("-")) {
            const partes = dataISO.split("-");
            if (partes.length === 3) {
                const [ano, mes, dia] = partes;
                return `${dia}/${mes}/${ano}`;
            }
        }
        return dataISO;
    }

    function abrirModal(noticia) {
        modalTitulo.textContent = noticia.titulo || '';
        const dataFormatada = formatarDataExibicao(noticia.data);
        modalData.textContent = dataFormatada ? "Publicado em " + dataFormatada : 'Data indefinida';
        modalTexto.textContent = noticia.conteudo || '';

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

    function fecharModal() {
        modal.classList.remove("active");
        document.body.classList.remove("modal-aberto");
    }

    // LÓGICA DE FECHAR O MODAL
    closeModalBtn.addEventListener("click", fecharModal);

    // Se o usuário clicar fora da caixinha (no fundo escuro), fecha também
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // Fechar ao pressionar a tecla ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            fecharModal();
        }
    });

    // BUSCA AS NOTÍCIAS NO BANCO DE DADOS
    const noticiasRef = ref(database, "noticias");

    onValue(noticiasRef, (snapshot) => {
        gridNoticias.innerHTML = "";
        const dadosFirebase = snapshot.val();

        if (!dadosFirebase) {
            gridNoticias.innerHTML = `
                <p style="text-align: center; width: 100%; color: #666; font-weight: 600;">
                    Nenhuma publicação encontrada. Volte mais tarde!
                </p>`;
            return;
        }

        // Pega as notícias e inverte a ordem (para a mais recente aparecer primeiro)
        const chavesNoticias = Object.keys(dadosFirebase).reverse();

        chavesNoticias.forEach((key) => {
            const noticia = dadosFirebase[key];
            const card = document.createElement("article");
            card.className = "noticia-card";
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Ler notícia: ${noticia.titulo || 'Sem título'}`);

            const dataFormatada = formatarDataExibicao(noticia.data);

            // Cria o visual da PRÉVIA
            const imagemHTML = noticia.imagem
                ? `<img src="${noticia.imagem}" alt="Prévia da notícia" class="noticia-img-preview" loading="lazy">`
                : '';

            card.innerHTML = `
                ${imagemHTML}
                <div class="noticia-content-preview">
                    <span class="noticia-data">📅 ${dataFormatada}</span>
                    <h3>${noticia.titulo || ''}</h3>
                    <p>${noticia.resumo || ''}</p>
                    <span class="leia-mais">Ler publicação completa ➔</span>
                </div>
            `;

            // EVENTO DE CLIQUE: Quando clicar no card, joga os dados para o Modal e abre
            card.addEventListener("click", () => abrirModal(noticia));

            // Suporte para navegação via teclado (Enter ou Espaço)
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    abrirModal(noticia);
                }
            });

            gridNoticias.appendChild(card);
        });
    });
});
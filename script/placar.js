import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB2Wl8jI-0u69DpH-vsjfsAtyNhd7Nzbcg",
    authDomain: "placar-jogos-da-amizade-rga.firebaseapp.com",
    databaseURL: "https://placar-jogos-da-amizade-rga-default-rtdb.firebaseio.com",
    projectId: "placar-jogos-da-amizade-rga",
    storageBucket: "placar-jogos-da-amizade-rga.firebasestorage.app",
    messagingSenderId: "844479391049",
    appId: "1:844479391049:web:a99846198d047c5c162698",
    measurementId: "G-PYNXJ4MVXE"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const select = document.getElementById("jogoSelect");
let desativarEscutadorAnterior = null; // Guarda a função para limpar o canal anterior

// 1. CARREGA A LISTA DE JOGOS NO SELECT
async function carregarListaJogos() {
    try {
        const snapshot = await get(ref(db, "jogos"));
        const jogos = snapshot.val();
        
        if (!jogos) {
            select.innerHTML = "<option>Nenhum jogo encontrado</option>";
            return;
        }

        select.innerHTML = ""; // Limpa o "Carregando..."

        for (const id in jogos) {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = `${jogos[id].modalidade} - ${jogos[id].timeA} x ${jogos[id].timeB}`;
            select.appendChild(option);
        }

        // Liga o monitoramento em tempo real para o primeiro jogo da lista encontrado
        monitorarJogoTempoReal();
    } catch (error) {
        console.error("Erro ao buscar lista de jogos:", error);
    }
}

// 2. FUNÇÃO QUE ESCUTA O BANCO EM TEMPO REAL (SEM DAR F5)
function monitorarJogoTempoReal() {
    const jogoSelecionado = select.value;
    if (!jogoSelecionado) return;

    // Se o usuário trocar de jogo no select, desliga o monitoramento do jogo anterior
    if (typeof desativarEscutadorAnterior === "function") {
        desativarEscutadorAnterior();
    }

    const jogoRef = ref(db, `jogos/${jogoSelecionado}`);
    
    // O 'onValue' fica escutando a nuvem 24/7. Mudou lá, muda aqui na hora!
    desativarEscutadorAnterior = onValue(jogoRef, (snapshot) => {
        const jogo = snapshot.val();
        if (!jogo) return;

        // Atualiza os textos e placares na tela do visitante na hora
        document.getElementById("modalidade").textContent = jogo.modalidade || "Sem modalidade";
        document.getElementById("timeA").textContent = jogo.timeA || "Time A";
        document.getElementById("timeB").textContent = jogo.timeB || "Time B";
        
        // Garante que se o placar vier vazio ou indefinido, ele mostre 0
        document.getElementById("placarA").textContent = juego.placarA !== undefined ? jogo.placarA : 0;
        document.getElementById("placarB").textContent = juego.placarB !== undefined ? jogo.placarB : 0;
        
        // Atualiza as informações de rodapé do card
        document.getElementById("status-view").textContent = jogo.status || "---";
        document.getElementById("periodo-view").textContent = jogo.periodo || "---";
        document.getElementById("atualizacao-view").textContent = jogo.ultimaAtualizacao || "---";
    }, (error) => {
        console.error("Erro no escutador em tempo real:", error);
    });
}

// Escuta a mudança de jogo no Select Box do HTML
select.addEventListener("change", monitorarJogoTempoReal);

// Dispara a função inicial ao carregar a página
carregarListaJogos();
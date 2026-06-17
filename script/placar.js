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

// Inicialização estável do banco de dados
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const select = document.getElementById("jogoSelect");
let removerEscutadorAnterior = null; 

// 1. CARREGA A LISTAGEM INICIAL DE JOGOS NO SELECT DO HTML
async function carregarListaDeJogos() {
    try {
        const snapshot = await get(ref(db, "jogos"));
        const listaJogos = snapshot.val();
        
        if (!listaJogos) {
            select.innerHTML = "<option>Nenhum jogo ativo no momento</option>";
            return;
        }

        select.innerHTML = ""; // Apaga o texto temporário de carregamento

        for (const idDoJogo in listaJogos) {
            const option = document.createElement("option");
            option.value = idDoJogo;
            option.textContent = `${listaJogos[idDoJogo].modalidade} - ${listaJogos[idDoJogo].timeA} x ${listaJogos[idDoJogo].timeB}`;
            select.appendChild(option);
        }

        // Liga o monitorador em tempo real apontando para o primeiro jogo da lista
        monitorarJogoEmTempoReal();
    } catch (erro) {
        console.error("Erro ao processar lista de jogos do Firebase:", erro);
    }
}

// 2. CONECTA COM A NUVEM E ATUALIZA A TELA DO VISITANTE SEM F5
function monitorarJogoEmTempoReal() {
    const jogoSelecionadoId = select.value;
    if (!jogoSelecionadoId) return;

    // Se o usuário mudar o select, remove a escuta do jogo anterior para liberar memória
    if (typeof removerEscutadorAnterior === "function") {
        removerEscutadorAnterior();
    }

    const jogoReferencia = ref(db, `jogos/${jogoSelecionadoId}`);
    
    // Liga o canal de escuta aberta 'onValue'
    removerEscutadorAnterior = onValue(jogoReferencia, (snapshot) => {
        const dadosDoJogo = snapshot.val();
        if (!dadosDoJogo) return;

        // Renderiza as strings de texto na tela do visitante
        document.getElementById("modalidade").textContent = dadosDoJogo.modalidade || "Modalidade";
        document.getElementById("timeA").textContent = dadosDoJogo.timeA || "Time A";
        document.getElementById("timeB").textContent = dadosDoJogo.timeB || "Time B";
        
        // Garante a exibição correta dos valores numéricos dos placares
        document.getElementById("placarA").textContent = dadosDoJogo.placarA !== undefined ? dadosDoJogo.placarA : 0;
        document.getElementById("placarB").textContent = dadosDoJogo.placarB !== undefined ? dadosDoJogo.placarB : 0;
        
        // Renderiza os dados informativos do rodapé do card
        document.getElementById("status-view").textContent = dadosDoJogo.status || "---";
        document.getElementById("periodo-view").textContent = dadosDoJogo.periodo || "---";
        document.getElementById("atualizacao-view").textContent = dadosDoJogo.ultimaAtualizacao || "---";
    }, (erroConexao) => {
        console.error("Erro crítico na conexão em tempo real:", erroConexao);
    });
}

// Escuta as alterações feitas na caixa de seleção pelo visitante
select.addEventListener("change", monitorarJogoEmTempoReal);

// Dispara o carregamento do script
carregarListaDeJogos();
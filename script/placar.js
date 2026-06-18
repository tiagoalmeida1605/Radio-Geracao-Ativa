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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const select = document.getElementById("jogoSelect");
let escutadorAtivo = null;

// Carrega as modalidades diretamente no select ao abrir a página
async function carregarModalidadesNoSelectVisitor() {
    try {
        const snapshot = await get(ref(db, "jogos"));
        const jogos = snapshot.val();
        
        select.innerHTML = '<option value="">Escolha a Modalidade...</option>';

        if (!jogos) {
            select.innerHTML = '<option value="">Nenhuma modalidade ativa</option>';
            return;
        }

        for (const id in jogos) {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = jogos[id].modalidade || "Sem Nome";
            select.appendChild(option);
        }
    } catch (erro) {
        console.error("Erro ao buscar modalidades:", erro);
        select.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

// Fica a ouvir as atualizações automáticas do Admin em tempo real
function monitorarPartidaEmTempoReal() {
    const jogoSelecionadoId = select.value;

    if (!jogoSelecionadoId) {
        limparTelaPlacar();
        return;
    }

    // Desliga a escuta anterior para economizar dados
    if (escutadorAtivo) {
        escutadorAtivo(); 
    }

    const jogoReferencia = ref(db, `jogos/${jogoSelecionadoId}`);

    escutadorAtive = onValue(jogoReferencia, (snapshot) => {
        const dadosDoJogo = snapshot.val();
        if (!dadosDoJogo) return;

        // Atualiza a interface em tempo real usando as IDs oficiais
        document.getElementById("modalidade").textContent = dadosDoJogo.modalidade || "Modalidade";
        document.getElementById("timeA").textContent = dadosDoJogo.timeA || "Time A";
        document.getElementById("timeB").textContent = dadosDoJogo.timeB || "Time B";
        document.getElementById("placarA").textContent = dadosDoJogo.placarA !== undefined ? dadosDoJogo.placarA : 0;
        document.getElementById("placarB").textContent = dadosDoJogo.placarB !== undefined ? dadosDoJogo.placarB : 0;
        
        if (document.getElementById("status-view")) document.getElementById("status-view").textContent = dadosDoJogo.status || "---";
        if (document.getElementById("periodo-view")) document.getElementById("periodo-view").textContent = dadosDoJogo.periodo || "---";
        if (document.getElementById("atualizacao-view")) document.getElementById("atualizacao-view").textContent = dadosDoJogo.ultimaAtualizacao || "---";
    });
}

function limparTelaPlacar() {
    document.getElementById("modalidade").textContent = "Selecione uma modalidade acima";
    document.getElementById("timeA").textContent = "---";
    document.getElementById("timeB").textContent = "---";
    document.getElementById("placarA").textContent = "0";
    document.getElementById("placarB").textContent = "0";
    if (document.getElementById("status-view")) document.getElementById("status-view").textContent = "---";
    if (document.getElementById("periodo-view")) document.getElementById("periodo-view").textContent = "---";
    if (document.getElementById("atualizacao-view")) document.getElementById("atualizacao-view").textContent = "---";
}

select.addEventListener("change", monitorarPartidaEmTempoReal);
carregarModalidadesNoSelectVisitor();
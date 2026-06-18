import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

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

let juegoAtual = null;
let pontosInternosA = 0;
let pontosInternosB = 0;

const select = document.getElementById("jogoSelect");

// Login por Senha Seguro contra Alunos
document.getElementById('form-bloqueio-rga').addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('senha-admin').value === "rga26") {
        document.getElementById('bloqueio-tela').style.display = 'none';
        document.getElementById('admin-painel').style.display = 'block';
        liberarConfiguracoesDoPainel();
    } else {
        alert("Senha incorreta! Acesso negado.");
        document.getElementById('senha-admin').value = "";
    }
});

function liberarConfiguracoesDoPainel() {
    carregarModalidadesNoSelect();

    // Eventos dos botões com Autosave imediato
    document.getElementById("maisA").addEventListener("click", () => { pontosInternosA++; atualizarTelaAdmin(); salvarAutomatico(); });
    document.getElementById("menosA").addEventListener("click", () => { if (pontosInternosA > 0) pontosInternosA--; atualizarTelaAdmin(); salvarAutomatico(); });
    document.getElementById("maisB").addEventListener("click", () => { pontosInternosB++; atualizarTelaAdmin(); salvarAutomatico(); });
    document.getElementById("menosB").addEventListener("click", () => { if (pontosInternosB > 0) pontosInternosB--; atualizarTelaAdmin(); salvarAutomatico(); });

    // Autosave ao terminar de digitar ou mudar campos (blur/change)
    document.getElementById("nomeTimeA").addEventListener("blur", salvarAutomatico);
    document.getElementById("nomeTimeB").addEventListener("blur", salvarAutomatico);
    document.getElementById("status").addEventListener("change", salvarAutomatico);
    document.getElementById("periodo").addEventListener("blur", salvarAutomatico);

    select.addEventListener("change", carregarJogo);
}

// Carrega o Select mostrando APENAS a modalidade esportiva
async function carregarModalidadesNoSelect() {
    const snapshot = await get(ref(db, "jogos"));
    const jogos = snapshot.val();
    select.innerHTML = '<option value="">Escolha a Modalidade...</option>'; 

    for (const id in jogos) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = jogos[id].modalidade || "Sem modalidade"; 
        select.appendChild(option);
    }
}

async function carregarJogo() {
    juegoAtual = select.value;
    if (!juegoAtual) {
        document.getElementById("modalidade").textContent = "Selecione uma modalidade acima";
        return;
    }

    const snapshot = await get(ref(db, `jogos/${juegoAtual}`));
    const jogo = snapshot.val();

    if (jogo) {
        document.getElementById("modalidade").textContent = jogo.modalidade || "Sem modalidade";
        document.getElementById("nomeTimeA").value = jogo.timeA || "";
        document.getElementById("nomeTimeB").value = jogo.timeB || "";
        
        pontosInternosA = jogo.placarA !== undefined ? jogo.placarA : 0;
        pontosInternosB = jogo.placarB !== undefined ? jogo.placarB : 0;

        atualizarTelaAdmin();

        document.getElementById("status").value = jogo.status || "Ao Vivo";
        document.getElementById("periodo").value = jogo.periodo || "";
    }
}

function atualizarTelaAdmin() {
    document.getElementById("placarA").textContent = pontosInternosA;
    document.getElementById("placarB").textContent = pontosInternosB;
}

// Função nativa de Autosave
async function salvarAutomatico() {
    if (!juegoAtual) return;

    try {
        const jogoRef = ref(db, `jogos/${juegoAtual}`);
        const dadosParaAtualizar = {
            timeA: document.getElementById("nomeTimeA").value,
            timeB: document.getElementById("nomeTimeB").value,
            placarA: Number(pontosInternosA),
            placarB: Number(pontosInternosB),
            status: document.getElementById("status").value,
            periodo: document.getElementById("periodo").value,
            ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR")
        };

        await update(jogoRef, dadosParaAtualizar);
        console.log("Salvo automaticamente no Firebase!");
    } catch (erro) {
        console.error("Erro no autosave:", erro);
    }
}
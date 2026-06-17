import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);
const db = getDatabase(app);

let juegoAtual = null;
let valorPontosA = 0;
let valorPontosB = 0;

const select = document.getElementById("jogoSelect");

// ==========================================
// ESCUTADOR DO FORMULÁRIO DE SENHA (SUBMIT)
// ==========================================
document.getElementById('form-bloqueio-rga').addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que a página dê F5 ao enviar o formulário
    
    const senhaDigitada = document.getElementById('senha-admin').value;
    const senhaCorreta = "rga2026"; // SUA SENHA AQUI

    if (senhaDigitada === senhaCorreta) {
        // Some com a tela de bloqueio
        document.getElementById('bloqueio-tela').style.display = 'none';
        // Libera e exibe o painel administrativo original
        document.getElementById('admin-painel').style.display = 'block';
        
        // Ativa o Firebase e os botões do placar
        liberarConfiguracoesDoPainel();
    } else {
        alert("Senha incorreta! Acesso negado.");
        document.getElementById('senha-admin').value = "";
    }
});

// ==========================================
// FUNÇÕES DO PLACAR (SÓ RODAM SE ACERTAR A SENHA)
// ==========================================
function liberarConfiguracoesDoPainel() {
    carregarJogos();

    document.getElementById("maisA").addEventListener("click", () => {
        valorPontosA++;
        atualizarTela();
    });

    document.getElementById("menosA").addEventListener("click", () => {
        if (valorPontosA > 0) {
            valorPontosA--;
            atualizarTela();
        }
    });

    document.getElementById("maisB").addEventListener("click", () => {
        valorPontosB++;
        atualizarTela();
    });

    document.getElementById("menosB").addEventListener("click", () => {
        if (valorPontosB > 0) {
            valorPontosB--;
            atualizarTela();
        }
    });

    document.getElementById("salvar").addEventListener("click", async () => {
        await update(
            ref(db, `jogos/${juegoAtual}`),
            {
                placarA: valorPontosA,
                placarB: valorPontosB,
                status: document.getElementById("status").value,
                periodo: document.getElementById("periodo").value,
                ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR")
            }
        );
        alert("Placar atualizado com sucesso!");
    });

    select.addEventListener("change", carregarJogo);
}

// ==========================================
// FIREBASE INTEGRAÇÃO
// ==========================================
async function carregarJogos() {
    const snapshot = await get(ref(db, "jogos"));
    const jogos = snapshot.val();
    select.innerHTML = ""; 

    for (const id in jogos) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = jogos[id].modalidade + " - " + jogos[id].timeA + " x " + jogos[id].timeB;
        select.appendChild(option);
    }
    carregarJogo();
}

async function carregarJogo() {
    juegoAtual = select.value;
    const snapshot = await get(ref(db, `jogos/${juegoAtual}`));
    const jogo = snapshot.val();

    document.getElementById("modalidade").textContent = jogo.modalidade;
    document.getElementById("timeA").textContent = jogo.timeA;
    document.getElementById("timeB").textContent = jogo.timeB;
    
    valorPontosA = jogo.placarA;
    valorPontosB = jogo.placarB;

    atualizarTela();

    document.getElementById("status").value = jogo.status;
    document.getElementById("periodo").value = jogo.periodo;
}

function atualizarTela() {
    document.getElementById("placarA").textContent = valorPontosA;
    document.getElementById("placarB").textContent = valorPontosB;
}
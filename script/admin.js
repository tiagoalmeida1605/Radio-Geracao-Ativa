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
let pontosInternosA = 0;
let pontosInternosB = 0;

const select = document.getElementById("jogoSelect");

// ==========================================
// SISTEMA DE CADEADO - VALIDAÇÃO DA SENHA
// ==========================================
document.getElementById('form-bloqueio-rga').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const senhaDigitada = document.getElementById('senha-admin').value;
    const senhaCorreta = "rga2026"; 

    if (senhaDigitada === senhaCorreta) {
        document.getElementById('bloqueio-tela').style.display = 'none';
        document.getElementById('admin-painel').style.display = 'block';
        liberarConfiguracoesDoPainel();
    } else {
        alert("Senha incorreta! Acesso negado.");
        document.getElementById('senha-admin').value = "";
    }
});

// ==========================================
// ATIVAÇÃO DO PAINEL ADMIN (SÓ PÓS-SENHA)
// ==========================================
function liberarConfiguracoesDoPainel() {
    carregarJogos();

    // Eventos de clique dos botões de +1 e -1 do Admin
    document.getElementById("maisA").addEventListener("click", () => {
        pontosInternosA++;
        atualizarTelaAdmin();
    });

    document.getElementById("menosA").addEventListener("click", () => {
        if (pontosInternosA > 0) {
            pontosInternosA--;
            atualizarTelaAdmin();
        }
    });

    document.getElementById("maisB").addEventListener("click", () => {
        pontosInternosB++;
        atualizarTelaAdmin();
    });

    document.getElementById("menosB").addEventListener("click", () => {
        if (pontosInternosB > 0) {
            pontosInternosB--;
            atualizarTelaAdmin();
        }
    });

    // BOTÃO SALVAR - ENVIANDO DE FATO PARA O FIREBASE
    document.getElementById("salvar").addEventListener("click", async () => {
        if (!juegoAtual) {
            alert("Selecione um jogo válido antes de salvar!");
            return;
        }

        try {
            const jogoRef = ref(db, `jogos/${juegoAtual}`);
            
            // Dados exatos que o placar.js espera receber
            const dadosParaAtualizar = {
                placarA: Number(pontosInternosA),
                placarB: Number(pontosInternosB),
                status: document.getElementById("status").value,
                periodo: document.getElementById("periodo").value,
                ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR")
            };

            await update(jogoRef, dadosParaAtualizar);
            alert("Alterações salvas com sucesso no Firebase!");
        } catch (erro) {
            console.error("Erro ao salvar no Firebase:", erro);
            alert("Erro crítico ao salvar as alterações.");
        }
    });

    select.addEventListener("change", carregarJogo);
}

// ==========================================
// FUNÇÕES DE COMUNICAÇÃO COM O BANCO (ADMIN)
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
    if (!juegoAtual) return;

    const snapshot = await get(ref(db, `jogos/${juegoAtual}`));
    const jogo = snapshot.val();

    if (jogo) {
        document.getElementById("modalidade").textContent = jogo.modalidade || "Sem modalidade";
        document.getElementById("timeA").textContent = jogo.timeA || "Time A";
        document.getElementById("timeB").textContent = jogo.timeB || "Time B";
        
        // Sincroniza as variáveis numéricas com o que já está salvo no banco
        pontosInternosA = jogo.placarA !== undefined ? jogo.placarA : 0;
        pontosInternosB = jogo.placarB !== undefined ? jogo.placarB : 0;

        atualizarTelaAdmin();

        document.getElementById("status").value = jogo.status || "Ao Vivo";
        document.getElementById("periodo").value = jogo.periodo || "";
    }
}

// Atualiza o número dentro das divs do HTML do Admin
function atualizarTelaAdmin() {
    document.getElementById("placarA").textContent = pontosInternosA;
    document.getElementById("placarB").textContent = pontosInternosB;
}
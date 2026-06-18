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

function liberarConfiguracoesDoPainel() {
    carregarJogos();

    document.getElementById("maisA").addEventListener("click", () => { pontosInternosA++; atualizarTelaAdmin(); });
    document.getElementById("menosA").addEventListener("click", () => { if (pontosInternosA > 0) pontosInternosA--; atualizarTelaAdmin(); });
    document.getElementById("maisB").addEventListener("click", () => { pontosInternosB++; atualizarTelaAdmin(); });
    document.getElementById("menosB").addEventListener("click", () => { if (pontosInternosB > 0) pontosInternosB--; atualizarTelaAdmin(); });

    document.getElementById("salvar").addEventListener("click", async () => {
        if (!juegoAtual) {
            alert("Selecione um jogo antes de salvar!");
            return;
        }

        try {
            const jogoRef = ref(db, `jogos/${juegoAtual}`);
            
            // AGORA SALVAMOS TAMBÉM O NOME DOS TIMES QUE VOCÊ DIGITOU!
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
            alert("Sucesso! Placar e nomes salvos.");
        } catch (erro) {
            console.error("ERRO COMPLETO:", erro);
            alert("Erro ao salvar: " + erro.message);
        }
    });

    select.addEventListener("change", carregarJogo);
}

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
        
        // Puxa o nome dos times lá da nuvem e joga na caixa de texto
        document.getElementById("nomeTimeA").value = jogo.timeA || "Time A";
        document.getElementById("nomeTimeB").value = jogo.timeB || "Time B";
        
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
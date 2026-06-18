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
let pontosA = 0;
let pontosB = 0;

const select = document.getElementById("jogoSelect");

// Lógica de Autenticação
document.getElementById('form-bloqueio-rga').addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('senha-admin').value === "rga2026") {
        document.getElementById('bloqueio-tela').style.display = 'none';
        document.getElementById('admin-painel').style.display = 'block';
        carregarJogos();
    } else {
        alert("Senha incorreta!");
    }
});

// Função de salvamento no Firebase (O "coração" do autosave)
async function salvarNoFirebase() {
    if (!juegoAtual) return;
    try {
        const dados = {
            timeA: document.getElementById("nomeTimeA").value,
            timeB: document.getElementById("nomeTimeB").value,
            placarA: pontosA,
            placarB: pontosB,
            status: document.getElementById("status").value,
            periodo: document.getElementById("periodo").value,
            ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR")
        };
        await update(ref(db, `jogos/${juegoAtual}`), dados);
    } catch (e) {
        console.error("Erro ao salvar:", e);
    }
}

// Configurar Botões
document.getElementById("maisA").addEventListener("click", () => { pontosA++; atualizarUI(); salvarNoFirebase(); });
document.getElementById("menosA").addEventListener("click", () => { if(pontosA > 0) pontosA--; atualizarUI(); salvarNoFirebase(); });
document.getElementById("maisB").addEventListener("click", () => { pontosB++; atualizarUI(); salvarNoFirebase(); });
document.getElementById("menosB").addEventListener("click", () => { if(pontosB > 0) pontosB--; atualizarUI(); salvarNoFirebase(); });

// Eventos de salvamento para campos de texto (ao sair da caixa)
document.getElementById("nomeTimeA").addEventListener("blur", salvarNoFirebase);
document.getElementById("nomeTimeB").addEventListener("blur", salvarNoFirebase);
document.getElementById("status").addEventListener("change", salvarNoFirebase);
document.getElementById("periodo").addEventListener("blur", salvarNoFirebase);

function atualizarUI() {
    document.getElementById("placarA").textContent = pontosA;
    document.getElementById("placarB").textContent = pontosB;
}

async function carregarJogos() {
    const snapshot = await get(ref(db, "jogos"));
    const jogos = snapshot.val();
    select.innerHTML = "";
    for (const id in jogos) {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = `${jogos[id].modalidade} - ${jogos[id].timeA} vs ${jogos[id].timeB}`;
        select.appendChild(opt);
    }
}

select.addEventListener("change", async () => {
    juegoAtual = select.value;
    const snap = await get(ref(db, `jogos/${juegoAtual}`));
    const j = snap.val();
    pontosA = j.placarA || 0;
    pontosB = j.placarB || 0;
    document.getElementById("nomeTimeA").value = j.timeA || "";
    document.getElementById("nomeTimeB").value = j.timeB || "";
    document.getElementById("status").value = j.status || "Ao Vivo";
    document.getElementById("periodo").value = j.periodo || "";
    atualizarUI();
});
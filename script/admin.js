import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const db = getDatabase(initializeApp({
    apiKey: "AIzaSyB2Wl8jI-0u69DpH-vsjfsAtyNhd7Nzbcg",
    databaseURL: "https://placar-jogos-da-amizade-rga-default-rtdb.firebaseio.com",
    projectId: "placar-jogos-da-amizade-rga"
}));

let pontosA = 0, pontosB = 0;
const jogoRef = ref(db, 'jogos/futsal_01'); // Ajuste o ID aqui conforme necessário

// Função de salvamento automático
async function salvar() {
    await update(jogoRef, {
        timeA: document.getElementById("nomeTimeA").value,
        timeB: document.getElementById("nomeTimeB").value,
        placarA: pontosA,
        placarB: pontosB,
        status: document.getElementById("status").value,
        periodo: document.getElementById("periodo").value,
        ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR")
    });
}

// Botões de pontuação
document.getElementById("maisA").addEventListener("click", () => { pontosA++; updateUI(); salvar(); });
document.getElementById("menosA").addEventListener("click", () => { if(pontosA>0) pontosA--; updateUI(); salvar(); });
document.getElementById("maisB").addEventListener("click", () => { pontosB++; updateUI(); salvar(); });
document.getElementById("menosB").addEventListener("click", () => { if(pontosB>0) pontosB--; updateUI(); salvar(); });

// Autosave ao sair das caixas de texto (blur)
document.getElementById("nomeTimeA").addEventListener("blur", salvar);
document.getElementById("nomeTimeB").addEventListener("blur", salvar);
document.getElementById("status").addEventListener("change", salvar);
document.getElementById("periodo").addEventListener("blur", salvar);

function updateUI() {
    document.getElementById("placarA").textContent = pontosA;
    document.getElementById("placarB").textContent = pontosB;
}

// Inicialização: carrega o estado atual do banco
get(jogoRef).then(snap => {
    const d = snap.val();
    pontosA = d.placarA || 0;
    pontosB = d.placarB || 0;
    document.getElementById("nomeTimeA").value = d.timeA || "";
    document.getElementById("nomeTimeB").value = d.timeB || "";
    updateUI();
});
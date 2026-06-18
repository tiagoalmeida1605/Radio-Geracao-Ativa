import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB2Wl8jI-0u69DpH-vsjfsAtyNhd7Nzbcg",
    databaseURL: "https://placar-jogos-da-amizade-rga-default-rtdb.firebaseio.com",
    projectId: "placar-jogos-da-amizade-rga"
};

const db = getDatabase(initializeApp(firebaseConfig));

// Ajuste para o ID do jogo que você está transmitindo (ex: 'futsal_01')
const jogoRef = ref(db, 'jogos/futsal_01'); 

onValue(jogoRef, (snapshot) => {
    const d = snapshot.val();
    if (!d) return;

    document.getElementById("modalidade-view").textContent = d.modalidade;
    document.getElementById("nomeTimeA-view").textContent = d.timeA;
    document.getElementById("nomeTimeB-view").textContent = d.timeB;
    document.getElementById("placarA").textContent = d.placarA ?? 0;
    document.getElementById("placarB").textContent = d.placarB ?? 0;
    document.getElementById("status-view").textContent = d.status;
    document.getElementById("periodo-view").textContent = d.periodo;
});
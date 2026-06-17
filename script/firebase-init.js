// Importe as funções do Firebase (versão modular)
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
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

// Variáveis para controlar os valores locais antes de salvar
let pontuacaoA = 0;
let pontuacaoB = 0;

// Lógica dos botões
document.getElementById('maisA').addEventListener('click', () => {
    pontuacaoA++;
    document.getElementById('placarA').innerText = pontuacaoA;
});

document.getElementById('menosA').addEventListener('click', () => {
    if(pontuacaoA > 0) pontuacaoA--;
    document.getElementById('placarA').innerText = pontuacaoA;
});

// Botão Salvar (Envia para o Firebase)
document.getElementById('salvar').addEventListener('click', () => {
    const status = document.getElementById('status').value;
    const periodo = document.getElementById('periodo').value;

    update(ref(db, 'jogo_atual'), {
        placarA: pontuacaoA,
        placarB: pontuacaoB,
        status: status,
        periodo: periodo
    }).then(() => {
        alert("Placar atualizado com sucesso!");
    });
});
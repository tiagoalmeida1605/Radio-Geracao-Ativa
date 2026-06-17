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

let jogoAtual = null;

let placarA = 0;
let placarB = 0;

const select =
document.getElementById("jogoSelect");

async function carregarJogos() {

    const snapshot =
    await get(ref(db, "jogos"));

    const jogos =
    snapshot.val();

    for (const id in jogos) {

        const option =
        document.createElement("option");

        option.value = id;

        option.textContent =
        jogos[id].modalidade +
        " - " +
        jogos[id].timeA +
        " x " +
        jogos[id].timeB;

        select.appendChild(option);

    }

    carregarJogo();

}

async function carregarJogo() {

    jogoAtual =
    select.value;

    const snapshot =
    await get(
        ref(db, `jogos/${jogoAtual}`)
    );

    const jogo =
    snapshot.val();

    document
    .getElementById("modalidade")
    .textContent =
    jogo.modalidade;

    document
    .getElementById("timeA")
    .textContent =
    jogo.timeA;

    document
    .getElementById("timeB")
    .textContent =
    jogo.timeB;

    placarA =
    jogo.placarA;

    placarB =
    jogo.placarB;

    atualizarTela();

    document
    .getElementById("status")
    .value =
    jogo.status;

    document
    .getElementById("periodo")
    .value =
    jogo.periodo;

}

function atualizarTela() {

    document
    .getElementById("placarA")
    .textContent =
    placarA;

    document
    .getElementById("placarB")
    .textContent =
    placarB;

}

document
.getElementById("maisA")
.addEventListener("click", () => {

    placarA++;

    atualizarTela();

});

document
.getElementById("menosA")
.addEventListener("click", () => {

    if (placarA > 0) {

        placarA--;

        atualizarTela();

    }

});

document
.getElementById("maisB")
.addEventListener("click", () => {

    placarB++;

    atualizarTela();

});

document
.getElementById("menosB")
.addEventListener("click", () => {

    if (placarB > 0) {

        placarB--;

        atualizarTela();

    }

});

document
.getElementById("salvar")
.addEventListener("click", async () => {

    await update(
        ref(db, `jogos/${jogoAtual}`),
        {

            placarA,

            placarB,

            status:
            document
            .getElementById("status")
            .value,

            periodo:
            document
            .getElementById("periodo")
            .value,

            ultimaAtualizacao:
            new Date()
            .toLocaleTimeString("pt-BR")

        }
    );

    alert("Placar atualizado!");

});

select.addEventListener(
    "change",
    carregarJogo
);

carregarJogos();
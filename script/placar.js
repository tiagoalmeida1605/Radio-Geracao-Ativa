import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Configuração estável do seu Firebase
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

// Inicializando o aplicativo e banco de dados
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const select = document.getElementById("jogoSelect");
let escutadorAtivo = null; // Guarda a conexão em tempo real para podermos limpá-la ao trocar de esporte

// ==========================================================
// 1. CARREGA O MENÚ DE SELEÇÃO APENAS COM AS MODALIDADES
// ==========================================================
async function carregarModalidadesNoSelect() {
    try {
        const snapshot = await get(ref(db, "jogos"));
        const jogos = snapshot.val();
        
        // Limpa o select e coloca a opção padrão
        select.innerHTML = '<option value="">Escolha a Modalidade...</option>';

        if (!jogos) {
            console.warn("Nenhum jogo encontrado no banco de dados.");
            return;
        }

        // Preenche o select apenas com o nome da Modalidade/Esporte
        for (const id in jogos) {
            const option = document.createElement("option");
            option.value = id;
            // Exibe estritamente a modalidade (Ex: Futsal Masc, Vôlei Fem, etc.)
            option.textContent = jogos[id].modalidade || "Modalidade Sem Nome";
            select.appendChild(option);
        }
    } catch (erro) {
        console.error("Erro ao carregar lista de modalidades:", erro);
    }
}

// ==========================================================
// 2. ESCUTA E ATUALIZA A TELA DO VISITANTE EM TEMPO REAL
// ==========================================================
function monitorarPartidaEmTempoReal() {
    const jogoSelecionadoId = select.value;

    // Se o usuário limpou a seleção ou escolheu a opção padrão
    if (!jogoSelecionadoId) {
        limparTelaPlacar();
        return;
    }

    // Se já existia um jogo sendo monitorado antes, desliga ele para não gastar memória
    if (escutadorAtivo) {
        escutadorAtivo();
    }

    const jogoReferencia = ref(db, `jogos/${jogoSelecionadoId}`);

    // Abre o canal em tempo real (onValue) para atualizar no exato momento do clique do Admin
    escutadorAtivo = onValue(jogoReferencia, (snapshot) => {
        const dadosDoJogo = snapshot.val();
        
        if (!dadosDoJogo) {
            console.error("Dados da partida não encontrados.");
            return;
        }

        // Atualiza os elementos na tela do visitante usando os IDs do seu HTML
        document.getElementById("modalidade").textContent = dadosDoJogo.modalidade || "Modalidade";
        document.getElementById("timeA").textContent = dadosDoJogo.timeA || "Time A";
        document.getElementById("timeB").textContent = dadosDoJogo.timeB || "Time B";
        
        // Sincroniza as pontuações numéricas (evita dar 'undefined')
        document.getElementById("placarA").textContent = dadosDoJogo.placarA !== undefined ? dadosDoJogo.placarA : 0;
        document.getElementById("placarB").textContent = dadosDoJogo.placarB !== undefined ? dadosDoJogo.placarB : 0;
        
        // Atualiza as caixas informativas e rodapé
        if (document.getElementById("status-view")) {
            document.getElementById("status-view").textContent = dadosDoJogo.status || "---";
        }
        if (document.getElementById("periodo-view")) {
            document.getElementById("periodo-view").textContent = dadosDoJogo.periodo || "---";
        }
        if (document.getElementById("atualizacao-view")) {
            document.getElementById("atualizacao-view").textContent = dadosDoJogo.ultimaAtualizacao || "---";
        }

    }, (erroConexao) => {
        console.error("Erro crítico na sincronização em tempo real:", erroConexao);
    });
}

// Reseta as informações visuais caso nenhuma modalidade esteja selecionada
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

// Ouvinte para disparar a sincronização sempre que mudar a modalidade no Select
select.addEventListener("change", monitorarPartidaEmTempoReal);

// Dispara a carga inicial do script assim que a página abre
carregarModalidadesNoSelect();
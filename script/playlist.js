import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// 1. CONFIGURAÇÃO DO FIREBASE (Igual ao do seu admin)
const firebaseConfig = {
    apiKey: "AIzaSyBNCSo_-gKlWZnxRY06hEH8YumECD4Yj54",
    authDomain: "radiogeracaoativa-playlist.firebaseapp.com",
    projectId: "radiogeracaoativa-playlist",
    storageBucket: "radiogeracaoativa-playlist.firebasestorage.app",
    messagingSenderId: "437305061004",
    appId: "1:437305061004:web:ee41f4d58d11d20af615a9",
    measurementId: "G-SFVF2382KW",
    databaseURL: "https://radiogeracaoativa-playlist-default-rtdb.firebaseio.com/"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const gridDinamica = document.getElementById("grid-dinamica");

    // 2. BUSCA AS PLAYLISTS DA NUVEM EM TEMPO REAL
    const playlistsRef = ref(database, "playlists");

    onValue(playlistsRef, (snapshot) => {
        gridDinamica.innerHTML = "";
        const dadosFirebase = snapshot.val();

        // Se o banco estiver vazio, exibe aviso amigável
        if (!dadosFirebase) {
            gridDinamica.innerHTML = `
                <p style="text-align: center; width: 100%; color: #666; font-weight: 600;">
                   Nenhuma playlist foi adicionada pelo administrador ainda.
                </p>`;
            return;
        }

        // Percorre os nós do Firebase e renderiza os cards na tela
        Object.keys(dadosFirebase).forEach((key) => {
            const playlist = dadosFirebase[key];
            const iconeDisplay = playlist.icone || "📹";
            const article = document.createElement("article");
            article.className = "playlist-card";

            article.innerHTML = `
                <div class="playlist-header">
                    <span class="playlist-icon" aria-hidden="true">${iconeDisplay}</span>
                    <h2>${playlist.titulo}</h2>
                </div>
                <p class="playlist-description">${playlist.descricao}</p>
                <div class="playlist-video">
                    <iframe
                            src="https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}"
                            title="${playlist.titulo} - Rádio Geração Ativa"
                            loading="lazy"
                            allowfullscreen>
                    </iframe>
                </div>
                <a class="playlist-btn" href="https://www.youtube.com/playlist?list=${playlist.playlistId}" target="_blank" rel="noopener noreferrer">Abrir Playlist</a>
            `;

            gridDinamica.appendChild(article);
        });
    });
});
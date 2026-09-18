/**
 * Configuração centralizada do Firebase
 * Usado por todos os módulos do projeto
 * Centraliza a inicialização para evitar duplicação e facilitar manutenção
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNCSo_-gKlWZnxRY06hEH8YumECD4Yj54",
    authDomain: "radiogeracaoativa-playlist.firebaseapp.com",
    databaseURL: "https://radiogeracaoativa-playlist-default-rtdb.firebaseio.com",
    projectId: "radiogeracaoativa-playlist",
    storageBucket: "radiogeracaoativa-playlist.firebasestorage.app",
    messagingSenderId: "437305061004",
    appId: "1:437305061004:web:ee41f4d58d11d20af615a9",
    measurementId: "G-SFVF2382KW"
};

// Inicializa uma única instância do Firebase para todo o projeto
const firebaseApp = initializeApp(firebaseConfig, "rga-shared");
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, database, auth, firebaseConfig };

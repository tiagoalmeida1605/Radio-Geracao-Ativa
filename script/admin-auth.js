import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig, "rga-auth");
export const auth = getAuth(app);
const database = getDatabase(app);

export const PAPEIS_VALIDOS = new Set(["admin", "playlist", "publicador"]);

export const NOMES_PAPEL = {
    admin: "Administrador",
    publicador: "Publicador de Notícias",
    playlist: "Editor de Vídeos"
};

export async function autenticarUsuario(email, senha) {
    const credencial = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        senha
    );

    const papel = await obterPapel(credencial.user);

    if (!PAPEIS_VALIDOS.has(papel)) {
        await signOut(auth);
        const erro = new Error("Esta conta não possui um papel administrativo válido.");
        erro.code = "auth/missing-role";
        throw erro;
    }

    return { usuario: credencial.user, papel };
}

export async function obterPapel(usuario) {
    if (!usuario) {
        return null;
    }

    const snapshot = await get(ref(database, `usuarios/${usuario.uid}/papel`));
    const papel = snapshot.val();
    return PAPEIS_VALIDOS.has(papel) ? papel : null;
}

export function observarAutenticacao(callback) {
    return onAuthStateChanged(auth, callback);
}

export function encerrarSessao() {
    return signOut(auth);
}

export function usuarioAtual() {
    return auth.currentUser;
}

import { firebaseApp, database, auth } from "./firebase-config.js";

// Re-exporta as instâncias centralizadas
export { firebaseApp, auth, database };

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

    const perfil = await obterPerfil(credencial.user);

    if (!perfil || !PAPEIS_VALIDOS.has(perfil.papel)) {
        await signOut(auth);
        const erro = new Error("Esta conta não possui um papel administrativo válido.");
        erro.code = "auth/missing-role";
        throw erro;
    }

    return { usuario: credencial.user, perfil };
}

export async function obterPerfil(usuario) {
    if (!usuario) {
        return null;
    }

    const snapshot = await get(ref(database, `usuarios/${usuario.uid}`));
    const perfil = snapshot.val();

    if (!perfil) {
        return null;
    }

    const papelValido = String(perfil.papel).trim();
    if (!PAPEIS_VALIDOS.has(papelValido)) {
        return null;
    }

    return {
        identificador: String(perfil.identificador || ""),
        nome: String(perfil.nome || NOMES_PAPEL[papelValido]),
        papel: papelValido
    };
}

export async function obterPapel(usuario) {
    const perfil = await obterPerfil(usuario);
    return perfil?.papel || null;
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

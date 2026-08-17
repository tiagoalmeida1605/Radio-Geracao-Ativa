export const CONTAS = [
    { papel: "admin", hash: "f374d04f033f52346e2153151af9cfe761fab6959bbd92e54f0a37738d8963aa" },
    { papel: "publicador", hash: "df396909399def576a471a3402484be047541c590ea72c6eced89aa6a65b3f6c" },
    { papel: "playlist", hash: "4f1a2dc11ff8f84b5e936f345665580ba9317a96eb3e414e8fdf058d0151308d" }
];

export const NOMES_PAPEL = {
    admin: "Administrador",
    publicador: "Publicador de Notícias",
    playlist: "Gerente de Playlists"
};

const CHAVE_HASH = "rga_autenticado";
const CHAVE_PAPEL = "rga_papel";

export async function criptografarSenha(texto) {
    const msgBuffer = new TextEncoder().encode(texto);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function obterContaAutenticada() {
    const hashSalvo = sessionStorage.getItem(CHAVE_HASH);
    const papelSalvo = sessionStorage.getItem(CHAVE_PAPEL);
    return CONTAS.find(c => c.hash === hashSalvo && c.papel === papelSalvo) || null;
}

export function salvarContaAutenticada(conta) {
    sessionStorage.setItem(CHAVE_HASH, conta.hash);
    sessionStorage.setItem(CHAVE_PAPEL, conta.papel);
}

export function encerrarContaAutenticada() {
    sessionStorage.removeItem(CHAVE_HASH);
    sessionStorage.removeItem(CHAVE_PAPEL);
}

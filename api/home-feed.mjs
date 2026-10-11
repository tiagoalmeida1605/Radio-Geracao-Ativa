const DATABASE_URL =
    "https://radiogeracaoativa-playlist-default-rtdb.firebaseio.com";

const LIMITE_NOTICIAS = 6;
const LIMITE_VIDEOS = 6;

function obterRegistros(dados) {
    if (Array.isArray(dados)) {
        return dados.map((item, index) => ({
            id: String(index),
            item
        }));
    }

    if (!dados || typeof dados !== "object") {
        return [];
    }

    return Object.entries(dados).map(([id, item]) => ({
        id,
        item
    }));
}

function interpretarData(valor) {
    if (!valor) return 0;
    if (typeof valor === "number") return valor;

    const data = String(valor).trim();
    let partes = data.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (partes) {
        return Date.UTC(
            Number(partes[1]),
            Number(partes[2]) - 1,
            Number(partes[3])
        );
    }

    partes = data.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);

    if (partes) {
        return Date.UTC(
            Number(partes[3]),
            Number(partes[2]) - 1,
            Number(partes[1])
        );
    }

    const timestamp = Date.parse(data);
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function listarNoticias(dados) {
    return obterRegistros(dados)
        .filter(({ item }) =>
            item && typeof item === "object" && !Array.isArray(item)
        )
        .map(({ id, item }) => ({
            id,
            tipo: "noticia",
            titulo: String(item.titulo ?? "Sem título"),
            resumo: String(item.resumo ?? item.texto ?? ""),
            imagem: typeof item.imagem === "string"
                ? item.imagem
                : null,
            icone: String(item.icone ?? "newspaper"),
            tags: Array.isArray(item.tags) ? item.tags : [],
            data: item.data ?? null,
            _ordem: interpretarData(item.data)
        }))
        .sort((a, b) =>
            b._ordem - a._ordem || b.id.localeCompare(a.id)
        )
        .slice(0, LIMITE_NOTICIAS)
        .map(({ _ordem, ...noticia }) => noticia);
}

function listarVideos(dados) {
    return obterRegistros(dados)
        .filter(({ item }) =>
            item && typeof item === "object" && !Array.isArray(item)
        )
        .reverse()
        .map(({ id, item }) => {
            const tipo = item.tipo === "video" ? "video" : "playlist";
            const videoId = String(item.videoId ?? "");
            const playlistId = String(item.playlistId ?? "");

            const videoValido = /^[a-zA-Z0-9_-]{11}$/.test(videoId);
            const playlistValida = /^[a-zA-Z0-9_-]+$/.test(playlistId);

            const idValido = tipo === "video"
                ? videoValido
                : playlistValida;

            const identificador = tipo === "video"
                ? videoId
                : playlistId;

            return {
                id,
                tipo,
                titulo: String(item.titulo ?? "Conteúdo da RGA"),
                descricao: String(item.descricao ?? ""),
                icone: String(item.icone ?? "video"),
                imagem: tipo === "video" && videoValido
                    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                    : null,
                url: idValido
                    ? tipo === "video"
                        ? `https://www.youtube.com/watch?v=${identificador}`
                        : `https://www.youtube.com/playlist?list=${identificador}`
                    : null
            };
        })
        .filter((video) => video.url)
        .slice(0, LIMITE_VIDEOS);
}

export default {
    async fetch(request) {
        if (request.method !== "GET") {
            return Response.json(
                { ok: false, erro: "Método não permitido." },
                { status: 405 }
            );
        }

        try {
            const [respostaNoticias, respostaVideos] = await Promise.all([
                fetch(`${DATABASE_URL}/noticias.json`, {
                    signal: AbortSignal.timeout(8000)
                }),
                fetch(`${DATABASE_URL}/playlists.json`, {
                    signal: AbortSignal.timeout(8000)
                })
            ]);

            if (!respostaNoticias.ok || !respostaVideos.ok) {
                console.error("[RGA API] Erro de leitura no Firebase.");

                return Response.json(
                    {
                        ok: false,
                        erro: "Não foi possível consultar os conteúdos da rádio."
                    },
                    { status: 502 }
                );
            }

            const [dadosNoticias, dadosVideos] = await Promise.all([
                respostaNoticias.json(),
                respostaVideos.json()
            ]);

            return Response.json(
                {
                    ok: true,
                    geradoEm: new Date().toISOString(),
                    noticias: listarNoticias(dadosNoticias),
                    videos: listarVideos(dadosVideos)
                },
                {
                    headers: {
                        "Cache-Control": "no-store"
                    }
                }
            );
        } catch (error) {
            console.error("[RGA API] Falha ao carregar o feed:", error);

            return Response.json(
                {
                    ok: false,
                    erro: "Não foi possível carregar os conteúdos agora."
                },
                { status: 502 }
            );
        }
    }
};
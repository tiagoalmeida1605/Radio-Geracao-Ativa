/**
 * Rádio Geração Ativa — Catálogo Centralizado de Ícones
 *
 * Fonte única de verdade para ícones, categorias, normalização e renderização.
 * Compartilhado entre o painel administrativo e as páginas públicas.
 *
 * Biblioteca: Lucide Icons (https://lucide.dev)
 */

// ─────────────────────────────────────────────────────────────────────────────
// VALOR PADRÃO
// ─────────────────────────────────────────────────────────────────────────────
export const ICON_DEFAULT = "video";

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO COMPLETO DE ÍCONES
// Cada entrada: { name, label, category, tags }
//   name     → nome Lucide (data-lucide="...")
//   label    → rótulo amigável exibido na UI
//   category → categoria para filtro
//   tags     → termos de busca em português e inglês
// ─────────────────────────────────────────────────────────────────────────────
export const ICON_CATALOG = [
    // ── Áudio ──────────────────────────────────────────────────────────────
    { name: "video", label: "Vídeo", category: "Áudio", tags: ["video", "filme", "camera"] },
    { name: "radio", label: "Rádio", category: "Áudio", tags: ["radio", "broadcast", "wave", "transmissao"] },
    { name: "mic", label: "Microfone", category: "Áudio", tags: ["microfone", "mic", "podcast", "gravacao"] },
    { name: "headphones", label: "Fones", category: "Áudio", tags: ["fones", "audio", "ouvido", "headphones"] },
    { name: "speaker", label: "Alto-falante", category: "Áudio", tags: ["altofalante", "audio", "som", "speaker"] },
    { name: "volume-2", label: "Volume", category: "Áudio", tags: ["volume", "som", "audio"] },
    { name: "play", label: "Play", category: "Áudio", tags: ["play", "reproducao", "assistir", "tocar"] },
    { name: "podcast", label: "Podcast", category: "Áudio", tags: ["podcast", "audio", "programa", "episodio"] },
    { name: "audio-lines", label: "Ondas de Áudio", category: "Áudio", tags: ["ondas", "audio", "som", "equalizador"] },
    { name: "audio-waveform", label: "Forma de Onda", category: "Áudio", tags: ["forma", "onda", "waveform", "som"] },
    { name: "circle-play", label: "Reproduzir", category: "Áudio", tags: ["reproduzir", "play", "iniciar"] },
    { name: "pause", label: "Pausar", category: "Áudio", tags: ["pausar", "pausa", "pause"] },
    { name: "square", label: "Parar", category: "Áudio", tags: ["parar", "stop"] },
    { name: "skip-forward", label: "Avançar", category: "Áudio", tags: ["avancar", "proximo", "skip"] },
    { name: "skip-back", label: "Voltar", category: "Áudio", tags: ["voltar", "anterior", "skip"] },

    // ── Música ─────────────────────────────────────────────────────────────
    { name: "music", label: "Música", category: "Música", tags: ["musica", "nota", "melodia"] },
    { name: "music-2", label: "Música 2", category: "Música", tags: ["musica", "nota", "melodia", "som"] },
    { name: "music-3", label: "Música 3", category: "Música", tags: ["musica", "nota", "melodia", "partitura"] },
    { name: "music-4", label: "Notas", category: "Música", tags: ["notas", "musica", "melodia", "partitura"] },
    { name: "disc-3", label: "Disco", category: "Música", tags: ["disco", "vinil", "musica", "cd"] },
    { name: "disc-album", label: "Álbum", category: "Música", tags: ["album", "disco", "playlist", "colecao"] },
    { name: "guitar", label: "Guitarra", category: "Música", tags: ["guitarra", "instrumento", "rock", "violao"] },
    { name: "drum", label: "Bateria", category: "Música", tags: ["bateria", "instrumento", "ritmo", "percussao"] },
    { name: "piano", label: "Piano", category: "Música", tags: ["piano", "teclado", "instrumento", "classico"] },
    { name: "list-music", label: "Lista Musical", category: "Música", tags: ["lista", "playlist", "fila", "musica"] },

    // ── Vídeo ──────────────────────────────────────────────────────────────
    { name: "clapperboard", label: "Claquete", category: "Vídeo", tags: ["claquete", "cinema", "filme", "gravacao"] },
    { name: "film", label: "Filme", category: "Vídeo", tags: ["filme", "cinema", "pelicula", "rolo"] },
    { name: "tv", label: "TV", category: "Vídeo", tags: ["tv", "televisao", "tela", "monitor"] },
    { name: "cast", label: "Transmissão", category: "Vídeo", tags: ["transmissao", "cast", "chromecast", "stream"] },
    { name: "monitor-play", label: "Monitor Play", category: "Vídeo", tags: ["monitor", "play", "video", "apresentacao"] },
    { name: "projector", label: "Projetor", category: "Vídeo", tags: ["projetor", "apresentacao", "cinema"] },
    { name: "screen-share", label: "Compartilhar Tela", category: "Vídeo", tags: ["tela", "compartilhar", "screen", "share"] },

    // ── Conteúdo ───────────────────────────────────────────────────────────
    { name: "newspaper", label: "Jornal", category: "Conteúdo", tags: ["jornal", "noticia", "artigo", "imprensa"] },
    { name: "file-text", label: "Arquivo", category: "Conteúdo", tags: ["arquivo", "documento", "texto", "artigo"] },
    { name: "info", label: "Informação", category: "Conteúdo", tags: ["info", "informacao", "dica", "ajuda"] },
    { name: "star", label: "Estrela", category: "Conteúdo", tags: ["estrela", "destaque", "favorito", "nota"] },
    { name: "sparkles", label: "Sparkles", category: "Conteúdo", tags: ["sparkles", "brilho", "destaque", "novo"] },
    { name: "sparkle", label: "Brilho", category: "Conteúdo", tags: ["brilho", "destaque", "especial"] },
    { name: "megaphone", label: "Megafone", category: "Conteúdo", tags: ["megafone", "anuncio", "comunicacao", "aviso"] },
    { name: "bookmark", label: "Marcador", category: "Conteúdo", tags: ["bookmark", "marcador", "salvar", "favorito"] },
    { name: "rss", label: "RSS", category: "Conteúdo", tags: ["rss", "feed", "blog", "atualizacao"] },
    { name: "scroll-text", label: "Texto Longo", category: "Conteúdo", tags: ["scroll", "texto", "longo", "artigo"] },
    { name: "quote", label: "Citação", category: "Conteúdo", tags: ["citacao", "quote", "frase", "aspas"] },
    { name: "pen-line", label: "Escrever", category: "Conteúdo", tags: ["escrever", "editar", "caneta", "texto"] },
    { name: "clipboard-list", label: "Lista", category: "Conteúdo", tags: ["lista", "clipboard", "checklist", "tarefas"] },

    // ── Pessoas ────────────────────────────────────────────────────────────
    { name: "user", label: "Usuário", category: "Pessoas", tags: ["usuario", "pessoa", "perfil"] },
    { name: "users", label: "Equipe", category: "Pessoas", tags: ["equipe", "grupo", "usuarios", "comunidade"] },
    { name: "user-round", label: "Pessoa", category: "Pessoas", tags: ["pessoa", "avatar", "perfil", "redondo"] },
    { name: "users-round", label: "Grupo", category: "Pessoas", tags: ["grupo", "pessoas", "equipe", "redondo"] },
    { name: "contact", label: "Contato", category: "Pessoas", tags: ["contato", "cartao", "pessoa", "identificacao"] },
    { name: "user-check", label: "Usuário Verificado", category: "Pessoas", tags: ["verificado", "check", "aprovado", "usuario"] },
    { name: "briefcase-business", label: "Apresentador", category: "Pessoas", tags: ["apresentador", "trabalho", "perfil", "negocio"] },
    { name: "graduation-cap", label: "Estudante", category: "Pessoas", tags: ["estudante", "aluno", "escola", "formatura"] },

    // ── Comunicação ────────────────────────────────────────────────────────
    { name: "message-square", label: "Mensagem", category: "Comunicação", tags: ["mensagem", "chat", "comunicacao", "balao"] },
    { name: "message-circle", label: "Chat", category: "Comunicação", tags: ["chat", "conversa", "mensagem", "bolha"] },
    { name: "phone", label: "Telefone", category: "Comunicação", tags: ["telefone", "ligacao", "contato", "ligar"] },
    { name: "mail", label: "E-mail", category: "Comunicação", tags: ["email", "mail", "mensagem", "carta"] },
    { name: "send", label: "Enviar", category: "Comunicação", tags: ["enviar", "share", "compartilhar", "mandar"] },
    { name: "share-2", label: "Compartilhar", category: "Comunicação", tags: ["compartilhar", "share", "social", "link"] },
    { name: "at-sign", label: "Arroba", category: "Comunicação", tags: ["arroba", "email", "mencao", "endereco"] },
    { name: "reply", label: "Responder", category: "Comunicação", tags: ["responder", "reply", "retornar"] },
    { name: "forward", label: "Encaminhar", category: "Comunicação", tags: ["encaminhar", "forward", "reenviar"] },

    // ── Programação ────────────────────────────────────────────────────────
    { name: "calendar", label: "Calendário", category: "Programação", tags: ["calendario", "agenda", "evento", "data"] },
    { name: "calendar-days", label: "Agenda", category: "Programação", tags: ["agenda", "dias", "calendario", "semana"] },
    { name: "calendar-check", label: "Evento Confirmado", category: "Programação", tags: ["confirmado", "check", "calendario", "evento"] },
    { name: "clock", label: "Relógio", category: "Programação", tags: ["relogio", "hora", "tempo", "clock"] },
    { name: "alarm-clock", label: "Alarme", category: "Programação", tags: ["alarme", "despertar", "hora", "lembrete"] },
    { name: "timer", label: "Timer", category: "Programação", tags: ["timer", "tempo", "programacao", "cronometro"] },
    { name: "timer-reset", label: "Reiniciar Timer", category: "Programação", tags: ["reiniciar", "timer", "reset", "tempo"] },
    { name: "sun", label: "Sol", category: "Programação", tags: ["sol", "dia", "amanhecer", "manha"] },
    { name: "moon", label: "Lua", category: "Programação", tags: ["lua", "noite", "noturno", "escuro"] },
    { name: "sunrise", label: "Nascer do Sol", category: "Programação", tags: ["nascer", "sol", "amanhecer", "manha"] },
    { name: "sunset", label: "Pôr do Sol", category: "Programação", tags: ["por", "sol", "entardecer", "tarde"] },

    // ── Tecnologia ─────────────────────────────────────────────────────────
    { name: "monitor", label: "Monitor", category: "Tecnologia", tags: ["monitor", "desktop", "tela", "computador"] },
    { name: "laptop", label: "Laptop", category: "Tecnologia", tags: ["laptop", "notebook", "pc", "computador"] },
    { name: "smartphone", label: "Smartphone", category: "Tecnologia", tags: ["smartphone", "celular", "mobile", "telefone"] },
    { name: "code-2", label: "Código", category: "Tecnologia", tags: ["codigo", "programacao", "dev", "html"] },
    { name: "globe", label: "Globo", category: "Tecnologia", tags: ["globo", "mundo", "web", "internet"] },
    { name: "wifi", label: "Wi-Fi", category: "Tecnologia", tags: ["wifi", "internet", "conexao", "rede"] },
    { name: "cloud", label: "Nuvem", category: "Tecnologia", tags: ["nuvem", "cloud", "storage", "armazenamento"] },
    { name: "server", label: "Servidor", category: "Tecnologia", tags: ["servidor", "dados", "infra", "hosting"] },
    { name: "database", label: "Banco de Dados", category: "Tecnologia", tags: ["dados", "database", "storage", "banco"] },
    { name: "link", label: "Link", category: "Tecnologia", tags: ["link", "referencia", "url", "endereco"] },
    { name: "cpu", label: "Processador", category: "Tecnologia", tags: ["cpu", "processador", "chip", "hardware"] },
    { name: "hard-drive", label: "Disco Rígido", category: "Tecnologia", tags: ["disco", "hd", "armazenamento", "hardware"] },
    { name: "terminal", label: "Terminal", category: "Tecnologia", tags: ["terminal", "console", "comando", "cli"] },
    { name: "binary", label: "Binário", category: "Tecnologia", tags: ["binario", "codigo", "dados", "digital"] },
    { name: "bluetooth", label: "Bluetooth", category: "Tecnologia", tags: ["bluetooth", "conexao", "sem fio", "wireless"] },
    { name: "cable", label: "Cabo", category: "Tecnologia", tags: ["cabo", "conexao", "usb", "fio"] },

    // ── Espiritualidade ────────────────────────────────────────────────────
    { name: "church", label: "Igreja", category: "Espiritualidade", tags: ["igreja", "church", "templo", "culto"] },
    { name: "cross", label: "Cruz", category: "Espiritualidade", tags: ["cruz", "religiao", "santo", "fe"] },
    { name: "book-open", label: "Livro Aberto", category: "Espiritualidade", tags: ["livro", "bible", "estudo", "leitura"] },
    { name: "book-open-text", label: "Bíblia", category: "Espiritualidade", tags: ["biblia", "livro", "texto", "sagrado"] },
    { name: "heart-handshake", label: "União", category: "Espiritualidade", tags: ["uniao", "solidariedade", "amor", "comunidade"] },
    { name: "hand-heart", label: "Oração", category: "Espiritualidade", tags: ["oracao", "mao", "coracao", "devocional"] },
    { name: "flame", label: "Chama", category: "Espiritualidade", tags: ["chama", "fogo", "espirito", "luz"] },
    { name: "candle", label: "Vela", category: "Espiritualidade", tags: ["vela", "luz", "oracao", "meditacao"] },

    // ── Social ─────────────────────────────────────────────────────────────
    { name: "heart", label: "Coração", category: "Social", tags: ["coracao", "amor", "social", "curtida"] },
    { name: "thumbs-up", label: "Curtida", category: "Social", tags: ["curtida", "like", "aprovacao", "positivo"] },
    { name: "thumbs-down", label: "Negativo", category: "Social", tags: ["negativo", "dislike", "reprovacao"] },
    { name: "message-square-heart", label: "Mensagem de Amor", category: "Social", tags: ["mensagem", "amor", "coracao", "social"] },
    { name: "smile", label: "Sorriso", category: "Social", tags: ["sorriso", "feliz", "emoji", "alegria"] },
    { name: "hand-helping", label: "Ajuda", category: "Social", tags: ["ajuda", "mao", "voluntario", "apoio"] },

    // ── Entretenimento ─────────────────────────────────────────────────────
    { name: "gamepad-2", label: "Gamepad", category: "Entretenimento", tags: ["gamepad", "jogo", "esporte", "controle"] },
    { name: "trophy", label: "Troféu", category: "Entretenimento", tags: ["trofeu", "campeonato", "premio", "vitoria"] },
    { name: "medal", label: "Medalha", category: "Entretenimento", tags: ["medalha", "premio", "conquista", "honra"] },
    { name: "party-popper", label: "Festa", category: "Entretenimento", tags: ["festa", "celebracao", "confete", "comemoracao"] },
    { name: "ticket", label: "Ingresso", category: "Entretenimento", tags: ["ingresso", "ticket", "evento", "entrada"] },
    { name: "drama", label: "Teatro", category: "Entretenimento", tags: ["teatro", "drama", "mascara", "arte"] },
    { name: "dice-5", label: "Dado", category: "Entretenimento", tags: ["dado", "jogo", "sorte", "diversao"] },
    { name: "dices", label: "Dados", category: "Entretenimento", tags: ["dados", "jogos", "tabuleiro", "diversao"] },
    { name: "puzzle", label: "Quebra-cabeça", category: "Entretenimento", tags: ["puzzle", "quebra", "cabeca", "logica"] },

    // ── Natureza ───────────────────────────────────────────────────────────
    { name: "leaf", label: "Folha", category: "Natureza", tags: ["folha", "natureza", "verde", "planta"] },
    { name: "flower-2", label: "Flor", category: "Natureza", tags: ["flor", "natureza", "beleza", "jardim"] },
    { name: "tree-palm", label: "Árvore", category: "Natureza", tags: ["arvore", "floresta", "natureza", "palmeira"] },
    { name: "trees", label: "Floresta", category: "Natureza", tags: ["floresta", "arvores", "natureza", "parque"] },
    { name: "mountain", label: "Montanha", category: "Natureza", tags: ["montanha", "serra", "paisagem", "natureza"] },
    { name: "mountain-snow", label: "Montanha Nevada", category: "Natureza", tags: ["montanha", "neve", "inverno", "paisagem"] },
    { name: "cloud-sun", label: "Parcialmente Nublado", category: "Natureza", tags: ["nublado", "nuvem", "sol", "tempo"] },
    { name: "rainbow", label: "Arco-íris", category: "Natureza", tags: ["arco", "iris", "cores", "natureza"] },
    { name: "snowflake", label: "Floco de Neve", category: "Natureza", tags: ["neve", "floco", "inverno", "frio"] },
    { name: "droplets", label: "Gotas", category: "Natureza", tags: ["gotas", "agua", "chuva", "orvalho"] },
    { name: "wind", label: "Vento", category: "Natureza", tags: ["vento", "brisa", "ar", "sopro"] },
    { name: "zap", label: "Raio", category: "Natureza", tags: ["raio", "trovao", "energia", "tempestade"] },

    // ── Objetos ────────────────────────────────────────────────────────────
    { name: "home", label: "Casa", category: "Objetos", tags: ["casa", "inicio", "home", "lar"] },
    { name: "camera", label: "Câmera", category: "Objetos", tags: ["camera", "foto", "imagens", "fotografia"] },
    { name: "image", label: "Imagem", category: "Objetos", tags: ["imagem", "foto", "visual", "galeria"] },
    { name: "folder", label: "Pasta", category: "Objetos", tags: ["pasta", "arquivo", "organizar", "diretorio"] },
    { name: "gift", label: "Presente", category: "Objetos", tags: ["presente", "gift", "promo", "surpresa"] },
    { name: "flag", label: "Bandeira", category: "Objetos", tags: ["bandeira", "destino", "marca", "sinalizacao"] },
    { name: "lamp", label: "Lâmpada", category: "Objetos", tags: ["lampada", "ideia", "luz", "inspiracao"] },
    { name: "key", label: "Chave", category: "Objetos", tags: ["chave", "acesso", "seguranca", "abrir"] },
    { name: "map", label: "Mapa", category: "Objetos", tags: ["mapa", "localizacao", "navegacao", "rota"] },
    { name: "compass", label: "Bússola", category: "Objetos", tags: ["bussola", "direcao", "navegacao", "orientacao"] },
    { name: "scissors", label: "Tesoura", category: "Objetos", tags: ["tesoura", "cortar", "editar"] },
    { name: "package", label: "Pacote", category: "Objetos", tags: ["pacote", "caixa", "entrega", "produto"] },
    { name: "lightbulb", label: "Ideia", category: "Objetos", tags: ["ideia", "luz", "lampada", "inspiracao"] },
    { name: "trophy", label: "Troféu", category: "Objetos", tags: ["trofeu", "premio", "vitoria"] },

    // ── Sistema ────────────────────────────────────────────────────────────
    { name: "settings", label: "Configurações", category: "Sistema", tags: ["configuracoes", "settings", "ajustes", "engrenagem"] },
    { name: "check", label: "Check", category: "Sistema", tags: ["check", "confirmado", "ok", "correto"] },
    { name: "badge-check", label: "Verificado", category: "Sistema", tags: ["verificado", "check", "confirmado", "selo"] },
    { name: "alert-circle", label: "Alerta", category: "Sistema", tags: ["alerta", "aviso", "importante", "atencao"] },
    { name: "bell", label: "Sino", category: "Sistema", tags: ["sino", "alerta", "notificacao", "lembrete"] },
    { name: "lock", label: "Cadeado", category: "Sistema", tags: ["cadeado", "seguranca", "privado", "bloqueado"] },
    { name: "eye", label: "Olho", category: "Sistema", tags: ["olho", "visualizar", "preview", "ver"] },
    { name: "filter", label: "Filtro", category: "Sistema", tags: ["filtro", "buscar", "ordenar", "selecionar"] },
    { name: "search", label: "Busca", category: "Sistema", tags: ["busca", "search", "pesquisa", "procurar"] },
    { name: "plus", label: "Adicionar", category: "Sistema", tags: ["adicionar", "novo", "plus", "criar"] },
    { name: "x", label: "Fechar", category: "Sistema", tags: ["fechar", "remover", "cancelar", "excluir"] },
    { name: "minus", label: "Remover", category: "Sistema", tags: ["remover", "diminuir", "minus", "menos"] },
    { name: "refresh-cw", label: "Atualizar", category: "Sistema", tags: ["atualizar", "refresh", "recarregar", "sync"] },
    { name: "trash-2", label: "Lixeira", category: "Sistema", tags: ["lixeira", "excluir", "apagar", "deletar"] },
    { name: "download", label: "Download", category: "Sistema", tags: ["download", "baixar", "salvar", "arquivo"] },
    { name: "upload", label: "Upload", category: "Sistema", tags: ["upload", "enviar", "carregar", "subir"] },
    { name: "external-link", label: "Link Externo", category: "Sistema", tags: ["externo", "link", "abrir", "nova aba"] },
    { name: "log-out", label: "Sair", category: "Sistema", tags: ["sair", "logout", "desconectar", "encerrar"] },
    { name: "shield", label: "Escudo", category: "Sistema", tags: ["escudo", "seguranca", "protecao", "shield"] },
    { name: "hash", label: "Hashtag", category: "Sistema", tags: ["hashtag", "numero", "tag", "hash"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP RÁPIDO POR NOME
// ─────────────────────────────────────────────────────────────────────────────
export const ICON_MAP = Object.fromEntries(
    ICON_CATALOG.map((item) => [item.name, item])
);

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIAS (ordem fixa para a UI)
// ─────────────────────────────────────────────────────────────────────────────
export const ICON_CATEGORIES = [
    "Todos",
    "Áudio",
    "Música",
    "Vídeo",
    "Conteúdo",
    "Pessoas",
    "Comunicação",
    "Programação",
    "Tecnologia",
    "Espiritualidade",
    "Social",
    "Entretenimento",
    "Natureza",
    "Objetos",
    "Sistema",
];

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE EMOJIS LEGADOS → NOME LUCIDE
// Registros antigos do Firebase que usam emoji são convertidos para nomes
// ─────────────────────────────────────────────────────────────────────────────
export const EMOJI_MAP = {
    "📹": "video",
    "📻": "radio",
    "🎙️": "mic",
    "🎙": "mic",
    "🎧": "headphones",
    "🎤": "mic",
    "🎬": "clapperboard",
    "📰": "newspaper",
    "⚽": "trophy",
    "🏆": "trophy",
    "🎮": "gamepad-2",
    "🎶": "music",
    "🎵": "music",
    "🧠": "lightbulb",
    "🔥": "flame",
    "😂": "smile",
    "🔔": "bell",
    "📚": "book-open",
    "🌤️": "sun",
    "🌤": "sun",
    "🏠": "home",
    "📷": "camera",
    "📡": "radio",
    "💡": "lightbulb",
    "🎥": "video",
    "📺": "tv",
    "🎸": "guitar",
    "🥁": "drum",
    "⛪": "church",
    "✝️": "cross",
    "✝": "cross",
    "❤️": "heart",
    "❤": "heart",
    "👍": "thumbs-up",
    "🏅": "medal",
    "🎉": "party-popper",
    "🎫": "ticket",
    "🎭": "drama",
    "🎲": "dice-5",
    "🌿": "leaf",
    "🌸": "flower-2",
    "🌳": "trees",
    "⛰️": "mountain",
    "⛰": "mountain",
    "🌈": "rainbow",
    "💧": "droplets",
    "⚡": "zap",
    "🔒": "lock",
    "👁️": "eye",
    "👁": "eye",
    "🔍": "search",
    "⚙️": "settings",
    "⚙": "settings",
    "➕": "plus",
    "🔗": "link",
    "☁️": "cloud",
    "☁": "cloud",
    "📱": "smartphone",
    "💻": "laptop",
    "🖥️": "monitor",
    "🖥": "monitor",
    "📧": "mail",
    "📞": "phone",
    "💬": "message-square",
    "📅": "calendar",
    "⏰": "alarm-clock",
    "🌙": "moon",
    "🌅": "sunrise",
    "🌇": "sunset",
};

// ─────────────────────────────────────────────────────────────────────────────
// ALIASES PARA COMPATIBILIDADE (ex: nomes sem hífen do admin anterior)
// ─────────────────────────────────────────────────────────────────────────────
export const ICON_ALIASES = {
    "volume2": "volume-2",
    "disc3": "disc-3",
    "music4": "music-4",
    "clock3": "clock",
    "code2": "code-2",
    "flower2": "flower-2",
    "gamepad2": "gamepad-2",
    "trash2": "trash-2",
    "share2": "share-2",
    "waves": "audio-lines",
    "album": "disc-album"
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNÇÕES DE NORMALIZAÇÃO E RENDERIZAÇÃO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Escapa caracteres HTML perigosos.
 */
export function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[c]);
}

/**
 * Converte qualquer valor de ícone (nome Lucide, emoji legado ou vazio)
 * para o nome normalizado do Lucide.
 *
 * @param {string|null|undefined} icone — valor salvo no Firebase
 * @returns {string} — nome Lucide válido
 */
export function resolveIcon(icone) {
    if (!icone) return ICON_DEFAULT;
    const valor = String(icone).trim();

    // Se já é um nome Lucide conhecido, retorna diretamente
    if (ICON_MAP[valor]) return valor;

    // Verifica aliases (ex: volume2 -> volume-2)
    if (ICON_ALIASES[valor]) return ICON_ALIASES[valor];

    // Remove variation selectors (U+FE0F) para normalizar emojis
    const normalizado = valor.replace(/\uFE0F/g, "");
    if (EMOJI_MAP[normalizado]) return EMOJI_MAP[normalizado];

    // Se o valor limpo (sem FE0F) já é um alias ou nome Lucide
    if (ICON_ALIASES[normalizado]) return ICON_ALIASES[normalizado];
    if (ICON_MAP[normalizado]) return normalizado;

    // Fallback final
    return ICON_DEFAULT;
}

/**
 * Retorna o markup HTML para renderizar um ícone Lucide com acessibilidade.
 *
 * @param {string|null|undefined} icone — valor do Firebase
 * @returns {string} — HTML seguro com <svg data-lucide="..."> + <span class="sr-only">
 */
export function renderIconMarkup(icone) {
    const nome = resolveIcon(icone);
    const item = ICON_MAP[nome] || ICON_MAP[ICON_DEFAULT];
    return `<svg data-lucide="${escaparHtml(nome)}" class="lucide-icon" aria-hidden="true"></svg><span class="sr-only">${escaparHtml(item.label)}</span>`;
}

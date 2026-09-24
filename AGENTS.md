# 📻 Rádio Geração Ativa — Contexto do Projeto

> **Leia isto antes de alterar qualquer coisa.**
> Este é um projeto real e em evolução, não um site genérico para reconstruir do zero.
> Regra principal: **primeiro entenda a estrutura, o código e as dependências existentes — depois altere, de forma cirúrgica.**

---

## 1. Identidade

- **Nome:** Rádio Geração Ativa
- **O quê:** plataforma web da rádio dos alunos do UNASP São Paulo — vídeos, playlists, notícias, informações institucionais, painel administrativo, modo de manutenção.
- **Tom:** rádio jovem, moderna, tecnológica e institucional ao mesmo tempo.
- **Não deve parecer:** template SaaS, dashboard genérico, blog WordPress, site corporativo sério demais, landing page de startup.

## 2. Repositório e stack

- Repo: `github.com/tiagoalmeida1605/Radio-Geracao-Ativa`
- Site: `radio-geracao-ativa.vercel.app`
- Stack atual — **não trocar sem necessidade real e justificada**:
  - HTML5, CSS3, JavaScript vanilla (ES Modules)
  - Firebase Realtime Database (+ autenticação no fluxo admin)
  - Vercel (deploy) / Git-GitHub
  - Google Fonts, Font Awesome
- Não migrar para React, Next.js, Tailwind, Vue etc. só por preferência.

### Estrutura de pastas (conferir sempre antes de assumir)

```
Radio-Geracao-Ativa/
├── index.html
├── 404.html
├── admin/          (admin.html, admin.css, admin.js)
├── assets/         (logo.png, icon.png, RGA Claro.png, RGA Claro Microfone.png)
├── pages/          (sobre.html, playlist.html, publi.html, manutencao.html)
├── script/         (admin-auth.js, icon-catalog.js, maintenance.js, menu.js, playlist.js, publi.js)
└── style/          (404.css, index.css, maintenance.css, manutencao-page.css, playlist.css, publi.css)
```

> ⚠️ Uma versão anterior deste contexto registrava uma página `placar.html` (origem do projeto como placar ao vivo do "Jogos da Amizade", que depois pivotou para rádio). Confirme o nome real do arquivo no repositório antes de editar — pode ter sido renomeado para `playlist.html`.

## 3. Identidade visual

Paleta (usar com hierarquia — o coral, verde água e amarelo são cores de destaque; o azul-marinho é base):

| Cor | Hex | Uso |
|---|---|---|
| Azul-marinho | `#122232` | base / accent da Home |
| Amarelo mostarda | `#EFA634` | destaque / accent do Admin |
| Verde água | `#359497` | destaque / accent da Playlist |
| Laranja coral | `#DC5C3E` | destaque / accent da página Sobre |
| Fundo claro | `#FDFAF4` | fundo |

- Cada página carrega sua cor de identidade via custom property `--cor-destaque`.
- Assets oficiais ficam em `/assets/` — usar sempre os existentes (`logo.png`, `icon.png`, `RGA Claro.png`, `RGA Claro Microfone.png`); nunca inventar logos novos. A versão clara existe para fundos escuros.

### Estilo desejado
Moderno, premium, jovem, editorial, tecnológico, limpo, com profundidade — sem exagero. Pode usar glassmorphism com moderação, blur, sombras suaves, gradientes discretos, microinterações — mas **glass não é a identidade inteira**, é só uma ferramenta.

### Ícones
Eliminar gradualmente emojis como ícones de UI (📻📺📰🔒🛠️👁️☰✕ etc.). O projeto já tem `script/icon-catalog.js` + Font Awesome — priorizar isso. Não misturar emoji + Font Awesome + SVG aleatório sem razão.

## 4. Sistema de tema

- `data-theme="light" | "dark"`, salvo em `localStorage["rga-theme"]`, com fallback para `prefers-color-scheme`.
- **O toggle de tema é exclusivo do Admin.** O site público não deve mostrar botão de alternância de tema — a experiência pública tem uma identidade visual fixa.

## 5. Menu

- Desktop: navegação horizontal, cabeçalho limpo.
- Mobile: menu lateral/drawer com overlay, animação, e bloqueio de scroll do conteúdo quando aberto.
- Responsivo de verdade, não "desktop encolhido".

## 6. Páginas e funcionalidades

### Home
Deve ser uma porta de entrada real para a rádio (apresentação, destaque de conteúdo, chamada para vídeos, notícias recentes, redes sociais) — não só título/texto/botão. Baseado na arquitetura atual, sem inventar funcionalidades que exigem backend novo sem necessidade.

### Playlist / Vídeos (`pages/playlist.html`, `script/playlist.js`, `style/playlist.css`)
- Conteúdo vem do YouTube; o sistema precisa **diferenciar corretamente vídeo único de playlist** — não tratar tudo como iframe de proporção fixa.
- Layout adaptativo por `aspect-ratio` / grid / flex, respeitando a proporção real do conteúdo (1:1, 16:9, 4:3, vertical etc.) — nunca `width:100%; height:300px` fixo.

### Notícias (`pages/publi.html`, `script/publi.js`, `style/publi.css`)
Conteúdo editorial: cards com imagem, título, data, resumo, leitura (modal ou página), boa hierarquia tipográfica. Cuidado com overflow horizontal, texto vazando do card, imagens deformadas.

### Sistema de categorias
Planejado mas **ainda não funciona corretamente** (ver seção de bugs conhecidos). Ao mexer: manter dados extensíveis, evitar hardcode, preparar frontend para filtros, manter compatibilidade com dados existentes.

### Modo manutenção (`script/maintenance.js`, `pages/manutencao.html`, `style/maintenance.css`, `style/manutencao-page.css`)
Estado controlado via Firebase Realtime Database: admin autenticado sempre acessa; visitante vê a página de manutenção quando o modo está ativo. Página precisa ser responsiva, sem dimensões fixas que estourem a viewport no celular.

### 404 (`404.html`, `style/404.css`)
Página de erro real, responsiva, com caminho de volta, mantendo a identidade visual da rádio.

## 7. Admin (`admin/`)

- Área separada, pensada como **produto/ferramenta profissional**, não uma versão desktop da UI mobile.
- Desktop: sidebar/painel, cards, formulários, tabelas, uso do espaço horizontal.
- Mobile: layout empilhado, hitboxes adequadas, nada de tabela quebrando a tela.
- **Autenticação e permissões**: não desfazer o sistema atual. Existem papéis (`CONTAS` array + atributo `data-papel`):
  - `admin` — acesso total
  - `publicador` — só notícias
  - `playlist` — só playlists
  - Nunca substituir por um `if (user) { podeTudo() }` genérico.
- Barra de conta persistente mostra o papel atual + logout.
- Feedback obrigatório após ações (salvar, editar, excluir, publicar, ativar/desativar manutenção): toast, inline, loading, confirmação quando a ação for destrutiva ("Excluir notícia? Esta ação não pode ser desfeita.").

## 8. Regras de segurança conhecidas

- O login atual usa hash SHA-256 client-side (`usuario:senha`, usuário em minúsculas) — isso é **inspecionável via devtools e contornável via chamadas diretas à API REST do Firebase**. A solução real é migrar para Firebase Authentication (Email/Password) + regras de segurança no Realtime Database (`auth != null` para escrita). Essa migração está em aberto, não decidida.
- Nunca colocar segredos reais no frontend sem entender o modelo de segurança atual.

## 9. Firebase

Dados hoje cobrem: playlists, notícias/publicações, configurações, manutenção, permissões. Antes de alterar o schema:
1. Descobrir como os dados estão organizados.
2. Descobrir quem escreve e quem lê.
3. Descobrir quais páginas dependem deles.
4. Manter compatibilidade com o que já existe.

## 10. Bugs / pendências conhecidas

- **PROBLEMA RESOLVIDO**: As categorias/tags editoriais das publicações usam o campo `tags` (array) no Firebase. O Admin permite selecionar ou criar chips de tags; o público filtra as notícias no cliente. Publicações antigas sem `tags` continuam compatíveis e aparecem normalmente.
- Fluxo de publicar/postar precisa de validação ponta a ponta.
- Divergência de nomes de campo entre Admin (`resumo`/`conteudo`) e o front público `publi.js` (espera `texto`) - **CORRIGIDO** ( agora aceita ambos os campos ).
- Inconsistência de formato de data entre armazenamento ISO e exibição crua na seção de notícias.
- Lista de jogos/placar usa `get()` (busca única) em vez de `onValue()`, então itens novos não aparecem sem refresh manual.
- Vídeo/playlist ainda não distinguem corretamente formatos e não usam layout totalmente adaptativo.
- Tema não deve vazar para o público (ver seção 4).
- **PROBLEMA RESOLVIDO**: Emojis usados como elementos de interface foram substituídos por ícones Lucide (menu, ações do Admin, data, manutenção, login e controles). Emojis do mapa de compatibilidade em `icon-catalog.js` permanecem apenas para interpretar registros legados do Firebase.
- **PROBLEMA RESOLVIDO**: O sistema de postagens voltou a funcionar. Vídeos/playlists são publicados corretamente e notícias/publicações são salvas novamente após a correção de erros de JavaScript no Admin que impediam o fluxo de gravação. O fluxo Firebase → painel → site público está operacional.

## 11. CSS

- Arquitetura: `base.css` compartilhado + um CSS adicional por página.
- Verificar se uma regra já existe antes de duplicar. Evitar cascatas de override → override → media query → override de media query.
- Se fizer sentido, centralizar em design tokens (`--color-primary`, `--surface`, `--text`, `--radius-*`, `--shadow-*` etc.) — sem virar abstração desnecessária.
- **Não fazer limpeza massiva de CSS sem entender os efeitos.**

## 12. Responsividade — breakpoints a testar

320px · 375px · 390px · 430px (celulares) · 768px (tablet) · 1024px (tablet grande/notebook) · 1280px+ (desktop)

Nada pode ultrapassar a viewport, gerar scroll horizontal, quebrar, ficar ilegível ou sobreposto.

## 13. Acessibilidade e performance

- Labels, `aria-label` quando necessário, foco visível, contraste, navegação por teclado, `alt` em imagens, `<button>` real em vez de `div` clicável.
- Respeitar `prefers-reduced-motion` em animações relevantes.
- Evitar bibliotecas desnecessárias, JS duplicado, imagens pesadas sem necessidade, requests repetidos.

## 14. Estados de UI a sempre considerar

Normal · hover · focus · active · disabled · loading · empty · error — principalmente em botões, formulários, notícias, vídeos e qualquer dado vindo do Firebase.

Exemplos de texto:
- Carregando: `Carregando conteúdo...`
- Vazio: `Nenhum conteúdo disponível no momento.`
- Erro: `Não foi possível carregar este conteúdo. Tente novamente.` (nunca expor erro técnico cru)

## 15. Ordem de prioridade em caso de conflito

1. Funcionalidade
2. Segurança
3. Responsividade
4. Acessibilidade
5. Consistência visual
6. Performance
7. Elegância do código
8. Efeitos visuais

Um efeito bonito que quebra o Firebase não é uma melhoria.

## 16. O que NÃO fazer

- Não reescrever o projeto inteiro nem migrar de stack sem necessidade.
- Não instalar bibliotecas para resolver coisas simples.
- Não substituir Firebase sem pedido explícito.
- Não remover funcionalidades existentes.
- Não alterar o schema do banco sem entender a estrutura atual.
- Não expor o toggle de tema no site público.
- Não usar emoji como sistema de ícones.
- Não usar larguras fixas frágeis ou vídeo com tamanho fixo.
- Não alterar autenticação sem entender o fluxo atual.
- Não inventar funcionalidades que não foram pedidas.
- Não fazer um redesign que descaracterize a identidade da Rádio.

## 17. Fluxo de trabalho recomendado ao pedir uma mudança

1. Auditar os arquivos relevantes antes de qualquer código.
2. Entender o comportamento atual e as dependências (o que importa o quê).
3. Identificar riscos explicitamente (quebrar Firebase? autenticação? manutenção? responsividade? dados existentes?).
4. Implementar só o necessário, em mudanças pequenas e coerentes.
5. Validar: console limpo, mobile, desktop, Firebase, autenticação, links, imagens, acessibilidade.
6. Explicar resumidamente o que mudou. Se uma solução melhor exigir mudança arquitetural grande, explicar antes de executar.

---

### Como usar este arquivo

Cole este contexto no início de uma conversa com a IA antes de pedir qualquer alteração no projeto. Para tarefas específicas, prefira separar em duas mensagens:

1. Primeiro: `"Faça somente a auditoria desta parte do projeto, sem alterar nada ainda."`
2. Depois, com base na auditoria: `"Implemente [mudança específica], sem mexer em [áreas que não devem ser tocadas]."`

Isso evita que a IA "reinvente" o projeto em vez de evoluí-lo.

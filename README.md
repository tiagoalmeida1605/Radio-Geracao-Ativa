<div align="center">

<img src="./assets/RGA%20Claro.png" alt="Rádio Geração Ativa" width="220"/>

# 📻 Rádio Geração Ativa

**A voz dos alunos do UNASP São Paulo na palma da sua mão**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://radio-geracao-ativa.vercel.app/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Status](https://img.shields.io/badge/Status-Online-31A24C?style=for-the-badge&logo=status-page&logoColor=white)](https://radio-geracao-ativa.vercel.app/)
[![License](https://img.shields.io/badge/License-©%202026-blue?style=for-the-badge)](LICENSE)

[🌐 Visite o Site](https://radio-geracao-ativa.vercel.app/) • [📱 Acesse o Admin](https://radio-geracao-ativa.vercel.app/admin/admin.html) • [💬 Nos Acompanhe](#-redes-sociais)

</div>

---

## ✨ O que é?

A **Rádio Geração Ativa** é a plataforma web oficial da rádio escolar do UNASP São Paulo. Um espaço digital vibrante onde você encontra:

- 🎙️ **Programas ao vivo e gravados** — Tudo disponível no YouTube
- 📰 **Notícias da comunidade** — Fique por dentro do que acontece na rádio
- 📖 **Informações institucionais** — Missão, visão, valores e equipe
- 👥 **Painel administrativo inteligente** — Gerenciamento de conteúdo em tempo real
- 🎯 **Design responsivo** — Perfeito em qualquer dispositivo

> **Acesse agora:** [radio-geracao-ativa.vercel.app](https://radio-geracao-ativa.vercel.app/)

---

## 🚀 Funcionalidades Principais

<table align="center">
<tr>
<td align="center" width="50%">

### 📺 **Playlists Dinâmicas**
Players embutidos dos programas, entrevistas e coberturas diretamente no site

</td>
<td align="center" width="50%">

### 📰 **Painel de Notícias**
Publicações atualizadas pela equipe em tempo real

</td>
</tr>
<tr>
<td align="center" width="50%">

### 🔐 **Autenticação Segura**
Login com controle de permissões e três níveis de acesso distintos

</td>
<td align="center" width="50%">

### 🛠️ **Modo Manutenção**
Tela dedicada para visitantes durante atualizações do site

</td>
</tr>
<tr>
<td align="center" width="50%">

### 📱 **100% Responsivo**
Funciona perfeitamente em celular, tablet e desktop

</td>
<td align="center" width="50%">

### ⚡ **Sincronização em Tempo Real**
Firebase Realtime Database mantém tudo atualizado

</td>
</tr>
<tr>
<td align="center" colspan="2">

### 🗂️ **Publicações com Filtro por Tags**
Organização de notícias com filtragem dinâmica por categorias editoriais

</td>
</tr>
</table>

---

## 🛠️ Stack Tecnológico

<div align="center">

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla ES Modules) |
| **Autenticação** | 🔐 Firebase Authentication |
| **Backend & Dados** | 🔥 Firebase Realtime Database |
| **Hospedagem** | ✈️ Vercel (Fast & Reliable) |
| **Versão** | Git & GitHub |
| **Tipografia** | Google Fonts (Montserrat, Roboto) |
| **Ícones** | Font Awesome |

</div>

---

## 📁 Arquitetura do Projeto

```
Radio-Geracao-Ativa/
│
├── 📄 index.html                   ← Página inicial
├── 📄 404.html                     ← Página de erro elegante
├── 📄 README.md                    ← Você está aqui! 👈
│
├── 📁 pages/                       ← Páginas internas
│   ├── sobre.html                  (Institucional)
│   ├── playlist.html               (YouTube Playlists)
│   ├── publi.html                  (Notícias)
│   └── manutencao.html             (Tela de manutenção)
│
├── 📁 admin/                       ← Painel administrativo
│   ├── admin.html                  (Dashboard)
│   ├── admin.css                   (Estilos do painel)
│   └── admin.js                    (Lógica do painel)
│
├── 📁 script/                      ← JavaScript modular
│   ├── firebase-config.js          (Configuração centralizada do Firebase)
│   ├── admin-auth.js               (Autenticação e controle de acesso)
│   ├── icon-catalog.js             (Catálogo de ícones do admin)
│   ├── maintenance.js              (Controle de manutenção)
│   ├── menu.js                     (Menu mobile)
│   ├── playlist.js                 (Sincroniza playlists)
│   └── publi.js                    (Sincroniza notícias)
│
├── 📁 style/                       ← Estilos CSS
│   ├── index.css                   (Global)
│   ├── playlist.css
│   ├── publi.css
│   ├── maintenance.css
│   ├── manutencao-page.css
│   └── 404.css
│
└── 📁 assets/                      ← Imagens & ícones
    ├── RGA Claro Microfone.png     (Logo com microfone)
    ├── RGA Claro.png               (Logo oficial)
    ├── icon.png
    └── logo.png
```

---

## 🗂️ Categorias nas Publicações

As notícias podem receber uma ou mais tags editoriais no painel administrativo. Elas são salvas no campo `tags` do Firebase Realtime Database e usadas na página de Notícias para filtrar publicações sem recarregar a página. Conteúdos antigos sem tags permanecem visíveis e são tratados como sem categoria.

---

## 👥 Níveis de Acesso

| Nível | Permissões |
|-------|------------|
| **Admin** | ✅ Acesso total • Gerenciar tudo • Ativar/desativar manutenção |
| **Publicador** | ✅ Publicar notícias • Editar conteúdo • Criar posts |
| **Editor de Vídeos** | ✅ Gerenciar playlists • Adicionar vídeos • Organizar conteúdo do YouTube |

---

## 🌍 Links Rápidos

<div align="center">

| Link | Descrição |
|------|-----------|
| 🌐 [**Website**](https://radio-geracao-ativa.vercel.app/) | Visite o site oficial |
| 🔐 [**Painel Admin**](https://radio-geracao-ativa.vercel.app/admin/admin.html) | Acesse o dashboard |
| 📂 [**GitHub Repo**](https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa) | Repositório do projeto |
| 📸 [**Instagram**](https://www.instagram.com/radiogeracaoativa/) | Nos siga @radiogeracaoativa |
| ▶️ [**YouTube**](https://www.youtube.com/@radiogeracaoativa) | Inscreva-se no canal |

</div>

---

## 👨‍🏫 Sobre o Projeto

Este projeto foi criado pelo **Prof. Nelson JR**, responsável pela condução e desenvolvimento da **Rádio Geração Ativa** no UNASP São Paulo. Uma iniciativa que dá voz aos alunos através de uma plataforma digital moderna e acessível.

**Desenvolvimento técnico:** [Tiago🗲dev](https://github.com/tiagoalmeida1605)

---

## 📞 Redes Sociais

<div align="center">

Acompanhe a Rádio Geração Ativa:

| Rede | Link |
|------|------|
| 💬 **Instagram** | [@radiogeracaoativa](https://www.instagram.com/radiogeracaoativa/) |
| 📹 **YouTube** | [@radiogeracaoativa](https://www.youtube.com/@radiogeracaoativa) |

</div>

---

## 📜 Licença

<div align="center">

© **2026** Rádio Geração Ativa  
Todos os direitos reservados.

Este projeto é mantido com ❤️ pela comunidade da Rádio Geração Ativa do UNASP São Paulo.

</div>

---

<div align="center">

<img src="./assets/RGA%20Claro.png" alt="Rádio Geração Ativa" width="90"/>

<sub>Feito com ☕ café, 🎵 música e muita dedicação pela Rádio Geração Ativa</sub>

</div>

<div align="center">

# 📻 Rádio Geração Ativa

**A voz dos alunos do UNASP São Paulo na palma da sua mão**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://radio-geracao-ativa.vercel.app/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Status](https://img.shields.io/badge/Status-Online-31A24C?style=for-the-badge&logo=status-page&logoColor=white)](https://radio-geracao-ativa.vercel.app/)
[![License](https://img.shields.io/badge/License-©%202026-blue?style=for-the-badge)](LICENSE)

[🌐 Visite o Site](#-links-rápidos) • [📱 Acesse o Admin](#️-funcionalidades) • [💬 Nos Acompanhe](#-redes-sociais)

</div>

---

## ✨ O que é?

A **Rádio Geração Ativa** é a plataforma web oficial da rádio escolar do UNASP São Paulo. Um espaço digital vibrante onde você encontra:

- 🎙️ **Programas ao vivo e gravados** - Tudo disponível no YouTube
- 📰 **Notícias da comunidade** - Fique por dentro do que acontece na rádio
- 📖 **Informações institucionais** - Missão, visão, valores e equipe
- 👥 **Painel administrativo inteligente** - Gerenciamento de conteúdo em tempo real
- 🎯 **Design responsivo** - Perfeito em qualquer dispositivo

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
Três níveis de acesso com controle de permissões (Admin, Publicador, Gerente)

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
</table>

---

## 🛠️ Stack Tecnológico

<div align="center">

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla ES Modules) |
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
│
├── 📁 admin/                       ← Painel administrativo
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
│
├── 📁 pages/                       ← Páginas internas
│   ├── sobre.html                  (Institucional)
│   ├── playlist.html               (YouTube Playlists)
│   ├── publi.html                  (Notícias)
│   └── manutencao.html             (Tela de manutenção)
│
├── 📁 script/                      ← JavaScript modular
│   ├── admin-auth.js               (Autenticação por papel)
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
├── 📁 assets/                      ← Imagens & ícones
│   ├── logo.png
│   └── icon.png
│
└── README.md                       ← Você está aqui! 👈
```

---

## ⚙️ Configuração do Firebase

O projeto usa **Firebase Realtime Database** para sincronizar:
- 📺 Playlists do YouTube
- 📰 Notícias e publicações
- 🛠️ Status de manutenção
- 🔐 Configurações de acesso

### 🔑 Como Configurar

1. **Crie um projeto Firebase** em [console.firebase.google.com](https://console.firebase.google.com)

2. **Copie suas credenciais** e substitua o objeto `firebaseConfig` nesses arquivos:
   - `script/playlist.js`
   - `script/publi.js`
   - `script/maintenance.js`
   - `admin/admin.js`

3. **Exemplo de configuração:**
   ```javascript
   const firebaseConfig = {
     apiKey: "SEU_API_KEY",
     authDomain: "seu-projeto.firebaseapp.com",
     databaseURL: "https://seu-projeto.firebaseio.com",
     projectId: "seu-projeto",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "SEU_SENDER_ID",
     appId: "SEU_APP_ID"
   };
   ```

> **⚠️ Nota:** As credenciais do Firebase de autenticação (Login Admin) **não** usam Firebase Authentication. O hash SHA-256 é validado localmente em `script/admin-auth.js`.

[📚 Documentação oficial do Firebase →](https://firebase.google.com/docs/database)

---

---

## 👥 Níveis de Acesso

| Nível | Permissões |
|-------|------------|
| **Admin** | ✅ Acesso total • Gerenciar tudo • Ativar/desativar manutenção |
| **Publicador** | ✅ Publicar notícias • Editar conteúdo • Criar posts |
| **Editor** | ✅ Gerenciar playlists • Adicionar vídeos • Organizar conteúdo do YouTube |

---

## 📱 Screenshots & Features

<div align="center">

### 🏠 Página Inicial
Layout limpo e moderno com navegação intuitiva

### 📺 Seção de Playlists
Players embutidos com sincronização em tempo real

### 📰 Notícias & Publicações
Painel editorial com atualização instantânea

### 👥 Página Sobre
Informações institucionais, missão, visão e equipe

</div>

---

## 🌍 Links Rápidos

<div align="center">

| Link | Descrição |
|------|-----------|
| 🌐 [**Website**](https://radio-geracao-ativa.vercel.app/) | Visite o site oficial |
| 🔐 [**Painel Admin**](https://radio-geracao-ativa.vercel.app/admin/admin.html) | Acesse o dashboard |
| 📂 [**GitHub Repo**](https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa) | Fork e contribua |
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

## 🙏 Agradecimentos

- **Prof. Nelson JR** - Criador e mentor do projeto 🌟
- **UNASP São Paulo** - Por acreditar na iniciativa
- **Equipe da Rádio Geração Ativa** - Pelo engajamento e dedicação
- **Firebase** - Pelo banco de dados confiável
- **Vercel** - Pelo hosting rápido e seguro
- **Comunidade Open Source** - Por ferramentas incríveis
- **Você!** - Por vir até aqui 🚀

---

<div align="center">

### ⭐ Gostou? Deixe uma estrela!

**[⭐ Star no GitHub](https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa)**

Fazer uma estrela leva 2 segundos e nos ajuda muito! 💫

---

<sub>Feito com ☕ café, 🎵 música e muita dedicação pela Rádio Geração Ativa</sub>

</div>

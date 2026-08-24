<div align="center">

<img src="./assets/logo.png" alt="Logotipo da Rádio Geração Ativa" width="180">

# Rádio Geração Ativa

**Site da Rádio Geração Ativa do UNASP São Paulo**

Plataforma web da rádio escolar dos alunos do UNASP São Paulo. O site reúne informações institucionais, playlists de programas no YouTube, notícias da comunidade e um painel administrativo para a equipe gerenciar o conteúdo em tempo real.

---

🌐 **[Acessar o site](https://radio-geracao-ativa.vercel.app/)** · 📱 Responsivo (mobile, tablet e desktop) · ✨ **[Login Admin](https://radio-geracao-ativa.vercel.app/admin/admin.html)**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://radio-geracao-ativa.vercel.app/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Realtime Database](https://img.shields.io/badge/Realtime%20Database-039BE5?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/docs/database)
![Status](https://img.shields.io/badge/Status-Ativo-success?style=for-the-badge)

</div>

---

## ✨ Características

- 📺 **Playlists do YouTube** — programas, entrevistas e coberturas exibidos em cards com player embutido
- 📰 **Notícias e publicações** — conteúdo editorial atualizado pela equipe via painel admin
- 📖 **Página institucional** — missão, visão, valores, grade de programas e equipe
- 👥 **Painel administrativo** — três níveis de acesso: Admin, Publicador e Gerente de Playlists
- 🔐 **Autenticação por papéis** — login protegido com credenciais e controle de permissões por sessão
- 🛠️ **Modo manutenção** — tela dedicada para visitantes durante atualizações no site
- 🚫 **Página 404** — tratamento amigável para endereços inexistentes
- 📱 **Design responsivo** — layout adaptado para celular, tablet e desktop
- 🎨 **Interface limpa e moderna** — identidade visual consistente em todas as páginas

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla ES Modules) |
| **Backend / Dados** | [Firebase Realtime Database](https://firebase.google.com/docs/database) |
| **Hospedagem** | [Vercel](https://vercel.com/) |
| **Controle de versão** | Git · [GitHub](https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa) |
| **Fontes** | Montserrat, Roboto (Google Fonts) |
| **Ícones** | Font Awesome (página Sobre) |

---

## 📁 Estrutura do Projeto

```
Radio-Geracao-Ativa/
├── admin/                  # Painel administrativo
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
├── pages/                  # Páginas internas
│   ├── sobre.html          # Institucional
│   ├── playlist.html       # Playlists do YouTube
│   ├── publi.html          # Notícias
│   └── manutencao.html     # Tela de manutenção
├── script/                 # JavaScript
│   ├── admin-auth.js       # Autenticação e papéis
│   ├── maintenance.js      # Controle do modo manutenção
│   ├── menu.js             # Menu mobile
│   ├── playlist.js         # Leitura das playlists
│   └── publi.js            # Leitura das notícias
├── style/                  # Estilos CSS
│   ├── index.css           # Estilos globais
│   ├── playlist.css
│   ├── publi.css
│   ├── maintenance.css
│   ├── manutencao-page.css
│   └── 404.css
├── assets/                 # Imagens e ícones
│   ├── logo.png
│   └── icon.png
├── index.html              # Página inicial
├── 404.html                # Página de erro 404
└── README.md
```

---

## ⚙️ Configuração do Firebase

O projeto utiliza o **Firebase Realtime Database** para sincronizar playlists, notícias e configurações de manutenção em tempo real.

A configuração (`firebaseConfig`) está nos arquivos:

- `script/playlist.js`
- `script/publi.js`
- `script/maintenance.js`
- `admin/admin.js`

Para usar um projeto Firebase próprio, substitua o objeto `firebaseConfig` nesses arquivos pelas credenciais do seu console Firebase.

> **Autenticação do painel:** o login admin **não** usa Firebase Authentication. As credenciais são validadas localmente via hash SHA-256, definidas em `script/admin-auth.js`.

Documentação oficial: [Firebase Realtime Database](https://firebase.google.com/docs/database)

---

## 👤 Autores e Créditos

- **Desenvolvido por:** Tiago⚡dev
- **Projeto:** Rádio Geração Ativa — UNASP São Paulo
- **Mantido por:** equipe da rádio e núcleo de produção estudantil

---

## 📄 Licença

© 2026 Rádio Geração Ativa. Todos os direitos reservados.

---

## 📬 Contato e Links

| | |
|---|---|
| 🌐 **Site** | [radio-geracao-ativa.vercel.app](https://radio-geracao-ativa.vercel.app/) |
| 📂 **GitHub** | [tiagoalmeida1605/Radio-Geracao-Ativa](https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa) |
| 📸 **Instagram** | [@radiogeracaoativa](https://www.instagram.com/radiogeracaoativa/) |
| ▶️ **YouTube** | [@radiogeracaoativa](https://www.youtube.com/@radiogeracaoativa) |
| 📧 **E-mail** | radiogeracaoativa@zohomail.com |

---

<div align="center">

*Feito com dedicação pela comunidade da Rádio Geração Ativa.*

</div>

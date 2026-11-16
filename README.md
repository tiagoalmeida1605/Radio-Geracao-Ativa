<div align="center">

<img src="./assets/RGA%20Claro.png" alt="Rádio Geração Ativa" width="220" />

# Rádio Geração Ativa

**A voz dos alunos do UNASP São Paulo na palma da sua mão.**

[![Deploy na Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge)](https://radio-geracao-ativa.vercel.app/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge)](https://firebase.google.com/)
[![Licença MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue?style=for-the-badge)](LICENSE)

[Visitar o site](https://radio-geracao-ativa.vercel.app/) · [Instagram](https://www.instagram.com/radiogeracaoativa/) · [YouTube](https://www.youtube.com/@radiogeracaoativa)

</div>

---

## Sobre o projeto

A **Rádio Geração Ativa** é a plataforma digital da rádio escolar do UNASP São Paulo. O site reúne conteúdos produzidos pela equipe, informações institucionais e ferramentas para administrar as publicações e os conteúdos em vídeo.

A plataforma foi desenvolvida para facilitar o acesso da comunidade escolar à programação e às novidades da rádio, tanto em computadores quanto em dispositivos móveis.

**Acesse:** [radio-geracao-ativa.vercel.app](https://radio-geracao-ativa.vercel.app/)

## Funcionalidades

- **Conteúdo do YouTube:** exibição de vídeos e playlists cadastrados pela equipe.
- **Feed da página inicial:** consulta e apresentação das notícias e dos vídeos mais recentes.
- **Notícias e publicações:** criação, edição, remoção e organização de notícias.
- **Categorias editoriais:** classificação das publicações por tags, com filtros na página de notícias.
- **Painel administrativo:** área restrita para gerenciamento dos conteúdos e das configurações disponíveis a cada perfil.
- **Autenticação:** login administrativo integrado ao Firebase Authentication.
- **Modo de manutenção:** recurso para controlar a exibição da página de manutenção.
- **Layout responsivo:** interface adaptada para celulares, tablets e computadores.

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Interface | HTML5, CSS3 e JavaScript com ES Modules |
| Autenticação | Firebase Authentication |
| Banco de dados | Firebase Realtime Database |
| API | JavaScript em módulos `.mjs` |
| Hospedagem | Vercel |
| Conteúdo em vídeo | YouTube |
| Tipografia | Google Fonts, Montserrat e Roboto |
| Ícones | Font Awesome e Lucide |
| Versionamento | Git e GitHub |

## API

O projeto possui rotas de API utilizadas para verificar o serviço e fornecer os conteúdos exibidos na página inicial.

| Rota | Método | Descrição |
|---|---|---|
| `/api/health` | `GET` | Verifica se a API está respondendo. |
| `/api/home-feed` | `GET` | Consulta o Firebase e retorna notícias e vídeos para a página inicial. |

O feed da página inicial retorna até seis notícias e seis conteúdos de vídeo, quando disponíveis.

## Estrutura do projeto

```text
Radio-Geracao-Ativa/
│
├── api/                           # Rotas da API
│   ├── health.mjs                 # Verificação de funcionamento
│   └── home-feed.mjs              # Feed de notícias e vídeos
│
├── admin/                         # Painel administrativo
│   ├── admin.html                 # Estrutura do painel
│   ├── admin.css                  # Estilos do painel
│   └── admin.js                   # Lógica e gerenciamento
│
├── assets/                        # Imagens e recursos visuais
│   ├── RGA Claro Microfone.png
│   ├── RGA Claro.png
│   ├── icon.png
│   └── logo.png
│
├── pages/                         # Páginas internas
│   ├── sobre.html                 # Informações institucionais
│   ├── playlist.html              # Vídeos e playlists
│   ├── publi.html                 # Notícias e publicações
│   └── manutencao.html            # Página de manutenção
│
├── script/                        # Módulos JavaScript
│   ├── admin-auth.js              # Autenticação e perfis de acesso
│   ├── firebase-config.js         # Configuração do Firebase
│   ├── home-feed.js               # Carregamento do feed inicial
│   ├── icon-catalog.js            # Catálogo de ícones
│   ├── maintenance.js             # Controle do modo de manutenção
│   ├── menu.js                    # Menu de navegação
│   ├── playlist.js                # Conteúdos do YouTube
│   ├── publication-tags.js        # Categorias editoriais
│   └── publi.js                   # Carregamento das publicações
│
├── style/                         # Folhas de estilo
│   ├── index.css                  # Estilos da página inicial
│   ├── playlist.css               # Estilos da página de vídeos
│   ├── publi.css                  # Estilos das publicações
│   ├── maintenance.css            # Estilos do modo de manutenção
│   ├── manutencao-page.css        # Estilos da página de manutenção
│   └── 404.css                    # Estilos da página de erro
│
├── .github/                       # Modelos e configurações do GitHub
├── 404.html                       # Página de erro
├── index.html                     # Página inicial
├── robots.txt                     # Regras para rastreadores
├── sitemap.xml                    # Mapa do site
├── vercel.json                    # Configurações de rotas da Vercel
├── CONTRIBUTING.md                # Guia de contribuição
├── SECURITY.md                    # Política de segurança
├── LICENSE                        # Licença do projeto
└── README.md                      # Documentação principal
```

## Categorias das publicações

As notícias podem receber uma ou mais tags editoriais, selecionadas no painel administrativo. As tags são armazenadas no campo `tags` do Firebase Realtime Database e utilizadas para organizar e filtrar as publicações na página de notícias.

O catálogo inicial inclui categorias como Semana de Oração, Eventos, UNASP, Esportes, Entrevistas, Avisos, Programação, Bastidores, Música, Cultura e Educação. Também é possível preservar e utilizar tags personalizadas.

Publicações antigas que não possuem tags continuam disponíveis e são exibidas sem uma categoria associada.

## Perfis de acesso

O painel administrativo possui três perfis, com permissões diferentes:

| Perfil | Permissões |
|---|---|
| **Administrador** | Acesso aos módulos administrativos, gerenciamento de notícias e vídeos e controle do modo de manutenção. |
| **Publicador de Notícias** | Gerenciamento das notícias e das respectivas publicações. |
| **Editor de Vídeos** | Gerenciamento dos vídeos e das playlists do YouTube. |

O acesso é autenticado pelo Firebase Authentication. O perfil e as permissões de cada conta são consultados no Firebase Realtime Database.

## Executar o projeto localmente

O projeto utiliza HTML, CSS e JavaScript no navegador, além de serviços do Firebase e rotas de API hospedadas na Vercel.

1. Clone o repositório:

   ```bash
   git clone https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd Radio-Geracao-Ativa
   ```

3. Abra o projeto em um servidor local compatível com módulos JavaScript e configure os serviços necessários do Firebase para o ambiente de desenvolvimento.

Algumas funcionalidades dependem da configuração do Firebase e do ambiente de hospedagem da API. Por isso, abrir o arquivo `index.html` diretamente pelo navegador pode não reproduzir todos os recursos do site publicado.

## Links

| Recurso | Endereço |
|---|---|
| Site oficial | [radio-geracao-ativa.vercel.app](https://radio-geracao-ativa.vercel.app/) |
| Repositório | [github.com/tiagoalmeida1605/Radio-Geracao-Ativa](https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa) |
| Instagram | [@radiogeracaoativa](https://www.instagram.com/radiogeracaoativa/) |
| YouTube | [@radiogeracaoativa](https://www.youtube.com/@radiogeracaoativa) |

## Sobre a iniciativa

A Rádio Geração Ativa é uma iniciativa do **Prof. Nelson JR**, responsável pela condução e pelo desenvolvimento da rádio escolar no UNASP São Paulo.

**Desenvolvimento técnico:** [Tiago Almeida](https://github.com/tiagoalmeida1605)

## Licença

O código deste projeto está disponível sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para conhecer os termos de uso, cópia, modificação e distribuição.

Copyright (c) 2026 Tiago Almeida Silvestre.

---

<div align="center">

<img src="./assets/RGA%20Claro.png" alt="Rádio Geração Ativa" width="90" />

**Rádio Geração Ativa — Comunicação, informação e comunidade.**

</div>

# 🔐 Política de Segurança | Security Policy

> Política de segurança da **Rádio Geração Ativa**, cobrindo o site público,
> painel administrativo, Firebase e demais componentes sob responsabilidade do projeto.

---

## 📑 Índice

- 🇧🇷 [Português](#-português)
  - [Versões suportadas](#-versões-suportadas)
  - [Como reportar uma vulnerabilidade](#-como-reportar-uma-vulnerabilidade)
  - [Informações recomendadas](#-informações-recomendadas-no-relatório)
  - [Escopo](#-escopo)
  - [Vulnerabilidades relevantes](#-exemplos-de-vulnerabilidades-relevantes)
  - [Testes não permitidos](#-problemas-que-não-devem-ser-explorados)
  - [Dados sensíveis](#-dados-sensíveis)
  - [Autenticação e autorização](#️-autenticação-e-autorização)
  - [Firebase Realtime Database](#-firebase-realtime-database)
  - [Divulgação responsável](#-divulgação-responsável)
  - [Pesquisadores de segurança](#-pesquisadores-de-segurança)
  - [Tecnologias](#-tecnologias-relevantes)
  - [Atualizações](#-atualizações-desta-política)
  - [Licença](#-licença)
- 🇺🇸 [English](#-english)
  - [Supported Versions](#-supported-versions)
  - [How to Report a Vulnerability](#-how-to-report-a-vulnerability)
  - [Recommended Report Information](#-recommended-report-information)
  - [Scope](#-scope)
  - [Relevant Vulnerabilities](#-examples-of-relevant-vulnerabilities)
  - [Prohibited Testing](#-issues-that-must-not-be-exploited)
  - [Sensitive Data](#-sensitive-data)
  - [Authentication and Authorization](#-authentication-and-authorization)
  - [Firebase Realtime Database](#-firebase-realtime-database-1)
  - [Responsible Disclosure](#-responsible-disclosure)
  - [Security Researchers](#-security-researchers)
  - [Technologies](#-relevant-technologies)
  - [Policy Updates](#-policy-updates)
  - [License](#-license-1)

---

# 🇧🇷 Português

## 📻 Rádio Geração Ativa

A **Rádio Geração Ativa** leva a segurança do seu site, painel administrativo e infraestrutura de dados a sério.

Este documento descreve como reportar vulnerabilidades de segurança encontradas no projeto e quais versões recebem atenção para correções.

---

## 🔐 Versões suportadas

Atualmente, o projeto é mantido principalmente na branch `main`.

| Versão / Branch | Suporte de segurança |
|---|---|
| `main` | ✅ Suportada |
| Versões antigas / commits anteriores | ⚠️ Sem garantia de suporte |

> As correções de segurança são priorizadas para a versão atualmente publicada e mantida do projeto.

---

## 🚨 Como reportar uma vulnerabilidade

Se você encontrar uma possível vulnerabilidade de segurança, **não abra uma Issue pública** contendo detalhes que possam permitir a exploração do problema.

Isso inclui, por exemplo:

- Credenciais;
- Tokens ou chaves privadas;
- Dados de usuários;
- Vulnerabilidades no sistema de autenticação;
- Falhas nas regras do Firebase;
- Formas de contornar permissões do painel administrativo;
- Acesso não autorizado ao Firebase Realtime Database;
- Falhas que permitam executar ações administrativas sem autorização;
- Informações que facilitem a exploração de uma vulnerabilidade.

### 🔒 GitHub Security Advisories

Sempre que possível, utilize o recurso de **Security Advisory** do GitHub para realizar o reporte de forma privada.

**Acesse:**  
https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa/security/advisories

Caso o recurso não esteja disponível para você, entre em contato com o mantenedor do projeto através do GitHub antes de publicar detalhes técnicos da vulnerabilidade.

---

## 📝 Informações recomendadas no relatório

Para facilitar a investigação, procure incluir:

### 1. Descrição da vulnerabilidade

- O que está acontecendo?
- Qual componente é afetado?

### 2. Impacto

- O que um atacante poderia fazer?
- Existe acesso não autorizado a dados ou funcionalidades?

### 3. Passos para reprodução

- Explique de forma clara como reproduzir o problema.
- Inclua exemplos mínimos e seguros.

### 4. Ambiente

- Navegador e versão, quando relevante;
- Dispositivo ou sistema operacional, quando relevante;
- Página ou funcionalidade afetada;
- Branch ou commit, se conhecido.

### 5. Evidências

- Capturas de tela;
- Logs;
- Mensagens de erro;
- Código ou requisições relevantes.

> ⚠️ Evite incluir informações pessoais, credenciais reais ou dados sensíveis no relatório.

---

## 🎯 Escopo

Os seguintes componentes fazem parte do escopo de segurança do projeto.

### 🌐 Site público

**Site oficial:**  
https://radio-geracao-ativa.vercel.app/

Vulnerabilidades que afetem a segurança do site, como XSS, exposição indevida de informações ou falhas de controle de acesso, podem ser reportadas.

### 🛠️ Painel administrativo

**Painel:**  
https://radio-geracao-ativa.vercel.app/admin/admin.html

O painel possui funcionalidades administrativas e controle de permissões.

Vulnerabilidades que permitam acesso ou execução de ações administrativas sem a devida autorização são consideradas relevantes.

### 🔥 Firebase

O projeto utiliza:

- Firebase Authentication;
- Firebase Realtime Database.

Falhas relacionadas à autenticação, autorização ou regras de acesso ao banco de dados devem ser reportadas de forma privada.

### ☁️ Infraestrutura de hospedagem

O site é hospedado através da **Vercel**.

Problemas específicos da infraestrutura da Vercel que não sejam causados pela configuração ou pelo código deste projeto devem ser reportados diretamente à Vercel.

---

## 🔎 Exemplos de vulnerabilidades relevantes

Entre os problemas que podem justificar um relatório estão:

- Bypass de autenticação;
- Escalada de privilégios;
- Acesso não autorizado ao painel administrativo;
- Acesso não autorizado a dados do Firebase;
- Regras de segurança do Firebase que permitam operações indevidas;
- Cross-Site Scripting (XSS);
- Injeção de conteúdo malicioso;
- Exposição acidental de informações sensíveis;
- Falhas que permitam modificar ou excluir conteúdo sem autorização;
- Falhas que permitam executar funcionalidades administrativas sem a permissão necessária;
- Exposição de credenciais, tokens ou segredos privados.

> Esta lista não é exaustiva.

---

## 🚫 Problemas que não devem ser explorados

Para proteger os usuários e a infraestrutura do projeto, pesquisadores de segurança devem evitar:

- Realizar ataques de negação de serviço (DoS/DDoS);
- Interromper ou degradar deliberadamente o funcionamento do site;
- Acessar, modificar ou excluir dados de outros usuários;
- Utilizar credenciais pertencentes a terceiros;
- Realizar engenharia social contra integrantes da equipe;
- Enviar spam através do sistema;
- Instalar malware ou executar ações destrutivas;
- Realizar testes que possam causar indisponibilidade do serviço;
- Publicar dados pessoais ou informações confidenciais encontradas durante a pesquisa.

> 🛡️ Testes devem ser realizados de maneira controlada e responsável.

---

## 🔒 Dados sensíveis

> **Nunca envie credenciais ou segredos diretamente para o repositório.**

Isso inclui:

- Senhas;
- Tokens de autenticação;
- Chaves privadas;
- Credenciais de serviços;
- Tokens de API que concedam privilégios;
- Dados pessoais;
- Informações privadas de usuários.

Arquivos de configuração ou variáveis de ambiente contendo informações sensíveis devem permanecer fora do controle público de versão.

Caso uma credencial seja exposta acidentalmente, ela deve ser considerada comprometida e revogada ou substituída o quanto antes.

---

## 🛡️ Autenticação e autorização

O projeto utiliza **Firebase Authentication** para autenticação e possui diferentes níveis de acesso no painel administrativo.

As permissões devem ser verificadas no lado apropriado da aplicação e não devem depender exclusivamente de elementos visuais ou controles presentes na interface.

> Ocultar um botão ou uma página não constitui, por si só, uma proteção de autorização.

Qualquer vulnerabilidade que permita contornar as permissões administrativas deve ser tratada como um problema de segurança.

---

## 🔥 Firebase Realtime Database

O Firebase Realtime Database é utilizado pelo projeto para armazenamento e sincronização de dados.

As regras de segurança do Firebase são parte fundamental da proteção da aplicação.

Alterações nas regras devem ser avaliadas cuidadosamente para evitar:

- Leitura pública de dados que deveriam ser protegidos;
- Escrita não autorizada;
- Exclusão não autorizada;
- Alteração de dados administrativos;
- Escalada de privilégios.

> Uma configuração funcional não deve ser considerada automaticamente uma configuração segura.

---

## 📢 Divulgação responsável

Pedimos que vulnerabilidades sejam reportadas de forma privada antes de qualquer divulgação pública.

Após o recebimento do relatório, a equipe poderá:

1. Avaliar e reproduzir o problema;
2. Determinar seu impacto;
3. Desenvolver uma correção;
4. Publicar a correção quando apropriado;
5. Comunicar a vulnerabilidade de maneira responsável.

O prazo para correção pode variar de acordo com a complexidade, impacto e disponibilidade de uma solução segura.

---

## 🧪 Pesquisadores de segurança

A Rádio Geração Ativa agradece contribuições responsáveis da comunidade de segurança.

Pesquisadores que identificarem uma vulnerabilidade e seguirem esta política devem evitar ações que possam causar danos aos usuários, ao serviço ou aos dados.

Ao reportar uma vulnerabilidade, forneça informações suficientes para que o problema possa ser reproduzido e corrigido.

---

## 📚 Tecnologias relevantes

O projeto utiliza atualmente tecnologias como:

- HTML5;
- CSS3;
- JavaScript (ES Modules);
- Firebase Authentication;
- Firebase Realtime Database;
- Vercel;
- Git;
- GitHub.

Mudanças futuras na arquitetura podem alterar esta lista.

---

## 📅 Atualizações desta política

Esta política pode ser atualizada conforme o projeto evolui, novas funcionalidades são adicionadas ou novas práticas de segurança são adotadas.

**Última atualização:** `2026-09-28`

---

## 📜 Licença

Este documento faz parte do projeto **Rádio Geração Ativa**.

Consulte o arquivo [`LICENSE`](LICENSE) para informações sobre os direitos e condições de uso do projeto.

---

# 🇺🇸 English

## 📻 Rádio Geração Ativa

Rádio Geração Ativa takes the security of its website, administrative panel, and data infrastructure seriously.

This document describes how to report security vulnerabilities found in the project and which versions receive attention for security fixes.

---

## 🔐 Supported Versions

Currently, the project is primarily maintained on the `main` branch.

| Version / Branch | Security Support |
|---|---|
| `main` | ✅ Supported |
| Older versions / previous commits | ⚠️ No guaranteed support |

> Security fixes are prioritized for the currently published and maintained version of the project.

---

## 🚨 How to Report a Vulnerability

If you discover a potential security vulnerability, **do not open a public Issue** containing details that could allow exploitation of the problem.

This includes, for example:

- Credentials;
- Tokens or private keys;
- User data;
- Vulnerabilities in the authentication system;
- Failures in Firebase security rules;
- Ways to bypass administrative panel permissions;
- Unauthorized access to the Firebase Realtime Database;
- Vulnerabilities that allow administrative actions to be performed without authorization;
- Information that could facilitate the exploitation of a vulnerability.

### 🔒 GitHub Security Advisories

Whenever possible, use GitHub's **Security Advisory** feature to submit the report privately.

**Go to:**  
https://github.com/tiagoalmeida1605/Radio-Geracao-Ativa/security/advisories

If this feature is not available to you, contact the project maintainer through GitHub before publishing technical details about the vulnerability.

---

## 📝 Recommended Report Information

To facilitate investigation, try to include:

### 1. Vulnerability Description

- What is happening?
- Which component is affected?

### 2. Impact

- What could an attacker do?
- Is there unauthorized access to data or functionality?

### 3. Steps to Reproduce

- Clearly explain how to reproduce the issue.
- Include minimal and safe examples.

### 4. Environment

- Browser and version, when relevant;
- Device or operating system, when relevant;
- Affected page or functionality;
- Branch or commit, if known.

### 5. Evidence

- Screenshots;
- Logs;
- Error messages;
- Relevant code or requests.

> ⚠️ Avoid including personal information, real credentials, or sensitive data in the report.

---

## 🎯 Scope

The following components are within the project's security scope.

### 🌐 Public Website

**Official website:**  
https://radio-geracao-ativa.vercel.app/

Vulnerabilities that affect the security of the website, such as XSS, unintended information exposure, or access control issues, may be reported.

### 🛠️ Administrative Panel

**Panel:**  
https://radio-geracao-ativa.vercel.app/admin/admin.html

The panel provides administrative functionality and permission controls.

Vulnerabilities that allow unauthorized access or unauthorized execution of administrative actions are considered relevant.

### 🔥 Firebase

The project uses:

- Firebase Authentication;
- Firebase Realtime Database.

Issues related to authentication, authorization, or database access rules should be reported privately.

### ☁️ Hosting Infrastructure

The website is hosted through **Vercel**.

Issues specific to Vercel's infrastructure that are not caused by the configuration or code of this project should be reported directly to Vercel.

---

## 🔎 Examples of Relevant Vulnerabilities

Problems that may justify a report include:

- Authentication bypass;
- Privilege escalation;
- Unauthorized access to the administrative panel;
- Unauthorized access to Firebase data;
- Firebase security rules that allow unauthorized operations;
- Cross-Site Scripting (XSS);
- Malicious content injection;
- Accidental exposure of sensitive information;
- Vulnerabilities that allow content to be modified or deleted without authorization;
- Vulnerabilities that allow administrative functionality to be executed without the required permission;
- Exposure of credentials, tokens, or private secrets.

> This list is not exhaustive.

---

## 🚫 Issues That Must Not Be Exploited

To protect users and the project's infrastructure, security researchers should avoid:

- Conducting denial-of-service (DoS/DDoS) attacks;
- Deliberately disrupting or degrading the operation of the website;
- Accessing, modifying, or deleting other users' data;
- Using credentials belonging to third parties;
- Conducting social engineering attacks against team members;
- Sending spam through the system;
- Installing malware or performing destructive actions;
- Conducting tests that may cause service unavailability;
- Publishing personal data or confidential information discovered during research.

> 🛡️ Testing must be carried out in a controlled and responsible manner.

---

## 🔒 Sensitive Data

> **Never commit credentials or secrets directly to the repository.**

This includes:

- Passwords;
- Authentication tokens;
- Private keys;
- Service credentials;
- API tokens that grant privileges;
- Personal data;
- Private user information.

Configuration files or environment variables containing sensitive information must remain outside public version control.

If a credential is accidentally exposed, it should be considered compromised and revoked or replaced as soon as possible.

---

## 🛡️ Authentication and Authorization

The project uses **Firebase Authentication** for authentication and has different access levels within the administrative panel.

Permissions must be verified on the appropriate side of the application and must not rely exclusively on visual elements or controls present in the interface.

> Hiding a button or page does not, by itself, constitute authorization protection.

Any vulnerability that allows administrative permissions to be bypassed should be treated as a security issue.

---

## 🔥 Firebase Realtime Database

The Firebase Realtime Database is used by the project for data storage and synchronization.

Firebase security rules are a fundamental part of protecting the application.

Changes to these rules must be carefully evaluated to prevent:

- Public access to data that should be protected;
- Unauthorized writes;
- Unauthorized deletion;
- Modification of administrative data;
- Privilege escalation.

> A configuration that works correctly should not automatically be considered a secure configuration.

---

## 📢 Responsible Disclosure

We ask that vulnerabilities be reported privately before any public disclosure.

After receiving a report, the team may:

1. Evaluate and reproduce the issue;
2. Determine its impact;
3. Develop a fix;
4. Release the fix when appropriate;
5. Communicate the vulnerability responsibly.

The time required for remediation may vary depending on the complexity, impact, and availability of a secure solution.

---

## 🧪 Security Researchers

Rádio Geração Ativa appreciates responsible contributions from the security community.

Researchers who identify a vulnerability and follow this policy should avoid actions that could cause harm to users, the service, or its data.

When reporting a vulnerability, provide enough information for the issue to be reproduced and fixed.

---

## 📚 Relevant Technologies

The project currently uses technologies such as:

- HTML5;
- CSS3;
- JavaScript (ES Modules);
- Firebase Authentication;
- Firebase Realtime Database;
- Vercel;
- Git;
- GitHub.

Future architectural changes may alter this list.

---

## 📅 Policy Updates

This policy may be updated as the project evolves, new features are added, or new security practices are adopted.

**Last updated:** `2026-09-28`

---

## 📜 License

This document is part of the **Rádio Geração Ativa** project.

See the [`LICENSE`](LICENSE) file for information about the rights and terms of use of the project.

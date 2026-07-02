# GIGN

[![CI/CD Pipeline](https://github.com/juninmd/gign/actions/workflows/ci.yml/badge.svg)](https://github.com/juninmd/gign/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/juninmd/gign/branch/main/graph/badge.svg)](https://codecov.io/gh/juninmd/gign)
[![NPM Version](https://img.shields.io/npm/v/gign.svg)](https://npmjs.org/package/gign)
[![NPM Downloads](https://img.shields.io/npm/dm/gign.svg)](https://npmjs.org/package/gign)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

```
  ________.__
 /  _____/|__| ____   ____
/   \  ___|  |/ ___\ /    \
\    \_\  \  / /_/  >   |  \
 \______  /__\___  /|___|  /
        \/  /_____/      \/
```

> Gerador automático de arquivos `.gitignore` para seus projetos. Inspirado no [gitignore.io](https://www.toptal.com/developers/gitignore).

## 📝 Descrição

**GIGN** é uma ferramenta CLI que gera automaticamente arquivos `.gitignore` personalizados para seus projetos. Basta informar o diretório e as tecnologias desejadas.

## ✨ Funcionalidades

- Geração automática de `.gitignore`
- Suporte a múltiplas linguagens e frameworks
- Interface CLI simples e rápida
- CI/CD com GitHub Actions
- Cobertura de testes com Codecov

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Linguagem:** JavaScript
- **CLI:** Commander
- **Testes:** Jest
- **Linting:** ESLint
- **CI:** GitHub Actions
- **Cobertura:** Codecov

## 🚀 Instalação

```bash
# Via npm
npm install -g gign

# Via yarn
yarn global add gign
```

## 📖 Uso

```bash
gign <caminho>
```

O comando irá gerar um arquivo `.gitignore` personalizado no diretório especificado.

## ✅ Requisitos

- Node.js 8+ (para suporte a Async/Await)

## 📜 Licença

MIT

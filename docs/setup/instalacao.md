---
sidebar_position: 1
---

# Instalando Node.js com NVM

Este guia prepara um ambiente moderno para desenvolvimento com:

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Não instale Node.js pelo apt

Evite fazer:

```bash
sudo apt update
sudo apt install nodejs npm
```

Os repositórios do Ubuntu frequentemente possuem versões mais antigas do Node.js, o que pode causar incompatibilidades com versões recentes do Vite.

---

## Instale o NVM (Node Version Manager)

O NVM permite instalar e gerenciar diferentes versões do Node.js facilmente.

Execute:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

---

## Recarregue o terminal

Se estiver usando Bash:

```bash
source ~/.bashrc
```

Se estiver usando Zsh:

```bash
source ~/.zshrc
```

---

## Verifique se o NVM foi instalado

```bash
nvm --version
```

Exemplo de saída:

```text
0.40.3
```

---

## Instale a versão LTS do Node.js

A versão LTS (Long Term Support) é a mais estável para desenvolvimento.

```bash
nvm install --lts
```

---

## Utilize a versão instalada

```bash
nvm use --lts
```

Opcionalmente, defina-a como padrão:

```bash
nvm alias default lts/*
```

---

## Verifique a instalação

```bash
node -v
npm -v
```

Exemplo:

```text
v22.x.x
10.x.x
```

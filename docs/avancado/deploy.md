---
sidebar_position: 9
---

# Deploy

## O problema

Você fez o app. Agora precisa colocar no ar pra outras pessoas usarem. O build de produção gera arquivos otimizados que você serve via CDN, servidor web ou container.

## Build de produção

```bash
npm run build
```

Gera a pasta `dist/` com arquivos otimizados: minificados, tree-shaken, com hash nos nomes (ex: `main.a1b2c3.js`) para cache busting.

## Variáveis de ambiente

```bash
# .env
VITE_API_URL=https://api.exemplo.com
```

Use no código:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

⚠️ Apenas variáveis com prefixo `VITE_` ficam disponíveis no front-end. Variáveis sem o prefixo são só pro Node.js (build time).

## Deploy estático (Vercel)

A maneira mais simples:

```bash
npm install -g vercel
vercel
```

Ou conecte o repositório GitHub em vercel.com — deploy automático a cada push.

### Configuração `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Por quê?** O React Router gerencia as rotas no cliente. Se o usuário digita `/dashboard` direto na URL, o servidor precisa servir `index.html` pra qualquer rota — senão dá 404.

## Deploy estático (Netlify)

Similar à Vercel. Arquivo `_redirects`:

```
# public/_redirects
/*    /index.html   200
```

## Docker + Nginx

```dockerfile
# Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

O `try_files $uri $uri/ /index.html` faz o mesmo que o rewrite da Vercel: qualquer rota cai no `index.html` pro React Router resolver.

## GitHub Actions — CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      # Adicione o deploy para Vercel/Netlify/Docker aqui
```

## Checklist pré-deploy

- [ ] `VITE_API_URL` configurada para produção
- [ ] Build sem erros (`npm run build`)
- [ ] Lint passando (`npm run lint`)
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] Rotas funcionando com `BrowserRouter` (fallback do servidor)
- [ ] Página 404 customizada
- [ ] Meta tags de SEO (title, description, og:image)

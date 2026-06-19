---
sidebar_position: 2
---

# Setup e Estrutura

## Scaffold

```bash
npm create vite@latest portal-admin -- --template react-ts
cd portal-admin
npm install
```

## Dependências

```bash
# Produção
npm install react-router-dom @tanstack/react-query axios zustand react-hook-form @hookform/resolvers zod lucide-react

# Desenvolvimento
npm install -D tailwindcss @tailwindcss/vite
```

## Tailwind v4

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

## Estrutura final

```
src/
  services/
    api.ts
  hooks/
    useAuth.ts
    useUsuarios.ts
  stores/
    useUIStore.ts
  schemas/
    login.ts
    usuario.ts
  features/
    auth/pages/LoginPage.tsx
    home/pages/HomePage.tsx
    users/pages/UsersPage.tsx
  layouts/
    MainLayout.tsx
    AuthLayout.tsx
  components/
    ui/
      Button.tsx
      Input.tsx
  routes/
    paths.ts
    PrivateRoute.tsx
    AppRoutes.tsx
  App.tsx
  main.tsx
```

Referências: Módulo 1 (setup), Módulo 5 (Tailwind)

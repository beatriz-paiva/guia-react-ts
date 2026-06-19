---
sidebar_position: 3
---

# Configuração do Projeto

## tsconfig.json

Ative o modo estrito e configure path aliases:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- `strict: true` — ativa todas as verificações rigorosas do TypeScript
- `paths` — permite imports como `import { Button } from '@/components/Button'`

---

## Vite — Path aliases

Instale o path alias no Vite para corresponder ao `tsconfig.json`:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Agora você pode importar arquivos com `@/components/Button` tanto no TypeScript quanto no Vite.

---

## ESLint — Flat config

O ESLint com flat config (`eslint.config.js`) substitui o antigo `.eslintrc`.

Configuração recomendada para React + TypeScript:

```ts
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
)
```

---

## npm scripts comuns

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

| Comando | Função |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila TS + gera build de produção |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Verifica código com ESLint |
| `npm run typecheck` | Verifica tipos sem gerar arquivos |

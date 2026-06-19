---
sidebar_position: 1
---

# Tailwind CSS

Tailwind é um framework CSS utilitário. Você estiliza usando classes prontas diretamente no JSX.

## Instalação no Vite

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Adicione o plugin no `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

No arquivo CSS principal (`src/index.css` ou `src/App.css`), adicione:

```css
@import "tailwindcss";
```

---

## Classes utilitárias

```tsx
function Card() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800">Título</h2>
      <p className="text-gray-600 mt-2">Conteúdo do card</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Botão
      </button>
    </div>
  );
}
```

---

## Responsivo

Use prefixos `sm:`, `md:`, `lg:`, `xl:` para aplicar estilos em breakpoints específicos.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-gray-100">Card 1</div>
  <div className="p-4 bg-gray-100">Card 2</div>
  <div className="p-4 bg-gray-100">Card 3</div>
</div>
```

---

## Dark mode

No Tailwind v4, o dark mode baseado em classe já vem habilitado:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <p>Conteúdo com suporte a dark mode</p>
</div>
```

Combine com `prefers-color-scheme` para detectar o tema do sistema:

```css
/* index.css */
@import "tailwindcss";

@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
}
```

---

## Estados (hover, focus, active)

```tsx
<button className="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 active:bg-blue-800 transition">
  Clique aqui
</button>
```

### Estados de formulário

```tsx
<input
  className="border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500
             disabled:bg-gray-100 disabled:cursor-not-allowed
             invalid:border-red-500"
/>
```

---

## Design Tokens com @theme

No Tailwind v4, você define tokens customizados no CSS:

```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #8b5cf6;
  --font-family-sans: 'Inter', sans-serif;
  --spacing-18: 4.5rem;
}
```

Agora use `bg-primary`, `text-primary-dark`, `font-sans`, `p-18` como classes normais.

---

## Animações

Tailwind v4 tem animações nativas. Crie as suas com `@keyframes` + `@theme`:

```css
@theme {
  --animate-slide-in: slide-in 0.3s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

Uso:

```tsx
<div className="animate-slide-in">Conteúdo animado</div>
```

---

## @apply e @layer

Use `@apply` para agrupar classes utilitárias em classes customizadas. Use com moderação:

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition;
  }

  .card {
    @apply bg-white rounded-xl shadow-md p-6;
  }
}
```

```tsx
<button className="btn-primary">Salvar</button>
```

⚠️ Prefira classes utilitárias direto no JSX. `@apply` é útil para Design Systems, mas pode recriar o problema que o Tailwind resolveu (nomes mágicos).

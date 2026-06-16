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

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <p>Conteúdo com suporte a dark mode</p>
</div>
```

Habilite no `tailwind.config.js` se necessário.

---

## Estados (hover, focus, active)

```tsx
<button className="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 active:bg-blue-800 transition">
  Clique aqui
</button>
```

---
sidebar_position: 1
---

# Tailwind CSS

## O problema do CSS tradicional

Você cria um arquivo CSS, inventa um nome de classe (`btn-primary`), escreve 10 linhas de estilo. Depois outro botão aparece, você cria `btn-primary-large`. O CSS cresce, nomes viram bagunça, e uma classe que você achava que não usava mais... quebrou a página de outro lugar.

Tailwind troca isso por **classes atômicas prontas** aplicadas direto no JSX. Em vez de escrever CSS, você combina classes pequenas e descritivas.

## Instalação no Vite

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Adicione no `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

No CSS principal, importe:

```css
@import "tailwindcss";
```

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

Cada classe faz **uma coisa só**: `text-xl` é tamanho, `font-bold` é peso, `bg-blue-500` é cor de fundo. Você monta o estilo como Lego.

**Por que isso é bom?**
- **Sem nomes pra inventar** — adeus `btn-primary-small-secondary`
- **Sem CSS que cresce** — as classes que você não usa são removidas no build (purge)
- **Sem vazamento** — o estilo fica colado no elemento

## Responsivo

Use prefixos `sm:`, `md:`, `lg:` pra aplicar estilos em breakpoints específicos:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-gray-100">Card 1</div>
  <div className="p-4 bg-gray-100">Card 2</div>
  <div className="p-4 bg-gray-100">Card 3</div>
</div>
```

1 coluna no mobile, 2 no tablet (`md:`), 3 no desktop (`lg:`). Tudo na mesma linha.

## Dark mode

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <p>Conteúdo com suporte a dark mode</p>
</div>
```

O prefixo `dark:` ativa quando o tema escuro está ativo. Pra detectar o tema do sistema:

```css
@import "tailwindcss";

@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
}
```

## Estados (hover, focus, active)

```tsx
<button className="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 active:bg-blue-800 transition">
  Clique aqui
</button>
```

```tsx
<input
  className="border border-gray-300 rounded px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500
             disabled:bg-gray-100 disabled:cursor-not-allowed
             invalid:border-red-500"
/>
```

Cada estado tem seu prefixo: `hover:`, `focus:`, `active:`, `disabled:`, `invalid:`. Sem precisar escrever CSS separado.

## Design Tokens com @theme

No Tailwind v4, você define os tokens do seu design system no CSS:

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #8b5cf6;
  --font-family-sans: 'Inter', sans-serif;
  --spacing-18: 4.5rem;
}
```

Agora `bg-primary`, `text-primary-dark`, `font-sans`, `p-18` funcionam como classes normais.

## Animações

Crie animações customizadas com `@keyframes` + `@theme`:

```css
@theme {
  --animate-slide-in: slide-in 0.3s ease-out;
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
```

```tsx
<div className="animate-slide-in">Conteúdo animado</div>
```

## @apply e @layer

Use `@apply` pra agrupar classes utilitárias em uma classe só:

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

⚠️ **Use com moderação.** `@apply` meio que recria o problema que o Tailwind resolveu — você volta a ter nomes mágicos e CSS em arquivo separado. É útil em Design Systems, mas no dia a dia prefira as classes direto no JSX.

## Tailwind vs CSS tradicional

| Tailwind | CSS tradicional |
|---|---|
| Estilo no JSX | Estilo em arquivo separado |
| Sem nomes pra inventar | Nomenclatura (BEM, etc.) |
| Apenas classes usadas viram CSS | Todo o CSS carregado |
| Responsivo inline com prefixos | Media queries em arquivo |
| Consistente por design | Fácil de criar estilos inconsistentes |

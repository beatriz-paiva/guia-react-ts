---
sidebar_position: 1
---

# JSX vs TSX

## JSX

JSX significa:

> JavaScript XML

É uma extensão de sintaxe que permite escrever algo parecido com HTML dentro do JavaScript.

Exemplo:

```jsx
function App() {
  return (
    <h1>Olá Mundo</h1>
  )
}
```

Arquivo:

```text
App.jsx
```

---

## TSX

TSX significa:

> TypeScript XML

É exatamente o JSX, mas com suporte aos recursos do TypeScript.

Exemplo:

```tsx
function App(): JSX.Element {
  return (
    <h1>Olá Mundo</h1>
  )
}
```

Arquivo:

```text
App.tsx
```

Hoje, em projetos React modernos, praticamente tudo é feito com:

```text
.ts
.tsx
```

e não mais com:

```text
.js
.jsx
```

---

## Como funciona

Todo JSX é compilado para `React.createElement`.

```jsx
const elemento = <h1>Olá</h1>;
// vira: React.createElement('h1', null, 'Olá')
```

Isso vale tanto para arquivos `.jsx` quanto `.tsx`.

---

## Expressões com {}

Para inserir valores JavaScript dentro do JSX, use chaves:

```jsx
const nome = "Maria";
const elemento = <h1>Olá, {nome}!</h1>;
```

Também funciona com funções e operadores:

```tsx
function formatarNome(nome: string) {
  return nome.toUpperCase();
}

const elemento = <h1>Olá, {formatarNome("Maria")}</h1>;
```

---

## Diferenças do HTML

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `onclick` | `onClick` |
| `autofocus` | `autoFocus` |

---

## Fragmentos

Um componente precisa retornar um único elemento. Use fragmentos para agrupar sem adicionar nós ao DOM:

```tsx
function Painel() {
  return (
    <>
      <h1>Título</h1>
      <p>Parágrafo</p>
    </>
  );
}
```

---

## Condicionais

Use operador ternário ou `&&`:

```tsx
function Saudacao({ nome }: { nome: string }) {
  return (
    <div>
      {nome ? <h1>Olá, {nome}</h1> : <h1>Olá, visitante</h1>}
      {nome.length > 5 && <p>Nome longo!</p>}
    </div>
  );
}
```

---

## Listas com .map()

```tsx
function Lista({ itens }: { itens: { id: number; nome: string }[] }) {
  return (
    <ul>
      {itens.map((item) => (
        <li key={item.id}>{item.nome}</li>
      ))}
    </ul>
  );
}
```

A prop `key` é obrigatória ao renderizar listas. Ajuda o React a identificar quais itens mudaram.

---

## Quando usar .ts?

Quando não existe interface visual.

Exemplo:

```ts
export type User = {
  id: number;
  nome: string;
}
```

ou

```ts
export function formatarNome(nome: string) {
  return nome.trim();
}
```

Como não há HTML/JSX sendo renderizado:

```text
user.ts
utils.ts
```

---

## Quando usar .tsx?

Sempre que existir JSX.

Exemplo:

```jsx
function Button() {
  return (
    <button>
      Entrar
    </button>
  );
}
```

Como existe `<button>`, o arquivo precisa ser:

```text
Button.tsx
```

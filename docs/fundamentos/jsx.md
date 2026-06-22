---
sidebar_position: 1
---

# JSX vs TSX

JSX é a sintaxe que **parece HTML mas não é**. O navegador não entende JSX — ele precisa ser transformado em JavaScript puro antes.

```jsx
// O que você escreve:
const elemento = <h1>Olá Mundo</h1>;

// O que vira (simplificado):
const elemento = React.createElement('h1', null, 'Olá Mundo');
```

## Por que isso importa?

Porque você não está escrevendo HTML. Você está escrevendo **chamadas de função** que lembram HTML. É por isso que:

- Em vez de `class`, usa `className` (porque `class` é palavra reservada do JS)
- Em vez de `for`, usa `htmlFor`
- Em vez de `style="color: red"`, usa `style={{ color: 'red' }}` (objeto JavaScript)

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `onclick` | `onClick` |
| `autofocus` | `autoFocus` |

## JSX vs TSX

- **JSX** — JavaScript + XML (arquivo `.jsx`)
- **TSX** — TypeScript + XML (arquivo `.tsx`)

A diferença é só o TypeScript. Em projetos modernos, usa-se `.tsx` pra componentes e `.ts` pra lógica pura.

## Expressões com {}

Pra colocar JavaScript dentro do JSX, use `{}`:

```tsx
const nome = "Maria";
const elemento = <h1>Olá, {nome}!</h1>;
```

Pode ser função, operador, qualquer expressão JavaScript:

```tsx
<h1>Olá, {formatarNome("Maria")}</h1>
```

## Condicionais

O JSX não tem `if`. Use o **operador ternário** ou `&&`:

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

O `&&` funciona porque: se a condição é `false`, o React ignora. Se é `true`, renderiza o elemento.

## Listas com key

Pra renderizar listas, use `.map()`. Cada item precisa de uma `key`:

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

**Por que `key` é necessária?** O React usa a `key` pra identificar cada item da lista. Quando a lista muda (reordena, insere, remove), ele olha as keys pra saber o que mudou — em vez de destruir tudo e recriar.

**Por que não usar o índice?** Se a lista for reordenada ou filtrada, o índice 0 pode ser um item diferente, mas o React acha que é o mesmo — causando bugs de estado.

```tsx
// Ruim — índice muda quando a lista muda
{itens.map((item, index) => <li key={index}>{item.nome}</li>)}

// Bom — id único e estável
{itens.map((item) => <li key={item.id}>{item.nome}</li>)}
```

## Fragmentos

Um componente precisa retornar **um único elemento**. Pra agrupar vários sem criar uma div extra, use `<>`:

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

## dangerouslySetInnerHTML

Pra renderizar HTML vindo de string (use com **extrema** cautela):

```tsx
function Conteudo({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

⚠️ Isso abre brecha pra **XSS**. Só use se o conteúdo for sanitizado previamente.

## .ts vs .tsx

- **`.ts`** — quando não tem JSX (tipos, funções, hooks)
- **`.tsx`** — quando tem JSX (componentes)

```
user.ts          → type Usuario = { ... }
utils.ts         → function formatarNome() { ... }
Button.tsx       → function Button() { return <button>...</button> }
useAuth.ts       → function useAuth() { ... } (hook, sem JSX)
```

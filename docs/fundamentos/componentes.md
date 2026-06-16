---
sidebar_position: 2
---

# Componentes

Componentes são blocos de construção da interface. Cada componente é uma função que retorna JSX.

## Função componente

```tsx
function Botao() {
  return <button>Clique aqui</button>;
}
```

Ou com arrow function:

```tsx
const Botao = () => {
  return <button>Clique aqui</button>;
};
```

---

## Exportando e importando

```tsx
// Botao.tsx
export function Botao() {
  return <button>Clique aqui</button>;
}

// App.tsx
import { Botao } from './Botao';

function App() {
  return (
    <div>
      <Botao />
      <Botao />
    </div>
  );
}
```

Use `export default` ou `export nomeado`. O nomeado é mais comum em projetos maiores.

---

## Composição

Componentes podem ser compostos: um componente usa outro dentro dele.

```tsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function Pagina() {
  return (
    <Card>
      <h2>Título do card</h2>
      <p>Conteúdo do card</p>
    </Card>
  );
}
```

Onde `children` é tudo que for passado entre as tags do componente.

---

## Regras importantes

- Nome do componente sempre com letra **maiúscula**
- Todo componente retorna um único elemento (use fragmento `<>` se precisar)
- Componente puro: não deve modificar variáveis externas

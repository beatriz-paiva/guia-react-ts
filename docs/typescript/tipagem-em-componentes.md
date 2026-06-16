---
sidebar_position: 2
---

# Props tipadas (IMPORTANTE PARA REACT)

Imagine um componente:

```tsx
function Button() {
  return <button>Clique</button>;
}
```

Agora queremos passar um texto:

```tsx
<Button texto="Salvar" />
```

Precisamos dizer ao TypeScript quais props existem. Criamos um tipo:

```tsx
type ButtonProps = {
  texto: string;
};
```

Depois:

```tsx
function Button(props: ButtonProps) {
  return (
    <button>
      {props.texto}
    </button>
  );
}
```

Uso:

```tsx
<Button texto="Salvar" />
```

---

## Desestruturando

Você verá muito isso:

```tsx
function Button({ texto }: ButtonProps) {
  return <button>{texto}</button>;
}
```

É exatamente a mesma coisa.

---

## children

A prop `children` recebe tudo que for passado entre as tags do componente.

```tsx
interface CardProps {
  titulo: string;
  children: React.ReactNode;
}

function Card({ titulo, children }: CardProps) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      {children}
    </div>
  );
}
```

`React.ReactNode` aceita qualquer coisa renderizável: JSX, strings, números, fragmentos, `null`, `undefined`.

---

## Eventos tipados

```tsx
function Formulario() {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.clientX);
  }
}
```

---

## useRef com TypeScript

```tsx
function InputFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusar() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusar}>Focar input</button>
    </>
  );
}
```

---

## Tipagem de hooks

```tsx
const [texto, setTexto] = useState<string>("");
const [numeros, setNumeros] = useState<number[]>([1, 2, 3]);
const [usuario, setUsuario] = useState<Usuario | null>(null);
```

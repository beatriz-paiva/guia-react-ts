---
sidebar_position: 3
---

# Props

Props (propriedades) são os argumentos passados para um componente. Permitem que o componente receba dados e se comporte de forma diferente.

## Passando props

```tsx
function App() {
  return <Saudacao nome="Ana" idade={25} />;
}
```

---

## Recebendo props

```tsx
function Saudacao(props) {
  return (
    <div>
      <h1>Olá, {props.nome}</h1>
      <p>Idade: {props.idade}</p>
    </div>
  );
}
```

É mais comum desestruturar:

```tsx
function Saudacao({ nome, idade }) {
  return (
    <div>
      <h1>Olá, {nome}</h1>
      <p>Idade: {idade}</p>
    </div>
  );
}
```

---

## Tipagem com TypeScript

```tsx
interface SaudacaoProps {
  nome: string;
  idade: number;
}

function Saudacao({ nome, idade }: SaudacaoProps) {
  return (
    <div>
      <h1>Olá, {nome}</h1>
      <p>Idade: {idade}</p>
    </div>
  );
}
```

---

## Props opcionais

Use `?` para tornar uma prop opcional e defina um valor padrão:

```tsx
interface BotaoProps {
  texto?: string;
}

function Botao({ texto = "Clique aqui" }: BotaoProps) {
  return <button>{texto}</button>;
}
```

---

## children

A prop `children` recebe tudo que for passado entre as tags do componente.

```tsx
interface CardProps {
  children: React.ReactNode;
  titulo: string;
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

---

## Props são somente leitura

Nunca modifique props dentro do componente. Se precisar de dados mutáveis, use estado.

---

## React.PropsWithChildren

Atalho para tipar componente com `children`:

```tsx
import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  titulo: string;
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

---

## Spreading props

Você pode passar props dinâmicas com o operador spread:

```tsx
interface InputProps {
  label: string;
}

function Input({ label, ...rest }: InputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} />
    </div>
  );
}

// Uso
<Input label="Email" type="email" placeholder="seu@email.com" required />
```

⚠️ Use com cautela — o spread pode passar props inesperadas para o DOM.

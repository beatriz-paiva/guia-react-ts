---
sidebar_position: 3
---

# Generics (o que mais assusta iniciantes)

A ideia é simples.

Imagine uma caixa. Sem generics:

```tsx
const valor = "Olá";
```

Só aceita string.

Com generics `<T>` significa: "o tipo será definido depois".

Exemplo:

```tsx
function retornar<T>(valor: T): T {
  return valor;
}
```

Uso:

```tsx
retornar("Olá");
```

O TypeScript entende: `T = string`

Outro:

```tsx
retornar(10);
```

Agora: `T = number`

Mesma função. Tipos diferentes.

---

# Onde você verá Generics no React?

Principalmente no `useState`.

```tsx
const [nome, setNome] = useState<string>("");
```

Aqui `<string>` é um Generic. Estamos dizendo: "esse estado armazenará strings".

Outro exemplo:

```tsx
const [usuarios, setUsuarios] = useState<Usuario[]>([]);
```

Leitura: "estado guarda uma lista de usuários".

---

# Componente genérico

O Generic também funciona em componentes:

```tsx
interface ListaProps<T> {
  itens: T[];
  renderItem: (item: T) => React.ReactNode;
}

function Lista<T>({ itens, renderItem }: ListaProps<T>) {
  return (
    <ul>
      {itens.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

Uso:

```tsx
<Lista<Usuario>
  itens={usuarios}
  renderItem={(usuario) => <span>{usuario.nome}</span>}
/>
```

---

# Hook genérico

```tsx
function useLocalStorage<T>(chave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const stored = localStorage.getItem(chave);
    return stored ? JSON.parse(stored) : valorInicial;
  });

  function atualizar(novoValor: T) {
    setValor(novoValor);
    localStorage.setItem(chave, JSON.stringify(novoValor));
  }

  return [valor, atualizar] as const;
}
```

Uso:

```tsx
const [token, setToken] = useLocalStorage<string>("token", "");
```

---

# Exemplo completo de React + TypeScript

```tsx
type Usuario = {
  id: number;
  nome: string;
};

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  return (
    <div>
      {usuarios.map(usuario => (
        <p key={usuario.id}>
          {usuario.nome}
        </p>
      ))}
    </div>
  );
}
```

Aqui aparecem vários conceitos juntos:

- `type`
- objeto
- array
- generic
- props (quando criar componentes)
- função (`map`)
- tipagem

Essa é exatamente a base que você encontrará em praticamente qualquer projeto React moderno com TypeScript. Depois que dominar isso, o próximo passo natural é aprender **TSX**, **componentes**, **JSX**, **Hooks** (`useState`, `useEffect`), **eventos tipados** e **rotas com React Router**, porque é aí que React realmente começa a fazer sentido.

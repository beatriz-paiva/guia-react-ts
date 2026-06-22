---
sidebar_position: 3
---

# Generics (o que mais assusta)

Generics é o que mais assusta em TypeScript. Mas a ideia é simples: é como um **"tipo variável"** — você cria uma função/componente que funciona com qualquer tipo, e o tipo é definido **na hora de usar**.

## A caixa vazia

Sem generics, uma função só aceita um tipo específico:

```tsx
function retornar(valor: string): string {
  return valor;
}

retornar("Olá"); // ✅ funciona
retornar(10);    // ❌ erro: number não é string
```

Com generics, você diz "o tipo será definido depois":

```tsx
function retornar<T>(valor: T): T {
  return valor;
}

retornar("Olá"); // T = string
retornar(10);    // T = number
```

O `<T>` é como um placeholder. O TypeScript descobre o tipo automaticamente pelo valor que você passa.

## Onde você vê Generics no React?

### useState

```tsx
const [nome, setNome] = useState<string>("");
//                ^^^^^^^^ Generic: esse estado guarda strings

const [usuarios, setUsuarios] = useState<Usuario[]>([]);
//                ^^^^^^^^^^ Generic: esse estado guarda uma lista de Usuario
```

**Por que o Generic no useState?** Porque o React não sabe que tipo de valor você vai guardar. Você informa: "isso aqui é string", "isso aqui é Usuario[]". Assim o TypeScript sabe o tipo de `nome` e `usuarios` em todo lugar.

### Componente genérico

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

**Uso:**

```tsx
// O TypeScript infere que T = Usuario
<Lista<Usuario>
  itens={usuarios}
  renderItem={(usuario) => <span>{usuario.nome}</span>}
/>
```

**Sem Generic:** você teria que criar `ListaDeUsuarios`, `ListaDeProdutos`, `ListaDePedidos` — um componente pra cada tipo. Com Generic, um `Lista<T>` serve pra tudo.

### Hook genérico

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

**Uso:**

```tsx
const [token, setToken] = useLocalStorage<string>("token", "");
// T = string

const [tema, setTema] = useLocalStorage<'light' | 'dark'>("tema", "light");
// T = 'light' | 'dark'
```

### Resumo

| Onde | Generic | O que significa |
|---|---|---|
| `useState<string>("")` | `<string>` | Esse estado guarda string |
| `Lista<Usuario>` | `<Usuario>` | Essa lista trabalha com Usuario |
| `useLocalStorage<T>` | `<T>` | O tipo T é definido na hora de usar |

**Dica:** na maioria das vezes, o TypeScript **infere** o Generic automaticamente. Você só precisa escrever o `<T>` explicitamente quando ele não consegue adivinhar.

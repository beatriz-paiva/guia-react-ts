---
sidebar_position: 6
---

# Outros Hooks

Além dos hooks fundamentais, o React oferece hooks para performance, transições e integração com stores externas.

## useReducer

Alternativa ao `useState` para lógica de estado complexa:

```tsx
type Action =
  | { type: 'incrementar' }
  | { type: 'decrementar' }
  | { type: 'definir'; valor: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'incrementar': return state + 1;
    case 'decrementar': return state - 1;
    case 'definir': return action.valor;
  }
}

function Contador() {
  const [contador, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <p>{contador}</p>
      <button onClick={() => dispatch({ type: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrementar' })}>-</button>
      <button onClick={() => dispatch({ type: 'definir', valor: 10 })}>10</button>
    </div>
  );
}
```

Use quando:
- O estado é um objeto com múltiplos campos
- A lógica de atualização é complexa
- O próximo estado depende do anterior de forma não-trivial

## useMemo

Memoiza o **resultado** de um cálculo. Recalcula apenas quando as dependências mudam:

```tsx
function Relatorio({ transacoes }: { transacoes: Transacao[] }) {
  const total = useMemo(() => {
    return transacoes.reduce((acc, t) => acc + t.valor, 0);
  }, [transacoes]);

  return <p>Total: R$ {total}</p>;
}
```

Útil para cálculos pesados ou transformações de arrays.

## useCallback

Memoiza uma **função**. Útil ao passar callbacks para componentes filhos memoizados:

```tsx
function Lista({ itens }: { itens: string[] }) {
  const [editando, setEditando] = useState<string | null>(null);

  const handleEditar = useCallback((id: string) => {
    setEditando(id);
  }, []);

  return (
    <ul>
      {itens.map((item) => (
        <ItemLista key={item} nome={item} onEditar={handleEditar} />
      ))}
    </ul>
  );
}
```

## useTransition

Marca uma atualização como não-bloqueante. Mantém a UI responsiva durante operações pesadas:

```tsx
function Busca() {
  const [termo, setTermo] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => {
      setTermo(e.target.value);
    });
  }

  return (
    <div>
      <input onChange={handleChange} />
      {isPending && <span>Atualizando...</span>}
    </div>
  );
}
```

## useDeferredValue

Adia a atualização de um valor para momentos de menor prioridade:

```tsx
function Lista({ termo }: { termo: string }) {
  const deferredTermo = useDeferredValue(termo);
  const isPending = termo !== deferredTermo;

  const itens = useMemo(() => {
    return dados.filter(item => item.includes(deferredTermo));
  }, [deferredTermo]);

  return (
    <div>
      {isPending && <p>Atualizando...</p>}
      <ul>{itens.map(item => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}
```

## useId

Gera IDs únicos estáveis para acessibilidade:

```tsx
function Input({ label }: { label: string }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}
```

## useSyncExternalStore

Integra componentes React com stores externas (como zustand ou Redux):

```tsx
function useStoreSnapshot(store, selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
  );
}
```

## Quando usar cada hook

| Hook | Quando usar |
|---|---|
| `useReducer` | Estado complexo com múltiplas transições |
| `useMemo` | Cálculo pesado que depende de valores específicos |
| `useCallback` | Callback passado para componente filho memoizado |
| `useTransition` | Atualizações lentas que travam a UI |
| `useDeferredValue` | Adiar renderização de UI não-crítica |
| `useId` | IDs únicos para acessibilidade (labels, aria) |
| `useSyncExternalStore` | Integração com stores externas |

**Não otimize por padrão.** Meça primeiro, otimize depois. `useMemo` e `useCallback` têm custo próprio.

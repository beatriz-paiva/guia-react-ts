---
sidebar_position: 6
---

# Outros Hooks

## useReducer — Estado com regras complexas

**Problema:** seu estado virou uma bagunça de `setEstado1`, `setEstado2`, `if` espalhados. Difícil de seguir e de dar manutenção.

O `useReducer` centraliza toda a lógica de atualização em uma única função (o **reducer**):

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

**useState vs useReducer:**

| useState | useReducer |
|---|---|
| Bom pra valores simples (string, number, boolean) | Bom pra objetos com várias propriedades |
| Lógica espalhada nos event handlers | Lógica centralizada no reducer |
| Menos código, direto | Mais verboso, mas previsível e testável |

## useMemo — Evitar cálculos desnecessários

**Problema:** toda vez que o componente renderiza, um cálculo pesado roda de novo — mesmo se os dados não mudaram.

```tsx
function Relatorio({ transacoes }: { transacoes: Transacao[] }) {
  const total = useMemo(() => {
    return transacoes.reduce((acc, t) => acc + t.valor, 0);
  }, [transacoes]); // só recalcula se transacoes mudar

  return <p>Total: R$ {total}</p>;
}
```

**Sem useMemo:** o `reduce` roda em toda render, mesmo com as mesmas transações.

**Cuidado:** não envolva tudo em `useMemo`. O hook tem custo (memória + comparação). A pergunta certa é: "esse cálculo é realmente pesado?" Se é uma soma simples, não precisa.

## useCallback — Evitar recriação de funções

**Problema:** toda render cria funções novas. Se você passa uma função pra um filho com `React.memo`, a otimização quebra — a função "mudou" porque é uma nova referência.

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

**Sem useCallback:** cada render cria uma nova `handleEditar`. O `React.memo` no `ItemLista` não adianta — ele vê que a prop `onEditar` "mudou" e rerrenderiza.

## useTransition — UI responsiva durante atualizações pesadas

**Problema:** você digita num input, mas a lista de resultados trava porque a renderização é pesada.

```tsx
function Busca() {
  const [termo, setTermo] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => {
      setTermo(e.target.value); // atualização de baixa prioridade
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

`startTransition` marca a atualização como **baixa prioridade** — o React pode interrompê-la se algo mais urgente (o input) precisar renderizar.

## useDeferredValue — Adiar valor não-crítico

**Problema:** parecido com `useTransition`, mas você não controla a fonte da mudança — só quer "atrasar" o valor pra não travar a tela:

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

**Diferença:** `useTransition` envolve a atualização (`startTransition`). `useDeferredValue` envolve o valor (`useDeferredValue`). Um é pra ação, outro é pra dado.

## useId — IDs únicos para acessibilidade

**Problema:** pra associar `<label>` ao `<input>`, você precisa de um `id`. Se usar `Math.random()`, o ID muda a cada render — quebra acessibilidade e hidratação no SSR.

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

## useSyncExternalStore — Integrar com stores externas

> **Quando usar:** você tem uma store fora do React (zustand, Redux) e precisa que o React "escute" as mudanças dela.

```tsx
function useStoreSnapshot(store, selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
  );
}
```

## Resumo rápido

| Hook | Problema que resolve |
|---|---|
| `useReducer` | Estado complexo com várias regras |
| `useMemo` | Cálculo pesado rodando sem necessidade |
| `useCallback` | Função recriada quebrando memoização do filho |
| `useTransition` | UI travando durante renderização |
| `useDeferredValue` | Valor não-crítico que pode ser adiado |
| `useId` | ID único e estável pra acessibilidade |
| `useSyncExternalStore` | Store externa precisa notificar o React |

**Não otimize por padrão.** `useMemo` e `useCallback` têm custo próprio. Meça antes, otimize depois.

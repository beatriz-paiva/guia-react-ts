---
sidebar_position: 1
---

# Performance

## O problema

Seu componente renderiza, mas o resultado é o mesmo de antes. E renderiza de novo. E de novo. Cada render é trabalho que o React faz — e se for desnecessário, o app fica lento.

React oferece ferramentas pra pular renders desnecessários. Mas **cada uma tem custo**: comparar props também leva tempo. Use com consciência.

## React.memo

Evita que um componente re-renderize se as props **não mudaram** (comparação rasa):

```tsx
import { memo } from 'react';

const ItemLista = memo(function ItemLista({ nome }: { nome: string }) {
  console.log('Renderizou:', nome);
  return <li>{nome}</li>;
});
```

**Sem memo:** toda vez que o pai renderiza, o `ItemLista` renderiza junto — mesmo se `nome` não mudou. Com memo, o React compara o `nome` anterior com o novo. Se for igual, pula.

**Quando usar:** listas grandes, componentes que renderizam com frequência mas raramente mudam de props.

## useMemo

Memoiza o **resultado** de um cálculo. O cálculo só roda quando as dependências mudam:

```tsx
import { useMemo } from 'react';

function Relatorio({ transacoes }: { transacoes: Transacao[] }) {
  const total = useMemo(() => {
    return transacoes.reduce((acc, t) => acc + t.valor, 0);
  }, [transacoes]);

  return <p>Total: R$ {total}</p>;
}
```

**Sem useMemo:** o `reduce` roda em toda render, mesmo se as transações não mudaram.

**Quando usar:** cálculos pesados (filtrar milhares de itens, transformar dados).

**Quando NÃO usar:** somas simples, concatenação de string — o custo do useMemo é maior que o benefício.

## useCallback

Memoiza uma **função**. A função só é recriada quando as dependências mudam:

```tsx
import { useCallback, useState } from 'react';

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

**Sem useCallback:** cada render cria uma nova função `handleEditar`. Se `ItemLista` tem `React.memo`, a otimização quebra — porque a prop `onEditar` "mudou" (nova referência).

## Quando usar

| Ferramenta | Quando usar |
|---|---|
| `React.memo` | Componente que renderiza com mesmas props frequentemente |
| `useMemo` | Cálculo pesado ou transformação de dados |
| `useCallback` | Callback passado para filho memoizado |

**Não use por padrão.** A otimização tem custo (comparação de props/dependências). Meça primeiro, otimize depois.

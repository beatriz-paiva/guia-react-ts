---
sidebar_position: 1
---

# Performance

React oferece ferramentas para evitar renderizações desnecessárias e otimizar a performance.

## React.memo

Evita que um componente re-renderize se as props não mudaram.

```tsx
import { memo } from 'react';

const ItemLista = memo(function ItemLista({ nome }: { nome: string }) {
  console.log('Renderizou:', nome);
  return <li>{nome}</li>;
});
```

O componente só re-renderiza se `nome` mudar. Use com moderação — só quando houver ganho real de performance.

---

## useMemo

Memoiza o **resultado** de um cálculo. Recalcula apenas quando as dependências mudam.

```tsx
import { useMemo } from 'react';

function Relatorio({ transacoes }: { transacoes: Transacao[] }) {
  const total = useMemo(() => {
    return transacoes.reduce((acc, t) => acc + t.valor, 0);
  }, [transacoes]);

  return <p>Total: R$ {total}</p>;
}
```

Útil para cálculos pesados ou transformações de arrays.

---

## useCallback

Memoiza uma **função**. Útil ao passar callbacks para componentes filhos memoizados.

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

---

## Quando usar

| Ferramenta | Quando usar |
|---|---|
| `React.memo` | Componente que renderiza com mesmas props frequentemente |
| `useMemo` | Cálculo pesado ou transformação de dados |
| `useCallback` | Callback passado para filho memoizado |

**Não use por padrão.** A otimização tem custo (comparação de props/dependências). Meça primeiro, otimize depois.

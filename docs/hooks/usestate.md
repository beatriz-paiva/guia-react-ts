---
sidebar_position: 2
---

# Estado com useState

## O problema

Sem estado, qualquer valor criado dentro do componente **morre** quando a função termina:

```tsx
function Contador() {
  let count = 0;

  function aumentar() {
    count = count + 1; // muda a variável, mas o React não "sabe" disso
  }

  return (
    <div>
      <p>{count}</p>          {/* sempre 0 */}
      <button onClick={aumentar}>+</button>
    </div>
  );
}
```

O React não rerrenderiza porque não "soube" que o valor mudou. **É pra isso que serve o `useState`.**

## useState

O hook retorna um par: **valor atual** + **função pra atualizar**. Quando a função é chamada, o React rerrenderiza o componente com o novo valor.

```tsx
import { useState } from 'react';

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>Contagem: {contador}</p>
      <button onClick={() => setContador(contador + 1)}>+</button>
    </div>
  );
}
```

**O que acontece passo a passo:**

1. O React guarda o `0` fora da função (na "memória" do componente)
2. Você clica no botão → `setContador(1)` é chamado
3. O React atualiza o valor guardado pra `1`
4. O React rerrenderiza o componente
5. `contador` agora vale `1` na tela

**Por que `useState` e não `let`?** Porque o `let` não avisa o React que algo mudou. O `setContador` faz esse aviso — é o "ei React, atualiza a tela!".

## Atualizando com base no valor anterior

Se o novo valor depende do anterior, use a **função** em vez do valor direto:

```tsx
setContador((prev) => prev + 1);
```

**Por quê?** Se você chamar `setContador` várias vezes seguidas, o `contador` pode estar desatualizado:

```tsx
setContador(contador + 1); // contador ainda é 0 aqui
setContador(contador + 1); // resultado: 1, não 2

setContador((prev) => prev + 1); // prev vale o mais recente
setContador((prev) => prev + 1); // resultado: 2 ✓
```

## Estado com objetos

Objetos no useState têm uma pegadinha: **você precisa substituir o objeto inteiro**, não só mudar uma propriedade.

```tsx
function Usuario() {
  const [usuario, setUsuario] = useState({ nome: '', idade: 0 });

  function atualizarNome(nome: string) {
    setUsuario({ ...usuario, nome }); // espalha o objeto anterior e sobrescreve nome
  }
}
```

**Regra:** sempre espalhe (`...`) o objeto anterior. Sem o spread, você perde as outras propriedades:

```tsx
setUsuario({ nome: "Ana" });       // ❌ idade desaparece
setUsuario({ ...usuario, nome: "Ana" }); // ✅ mantém idade
```

## Estado com arrays

Mesma lógica: **substitua o array, não mutile.**

```tsx
function ListaTarefas() {
  const [tarefas, setTarefas] = useState<string[]>([]);

  function adicionar(tarefa: string) {
    setTarefas([...tarefas, tarefa]); // novo array com o item no final
  }

  function remover(indice: number) {
    setTarefas(tarefas.filter((_, i) => i !== indice)); // novo array sem o item
  }
}
```

Padrões comuns com arrays:

| Operação | Código |
|---|---|
| Adicionar | `setLista([...prev, novoItem])` |
| Remover | `setLista(prev.filter(item => item.id !== id))` |
| Atualizar | `setLista(prev.map(item => item.id === id ? { ...item, nome } : item))` |

## Estado derivado

Nem todo dado precisa de `useState`. Se dá pra **calcular** a partir de props ou de outro estado, calcule diretamente:

```tsx
function Carrinho({ itens }: { itens: Produto[] }) {
  const total = itens.reduce((acc, item) => acc + item.preco, 0);
  // ↑ isso é derivado — não precisa de useState

  return <p>Total: R$ {total}</p>;
}
```

**Pergunta pra se fazer:** "Esse valor muda por conta própria ou é calculado de algo que já é estado?" Se for calculado, calcule na hora.

## Lazy initializer

Se o valor inicial vem de um cálculo pesado (ler localStorage, por exemplo), passe uma **função**:

```tsx
const [token, setToken] = useState(() => {
  return localStorage.getItem('token') ?? '';
});
```

A função roda **uma vez só**, na montagem. Sem ela, o `localStorage.getItem` rodaria em toda rerrenderização:

```tsx
const [token, setToken] = useState(localStorage.getItem('token') ?? ''); // 😬 roda sempre
```

## Regras dos hooks

- Chame hooks **só no nível superior** do componente — nada de dentro de if, for ou funções aninhadas
- Chame hooks **só dentro de componentes React** ou de custom hooks

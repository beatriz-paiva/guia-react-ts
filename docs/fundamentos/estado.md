---
sidebar_position: 4
---

# Estado com useState

Estado é a memória do componente. Permite que dados mudem e a interface reaja a essas mudanças.

## useState

O hook `useState` retorna um par: valor atual + função para atualizar.

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

---

## Atualizando com base no valor anterior

Sempre que o novo estado depender do anterior, use a forma funcional:

```tsx
setContador((prev) => prev + 1);
```

---

## Estado com objetos

```tsx
function Usuario() {
  const [usuario, setUsuario] = useState({ nome: '', idade: 0 });

  function atualizarNome(nome: string) {
    setUsuario({ ...usuario, nome });
  }

  return (
    <div>
      <input value={usuario.nome} onChange={(e) => atualizarNome(e.target.value)} />
      <p>{usuario.nome} - {usuario.idade}</p>
    </div>
  );
}
```

Sempre espalhe (`...`) o objeto anterior para não perder as outras propriedades.

---

## Estado com arrays

```tsx
function ListaTarefas() {
  const [tarefas, setTarefas] = useState<string[]>([]);

  function adicionar(tarefa: string) {
    setTarefas([...tarefas, tarefa]);
  }

  function remover(indice: number) {
    setTarefas(tarefas.filter((_, i) => i !== indice));
  }

  return (
    <ul>
      {tarefas.map((t, i) => (
        <li key={i}>{t} <button onClick={() => remover(i)}>x</button></li>
      ))}
    </ul>
  );
}
```

---

## Regras dos hooks

- Chame hooks apenas no nível superior do componente
- Não chame hooks dentro de condicionais ou loops
- Não chame hooks fora de componentes React

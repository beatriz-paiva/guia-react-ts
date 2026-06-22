---
sidebar_position: 3
---

# useEffect

## O problema

Você precisa buscar dados quando a tela carregar. Onde colocar o `fetch`?

Se colocar solto no corpo do componente, ele roda **em toda renderização** — e a busca muda o estado, que rerrenderiza, que busca de novo... loop infinito:

```tsx
function BuscaDados() {
  fetch('/api/dados').then(res => res.json()).then(setDados);
  // 🔥 Chama fetch → setDados → rerrender → fetch → ...
}
```

O `useEffect` resolve isso: ele roda o código **nos momentos certos** que você definir.

## Sintaxe

```tsx
useEffect(() => {
  // código que quero executar
}, [dependencias]);
```

Pense no array de dependências como uma **lista de vigias**: o React olha pra eles, e se algum mudou, o efeito roda de novo.

## Com dependências

```tsx
function BuscaDados({ usuarioId }: { usuarioId: number }) {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function buscar() {
      const resposta = await fetch(`/api/usuarios/${usuarioId}`);
      const json = await resposta.json();
      setDados(json);
    }

    buscar();
  }, [usuarioId]);

  return <div>{dados ? <p>{dados.nome}</p> : <p>Carregando...</p>}</div>;
}
```

**O que acontece:**
1. Componente monta → `usuarioId` vale `1` → `useEffect` roda → busca `/api/usuarios/1`
2. Usuário muda de perfil → `usuarioId` vira `2` → React vê que mudou → roda o efeito de novo
3. Se `usuarioId` não mudar, o efeito **não roda** — sem requisições desperdiçadas

## Array vazio = executa uma vez

```tsx
useEffect(() => {
  console.log("Montou"); // roda só na montagem

  return () => {
    console.log("Desmontou"); // roda só na desmontagem
  };
}, []); // sem dependências = nunca "re-vigia"
```

## Cleanup

Alguns efeitos precisam de "limpeza" — é como devolver o que você pegou emprestado:

```tsx
function Temporizador() {
  const [tempo, setTempo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTempo((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
    // Sem o cleanup: o intervalo continua rodando mesmo depois
    // que o componente sai da tela. Vazamento de memória.
  }, []);

  return <p>{tempo}s</p>;
}
```

**Regra:** se você criou algo que continua existindo fora do React (intervalo, event listener, subscription), você precisa limpar. O `return` dentro do `useEffect` é o lugar pra isso — ele roda na desmontagem (ou antes de reexecutar o efeito).

## Dicas

- **Separe efeitos** — em vez de um useEffect gigante, crie um pra cada responsabilidade. Mais fácil de ler e de manter
- **Cuidado com objetos/arrays como dependência** — eles são recriados a cada render, então o efeito rodaria toda hora. Use valores primitivos
- **Buscar dados?** Considere TanStack Query — ele já lida com cache, loading, erro e refetch por você

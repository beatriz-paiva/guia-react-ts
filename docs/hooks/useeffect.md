---
sidebar_position: 3
---

# useEffect

Executa efeitos colaterais em componentes: buscar dados, manipular DOM, assinar eventos.

## Sintaxe

```tsx
useEffect(() => {
  // efeito
}, [dependencias]);
```

---

## Ciclo de vida

```tsx
function Exemplo() {
  useEffect(() => {
    console.log("Montou"); // executa uma vez

    return () => {
      console.log("Desmontou"); // cleanup ao desmontar
    };
  }, []);
}
```

---

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
  }, [usuarioId]); // refaz a busca quando usuarioId mudar

  return <div>{dados ? <p>{dados.nome}</p> : <p>Carregando...</p>}</div>;
}
```

---

## Cleanup

Importante para evitar vazamento de memória:

```tsx
function Temporizador() {
  const [tempo, setTempo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTempo((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id); // limpa ao desmontar
  }, []);

  return <p>{tempo}s</p>;
}
```

---

## Dicas

- Separe efeitos em múltiplos `useEffect` em vez de um único gigante
- Não use objetos/arrays como dependência (criam nova referência a cada render)
- Para buscar dados, considerar bibliotecas como TanStack Query

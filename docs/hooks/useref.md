---
sidebar_position: 5
---

# useRef

O `useRef` tem duas utilidades principais, e as duas vêm de uma mesma característica: **mudar `ref.current` não causa rerrenderização**.

## 1. Acessar elementos DOM

**Problema:** você quer focar um input assim que a tela abrir. Como pegar o elemento?

```tsx
function InputAutofoco() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // foca o input na montagem
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

O React guarda o elemento DOM em `inputRef.current` depois que o componente monta. O `?.` (optional chaining) evita erro se `current` for `null` (antes da montagem ou se o ref não foi passado pra nada).

**Sem useRef:** você teria que usar `document.querySelector` — que foge do React e pode quebrar com componentes reutilizados ou mudanças na árvore.

## 2. Valores mutáveis sem rerrender

**Problema:** você quer contar quantas vezes um botão foi clicado, mas não quer que a tela "pisque" a cada clique. O número serve só pra você, não pro usuário.

```tsx
function ContadorSemRender() {
  const clicks = useRef(0);

  function handleClick() {
    clicks.current += 1;
    console.log("Cliques:", clicks.current);
    // Não rerrenderiza o componente
  }

  return <button onClick={handleClick}>Clique</button>;
}
```

**useRef vs useState:**

| | useRef | useState |
|---|---|---|
| Muda o valor? | Sim | Sim |
| Causa rerrender? | Não | Sim |
| Útil pra | Timers, contadores internos, valores de animação | Dados que aparecem na tela |

**Regra prática:** se o dado aparece na UI, é `useState`. Se só você precisa saber (timer, flag, instância de biblioteca), é `useRef`.

## Padrão: salvar valor anterior

```tsx
function useValorAnterior<T>(valor: T): T {
  const ref = useRef<T>(valor);

  useEffect(() => {
    ref.current = valor; // guarda o valor atual pra próxima render
  }, [valor]);

  return ref.current; // retorna o valor da render anterior
}
```

Uso:

```tsx
function App() {
  const [contador, setContador] = useState(0);
  const contadorAnterior = useValorAnterior(contador);

  return (
    <p>Agora: {contador} | Antes: {contadorAnterior}</p>
  );
}
```

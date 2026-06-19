---
sidebar_position: 5
---

# useRef

Permite persistir valores entre renders sem causar re-renderização.

## Referência a elementos DOM

```tsx
function InputAutofoco() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

O `?.` (optional chaining) evita erro caso `current` seja `null`.

---

## Valores mutáveis

Diferente de `useState`, alterar `ref.current` não causa nova renderização.

```tsx
function ContadorSemRender() {
  const clicks = useRef(0);

  function handleClick() {
    clicks.current += 1;
    console.log("Cliques:", clicks.current);
    // não re-renderiza o componente
  }

  return <button onClick={handleClick}>Clique</button>;
}
```

Útil para: timers, valores que precisam persistir mas não afetam a UI.

---

## Salvando valores de efeitos anteriores

```tsx
function useValorAnterior<T>(valor: T): T {
  const ref = useRef<T>(valor);

  useEffect(() => {
    ref.current = valor;
  }, [valor]);

  return ref.current;
}
```

Uso:

```tsx
const contador = useState(0);
const contadorAnterior = useValorAnterior(contador);
```

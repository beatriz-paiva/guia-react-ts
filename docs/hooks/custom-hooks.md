---
sidebar_position: 4
---

# Custom Hooks

Hooks próprios permitem extrair lógica repetitiva e compartilhar entre componentes.

## Regra

Um custom hook é uma função que começa com `use` e pode chamar outros hooks.

---

## useWindowSize

```tsx
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

Uso:

```tsx
function Layout() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

---

## useFetch

```tsx
function useFetch<T>(url: string) {
  const [dados, setDados] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;

    async function buscar() {
      try {
        setLoading(true);
        const res = await fetch(url);
        const json = await res.json();
        if (!cancel) setDados(json);
      } catch (err) {
        if (!cancel) setErro(err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    buscar();
    return () => { cancel = true; };
  }, [url]);

  return { dados, loading, erro };
}
```

Uso:

```tsx
function Usuarios() {
  const { dados, loading, erro } = useFetch<Usuario[]>("/api/usuarios");

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <ul>
      {dados?.map((u) => <li key={u.id}>{u.nome}</li>)}
    </ul>
  );
}
```

---

## useToggle

```tsx
function useToggle(valorInicial = false) {
  const [valor, setValor] = useState(valorInicial);

  function toggle() {
    setValor((prev) => !prev);
  }

  return [valor, toggle] as const;
}
```

Uso:

```tsx
function Painel() {
  const [aberto, toggleAberto] = useToggle();

  return (
    <div>
      <button onClick={toggleAberto}>{aberto ? "Fechar" : "Abrir"}</button>
      {aberto && <div>Conteúdo do painel</div>}
    </div>
  );
}
```

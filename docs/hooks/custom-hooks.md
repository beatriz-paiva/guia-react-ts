---
sidebar_position: 7
---

# Custom Hooks

## O problema

Você tem 3 componentes que precisam saber o tamanho da tela. Em cada um, você copia:

```tsx
const [width, setWidth] = useState(window.innerWidth);

useEffect(() => {
  function handleResize() { setWidth(window.innerWidth); }
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

Repetiu isso em 3 lugares? Agora você tem código duplicado pra manter. Se esquecer de limpar o event listener em um deles, vazou memória.

**Custom hooks resolvem isso:** você extrai a lógica uma vez e reutiliza onde quiser.

---

## useWindowSize — Saber o tamanho da tela

**Problema:** adaptar o layout pro tamanho da tela sem copiar useEffect + useState em todo componente.

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
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

**Uso:**

```tsx
function Layout() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

**Sem o hook:** cada componente teria seu próprio useEffect + addEventListener. Com ele, uma linha resolve.

---

## useToggle — Alternar entre true/false

**Problema:** modal, dropdown, sidebar — tudo que abre e fecha. Pra cada um, você cria `useState(false)` + `setValor(!valor)`. Repetitivo.

```tsx
function useToggle(valorInicial = false) {
  const [valor, setValor] = useState(valorInicial);

  function toggle() {
    setValor((prev) => !prev); // inverte o valor usando o anterior
  }

  return [valor, toggle] as const;
}
```

O `as const` no final é importante: sem ele, o TypeScript acha que o retorno é `(boolean | (() => void))[]`, e você perde a dica de tipo ao desestruturar.

**Uso:**

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

**Sem o hook:** `const [aberto, setAberto] = useState(false)` + `() => setAberto(!aberto)` em cada componente.

---

## useDebounce — Aguardar o usuário parar de digitar

**Problema:** cada tecla digitada numa busca dispara uma requisição. Se o usuário digita "react" (5 letras), são 5 chamadas. A maioria vai ser descartada.

```tsx
function useDebounce<T>(valor: T, delay: number = 500): T {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(valor), delay);
    // Só atualiza depois de `delay` ms sem mudanças

    return () => clearTimeout(timer);
    // Se o valor mudar antes, cancela o timer anterior
  }, [valor, delay]);

  return debounced;
}
```

**Como funciona:** enquanto o usuário digita, o `timer` é cancelado e reiniciado a cada tecla. Só quando ele para por `delay` ms, o valor é atualizado.

**Uso:**

```tsx
function BuscaUsuarios() {
  const [termo, setTermo] = useState('');
  const termoDebounced = useDebounce(termo, 300);

  const { dados } = useFetch<Usuario[]>(`/api/usuarios?q=${termoDebounced}`);

  return (
    <div>
      <input value={termo} onChange={(e) => setTermo(e.target.value)} />
      <ul>{dados?.map(u => <li key={u.id}>{u.nome}</li>)}</ul>
    </div>
  );
}
```

**Sem debounce:** uma requisição por caractere. Com debounce: uma requisição só quando o usuário realmente parou.

---

## Outros hooks úteis

### useFetch — Buscar dados com loading e erro

> **Quando usar:** busca simples de API. Pra apps reais, prefira TanStack Query (lida com cache, refetch, loading states).

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

### useLocalStorage — Estado que persiste no navegador

> **Quando usar:** tema, preferências, rascunhos — dados que o usuário espera encontrar após fechar e reabrir a página.

```tsx
function useLocalStorage<T>(chave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const stored = localStorage.getItem(chave);
    return stored ? JSON.parse(stored) : valorInicial;
  });

  useEffect(() => {
    localStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor]);

  return [valor, setValor] as const;
}
```

### useMediaQuery — Detectar media queries CSS

> **Quando usar:** útil pra detectar `prefers-color-scheme` (tema escuro), `prefers-reduced-motion`, ou breakpoints específicos.

```tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    function handleChange() { setMatches(media.matches); }

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
```

### useClickOutside — Fechar modal/dropdown ao clicar fora

> **Quando usar:** dropdowns, modais, menus que devem fechar quando o usuário clica fora do elemento.

```tsx
function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handler]);

  return ref;
}
```

---

## Boas práticas

| Regra | Por quê? |
|---|---|
| Prefixo `use` obrigatório | O React usa o prefixo pra aplicar as regras dos hooks |
| Parâmetros como objeto se > 2 | `useToggle({ initial: true, onChange })` é mais legível que `useToggle(true, fn)` |
| Retorno tipado | Quem usa o hook sabe exatamente o que vem |
| Não dependa de contexto externo | O hook deve funcionar sozinho, sem precisar de Provider por perto |
| Retorne funções estáveis | Se retornar função, use `useCallback` pra não criar uma nova a cada render |
| Componha hooks menores | `useWindowSize` + `useLocalStorage` = hook responsivo que salva preferência |

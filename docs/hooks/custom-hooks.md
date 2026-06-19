---
sidebar_position: 7 
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

---

## useDebounce

Retorna um valor após um delay sem novas alterações. Ideal para inputs de busca:

```tsx
function useDebounce<T>(valor: T, delay: number = 500): T {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timer);
  }, [valor, delay]);

  return debounced;
}
```

Uso:

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

---

## useLocalStorage

Sincroniza estado com localStorage automaticamente:

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

Uso:

```tsx
function ConfigTema() {
  const [tema, setTema] = useLocalStorage<'light' | 'dark'>('tema', 'light');

  return (
    <button onClick={() => setTema(tema === 'light' ? 'dark' : 'light')}>
      Tema: {tema}
    </button>
  );
}
```

---

## useMediaQuery

Detecta se uma media query CSS é válida no dispositivo:

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

Uso:

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) return <MobileSidebar />;
  return <DesktopSidebar />;
}
```

---

## useClickOutside

Detecta clique fora de um elemento. Útil para modais e dropdowns:

```tsx
function useClickOutside<T extends HTMLElement>(
  handler: () => void,
): RefObject<T | null> {
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

Uso:

```tsx
function Dropdown() {
  const [aberto, setAberto] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setAberto(false));

  return (
    <div ref={ref}>
      <button onClick={() => setAberto(!aberto)}>Menu</button>
      {aberto && <div className="dropdown">Conteúdo</div>}
    </div>
  );
}
```

---

## Boas práticas para custom hooks

- **Prefixo `use`** — obrigatório para o React reconhecer como hook
- **Parâmetros como objeto** — quando houver mais de 2 parâmetros, use um objeto options
- **Retorno tipado** — sempre exporte um tipo/interface para o retorno
- **Não dependa de contexto externo** — o hook deve funcionar isoladamente
- **Retorne funções estáveis** — use `useCallback` se retornar funções
- **Composição** — hooks menores se combinam para formar hooks maiores

---
sidebar_position: 3
---

# Zustand

## O problema

Context funciona, mas tem limitações: **todo consumidor rerrenderiza quando o valor muda** (mesmo que só use uma parte), e você precisa de **Providers aninhados** que poluem a árvore de componentes.

Zustand é uma alternativa leve (~1kb) que resolve esses dois problemas:
- **Selectors:** cada componente "escuta" só a parte do estado que importa
- **Sem Provider:** a store existe fora da árvore de componentes

## Instalação

```bash
npm install zustand
```

## Criando uma store

```tsx
import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  usuario: null,

  login: async (email, senha) => {
    const res = await api.post('/login', { email, senha });
    set({ token: res.data.token, usuario: res.data.usuario });
  },

  logout: () => {
    set({ token: null, usuario: null });
    localStorage.removeItem('token');
  },
}));
```

**O que acontece:** `create` recebe uma função que retorna o estado inicial + ações. O `set` dentro da store atualiza o estado e notifica os componentes que usam a store.

## Usando a store

```tsx
function Header() {
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header>
      <span>{usuario?.nome}</span>
      <button onClick={logout}>Sair</button>
    </header>
  );
}
```

**Perceba:** cada chamada `useAuthStore((state) => state.usuario)` é um **selector** — o componente só rerrenderiza quando `usuario` muda.

## Selectors — evitar re-render

Isso é o que faz o zustand ser mais performático que Context em muitos casos:

```tsx
// ❌ Re-renderiza quando QUALQUER coisa na store muda
const { usuario } = useAuthStore();

// ✅ Re-renderiza só quando usuario muda
const usuario = useAuthStore((state) => state.usuario);
```

Se você desestruturar (`const { usuario, token, login } = useAuthStore()`), o componente "escuta" a store inteira — qualquer mudança rerrenderiza. Com selectors, você escuta só o que precisa.

## Ações assíncronas

Dentro da store, `set` funciona tanto síncrono quanto assíncrono:

```tsx
interface ProdutoStore {
  produtos: Produto[];
  loading: boolean;
  buscar: () => Promise<void>;
}

export const useProdutoStore = create<ProdutoStore>((set) => ({
  produtos: [],
  loading: false,

  buscar: async () => {
    set({ loading: true });
    const res = await api.get('/produtos');
    set({ produtos: res.data, loading: false });
  },
}));
```

## Estado derivado com useMemo

Zustand não tem "getters" como o Pinia/Vuex. O estado derivado é calculado com `useMemo` no componente:

```tsx
function Carrinho() {
  const itens = useCarrinhoStore((state) => state.itens);
  const total = useMemo(() => {
    return itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  }, [itens]);

  return <p>Total: R$ {total.toFixed(2)}</p>;
}
```

## Zustand vs. Context

| Característica | Context | Zustand |
|---|---|---|
| Provider necessário | Sim | Não |
| Re-render | Todos consumidores | Só quem usa o selector que mudou |
| Setup | createContext + Provider | `create` + hook |
| Tamanho | Nativo (~0kb) | ~1kb |
| Ideal para | Auth, tema, idioma | UI state de alta frequência |

## Na prática

Zustand é ideal para **estado de UI** — sidebar, notificações, filtros:

```tsx
// store/ui-store.ts
export const useUIStore = create<{
  sidebarAberta: boolean;
  toggleSidebar: () => void;
}>((set) => ({
  sidebarAberta: true,
  toggleSidebar: () => set((state) => ({ sidebarAberta: !state.sidebarAberta })),
}));
```

> ⚠️ Dados do servidor devem ficar no **TanStack Query**, não no zustand. Usar zustand pra dados de API significa perder cache, refetch automático e stale-while-revalidate.

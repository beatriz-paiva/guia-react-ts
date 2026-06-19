---
sidebar_position: 3
---

# zustand

Biblioteca de gerenciamento de estado global leve e performática.

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

## Selectors — evitar re-render

O selector é a chave da performance do zustand:

```tsx
// ❌ Re-renderiza quando QUALQUER coisa na store muda
const { usuario } = useAuthStore();

// ✅ Re-renderiza só quando usuario muda
const usuario = useAuthStore((state) => state.usuario);
```

## Ações assíncronas

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

```tsx
function Carrinho() {
  const itens = useCarrinhoStore((state) => state.itens);
  const total = useMemo(() => {
    return itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  }, [itens]);

  return <p>Total: R$ {total.toFixed(2)}</p>;
}
```

## zustand vs. Context

| Característica | Context | zustand |
|---|---|---|
| Provider necessário | Sim | Não |
| Re-render | Todos consumidores | Só quem usa o selector que mudou |
| Setup | createContext + Provider | create + hook |
| Tamanho | Nativo (~0kb) | ~1kb |
| Ideal para | Auth, tema, idioma | UI state de alta frequência |

## Na prática

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

O zustand é ideal para estado de UI. Dados do servidor devem ficar no TanStack Query.

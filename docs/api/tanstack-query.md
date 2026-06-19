---
sidebar_position: 3
---

# TanStack Query (React Query)

Biblioteca para gerenciar dados do servidor. Gerencia cache, loading states, refetch automático e mutações.

## Instalação

```bash
npm install @tanstack/react-query
```

## Configuração

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
```

## useQuery — buscar dados

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

function ListaUsuarios() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data } = await api.get<Usuario[]>('/usuarios');
      return data;
    },
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <ul>
      {data?.map((u) => <li key={u.id}>{u.nome}</li>)}
    </ul>
  );
}
```

## Query Keys

Identificam e organizam o cache:

```tsx
// Lista
queryKey: ['usuarios']

// Lista com parâmetros
queryKey: ['usuarios', { page: 1, search: 'ana' }]

// Item individual
queryKey: ['usuarios', id]
```

## useMutation — criar/atualizar/deletar

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function NovoUsuarioForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (dados: UsuarioForm) => {
      const { data } = await api.post('/usuarios', dados);
      return data;
    },
    onSuccess: () => {
      // Invalida o cache da lista para forçar refetch
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Salvando...' : 'Salvar'}
      </button>
      {mutation.isError && <p>Erro: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Usuário criado!</p>}
    </form>
  );
}
```

## Mutação com atualização otimista

Atualiza a UI antes da resposta do servidor:

```tsx
const mutation = useMutation({
  mutationFn: (id: number) => api.delete(`/usuarios/${id}`),

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['usuarios'] });
    const previous = queryClient.getQueryData(['usuarios']);
    queryClient.setQueryData(['usuarios'], (old: Usuario[]) =>
      old.filter((u) => u.id !== id),
    );
    return { previous };
  },

  onError: (err, id, context) => {
    queryClient.setQueryData(['usuarios'], context?.previous);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['usuarios'] });
  },
});
```

## Dependências entre queries

```tsx
function DetalheUsuario({ id }: { id: number }) {
  const { data: usuario } = useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => api.get<Usuario>(`/usuarios/${id}`).then(r => r.data),
  });

  const { data: pedidos } = useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => api.get<Pedido[]>(`/usuarios/${id}/pedidos`).then(r => r.data),
    enabled: !!usuario, // só busca quando usuario carregar
  });
}
```

## Configurações úteis

```tsx
const { data } = useQuery({
  queryKey: ['usuarios'],
  queryFn: fetchUsuarios,
  staleTime: 1000 * 60 * 5,     // 5 min até considerar "stale"
  gcTime: 1000 * 60 * 30,        // 30 min no cache (antigo cacheTime)
  refetchOnWindowFocus: true,    // refetch ao voltar pra aba
  refetchInterval: 1000 * 60,    // polling a cada 1 minuto
  retry: 3,                       // tentar 3 vezes antes de erro
  enabled: true,                  // se false, não executa a query
});
```

## Padrão: service + query hooks

```tsx
// services/usuarioService.ts (axios)
export const usuarioService = {
  listar: (params: ListParams) => api.get('/usuarios', { params }),
};

// hooks/useUsuarios.ts (react-query)
export function useUsuarios(params: ListParams) {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuarioService.listar(params).then(r => r.data),
  });
}

// pages/ListaPage.tsx (UI)
function ListaPage() {
  const { data, isLoading } = useUsuarios({ page: 1 });
}
```

Separa **camada de API** (services), **camada de cache** (hooks) e **camada de UI** (pages).

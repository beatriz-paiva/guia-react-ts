---
sidebar_position: 3
---

# TanStack Query (React Query)

## O problema

Com fetch ou axios, você precisa gerenciar manualmente:
- `useState` pra dados, loading, erro
- `useEffect` pra disparar a requisição
- Cache manual (se o usuário volta pra uma página, refaz a requisição do zero)
- Refetch quando os dados mudam

TanStack Query **automatiza tudo isso**. Cache, loading states, refetch automático e mutações.

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
      staleTime: 1000 * 60 * 5, // 5 min — dados são "frescos" por 5 min
      retry: 2,                  // tenta 2 vezes antes de dar erro
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

**O `QueryClientProvider`** funciona como um Context — ele disponibiliza o cache do TanStack Query pra toda a aplicação.

## useQuery — buscar dados

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

function ListaUsuarios() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['usuarios'],           // identificador único no cache
    queryFn: async () => {            // função que busca os dados
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

**O que o TanStack Query faz por baixo:**
1. Executa a `queryFn` e guarda o resultado no cache com a chave `['usuarios']`
2. Enquanto carrega, `isLoading` é `true`
3. Se der erro, `isError` fica `true` e `error` tem a mensagem
4. Se outro componente pedir `['usuarios']`, o dado vem do cache — **sem requisição extra**

**Sem TanStack Query:** você teria `useState` + `useEffect` + `fetch` + loading/erro manual em cada componente.

## Query Keys — identificando o cache

A chave é o que identifica cada dado no cache:

```tsx
// Lista simples
queryKey: ['usuarios']

// Lista com parâmetros
queryKey: ['usuarios', { page: 1, search: 'ana' }]

// Item individual
queryKey: ['usuarios', id]
```

**Regra:** quando os parâmetros mudam, a chave muda — e o TanStack Query busca de novo. Se a chave for a mesma, ele usa o cache.

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
      // Invalida o cache da lista — força refetch
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

**O fluxo:** `mutation.mutate` → `mutationFn` envia pro backend → `onSuccess` invalida o cache → `useQuery(['usuarios'])` refaz a busca automaticamente.

## Mutação com atualização otimista

A UI é atualizada **antes** da resposta do servidor. Se o servidor falhar, desfaz:

```tsx
const mutation = useMutation({
  mutationFn: (id: number) => api.delete(`/usuarios/${id}`),

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['usuarios'] });
    const previous = queryClient.getQueryData(['usuarios']);
    queryClient.setQueryData(['usuarios'], (old: Usuario[]) =>
      old.filter((u) => u.id !== id),
    );
    return { previous }; // guarda pra restaurar se der erro
  },

  onError: (err, id, context) => {
    queryClient.setQueryData(['usuarios'], context?.previous); // desfaz
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['usuarios'] }); // sincroniza
  },
});
```

**Quando usar:** ações que o usuário espera que sejam instantâneas (like, excluir, toggle favorito).

## Dependências entre queries

Uma query que depende do resultado de outra:

```tsx
function DetalheUsuario({ id }: { id: number }) {
  const { data: usuario } = useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => api.get<Usuario>(`/usuarios/${id}`).then(r => r.data),
  });

  const { data: pedidos } = useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => api.get<Pedido[]>(`/usuarios/${id}/pedidos`).then(r => r.data),
    enabled: !!usuario, // só busca pedidos quando usuario carregar
  });
}
```

## Configurações úteis

```tsx
useQuery({
  queryKey: ['usuarios'],
  queryFn: fetchUsuarios,
  staleTime: 1000 * 60 * 5,     // 5 min até considerar "stale" (obsoleto)
  gcTime: 1000 * 60 * 30,        // 30 min no cache (antigo cacheTime)
  refetchOnWindowFocus: true,    // refetch ao voltar pra aba
  refetchInterval: 1000 * 60,    // polling a cada 1 minuto
  retry: 3,                       // tentar 3 vezes antes de erro
  enabled: true,                  // se false, não executa
});
```

| Opção | O que faz |
|---|---|
| `staleTime` | Tempo que o dado é considerado "fresco" (não faz refetch) |
| `gcTime` | Tempo que o dado fica no cache mesmo sem ninguém usando |
| `refetchOnWindowFocus` | Refaz a busca quando o usuário volta pra aba |
| `refetchInterval` | Polling automático |
| `retry` | Quantas vezes tenta de novo se falhar |

## Padrão: service + query hooks

Separação em 3 camadas:

```tsx
// services/usuarioService.ts — axios puro
export const usuarioService = {
  listar: (params: ListParams) => api.get('/usuarios', { params }),
};

// hooks/useUsuarios.ts — TanStack Query
export function useUsuarios(params: ListParams) {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuarioService.listar(params).then(r => r.data),
  });
}

// pages/ListaPage.tsx — UI pura
function ListaPage() {
  const { data, isLoading } = useUsuarios({ page: 1 });
}
```

**Por que essa separação?**
- **Service:** só fala com API (axios). Trocar axios por fetch? Só muda esse arquivo.
- **Hook:** gerencia cache. Trocar TanStack Query por outra lib? Só muda esse arquivo.
- **Page:** só renderiza. Não sabe se os dados vieram de API ou cache.

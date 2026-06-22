---
sidebar_position: 4
---

# Exemplo Completo: CRUD com TanStack Query

Unindo **axios** (HTTP), **TanStack Query** (cache/mutações) e **react-hook-form** (formulário) em um CRUD real.

## 1. Service (axios)

A camada mais baixa: só fala com a API. Não sabe que TanStack Query existe.

```tsx
// services/usuarioService.ts
import { api } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: 'admin' | 'editor' | 'visualizador';
  ativo: boolean;
}

export type UsuarioForm = Omit<Usuario, 'id'>;

export const usuarioService = {
  listar: (params?: { page?: number; search?: string }) =>
    api.get<{ data: Usuario[]; total: number }>('/usuarios', { params }),

  buscar: (id: number) =>
    api.get<Usuario>(`/usuarios/${id}`),

  criar: (dados: UsuarioForm) =>
    api.post<Usuario>('/usuarios', dados),

  atualizar: (id: number, dados: Partial<UsuarioForm>) =>
    api.put<Usuario>(`/usuarios/${id}`, dados),

  excluir: (id: number) =>
    api.delete(`/usuarios/${id}`),
};
```

`Omit<Usuario, 'id'>` cria o tipo do formulário (Usuario sem o campo `id`).

## 2. Hooks (TanStack Query)

A camada de cache: conecta o service ao TanStack Query. Cada hook expõe dados, loading, erro.

```tsx
// hooks/useUsuarios.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService, type UsuarioForm } from '@/services/usuarioService';

// Lista com parâmetros
export function useUsuarios(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuarioService.listar(params).then(r => r.data),
  });
}

// Item individual
export function useUsuario(id: number) {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuarioService.buscar(id).then(r => r.data),
    enabled: !!id, // só busca se id for válido
  });
}

// Criar — invalida a lista pra forçar refetch
export function useCriarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: UsuarioForm) => usuarioService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

// Excluir
export function useExcluirUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usuarioService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}
```

**Por que `invalidateQueries`?** Depois de criar ou excluir, a lista de usuários mudou. `invalidateQueries` marca o cache como "stale" (obsoleto) — o TanStack Query refaz a busca automaticamente na próxima vez que o componente renderizar.

## 3. Página de listagem

UI pura — sem axios, sem TanStack Query diretamente. Só hooks.

```tsx
// features/usuarios/pages/UsuariosPage.tsx
import { useState } from 'react';
import { useUsuarios, useExcluirUsuario } from '@/hooks/useUsuarios';

function UsuariosPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsuarios({ page, search });
  const excluir = useExcluirUsuario();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>

      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Buscar..."
        className="border rounded px-3 py-2 mb-4"
      />

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Cargo</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((usuario) => (
              <tr key={usuario.id} className="border-t">
                <td className="p-2">{usuario.nome}</td>
                <td className="p-2">{usuario.email}</td>
                <td className="p-2">{usuario.cargo}</td>
                <td className="p-2">
                  <button
                    onClick={() => excluir.mutate(usuario.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded"
        >
          Anterior
        </button>
        <span className="px-3 py-1">Página {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data || page * 10 >= data.total}
          className="px-3 py-1 border rounded"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
```

## Arquitetura final

```
src/
  services/
    api.ts              # axios instance + interceptors
    usuarioService.ts   # funções de API tipadas
  hooks/
    useUsuarios.ts      # queries + mutations do TanStack Query
  features/
    usuarios/
      pages/
        UsuariosPage.tsx  # UI pura (só hooks, sem axios direto)
      components/
        UsuarioForm.tsx   # react-hook-form + zod
  schemas/
    usuario.ts          # Zod schemas
```

Cada camada tem uma responsabilidade clara:

| Camada | Responsabilidade | Tecnologia |
|---|---|---|
| `services/` | Comunicação HTTP | Axios |
| `hooks/` | Cache e estado do servidor | TanStack Query |
| `schemas/` | Validação e tipos | Zod |
| `features/` | UI e formulários | React |

---
sidebar_position: 5
---

# CRUD de Usuários

## Service

```tsx
// services/usuarioService.ts
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

## Hooks (TanStack Query)

```tsx
// hooks/useUsuarios.ts
export function useUsuarios(params?: ListParams) {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuarioService.listar(params).then(r => r.data),
  });
}

export function useCriarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: UsuarioForm) => usuarioService.criar(dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useExcluirUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuarioService.excluir(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}
```

## Página de listagem

```tsx
function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsuarios({ page, search });
  const excluir = useExcluirUsuario();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Link to="/users/novo" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Novo Usuário
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Buscar..."
        className="w-full border rounded px-3 py-2 mb-4"
      />

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Cargo</th>
              <th className="text-left p-3">Ativo</th>
              <th className="text-left p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.nome}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.cargo}</td>
                <td className="p-3">{user.ativo ? 'Sim' : 'Não'}</td>
                <td className="p-3 space-x-2">
                  <Link to={`/users/${user.id}`} className="text-blue-500 hover:underline">Editar</Link>
                  <button onClick={() => excluir.mutate(user.id)} className="text-red-500 hover:underline">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50">
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={!data || page * 10 >= data.total}
          className="px-3 py-1 border rounded disabled:opacity-50">
          Próxima
        </button>
      </div>
    </div>
  );
}
```

Referências: Módulo 7 (axios + TanStack Query), Módulo 6 (React Router + Link)

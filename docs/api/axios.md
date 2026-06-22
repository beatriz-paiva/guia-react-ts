---
sidebar_position: 2
---

# Axios

## Por que usar?

Com fetch, toda requisição precisa de `response.ok`, `response.json()`, `headers`. E não tem timeout, nem interceptors, nem cancelamento simples.

**Axios resolve:** menos código, mais consistência.

```tsx
// Fetch
const res = await fetch(url);
if (!res.ok) throw new Error(...);
const data = await res.json();

// Axios
const { data } = await api.get(url);
```

## Instalação

```bash
npm install axios
```

## Instância configurada

Em vez de chamar `axios.get(...)` com a URL completa toda vez, crie uma **instância** com configuração padrão:

```tsx
// services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
```

**Por que fazer isso?** `baseURL` evita repetir o prefixo em toda requisição. `timeout` garante que requisições não fiquem "penduradas". Tudo centralizado num arquivo só.

## Tipagem de respostas

```tsx
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const { data } = await api.get<Usuario[]>('/usuarios');
// data é tipado como Usuario[] — sem precisar de "as Usuario[]"
```

## GET / POST / PUT / PATCH / DELETE

```tsx
// GET com parâmetros de query
const { data } = await api.get('/usuarios', {
  params: { page: 1, search: 'ana' },
});

// POST
const { data } = await api.post('/usuarios', { nome: 'Ana', email: 'ana@email.com' });

// PUT / PATCH
await api.put(`/usuarios/${id}`, { nome: 'Ana Atualizada' });
await api.patch(`/usuarios/${id}`, { email: 'novo@email.com' });

// DELETE
await api.delete(`/usuarios/${id}`);
```

**Perceba:** diferente do fetch, o body do POST já é convertido pra JSON automaticamente. E o `.data` já é o JSON parseado.

## Interceptors — Request

Útil pra **adicionar token de autenticação** em todas as requisições:

```tsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Sem interceptor:** você teria que passar `Authorization` manualmente em toda chamada `api.get(url, { headers: { Authorization } })`.

## Interceptors — Response

Útil pra **tratamento global de erros**:

```tsx
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

**O que faz:** se qualquer requisição retornar 401 (não autorizado), o interceptor redireciona pro login automaticamente.

## Cancelamento

```tsx
const controller = new AbortController();

api.get('/usuarios', { signal: controller.signal });
controller.abort(); // cancela a requisição
```

## Arquivo de serviço completo

Organize as chamadas por domínio em **services**:

```tsx
// services/usuarioService.ts
import { api } from './api';

export const usuarioService = {
  listar: (params?: { page?: number; search?: string }) =>
    api.get<PaginatedResponse<Usuario>>('/usuarios', { params }),

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

**Por que separar?** Se a API mudar, você altera só o service. Se um componente precisa buscar usuários, ele chama `usuarioService.listar()` — não sabe nem que axios existe.

## Axios vs. Fetch

| Axios | Fetch |
|---|---|
| Erros HTTP rejeitam automático | Precisa `response.ok` manual |
| Interceptors nativos | Precisa implementar wrapper |
| Timeout configurável | Sem timeout nativo |
| Parsing JSON automático | Precisa `response.json()` |
| Cancelamento simples | AbortController manual |
| Menos boilerplate | Mais controle manual |

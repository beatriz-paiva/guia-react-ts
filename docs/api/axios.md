---
sidebar_position: 2
---

# axios

Cliente HTTP com suporte a interceptors, cancelamento e parsing automático.

## Instalação

```bash
npm install axios
```

## Instância configurada

```tsx
// services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Tipagem de respostas

```tsx
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const { data } = await api.get<Usuario[]>('/usuarios');
// data é tipado como Usuario[]
```

## GET

```tsx
const { data } = await api.get('/usuarios', {
  params: { page: 1, search: 'ana' },
});
```

## POST / PUT / PATCH / DELETE

```tsx
const { data } = await api.post('/usuarios', { nome: 'Ana', email: 'ana@email.com' });
await api.put(`/usuarios/${id}`, { nome: 'Ana Atualizada' });
await api.patch(`/usuarios/${id}`, { email: 'novo@email.com' });
await api.delete(`/usuarios/${id}`);
```

## Interceptors — Request

Adiciona token automaticamente em todas as requisições:

```tsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Interceptors — Response

Tratamento global de erros:

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

## Cancelamento

```tsx
import { AbortController } from 'axios';

// Método 1: AbortSignal por requisição
const controller = new AbortController();

api.get('/usuarios', { signal: controller.signal });
controller.abort(); // cancela a requisição

// Método 2: CancelToken (legado, mas ainda funciona)
const source = axios.CancelToken.source();
api.get('/usuarios', { cancelToken: source.token });
source.cancel('Operação cancelada pelo usuário');
```

## Arquivo de serviço completo

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

## axios vs. fetch

| axios | fetch |
|---|---|
| Erros HTTP rejeitam automático | Precisa verificar `response.ok` |
| Interceptors nativos | Precisa implementar wrapper |
| Timeout configurável | Não tem timeout nativo |
| Parsing JSON automático | Precisa `response.json()` |
| Cancelamento simples | AbortController manual |
| Menos boilerplate | Mais controle manual |

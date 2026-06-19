---
sidebar_position: 1
---

# Requisições com Fetch

O `fetch` nativo do JavaScript é a base de toda comunicação HTTP no navegador.

## GET básico

```tsx
async function buscarUsuarios(): Promise<Usuario[]> {
  const response = await fetch('/api/usuarios');
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }
  return response.json();
}
```

## POST

```tsx
async function criarUsuario(dados: UsuarioForm): Promise<Usuario> {
  const response = await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return response.json();
}
```

## Tratamento de erros HTTP

Diferente do axios, `fetch` não rejeita para códigos HTTP 4xx/5xx. Você precisa verificar manualmente:

```tsx
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erro ${response.status}`);
  }

  return response.json();
}
```

## AbortController — cancelamento

```tsx
function useFetch<T>(url: string) {
  const [dados, setDados] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancel = false;

    async function buscar() {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const json = await res.json();
        if (!cancel) setDados(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (!cancel) setErro(err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    buscar();
    return () => {
      cancel = true;
      controller.abort();
    };
  }, [url]);

  return { dados, loading, erro };
}
```

## Limitações do fetch

- Erros HTTP não rejeitam a Promise
- Não tem timeout nativo
- Não tem interceptors
- Não faz parsing automático de JSON
- Mais verboso que axios

Para projetos reais, prefira **axios** ou **TanStack Query**.

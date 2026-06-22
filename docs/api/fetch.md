---
sidebar_position: 1
---

# Requisições com Fetch

O `fetch` é a API nativa do JavaScript pra fazer requisições HTTP. Toda biblioteca HTTP (axios, ky) é construída em cima dela. Entender fetch é entender a base.

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

**O que acontece:**
1. `fetch` faz uma requisição GET pra URL
2. `response.ok` é `false` se o status HTTP for 4xx ou 5xx (fetch **não** lança erro automático pra esses códigos)
3. `response.json()` faz o parsing do body como JSON

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

**Diferença do GET:** você precisa definir `method`, `headers` (pra dizer que é JSON) e converter o body com `JSON.stringify`.

## Tratamento de erros HTTP

**Isso é a maior pegadinha do fetch:** diferente do axios, fetch **não rejeita a Promise** pra erros HTTP (4xx, 5xx). O `catch` só pega erros de rede (sem internet, DNS falhou, etc.).

A solução é criar um **wrapper** que unifica o tratamento:

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

Agora toda requisição feita com `request` se comporta como axios: erros HTTP viram exceção.

## AbortController — cancelamento

Útil pra cancelar requisições quando o componente desmonta (evita `setState` em componente desmontado):

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
      cancel = true;      // impede setState se o componente já desmontou
      controller.abort(); // cancela o fetch em andamento
    };
  }, [url]);

  return { dados, loading, erro };
}
```

**Por que `cancel` E `controller.abort()`?** O `controller.abort()` cancela o fetch. O `cancel` impede que qualquer `setDados`, `setErro` ou `setLoading` execute depois que o componente desmontou.

## Limitações do fetch

| Problema | Por que incomoda |
|---|---|
| Erros HTTP não rejeitam | Precisa verificar `response.ok` manualmente em toda chamada |
| Sem timeout nativo | Uma requisição pode ficar "pendurada" pra sempre |
| Sem interceptors | Não tem como adicionar token ou tratar 401 globalmente |
| JSON manual | Precisa chamar `response.json()` em toda resposta |
| Mais verboso | Requisições simples exigem mais código que axios |

Para projetos reais, **axios** ou **TanStack Query** são mais produtivos.

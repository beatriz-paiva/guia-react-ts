---
sidebar_position: 4
---

# Error Boundaries

## O problema

Um erro de JavaScript dentro de um componente (ex: `usuario.nome` onde `usuario` é `null`) pode **quebrar a aplicação inteira** — tela branca, usuário perdido.

**Error Boundaries** são componentes que capturam erros de renderização na árvore e exibem uma UI de fallback no lugar. O resto do app continua funcionando.

> ⚠️ Error Boundaries só funcionam com **componentes de classe**. Ainda não existe equivalente com hooks.

## Implementação com classe

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }; // atualiza o estado → renderiza fallback
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro capturado:', error, info.componentStack); // log do erro
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-700">Algo deu errado</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**O que cada método faz:**

| Método | Função |
|---|---|
| `getDerivedStateFromError` | Atualiza o estado quando um erro é capturado → renderiza o fallback |
| `componentDidCatch` | Log do erro (enviar pra um serviço como Sentry) |

## Uso

```tsx
function App() {
  return (
    <ErrorBoundary>
      <MainLayout />
    </ErrorBoundary>
  );
}
```

## Aninhado (fallback por seção)

Em vez de um Error Boundary global, coloque um **por seção**:

```tsx
function Pagina() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<p>Sidebar indisponível</p>}>
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>Erro ao carregar conteúdo</p>}>
        <Conteudo />
      </ErrorBoundary>
    </div>
  );
}
```

Se a Sidebar quebrar, só ela mostra fallback — o Header e o Conteúdo continuam funcionando.

## Limitações

Error Boundaries **não** capturam:

- Erros em **event handlers** (onClick, onSubmit) — tratem com try/catch
- Erros **assíncronos** (setTimeout, async/await)
- Erros em renderização no servidor (SSR)
- Erros no **próprio** Error Boundary

Para eventos:

```tsx
function Botao() {
  const [erro, setErro] = useState<Error | null>(null);

  if (erro) throw erro; // joga pro Error Boundary mais próximo

  return (
    <button onClick={() => {
      try {
        acaoQuePodeFalhar();
      } catch (e) {
        setErro(e);
      }
    }}>
      Clique
    </button>
  );
}
```

## Error Boundary global (React 19)

No React 19, você pode usar `onCaughtError` no `createRoot`:

```tsx
createRoot(document.getElementById('root')!, {
  onCaughtError: (error, errorInfo) => {
    console.error('Erro global:', error, errorInfo);
  },
}).render(<App />);
```

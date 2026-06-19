---
sidebar_position: 4
---

# Error Boundaries

Error Boundaries são componentes que capturam erros de renderização na árvore de componentes e exibem uma UI de fallback.

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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro capturado:', error, info.componentStack);
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

## Limitações

Error Boundaries **não** capturam:
- Erros em event handlers (onClick, onSubmit)
- Erros assíncronos (setTimeout, async/await)
- Erros em renderização no servidor (SSR)
- Erros no próprio Error Boundary

Para eventos:

```tsx
function Botao() {
  const [erro, setErro] = useState<Error | null>(null);

  if (erro) throw erro; // joga para o Error Boundary mais próximo

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

## Error Boundary global

No React 19, você pode usar `onCaughtError` no `createRoot`:

```tsx
createRoot(document.getElementById('root')!, {
  onCaughtError: (error, errorInfo) => {
    console.error('Erro global:', error, errorInfo);
  },
}).render(<App />);
```

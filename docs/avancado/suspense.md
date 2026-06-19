---
sidebar_position: 5
---

# Suspense e Lazy Loading

Suspense permite que o React "espere" algo antes de renderizar, mostrando um fallback enquanto isso.

## lazy() — Code Splitting

Divide o bundle em pedaços menores carregados sob demanda:

```tsx
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));

function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </Suspense>
  );
}
```

O componente só é baixado quando a rota é acessada.

## Suspense + TanStack Query

Habilite o modo suspense na query:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true, // todas as queries usam Suspense
    },
  },
});

function UsuariosPage() {
  const { data } = useUsuarios(); // não precisa de isLoading

  return <UsuarioTable usuarios={data} />;
}

// O Suspense cuida do loading:
<Suspense fallback={<p>Carregando usuários...</p>}>
  <UsuariosPage />
</Suspense>
```

## Suspense aninhado

Cada `Suspense` pode ter seu próprio fallback:

```tsx
function Pagina() {
  return (
    <div>
      <header>Meu App</header>
      <Suspense fallback={<p>Carregando sidebar...</p>}>
        <Sidebar />
      </Suspense>
      <Suspense fallback={<p>Carregando conteúdo...</p>}>
        <Conteudo />
      </Suspense>
    </div>
  );
}
```

## React 19: use() hook

O novo hook `use()` permite ler promises diretamente com suporte a Suspense:

```tsx
import { use, Suspense } from 'react';

function Comentarios() {
  const comentarios = use(fetchComentarios()); // suspense automaticamente
  return <ul>{comentarios.map(c => <li key={c.id}>{c.texto}</li>)}</ul>;
}

function Pagina() {
  return (
    <Suspense fallback={<p>Carregando comentários...</p>}>
      <Comentarios />
    </Suspense>
  );
}
```

## Quando usar lazy loading

- **Rotas** — cada página carregada sob demanda
- **Componentes pesados** — gráficos, editors de texto, mapas
- **Modais** — só baixar o conteúdo do modal quando abrir

```tsx
const ModalConfirmacao = lazy(() => import('./ModalConfirmacao'));

function DeletarButton() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button onClick={() => setAberto(true)}>Excluir</button>
      {aberto && (
        <Suspense fallback={null}>
          <ModalConfirmacao onClose={() => setAberto(false)} />
        </Suspense>
      )}
    </>
  );
}
```

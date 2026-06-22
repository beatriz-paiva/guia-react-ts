---
sidebar_position: 5
---

# Suspense e Lazy Loading

## O problema

Conforme o app cresce, o bundle JavaScript fica maior. O usuário baixa **tudo** antes de ver qualquer coisa — código de dashboard, de admin, de página de configuração — mesmo que ele só queira ver o login.

**Suspense + lazy() resolve:** divide o bundle em pedaços que só são baixados quando necessários.

## lazy() — Code Splitting

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

**O que acontece:**
1. O bundle inicial **não inclui** DashboardPage nem UsersPage
2. Quando o usuário acessa `/dashboard`, o React baixa o chunk daquela página
3. Enquanto baixa, mostra o `fallback` (um loader)
4. Quando o chunk chega, renderiza a página

**Sem lazy:** todas as páginas viriam no bundle inicial, mesmo as que o usuário nunca abre.

## Suspense + TanStack Query

Em vez de gerenciar `isLoading` manualmente, deixe o Suspense cuidar:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true, // todas as queries usam Suspense
    },
  },
});

function UsuariosPage() {
  const { data } = useUsuarios(); // não precisa de isLoading — Suspense cuida
  return <UsuarioTable usuarios={data} />;
}

// O Suspense cuida do loading:
<Suspense fallback={<p>Carregando usuários...</p>}>
  <UsuariosPage />
</Suspense>
```

**Sem Suspense:** você precisa de `if (isLoading) return <Loader />` em toda página. Com Suspense, o fallback é declarativo e centralizado.

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

**Vantagem:** o header aparece imediatamente, cada seção carrega de forma independente.

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

- **Rotas** — cada página carregada sob demanda (é o padrão em projetos React)
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

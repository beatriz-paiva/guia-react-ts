---
sidebar_position: 1
---

# React Router

## O problema

React é SPA (Single Page Application). Sem um router, se você clica num link, a página recarrega — perde estado, pisca a tela, faz requisição pro servidor de novo.

React Router resolve: **troca de URL sem recarregar a página**. O JavaScript intercepta a navegação, renderiza outro componente e mantém o estado vivo.

## Instalação

```bash
npm install react-router-dom
```

## Configuração básica

Envolva a aplicação com `BrowserRouter` — ele sincroniza a UI com a URL do navegador:

```tsx
// main.tsx
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

## Routes e Route

```tsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

Cada `Route` mapeia um caminho (`path`) a um componente (`element`). O `path="*"` pega qualquer rota não definida — a página 404.

## Link vs. NavLink

- **`Link`** — navegação simples, gera um `<a>` que não recarrega a página
- **`NavLink`** — igual Link, mas com um `className` que recebe `isActive` pra saber se é a rota atual

```tsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? 'text-blue-500 font-bold' : 'text-gray-600'
        }
      >
        Dashboard
      </NavLink>
    </nav>
  );
}
```

**Quando usar:** NavLink pra menus e navegação principal (você quer destacar a página atual). Link pra links soltos (chamada pra ação, botão "voltar").

## Rotas aninhadas com Outlet

Útil pra **layouts que persistem** entre páginas — sidebar, header, footer ficam sempre visíveis:

```tsx
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main>
        <Outlet /> {/* aqui renderiza o conteúdo de cada página filha */}
      </main>
    </div>
  );
}

// App.tsx
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
```

`/login` fica fora do layout (sem sidebar). `/` e `/dashboard` herdam o `MainLayout`.

## useParams — Parâmetros de URL

```tsx
// Rota definida: /usuarios/:id
function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useFetch<Usuario>(`/api/usuarios/${id}`);

  return <div>{data?.nome}</div>;
}
```

**Sem useParams:** você teria que fazer parsing manual da URL. Com ele, o `:id` vira `{ id }` diretamente.

## useSearchParams — Query strings

```tsx
function Lista() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const search = searchParams.get('search') ?? '';

  function setPage(nova: number) {
    setSearchParams({ page: String(nova), search });
  }

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearchParams({ search: e.target.value, page: '1' })}
      />
      <p>Página: {page}</p>
    </div>
  );
}
```

**Útil pra:** filtros, paginação, busca — dados que você quer que persistam na URL (o usuário pode copiar o link e compartilhar).

## useNavigate — Navegação programática

```tsx
function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(data: LoginData) {
    await login(data);
    navigate('/dashboard', { replace: true });
    // replace = não volta pra página de login no histórico
  }
}
```

**Quando usar:** após submit de formulário, após login, após qualquer ação que precise redirecionar.

## Navigate — Redirect declarativo

```tsx
function PrivateRoute() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

**Diferença do useNavigate:** `Navigate` é um componente — você usa ele no JSX. `useNavigate` é um hook — você usa em eventos.

## useLocation — Informações da URL

```tsx
function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav>
      {segments.map((seg) => (
        <span key={seg} className="text-gray-500">/ {seg}</span>
      ))}
    </nav>
  );
}
```

## Error element — página 404

```tsx
<Route path="*" element={<NotFound />} />
```

Ou por grupo de rotas:

```tsx
<Route element={<MainLayout />} errorElement={<ErrorPage />}>
  <Route path="/" element={<Home />} />
</Route>
```

## Resumo dos hooks

| Hook | Pra que serve |
|---|---|
| `useParams` | Pegar parâmetros da URL (`:id`) |
| `useSearchParams` | Ler/alterar query strings (`?page=1`) |
| `useNavigate` | Navegar programaticamente (após submit, login) |
| `useLocation` | Dados da URL atual (pathname, state) |

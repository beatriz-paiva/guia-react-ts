---
sidebar_position: 1
---

# React Router

React Router é a biblioteca padrão para navegação em SPAs. Permite trocar de página sem recarregar o navegador.

## Instalação

```bash
npm install react-router-dom
```

## Configuração básica

Envolva a aplicação com `BrowserRouter`:

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

## Link vs. NavLink

- `Link` — navegação simples
- `NavLink` — igual Link, mas com suporte a estado ativo

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

## Rotas aninhadas com Outlet

O `<Outlet />` renderiza o conteúdo da rota filha. Útil para layouts que persistem:

```tsx
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main>
        <Outlet /> {/* aqui renderiza o conteúdo de cada página */}
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

## useParams

Acessa parâmetros da URL:

```tsx
// Rota: /usuarios/:id
function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useFetch<Usuario>(`/api/usuarios/${id}`);

  return <div>{data?.nome}</div>;
}
```

## useSearchParams

Acessa e modifica query strings:

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

## useNavigate

Navegação programática (após submit, login, etc.):

```tsx
function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(data: LoginData) {
    await login(data);
    navigate('/dashboard', { replace: true });
  }
}
```

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

## useLocation

Informações da URL atual. Útil para breadcrumbs:

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

---
sidebar_position: 2
---

# Private Route (Guard)

Um guard de autenticação que protege rotas que exigem login.

## Implementação básica

```tsx
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

## Uso com React Router

```tsx
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

## Com Context de autenticação

A versão ideal usa um `AuthContext` em vez de ler `localStorage` diretamente:

```tsx
function PrivateRoute() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

## Redirecionamento pós-login

Salve a rota de origem e redirecione após o login:

```tsx
function PrivateRoute() {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname ?? '/';

  async function handleSubmit(data: LoginData) {
    await login(data);
    navigate(from, { replace: true });
  }
}
```

## Hierarquia de rotas protegidas

```
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<PrivateRoute />}>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetail />} />
    </Route>
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>
```

- Tudo dentro de `PrivateRoute` exige autenticação
- `/login` fica fora — acessível sem token
- Página 404 cobre rotas inexistentes

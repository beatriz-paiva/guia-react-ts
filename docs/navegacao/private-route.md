---
sidebar_position: 2
---

# Private Route (Guard)

## O problema

Algumas rotas do app só devem ser acessadas por usuários logados. Se o usuário não está autenticado e tenta acessar `/dashboard`, ele deve ser redirecionado pra `/login`.

Você poderia colocar esse `if` em cada página, mas isso seria repetitivo. A solução é um **guard** — um componente que envolve as rotas protegidas.

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

**O que acontece:**
1. O componente verifica se existe um token
2. Se não existe → redireciona pra `/login` (o `replace` evita que o usuário "volte" pra rota protegida no histórico)
3. Se existe → renderiza o `Outlet`, que é o conteúdo da rota filha

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

**Perceba:** `/login` está **fora** do PrivateRoute — acessível sem autenticação. Todas as outras rotas estão dentro — protegidas.

## Com Context de autenticação

A versão anterior lê `localStorage` diretamente. A versão ideal usa o `AuthContext`:

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

**Por que isso é melhor?** O `loading` cobre o momento em que o app está verificando o token no servidor. Sem ele, o usuário veria um flash da tela de login antes do redirect.

## Redirecionamento pós-login

Depois que o usuário faz login, o ideal é levá-lo de volta **pra página que ele tentou acessar**:

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

O `state` na navegação carrega a rota de origem. No `LoginPage`, a gente lê esse `state` e redireciona de volta.

## Hierarquia de rotas

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
- Página 404 no final cobre rotas inexistentes

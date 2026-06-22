---
sidebar_position: 6
---

# Autenticação JWT

Fluxo completo de autenticação com tokens JWT: login, guard, refresh token.

## Fluxo básico

```
1. Usuário envia email + senha → POST /api/login
2. Servidor valida → retorna { token, usuario }
3. Token armazenado (localStorage/sessionStorage)
4. Token enviado em toda requisição (header Authorization)
5. Se 401 → token expirado → redirecionar para /login
```

## Provider de autenticação

O AuthProvider gerencia o estado de autenticação e expõe funções de login/logout:

```tsx
// contexts/AuthContext.tsx
interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token'); // lê token salvo na inicialização
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verifica se o token ainda é válido
      api.get('/me')
        .then((res) => setUsuario(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email: string, senha: string) {
    const { data } = await api.post('/login', { email, senha });
    setToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem('token', data.token);
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Por que validar o token no mount?** Se o usuário recarregar a página, o token ainda está no localStorage. O `GET /me` verifica se ele ainda é válido — se não, faz logout automático.

## Interceptor com refresh token

Quando o token expira (401), o interceptor tenta renovar automaticamente antes de redirecionar:

```tsx
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // evita loop infinito

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await api.post('/refresh', { refreshToken });
        localStorage.setItem('token', data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest); // retenta a requisição original
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
```

**O que faz:** se qualquer requisição der 401, ele pega o refresh token, pede um novo access token, e refaz a requisição original — **tudo invisível pro usuário**.

## PrivateRoute integrado

```tsx
function PrivateRoute() {
  const { usuario, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!usuario) return <Navigate to="/login" replace />;

  return <Outlet />;
}
```

## LoginPage com react-hook-form + Zod

```tsx
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginData) {
    await login(data.email, data.senha);
    navigate(from, { replace: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Entrar</h1>

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('senha')} placeholder="Senha" />
      {errors.senha && <span>{errors.senha.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

## Segurança

- **Nunca** armazene token em variável global (vaza entre abas do navegador)
- **Prefira** cookies httpOnly (mais seguro que localStorage) se o backend suportar
- **Token curto** (15 min) + refresh token longo (7 dias)
- **Sempre** valide token no front antes de renderizar conteúdo protegido
- **Logout** deve limpar token + refresh token + redirecionar

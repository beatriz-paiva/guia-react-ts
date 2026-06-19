---
sidebar_position: 3
---

# Autenticação

## Schema Zod

```tsx
// schemas/login.ts
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginData = z.infer<typeof loginSchema>;
```

## Auth Context

```tsx
// hooks/useAuth.tsx
interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    token: localStorage.getItem('token'),
    loading: !!localStorage.getItem('token'),
  });

  // Verificar token ao montar
  useEffect(() => {
    if (state.token) {
      api.get('/me')
        .then(r => setState(prev => ({ ...prev, usuario: r.data })))
        .catch(() => logout())
        .finally(() => setState(prev => ({ ...prev, loading: false })));
    }
  }, []);

  async function login(email: string, senha: string) {
    const { data } = await api.post('/login', { email, senha });
    localStorage.setItem('token', data.token);
    setState({ usuario: data.usuario, token: data.token, loading: false });
  }

  function logout() {
    localStorage.removeItem('token');
    setState({ usuario: null, token: null, loading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Login Page

```tsx
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <input {...register('email')} placeholder="Email" className="w-full border rounded px-3 py-2" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      <input type="password" {...register('senha')} placeholder="Senha" className="w-full border rounded px-3 py-2" />
      {errors.senha && <p className="text-red-500 text-sm">{errors.senha.message}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

## Interceptor axios

```tsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

Referências: Módulo 7 (Context), Módulo 6 (Formulários + Zod), Módulo 7 (axios)

---
sidebar_position: 2
---

# Context Avançado

## Provider com estado interno

O Provider gerencia o estado e expõe funções para modificá-lo:

```tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Custom hook com safety check

```tsx
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
```

## Context splitting

Separar contexts por domínio evita re-renderizações desnecessárias:

```tsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <RouterProvider />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

Quando `theme` muda, componentes que só consomem `AuthContext` não re-renderizam.

## Context com useReducer

Para estado complexo dentro do Provider:

```tsx
type AuthAction =
  | { type: 'LOGIN'; payload: Usuario }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, usuario: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, usuario: null, token: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    usuario: null,
    token: null,
    loading: true,
  });

  // expõe dispatch indiretamente via funções
  const login = async (email: string, senha: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const usuario = await api.login(email, senha);
    dispatch({ type: 'LOGIN', payload: usuario });
  };

  return (
    <AuthContext.Provider value={{ ...state, login }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Quando NÃO usar Context

- Dados que mudam frequentemente (várias vezes por segundo)
- Dados que só um componente usa
- Dados que podem ser props simples (prop drilling de 2-3 níveis é aceitável)

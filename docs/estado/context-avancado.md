---
sidebar_position: 2
---

# Context Avançado

## O problema

O `useContext` básico resolve prop drilling, mas tem pegadinhas: **todo consumidor rerrenderiza quando o valor muda**, o **Provider precisa estar na árvore**, e se você colocar tudo num único Context, qualquer mudança derruba tudo.

Aqui você vai ver padrões pra usar Context de forma segura e performática.

## Provider com estado interno

Em vez de passar um valor fixo, o Provider gerencia o estado e expõe funções pra modificá-lo:

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

O `useCallback` em `toggleTheme` evita que a função seja recriada a cada render — se o value do Provider mudar, todos os consumidores rerrenderizam.

## Custom hook com safety check

Sempre crie um hook customizado pra consumir o Context. O motivo: se alguém usar fora do Provider, o erro aparece claro:

```tsx
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
```

**Por que fazer isso?** Sem o check, `context` seria `undefined`, e `context.theme` daria "Cannot read properties of undefined" — uma mensagem difícil de rastrear.

## Context splitting

O maior problema de performance do Context: **todo consumidor rerrenderiza quando o valor muda**, mesmo que só use uma parte.

A solução: **separe por domínio**.

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

**O que isso resolve:** quando o `theme` muda, `AuthProvider` e `NotificationProvider` não são afetados — só componentes que consomem `ThemeContext` rerrenderizam.

Sem essa separação (um único Context gigante), mudar o tema rerrenderizaria tudo.

## Context com useReducer

Quando o estado do Provider é complexo (múltiplos campos, múltiplas ações), `useReducer` organiza melhor:

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

**useState vs useReducer no Provider:** com `useState`, você espalha `setUsuario`, `setToken`, `setLoading` pelo Provider. Com `useReducer`, todas as transições de estado ficam centralizadas no reducer — mais fácil de debugar e testar.

## Quando NÃO usar Context

- Dados que mudam frequentemente (várias vezes por segundo) — prefira zustand
- Dados que só um componente usa — use `useState`
- Dados que podem ser props simples — prop drilling de 2-3 níveis é aceitável

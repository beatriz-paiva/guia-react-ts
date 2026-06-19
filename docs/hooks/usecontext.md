---
sidebar_position: 4
---

# useContext

O `useContext` serve para compartilhar informações entre componentes sem precisar passar props manualmente.

## O problema — Prop Drilling

Imagine a árvore de componentes:

```
App
 └── Layout
      └── Header
           └── Usuario
```

O nome do usuário está no `App`, mas você precisa dele em `Usuario`. Sem Context, você precisa passar a prop por todos os níveis:

```
App → Layout → Header → Usuario
```

Isso é chamado de **Prop Drilling**.

## A solução — Context

Criar um Context permite que qualquer componente o acesse sem passar props manualmente.

```
Context
   ↓
Qualquer componente acessa
```

## Criando e usando Context

```tsx
import { createContext, useContext } from 'react';

// 1. Criar o Context
const UsuarioContext = createContext<Usuario | null>(null);

// 2. Provider — disponibiliza o valor
function App() {
  const usuario = { id: 1, nome: 'Ana' };

  return (
    <UsuarioContext.Provider value={usuario}>
      <Layout />
    </UsuarioContext.Provider>
  );
}

// 3. Consumir com useContext
function Usuario() {
  const usuario = useContext(UsuarioContext);
  return <p>{usuario?.nome}</p>;
}
```

## Provider com estado interno

O Provider pode gerenciar estado internamente:

```tsx
interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  function login(email: string, senha: string) {
    const user = { id: 1, nome: 'Ana', email };
    setUsuario(user);
    localStorage.setItem('token', 'fake-token');
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Custom hook para acesso seguro

Sempre crie um hook customizado para consumir o Context — assim você garante que ele só é usado dentro do Provider:

```tsx
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

// Uso nos componentes
function Header() {
  const { usuario, logout } = useAuth();
  return (
    <header>
      <span>{usuario?.nome}</span>
      <button onClick={logout}>Sair</button>
    </header>
  );
}
```

## Performance: context splitting

Evite colocar tudo em um único Context. Separe por domínio:

```tsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </AuthProvider>
  );
}
```

Cada Context é independente — mudar o tema não re-renderiza componentes que só usam auth.

## Context vs. zustand

| Context | Zustand |
|---|---|
| Nativo do React | Biblioteca externa |
| Bom para dados de baixa frequência (auth, tema) | Bom para dados de alta frequência (carrinho, formulários) |
| Provider precisa estar na árvore | Store acessível globalmente |
| Re-renderiza todos os consumidores ao mudar | Selectors evitam re-render desnecessário |

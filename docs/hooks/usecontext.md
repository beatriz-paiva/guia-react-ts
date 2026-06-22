---
sidebar_position: 4
---

# useContext

## O problema — Prop Drilling

Imagine a árvore de componentes:

```
App
 └── Layout
      └── Header
           └── Usuario
```

O nome do usuário está no `App`, mas você precisa dele em `Usuario`. Sem Context, você passa a prop por todos os níveis:

```
App → Layout → Header → Usuario
```

Cada componente no meio recebe e repassa a prop, mesmo sem usá-la. Isso é **Prop Drilling** — e deixa o código mais difícil de manter.

## A solução — Context

O Context cria um "canal" direto entre o dado e quem precisa dele:

```
Context ──→ qualquer componente
```

Sem props intermediárias.

## Criando e usando

```tsx
import { createContext, useContext } from 'react';

// 1. Criar o Context
//    O parâmetro é o valor padrão (usado se não houver Provider)
const UsuarioContext = createContext<Usuario | null>(null);

// 2. Provider — disponibiliza o valor pra árvore abaixo
function App() {
  const usuario = { id: 1, nome: 'Ana' };

  return (
    <UsuarioContext.Provider value={usuario}>
      <Layout />
    </UsuarioContext.Provider>
  );
}

// 3. Consumir — qualquer filho do Provider pode acessar
function Usuario() {
  const usuario = useContext(UsuarioContext);
  return <p>{usuario?.nome}</p>;
}
```

**O que acontece:** quando você chama `useContext(UsuarioContext)`, o React sobe na árvore procurando o `Provider` mais próximo. Se achar, pega o `value`. Se não achar, usa o valor padrão (`null`, nesse caso).

## Provider com estado interno

O Provider pode gerenciar estado e expor funções:

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

Se um componente usar `useContext(AuthContext)` **fora** do `AuthProvider`, o valor será `null` — e `usuario.nome` vai quebrar.

O padrão é criar um hook que verifica isso:

```tsx
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

// Uso: seguro e sem null check manual
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

**Por que fazer isso?** Em vez de dar `null` silenciosamente, o erro aparece claro no console — você sabe na hora que esqueceu de envolver o componente no Provider.

## Performance: context splitting

Um problema do Context: **todo consumidor rerrenderiza quando o valor muda**, mesmo que só use uma parte dele.

Solução: separe por domínio.

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

Mudar o tema não rerrenderiza componentes que só usam auth, e vice-versa.

## Context vs. Zustand

| Context | Zustand |
|---|---|
| Nativo do React | Biblioteca externa |
| Bom pra dados de baixa frequência (auth, tema) | Bom pra dados de alta frequência (carrinho, formulários) |
| Provider precisa estar na árvore | Store acessível globalmente |
| Todo consumidor rerrenderiza ao mudar | Selectors evitam rerrender desnecessário |

---
sidebar_position: 3
---

# Boas práticas

Sem organização, um projeto React cresce e vira bagunça: componentes que fazem tudo, imports espalhados, pastas sem critério. Aqui vão práticas que mantêm o código limpo e escalável.

## Estrutura de pastas

```
src/
  components/       # Componentes reutilizáveis
    Button/
      Button.tsx
      Button.module.css
      index.ts
  pages/            # Páginas/rotas
    Home.tsx
    Sobre.tsx
  hooks/            # Custom hooks
    useFetch.ts
  services/         # API externa
    api.ts
  types/            # Tipos compartilhados
    index.ts
  utils/            # Funções auxiliares
    format.ts
```

## Nomeação

- **Componentes**: PascalCase (`Botao`, `Card`)
- **Arquivos**: PascalCase pra componentes (`Button.tsx`), camelCase pra hooks/utils (`useFetch.ts`, `format.ts`)
- **Props**: camelCase (`onClick`, `corPrimaria`)
- **Event handlers**: prefixo `handle` + nome (`handleClick`, `handleSubmit`)
- **Hooks**: prefixo `use` (`useWindowSize`)

## Componentes pequenos e focados

Cada componente deve ter **uma única responsabilidade**. Se um componente faz muitas coisas, divida-o.

```tsx
// Ruim: componente gigante que faz tudo
function Pagina() { ... }

// Bom: componentes pequenos e compostos
function Pagina() {
  return (
    <Header />
    <Conteudo />
    <Sidebar />
    <Footer />
  );
}
```

## Estado o mais próximo possível

Coloque o estado no componente que realmente precisa dele. Evite "elevar" estado desnecessariamente.

```tsx
function Card() {
  const [aberto, setAberto] = useState(false);
  // estado local — só o Card precisa
  return <button onClick={() => setAberto(!aberto)}>...</button>;
}
```

## Prefira composição sobre herança

React usa composição: componentes menores se combinam.

```tsx
function Modal({ titulo, children }: ModalProps) {
  return (
    <div className="modal">
      <h2>{titulo}</h2>
      {children}
    </div>
  );
}
```

## Cuidado com imports circulares

Mantenha as dependências fluindo em uma direção. Componentes de página importam componentes de UI, nunca o contrário.

## Single Responsibility (SRP)

Cada componente deve ter **um motivo para mudar**:

```tsx
// ❌ Ruim: busca dados + renderiza + formata
function TabelaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => { fetch('/api/usuarios').then(...) }, []);

  function formatarData(data: string) { ... }

  return <table>...</table>;
}

// ✅ Bom: separado em camadas
function TabelaUsuarios() {
  const { data } = useUsuarios();            // hook separado
  return <UsuarioTable usuarios={data} />;    // componente de UI puro
}
```

## DRY vs. Abstração prematura

Extrair código duplicado é bom, mas extrair **antes** de ter duplicação é abstração prematura:

```tsx
// ✅ Primeiro escreva duplicado, depois extraia
function PageA() { return <div className="card p-4"><h2>A</h2></div>; }
function PageB() { return <div className="card p-4"><h2>B</h2></div>; }

// Depois de ver o padrão:
function Card({ titulo, children }: CardProps) {
  return <div className="card p-4"><h2>{titulo}</h2>{children}</div>;
}
```

**Regra: 3 strikes** — só extraia após a terceira repetição.

## Organização de imports

Mantenha os imports em grupos:

```tsx
// 1. React e bibliotecas
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Componentes
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/layouts/Sidebar';

// 3. Hooks e serviços
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

// 4. Tipos e schemas
import type { Usuario } from '@/types/usuario';

// 5. CSS
import styles from './styles.module.css';
```

## Co-localização

Arquivos relacionados devem ficar **perto**, não espalhados por tipo:

```
features/
  usuarios/
    pages/
      UsuariosPage.tsx
    components/
      UsuarioTable.tsx
      UsuarioForm.tsx
    hooks/
      useUsuarios.ts
    schemas/
      usuarioSchema.ts
```

Isso é o oposto de separar por tipo (todos componentes em `components/`, todos hooks em `hooks/`). Feature folders agrupam por domínio — mais fácil de navegar e manter.

## Convenções de nomenclatura

| Item | Convenção | Exemplo |
|---|---|---|
| Componente | PascalCase | `Button`, `UserCard` |
| Arquivo de componente | PascalCase.tsx | `Button.tsx` |
| Hook | camelCase prefixo `use` | `useAuth`, `useDebounce` |
| Arquivo de hook | camelCase.ts | `useAuth.ts` |
| Schema | camelCase sufixo `Schema` | `usuarioSchema.ts` |
| Serviço | camelCase sufixo `Service` | `usuarioService.ts` |
| Store | camelCase prefixo `use` + sufixo `Store` | `useAuthStore.ts` |
| Tipo/Interface | PascalCase | `Usuario`, `UsuarioForm` |

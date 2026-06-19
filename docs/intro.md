---
sidebar_position: 1
---

# Introdução

Um guia prático do que estou aprendendo sobre desenvolvimento web com **React 19**, **TypeScript**, **Vite** e **Tailwind CSS**.

Do setup ao deploy, passando por hooks, formulários, estado global, TanStack Query, autenticação e testes.

## Conteúdo

### 1. Setup do Ambiente
1. [Instalando Node.js com NVM](./setup/instalacao) — Node.js via NVM + VS Code + ESLint
2. [Criando um projeto React com Vite](./setup/criando-projeto) — React + TypeScript + Vite
3. [Configuração do Projeto](./setup/editor-config) — TypeScript, aliases, ESLint flat config

### 2. Fundamentos do React
1. [JSX](./fundamentos/jsx) — Sintaxe, expressões, fragmentos, listas e key
2. [Componentes](./fundamentos/componentes) — Criação, composição e pureza
3. [Props](./fundamentos/props) — Tipagem, children, spreading e PropsWithChildren
4. [Estado](./fundamentos/estado) — useState, objetos, arrays, lazy initializer
5. [Eventos](./fundamentos/eventos) — onClick, onSubmit, keyboard, debounce

### 3. TypeScript no React
1. [Tipagem básica](./typescript/tipagem-basica) — Interface, type, union, funções
2. [Tipagem em componentes](./typescript/tipagem-em-componentes) — Props, children, eventos, refs
3. [Generics](./typescript/generics) — Componentes e hooks genéricos
4. [Utility Types](./typescript/utility-types) — Partial, Pick, Omit, Record
5. [TypeScript Avançado](./typescript/avancado) — satisfies, infer, template literals, mapped types

### 4. Hooks
1. [O que é um Hook](./hooks/conceito) — Conceito e regras
2. [useState](./hooks/usestate) — Objetos, arrays e estado derivado
3. [useEffect](./hooks/useeffect) — Efeitos, dependências e cleanup
4. [useContext](./hooks/usecontext) — Context, Provider e AuthContext
5. [useRef](./hooks/useref) — DOM references e valores mutáveis
6. [Outros hooks](./hooks/outros-hooks) — useReducer, useMemo, useCallback, useTransition
7. [Custom Hooks](./hooks/custom-hooks) — useDebounce, useLocalStorage, useMediaQuery

### 5. Estilização
1. [Tailwind CSS](./estilizacao/tailwind) — Setup, responsivo, dark mode, @theme
2. [CSS Modules](./estilizacao/css-modules) — Escopo local e composição
3. [Design System](./estilizacao/design-system) — Variantes, cva, organização de componentes

### 6. Navegação e Formulários
1. [React Router](./navegacao/react-router) — Routes, NavLink, Outlet, useParams
2. [Private Route](./navegacao/private-route) — Guard de autenticação e redirect
3. [Formulários com react-hook-form](./navegacao/formularios) — register, handleSubmit, validação
4. [Validação com Zod](./navegacao/zod) — Schemas, inferência, integração com hook-form
5. [Exemplo completo: Cadastro](./navegacao/exemplo-completo) — Zod + hook-form + axios

### 7. Estado e Dados
1. [Gerenciamento de Estado](./estado/gerenciamento) — useState vs. Context vs. zustand vs. TanStack Query
2. [Context Avançado](./estado/context-avancado) — Provider com useReducer, context splitting
3. [zustand](./estado/zustand) — Stores, selectors, ações assíncronas

### 8. API e Requisições
1. [Fetch](./api/fetch) — GET, POST, tratamento de erros, AbortController
2. [axios](./api/axios) — Instância, interceptors, cancelamento, service pattern
3. [TanStack Query](./api/tanstack-query) — useQuery, useMutation, cache e refetch
4. [Exemplo completo: CRUD](./api/exemplo-completo) — Service + Query Hook + UI

### 9. Avançado
1. [Performance](./avancado/performance) — React.memo, useMemo, useCallback
2. [Testes](./avancado/testes) — Vitest e Testing Library
3. [Boas práticas](./avancado/boas-praticas) — Estrutura, SRP, co-locação, convenções
4. [Error Boundaries](./avancado/error-boundaries) — Captura de erros e fallback UI
5. [Suspense e Lazy Loading](./avancado/suspense) — Code splitting, Suspense + TanStack Query
6. [Autenticação JWT](./avancado/autenticacao) — AuthProvider, interceptors, refresh token
7. [Acessibilidade](./avancado/acessibilidade) — Semântica, ARIA, teclado, contraste
8. [Padrões de Componentes](./avancado/padroes-componentes) — Compound, polymorphic, controlled/uncontrolled
9. [Deploy](./avancado/deploy) — Build, Vercel, Docker, CI/CD
10. [Arquitetura Front-end](./avancado/arquitetura) — Camadas, separação de responsabilidades

### 10. Projeto Final
1. [Visão Geral](./projeto-final/visao-geral) — Stack e mapa de conceitos
2. [Setup e Estrutura](./projeto-final/setup-e-estrutura) — Scaffold e pastas
3. [Autenticação](./projeto-final/autenticacao) — AuthContext + Login + interceptors
4. [Layout Principal](./projeto-final/layout-principal) — Sidebar + Outlet + zustand
5. [CRUD de Usuários](./projeto-final/crud-usuarios) — Service + Query + paginação
6. [Testes e Deploy](./projeto-final/testes-e-deploy) — Testing Library + Vercel

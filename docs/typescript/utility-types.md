---
sidebar_position: 4
---

# Utility Types

O TypeScript oferece tipos utilitários que manipulam tipos existentes. São essenciais no dia a dia com React.

## `Partial<T>`

Torna todas as propriedades opcionais:

```tsx
interface Usuario {
  nome: string;
  email: string;
  idade: number;
}

function atualizarUsuario(id: number, dados: Partial<Usuario>) {
  // dados pode conter apenas nome, apenas email, etc.
}
```

## `Required<T>`

Torna todas as propriedades obrigatórias (oposto de Partial):

```tsx
interface Config {
  theme?: string;
  lang?: string;
}

const config: Required<Config> = { theme: 'dark', lang: 'pt-BR' };
```

## `Pick<T, K>`

Seleciona apenas algumas propriedades:

```tsx
type UsuarioResumo = Pick<Usuario, 'nome' | 'email'>;
// { nome: string; email: string }
```

## `Omit<T, K>`

Remove propriedades específicas:

```tsx
type UsuarioSemSenha = Omit<Usuario, 'senha'>;
// { nome: string; email: string; idade: number }
```

## `Record<K, V>`

Cria um tipo com chaves K e valores V:

```tsx
type Status = 'ativo' | 'inativo' | 'pendente';
const labels: Record<Status, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  pendente: 'Pendente',
};
```

## `ReturnType<T>`

Extrai o tipo de retorno de uma função:

```tsx
function buscarUsuario() {
  return { id: 1, nome: 'Ana' };
}

type Usuario = ReturnType<typeof buscarUsuario>;
// { id: number; nome: string }
```

## `Parameters<T>`

Extrai os parâmetros de uma função como tupla:

```tsx
function saudacao(nome: string, idade: number) {
  return `${nome} tem ${idade} anos`;
}

type Args = Parameters<typeof saudacao>;
// [nome: string, idade: number]
```

## `Awaited<T>`

Extrai o tipo resolvido de uma Promise:

```tsx
type Resultado = Awaited<Promise<Usuario>>;
// Usuario
```

## Exemplo prático: resposta de API

```tsx
interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

type Usuario = { id: number; nome: string; email: string };

// Pick apenas os campos do formulário
type UsuarioForm = Pick<Usuario, 'nome' | 'email'>;

// Partial para atualização parcial
type UsuarioUpdate = Partial<Usuario>;

// Record para mapeamento de status
type StatusLabels = Record<'success' | 'error' | 'loading', string>;
```

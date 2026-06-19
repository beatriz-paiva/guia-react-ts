---
sidebar_position: 5
---

# TypeScript Avançado

## satisfies

O operador `satisfies` (TS 5+) verifica se um valor satisfaz um tipo sem alterar seu tipo inferido:

```tsx
type Cores = 'red' | 'blue' | 'green';

const palette = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
} satisfies Record<Cores, string>;

// palette.red é inferido como string literal '#ff0000', não como string genérica
```

## as const

Marca um valor como readonly e infere tipos literais:

```tsx
const status = ['ativo', 'inativo', 'pendente'] as const;
type Status = (typeof status)[number];
// 'ativo' | 'inativo' | 'pendente'
```

## Template literal types

Cria tipos a partir de padrões de string:

```tsx
type Evento = `on${Capitalize<string>}`;
// 'onChange' | 'onClick' | 'onSubmit' ...

type Breakpoint = 'sm' | 'md' | 'lg';
type ClasseTailwind = `${Breakpoint}:${string}`;
// 'sm:text-center' | 'md:grid-cols-2' | ...
```

## infer (conditional types)

Extrai tipos dentro de condicionais:

```tsx
type ExtrairPromise<T> = T extends Promise<infer U> ? U : T;

type A = ExtrairPromise<Promise<string>>;
// string

type B = ExtrairPromise<number>;
// number
```

Útil para desencapsular tipos como `useState`:

```tsx
type UnwrapState<T> = T extends [infer State, ...unknown[]] ? State : never;

type Estado = ReturnType<typeof useState<number>>;
// [number, Dispatch<SetStateAction<number>>]

type Valor = UnwrapState<Estado>;
// number
```

## Mapped types

Transforma as propriedades de um tipo:

```tsx
type Opcoes = 'salvar' | 'excluir' | 'editar';

type Permissoes = {
  [K in Opcoes]: boolean;
};
// { salvar: boolean; excluir: boolean; editar: boolean }
```

Com modificadores:

```tsx
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Opcional<T> = {
  [K in keyof T]?: T[K];
};
```

## Discriminated unions

Padrão para state machines no frontend:

```tsx
type State =
  | { status: 'loading' }
  | { status: 'success'; data: Usuario[] }
  | { status: 'error'; error: string };

function render(state: State) {
  switch (state.status) {
    case 'loading':
      return <p>Carregando...</p>;
    case 'success':
      return <ul>{state.data.map(u => <li key={u.id}>{u.nome}</li>)}</ul>;
    case 'error':
      return <p>Erro: {state.error}</p>;
  }
}
```

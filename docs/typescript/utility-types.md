---
sidebar_position: 4
---

# Utility Types

Utility Types são tipos **prontos** que o TypeScript oferece pra manipular outros tipos. Essenciais no React pra não repetir código.

## Manipular objetos

### Partial — tudo opcional

Torna todas as propriedades opcionais.

**Quando usar:** funções de atualização parcial — você pode passar só os campos que mudaram.

```tsx
interface Usuario {
  nome: string;
  email: string;
  idade: number;
}

function atualizarUsuario(id: number, dados: Partial<Usuario>) {
  // dados pode ser { nome: "Ana" } ou { email: "novo@email.com" } ou { }
}
```

### Required — tudo obrigatório

O oposto de Partial: torna todas as propriedades obrigatórias.

**Quando usar:** garantir que um objeto opcional tenha todos os campos preenchidos.

```tsx
interface Config {
  theme?: string;
  lang?: string;
}

const config: Required<Config> = { theme: 'dark', lang: 'pt-BR' }; // ✅
// Sem Required, os dois campos poderiam ser undefined
```

### Pick — selecionar campos

Pega apenas as propriedades que você escolher.

**Quando usar:** criar um tipo resumido a partir de um tipo maior.

```tsx
type UsuarioResumo = Pick<Usuario, 'nome' | 'email'>;
// { nome: string; email: string }
```

### Omit — remover campos

Remove as propriedades que você não quer.

**Quando usar:** criar um tipo de formulário (sem o id, que vem do backend).

```tsx
type UsuarioSemSenha = Omit<Usuario, 'senha'>;
// { nome: string; email: string; idade: number }

type UsuarioForm = Omit<Usuario, 'id'>;
// Útil pra formulário de cadastro: o id é gerado pelo backend
```

## Mapear objetos

### Record — dicionário tipado

Cria um tipo com chaves fixas e valores de um tipo específico.

**Quando usar:** labels, mensagens de erro, mapeamentos — onde as chaves são conhecidas.

```tsx
type Status = 'ativo' | 'inativo' | 'pendente';

const labels: Record<Status, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  pendente: 'Pendente',
};
```

**Sem Record:** você teria que escrever `{ ativo: string; inativo: string; pendente: string }`.

## Extrair tipos

### ReturnType — tipo de retorno

Extrai o tipo que uma função retorna.

**Quando usar:** você tem uma função e quer usar o tipo de retorno dela em outro lugar.

```tsx
function buscarUsuario() {
  return { id: 1, nome: 'Ana' };
}

type Usuario = ReturnType<typeof buscarUsuario>;
// { id: number; nome: string }
```

### Parameters — tipos dos parâmetros

Extrai os parâmetros de uma função como uma tupla.

**Quando usar:** reutilizar tipos de parâmetros de funções existentes.

```tsx
function saudacao(nome: string, idade: number) {
  return `${nome} tem ${idade} anos`;
}

type Args = Parameters<typeof saudacao>;
// [nome: string, idade: number]
```

### Awaited — tipo resolvido de Promise

Extrai o tipo que uma Promise resolve.

**Quando usar:** trabalhar com tipos assíncronos.

```tsx
type Resultado = Awaited<Promise<Usuario>>;
// Usuario
```

## Exemplo prático: API

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

## Resumo rápido

| Utility Type | O que faz | Quando usar |
|---|---|---|
| `Partial<T>` | Tudo opcional | Atualizar parcialmente |
| `Required<T>` | Tudo obrigatório | Garantir preenchimento |
| `Pick<T, K>` | Só alguns campos | Tipo resumido |
| `Omit<T, K>` | Remove campos | Formulário sem id |
| `Record<K, V>` | Chave → Valor | Labels, dicionários |
| `ReturnType<T>` | Retorno da função | Reutilizar tipo de retorno |
| `Parameters<T>` | Parâmetros da função | Reutilizar args |
| `Awaited<T>` | Promise resolvida | Tipos assíncronos |

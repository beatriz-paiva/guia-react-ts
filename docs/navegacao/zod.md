---
sidebar_position: 4
---

# Validação com Zod

## O problema

Você valida os campos um a um dentro do `register` do react-hook-form. As regras ficam espalhadas. E o tipo TypeScript você escreveu manual — se a validação mudar, o tipo pode ficar dessincronizado.

**Zod resolve:** você define um schema centralizado, e o tipo TypeScript é **inferido automaticamente** dele.

```tsx
// Com Zod: uma fonte da verdade
const schema = z.object({ nome: z.string().min(3) });
type FormData = z.infer<typeof schema>;
// ↑ Se o schema mudar, o tipo muda junto
```

## Instalação

```bash
npm install zod
```

## Schemas básicos

```tsx
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(3, 'Mínimo de 3 caracteres'),
  email: z.string().email('Email inválido'),
  idade: z.number().min(18, 'Precisa ser maior de idade'),
});
```

Cada campo é definido com seu tipo (`z.string()`, `z.number()`) e suas regras (`.min()`, `.email()`). Tudo encadeável.

## Inferência de tipos

**Isso é o que faz o Zod especial:** o tipo TypeScript é gerado automaticamente do schema:

```tsx
const usuarioSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
});

type Usuario = z.infer<typeof usuarioSchema>;
// { nome: string; email: string }
```

Se você adicionar `idade: z.number()` no schema, o `Usuario` ganha `idade` automaticamente. **Zero chance de divergência.**

## Validação

```tsx
const resultado = usuarioSchema.safeParse({ nome: 'Ana', email: 'ana@email.com' });

if (resultado.success) {
  console.log(resultado.data); // Usuario — tipado
} else {
  console.log(resultado.error.errors); // array de erros detalhados
}
```

Use `safeParse` em vez de `parse` — ele não lança exceção, devolve um objeto com `success`.

## Métodos de validação

```tsx
z.string()
  .min(3, 'Mínimo 3')
  .max(100, 'Máximo 100')
  .email('Email inválido')
  .regex(/^[a-zA-Z]/, 'Deve começar com letra')

z.number()
  .min(0)
  .max(100)
  .int('Deve ser inteiro')

z.boolean()

z.array(z.string()).min(1, 'Adicione pelo menos um item')

z.enum(['ativo', 'inativo', 'pendente'])
```

## refine — validação customizada

Pra regras que envolvem **mais de um campo** (ex: senha = confirmar senha):

```tsx
const cadastroSchema = z.object({
  senha: z.string().min(6),
  confirmarSenha: z.string().min(6),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'Senhas não conferem',
  path: ['confirmarSenha'], // campo que exibe o erro
});
```

## Objetos aninhados

```tsx
const enderecoSchema = z.object({
  rua: z.string(),
  numero: z.string(),
  cidade: z.string(),
});

const usuarioSchema = z.object({
  nome: z.string(),
  endereco: enderecoSchema, // schema dentro de schema
});
```

## Integração com react-hook-form

```bash
npm install @hookform/resolvers
```

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    // ↑ o resolver conecta o Zod ao react-hook-form
  });

  function onSubmit(data: LoginData) {
    console.log('Login:', data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('senha')} placeholder="Senha" />
      {errors.senha && <span>{errors.senha.message}</span>}

      <button type="submit">Entrar</button>
    </form>
  );
}
```

## Por que usar Zod?

| Sem Zod | Com Zod |
|---|---|
| Tipos manuais: `interface FormData { ... }` | Tipos inferidos: `z.infer<typeof schema>` |
| Validação inline em cada `register` | Schema centralizado e reutilizável |
| Tipos e validação podem divergir | Tipos sempre sincronizados com a validação |
| Dificuldade de reuso | Schema exportado e usado em múltiplos lugares |

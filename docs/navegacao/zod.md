---
sidebar_position: 4
---

# Validação com Zod

Zod é uma biblioteca de validação de schemas com inferência de tipos automática.

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

## Inferência de tipos

O tipo é inferido automaticamente do schema:

```tsx
const usuarioSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
});

type Usuario = z.infer<typeof usuarioSchema>;
// { nome: string; email: string }
```

## Validação

```tsx
const resultado = usuarioSchema.safeParse({ nome: 'Ana', email: 'ana@email.com' });

if (resultado.success) {
  console.log(resultado.data); // Usuario
} else {
  console.log(resultado.error.errors); // array de erros
}
```

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
  endereco: enderecoSchema,
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

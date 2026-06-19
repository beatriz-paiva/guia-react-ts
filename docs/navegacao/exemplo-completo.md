---
sidebar_position: 5
---

# Exemplo Completo: Cadastro de Usuário

Unindo react-hook-form + Zod + axios em um formulário completo.

## Schema Zod

```tsx
// schemas/usuario.ts
import { z } from 'zod';

export const usuarioSchema = z.object({
  nome: z.string().min(3, 'Mínimo de 3 caracteres'),
  email: z.string().email('Email inválido'),
  idade: z.number({ invalid_type_error: 'Idade é obrigatória' })
    .min(18, 'Precisa ser maior de idade')
    .max(120, 'Idade inválida'),
  cargo: z.enum(['admin', 'editor', 'visualizador'], {
    errorMap: () => ({ message: 'Selecione um cargo válido' }),
  }),
  ativo: z.boolean().default(true),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
```

## Componente do formulário

```tsx
// features/usuarios/components/UsuarioForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usuarioSchema, type UsuarioFormData } from '@/schemas/usuario';

interface UsuarioFormProps {
  onSubmit: (data: UsuarioFormData) => Promise<void>;
  defaultValues?: Partial<UsuarioFormData>;
}

function UsuarioForm({ onSubmit, defaultValues }: UsuarioFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          {...register('nome')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="idade">Idade</label>
        <input
          id="idade"
          type="number"
          {...register('idade', { valueAsNumber: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.idade && <p className="text-red-500 text-sm">{errors.idade.message}</p>}
      </div>

      <div>
        <label htmlFor="cargo">Cargo</label>
        <select id="cargo" {...register('cargo')} className="w-full border rounded px-3 py-2">
          <option value="">Selecione...</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="visualizador">Visualizador</option>
        </select>
        {errors.cargo && <p className="text-red-500 text-sm">{errors.cargo.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input id="ativo" type="checkbox" {...register('ativo')} />
        <label htmlFor="ativo">Usuário ativo</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

## Página que consome o formulário

```tsx
// features/usuarios/pages/CadastroUsuarioPage.tsx
import { useNavigate } from 'react-router-dom';
import { UsuarioForm } from '../components/UsuarioForm';
import { api } from '@/services/api';

function CadastroUsuarioPage() {
  const navigate = useNavigate();

  async function handleSubmit(data: UsuarioFormData) {
    await api.post('/usuarios', data);
    navigate('/usuarios');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Novo Usuário</h1>
      <UsuarioForm onSubmit={handleSubmit} />
    </div>
  );
}
```

## Fluxo completo

```
1. Schema Zod define tipos + validação
2. useForm com zodResolver conecta schema ao formulário
3. register conecta cada input ao formulário
4. handleSubmit dispara validação → se OK, chama onSubmit
5. onSubmit usa axios (api) para enviar ao backend
6. Em caso de sucesso, redireciona via useNavigate
```

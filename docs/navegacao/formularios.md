---
sidebar_position: 3
---

# Formulários com react-hook-form

React Hook Form é a biblioteca mais popular para formulários em React. Performática, com pouco código boilerplate.

## Instalação

```bash
npm install react-hook-form
```

## useForm básico

```tsx
import { useForm } from 'react-hook-form';

interface FormData {
  nome: string;
  email: string;
}

function CadastroForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  function onSubmit(data: FormData) {
    console.log('Dados:', data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="border rounded px-3 py-2"
        />
        {errors.nome && <span className="text-red-500">{errors.nome.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register('email', {
            required: 'Email é obrigatório',
            pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
          })}
          className="border rounded px-3 py-2"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Cadastrar
      </button>
    </form>
  );
}
```

## register — conexão com o input

O `register` conecta cada input ao formulário:

```tsx
<input {...register('nome', { required: true })} />
```

É equivalente a:

```tsx
<input
  name="nome"
  onChange={onChange}
  onBlur={onBlur}
  ref={ref}
/>
```

## Validação

```tsx
register('campo', {
  required: 'Mensagem de erro',
  minLength: { value: 3, message: 'Mínimo de 3 caracteres' },
  maxLength: { value: 100, message: 'Máximo de 100 caracteres' },
  pattern: { value: /regex/, message: 'Formato inválido' },
  validate: (value) => value !== 'admin' || 'Nome não permitido',
})
```

## watch — observar valores

```tsx
function Form() {
  const { register, watch } = useForm<{ senha: string }>();
  const senha = watch('senha');

  return (
    <div>
      <input type="password" {...register('senha')} />
      <p>Força: {senha?.length > 8 ? 'Forte' : 'Fraca'}</p>
    </div>
  );
}
```

## setValue — atualizar programaticamente

```tsx
function Form() {
  const { register, setValue } = useForm();

  function preencherEndereco(cep: string) {
    const endereco = buscarCep(cep);
    setValue('rua', endereco.rua);
    setValue('bairro', endereco.bairro);
  }
}
```

## Loading state no submit

```tsx
function Form() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

## Resumo da API

| Hook/Método | Função |
|---|---|
| `register` | Conecta input ao formulário |
| `handleSubmit` | Envelopa o submit com validação |
| `formState.errors` | Erros de validação por campo |
| `formState.isSubmitting` | Estado de envio |
| `watch` | Observa valor de um campo |
| `setValue` | Define valor programaticamente |
| `getValues` | Obtém valores atuais sem subscribe |
| `reset` | Reseta o formulário ao estado inicial |

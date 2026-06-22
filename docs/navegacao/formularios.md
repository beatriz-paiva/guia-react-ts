---
sidebar_position: 3
---

# Formulários com react-hook-form

## O problema

Formulário em React puro: você cria um `useState` pra cada campo, um `onChange` pra cada input, um `value` pra cada um. Pra 3 campos já é repetitivo. Pra 10, vira um caos.

```tsx
// React puro — muito código pra pouco resultado
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [erros, setErros] = useState({});

function handleSubmit(e) {
  e.preventDefault();
  // validação manual campo por campo...
}
```

**React Hook Form resolve:** você conecta cada input com `register`, e a biblioteca cuida do estado, validação e erros.

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

**O que cada parte faz:**

| Parte | Função |
|---|---|
| `useForm<FormData>()` | Cria o formulário tipado |
| `register('nome')` | Conecta o input ao formulário (onChange, onBlur, ref) |
| `handleSubmit(onSubmit)` | Só chama `onSubmit` se a validação passar |
| `formState.errors` | Objeto com erros de cada campo |

## register — o que ele faz por baixo

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

O `register` devolve as props que o input precisa. Você só espalha (`...`) no elemento.

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

| Regra | O que faz |
|---|---|
| `required` | Campo obrigatório |
| `minLength` / `maxLength` | Tamanho mínimo/máximo |
| `pattern` | Regex de validação |
| `validate` | Função customizada — retorna true ou mensagem de erro |

## watch — observar valores

Útil pra mostrar algo na tela baseado no valor de um campo (força da senha, preview):

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

Útil pra preencher campos após buscar dados (CEP, editar usuário):

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

O `isSubmitting` fica `true` enquanto a função `onSubmit` é `async` e não terminou.

## react-hook-form vs useState manual

| react-hook-form | useState manual |
|---|---|
| Cada input: uma linha (`register`) | Cada input: useState + onChange + value |
| Validação declarativa no register | Validação manual no submit |
| Menos rerrender | Cada input rerrenderiza o form inteiro |
| Tipagem integrada | Tipagem manual |

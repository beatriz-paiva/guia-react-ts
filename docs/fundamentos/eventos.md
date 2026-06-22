---
sidebar_position: 5
---

# Eventos

Eventos no React seguem a mesma lógica do DOM, mas com sintaxe **camelCase** (`onClick` em vez de `onclick`) e **tipagem TypeScript**.

## onClick

```tsx
function Botao() {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.clientX, event.clientY);
  }

  return <button onClick={handleClick}>Clique</button>;
}
```

**O que acontece:** quando o usuário clica, o React passa um `SyntheticEvent` (um wrapper do evento nativo que garante consistência entre navegadores). O tipo `React.MouseEvent<HTMLButtonElement>` já tem todas as propriedades do mouse (`clientX`, `clientY`, etc.).

Pode passar a função inline também:

```tsx
<button onClick={() => alert('Clicou!')}>Clique</button>
```

## onChange

```tsx
function InputNome() {
  const [nome, setNome] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNome(event.target.value);
  }

  return <input value={nome} onChange={handleChange} placeholder="Digite seu nome" />;
}
```

**O que acontece:** a cada tecla digitada, o `onChange` dispara, `event.target.value` tem o valor atual do input, e `setNome` atualiza o estado.

## onSubmit

```tsx
function Formulario() {
  const [email, setEmail] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // ← ESSENCIAL
    console.log('Email enviado:', email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

**Por que `preventDefault()`?** Sem ele, o navegador recarrega a página ao submeter o formulário — você perde o estado do React. Sempre chame `event.preventDefault()` no início do handleSubmit.

## Exemplo completo

Combinando onChange, onSubmit e onClick:

```tsx
interface FormData {
  nome: string;
  email: string;
}

function FormularioCompleto() {
  const [dados, setDados] = useState<FormData>({ nome: '', email: '' });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('Dados enviados:', dados);
  }

  function handleLimpar(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDados({ nome: '', email: '' });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" value={dados.nome} onChange={handleChange} placeholder="Nome" />
      <input name="email" value={dados.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">Enviar</button>
      <button onClick={handleLimpar}>Limpar</button>
    </form>
  );
}
```

Detalhe: `handleChange` usa `[name]: value` — o `name` do input vira a chave do objeto. Útil quando vários inputs compartilham o mesmo handler.

## Navegação por teclado

Para componentes que precisam ser acessíveis por teclado:

```tsx
function MenuItem({ label, onSelect }: { label: string; onSelect: () => void }) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <div role="button" tabIndex={0} onClick={onSelect} onKeyDown={handleKeyDown}>
      {label}
    </div>
  );
}
```

## Debounce

Evitar chamadas excessivas (ex: buscar enquanto digita):

```tsx
function Busca() {
  const [termo, setTermo] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Buscar:', termo);
    }, 500); // só executa depois de 500ms sem digitar

    return () => clearTimeout(timer); // cancela o timer anterior se digitou de novo
  }, [termo]);

  return <input value={termo} onChange={(e) => setTermo(e.target.value)} />;
}
```

**Como funciona:** cada vez que o usuário digita, o timer é cancelado e reiniciado. Só quando ele para de digitar por 500ms, a ação é executada.

## Principais tipos de evento

| Evento | Tipo TypeScript | Quando usar |
|---|---|---|
| `onClick` | `React.MouseEvent<HTMLButtonElement>` | Cliques em botões, links, divs |
| `onChange` | `React.ChangeEvent<HTMLInputElement>` | Inputs, textareas, selects |
| `onSubmit` | `React.FormEvent<HTMLFormElement>` | Submit de formulário |
| `onKeyDown` | `React.KeyboardEvent<HTMLInputElement>` | Teclado, atalhos, acessibilidade |
| `onFocus` | `React.FocusEvent<HTMLInputElement>` | Foco em inputs |

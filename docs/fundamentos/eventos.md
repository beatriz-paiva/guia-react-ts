---
sidebar_position: 5
---

# Eventos

Eventos no React seguem a mesma lógica do DOM, mas com sintaxe JSX e tipagem TypeScript.

## onClick

Disparado ao clicar em um elemento.

```tsx
function Botao() {
  function handleClick() {
    alert('Clicou!');
  }

  return <button onClick={handleClick}>Clique</button>;
}
```

Com TypeScript:

```tsx
function Botao() {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.clientX, event.clientY);
  }

  return <button onClick={handleClick}>Clique</button>;
}
```

Também pode passar a função inline:

```tsx
<button onClick={() => alert('Clicou!')}>Clique</button>
```

---

## onChange

Disparado ao alterar o valor de um input, textarea ou select.

```tsx
function InputNome() {
  const [nome, setNome] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNome(event.target.value);
  }

  return <input value={nome} onChange={handleChange} placeholder="Digite seu nome" />;
}
```

---

## onSubmit

Disparado ao enviar um formulário. Importante chamar `preventDefault()` para evitar o recarregamento da página.

```tsx
function Formulario() {
  const [email, setEmail] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('Email enviado:', email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## Exemplo completo

Formulário combinando onChange, onSubmit e onClick:

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

---

## Eventos customizados

Para comunicação entre componentes, use `dispatchEvent` com `CustomEvent`:

```tsx
function Disparador() {
  function handleClick() {
    const evento = new CustomEvent('meu-evento', { detail: { id: 1 } });
    window.dispatchEvent(evento);
  }

  return <button onClick={handleClick}>Disparar</button>;
}

function Ouvinte() {
  useEffect(() => {
    function handler(e: CustomEvent<{ id: number }>) {
      console.log(e.detail.id);
    }

    window.addEventListener('meu-evento', handler as EventListener);
    return () => window.removeEventListener('meu-evento', handler as EventListener);
  }, []);
}
```

---

## Navegação por teclado

Use `onKeyDown` para acessibilidade:

```tsx
function MenuItem({ label, onSelect }: { label: string; onSelect: () => void }) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {label}
    </div>
  );
}
```

---

## Debounce

Para evitar chamadas excessivas (ex: busca enquanto digita):

```tsx
function Busca() {
  const [termo, setTermo] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Buscar:', termo);
    }, 500);

    return () => clearTimeout(timer);
  }, [termo]);

  return (
    <input
      value={termo}
      onChange={(e) => setTermo(e.target.value)}
      placeholder="Digite para buscar..."
    />
  );
}
```

---

## Principais tipos de evento

| Evento | Tipo TypeScript |
|---|---|
| onClick | `React.MouseEvent<HTMLButtonElement>` |
| onChange | `React.ChangeEvent<HTMLInputElement>` |
| onSubmit | `React.FormEvent<HTMLFormElement>` |
| onKeyDown | `React.KeyboardEvent<HTMLInputElement>` |
| onFocus | `React.FocusEvent<HTMLInputElement>` |

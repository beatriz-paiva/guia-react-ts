---
sidebar_position: 7
---

# Acessibilidade (a11y)

## Por que se preocupar?

Cerca de 15-30% da população tem algum tipo de deficiência (visual, motora, cognitiva). Seu app pode ficar inacessível pra essas pessoas se você não seguir boas práticas. Além disso, acessibilidade melhora a experiência **de todos**: contraste alto ajuda em dia ensolarado, navegação por teclado ajuda quem está com as mãos ocupadas.

## Semântica HTML

Use elementos HTML pelo **significado**, não pela aparência:

```tsx
// ❌ Ruim
<div onClick={handleClick}>Clique aqui</div>
<div className="text-2xl font-bold">Título</div>

// ✅ Bom
<button onClick={handleClick}>Clique aqui</button>
<h1 className="text-2xl font-bold">Título</h1>
```

| Elemento correto | Alternativa errada comum |
|---|---|
| `<nav>` | `<div role="navigation">` |
| `<main>` | `<div role="main">` |
| `<aside>` | `<div role="complementary">` |
| `<button>` | `<div onClick>` ou `<span onClick>` |
| `<h1>`-`<h6>` | `<div className="text-2xl">` |

**Por que isso importa?** Leitores de tela navegam por elementos semânticos. Um `<button>` é anunciado como "botão" e pode ser ativado com Enter/Space. Um `<div onClick>` é só "div" — ninguém sabe que é clicável.

## ARIA

Use atributos ARIA quando a semântica HTML não é suficiente:

```tsx
<nav aria-label="Navegação principal">
  <button aria-label="Fechar" onClick={onClose}>
    <XIcon />
  </button>
  <div role="alert" aria-live="polite">
    {mensagem}
  </div>
</nav>
```

### aria-current

Indica o item ativo em uma lista de navegação:

```tsx
<NavLink
  to="/dashboard"
  className={({ isActive }) => isActive ? 'bg-blue-500' : ''}
  aria-current={({ isActive }) => isActive ? 'page' : undefined}
>
  Dashboard
</NavLink>
```

## Navegação por teclado

Todos os elementos interativos devem ser acessíveis por teclado (Tab, Enter, Space, Escape):

```tsx
function MenuItem({ label, onSelect, tabIndex = 0 }: MenuItemProps) {
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
    if (event.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div
      role="menuitem"
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {label}
    </div>
  );
}
```

### Focus management

Ao abrir um modal, mova o foco **para dentro dele**. Ao fechar, volte o foco pro elemento que abriu:

```tsx
function Modal({ aberto, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aberto) {
      modalRef.current?.focus();
    }
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {children}
    </div>
  );
}
```

## useId para IDs únicos

Gerar ID com `Math.random()` muda o ID a cada render e quebra acessibilidade. Use `useId`:

```tsx
function Input({ label }: { label: string }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" aria-describedby={`${id}-hint`} />
      <span id={`${id}-hint`}>Texto de ajuda</span>
    </div>
  );
}
```

## Cores e contraste

- Texto normal: contraste mínimo de **4.5:1**
- Texto grande (24px+): contraste mínimo de **3:1**
- Não use **apenas** cor para transmitir informação

```tsx
// ❌ Ruim: só cor indica erro
<span style={{ color: 'red' }}>Campo inválido</span>

// ✅ Bom: ícone + texto + cor
<span className="text-red-500">
  <AlertIcon aria-hidden="true" /> Campo inválido
</span>
```

## prefers-reduced-motion

Respeite a preferência do usuário por animações reduzidas:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testes de acessibilidade

```bash
npm install -D @axe-core/react
```

```tsx
import axe from '@axe-core/react';

if (import.meta.env.DEV) {
  axe(React, ReactDOM, 1000);
}
```

O axe-core varre a página e reporta violações de acessibilidade no console.

## Checklist rápida

- [ ] Todos os elementos interativos são acessíveis por teclado (Tab, Enter, Space)
- [ ] Imagens têm `alt` descritivo (ou `alt=""` se decorativas)
- [ ] Formulários têm `<label>` associado a cada input
- [ ] Cores têm contraste suficiente
- [ ] Leitores de tela conseguem navegar (roles, aria-labels)
- [ ] Modais gerenciam foco (travam foco dentro + fecham com Escape)
- [ ] Mensagens de erro são anunciadas (aria-live)

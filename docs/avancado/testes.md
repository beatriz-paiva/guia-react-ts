---
sidebar_position: 2
---

# Testes

Testes garantem que os componentes funcionam como esperado e previnem regressões.

## Ferramentas

- **Vitest** — executor de testes rápido e compatível com Vite
- **Testing Library** — renderiza componentes e interage como um usuário faria

## Instalação

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

No `vite.config.ts`:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

---

## Testando renderização

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Saudacao } from './Saudacao';

describe('Saudacao', () => {
  it('exibe o nome passado por props', () => {
    render(<Saudacao nome="Ana" />);
    expect(screen.getByText('Olá, Ana!')).toBeDefined();
  });
});
```

---

## Testando eventos

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Contador } from './Contador';

describe('Contador', () => {
  it('incrementa ao clicar no botão', () => {
    render(<Contador />);
    const botao = screen.getByRole('button', { name: '+' });
    fireEvent.click(botao);
    expect(screen.getByText('1')).toBeDefined();
  });
});
```

---

## Testando formulários

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Formulario } from './Formulario';

describe('Formulario', () => {
  it('envia os dados do formulário', () => {
    const onSubmit = vi.fn();
    render(<Formulario onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Ana' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(onSubmit).toHaveBeenCalledWith({ nome: 'Ana' });
  });
});
```

---

## Boas práticas

- Teste comportamento, não implementação
- Use `getByRole`, `getByText`, `getByPlaceholderText` em vez de `getByTestId`
- Prefira `fireEvent` ou `userEvent` da Testing Library
- Mantenha os testes simples e focados

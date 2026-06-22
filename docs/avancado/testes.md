---
sidebar_position: 2
---

# Testes

## Por que testar?

Sem testes, você nunca sabe se uma mudança quebrou algo em outro lugar. Com testes, você tem **segurança pra refatorar** e **documentação viva** de como o componente se comporta.

## Ferramentas

- **Vitest** — executor de testes rápido, compatível com Vite
- **Testing Library** — renderiza componentes e interage como um usuário faria

Foco em **testar comportamento, não implementação**. Seu teste não deve saber se o componente usa `useState` ou `useReducer` — só se a tela mostra o que deveria.

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

**O que testa:** se o componente renderiza o texto correto baseado na prop.

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

**Por que `getByRole`?** Porque é como um leitor de tela encontra o botão — testa acessibilidade junto.

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

`vi.fn()` cria uma função mock — você verifica se ela foi chamada com os argumentos corretos.

## Boas práticas

- Teste **comportamento**, não implementação
- Use `getByRole`, `getByText`, `getByPlaceholderText` em vez de `getByTestId`
- Prefira `fireEvent` ou `userEvent` da Testing Library
- Mantenha os testes simples e focados — um teste, uma verificação

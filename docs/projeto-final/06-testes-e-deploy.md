---
sidebar_position: 6
---

# Testes e Deploy

## Teste do formulário de login

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('exibe erro quando email é inválido', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const submitBtn = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeDefined();
    });
  });

  it('chama login com os dados corretos', async () => {
    const mockLogin = vi.fn();
    vi.spyOn(authHook, 'useAuth').mockReturnValue({ login: mockLogin });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('teste@email.com', '123456');
    });
  });
});
```

## Teste da sidebar colapsável

```tsx
describe('Sidebar', () => {
  it('alterna entre colapsada e expandida', () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    const toggleBtn = screen.getByRole('button', { name: /toggle/i });
    const sidebarText = screen.queryByText('Dashboard');

    // Expandida inicialmente
    expect(sidebarText).toBeDefined();

    // Colapsar
    fireEvent.click(toggleBtn);
    expect(screen.queryByText('Dashboard')).toBeNull();
  });
});
```

## Configuração de teste

```ts
// vite.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

## Deploy na Vercel

```bash
npm run build
npx vercel --prod
```

Com `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Build e deploy automáticos ao conectar o repositório GitHub em [vercel.com](https://vercel.com).

Referências: Módulo 8 (Testes), Módulo 8 (Deploy)

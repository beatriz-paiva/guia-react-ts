---
sidebar_position: 3
---

# Design System

Um Design System é um conjunto de componentes de UI reutilizáveis com regras de estilo consistentes.

## Componentes com variantes

Crie componentes que aceitam `variant` e `size`:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded font-medium transition ${variants[variant]} ${sizes[size]} ${className ?? ''}`}
      {...props}
    />
  );
}
```

Uso:

```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Salvar
</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
```

## Organização de diretórios

```
src/
  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
      Modal.tsx
      index.ts          # re-exporta todos
  features/
    users/
      pages/
        UsersPage.tsx   # usa Button, Input de ui/
```

O diretório `ui/` contém apenas componentes genéricos e reutilizáveis. Componentes de domínio (ex: `UserTable`) vão dentro de `features/`.

## Class Variance Authority (cva)

Para projetos maiores, `cva` simplifica a definição de variantes:

```bash
npm install class-variance-authority
```

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva('rounded font-medium transition', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />;
}
```

## Boas práticas

- **Componentes puros** — não dependem de contexto/props externas inesperadas
- **Props padronizadas** — siga a API dos elementos HTML nativos
- **Composição** — componentes pequenos se combinam (ex: `Card.Header` + `Card.Body`)
- **Tipagem forte** — exporte `VariantProps` para quem usa o componente
- **Coerência** — 2-3 tamanhos, 3-4 variantes, não mais

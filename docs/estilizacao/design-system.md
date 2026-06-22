---
sidebar_position: 3
---

# Design System

## O problema

Você tem 5 botões no app com cores e tamanhos diferentes espalhados. Um dia o design muda — agora você precisa caçar cada botão pra atualizar. Ou pior: cada desenvolvedor cria seu próprio estilo, e o app vira uma colcha de retalhos.

**Design System resolve:** um conjunto de componentes de UI reutilizáveis com regras consistentes. Um único `<Button>` que aceita variantes.

## Componentes com variantes

Em vez de criar `BotaoPrimario`, `BotaoSecundario`, `BotaoPequeno`, crie **um** componente que aceita `variant` e `size`:

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

**Por que isso é melhor?** Se o design mudar, você altera um arquivo só. E quem usa o componente não precisa saber CSS — só escolher `variant` e `size`.

## Organização de diretórios

```
src/
  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
      Modal.tsx
      index.ts        # re-exporta todos
  features/
    users/
      pages/
        UsersPage.tsx # usa Button, Input de ui/
```

O diretório `ui/` contém apenas componentes genéricos e reutilizáveis. Componentes de domínio (`UserTable`, `LoginForm`) vão dentro de `features/`.

## Class Variance Authority (cva)

Pra projetos maiores, gerenciar variantes com objetos manuais fica repetitivo. A biblioteca `cva` organiza:

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
```

**Sem cva:** você junta classes manualmente com template string. **Com cva:** você define as variantes de forma declarativa, e a biblioteca monta a string final. Também gera tipos TypeScript automaticamente via `VariantProps`.

## Boas práticas

- **Componentes puros** — não dependem de contexto ou props externas inesperadas
- **Props padronizadas** — siga a API dos elementos HTML nativos (`onClick`, `disabled`, etc.)
- **Composição** — componentes pequenos se combinam (ex: `Card.Header` + `Card.Body`)
- **Tipagem forte** — exporte `VariantProps` pra quem usa o componente saber o que passar
- **Coerência** — 2-3 tamanhos, 3-4 variantes, não mais que isso

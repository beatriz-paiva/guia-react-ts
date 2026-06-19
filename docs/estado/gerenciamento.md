---
sidebar_position: 1
---

# Gerenciamento de Estado

Nem todo dado precisa ser estado global. A decisão de onde colocar o estado segue uma hierarquia.

## Árvore de decisão

```
Dado precisa ser compartilhado?
├── Não → useState local (no próprio componente)
└── Sim → Precisa de cache/refetch automático?
         ├── Sim → TanStack Query (dados do servidor)
         └── Não → Quantos componentes consomem?
                  ├── Poucos → Lifting state up + props
                  └── Muitos → Context ou zustand
```

## Estado local (useState)

Use para dados que só interessam ao componente:

```tsx
function Sidebar() {
  const [colapsado, setColapsado] = useState(false);
  // só a Sidebar precisa saber disso
}
```

## Lifting state up

Quando dois componentes irmãos precisam do mesmo dado, mova o estado para o pai:

```tsx
function Pai() {
  const [termo, setTermo] = useState('');

  return (
    <div>
      <InputBusca valor={termo} onChange={setTermo} />
      <ListaResultados filtro={termo} />
    </div>
  );
}
```

## Context

Use para dados compartilhados que mudam com baixa frequência:

- Tema (light/dark)
- Usuário autenticado
- Idioma

## zustand

Use para estado global de UI que muda com alta frequência ou precisa de seletores:

- Carrinho de compras
- Filtros de busca
- Notificações

## TanStack Query

Use para todos os dados vindos do servidor. Ele gerencia cache, loading, refetch automático:

- Lista de usuários
- Dados de dashboard
- Qualquer GET/POST/PUT/DELETE

## Regra de ouro

> **Estado do servidor** (dados da API) → TanStack Query
> **Estado da UI** (sidebar aberta, tema) → zustand ou Context
> **Estado local** (input, toggle) → useState

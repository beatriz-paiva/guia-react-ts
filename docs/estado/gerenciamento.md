---
sidebar_position: 1
---

# Gerenciamento de Estado

## O problema

Você está criando um app. Onde colocar cada dado? Se colocar **tudo** no Context, vira bagunça e o app fica lento. Se colocar **tudo** em `useState`, fica impossível compartilhar entre componentes. Se colocar **tudo** no TanStack Query, você fica fazendo requisição até pra saber se a sidebar está aberta.

Cada ferramenta resolve um tipo de problema. A questão é saber qual usar quando.

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

Dados que só interessam ao próprio componente:

```tsx
function Sidebar() {
  const [colapsado, setColapsado] = useState(false);
  // só a Sidebar precisa saber se está colapsada
}
```

**Regra:** comece sempre aqui. Só mova o estado pra cima quando precisar compartilhar.

## Lifting state up

Quando dois componentes irmãos precisam do mesmo dado, move o estado pro pai:

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

**Quando usar:** 2-3 componentes próximos na árvore. Se a distância for maior, considere Context.

## Context

Para dados compartilhados que mudam com **baixa frequência**:

- Tema (light/dark)
- Usuário autenticado
- Idioma

**Por que não tudo no Context?** Porque quando o valor muda, **todo consumidor rerrenderiza**. Se você colocar dados de alta frequência (posição do mouse, carrinho), o app fica lento.

## Zustand

Para estado global de UI que muda com **alta frequência** ou precisa de **selectors**:

- Carrinho de compras
- Filtros de busca
- Notificações

A diferença pro Context: zustand permite que cada componente "escute" só uma parte do estado, evitando rerrender desnecessário.

## TanStack Query

Para **todos os dados vindos do servidor**. Ele gerencia cache, loading, refetch automático:

- Lista de usuários
- Dados de dashboard
- Qualquer GET/POST/PUT/DELETE

**Por que usar?** Você poderia colocar dados de API num zustand, mas perderia cache, refetch, stale-while-revalidate, e teria que escrever tudo na mão.

## Regra de ouro

> **Estado do servidor** (dados da API) → TanStack Query
> **Estado da UI** (sidebar aberta, tema) → zustand ou Context
> **Estado local** (input, toggle) → useState

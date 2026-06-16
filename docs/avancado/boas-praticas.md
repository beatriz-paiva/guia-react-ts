---
sidebar_position: 3
---

# Boas práticas

## Estrutura de pastas

```text
src/
  components/       # Componentes reutilizáveis
    Button/
      Button.tsx
      Button.module.css
      index.ts
  pages/            # Páginas/rotas
    Home.tsx
    Sobre.tsx
  hooks/            # Custom hooks
    useFetch.ts
  services/         # API externa
    api.ts
  types/            # Tipos compartilhados
    index.ts
  utils/            # Funções auxiliares
    format.ts
```

---

## Nomeação

- **Componentes**: PascalCase (`Botao`, `Card`)
- **Arquivos**: PascalCase para componentes (`Button.tsx`), camelCase para hooks/utils (`useFetch.ts`, `format.ts`)
- **Props**: camelCase (`onClick`, `corPrimaria`)
- **Event handlers**: prefixo `handle` + nome (`handleClick`, `handleSubmit`)
- **Hooks**: prefixo `use` (`useWindowSize`)

---

## Componentes pequenos e focados

Cada componente deve ter uma única responsabilidade. Se um componente faz muitas coisas, divida-o.

```tsx
// Ruim: componente gigante que faz tudo
function Pagina() { ... }

// Bom: componentes pequenos e compostos
function Pagina() {
  return (
    <Header />
    <Conteudo />
    <Sidebar />
    <Footer />
  );
}
```

---

## Estado o mais próximo possível

Coloque o estado no componente que realmente precisa dele. Evite "elevar" estado desnecessariamente.

```tsx
function Card() {
  const [aberto, setAberto] = useState(false);
  // estado local — só o Card precisa
  return <button onClick={() => setAberto(!aberto)}>...</button>;
}
```

---

## Prefira composição sobre herança

React usa composição: componentes menores se combinam para formar interfaces complexas.

```tsx
function Modal({ titulo, children }: ModalProps) {
  return (
    <div className="modal">
      <h2>{titulo}</h2>
      {children}
    </div>
  );
}
```

---

## Cuidado com imports circulares

Mantenha as dependências fluindo em uma direção. Componentes de página importam componentes de UI, nunca o contrário.

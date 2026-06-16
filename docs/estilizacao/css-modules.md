---
sidebar_position: 2
---

# CSS Modules

CSS Modules permitem escrever CSS com escopo local — as classes não vazam para outros componentes.

## Criando um módulo

Crie um arquivo com nome `Componente.module.css`:

```css
/* Card.module.css */
.card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.titulo {
  font-size: 1.25rem;
  font-weight: 600;
}
```

---

## Usando no componente

```tsx
import styles from './Card.module.css';

function Card() {
  return (
    <div className={styles.card}>
      <h2 className={styles.titulo}>Título</h2>
    </div>
  );
}
```

O Vite/Docusaurus já tem suporte nativo — não precisa configurar nada.

---

## Classes múltiplas

```tsx
import styles from './Card.module.css';

function Card({ destaque }: { destaque: boolean }) {
  return (
    <div className={`${styles.card} ${destaque ? styles.destaque : ''}`}>
      Conteúdo
    </div>
  );
}
```

Ou use a biblioteca `clsx` (já inclusa no Docusaurus):

```tsx
import clsx from 'clsx';
import styles from './Card.module.css';

<div className={clsx(styles.card, { [styles.destaque]: destaque })} />
```

---

## CSS Modules vs Tailwind

| CSS Modules | Tailwind |
|---|---|
| CSS tradicional em arquivos separados | Classes utilitárias no JSX |
| Escopo local por padrão | Escopo global (purge por padrão) |
| Nomes de classe customizados | Nomes descritivos pré-definidos |
| Melhor para componentes complexos | Melhor para prototipação rápida |

Os dois podem ser usados juntos no mesmo projeto.

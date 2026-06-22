---
sidebar_position: 2
---

# CSS Modules

## O problema do escopo global

CSS tradicional é **global**. Se você cria uma classe `.card` em um arquivo, e outro componente também tem um `.card`, um sobrescreve o outro. Conforme o projeto cresce, virar um jogo de "onde esse estilo foi definido?".

CSS Modules resolvem: **o escopo é local ao componente**. O bundler (Vite, webpack) transforma o nome da classe em algo único automaticamente.

## Criando um módulo

Arquivo com nome `Componente.module.css` — o `.module.` no nome é o que avisa o bundler pra criar escopo local:

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

O que acontece por baixo: `styles.card` vira algo como `Card_card_abc123` — o bundler embaralha o nome. Assim, dois componentes podem ter `.card` sem conflito.

**Vantagem:** você pode nomear suas classes de forma simples (`.card`, `.titulo`, `.botao`) sem medo de colidir com outros componentes. Zero configuração — Vite e Docusaurus já suportam nativamente.

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

Ou com `clsx` (já incluso no Docusaurus):

```tsx
import clsx from 'clsx';
import styles from './Card.module.css';

<div className={clsx(styles.card, { [styles.destaque]: destaque })} />
```

## CSS Modules vs Tailwind

| CSS Modules | Tailwind |
|---|---|
| CSS tradicional em arquivos separados | Classes utilitárias no JSX |
| Escopo local por padrão | Escopo local via purge |
| Nomes de classe customizados | Nomes atômicos pré-definidos |
| Melhor pra componentes complexos com muito estilo | Melhor pra prototipação rápida e consistência |

Os dois podem (e frequentemente são) usados juntos no mesmo projeto. Por exemplo, Tailwind pra layout e espaçamento, CSS Modules pra estilos mais específicos de um componente.

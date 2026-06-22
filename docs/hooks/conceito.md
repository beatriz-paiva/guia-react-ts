---
sidebar_position: 1
---

# O que é um Hook?

Componentes React são funções. O problema é que uma função normal **não guarda nada** — toda vez que roda, começa do zero.

```tsx
function Contador() {
  let count = 0;       // Toda execução: count = 0 de novo
  count = count + 1;
  return <p>{count}</p> // Sempre mostra 1
}
```

A variável `count` desaparece quando a função termina. Mesmo incrementando, o valor nunca muda na tela.

**Hooks resolvem isso.** São "superpoderes" que o React dá pra função guardar informação, reagir a mudanças e acessar o navegador.

| Hook | O que faz | Problema que resolve |
|---|---|---|
| `useState` | Guarda um valor que persiste | "Quero que esse número aumente quando clicar" |
| `useEffect` | Roda código quando algo muda | "Quero buscar dados quando a tela abrir" |
| `useContext` | Compartilha dados sem props | "Meus componentes estão recebendo props demais" |
| `useRef` | Acessa elemento ou guarda valor sem rerrender | "Preciso pegar o valor de um input sem usar estado" |
| `useReducer` | Estado com regras complexas | "Meu useState virou uma bagunça de if/else" |

### Como identificar

Todo hook começa com `use`. O React usa esse prefixo pra saber que é um hook e aplicar as regras:

- Chame hooks **só no nível superior** (nada de hook dentro de if, for ou callback)
- Chame hooks **só dentro de componente React ou de outro hook**

### Os 3 pra dominar primeiro

| Hook | Quando usar |
|---|---|
| `useState` | Toda vez que um dado muda e a tela precisa refletir isso |
| `useEffect` | Buscar dados, escutar eventos, timer, manipular DOM |
| `useContext` | Tema, autenticação, idioma — dados que muitos componentes precisam |

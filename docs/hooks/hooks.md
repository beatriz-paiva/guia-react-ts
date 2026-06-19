---
sidebar_position: 1
---

# O que é um Hook?

Antes dos Hooks, componentes React eram basicamente "funções que desenham tela".

```tsx
function App() {
  return <h1>Olá Mundo</h1>
}
```

Problema: essa função não lembra de nada.

Toda vez que ela executa, ela começa do zero.

Os Hooks foram criados para dar "superpoderes" aos componentes.

Eles permitem:

- guardar informações (estado)
- executar ações quando algo acontece
- acessar elementos da tela
- compartilhar lógica

Os Hooks sempre começam com use.

```jsx
useState()
useEffect()
useRef()
useMemo()
useCallback()
```

## Os 3 Hooks que você realmente precisa dominar primeiro

#### 1º useState
Guardar informações.

```jsx
const [valor, setValor] = useState("")
```

#### 2º useEffect

Executar ações quando algo muda.

```jsx
useEffect(() => {
  ...
}, [])
```

#### 3º useContext
Compartilhar dados.

```jsx
const usuario = useContext(AuthContext)
```

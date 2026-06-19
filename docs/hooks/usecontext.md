---
sidebar_position: 4
---

# useContext 

O useContext serve para compartilhar informações entre componentes sem precisar passar props manualmente.

#### O problema

Imagine:
```text
App
 └── Layout
      └── Header
            └── Usuario
```
O nome do usuário está no:
```text
App
```
mas você precisa dele em:
```text
Usuario
```
Sem Context:
```text
App
 ↓
Layout
 ↓
Header
 ↓
Usuario
```

Passando props por vários níveis.

Isso é chamado de:

```text
Prop Drilling
```
#### A solução

Criar um Context.

```text
Context
↓
Qualquer componente acessa
```
Sem passar props.

#### Criando o Context
```jsx
const UsuarioContext = createContext(null);
```

#### Provider
```jsx
<UsuarioContext.Provider value={usuario}>
  <App />
</UsuarioContext.Provider>
```
O Provider disponibiliza os dados.

#### Consumindo
```jsx
const usuario = useContext(UsuarioContext);
```
Agora qualquer componente consegue acessar.
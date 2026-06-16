---
sidebar_position: 1
---

# Tipos primitivos

São os tipos básicos de dados no TypeScript.

## String (texto)

```tsx
const nome: string = "Beatriz";
```

Pode armazenar:

```tsx
"Olá" "React" "TypeScript"
```

Não pode:

```tsx
const nome: string = 10; // erro
```

---

## Number (números)

```tsx
const idade: number = 25;
```

Pode ser:

```bash
10 15.5 1000
```

---

## Boolean (verdadeiro ou falso)

```tsx
const ativo: boolean = true;
```

Ou:

```tsx
const ativo: boolean = false;
```

Muito usado em React:

```tsx
const isLoading = true;
```

---

# Arrays

Array é uma lista de valores.

## Lista de strings

```tsx
const nomes: string[] = ["Ana", "João", "Maria"];
```

## Lista de números

```tsx
const notas: number[] = [8, 9, 10];
```

## Como acessar

```tsx
const nomes = ["Ana", "João", "Maria"];
console.log(nomes[0]);
```

Resultado:

```bash
Ana
```

---

# Objetos

Objetos agrupam informações.

```tsx
const usuario = {
  nome: "Beatriz",
  idade: 25
};
```

Acessando:

```tsx
console.log(usuario.nome);
```

Resultado:

```bash
Beatriz
```

## Objeto tipado

```tsx
const usuario: {
  nome: string;
  idade: number;
} = {
  nome: "Beatriz",
  idade: 25
};
```

Mas isso fica repetitivo. Por isso usamos `type`.

---

# Type

Serve para criar um **molde**.

Ao invés de fazer:

```tsx
const usuario: { nome: string; idade: number; }
```

Criamos:

```tsx
type Usuario = {
  nome: string;
  idade: number;
};
```

Agora podemos reutilizar:

```tsx
const usuario: Usuario = { nome: "Beatriz", idade: 25 };
const professor: Usuario = { nome: "Carlos", idade: 40 };
```

Mesmo molde.

---

# Interface

Faz praticamente a mesma coisa.

```tsx
interface Usuario {
  nome: string;
  idade: number;
}
```

Uso:

```tsx
const usuario: Usuario = { nome: "Beatriz", idade: 25 };
```

## Quando usar?

Hoje em React você verá os dois. Muita gente usa `type` para tipos simples e `interface` para componentes e props. Mas ambos funcionam.

### Propriedades opcionais

Use `?` para tornar uma propriedade opcional:

```tsx
interface Usuario {
  id: number;
  nome: string;
  email?: string; // opcional
}
```

---


# Union Types vs. Enums

Tanto os Union Types quanto os Enums servem para a mesma finalidade básica: garantir que uma variável aceite apenas um conjunto específico e fixo de valores. No entanto, a forma como eles se comportam no código gerado é totalmente diferente.

1. Union TypesOs Union Types funcionam como uma lista de opções puramente conceitual dentro do TypeScript. Eles não geram nenhum código JavaScript extra após a compilação, desaparecendo completamente no arquivo final.

Exemplo Prático:
```tsx
// Definição do tipo
type Status = "ativo" | "inativo" | "pendente";
function exibirStatus(status: Status) {
  return <p>Status: {status}</p>;
}

// Uso direto passando a string correspondente
exibirStatus("ativo");
```

### Quando utilizar?
- Dados vindos de APIs externas (JSON): APIs costumam enviar dados como strings puras; os Union Types permitem consumi-los diretamente sem a necessidade de fazer conversões manuais.
- Foco em performance e leveza: Como não geram código JS final, ajudam a manter o tamanho do pacote (bundle size) o mais enxuto possível.
- Estilo JavaScript Nativo: Se você prefere uma sintaxe mais limpa e que mantenha o comportamento tradicional do JavaScript.

2. Enums (Enumerações)Os Enums definem um conjunto de constantes nomeadas, mas, ao contrário dos Union Types, eles são transformados em objetos reais no JavaScript após a compilação.
Exemplo Prático:
```tsx
// Definição do Enum
enum StatusEnum {
  Ativo = "ativo",
  Inativo = "inativo",
  Pendente = "pendente"
}

function exibirStatusComEnum(status: StatusEnum) {
  return <p>Status: {status}</p>;
}

// Uso referenciando o objeto do Enum
exibirStatusComEnum(StatusEnum.Ativo);
```

Quando utilizar?
- Facilidade em grandes refatorações: Se você precisar alterar o valor textual de "inativo" para "desativado" no futuro, basta atualizar a definição do Enum. Todas as partes do projeto que referenciam StatusEnum.Inativo serão atualizadas sozinhas automaticamente.
- Trabalho com Números: Quando as opções são códigos numéricos (como códigos de erro ou HTTP), o Enum permite associar rótulos claros a esses números, deixando o código muito mais legível.
- Necessidade de recursos avançados: Caso você precise iterar sobre as opções ou mapear os valores de volta para os seus respectivos rótulos (reverse mapping).  

---

# Funções tipadas

Sem TypeScript:

```jsx
function somar(a, b) {
  return a + b;
}
```

O TypeScript não sabe os tipos.

Com TypeScript:

```tsx
function somar(a: number, b: number): number {
  return a + b;
}
```

Leitura: `a` é número, `b` é número, retorna número.

Uso:

```tsx
somar(10, 20);
```

Resultado:

```bash
30
```

## Função que retorna texto

```tsx
function saudacao(nome: string): string {
  return `Olá ${nome}`;
}
```

## Tipando callbacks

```tsx
type Callback = (id: number) => void;

function buscar(id: number, onSuccess: Callback) {
  onSuccess(id);
}
```

O tipo `void` indica que a função não retorna nada.

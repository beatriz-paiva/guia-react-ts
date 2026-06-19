---
sidebar_position: 2
---

# useState

O hook mais básico do React. Permite que componentes armazenem e atualizem dados.

## Sintaxe

```tsx
const [valor, setValor] = useState(valorInicial);
```

- `valor` — valor atual do estado
- `setValor` — função que atualiza o valor

---

## Atualização de objetos

```tsx
interface Usuario {
  nome: string;
  email: string;
  idade: number;
}

function Perfil() {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    idade: 0,
  });

  function atualizarCampo(campo: keyof Usuario, valor: string | number) {
    setUsuario((prev) => ({ ...prev, [campo]: valor }));
  }

  return (
    <div>
      <input value={usuario.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} />
      <input value={usuario.email} onChange={(e) => atualizarCampo("email", e.target.value)} />
    </div>
  );
}
```

Sempre espalhe (`...prev`) o objeto anterior para preservar os campos não alterados.

---

## Atualização de arrays

```tsx
function Lista() {
  const [itens, setItens] = useState(["React", "TypeScript"]);

  function adicionar(item: string) {
    setItens((prev) => [...prev, item]);
  }

  function remover(index: number) {
    setItens((prev) => prev.filter((_, i) => i !== index));
  }

  function editar(index: number, novoValor: string) {
    setItens((prev) =>
      prev.map((item, i) => (i === index ? novoValor : item))
    );
  }
}
```

---

## Estado derivado

Nem todo dado precisa ser estado. Se pode ser calculado a partir de props ou outro estado, calcule diretamente:

```tsx
function Carrinho({ itens }: { itens: Produto[] }) {
  const total = itens.reduce((acc, item) => acc + item.preco, 0);
  // não precisa de useState para o total

  return <p>Total: R$ {total}</p>;
}
```

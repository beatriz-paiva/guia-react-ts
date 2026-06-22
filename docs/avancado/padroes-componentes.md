---
sidebar_position: 8
---

# Padrões de Componentes

## Por que padrões?

Sem padrões, cada componente é feito de um jeito diferente — um recebe props, outro usa children, outro aceita `as`. Padrões trazem **consistência e previsibilidade** pro código.

## Compound Components

Vários componentes que funcionam juntos, compartilhando estado implicitamente via Context:

```tsx
// ❌ Ruim: props explícitas em cascata
<Select
  options={opcoes}
  value={selecionado}
  onChange={setSelecionado}
  placeholder="Escolha..."
/>

// ✅ Bom: composição com compound
<Select value={selecionado} onChange={setSelecionado}>
  <Select.Trigger>Escolha...</Select.Trigger>
  <Select.Options>
    {opcoes.map((op) => (
      <Select.Option key={op.value} value={op.value}>
        {op.label}
      </Select.Option>
    ))}
  </Select.Options>
</Select>
```

**Por que é melhor?** O component compound permite que quem usa decida a estrutura visual. O Select.Trigger pode ser um botão, um link, um ícone — sem precisar de props extras.

Implementação:

```tsx
const SelectContext = createContext<SelectContextType | null>(null);

function Select({ children, value, onChange }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      {children}
    </SelectContext.Provider>
  );
}

Select.Trigger = function Trigger({ children }: { children: React.ReactNode }) {
  const { value } = useSelectContext();
  return <button>{children ?? value}</button>;
};

Select.Options = function Options({ children }: { children: React.ReactNode }) {
  return <div className="dropdown">{children}</div>;
};

Select.Option = function Option({ value, children }: OptionProps) {
  const { onChange } = useSelectContext();
  return <div onClick={() => onChange(value)}>{children}</div>;
};
```

Os subcomponentes (`Trigger`, `Options`, `Option`) são definidos como **propriedades** do componente `Select`. Eles compartilham estado via Context.

## Polymorphic Components (prop `as`)

Componentes que podem renderizar como **diferentes elementos HTML**:

```tsx
interface TextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  children: React.ReactNode;
  className?: string;
}

function Text({ as: Tag = 'p', children, className }: TextProps) {
  return <Tag className={className}>{children}</Tag>;
}

// Uso
<Text as="h1" className="text-2xl font-bold">Título</Text>
<Text as="p" className="text-gray-600">Descrição</Text>
```

**Quando usar:** componentes de design system que precisam se adaptar ao contexto (`Text`, `Heading`, `Icon`).

## Controlled vs. Uncontrolled

Um componente pode ser **controlado** (estado vem de fora) ou **não-controlado** (estado interno):

```tsx
// Controlled — estado vem de fora
function InputControlled({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

// Uncontrolled — estado interno
function InputUncontrolled({ defaultValue = '' }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### Padrão: controlled + uncontrolled opcional

O melhor dos dois mundos:

```tsx
function Input({ value: controlledValue, onChange, defaultValue = '' }: InputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  const value = isControlled ? controlledValue : internalValue;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  }

  return <input value={value} onChange={handleChange} />;
}
```

Se o usuário passar `value`, o componente é controlado. Se não, ele gerencia o próprio estado.

## Padrões legados (evite em código novo)

### Render Props

```tsx
// ❌ Evite — prefira hooks
<MouseTracker render={({ x, y }) => (
  <p>Mouse: {x}, {y}</p>
)} />

// ✅ Moderno
function Componente() {
  const { x, y } = useMousePosition();
  return <p>Mouse: {x}, {y}</p>;
}
```

### Higher-Order Components (HOCs)

```tsx
// ❌ Evite — prefira hooks + components
const PaginaComAuth = withAuth(Pagina);

// ✅ Moderno
function Pagina() {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  return <Conteudo />;
}
```

## Resumo

| Padrão | Status | Alternativa moderna |
|---|---|---|
| Compound Components | ✅ Recomendado | — |
| Polymorphic (as) | ✅ Recomendado | — |
| Controlled/Uncontrolled | ✅ Recomendado | — |
| Render Props | ❌ Legado | Custom hooks |
| HOCs | ❌ Legado | Hooks + Context |

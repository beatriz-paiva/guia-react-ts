---
sidebar_position: 8
---

# Padrões de Componentes

Padrões de composição que tornam componentes mais flexíveis e reutilizáveis.

## Compound Components

Vários componentes que funcionam juntos, compartilhando estado implicitamente:

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

## Polymorphic Components (prop `as`)

Componentes que podem renderizar como diferentes elementos HTML:

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

## Controlled vs. Uncontrolled

Um componente pode ser controlado (estado externo) ou não-controlado (estado interno):

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

## Render Props (legado)

Padrão antigo, ainda encontrado em código legado:

```tsx
// ❌ Evite em código novo
<MouseTracker render={({ x, y }) => (
  <p>Mouse: {x}, {y}</p>
)} />
```

Prefira hooks customizados:

```tsx
// ✅ Moderno
function Componente() {
  const { x, y } = useMousePosition();
  return <p>Mouse: {x}, {y}</p>;
}
```

## Higher-Order Components (HOCs)

Outro padrão legado:

```tsx
// ❌ Evite
const PaginaComAuth = withAuth(Pagina);
```

Prefira hooks + componentes:

```tsx
// ✅ Moderno
function Pagina() {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  return <Conteudo />;
}
```

## Resumo: padrões modernos vs. legados

| Padrão | Status | Alternativa moderna |
|---|---|---|
| Compound Components | ✅ Recomendado | — |
| Polymorphic (as) | ✅ Recomendado | — |
| Controlled/Uncontrolled | ✅ Recomendado | — |
| Render Props | ❌ Legado | Custom hooks |
| HOCs | ❌ Legado | Hooks + Context |

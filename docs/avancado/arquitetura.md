---
sidebar_position: 10
---

# Arquitetura Front-end

## O problema

Conforme o projeto cresce, se não houver separação de responsabilidades, o código vira **spaghetti**: componentes que chamam API, hooks que renderizam JSX, lógica de negócio misturada com UI.

Uma arquitetura bem definida separa responsabilidades em **camadas** — cada uma com um papel claro.

## Camadas

```
UI (pages/components)
    ↓  consomem
Hooks (estado + lógica)
    ↓  consomem
Services (API) + Stores (zustand)
    ↓  consomem
Types + Schemas (Zod)
```

**Regra de ouro:** cada camada só depende da camada abaixo. A UI nunca chama axios diretamente.

## Exemplo: funcionalidade "Usuários"

```
src/
  services/
    api.ts                    # axios instance + interceptors
    usuarioService.ts         # chamadas HTTP: listar, criar, etc.
  hooks/
    useUsuarios.ts            # TanStack Query: useQuery, useMutation
  stores/
    useUIStore.ts             # zustand: sidebar, modais
  schemas/
    usuario.ts                # Zod: validação + tipos inferidos
  types/
    index.ts                  # tipos compartilhados
  features/
    usuarios/
      pages/
        UsuariosPage.tsx      # página que importa hooks + componentes
      components/
        UsuarioTable.tsx      # componente de UI puro (recebe dados por props)
        UsuarioForm.tsx       # formulário com react-hook-form + zod
```

## Regras da arquitetura

### 1. UI não chama API diretamente

```tsx
// ❌ Ruim: página faz chamada HTTP direta
function UsuariosPage() {
  const [dados, setDados] = useState([]);
  useEffect(() => {
    axios.get('/api/usuarios').then(r => setDados(r.data)); // ❌
  }, []);
}

// ✅ Bom: página usa hook
function UsuariosPage() {
  const { data } = useUsuarios(); // ✅
}
```

### 2. Serviço não importa hooks

```tsx
// ❌ Ruim: serviço importa hook
import { useAuth } from '@/hooks/useAuth';
export async function fetchUsers() {
  const { token } = useAuth(); // ❌ hooks não funcionam fora de componente
}

// ✅ Bom: serviço recebe o token por parâmetro ou via interceptor
export async function fetchUsers() {
  return api.get('/usuarios'); // token já vai no interceptor
}
```

### 3. Componente de UI é puro

```tsx
// ❌ Ruim: componente de tabela busca dados
function UsuarioTable() {
  const { data } = useUsuarios(); // ❌ componente de UI não deve buscar dados
  return <table>...</table>;
}

// ✅ Bom: recebe dados por props
function UsuarioTable({ usuarios }: { usuarios: Usuario[] }) {
  return <table>...</table>;
}
```

## Responsabilidades

| Camada | Responsabilidade | Não deve |
|---|---|---|
| **pages/** | Montar a página, coordenar hooks + componentes | Chamar API diretamente |
| **components/** | Renderizar UI pura, receber dados por props | Buscar dados, acessar stores |
| **hooks/** | Gerenciar estado + cache + lógica | Renderizar JSX |
| **services/** | Comunicação HTTP | Usar hooks React |
| **stores/** | Estado global de UI | Chamar API |
| **schemas/** | Validação + tipos | Ter dependências do React |

## Benefícios

1. **Testabilidade** — cada camada é testável isoladamente
2. **Manutenibilidade** — mudar a API não afeta a UI
3. **Reuso** — hooks e serviços são reutilizáveis entre features
4. **Escalabilidade** — cresce sem virar spaghetti
5. **Paralelismo** — múltiplos devs trabalham em camadas diferentes

## Quando simplificar

Para projetos pequenos, essa separação pode ser excessiva:

- 1-2 páginas → só `pages/` + `components/`
- 3-5 páginas → adicione `services/` + `types/`
- 5+ páginas ou equipe → adote a arquitetura completa

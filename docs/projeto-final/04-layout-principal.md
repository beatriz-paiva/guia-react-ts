---
sidebar_position: 4
---

# Layout Principal

## UI Store (zustand)

```tsx
// stores/useUIStore.ts
export const useUIStore = create<{
  sidebarAberta: boolean;
  toggleSidebar: () => void;
}>((set) => ({
  sidebarAberta: true,
  toggleSidebar: () => set((state) => ({ sidebarAberta: !state.sidebarAberta })),
}));
```

## MainLayout

```tsx
function MainLayout() {
  const { usuario, logout } = useAuth();
  const sidebarAberta = useUIStore((s) => s.sidebarAberta);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${sidebarAberta ? 'w-64' : 'w-16'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4">
          {sidebarAberta && <span className="font-bold">Admin Apolo</span>}
          <button onClick={toggleSidebar} className="p-1 hover:bg-slate-700 rounded">
            {sidebarAberta ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <NavLink to="/" end className={({ isActive }) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
            <LayoutDashboard size={20} />
            {sidebarAberta && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
            <Users size={20} />
            {sidebarAberta && <span>Usuários</span>}
          </NavLink>
          <NavLink to="/systems" className={({ isActive }) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
            <Monitor size={20} />
            {sidebarAberta && <span>Sistemas</span>}
          </NavLink>
          <NavLink to="/access" className={({ isActive }) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
            <Shield size={20} />
            {sidebarAberta && <span>Acessos</span>}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={logout} className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded w-full">
            <LogOut size={20} />
            {sidebarAberta && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {usuario?.nome ? `Bem-vindo, ${usuario.nome}` : 'Portal Admin'}
            </h2>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

## Router setup

```tsx
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/access" element={<AccessPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

Referências: Módulo 4 (useState), Módulo 6 (React Router + NavLink), Módulo 7 (zustand), Módulo 8 (Autenticação)

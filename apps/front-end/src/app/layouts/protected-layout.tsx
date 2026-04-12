import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/auth-store';
import { Sidebar } from './sidebar';

export function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <header className="flex h-14 items-center justify-end border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Olá, <strong>{user?.name}</strong>!
            </span>
            <button
              onClick={logout}
              className="text-sm text-slate-500 hover:text-orange-500 hover:underline"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

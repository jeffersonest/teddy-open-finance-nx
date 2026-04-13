import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/auth-store';
import { Brand } from '../../shared/ui';
import { APP_NAV_ITEMS, Sidebar, isCurrentRoute } from './sidebar';

export function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const isDashboardRoute = location.pathname === '/' || location.pathname.startsWith('/dashboard');
  const headerNavItems = APP_NAV_ITEMS.filter((item) => item.to !== '/dashboard');
  const pageTitle = getPageTitle(location.pathname);
  const pageDescription = getPageDescription(location.pathname);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="sticky top-0 z-30 border-b border-black/10 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex min-h-[6.25rem] max-w-[90rem] items-center gap-6 px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] text-[#666666] transition-colors hover:bg-slate-50"
            aria-label="Abrir menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Brand className="shrink-0 scale-[0.9] origin-left" />

          <nav className="ml-auto hidden items-center gap-8 lg:flex">
            {headerNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={`border-b pb-1 text-[0.95rem] font-medium transition-colors ${
                  isCurrentRoute(location.pathname, item.to)
                    ? 'border-[#ec6724] text-[#ec6724]'
                    : 'border-transparent text-black hover:text-[#ec6724]'
                }`}
              >
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={logout}
              className="border-b border-transparent pb-1 text-[0.95rem] font-medium text-black transition-colors hover:text-[#ec6724]"
            >
              Sair
            </button>
          </nav>

          <div className="ml-4 hidden whitespace-nowrap text-[0.95rem] text-black xl:block">
            Olá, <span className="font-semibold">{user?.name ?? 'Usuário'}!</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[75rem] px-5 pb-14 pt-8 sm:px-8">
        {isDashboardRoute ? null : (
          <section className="mb-8 rounded-[4px] border border-black/5 bg-white px-6 py-5 shadow-[0_0_8px_rgba(0,0,0,0.08)]">
            <h1 className="text-[1.75rem] font-semibold text-slate-950">{pageTitle}</h1>
            <p className="mt-2 text-sm text-slate-500">{pageDescription}</p>
          </section>
        )}

        <Outlet />
      </main>
    </div>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith('/clients/') && pathname !== '/clients') {
    return 'Detalhes do cliente';
  }

  if (pathname.startsWith('/selected-clients')) {
    return 'Clientes selecionados';
  }

  if (pathname.startsWith('/clients')) {
    return 'Clientes';
  }

  return 'Home';
}

function getPageDescription(pathname: string) {
  if (pathname.startsWith('/clients/') && pathname !== '/clients') {
    return 'Acompanhe os dados principais de cada cliente sem mudar de contexto.';
  }

  if (pathname.startsWith('/selected-clients')) {
    return 'Revise os perfis marcados antes da próxima ação comercial.';
  }

  if (pathname.startsWith('/clients')) {
    return 'Gerencie a base completa com a mesma linguagem visual da dashboard.';
  }

  return 'Visual geral da carteira.';
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

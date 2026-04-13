import { NavLink, useLocation } from 'react-router-dom';
import { Brand } from '../../shared/ui';

export const APP_NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: HomeIcon },
  { to: '/clients', label: 'Clientes', icon: ClientsIcon },
  {
    to: '/selected-clients',
    label: 'Clientes selecionados',
    icon: SelectedClientsIcon,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={`fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <aside
        className={`absolute left-0 top-0 flex h-full w-[18rem] max-w-[85vw] flex-col bg-[#2f2f31] shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative flex min-h-32 items-center justify-center px-6">
          <Brand inverted />
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-5 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition-transform hover:scale-105"
            aria-label="Fechar menu"
          >
            <ChevronIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 rounded-t-[2rem] bg-white px-4 pb-6 pt-8">
          <nav className="flex flex-col gap-2">
            {APP_NAV_ITEMS.map((item) => {
              const isActive = isCurrentRoute(location.pathname, item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-xl font-semibold tracking-[-0.03em] transition-all ${
                    isActive
                      ? 'border-orange-100 bg-orange-50 text-orange-500'
                      : 'border-transparent text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}

export function isCurrentRoute(pathname: string, route: string) {
  if (route === '/dashboard') {
    return pathname === '/' || pathname.startsWith('/dashboard');
  }

  if (route === '/clients') {
    return pathname.startsWith('/clients');
  }

  return pathname.startsWith(route);
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
    </svg>
  );
}

function ClientsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SelectedClientsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 18l-6-6 6-6"
      />
    </svg>
  );
}

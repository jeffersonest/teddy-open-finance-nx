import { useEffect, useMemo, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/auth-store';

const MOBILE_BREAKPOINT = 1200;

export function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    setIsMobileSidebarOpen(false);
  }, [isMobile, location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const viewportIsMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(viewportIsMobile);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const bodyElement = document.body;
    bodyElement.classList.toggle('side-nav-collapsed', !isMobile && isSidebarCollapsed);
    bodyElement.classList.toggle('side-nav-open', isMobile && isMobileSidebarOpen);

    return () => {
      bodyElement.classList.remove('side-nav-collapsed');
      bodyElement.classList.remove('side-nav-open');
    };
  }, [isMobile, isSidebarCollapsed, isMobileSidebarOpen]);

  const greetingName = user?.name?.trim() || 'Usuário';
  const closeSidebar = () => setIsMobileSidebarOpen(false);
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((currentValue) => !currentValue);
      return;
    }

    setIsSidebarCollapsed((currentValue) => !currentValue);
  };
  const isSidebarVisible = useMemo(() => {
    if (isMobile) {
      return isMobileSidebarOpen;
    }

    return !isSidebarCollapsed;
  }, [isMobile, isMobileSidebarOpen, isSidebarCollapsed]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__start">
            <button
              type="button"
              onClick={toggleSidebar}
              className="site-header__menu-btn"
              aria-label="Abrir menu lateral"
            >
              <span className="site-header__menu-icon" aria-hidden="true">
                <img
                  className="site-header__menu-img"
                  src="/reference-assets/hamburguer-menu.svg"
                  alt=""
                />
              </span>
            </button>
            <div className="site-header__logo">
              <img
                className="site-header__logo-img"
                src="/reference-assets/logo-svg.svg"
                alt="teddy Open Finance"
              />
            </div>
          </div>

          <nav className="site-header__nav" aria-label="Navegação principal">
            <ul className="site-header__nav-list">
              <li className="site-header__nav-item">
                <NavLink
                  to="/clients"
                  className={`site-header__nav-link ${isCurrentRoute(location.pathname, '/clients') ? 'site-header__nav-link--active' : ''}`}
                >
                  Clientes
                </NavLink>
              </li>
              <li className="site-header__nav-item">
                <NavLink
                  to="/selected-clients"
                  className={`site-header__nav-link ${isCurrentRoute(location.pathname, '/selected-clients') ? 'site-header__nav-link--active' : ''}`}
                >
                  Clientes selecionados
                </NavLink>
              </li>
              <li className="site-header__nav-item">
                <button type="button" className="site-header__nav-link" onClick={logout}>
                  Sair
                </button>
              </li>
            </ul>
          </nav>

          <div className="site-header__end">
            <p className="site-header__greeting">
              Olá, <strong className="site-header__greeting-name">{greetingName}!</strong>
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <aside className="side-nav" aria-label="Menu lateral">
          <div className="side-nav__top">
            <img
              className="side-nav__logo"
              src="/reference-assets/logo-svg.svg"
              alt="teddy Open Finance"
            />
          </div>

          <div className="side-nav__body">
            <nav className="side-nav__menu" aria-label="Itens do menu lateral">
              <ul className="side-nav__list">
                <li className="side-nav__item">
                  <NavLink to="/clients" className="side-nav__link" onClick={closeSidebar}>
                    <span className="side-nav__icon">
                      <HomeIcon />
                    </span>
                    <span className="side-nav__label">Home</span>
                  </NavLink>
                </li>
                <li className={`side-nav__item ${isCurrentRoute(location.pathname, '/clients') ? 'side-nav__item--active' : ''}`}>
                  <NavLink to="/clients" className="side-nav__link" onClick={closeSidebar}>
                    <span className="side-nav__icon">
                      <UsersIcon />
                    </span>
                    <span className="side-nav__label">Clientes</span>
                  </NavLink>
                </li>
                <li className={`side-nav__item ${isCurrentRoute(location.pathname, '/selected-clients') ? 'side-nav__item--active' : ''}`}>
                  <NavLink to="/selected-clients" className="side-nav__link" onClick={closeSidebar}>
                    <span className="side-nav__icon">
                      <UsersIcon />
                    </span>
                    <span className="side-nav__label">Clientes selecionados</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          <footer className="side-nav__footer" />
        </aside>

        <button
          type="button"
          className="side-nav__handle"
          onClick={toggleSidebar}
          aria-label={isSidebarVisible ? 'Fechar menu lateral' : 'Abrir menu lateral'}
        >
          <img
            className="side-nav__handle-img"
            src="/reference-assets/menu-handle-sidebar-button.svg"
            alt=""
            width={42}
            height={56}
          />
        </button>
        <button
          type="button"
          className="side-nav__backdrop"
          onClick={closeSidebar}
          aria-label="Fechar menu lateral"
        />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function isCurrentRoute(pathname: string, route: string) {
  return pathname.startsWith(route);
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 10.8L12 4l8 6.8v8.2a1 1 0 0 1-1 1h-5.2v-5.5h-3.6V20H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6z" />
    </svg>
  );
}


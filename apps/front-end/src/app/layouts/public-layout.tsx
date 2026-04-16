import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/auth-store';

export function PublicLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const authResolved = useAuthStore((state) => state.authResolved);

  if (!hasHydrated || !authResolved) {
    return null;
  }

  if (accessToken) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

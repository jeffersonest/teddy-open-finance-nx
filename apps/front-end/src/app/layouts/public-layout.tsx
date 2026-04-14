import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/auth-store';

export function PublicLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/clients" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../shared/auth/auth-store';

export function PublicLayout() {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

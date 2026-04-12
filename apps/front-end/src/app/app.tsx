import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PublicLayout } from './layouts/public-layout';
import { ProtectedLayout } from './layouts/protected-layout';
import { LoginPage } from '../features/auth/pages/login-page';
import { DashboardPage } from '../features/dashboard/pages/dashboard-page';
import { ClientsListPage } from '../features/clients/pages/clients-list-page';
import { ClientDetailPage } from '../features/clients/pages/client-detail-page';

export function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsListPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;

import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PublicLayout } from './layouts/public-layout';
import { ProtectedLayout } from './layouts/protected-layout';
import { LoginPage } from '../features/auth/pages/login-page';
import { ClientsListPage } from '../features/clients/pages/clients-list-page';
import { SelectedClientsPage } from '../features/clients/pages/selected-clients-page';

export function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/clients" replace />} />
          <Route path="/clients" element={<ClientsListPage />} />
          <Route path="/selected-clients" element={<SelectedClientsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;

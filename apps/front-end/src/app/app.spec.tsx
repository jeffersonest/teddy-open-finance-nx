import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from './app';
import { queryClient } from '../shared/lib/query-client';
import { useAuthStore } from '../shared/auth/auth-store';

function renderApp() {
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    user: null,
    hasHydrated: true,
    authResolved: true,
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeTruthy();
  });

  it('should render the login title', () => {
    renderApp();
    expect(
      screen.getByRole('heading', { name: /olá, seja bem-vindo!/i }),
    ).toBeTruthy();
  });
});

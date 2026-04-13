import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { queryClient } from '../shared/lib/query-client';

function renderApp() {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
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

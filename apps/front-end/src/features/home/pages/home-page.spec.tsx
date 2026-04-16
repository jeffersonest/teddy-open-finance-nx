import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Client } from '@teddy-open-finance/contracts';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';
import { HomePage } from './home-page';
import { useDashboardClients } from '../../clients/hooks/use-clients';

const navigateMock = vi.fn();

vi.mock('../../clients/hooks/use-clients', () => ({
  useDashboardClients: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Ana Almeida',
    salary: 5000,
    companyValuation: 100000,
    accessCount: 4,
    createdAt: '2026-04-15T10:00:00.000Z',
    updatedAt: '2026-04-15T10:00:00.000Z',
  },
  {
    id: 'client-2',
    name: 'Bruno Barbosa',
    salary: 6200,
    companyValuation: 140000,
    accessCount: 7,
    createdAt: '2026-04-14T10:00:00.000Z',
    updatedAt: '2026-04-14T10:00:00.000Z',
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSelectedClientsStore.setState({ clients: [clients[0]] });

    vi.mocked(useDashboardClients).mockReturnValue({
      data: {
        clients,
        total: clients.length,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useDashboardClients>);
  });

  it('renders the new dashboard sections and opens the latest client detail', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /visão geral da operação de clientes/i })).toBeTruthy();
    expect(screen.getByText(/top 5 maiores salários/i)).toBeTruthy();
    expect(screen.getByText(/top 5 mais acessos/i)).toBeTruthy();
    expect(screen.getByText(/top 5 maior receita na empresa/i)).toBeTruthy();
    expect(screen.getByText(/entradas mais recentes/i)).toBeTruthy();

    const latestClientButton = screen.getByRole('button', {
      name: /abrir detalhes de ana almeida/i,
    });

    fireEvent.click(latestClientButton);
    expect(navigateMock).toHaveBeenCalledWith('/clients/client-1');

    fireEvent.keyDown(latestClientButton, { key: 'Enter' });
    expect(navigateMock).toHaveBeenCalledWith('/clients/client-1');
  });
});

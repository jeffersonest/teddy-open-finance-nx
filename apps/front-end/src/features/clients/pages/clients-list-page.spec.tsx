import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Client } from '@teddy-open-finance/contracts';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';
import { ClientsListPage } from './clients-list-page';
import {
  useClients,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from '../hooks/use-clients';

const navigateMock = vi.fn();

vi.mock('../hooks/use-clients', () => ({
  useClients: vi.fn(),
  useCreateClient: vi.fn(),
  useUpdateClient: vi.fn(),
  useDeleteClient: vi.fn(),
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
];

describe('ClientsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSelectedClientsStore.setState({ clients: [] });

    vi.mocked(useClients).mockReturnValue({
      data: {
        data: clients,
        total: 51,
        page: 3,
        pageSize: 20,
        totalPages: 4,
      },
      isLoading: false,
    } as ReturnType<typeof useClients>);

    vi.mocked(useCreateClient).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCreateClient>);

    vi.mocked(useUpdateClient).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateClient>);

    vi.mocked(useDeleteClient).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteClient>);
  });

  it('preserves page and page size when navigating to client details', () => {
    render(
      <MemoryRouter initialEntries={['/clients?page=3&pageSize=20']}>
        <ClientsListPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /abrir detalhes de ana almeida/i }));

    expect(navigateMock).toHaveBeenCalledWith('/clients/client-1?page=3&pageSize=20');
  });
});

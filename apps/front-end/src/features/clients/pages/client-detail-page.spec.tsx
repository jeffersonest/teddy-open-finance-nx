import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Client } from '@teddy-open-finance/contracts';
import toast from 'react-hot-toast';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';
import { ClientDetailPage } from './client-detail-page';
import { useClient, useDeleteClient, useUpdateClient } from '../hooks/use-clients';

const navigateMock = vi.fn();

vi.mock('../hooks/use-clients', () => ({
  useClient: vi.fn(),
  useDeleteClient: vi.fn(),
  useUpdateClient: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const client: Client = {
  id: 'client-1',
  name: 'Ana Almeida',
  salary: 5000,
  companyValuation: 100000,
  accessCount: 4,
  createdAt: '2026-04-15T10:00:00.000Z',
  updatedAt: '2026-04-15T10:00:00.000Z',
};

describe('ClientDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSelectedClientsStore.setState({ clients: [] });

    vi.mocked(useClient).mockReturnValue({
      data: client,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useClient>);

    vi.mocked(useUpdateClient).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateClient>);

    vi.mocked(useDeleteClient).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteClient>);
  });

  it('renders the detail page and toggles the selected client state', () => {
    render(
      <MemoryRouter initialEntries={['/clients/client-1']}>
        <Routes>
          <Route path="/clients/:id" element={<ClientDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /ana almeida/i })).toBeTruthy();
    expect(screen.getByText(/total de acessos/i)).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();

    const selectionButton = screen.getByRole('button', { name: /selecionar cliente/i });
    fireEvent.click(selectionButton);

    expect(useSelectedClientsStore.getState().clients).toEqual([client]);
    expect(screen.getByRole('button', { name: /remover seleção/i })).toBeTruthy();
    expect(toast.success).toHaveBeenCalledWith('Ana Almeida adicionado aos selecionados');

    fireEvent.click(screen.getByRole('button', { name: /remover seleção/i }));

    expect(useSelectedClientsStore.getState().clients).toEqual([]);
    expect(screen.getByRole('button', { name: /selecionar cliente/i })).toBeTruthy();
    expect(toast.success).toHaveBeenCalledWith('Ana Almeida removido dos selecionados');
  });

  it('opens the delete modal from the detail page', () => {
    render(
      <MemoryRouter initialEntries={['/clients/client-1']}>
        <Routes>
          <Route path="/clients/:id" element={<ClientDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /excluir cliente/i }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/você está prestes a excluir o cliente/i)).toBeTruthy();
  });
});

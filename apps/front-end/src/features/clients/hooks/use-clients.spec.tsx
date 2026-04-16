import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { Client, Paginated } from '@teddy-open-finance/contracts';
import { MAX_PAGE_SIZE } from '@teddy-open-finance/contracts';
import { clientsApi } from '../api/clients-api';
import { useClient, useDashboardClients } from './use-clients';

vi.mock('../api/clients-api', () => ({
  clientsApi: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const firstClient: Client = {
  id: 'client-1',
  name: 'Ana Almeida',
  salary: 5000,
  companyValuation: 100000,
  accessCount: 2,
  createdAt: '2026-04-14T10:00:00.000Z',
  updatedAt: '2026-04-14T10:00:00.000Z',
};

const secondClient: Client = {
  ...firstClient,
  id: 'client-2',
  name: 'Bruno Barbosa',
  accessCount: 5,
};

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('use-clients hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the dashboard dataset from all paginated client pages', async () => {
    vi.mocked(clientsApi.list)
      .mockResolvedValueOnce({
        data: [firstClient],
        total: 2,
        page: 1,
        pageSize: MAX_PAGE_SIZE,
        totalPages: 2,
      } satisfies Paginated<Client>)
      .mockResolvedValueOnce({
        data: [secondClient],
        total: 2,
        page: 2,
        pageSize: MAX_PAGE_SIZE,
        totalPages: 2,
      } satisfies Paginated<Client>);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const { result } = renderHook(() => useDashboardClients(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(clientsApi.list).toHaveBeenNthCalledWith(1, 1, MAX_PAGE_SIZE);
    expect(clientsApi.list).toHaveBeenNthCalledWith(2, 2, MAX_PAGE_SIZE);
    expect(result.current.data).toEqual({
      clients: [firstClient, secondClient],
      total: 2,
    });
  });

  it('syncs the accessed client into paginated and dashboard caches', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const updatedClient: Client = {
      ...firstClient,
      accessCount: 3,
      updatedAt: '2026-04-15T12:00:00.000Z',
    };

    queryClient.setQueryData(['clients', 1, 16], {
      data: [firstClient, secondClient],
      total: 2,
      page: 1,
      pageSize: 16,
      totalPages: 1,
    } satisfies Paginated<Client>);

    queryClient.setQueryData(['clients', 'dashboard'], {
      clients: [firstClient, secondClient],
      total: 2,
    });

    vi.mocked(clientsApi.getById).mockResolvedValue(updatedClient);

    const { result } = renderHook(() => useClient(updatedClient.id), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cachedClientsPage = queryClient.getQueryData<Paginated<Client>>(['clients', 1, 16]);
    const cachedDashboard = queryClient.getQueryData<{ clients: Client[]; total: number }>([
      'clients',
      'dashboard',
    ]);

    expect(cachedClientsPage?.data[0]).toEqual(updatedClient);
    expect(cachedDashboard?.clients[0]).toEqual(updatedClient);
  });
});

import { useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MAX_PAGE_SIZE,
  type Client,
  type ClientFinancialHistoryItem,
  type CreateClientRequest,
  type Paginated,
  type UpdateClientRequest,
} from '@teddy-open-finance/contracts';
import { clientsApi } from '../api/clients-api';

const CLIENTS_KEY = 'clients';
const CLIENTS_DASHBOARD_KEY = [CLIENTS_KEY, 'dashboard'] as const;
const CLIENTS_FINANCIAL_HISTORY_KEY = 'financial-history';

interface DashboardClients {
  clients: Client[];
  total: number;
}

export function useClients(page = 1, pageSize = 16) {
  return useQuery({
    queryKey: [CLIENTS_KEY, page, pageSize],
    queryFn: () => clientsApi.list(page, pageSize),
    placeholderData: keepPreviousData,
  });
}

export function useDashboardClients() {
  return useQuery({
    queryKey: CLIENTS_DASHBOARD_KEY,
    queryFn: async (): Promise<DashboardClients> => {
      const firstPage = await clientsApi.list(1, MAX_PAGE_SIZE);

      if (firstPage.totalPages <= 1) {
        return {
          clients: firstPage.data,
          total: firstPage.total,
        };
      }

      const remainingPages = await Promise.all(
        Array.from({ length: firstPage.totalPages - 1 }, (_, pageIndex) =>
          clientsApi.list(pageIndex + 2, MAX_PAGE_SIZE),
        ),
      );

      return {
        clients: [...firstPage.data, ...remainingPages.flatMap((clientsPage) => clientsPage.data)],
        total: firstPage.total,
      };
    },
  });
}

export function useClient(id: string) {
  const queryClient = useQueryClient();

  const clientQuery = useQuery({
    queryKey: [CLIENTS_KEY, id],
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    if (!clientQuery.data) {
      return;
    }

    queryClient.setQueriesData<Paginated<Client>>(
      {
        predicate: (query) =>
          query.queryKey[0] === CLIENTS_KEY &&
          query.queryKey.length === 3 &&
          typeof query.queryKey[1] === 'number',
      },
      (cachedClientsPage) => {
        if (!cachedClientsPage) {
          return cachedClientsPage;
        }

        return {
          ...cachedClientsPage,
          data: cachedClientsPage.data.map((listedClient) =>
            listedClient.id === clientQuery.data.id ? clientQuery.data : listedClient,
          ),
        };
      },
    );

    queryClient.setQueryData<DashboardClients>(CLIENTS_DASHBOARD_KEY, (cachedDashboard) => {
      if (!cachedDashboard) {
        return cachedDashboard;
      }

      return {
        ...cachedDashboard,
        clients: cachedDashboard.clients.map((listedClient) =>
          listedClient.id === clientQuery.data.id ? clientQuery.data : listedClient,
        ),
      };
    });
  }, [clientQuery.data, queryClient]);

  return clientQuery;
}

export function useClientFinancialHistory(id: string) {
  return useQuery({
    queryKey: [CLIENTS_KEY, id, CLIENTS_FINANCIAL_HISTORY_KEY],
    queryFn: (): Promise<ClientFinancialHistoryItem[]> => clientsApi.listFinancialHistory(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientData: CreateClientRequest) => clientsApi.create(clientData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY], exact: false }),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      clientId,
      clientData,
    }: {
      clientId: string;
      clientData: UpdateClientRequest;
    }) => clientsApi.update(clientId, clientData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY], exact: false });
      queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY, variables.clientId], exact: true });
      queryClient.invalidateQueries({
        queryKey: [CLIENTS_KEY, variables.clientId, CLIENTS_FINANCIAL_HISTORY_KEY],
        exact: true,
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) => clientsApi.remove(clientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY], exact: false }),
  });
}

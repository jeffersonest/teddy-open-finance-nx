import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateClientRequest, UpdateClientRequest } from '@teddy-open-finance/contracts';
import { clientsApi } from '../api/clients-api';

const CLIENTS_KEY = 'clients';

export function useClients(page = 1, pageSize = 16) {
  return useQuery({
    queryKey: [CLIENTS_KEY, page, pageSize],
    queryFn: () => clientsApi.list(page, pageSize),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: [CLIENTS_KEY, id],
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientData: CreateClientRequest) => clientsApi.create(clientData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] }),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] }),
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) => clientsApi.remove(clientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CLIENTS_KEY] }),
  });
}

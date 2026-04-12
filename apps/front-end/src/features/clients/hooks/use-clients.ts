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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClientRequest) => clientsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLIENTS_KEY] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      clientsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLIENTS_KEY] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLIENTS_KEY] }),
  });
}

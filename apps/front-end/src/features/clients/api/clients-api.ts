import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  Paginated,
} from '@teddy-open-finance/contracts';
import { apiClient } from '../../../shared/api/api-client';

export const clientsApi = {
  list: (page = 1, pageSize = 16) =>
    apiClient
      .get<Paginated<Client>>('/clients', { params: { page, pageSize } })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Client>(`/clients/${id}`).then((r) => r.data),

  create: (data: CreateClientRequest) =>
    apiClient.post<Client>('/clients', data).then((r) => r.data),

  update: (id: string, data: UpdateClientRequest) =>
    apiClient.patch<Client>(`/clients/${id}`, data).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/clients/${id}`),
};

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
      .then((response) => response.data),

  getById: (clientId: string) =>
    apiClient.get<Client>(`/clients/${clientId}`).then((response) => response.data),

  create: (clientData: CreateClientRequest) =>
    apiClient.post<Client>('/clients', clientData).then((response) => response.data),

  update: (clientId: string, clientData: UpdateClientRequest) =>
    apiClient
      .patch<Client>(`/clients/${clientId}`, clientData)
      .then((response) => response.data),

  remove: (clientId: string) => apiClient.delete(`/clients/${clientId}`),
};

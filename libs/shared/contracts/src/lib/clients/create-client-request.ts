/**
 * Payload accepted by `POST /clients`.
 *
 * Server-managed fields (`id`, `accessCount`, `createdAt`, `updatedAt`) are
 * never sent by the client.
 */
export interface CreateClientRequest {
  name: string;
  salary: number;
  companyValuation: number;
}

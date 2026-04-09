import type { CreateClientRequest } from './create-client-request.js';

/**
 * Payload accepted by `PATCH /clients/:id`.
 *
 * All fields are optional — only the ones present in the request body are
 * updated. Derived from `CreateClientRequest` so the two stay in sync.
 */
export type UpdateClientRequest = Partial<CreateClientRequest>;

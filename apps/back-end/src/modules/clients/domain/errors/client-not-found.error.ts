export class ClientNotFoundError extends Error {
  constructor(public readonly clientId: string) {
    super(`Client with id "${clientId}" was not found`);
    this.name = 'ClientNotFoundError';
  }
}

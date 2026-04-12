export class EmailAlreadyExistsError extends Error {
  constructor(public readonly email: string) {
    super(`A user with email "${email}" already exists`);
    this.name = 'EmailAlreadyExistsError';
  }
}

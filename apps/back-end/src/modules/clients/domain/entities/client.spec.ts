import { Client } from './client';

describe('Client entity', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates mutable fields and bumps updatedAt on behavior methods', () => {
    const initialTime = new Date('2026-04-14T10:00:00.000Z');
    jest.setSystemTime(initialTime.getTime());

    const client = new Client({
      id: 'client-1',
      name: 'Ana',
      salary: 4500,
      companyValuation: 120000,
      accessCount: 0,
      createdAt: initialTime,
      updatedAt: initialTime,
    });

    jest.setSystemTime(new Date('2026-04-14T10:01:00.000Z').getTime());
    client.rename('Ana Maria');
    expect(client.name).toBe('Ana Maria');
    expect(client.updatedAt.toISOString()).toBe('2026-04-14T10:01:00.000Z');

    jest.setSystemTime(new Date('2026-04-14T10:02:00.000Z').getTime());
    client.updateSalary(5000);
    expect(client.salary).toBe(5000);
    expect(client.updatedAt.toISOString()).toBe('2026-04-14T10:02:00.000Z');

    jest.setSystemTime(new Date('2026-04-14T10:03:00.000Z').getTime());
    client.updateCompanyValuation(140000);
    expect(client.companyValuation).toBe(140000);
    expect(client.updatedAt.toISOString()).toBe('2026-04-14T10:03:00.000Z');

    jest.setSystemTime(new Date('2026-04-14T10:04:00.000Z').getTime());
    client.registerAccess();
    expect(client.accessCount).toBe(1);
    expect(client.updatedAt.toISOString()).toBe('2026-04-14T10:04:00.000Z');
  });
});

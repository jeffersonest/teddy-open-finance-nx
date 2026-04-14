import type { Client } from '@teddy-open-finance/contracts';
import { useSelectedClientsStore } from './selected-clients-store';

const firstClient: Client = {
  id: 'client-1',
  name: 'Ana',
  salary: 5000,
  companyValuation: 100000,
  accessCount: 0,
  createdAt: '2026-04-14T10:00:00.000Z',
  updatedAt: '2026-04-14T10:00:00.000Z',
};

const secondClient: Client = {
  ...firstClient,
  id: 'client-2',
  name: 'Bruno',
};

describe('useSelectedClientsStore', () => {
  beforeEach(() => {
    useSelectedClientsStore.setState({ clients: [] });
  });

  it('adds a client once and blocks duplicates', () => {
    const addClient = useSelectedClientsStore.getState().addClient;

    expect(addClient(firstClient)).toBe(true);
    expect(addClient(firstClient)).toBe(false);
    expect(useSelectedClientsStore.getState().clients).toHaveLength(1);
  });

  it('removes one client and clears all selected clients', () => {
    const { addClient, removeClient, clearAll } = useSelectedClientsStore.getState();

    addClient(firstClient);
    addClient(secondClient);
    removeClient(firstClient.id);
    expect(useSelectedClientsStore.getState().clients).toEqual([secondClient]);

    clearAll();
    expect(useSelectedClientsStore.getState().clients).toEqual([]);
  });
});

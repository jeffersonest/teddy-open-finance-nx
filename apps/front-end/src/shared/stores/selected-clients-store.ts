import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Client } from '@teddy-open-finance/contracts';

interface SelectedClientsState {
  clients: Client[];
  addClient: (client: Client) => boolean;
  removeClient: (clientId: string) => void;
  clearAll: () => void;
}

export const useSelectedClientsStore = create<SelectedClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      addClient: (clientToSelect) => {
        const alreadySelected = get().clients.some(
          (selectedClient) => selectedClient.id === clientToSelect.id,
        );
        if (alreadySelected) return false;
        set((state) => ({ clients: [...state.clients, clientToSelect] }));
        return true;
      },
      removeClient: (clientId) =>
        set((state) => ({
          clients: state.clients.filter((selectedClient) => selectedClient.id !== clientId),
        })),
      clearAll: () => set({ clients: [] }),
    }),
    { name: 'teddy-selected-clients' },
  ),
);

import { useState } from 'react';
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from '@teddy-open-finance/contracts';
import toast from 'react-hot-toast';
import { Card } from '../../../shared/ui/card';
import { Modal } from '../../../shared/ui/modal';
import { Button } from '../../../shared/ui/button';
import { ClientForm } from '../components/client-form';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '../hooks/use-clients';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';

const PAGE_SIZE_OPTIONS = [8, 12, 16];

export function ClientsListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const { data, isLoading } = useClients(page, pageSize);
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const selectedClients = useSelectedClientsStore((state) => state.clients);
  const addClientToSelection = useSelectedClientsStore((state) => state.addClient);

  const [showCreate, setShowCreate] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const handleCreate = (formData: CreateClientRequest) => {
    createClientMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Cliente criado');
        setShowCreate(false);
      },
      onError: () => toast.error('Erro ao criar cliente'),
    });
  };

  const handleUpdate = (formData: CreateClientRequest) => {
    if (!editingClient) return;
    const clientData: UpdateClientRequest = formData;
    updateClientMutation.mutate(
      { clientId: editingClient.id, clientData },
      {
        onSuccess: () => {
          toast.success('Cliente atualizado');
          setEditingClient(null);
        },
        onError: () => toast.error('Erro ao atualizar'),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingClient) return;
    deleteClientMutation.mutate(deletingClient.id, {
      onSuccess: () => {
        toast.success('Cliente excluído');
        setDeletingClient(null);
      },
      onError: () => toast.error('Erro ao excluir'),
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const totalClients = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const clients = data?.data ?? [];
  const selectedClientIds = new Set(selectedClients.map((selectedClient) => selectedClient.id));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          <strong>{totalClients}</strong> clientes encontrados:
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-slate-500">
            Clientes por página:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="rounded border border-slate-300 px-2 py-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : clients.length === 0 ? (
        <p className="text-slate-500">Nenhum cliente cadastrado.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clients.map((client) => (
              <Card
                key={client.id}
                className={`flex flex-col items-center text-center transition-colors ${
                  selectedClientIds.has(client.id)
                    ? 'border-dashed border-sky-400 bg-sky-50/40'
                    : ''
                }`}
              >
                <h3 className="text-base font-bold text-slate-900">{client.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Salário: {formatCurrency(client.salary)}
                </p>
                <p className="text-sm text-slate-500">
                  Empresa: {formatCurrency(client.companyValuation)}
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="text-slate-400 transition-colors hover:text-orange-500"
                    aria-label={`Editar ${client.name}`}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => setDeletingClient(client)}
                    className="text-slate-400 transition-colors hover:text-red-500"
                    aria-label={`Excluir ${client.name}`}
                  >
                    <TrashIcon />
                  </button>
                  <button
                    onClick={() => {
                      const wasAdded = addClientToSelection(client);
                      if (!wasAdded) {
                        toast(`${client.name} já está selecionado`);
                        return;
                      }
                      toast.success(`${client.name} adicionado aos selecionados`);
                    }}
                    className={`transition-colors ${
                      selectedClientIds.has(client.id)
                        ? 'text-sky-500 hover:text-sky-600'
                        : 'text-slate-400 hover:text-orange-500'
                    }`}
                    aria-label={`Selecionar ${client.name}`}
                    aria-pressed={selectedClientIds.has(client.id)}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                      pageNumber === page
                        ? 'bg-orange-500 text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
            </div>
          )}
        </>
      )}

      <div className="mt-6 flex justify-center">
        <Button onClick={() => setShowCreate(true)} className="w-full max-w-xs">
          Criar cliente
        </Button>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Criar cliente:">
        <ClientForm
          onSubmit={handleCreate}
          loading={createClientMutation.isPending}
          submitLabel="Criar cliente"
        />
      </Modal>

      <Modal
        open={!!editingClient}
        onClose={() => setEditingClient(null)}
        title="Editar cliente:"
      >
        {editingClient && (
          <ClientForm
            defaultValues={{
              name: editingClient.name,
              salary: editingClient.salary,
              companyValuation: editingClient.companyValuation,
            }}
            onSubmit={handleUpdate}
            loading={updateClientMutation.isPending}
            submitLabel="Editar cliente"
          />
        )}
      </Modal>

      <Modal
        open={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        title="Excluir cliente:"
      >
        {deletingClient && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Você está prestes a excluir o cliente:{' '}
              <strong>{deletingClient.name}</strong>.
            </p>
            <Button
              onClick={handleConfirmDelete}
              loading={deleteClientMutation.isPending}
            >
              Excluir cliente
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

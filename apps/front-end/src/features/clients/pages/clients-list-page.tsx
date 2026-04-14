import { useState } from 'react';
import type { Client, CreateClientRequest, UpdateClientRequest } from '@teddy-open-finance/contracts';
import toast from 'react-hot-toast';
import { Modal } from '../../../shared/ui/modal';
import { ClientForm } from '../components/client-form';
import { useClients, useCreateClient, useDeleteClient, useUpdateClient } from '../hooks/use-clients';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';

const PAGE_SIZE_OPTIONS = [16, 20, 30, 50];

export function ClientsListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [showCreate, setShowCreate] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const { data, isLoading } = useClients(page, pageSize);
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  const selectedClients = useSelectedClientsStore((state) => state.clients);
  const addClientToSelection = useSelectedClientsStore((state) => state.addClient);

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
    if (!editingClient) {
      return;
    }

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
    if (!deletingClient) {
      return;
    }

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
    <section className="clients-page">
      <div className="clients-page__top">
        <h1 className="clients-page__found">
          <strong className="clients-page__found-count">{totalClients}</strong> clientes encontrados:
        </h1>
        <div className="clients-page__per-page">
          <label className="clients-page__per-page-label" htmlFor="page-size">
            Clientes por página:
          </label>
          <select
            className="clients-page__per-page-select"
            id="page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? <p className="clients-page__empty">Carregando...</p> : null}
      {!isLoading && clients.length === 0 ? (
        <p className="clients-page__empty">Nenhum cliente cadastrado.</p>
      ) : null}

      {!isLoading ? (
        <button type="button" className="clients-page__create-button" onClick={() => setShowCreate(true)}>
          Criar cliente
        </button>
      ) : null}

      {!isLoading && clients.length > 0 ? (
        <>
          <div className="clients-grid">
            {clients.map((client) => (
              <article
                key={client.id}
                className={`client-card ${selectedClientIds.has(client.id) ? 'client-card--selected' : ''}`}
              >
                <h2 className="client-card__name">{client.name}</h2>
                <p className="client-card__line">Salário: {formatCurrency(client.salary)}</p>
                <p className="client-card__line">Empresa: {formatCurrency(client.companyValuation)}</p>
                <div className="client-card__actions">
                  <button
                    type="button"
                    className="client-card__action"
                    onClick={() => setEditingClient(client)}
                    aria-label={`Editar ${client.name}`}
                  >
                    <img src="/reference-assets/edit-icon.svg" alt="" />
                  </button>
                  <button
                    type="button"
                    className="client-card__action"
                    onClick={() => setDeletingClient(client)}
                    aria-label={`Excluir ${client.name}`}
                  >
                    <img src="/reference-assets/delete-icon.svg" alt="" />
                  </button>
                  <button
                    type="button"
                    className={`client-card__action client-card__action--plus ${selectedClientIds.has(client.id) ? 'client-card__action--active' : ''}`}
                    onClick={() => {
                      const wasAdded = addClientToSelection(client);
                      if (!wasAdded) {
                        toast(`${client.name} já está selecionado`);
                        return;
                      }
                      toast.success(`${client.name} adicionado aos selecionados`);
                    }}
                    aria-label={`Selecionar ${client.name}`}
                  >
                    <img src="/reference-assets/plus-icon.svg" alt="" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {totalPages > 1 ? (
            <nav className="clients-pagination" aria-label="Paginação de clientes">
              {buildPagination(page, totalPages).map((paginationItem, itemIndex) => (
                <button
                  key={`${paginationItem}-${itemIndex}`}
                  type="button"
                  className={`clients-pagination__item ${
                    paginationItem === page ? 'clients-pagination__item--active' : ''
                  } ${paginationItem === '...' ? 'clients-pagination__ellipsis' : ''}`}
                  onClick={() => {
                    if (typeof paginationItem !== 'number') {
                      return;
                    }
                    setPage(paginationItem);
                  }}
                  disabled={paginationItem === '...'}
                >
                  {paginationItem}
                </button>
              ))}
            </nav>
          ) : null}
        </>
      ) : null}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Criar cliente:">
        <ClientForm
          onSubmit={handleCreate}
          loading={createClientMutation.isPending}
          submitLabel="Criar cliente"
        />
      </Modal>

      <Modal open={!!editingClient} onClose={() => setEditingClient(null)} title="Editar cliente:">
        {editingClient ? (
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
        ) : null}
      </Modal>

      <Modal
        open={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        title="Excluir cliente:"
        className="app-modal--delete"
      >
        {deletingClient ? (
          <>
            <p className="app-modal__delete-text">
              Você está prestes a excluir o cliente: <strong>{deletingClient.name}</strong>
            </p>
            <button
              type="button"
              className="app-modal__submit app-modal__submit--delete"
              onClick={handleConfirmDelete}
              disabled={deleteClientMutation.isPending}
            >
              {deleteClientMutation.isPending ? 'Excluindo...' : 'Excluir cliente'}
            </button>
          </>
        ) : null}
      </Modal>
    </section>
  );
}

function buildPagination(currentPage: number, totalPages: number): Array<number | '...'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, '...', totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { CreateClientRequest, UpdateClientRequest } from '@teddy-open-finance/contracts';
import { formatCurrency, formatLongDate } from '../../../shared/lib/formatters';
import { Modal } from '../../../shared/ui/modal';
import { Button } from '../../../shared/ui/button';
import { ClientForm } from '../components/client-form';
import { useClient, useDeleteClient, useUpdateClient } from '../hooks/use-clients';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';

export function ClientDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: client, isLoading, isError } = useClient(id);
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const selectedClients = useSelectedClientsStore((state) => state.clients);
  const addClient = useSelectedClientsStore((state) => state.addClient);
  const removeClient = useSelectedClientsStore((state) => state.removeClient);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const clientIsSelected = useMemo(
    () => selectedClients.some((selectedClient) => selectedClient.id === client?.id),
    [client?.id, selectedClients],
  );

  const handleSelectClient = () => {
    if (!client) {
      return;
    }

    if (clientIsSelected) {
      removeClient(client.id);
      toast.success(`${client.name} removido dos selecionados`);
      return;
    }

    const wasAdded = addClient(client);
    if (!wasAdded) {
      toast(`${client.name} já está selecionado`);
      return;
    }

    toast.success(`${client.name} adicionado aos selecionados`);
  };

  const handleUpdateClient = (formData: CreateClientRequest) => {
    if (!client) {
      return;
    }

    const clientData: UpdateClientRequest = formData;
    updateClientMutation.mutate(
      { clientId: client.id, clientData },
      {
        onSuccess: () => {
          toast.success('Cliente atualizado');
          setShowEditModal(false);
        },
        onError: () => toast.error('Erro ao atualizar'),
      },
    );
  };

  const handleDeleteClient = () => {
    if (!client) {
      return;
    }

    deleteClientMutation.mutate(client.id, {
      onSuccess: () => {
        toast.success('Cliente excluído');
        navigate('/clients');
      },
      onError: () => toast.error('Erro ao excluir'),
    });
  };

  if (isLoading) {
    return (
      <section className="client-detail-page">
        <p className="client-detail-page__status">Carregando cliente...</p>
      </section>
    );
  }

  if (isError || !client) {
    return (
      <section className="client-detail-page">
        <p className="client-detail-page__status">Não foi possível carregar o cliente.</p>
        <Button
          type="button"
          variant="ghost"
          className="client-detail-page__back-button"
          onClick={() => navigate('/clients')}
        >
          Voltar para clientes
        </Button>
      </section>
    );
  }

  return (
    <section className="client-detail-page">
      <div className="client-detail-page__top">
        <Button
          type="button"
          variant="ghost"
          className="client-detail-page__back-button"
          onClick={() => navigate('/clients')}
        >
          <span className="client-detail-page__back-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M8.75 3.5L5.25 7L8.75 10.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Voltar para clientes
        </Button>
      </div>

      <header className="client-detail-page__header">
        <div className="client-detail-page__actions">
          <Button
            type="button"
            variant="outline"
            className="client-detail-page__action-button"
            onClick={() => setShowEditModal(true)}
          >
            Editar cliente
          </Button>
          <Button
            type="button"
            variant="outlineDanger"
            className="client-detail-page__action-button client-detail-page__action-button--danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Excluir cliente
          </Button>
          <Button
            type="button"
            variant={clientIsSelected ? 'primary' : 'outline'}
            className={`client-detail-page__action-button ${
              clientIsSelected ? 'client-detail-page__action-button--selected' : ''
            }`}
            onClick={handleSelectClient}
          >
            {clientIsSelected ? 'Remover seleção' : 'Selecionar cliente'}
          </Button>
        </div>
      </header>

      <div className="client-detail-page__grid">
        <article className="client-detail-card">
          <div className="client-detail-card__heading">
            <p className="client-detail-page__eyebrow">Detalhes do cliente</p>
            <h1 className="client-detail-page__title">{client.name}</h1>
          </div>
          <p className="client-detail-card__eyebrow">Resumo financeiro</p>
          <dl className="client-detail-card__metrics">
            <div>
              <dt>Salário</dt>
              <dd>{formatCurrency(client.salary)}</dd>
            </div>
            <div>
              <dt>Receita potencial</dt>
              <dd>{formatCurrency(client.companyValuation)}</dd>
            </div>
          </dl>
        </article>

        <article className="client-detail-card">
          <p className="client-detail-card__eyebrow">Atividade</p>
          <dl className="client-detail-card__metrics">
            <div>
              <dt>Total de acessos</dt>
              <dd>{String(client.accessCount)}</dd>
            </div>
            <div>
              <dt>Cadastrado em</dt>
              <dd>{formatLongDate(client.createdAt)}</dd>
            </div>
            <div>
              <dt>Última atualização</dt>
              <dd>{formatLongDate(client.updatedAt)}</dd>
            </div>
          </dl>
        </article>
      </div>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Editar cliente:">
        <ClientForm
          defaultValues={{
            name: client.name,
            salary: client.salary,
            companyValuation: client.companyValuation,
          }}
          onSubmit={handleUpdateClient}
          loading={updateClientMutation.isPending}
          submitLabel="Salvar alterações"
        />
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir cliente:"
        className="app-modal--delete"
      >
        <p className="app-modal__delete-text">
          Você está prestes a excluir o cliente: <strong>{client.name}</strong>
        </p>
        <Button
          type="button"
          className="app-modal__submit app-modal__submit--delete"
          onClick={handleDeleteClient}
          loading={deleteClientMutation.isPending}
        >
          Excluir cliente
        </Button>
      </Modal>
    </section>
  );
}

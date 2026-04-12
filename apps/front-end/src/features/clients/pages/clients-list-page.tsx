import { useState } from 'react';
import type { Client, CreateClientRequest, UpdateClientRequest } from '@teddy-open-finance/contracts';
import toast from 'react-hot-toast';
import { Button } from '../../../shared/ui/button';
import { Card } from '../../../shared/ui/card';
import { Modal } from '../../../shared/ui/modal';
import { ClientForm } from '../components/client-form';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '../hooks/use-clients';

export function ClientsListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useClients(page);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleCreate = (formData: CreateClientRequest) => {
    createClient.mutate(formData, {
      onSuccess: () => {
        toast.success('Cliente criado');
        setShowCreate(false);
      },
      onError: () => toast.error('Erro ao criar cliente'),
    });
  };

  const handleUpdate = (formData: CreateClientRequest) => {
    if (!editingClient) return;
    const updateData: UpdateClientRequest = formData;
    updateClient.mutate(
      { id: editingClient.id, data: updateData },
      {
        onSuccess: () => {
          toast.success('Cliente atualizado');
          setEditingClient(null);
        },
        onError: () => toast.error('Erro ao atualizar'),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    deleteClient.mutate(id, {
      onSuccess: () => toast.success('Cliente excluído'),
      onError: () => toast.error('Erro ao excluir'),
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
        <Button onClick={() => setShowCreate(true)}>+ Novo cliente</Button>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : !data?.data.length ? (
        <p className="text-slate-500">Nenhum cliente cadastrado.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((client) => (
              <Card key={client.id} className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Salário: {formatCurrency(client.salary)}</p>
                  <p>Empresa: {formatCurrency(client.companyValuation)}</p>
                  <p className="text-xs text-slate-400">Acessos: {client.accessCount}</p>
                </div>
                <div className="mt-auto flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1 text-xs"
                    onClick={() => setEditingClient(client)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1 text-xs"
                    onClick={() => handleDelete(client.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-600">
                Página {data.page} de {data.totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Novo cliente">
        <ClientForm onSubmit={handleCreate} loading={createClient.isPending} submitLabel="Criar" />
      </Modal>

      <Modal
        open={!!editingClient}
        onClose={() => setEditingClient(null)}
        title="Editar cliente"
      >
        {editingClient && (
          <ClientForm
            defaultValues={{
              name: editingClient.name,
              salary: editingClient.salary,
              companyValuation: editingClient.companyValuation,
            }}
            onSubmit={handleUpdate}
            loading={updateClient.isPending}
          />
        )}
      </Modal>
    </div>
  );
}

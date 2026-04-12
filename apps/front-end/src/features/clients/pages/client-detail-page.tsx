import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { useClient } from '../hooks/use-clients';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading } = useClient(id as string);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (isLoading) return <p className="text-slate-500">Carregando...</p>;
  if (!client) return <p className="text-slate-500">Cliente não encontrado.</p>;

  return (
    <div className="mx-auto max-w-lg">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        &larr; Voltar
      </Button>
      <Card>
        <h1 className="mb-4 text-2xl font-bold text-slate-900">{client.name}</h1>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Salário</dt>
            <dd className="font-medium">{formatCurrency(client.salary)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Valor da empresa</dt>
            <dd className="font-medium">{formatCurrency(client.companyValuation)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Acessos</dt>
            <dd className="font-medium text-orange-500">{client.accessCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Criado em</dt>
            <dd>{formatDate(client.createdAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Atualizado em</dt>
            <dd>{formatDate(client.updatedAt)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

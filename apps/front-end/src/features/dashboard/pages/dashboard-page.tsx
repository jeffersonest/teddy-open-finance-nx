import { Card } from '../../../shared/ui/card';
import { useClients } from '../../clients/hooks/use-clients';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { data: clientsPage, isLoading } = useClients(1, 16);
  const navigate = useNavigate();

  const clients = clientsPage?.data ?? [];
  const totalClients = clientsPage?.total ?? 0;
  const totalSalary = clients.reduce(
    (salaryAccumulator, client) => salaryAccumulator + client.salary,
    0
  );
  const totalValuation = clients.reduce(
    (valuationAccumulator, client) => valuationAccumulator + client.companyValuation,
    0
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);

  const chartData = clients
    .slice(0, 10)
    .map((client) => ({
      name: client.name.length > 12 ? client.name.slice(0, 12) + '...' : client.name,
      salary: client.salary,
      valuation: client.companyValuation,
    }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total de clientes</p>
          <p className="text-3xl font-bold text-slate-900">{totalClients}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Soma salários</p>
          <p className="text-3xl font-bold text-orange-500">{formatCurrency(totalSalary)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Soma valuations</p>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalValuation)}</p>
        </Card>
      </div>

      {!isLoading && chartData.length > 0 && (
        <Card className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Últimos clientes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(value))
                }
              />
              <Bar dataKey="salary" fill="#f97316" name="Salário" />
              <Bar dataKey="valuation" fill="#334155" name="Empresa" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {!isLoading && clients.length > 0 && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Últimos clientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Salário</th>
                  <th className="py-2 pr-4">Empresa</th>
                  <th className="py-2">Acessos</th>
                </tr>
              </thead>
              <tbody>
                {clients.slice(0, 5).map((client) => (
                  <tr
                    key={client.id}
                    className="cursor-pointer border-b hover:bg-slate-50"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="py-2 pr-4 font-medium">{client.name}</td>
                    <td className="py-2 pr-4">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(client.salary)}
                    </td>
                    <td className="py-2 pr-4">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(client.companyValuation)}
                    </td>
                    <td className="py-2">{client.accessCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

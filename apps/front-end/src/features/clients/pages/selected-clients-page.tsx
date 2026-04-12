import { Card } from '../../../shared/ui/card';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';

export function SelectedClientsPage() {
  const selectedClients = useSelectedClientsStore((state) => state.clients);
  const removeSelectedClient = useSelectedClientsStore((state) => state.removeClient);
  const clearSelectedClients = useSelectedClientsStore((state) => state.clearAll);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div>
      <h1 className="mb-6 text-lg font-bold text-slate-900">Clientes selecionados:</h1>

      {selectedClients.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum cliente selecionado.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {selectedClients.map((client) => (
              <Card key={client.id} className="flex flex-col items-center text-center">
                <h3 className="text-base font-bold text-slate-900">{client.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Salário: {formatCurrency(client.salary)}
                </p>
                <p className="text-sm text-slate-500">
                  Empresa: {formatCurrency(client.companyValuation)}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => removeSelectedClient(client.id)}
                    className="text-orange-500 transition-colors hover:text-orange-700"
                    aria-label={`Remover ${client.name}`}
                  >
                    <MinusIcon />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={clearSelectedClients}
              className="w-full max-w-2xl rounded border border-orange-500 px-4 py-3 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-50"
            >
              Limpar clientes selecionados
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MinusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

import { formatCurrency } from '../../../shared/lib/formatters';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';
import { Button } from '../../../shared/ui/button';

export function SelectedClientsPage() {
  const selectedClients = useSelectedClientsStore((state) => state.clients);
  const removeSelectedClient = useSelectedClientsStore((state) => state.removeClient);
  const clearSelectedClients = useSelectedClientsStore((state) => state.clearAll);

  return (
    <section className="selected-clients-page">
      <h1 className="selected-clients-page__title">Clientes selecionados:</h1>

      {selectedClients.length === 0 ? (
        <p className="clients-page__empty">Nenhum cliente selecionado.</p>
      ) : (
        <>
          <div className="selected-clients-grid">
            {selectedClients.map((client) => (
              <article key={client.id} className="selected-client-card">
                <h2 className="selected-client-card__name">{client.name}</h2>
                <p className="selected-client-card__line">
                  Salário: {formatCurrency(client.salary)}
                </p>
                <p className="selected-client-card__line">
                  Empresa: {formatCurrency(client.companyValuation)}
                </p>
                <div className="selected-client-card__actions">
                  <button
                    type="button"
                    onClick={() => removeSelectedClient(client.id)}
                    className="selected-client-card__remove"
                    aria-label={`Remover ${client.name}`}
                  >
                    <img src="/reference-assets/--icon.svg" alt="" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={clearSelectedClients}
            className="clients-page__create-button"
          >
            Limpar clientes selecionados
          </Button>
        </>
      )}
    </section>
  );
}

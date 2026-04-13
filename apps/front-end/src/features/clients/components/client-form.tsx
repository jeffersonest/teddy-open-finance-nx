import { useForm } from 'react-hook-form';
import type { CreateClientRequest } from '@teddy-open-finance/contracts';

interface ClientFormProps {
  defaultValues?: Partial<CreateClientRequest>;
  onSubmit: (data: CreateClientRequest) => void;
  loading?: boolean;
  submitLabel?: string;
}

interface ClientFormData {
  name: string;
  salary: string;
  companyValuation: string;
}

export function ClientForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = 'Salvar',
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      salary: formatCurrencyFromNumber(defaultValues?.salary),
      companyValuation: formatCurrencyFromNumber(defaultValues?.companyValuation),
    },
  });

  const handleValidSubmit = (formData: ClientFormData) => {
    onSubmit({
      name: formData.name.trim(),
      salary: parseCurrencyValue(formData.salary),
      companyValuation: parseCurrencyValue(formData.companyValuation),
    });
  };

  return (
    <form className="app-modal__form" onSubmit={handleSubmit(handleValidSubmit)}>
      <div className="app-modal__field">
        <input
          className={`app-modal__input ${errors.name ? 'app-modal__input--error' : ''}`}
          id="client-name"
          placeholder="Digite o nome:"
          {...register('name', {
            required: 'Informe o nome do cliente.',
            minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres.' },
          })}
        />
        <p className="app-modal__field-error">{errors.name?.message}</p>
      </div>
      <div className="app-modal__field">
        <input
          className={`app-modal__input ${errors.salary ? 'app-modal__input--error' : ''}`}
          id="client-salary"
          placeholder="Digite o salário:"
          {...register('salary', {
            required: 'Informe o salário.',
            validate: (inputValue) => parseCurrencyValue(inputValue) > 0 || 'Informe um salário válido.',
            onChange: (event) => {
              const inputElement = event.target as HTMLInputElement;
              inputElement.value = formatCurrencyMask(inputElement.value);
            },
          })}
        />
        <p className="app-modal__field-error">{errors.salary?.message}</p>
      </div>
      <div className="app-modal__field">
        <input
          className={`app-modal__input ${errors.companyValuation ? 'app-modal__input--error' : ''}`}
          id="client-company-value"
          placeholder="Digite o valor da empresa:"
          {...register('companyValuation', {
            required: 'Informe o valor da empresa.',
            validate: (inputValue) =>
              parseCurrencyValue(inputValue) > 0 || 'Informe um valor de empresa válido.',
            onChange: (event) => {
              const inputElement = event.target as HTMLInputElement;
              inputElement.value = formatCurrencyMask(inputElement.value);
            },
          })}
        />
        <p className="app-modal__field-error">{errors.companyValuation?.message}</p>
      </div>
      <button className="app-modal__submit" type="submit" disabled={loading}>
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
}

function parseCurrencyValue(inputValue: string) {
  const digitsOnly = inputValue.replace(/\D/g, '');

  if (digitsOnly.length === 0) {
    return 0;
  }

  const parsedValue = Number.parseInt(digitsOnly, 10) / 100;

  if (Number.isNaN(parsedValue)) {
    return 0;
  }

  return parsedValue;
}

function formatCurrencyMask(inputValue: string) {
  const digitsOnly = inputValue.replace(/\D/g, '');

  if (digitsOnly.length === 0) {
    return '';
  }

  const integerValue = Number.parseInt(digitsOnly, 10);
  const valueInReais = integerValue / 100;

  if (Number.isNaN(valueInReais)) {
    return '';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInReais);
}

function formatCurrencyFromNumber(rawValue?: number) {
  if (!rawValue || rawValue <= 0) {
    return '';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(rawValue);
}

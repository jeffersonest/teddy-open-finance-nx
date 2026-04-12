import { useForm } from 'react-hook-form';
import type { CreateClientRequest } from '@teddy-open-finance/contracts';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';

interface ClientFormProps {
  defaultValues?: Partial<CreateClientRequest>;
  onSubmit: (data: CreateClientRequest) => void;
  loading?: boolean;
  submitLabel?: string;
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
  } = useForm<CreateClientRequest>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="client-name"
        label="Nome"
        placeholder="Nome do cliente"
        error={errors.name?.message}
        {...register('name', {
          required: 'Nome obrigatório',
          minLength: { value: 2, message: 'Mínimo 2 caracteres' },
        })}
      />
      <Input
        id="client-salary"
        label="Salário"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.salary?.message}
        {...register('salary', {
          required: 'Salário obrigatório',
          valueAsNumber: true,
          min: { value: 0, message: 'Deve ser positivo' },
        })}
      />
      <Input
        id="client-valuation"
        label="Valor da empresa"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.companyValuation?.message}
        {...register('companyValuation', {
          required: 'Valor obrigatório',
          valueAsNumber: true,
          min: { value: 0, message: 'Deve ser positivo' },
        })}
      />
      <Button type="submit" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}

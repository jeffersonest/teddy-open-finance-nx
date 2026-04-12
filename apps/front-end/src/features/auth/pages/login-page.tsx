import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Card } from '../../../shared/ui/card';
import { useLogin, useRegister } from '../hooks/use-login';

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  name: string;
  password: string;
}

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Teddy Open Finance</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isRegister ? 'Crie sua conta' : 'Acesse sua conta'}
          </p>
        </div>

        {isRegister ? (
          <RegisterForm onToggle={() => setIsRegister(false)} />
        ) : (
          <LoginForm onToggle={() => setIsRegister(true)} />
        )}
      </Card>
    </main>
  );
}

function LoginForm({ onToggle }: { onToggle: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const login = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onError: () => toast.error('Email ou senha inválidos'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register('email', { required: 'Email obrigatório' })}
      />
      <Input
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••"
        error={errors.password?.message}
        {...register('password', { required: 'Senha obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
      />
      <Button type="submit" loading={login.isPending}>
        Entrar
      </Button>
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-orange-500 hover:underline"
      >
        Não tem conta? Cadastre-se
      </button>
    </form>
  );
}

function RegisterForm({ onToggle }: { onToggle: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Conta criada! Faça login.');
        onToggle();
      },
      onError: () => toast.error('Erro ao criar conta. Email já cadastrado?'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="name"
        label="Nome"
        placeholder="Seu nome"
        error={errors.name?.message}
        {...register('name', { required: 'Nome obrigatório', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
      />
      <Input
        id="reg-email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register('email', { required: 'Email obrigatório' })}
      />
      <Input
        id="reg-password"
        label="Senha"
        type="password"
        placeholder="••••••"
        error={errors.password?.message}
        {...register('password', { required: 'Senha obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
      />
      <Button type="submit" loading={registerMutation.isPending}>
        Cadastrar
      </Button>
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-orange-500 hover:underline"
      >
        Já tem conta? Faça login
      </button>
    </form>
  );
}

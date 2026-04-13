import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
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
    <main className="login-page">
      <div className="login-page__content">
        <h1 className="login-page__title">Olá, seja bem-vindo!</h1>

        {isRegister ? (
          <RegisterForm onToggle={() => setIsRegister(false)} />
        ) : (
          <LoginForm onToggle={() => setIsRegister(true)} />
        )}
      </div>
    </main>
  );
}

function LoginForm({ onToggle }: { onToggle: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const loginMutation = useLogin();

  const onSubmit = (formData: LoginFormData) => {
    loginMutation.mutate(formData, {
      onError: () => toast.error('Email ou senha inválidos'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-page__form">
      <Input
        id="email"
        type="email"
        placeholder="Digite o seu email:"
        className="login-page__input"
        error={errors.email?.message}
        {...register('email', { required: 'Email obrigatório' })}
      />
      <Input
        id="password"
        type="password"
        placeholder="Digite a sua senha:"
        className="login-page__input"
        error={errors.password?.message}
        {...register('password', {
          required: 'Senha obrigatória',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        })}
      />
      <Button type="submit" loading={loginMutation.isPending} className="login-page__submit">
        Entrar
      </Button>
      <button
        type="button"
        onClick={onToggle}
        className="login-page__toggle"
      >
        Não tem conta? Cadastre-se
      </button>
    </form>
  );
}

function RegisterForm({ onToggle }: { onToggle: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const registerMutation = useRegister();

  const onSubmit = (formData: RegisterFormData) => {
    registerMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Conta criada! Faça login.');
        onToggle();
      },
      onError: () => toast.error('Erro ao criar conta. Email já cadastrado?'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-page__form">
      <Input
        id="name"
        placeholder="Digite o seu nome:"
        className="login-page__input"
        error={errors.name?.message}
        {...register('name', {
          required: 'Nome obrigatório',
          minLength: { value: 2, message: 'Mínimo 2 caracteres' },
        })}
      />
      <Input
        id="reg-email"
        type="email"
        placeholder="Digite o seu email:"
        className="login-page__input"
        error={errors.email?.message}
        {...register('email', { required: 'Email obrigatório' })}
      />
      <Input
        id="reg-password"
        type="password"
        placeholder="Digite a sua senha:"
        className="login-page__input"
        error={errors.password?.message}
        {...register('password', {
          required: 'Senha obrigatória',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        })}
      />
      <Button type="submit" loading={registerMutation.isPending} className="login-page__submit">
        Cadastrar
      </Button>
      <button
        type="button"
        onClick={onToggle}
        className="login-page__toggle"
      >
        Já tem conta? Faça login
      </button>
    </form>
  );
}

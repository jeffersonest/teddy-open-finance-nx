# Front-end (`@teddy-open-finance/front-end`)

SPA React para login e gestão de clientes (listagem, criação, edição, exclusão e seleção).

## Stack

- React 19 + Vite
- React Router 6
- React Query
- Zustand
- Tailwind CSS

## Setup

1. Copie o arquivo de ambiente:

```bash
cp apps/front-end/.env.example apps/front-end/.env
```

2. Ajuste `VITE_API_URL` para a URL da API.

## Rodar local

```bash
npx nx serve front-end
```

- App: `http://localhost:4200`

## Comandos úteis

- Build:

```bash
npx nx build front-end
```

- Testes unitários:

```bash
npx nx test front-end
```

- E2E do front:

```bash
npx nx e2e front-end-e2e
```

## Fluxos principais

- Login/autenticação com persistência de sessão
- Lista paginada de clientes com ações de editar/excluir/selecionar
- Modais de criar/editar/excluir
- Tela de clientes selecionados com remoção e limpeza total

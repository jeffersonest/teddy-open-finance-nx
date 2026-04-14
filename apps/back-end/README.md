# Back-end (`@teddy-open-finance/back-end`)

API NestJS responsável por autenticação (JWT), usuários e CRUD de clientes.

## Stack

- NestJS 11
- TypeORM 0.3
- PostgreSQL
- Swagger
- Pino (logs)

## Setup

1. Copie o arquivo de ambiente:

```bash
cp apps/back-end/.env.example apps/back-end/.env
```

2. Garanta um PostgreSQL acessível com os parâmetros do `.env`.

## Rodar local

```bash
npx nx serve back-end
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Health: `http://localhost:3000/health`
- Metrics: `http://localhost:3000/metrics`

## Comandos úteis

- Build:

```bash
npx nx build back-end
```

- Testes unitários:

```bash
npx nx test back-end
```

- E2E da API:

```bash
npx nx e2e back-end-e2e
```

- Executar migrations:

```bash
npx nx run @teddy-open-finance/back-end:migrate:run
```

- Seed de clientes:

```bash
npx nx run @teddy-open-finance/back-end:seed:clients
```

## Variáveis principais

Veja `apps/back-end/.env.example`. Campos críticos:

- `DATABASE_*`
- `JWT_*`
- `DATABASE_RUN_MIGRATIONS`
- `LOG_*`

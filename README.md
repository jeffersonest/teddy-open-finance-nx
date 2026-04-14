# Teddy Open Finance

Monorepo Nx com MVP full-stack para gestão de clientes, com autenticação JWT, CRUD, UI React e pipeline de deploy para produção.

## Stack

- Front-end: React 19 + Vite + TypeScript + Tailwind
- Back-end: NestJS 11 + TypeORM + PostgreSQL
- Monorepo: Nx (apps + libs compartilhadas)
- Contratos: `@teddy-open-finance/contracts`

## Estrutura

```text
apps/
  back-end/        API NestJS
  back-end-e2e/    E2E da API
  front-end/       SPA React
  front-end-e2e/   E2E do front
libs/
  shared/contracts Tipos e contratos compartilhados
docs/
  production-deploy.md
```

## Pré-requisitos

- Node.js 24+
- npm 10+
- Docker + Docker Compose (para stack completa)

## Como rodar local

1. Instale dependências:

```bash
npm install
```

2. Suba API e front em terminais separados:

```bash
npx nx serve back-end
npx nx serve front-end
```

3. Endpoints locais:

- Front-end: `http://localhost:4200`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

## Qualidade e testes

- Gate principal:

```bash
npm run ci:quality
```

- Gate de deploy (E2E críticos):

```bash
npm run ci:deploy-gate
```

## Banco e migrations

- Rodar migrations manualmente:

```bash
npx nx run @teddy-open-finance/back-end:migrate:run
```

- Seed de clientes:

```bash
npx nx run @teddy-open-finance/back-end:seed:clients
```

## Deploy e release

- Fluxo: feature/fix -> `develop` -> release PR `develop -> main`
- Deploy de produção: workflow `Deploy Production`
- Guia completo: `docs/production-deploy.md`

## Documentação por app

- API: `apps/back-end/README.md`
- Front-end: `apps/front-end/README.md`

## Memória do projeto

Para contexto arquitetural e decisões, consulte `MEMORY_PALACE.md` (arquivo local de trabalho, não versionado no git).

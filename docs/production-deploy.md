# Production Deploy

## Domains

- `app.digai.chat` for the frontend
- `api.digai.chat` for the backend
- `grafana.digai.chat` for observability

## GitHub Actions

The repository now expects two workflows:

- `CI`: runs `nx affected -t lint typecheck test build`
- `Deploy Production`: builds the apps, publishes Docker images to GHCR and deploys the stack to the VPS

## Required GitHub Secrets

- `PROD_VPS_HOST`
- `PROD_VPS_SSH_KEY`
- `PROD_DATABASE_USER`
- `PROD_DATABASE_PASSWORD`
- `PROD_DATABASE_NAME`
- `PROD_JWT_SECRET`
- `PROD_JWT_EXPIRES_IN`
- `PROD_JWT_REFRESH_SECRET`
- `PROD_JWT_REFRESH_EXPIRES_IN`
- `PROD_LOG_LEVEL`
- `PROD_GRAFANA_ADMIN_USER`
- `PROD_GRAFANA_ADMIN_PASSWORD`
- `PROD_GHCR_USERNAME`
- `PROD_GHCR_TOKEN`

`PROD_GHCR_TOKEN` needs `read:packages` so the VPS can pull images from GHCR.

## VPS Layout

- Deploy root: `/opt/teddy-open-finance`
- Legacy stack to remove on first deploy: `/opt/oraculo`

The deploy script removes the old `oraculo` stack when `CLEAN_LEGACY_STACK=true` is set in the production `.env`.

## Stack

- `caddy` terminates TLS and routes traffic
- `frontend` serves the React build
- `backend-1` and `backend-2` run the Nest API behind Caddy load balancing
- `postgres` stores application data
- `prometheus` scrapes `/metrics`
- `loki` and `promtail` centralize container logs
- `grafana` provisions datasources and the initial dashboard automatically

#!/usr/bin/env bash

set -euo pipefail

deploy_root="${DEPLOY_ROOT:-/opt/teddy-open-finance}"
legacy_root="${LEGACY_ROOT:-/opt/oraculo}"

if [[ ! -f "${deploy_root}/.env" ]]; then
  echo "Missing ${deploy_root}/.env"
  exit 1
fi

set -a
source "${deploy_root}/.env"
set +a

if [[ "${CLEAN_LEGACY_STACK:-false}" == "true" && -f "${legacy_root}/docker-compose.yaml" ]]; then
  docker compose -f "${legacy_root}/docker-compose.yaml" down --remove-orphans --volumes || true
  docker ps -aq --filter label=com.docker.compose.project=oraculo | xargs -r docker rm -f
  docker volume ls -q --filter label=com.docker.compose.project=oraculo | xargs -r docker volume rm -f
  docker network ls -q --filter label=com.docker.compose.project=oraculo | xargs -r docker network rm
  rm -rf "${legacy_root}"
fi

if [[ -n "${GHCR_USERNAME:-}" && -n "${GHCR_TOKEN:-}" ]]; then
  printf '%s' "${GHCR_TOKEN}" | docker login ghcr.io --username "${GHCR_USERNAME}" --password-stdin
fi

cd "${deploy_root}"

pullable_services=(
  frontend
  backend-1
  backend-2
  postgres
  prometheus
  loki
  promtail
  grafana
)

docker compose --env-file .env pull "${pullable_services[@]}"
docker compose --env-file .env build caddy
docker compose --env-file .env up -d --remove-orphans

for service_name in backend-1 backend-2; do
  for attempt in $(seq 1 20); do
    if docker compose --env-file .env exec -T "${service_name}" node -e "fetch('http://127.0.0.1:3000/healthz').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"; then
      break
    fi

    if [[ "${attempt}" -eq 20 ]]; then
      echo "Healthcheck failed for ${service_name}"
      docker compose --env-file .env logs --tail=80 "${service_name}"
      exit 1
    fi

    sleep 5
  done
done

required_migrations="${REQUIRED_MIGRATIONS_COUNT:-3}"
applied_migrations="$(
  docker compose --env-file .env exec -T postgres psql -U "${DATABASE_USER}" -d "${DATABASE_NAME}" -Atc \
    "SELECT count(*) FROM migrations;"
)"

if [[ ! "${applied_migrations}" =~ ^[0-9]+$ ]]; then
  echo "Unable to parse migrations count: ${applied_migrations}"
  exit 1
fi

if (( applied_migrations < required_migrations )); then
  echo "Expected at least ${required_migrations} registered migrations, found ${applied_migrations}"
  docker compose --env-file .env logs --tail=120 backend-1 backend-2 postgres
  exit 1
fi

docker compose --env-file .env ps

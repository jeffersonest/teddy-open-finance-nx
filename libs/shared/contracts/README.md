# @teddy-open-finance/contracts

Tipos compartilhados entre **front-end** e **back-end** que descrevem o **wire format** da API HTTP.

Esta lib é a única com tag `scope:cross` — qualquer outro projeto do workspace pode importar dela, e ela não pode importar de ninguém. Por isso é **TS puro**: zero dependência de React, NestJS, `class-validator`, runtime de Node, etc.

## Por que existe

Centralizar os tipos da API num único lugar significa que mudar uma interface (ex.: adicionar um campo em `Client`) **quebra a build** dos dois lados se algum deles esquecer de atualizar. É a versão mais barata de "API contract testing": o próprio TypeScript faz o trabalho.

```ts
// apps/back-end/.../api/dto/client.response.dto.ts
import type { Client } from '@teddy-open-finance/contracts';
export class ClientResponseDto implements Client { /* ... */ }

// libs/front-end/clients/data-access/.../use-clients.ts
import type { Client, Paginated } from '@teddy-open-finance/contracts';
const useClients = (): UseQueryResult<Paginated<Client>> => /* ... */;
```

## Convenções

- **Datas são `string` (ISO 8601)**, não `Date`. Esta lib descreve o que trafega via JSON, não o objeto de domínio.
- **Um arquivo por interface**, agrupado por domínio (`clients/`, `auth/`, `shared/`).
- **Cada domínio tem seu `index.ts`** (barrel) re-exportando tudo. O `src/index.ts` raiz re-exporta os domínios.
- **Único entry point público**: `import { ... } from '@teddy-open-finance/contracts'`. Não exponha subpaths.

## Como adicionar um novo contrato

1. Identifique o domínio (`clients`, `auth`, `shared`) ou crie um novo (`reports`, etc.)
2. Crie o arquivo `kebab-case.ts` com **uma** interface
3. Adicione `export * from './nome-do-arquivo.js';` no `index.ts` do domínio
4. Se for domínio novo, adicione `export * from './lib/<dominio>/index.js';` no `src/index.ts` raiz

> Lembre-se: o `.js` no import é intencional. ESM com `module: nodenext` exige extensão explícita mesmo apontando pra arquivos `.ts`.

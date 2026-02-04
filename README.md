# Monorepo Template (pnpm workspaces)

Minimal monorepo using pnpm workspaces with a Next.js web app, a NestJS API, and a shared TypeScript package.

## Tech Stack
- pnpm workspaces
- TypeScript
- Next.js 16.1.6 + React 19.2.4 — `apps/web`
- NestJS — `apps/api`
- Swagger (OpenAPI) — `/docs`
- Shared package — `packages/shared`

## Structure
```
.
├─ apps/
│  ├─ web/         # Next.js 14 + TypeScript
│  └─ api/         # NestJS + TypeScript
├─ packages/
│  └─ shared/      # shared TypeScript utilities/types
├─ pnpm-workspace.yaml
├─ package.json
└─ tsconfig.base.json
```

## Prerequisites
- Node.js 20.9+ (per current Next.js requirements)
- pnpm 9+

## Install
```
pnpm install
```

## Dev
Run both apps:
```
pnpm dev
```

Run individually:
```
pnpm dev:web
pnpm dev:api
```

## Build
Build shared, then api, then web:
```
pnpm build
```

## URLs
- Web: http://localhost:3000
- API: http://localhost:3001
- API Health: http://localhost:3001/health
- Swagger UI: http://localhost:3001/docs

## Shared Package
The shared package is published in-workspace as `@app/shared` and can be imported from both apps:
```
import { hello, type User } from "@app/shared";
```

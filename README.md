# group-events

Monorepo for a group events management app.

## Structure

```
group-events/
├── client/          # React + Vite + TypeScript frontend
├── server/          # NestJS backend
├── package.json     # Root workspace scripts
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js >= 20
- pnpm
- PostgreSQL (Phase 2+)

## Local development

```powershell
pnpm install
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
pnpm dev
```

- API: http://localhost:3000
- Client: http://localhost:5173

## Phases

This project is built in phases. Phase 1 (monorepo scaffold) is complete.

See the build plan for Phases 2–11 (database, auth, modules, frontend, deployment).

## Environment variables

Documented in `server/.env.example` and `client/.env.example`.

## Deployment

Railway (server) and Vercel (client) — documented in Phase 11.

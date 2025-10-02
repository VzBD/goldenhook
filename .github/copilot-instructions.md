# Copilot instructions for GoldenHook

This repo is a full‑stack e‑commerce app with a hard boundary between frontend (Next.js App Router) and backend (NestJS GraphQL). Follow these conventions to be productive immediately.

## Architecture at a glance
- Frontend: `frontend/` (Next.js 14, TS, MUI, Apollo Client)
  - App Router in `frontend/src/app/**`.
  - GraphQL client configured in `frontend/src/lib/apollo-client.ts` (reads `NEXT_PUBLIC_GRAPHQL_API_URL`).
  - Aliased imports via `@` → `frontend/src` (see `frontend/tsconfig.json` and `frontend/next.config.mjs`).
  - Catalog pages use SSR/ISR and hydrate initial data: `src/app/catalog/page.tsx`, dynamic `src/app/catalog/[category]/page.tsx` (pattern replicated).
  - UI/data layer example: `src/components/CatalogView.tsx` + `src/lib/queries.ts`.
- Backend: `backend/` (NestJS 11, GraphQL Apollo, TypeORM)
  - Product listing with filters/sorting in `backend/src/product/product.service.ts`.
  - Google OAuth strategy in `backend/src/auth/google.strategy.ts` (env‑driven enablement).

## Data flow and contracts
- GraphQL endpoint: `/graphql` exposed by NestJS.
- Key query shapes are in `frontend/src/lib/queries.ts` (e.g., `GET_CATALOG`). Variables include paging and filters: `q, brand, category, priceFrom, priceTo, inStock, sort`.
- SSR fetch for catalog uses POST to GraphQL: see `frontend/src/app/catalog/page.tsx` (server component) passing `initialData` into `CatalogView` (client component). The client keeps URL in sync (querystring + optional category path segment).

## Conventions and patterns
- Imports use `@/…` rooted at `frontend/src`. Ensure both `tsconfig.json` and `next.config.mjs` alias are consistent.
- Next config is ESM. Compute `__dirname` via `fileURLToPath(import.meta.url)`; don’t use bare `__dirname`.
- Public env vars (read at build time):
  - `NEXT_PUBLIC_GRAPHQL_API_URL` (e.g., `https://domain/graphql`) – used by Apollo client and SSR fetches.
  - `NEXT_PUBLIC_API_URL` is reserved for non‑GraphQL HTTP routes (e.g., `/auth/google`).
- Backend env (see `backend/.env.example`): `PORT`, `COOKIE_SECRET`, SMTP/Twilio, Google OAuth, DB settings. In dev SQLite is default.
- URL‑sync in catalog: build URLs as `/catalog` or `/catalog/[category]?q=...&price_from=...&inStock=1&sort=...&page=...`.

## Build, run, deploy (essentials)
- Frontend (from `frontend/`): `npm run dev`, `npm run build`. Production runs as `node .next/standalone/server.js` (Next `output: 'standalone'`).
- Backend (from `backend/`): `npm run start:dev`, `npm run build`, `npm run start:prod`.
- Ensure `frontend/next.config.mjs` contains:
  - `output: 'standalone'`
  - Webpack alias: `config.resolve.alias['@'] = path.resolve(__dirname, 'src')` with ESM‑safe `__dirname`.
- On servers, rebuild after env changes (public Next vars are inlined at build time).

## Testing and debugging hints
- GraphQL Playground: `http://localhost:4000/graphql` (or proxied domain).
- Common build pitfall: `__dirname is not defined` in `next.config.mjs` → fix ESM pattern.
- If runtime can’t resolve `@/…`, verify both TS and Webpack aliases and that build runs from `frontend/`.

## Example changes to follow
- Adding a catalog filter:
  1) Update query and types in `frontend/src/lib/queries.ts` and `CatalogView.tsx` variables.
  2) Extend SSR parse in `src/app/catalog/page.tsx`.
  3) Implement filter in `backend/src/product/product.service.ts` using TypeORM operators.

## Files to read first
- `frontend/next.config.mjs`, `frontend/tsconfig.json`
- `frontend/src/app/catalog/page.tsx`, `frontend/src/components/CatalogView.tsx`, `frontend/src/lib/queries.ts`
- `backend/src/product/product.service.ts`, `backend/src/auth/google.strategy.ts`
- `goldenhook/README.md` for end‑to‑end overview

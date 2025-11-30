# Copilot instructions for GoldenHook

This repo is a full‑stack e‑commerce app with a hard boundary between frontend (Next.js App Router) and backend (NestJS GraphQL). Follow these conventions to be productive immediately.
---

# Инструкции для AI-агентов (RU)

GoldenHook — полнофункциональное e-commerce приложение с чётким разделением фронтенда и бэкенда.

## Архитектура
- **Фронтенд**: `frontend/` (Next.js 14, TypeScript, MUI, Apollo Client)
  - App Router: `frontend/src/app/**`.
  - Apollo Client: `frontend/src/lib/apollo-client.ts` (использует `NEXT_PUBLIC_GRAPHQL_API_URL`).
  - Алиасы: `@` → `frontend/src` (см. `frontend/tsconfig.json`, `frontend/next.config.mjs`).
  - Каталог: SSR/ISR, гидрация данных — `src/app/catalog/page.tsx`, динамический `src/app/catalog/[category]/page.tsx`.
  - UI/data layer: пример — `src/components/CatalogView.tsx` + `src/lib/queries.ts`.
- **Бэкенд**: `backend/` (NestJS 11, GraphQL Apollo, TypeORM)
  - Листинг товаров, фильтры, сортировка: `backend/src/product/product.service.ts`.
  - Google OAuth: `backend/src/auth/google.strategy.ts` (включение через env).
  - Интеграции: Nodemailer (email), Twilio (SMS), Google OAuth (passport).

## Потоки данных и контракты
- GraphQL endpoint: `/graphql` (NestJS).
- Основные формы запросов: `frontend/src/lib/queries.ts` (например, `GET_CATALOG`). Переменные: пагинация, фильтры (`q, brand, category, priceFrom, priceTo, inStock, sort`).
- SSR fetch для каталога: POST к GraphQL, см. `frontend/src/app/catalog/page.tsx` (server component), передача `initialData` в `CatalogView` (client component). Клиент синхронизирует URL (querystring + category path).

## Конвенции и паттерны
- Импорты через `@/…` из `frontend/src`. Алиасы должны совпадать в TS и Webpack.
- Next config — ESM. Для `__dirname` используйте `fileURLToPath(import.meta.url)`.
- Публичные env-переменные (build time):
  - `NEXT_PUBLIC_GRAPHQL_API_URL` — Apollo client и SSR fetch.
  - `NEXT_PUBLIC_API_URL` — для HTTP-роутов (например, `/auth/google`).
- Бэкенд env: см. `backend/.env.example`.
- URL-синхронизация каталога: `/catalog` или `/catalog/[category]?q=...&price_from=...&inStock=1&sort=...&page=...`.
- SSR-cookie для темы (светлая/тёмная), переключатель в шапке.

## Сборка, запуск, деплой
- Фронтенд (`frontend/`):
  - `npm run dev`, `npm run build`.
  - Прод: `node .next/standalone/server.js` (`output: 'standalone'`).
- Бэкенд (`backend/`):
  - `npm run start:dev`, `npm run build`, `npm run start:prod`.
- Важно: rebuild после изменения env (Next public vars инлайнится при билде).

## Тестирование и отладка
- GraphQL Playground: `http://localhost:4000/graphql`.
- Частая ошибка: `__dirname is not defined` в Next config — используйте ESM-паттерн.
- Если не работает алиас `@/…`, проверьте TS и Webpack alias и директорию билда.

## Примеры изменений
- Добавление фильтра каталога:
  1. Обновить query/types в `frontend/src/lib/queries.ts` и `CatalogView.tsx`.
  2. Расширить SSR парсинг в `src/app/catalog/page.tsx`.
  3. Реализовать фильтр в `backend/src/product/product.service.ts` через TypeORM.

## Ключевые файлы для ознакомления
- `frontend/next.config.mjs`, `frontend/tsconfig.json`
- `frontend/src/app/catalog/page.tsx`, `frontend/src/components/CatalogView.tsx`, `frontend/src/lib/queries.ts`
- `backend/src/product/product.service.ts`, `backend/src/auth/google.strategy.ts`
- `goldenhook/README.md` — обзор архитектуры

---

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

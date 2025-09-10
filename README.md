# GoldenHook — интернет‑магазин рыболовных товаров

Полноценное приложение: фронтенд на Next.js (App Router, MUI, Apollo Client), бэкенд на NestJS (GraphQL, TypeORM/SQLite для разработки). Есть аутентификация (активация email/SMS, Google OAuth), роль admin для админки, SSR‑переключение тёмной темы, скелетоны и ленивая загрузка изображений.

## Стек
- Frontend: Next.js 14, React 18, TypeScript, MUI 5, Apollo Client 4
- Backend: NestJS 11, GraphQL (Apollo), TypeORM 0.3, SQLite (dev)
- Интеграции: Nodemailer (email), Twilio (SMS), Google OAuth (passport)
- Auth: cookie‑based, httpOnly (secure в prod), роли, middleware для /admin

## Структура
- frontend/ — клиент (Next.js)
- backend/ — сервер (NestJS)

## Быстрый старт (локально)
1) Установите Node.js LTS (>=18)
2) Установка зависимостей:
   - Перейдите в папку frontend и выполните npm install, затем вернитесь в корень
   - Перейдите в папку backend и выполните npm install, затем вернитесь в корень
3) Настройте переменные окружения:
   - frontend/.env.local: NEXT_PUBLIC_API_URL=http://localhost:3000 или http://localhost:4000 в зависимости от проксирования
   - backend/.env: PORT=4000, COOKIE_SECRET=change_me, SMTP_*, TWILIO_*, GOOGLE_* (см. ниже)
4) Запуск:
   - В одном терминале: перейти в backend и выполнить npm run start:dev (http://localhost:4000)
   - В другом терминале: перейти в frontend и выполнить npm run dev (http://localhost:3000)

Примечания:
- Для разработки почту удобно тестировать через MailHog/Mailpit. Для SMS — заглушка или реальный Twilio.
- GraphQL Playground доступен на http://localhost:4000/graphql

## Основные возможности
- Регистрация/логин, активация email/SMS, восстановление пароля
- Вход через Google
- Роли пользователей; админка доступна только роли admin
- SSR‑cookie для темы (светлая/тёмная), переключатель в шапке
- Каталог, карточки товаров, корзина, чекаут; скелетоны и lazy images

## Команды
Frontend (из папки frontend):
- npm run dev — dev‑сервер
- npm run build — прод‑сборка
- npm start — запуск прод‑сборки

Backend (из папки backend):
- npm run start:dev — dev‑режим
- npm run build — сборка
- npm run start:prod — запуск прод‑сборки

## Конфигурация .env (backend)
- PORT=4000
- COOKIE_SECRET=случайная_строка
- EMAIL_FROM="GoldenHook <no-reply@goldenhook.local>"
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL

## Примечания по разработке
- В dev используется SQLite (файлы БД игнорируются .gitignore)
- httpOnly‑cookie делает secure в проде; локально не обязателен
- Админ создаётся сидом при старте (см. backend/src/app.module.ts)

## Лицензия
Частный репозиторий. Все права защищены.

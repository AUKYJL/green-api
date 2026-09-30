# GREEN-API MAX Chat

Минимальный браузерный клиент для текстовых сообщений MAX через GREEN-API. Он подключается к авторизованному инстансу, открывает чат по номеру, отправляет текст и получает входящие сообщения через HTTP notification queue.

## Стек

React, TypeScript, Vite, Axios, Zustand, React Hook Form, Zod, Vitest и React Testing Library.

## Prerequisites

- Node.js 20+ и npm;
- GREEN-API instance для MAX со статусом `authorized`;
- `apiUrl`, `idInstance` и `apiTokenInstance` этого инстанса;
- для получения сообщений: `webhookUrl` должен быть пустым, а `incomingWebhook` — `yes`.

Приложение только диагностирует настройки входящих сообщений и никогда не вызывает `SetSettings` автоматически. Перед развёртыванием отдельно проверьте, что GREEN-API разрешает запросы с origin вашего статического сайта (CORS); решение о browser-only интеграции описано в [docs/DECISIONS.md](docs/DECISIONS.md).

## Запуск

```bash
npm install
npm run dev
```

Проверки и production build:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Demo flow

1. Откройте приложение и введите `apiUrl`, ID инстанса и API-токен.
2. Подключитесь к инстансу со статусом `authorized`.
3. Убедитесь, что настройки HTTP receiving готовы: пустой `webhookUrl` и `incomingWebhook: yes`.
4. Введите номер пользователя MAX и откройте чат. Поддерживаются номера РФ (11 цифр, начинается с `7`) и Беларуси (12 цифр, начинается с `375`).
5. Отправьте непустое текстовое сообщение. Ответ собеседника появится без обновления страницы через `ReceiveNotification`; после обработки приложение подтверждает его через `DeleteNotification`.

## Ограничения

- Только текстовые личные сообщения; без файлов, голосовых, групп, реакций и истории.
- Сообщения и открытые чаты существуют только в текущей runtime-сессии и пропадают после reload/logout.
- Номер для `CheckAccount` ограничен текущим scope РФ/Беларусь.
- Входящие события обрабатываются только через HTTP `ReceiveNotification`; неподдерживаемые уведомления подтверждаются и не отображаются.
- Реальная browser/CORS-проверка требует отдельного тестового инстанса и production-like static origin.

## Безопасность

Не коммитьте `apiTokenInstance`, ID инстанса или другие реальные credentials. Токен хранится только в памяти браузера: он не записывается в `localStorage` и пропадает после reload/logout. Не вставляйте токен в issues, логи или скриншоты.

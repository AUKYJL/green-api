# GREEN-API MAX Chat

Минимальный браузерный клиент для текстовых сообщений MAX через GREEN-API. Он подключается к авторизованному инстансу, открывает чат по номеру, отправляет текст и получает входящие сообщения через HTTP notification queue.

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


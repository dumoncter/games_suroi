# 🚀 Запуск Suroi в режиме разработки

## Быстрый старт

### 1. Запуск полного dev сервера (клиент + сервер)
```bash
./start-dev-server.sh
```

### 2. Запуск только сервера
```bash
./start-server-only.sh
```

### 3. Проверка статуса
```bash
./check-server.sh
```

## Ручной запуск

### Установка зависимостей
```bash
pnpm install
```

### Запуск в dev режиме
```bash
# Полный запуск (клиент + сервер)
pnpm dev

# Только клиент
pnpm dev:client

# Только сервер
pnpm dev:server
```

## Доступ к игре

- **Клиент (браузер)**: http://127.0.0.1:3000
- **Сервер (API)**: http://127.0.0.1:8000
- **Production**: https://suroi.neonpsh.games

## Диагностика проблем

Если сервер не запускается:

1. **Проверьте статус**: `./check-server.sh`
2. **Установите зависимости**: `pnpm install`
3. **Очистите кэш**: `pnpm fullReinstall`
4. **Проверьте порты**: убедитесь, что 3000 и 8000 свободны

## Логи сервера

Серверные логи выводятся в терминал. Ищите сообщения типа:
- ✅ `Server listening on port 8000`
- ✅ `Game server started`
- ❌ `Port 8000 already in use`

## Остановка сервера

В терминале нажмите `Ctrl+C` для остановки сервера.

## Production деплой

Для деплоя в production используйте скрипты из папки `../prod/`:
```bash
cd ../prod
./deploy-from-dev.sh "Production deploy"
```

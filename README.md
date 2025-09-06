# Suroi Solo Server

## Обзор

Этот репозиторий содержит сервер для одиночных боев Suroi. Он использует общий код из основного репозитория `/var/www/neonpsh.ru/games_portal/suroi`.

## Архитектура

```
server_solo/          # Этот репозиторий (ветка server-solo)
├── server/           # Серверный код (копия из основного репозитория)
├── scripts/          # Скрипты запуска
├── railway.toml      # Конфигурация Railway
├── Dockerfile        # Docker образ
└── nginx.conf        # NGINX конфигурация
```

## Развертывание

### Локально
```bash
./start-solo-server.sh
```

### Production (Railway)
```bash
./git_push_production.sh
```

## Конфигурация

- **Порт**: 8082
- **Режим**: Solo (одиночные бои)
- **Railway URL**: `https://suroi-solo.neonpsh.games`

## Синхронизация с основным репозиторием

При изменениях в основном коде:
1. Обновите основной репозиторий
2. Скопируйте изменения в этот репозиторий
3. Протестируйте
4. Запушьте в ветку `server-solo`

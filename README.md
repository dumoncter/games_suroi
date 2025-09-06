# Suroi Team Server

## Обзор

Этот репозиторий содержит сервер для командных боев Suroi. Он использует общий код из основного репозитория `/var/www/neonpsh.ru/games_portal/suroi`.

## Архитектура

```
server_team/          # Этот репозиторий (ветка server-team)
├── server/           # Серверный код (копия из основного репозитория)
├── scripts/          # Скрипты запуска
├── railway.toml      # Конфигурация Railway
├── Dockerfile        # Docker образ
└── nginx.conf        # NGINX конфигурация
```

## Развертывание

### Локально
```bash
./start-team-server.sh
```

### Production (Railway)
```bash
./git_push_production.sh
```

## Конфигурация

- **Порт**: 8083
- **Режим**: Team (дуо/сквады с ротацией)
- **Railway URL**: `https://suroi-team.neonpsh.games`

## Синхронизация с основным репозиторием

При изменениях в основном коде:
1. Обновите основной репозиторий
2. Скопируйте изменения в этот репозиторий
3. Протестируйте
4. Запушьте в ветку `server-team`

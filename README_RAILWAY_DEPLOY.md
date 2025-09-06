# Развертывание Suroi на Railway

## 🚀 Быстрое развертывание

1. **Push в ветку production:**
   ```bash
   ./git_push_production.sh
   ```

2. **Railway автоматически:**
   - Соберет Docker образ
   - Запустит два сервера (solo:8082 + team:8083)
   - Настроит проксирование через NGINX
   - Предоставит домен `https://suroi.neonpsh.games`

## 📋 Архитектура

### Один Railway сервис с двумя серверами:
- **Solo Battles**: порт 8082
- **Team Battles**: порт 8083

### NGINX маршрутизация:
```
/solo/play → localhost:8082/play (WebSocket)
/team/play → localhost:8083/play (WebSocket)
/api/ → localhost:8082 (API для обоих серверов)
```

## 🔧 Конфигурационные файлы

- `railway.toml` - конфигурация Railway
- `Dockerfile` - Docker образ
- `scripts/start-production.js` - запуск обоих серверов
- `server/config.solo.json` - конфиг соло-сервера
- `server/config.team.json` - конфиг командного сервера
- `nginx.conf` - NGINX прокси

## 🎮 Доступные режимы

После развертывания:
- **Solo Battles**: `https://suroi.neonpsh.games/solo/play`
- **Team Battles**: `https://suroi.neonpsh.games/team/play`

## 📊 Мониторинг

- **Health Check**: `/api/serverInfo`
- **Логи**: Доступны в Railway dashboard
- **Метрики**: RAM, CPU, количество игроков

## 🐛 Устранение неисправностей

### Если `/api/getGame` возвращает 404:
1. Проверьте логи в Railway
2. Убедитесь что оба сервера запустились
3. Проверьте health check endpoint

### Если WebSocket не подключается:
1. Проверьте NGINX конфигурацию
2. Убедитесь что порты 8082/8083 свободны
3. Проверьте клиентскую конфигурацию

## ✅ Готово к развертыванию!

Все файлы настроены для автоматического развертывания на Railway.
При пуше в production ветку Railway сам соберет и запустит оба сервера.

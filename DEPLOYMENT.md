# Развертывание Suroi на Railway

## Подготовка

Проект уже настроен для развертывания на Railway с использованием Docker.

## Инструкции по развертыванию

### 1. Подключение к Railway

1. Перейдите на [Railway.app](https://railway.app)
2. Авторизуйтесь с помощью GitHub аккаунта
3. Нажмите "New Project" → "Deploy from GitHub repo"

### 2. Выбор репозитория

1. Выберите репозиторий `dumoncter/games_suroi`
2. Выберите ветку `production` для развертывания

### 3. Настройка переменных окружения

Добавьте следующие переменные окружения в Railway:

```
NODE_ENV=production
PORT=3000
API_URL=https://your-app-name.up.railway.app/api
```

### 4. Автоматическое развертывание

Railway автоматически:
- Соберет Docker образ используя Dockerfile
- Запустит контейнер
- Настроит домен (например: `your-app-name.up.railway.app`)

## Структура развертывания

### Docker образ
- **Multi-stage build** для оптимизации размера
- **Node.js 20 Bookworm Slim (Debian 12)** как базовый образ (GLIBC 2.36+ для uWebSockets.js)
- **pnpm** для управления зависимостями
- **Production оптимизации** (минификация, сжатие)
- **Системные зависимости** для skia-canvas (fontconfig, cairo, pango, etc.)
- **Nginx** для обслуживания статических файлов с оптимизациями

### Преимущества Nginx:
- **Высокая производительность** при обслуживании статических файлов
- **Gzip сжатие** для уменьшения размера передаваемых данных
- **HTTP кэширование** для улучшения скорости загрузки
- **Rate limiting** для защиты от перегрузок
- **API проксирование** с поддержкой WebSocket
- **CORS заголовки** для клиент-серверного взаимодействия

### Сервисы
- **Клиент** (порт 3000): Static files served by Nginx
- **Сервер** (порт 8000): Node.js с uWebSockets.js
- **API проксирование** настроено через Nginx

### Конфигурация
- `Dockerfile` - инструкции сборки контейнера
- `nginx.conf` - Nginx конфигурация с прокси и кэшированием
- `railway.toml` - конфигурация Railway
- `server/config.production.json` - production конфигурация сервера
- `scripts/start-production.js` - скрипт запуска

## Проверка развертывания

После успешного развертывания:

1. **Главная страница**: `https://your-app-name.up.railway.app`
2. **API эндпоинты**: `https://your-app-name.up.railway.app/api`
3. **WebSocket соединения** работают автоматически

## Мониторинг

Railway предоставляет:
- **Логи приложения** в реальном времени
- **Метрики производительности**
- **Мониторинг здоровья сервиса**

## Обновление

При внесении изменений в `production` ветку:
1. Railway автоматически пересоберет и перезапустит приложение
2. Все изменения будут применены без простоев (zero-downtime deployment)

## Troubleshooting

### Проблемы со сборкой
- **Ошибка libfontconfig.so.1**: Dockerfile уже содержит все необходимые системные зависимости
- **Проблемы с skia-canvas**: Убедитесь что Debian пакеты установлены (fontconfig, cairo, pango)
- **uWebSockets.js ошибки**: Используется Debian 12 (Bookworm) с GLIBC 2.36+
- **GLIBC version errors**: Образ node:20-bookworm-slim имеет совместимую версию GLIBC

### Проблемы с запуском
- Проверьте логи в Railway dashboard
- Убедитесь что все переменные окружения установлены
- Проверьте что порты 3000 и 8000 не конфликтуют
- Убедитесь что CONFIG_FILE указывает на config.production.json
- **Клиент не запускается**: Убедитесь что sirv-cli доступен (перемещен в dependencies)

### Проблемы с производительностью
- Проверьте использование памяти и CPU
- Рассмотрите upgrade плана Railway для больших нагрузок
- Мониторьте WebSocket соединения для игр в реальном времени

### Переменные окружения
```
NODE_ENV=production
PORT=3000
API_URL=https://your-app-name.up.railway.app/api
CONFIG_FILE=config.production.json
```

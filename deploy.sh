#!/bin/bash
# Деплой на GitHub (Railway)

echo "🚀 Деплой на Railway"
echo "==================="

# Проверяем наличие файлов
if [ ! -d "client-dist" ] || [ ! -d "server-dist" ]; then
    echo "❌ Production файлы не найдены. Сначала запустите ./build.sh"
    exit 1
fi

# Проверяем Git
if [ ! -d ".git" ]; then
    echo "❌ Git репозиторий не инициализирован"
    exit 1
fi

# Используем исправленный Dockerfile для Railway
if [ -f "Dockerfile.railway" ]; then
    cp Dockerfile.railway Dockerfile
    echo "✅ Dockerfile исправлен для Railway (WebSocket + сборка)"
    echo "   🔧 Добавлена обработка отсутствующих файлов"
    echo "   🔧 Добавлены fallback конфигурации"
else
    echo "⚠️  Dockerfile.railway не найден, используется стандартный Dockerfile"
fi

# Создаем railway.toml если нет
if [ ! -f "railway.toml" ]; then
    cat > railway.toml << 'EOF'
[build]
builder = "dockerfile"

[deploy]
healthcheckPath = "/api/serverInfo"
restartPolicyType = "ON_FAILURE"
healthcheckTimeout = 300

# WebSocket support
[[tcpProxies]]
applicationPort = 8000
proxyPort = 8000
EOF
    echo "✅ railway.toml создан с WebSocket поддержкой"
fi

# Добавляем файлы
echo "📤 Добавление файлов..."
git add .

# Коммитим
COMMIT_MSG="${1:-Railway deploy $(date +%Y-%m-%d_%H-%M-%S)}"
if git diff --cached --quiet; then
    echo "ℹ️  Нет изменений для коммита"
else
    git commit -m "$COMMIT_MSG"
    echo "✅ Коммит создан: $COMMIT_MSG"
fi

# Пушим
echo "🚀 Пуш на GitHub..."
if git push origin production-build; then
    echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
    echo ""
    echo "⏱️  Railway передеплойт через 2-5 минут"
    echo "🌐 https://gamessuroi-production.up.railway.app"
    echo ""
    echo "💡 Проверить статус в Railway Dashboard:"
    echo "   https://railway.app/dashboard"
else
    echo "❌ Ошибка при пуше"
    echo ""
    echo "🔑 Если проблема с аутентификацией:"
    echo "   1. Создайте токен: https://github.com/settings/tokens"
    echo "   2. export GITHUB_TOKEN=ваш_токен"
    echo "   3. git remote set-url origin https://\$GITHUB_TOKEN@github.com/dumoncter/games_suroi.git"
fi
#!/bin/bash
# Исправление ошибки Docker сборки и передеплой

echo "🔧 Исправление ошибки Docker сборки"
echo "=================================="

cd /var/www/neonpsh.ru/games_portal/suroi/prod

# Проверяем наличие production файлов
if [ ! -d "client-dist" ] || [ ! -d "server-dist" ]; then
    echo "❌ Production файлы не найдены"
    echo "Запустите сначала: ./build.sh"
    exit 1
fi

echo "📝 Коммит: Docker build fix - missing files handling + $(date +%Y-%m-%d_%H-%M-%S)"

# Используем исправленный Dockerfile
if [ -f "Dockerfile.railway" ]; then
    cp Dockerfile.railway Dockerfile
    echo "✅ Исправленный Dockerfile активирован"
    echo "   🔧 Добавлена обработка отсутствующих файлов"
    echo "   🔧 Добавлены fallback конфигурации"
    echo "   🔧 Исправлена ошибка 'not found'"
else
    echo "❌ Dockerfile.railway не найден"
    exit 1
fi

# Создаем базовую конфигурацию если нет
if [ ! -f "server-dist/config.json" ]; then
    echo "📝 Создаем базовую конфигурацию сервера..."
    mkdir -p server-dist
    cat > server-dist/config.json << 'EOF'
{
  "host": "0.0.0.0",
  "port": 8000,
  "maxPlayersPerGame": 80,
  "maxGames": 100
}
EOF
    echo "✅ server-dist/config.json создан"
fi

# Добавляем все файлы
git add .

# Коммитим
git commit -m "Docker build fix - missing files handling + fallback configs" || echo "Нет изменений"

# Пушим
echo "🚀 Пуш на GitHub..."
if git push origin production-build; then
    echo ""
    echo "🎉 ИСПРАВЛЕНИЕ ЗАГРУЖЕНО!"
    echo ""
    echo "⏱️  Railway пересоберет контейнер через 2-5 минут"
    echo ""
    echo "🔍 Что исправлено:"
    echo "  ✅ Ошибка 'not found' при сборке"
    echo "  ✅ Fallback для отсутствующих файлов"
    echo "  ✅ Базовая конфигурация сервера"
    echo "  ✅ Dockerfile с обработкой ошибок"
    echo ""
    echo "🌐 После перестройки протестируйте:"
    echo "   ./test.sh"
else
    echo "❌ Ошибка при пуше"
    echo ""
    echo "🔑 Проверьте GitHub токен или SSH"
fi

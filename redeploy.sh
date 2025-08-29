#!/bin/bash
# Быстрый передеплой для исправления проблем

echo "🔄 Быстрый передеплой Railway"
echo "============================"

cd /var/www/neonpsh.ru/games_portal/suroi/prod

# Проверяем наличие файлов
if [ ! -d "client-dist" ] || [ ! -d "server-dist" ]; then
    echo "❌ Production файлы не найдены. Запустите ./build.sh сначала"
    exit 1
fi

echo "📝 Коммит: Исправление WebSocket + $(date +%Y-%m-%d_%H-%M-%S)"

# Используем правильный Dockerfile
if [ -f "Dockerfile.railway" ]; then
    cp Dockerfile.railway Dockerfile
    echo "✅ Dockerfile для Railway активирован"
fi

# Добавляем все файлы
git add .

# Коммитим
git commit -m "WebSocket fix - Railway optimized Dockerfile + TCP proxy" || echo "Нет изменений"

# Пушим
echo "🚀 Пуш на GitHub..."
if git push origin production-build; then
    echo ""
    echo "🎉 ПЕРЕДЕПЛОЙ ЗАПУЩЕН!"
    echo ""
    echo "⏱️  Railway передеплойт через 2-5 минут"
    echo "🌐 https://gamessuroi-production.up.railway.app"
    echo ""
    echo "📋 Что исправлено:"
    echo "  ✅ Dockerfile с переменной PORT"
    echo "  ✅ TCP прокси для WebSocket (порт 8000)"
    echo "  ✅ Environment переменные"
    echo "  ✅ Health checks"
    echo ""
    echo "🔍 Проверить статус через 5 минут:"
    echo "   ./test.sh"
else
    echo "❌ Ошибка при пуше"
    echo ""
    echo "🔑 Проверьте GitHub токен или SSH"
fi

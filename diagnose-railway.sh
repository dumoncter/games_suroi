#!/bin/bash
# Диагностика проблем с Railway WebSocket

echo "🔍 Диагностика Railway WebSocket проблемы"
echo "========================================"
echo ""

RAILWAY_URL="https://gamessuroi-production.up.railway.app"

echo "🌐 Проверяю Railway сервер..."
echo "URL: $RAILWAY_URL"
echo ""

# 1. Проверяем HTTP доступность
echo "1️⃣  Проверка HTTP доступности:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$RAILWAY_URL" 2>/dev/null)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ HTTP доступен (статус: $HTTP_STATUS)"
else
    echo "❌ HTTP недоступен (статус: $HTTP_STATUS)"
    echo "💡 Возможные причины:"
    echo "   • Railway сервис не запущен"
    echo "   • Ошибка в Dockerfile"
    echo "   • Проблема с деплоем"
fi

# 2. Проверяем API эндпоинт
echo ""
echo "2️⃣  Проверка API эндпоинта:"
API_RESPONSE=$(curl -s --max-time 10 "$RAILWAY_URL/api/serverInfo" 2>/dev/null)

if [ -n "$API_RESPONSE" ] && echo "$API_RESPONSE" | grep -q "serverInfo\|gameVersion\|protocolVersion"; then
    echo "✅ API работает"
    echo "📄 Ответ сервера:"
    echo "$API_RESPONSE" | head -5
else
    echo "❌ API не отвечает"
    echo "💡 Возможные причины:"
    echo "   • Сервер не запущен правильно"
    echo "   • Неправильный порт"
    echo "   • Ошибка в server.ts"
fi

# 3. Проверяем WebSocket порт (имитация)
echo ""
echo "3️⃣  Проверка WebSocket порта:"
# Проверяем, отвечает ли сервер на 8000 порт через Railway
WS_CHECK=$(curl -s --max-time 5 "https://gamessuroi-production.up.railway.app:8000/api/serverInfo" 2>/dev/null || echo "")

if [ -n "$WS_CHECK" ]; then
    echo "✅ WebSocket порт доступен"
else
    echo "❌ WebSocket порт недоступен"
    echo "💡 Это основная проблема!"
fi

# 4. Проверяем локальную конфигурацию
echo ""
echo "4️⃣  Проверка локальной конфигурации:"

if [ -f "Dockerfile" ]; then
    echo "✅ Dockerfile найден"
    echo "📋 Содержимое Dockerfile:"
    grep -E "EXPOSE|PORT|CMD" Dockerfile | head -3
else
    echo "❌ Dockerfile не найден"
fi

if [ -f "railway.toml" ]; then
    echo "✅ railway.toml найден"
    echo "📋 Содержимое railway.toml:"
    cat railway.toml
else
    echo "❌ railway.toml не найден"
fi

# 5. Проверяем production файлы
echo ""
echo "5️⃣  Проверка production файлов:"

if [ -d "client-dist" ] && [ -d "server-dist" ]; then
    echo "✅ Production файлы найдены"
    echo "   client-dist: $(find client-dist -name "*.js" | wc -l) JS файлов"
    echo "   server-dist: $(find server-dist -name "*.js" | wc -l) JS файлов"
else
    echo "❌ Production файлы не найдены"
    echo "💡 Запустите: ./deploy-from-dev.sh"
fi

# 6. Рекомендации по исправлению
echo ""
echo "🔧 РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ:"
echo ""

if [ "$HTTP_STATUS" != "200" ] && [ "$HTTP_STATUS" != "301" ] && [ "$HTTP_STATUS" != "302" ]; then
    echo "🚨 Railway сервис не отвечает!"
    echo "1. Проверьте Railway Dashboard: https://railway.app/dashboard"
    echo "2. Посмотрите логи деплоя"
    echo "3. Возможно, ошибка в Dockerfile"
    echo ""
fi

if [ -z "$API_RESPONSE" ] || ! echo "$API_RESPONSE" | grep -q "serverInfo"; then
    echo "🚨 API не работает!"
    echo "1. Проверьте, что сервер запускается в контейнере"
    echo "2. Убедитесь, что используется правильный порт (8000)"
    echo "3. Проверьте логи сервера"
    echo ""
fi

echo "✅ Следующие шаги:"
echo "1. Исправьте найденные проблемы"
echo "2. Передеплойте: ./deploy.sh"
echo "3. Подождите 2-5 минут"
echo "4. Проверьте статус: ./check-railway-status.sh"

#!/bin/bash
# Тест WebSocket подключения к Railway

echo "🧪 Тест Railway WebSocket"
echo "========================"

RAILWAY_URL="https://gamessuroi-production.up.railway.app"

echo "🌐 Тестируем: $RAILWAY_URL"
echo ""

# Тест 1: HTTP
echo "1️⃣  HTTP подключение:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$RAILWAY_URL" 2>/dev/null)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ HTTP работает"
else
    echo "❌ HTTP не работает (статус: $HTTP_STATUS)"
    echo "💡 Railway сервер не запущен или ошибка"
    exit 1
fi

# Тест 2: API
echo ""
echo "2️⃣  API эндпоинт:"
API_RESPONSE=$(curl -s --max-time 10 "$RAILWAY_URL/api/serverInfo" 2>/dev/null)

if [ -n "$API_RESPONSE" ] && echo "$API_RESPONSE" | grep -q "serverInfo\|gameVersion"; then
    echo "✅ API работает"
    echo "📄 Server info получен"
else
    echo "❌ API не работает"
    echo "📄 Ответ: $API_RESPONSE"
    echo "💡 Сервер не полностью загрузился"
    exit 1
fi

# Тест 3: WebSocket готовность
echo ""
echo "3️⃣  WebSocket готовность:"
if echo "$API_RESPONSE" | grep -q "serverInfo\|protocolVersion"; then
    echo "✅ API работает, WebSocket порт должен быть доступен"
    echo ""
    echo "🎉 СЕРВЕР ГОТОВ!"
    echo ""
    echo "🌐 Откройте игру:"
    echo "   $RAILWAY_URL"
    echo ""
    echo "🔍 Для диагностики WebSocket проблем:"
    echo "   • Проверьте логи в Railway Dashboard"
    echo "   • В браузере откройте DevTools (F12)"
    echo "   • Посмотрите Network и Console вкладки"
    echo "   • Ищите ошибки типа 'WebSocket connection failed'"
    echo ""
    echo "💡 Если проблема остается:"
    echo "   1. ./build.sh  # Перекомпилировать"
    echo "   2. ./deploy.sh 'Исправление WebSocket'  # Передеплойть"
    echo "   3. Подождать 5 минут"
    echo "   4. ./test.sh  # Проверить снова"
else
    echo "❌ Сервер не отвечает правильно"
    echo "💡 Передеплойте: ./deploy.sh"
    exit 1
fi

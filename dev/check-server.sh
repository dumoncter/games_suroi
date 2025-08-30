#!/bin/bash
# Диагностика и проверка сервера Suroi

echo "🔍 Диагностика сервера Suroi"
echo ""

# Проверяем порты
echo "📊 Проверка портов:"
echo -n "Порт 3000 (клиент): "
if lsof -i :3000 >/dev/null 2>&1; then
    PROCESS=$(lsof -i :3000 | tail -1 | awk '{print $1}')
    echo "✅ Занят процессом: $PROCESS"
else
    echo "❌ Свободен"
fi

echo -n "Порт 8000 (сервер): "
if lsof -i :8000 >/dev/null 2>&1; then
    PROCESS=$(lsof -i :8000 | tail -1 | awk '{print $1}')
    echo "✅ Занят процессом: $PROCESS"
else
    echo "❌ Свободен"
fi

echo ""

# Проверяем доступность сервера
echo "🌐 Проверка доступности сервера:"
echo -n "http://127.0.0.1:8000: "
if curl -s --head --max-time 5 http://127.0.0.1:8000 | head -1 | grep "200\|404\|500" >/dev/null; then
    echo "✅ Доступен"
else
    echo "❌ Недоступен"
fi

echo ""

# Проверяем файлы проекта
echo "📁 Проверка файлов проекта:"
FILES=("package.json" "server/package.json" "client/package.json")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file найден"
    else
        echo "❌ $file не найден"
    fi
done

echo ""

# Проверяем зависимости
echo "📦 Проверка зависимостей:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules существует"
    MODULES_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "   Модулей установлено: $((MODULES_COUNT - 1))"
else
    echo "❌ node_modules не найден"
fi

if [ -d "server/node_modules" ]; then
    echo "✅ server/node_modules существует"
else
    echo "❌ server/node_modules не найден"
fi

if [ -d "client/node_modules" ]; then
    echo "✅ client/node_modules существует"
else
    echo "❌ client/node_modules не найден"
fi

echo ""

# Рекомендации
echo "💡 Рекомендации:"
if ! lsof -i :8000 >/dev/null 2>&1; then
    echo "• Запустите сервер: ./start-server-only.sh"
fi

if ! lsof -i :3000 >/dev/null 2>&1; then
    echo "• Запустите клиент: ./start-dev-server.sh"
fi

if [ ! -d "node_modules" ]; then
    echo "• Установите зависимости: pnpm install"
fi

echo ""
echo "🔗 Ссылки для проверки:"
echo "• Клиент: http://127.0.0.1:3000"
echo "• Сервер: http://127.0.0.1:8000"
echo "• Railway: https://gamessuroi-production.up.railway.app"

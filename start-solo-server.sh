#!/bin/bash
# Запуск соло-сервера Suroi (одиночные бои)

echo "🚀 Запуск соло-сервера Suroi"
echo ""

cd /var/www/neonpsh.ru/games_portal/suroi

# Проверяем наличие package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json не найден"
    exit 1
fi

# Проверяем наличие pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm не установлен"
    echo "Установите: npm install -g pnpm"
    exit 1
fi

# Устанавливаем зависимости если нужно
echo "📦 Проверяю зависимости..."
if [ ! -d "node_modules" ]; then
    echo "Устанавливаю зависимости..."
    pnpm install
else
    echo "Зависимости уже установлены"
fi

# Проверяем порт 8082
if lsof -i :8082 >/dev/null 2>&1; then
    echo "⚠️  Порт 8082 уже занят"
    echo "Убиваю процесс..."
    lsof -ti :8082 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo ""
echo "🎮 Запускаю соло-сервер Suroi..."
echo "Сервер будет доступен на: http://127.0.0.1:8082"
echo "Режим: Solo (одиночные бои)"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Запускаем соло-сервер
cd server
CONFIG_FILE=config.solo.json pnpm start

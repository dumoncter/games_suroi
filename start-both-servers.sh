#!/bin/bash
# Запуск обоих серверов Suroi (соло и командного) одновременно

echo "🚀 Запуск обоих серверов Suroi"
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

# Проверяем и освобождаем порты
if lsof -i :8082 >/dev/null 2>&1; then
    echo "⚠️  Порт 8082 уже занят (соло-сервер)"
    echo "Убиваю процесс..."
    lsof -ti :8082 | xargs kill -9 2>/dev/null || true
fi

if lsof -i :8083 >/dev/null 2>&1; then
    echo "⚠️  Порт 8083 уже занят (командный сервер)"
    echo "Убиваю процесс..."
    lsof -ti :8083 | xargs kill -9 2>/dev/null || true
fi

sleep 2

echo ""
echo "🎮 Запускаю оба сервера Suroi..."
echo "Соло-сервер: http://127.0.0.1:8082"
echo "Командный сервер: http://127.0.0.1:8083"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Функция для обработки сигналов завершения
cleanup() {
    echo ""
    echo "🛑 Останавливаю серверы..."
    kill 0
    exit 0
}

trap cleanup SIGINT SIGTERM

# Запускаем соло-сервер в фоне
echo "Запускаю соло-сервер..."
cd server
CONFIG_FILE=config.solo.json pnpm start &
SOLO_PID=$!

# Запускаем командный сервер в фоне
echo "Запускаю командный сервер..."
CONFIG_FILE=config.team.json pnpm start &
TEAM_PID=$!

# Ждем завершения любого из процессов
wait $SOLO_PID $TEAM_PID

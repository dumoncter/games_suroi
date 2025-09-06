#!/bin/bash
# Запуск командного сервера Suroi (групповые бои)

echo "🚀 Запуск командного сервера Suroi"
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

# Проверяем порт 8083
if lsof -i :8083 >/dev/null 2>&1; then
    echo "⚠️  Порт 8083 уже занят"
    echo "Убиваю процесс..."
    lsof -ti :8083 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo ""
echo "🎮 Запускаю командный сервер Suroi..."
echo "Сервер будет доступен на: http://127.0.0.1:8083"
echo "Режим: Team (дуо/сквады с ротацией каждые 30 минут)"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Запускаем командный сервер
cd server
CONFIG_FILE=config.team.json pnpm start

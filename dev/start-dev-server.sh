#!/bin/bash
# Запуск локального dev сервера для Suroi

echo "🚀 Запуск локального dev сервера Suroi"
echo ""

cd /var/www/neonpsh.ru/games_portal/suroi/dev

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
echo "📦 Проверяю и устанавливаю зависимости..."
if [ ! -d "node_modules" ]; then
    echo "Устанавливаю зависимости..."
    pnpm install
else
    echo "Зависимости уже установлены"
fi

# Проверяем, не запущен ли уже сервер
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Порт 3000 уже занят (клиент)"
    echo "Убиваю процесс..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
fi

if lsof -i :8000 >/dev/null 2>&1; then
    echo "⚠️  Порт 8000 уже занят (сервер)"
    echo "Убиваю процесс..."
    lsof -ti :8000 | xargs kill -9 2>/dev/null || true
fi

echo ""
echo "🎮 Запускаю Suroi в dev режиме..."
echo ""

# Запускаем dev сервер
echo "Запуск: pnpm dev"
echo "Клиент будет доступен на: http://127.0.0.1:3000"
echo "Сервер будет доступен на: http://127.0.0.1:8000"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

pnpm dev

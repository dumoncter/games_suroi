#!/bin/bash
# Запуск только сервера Suroi (без клиента)

echo "🚀 Запуск только сервера Suroi"
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
echo "📦 Проверяю зависимости..."
if [ ! -d "node_modules" ]; then
    echo "Устанавливаю зависимости..."
    pnpm install
else
    echo "Зависимости уже установлены"
fi

# Проверяем порт 8000
if lsof -i :8000 >/dev/null 2>&1; then
    echo "⚠️  Порт 8000 уже занят"
    echo "Убиваю процесс..."
    lsof -ti :8000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo ""
echo "🎮 Запускаю сервер Suroi..."
echo "Сервер будет доступен на: http://127.0.0.1:8000"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Запускаем только сервер
pnpm dev:server

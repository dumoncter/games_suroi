#!/bin/bash
# Компиляция всего проекта Suroi

echo "🔨 Компиляция проекта Suroi"
echo "=========================="

# Пути
DEV_DIR="/var/www/neonpsh.ru/games_portal/suroi/dev"
PROD_DIR="/var/www/neonpsh.ru/games_portal/suroi/prod"

cd "$DEV_DIR"

# Проверяем pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm не установлен"
    exit 1
fi

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
pnpm install

# Компилируем
echo "🔨 Компиляция клиента..."
pnpm build:client

echo "🔨 Компиляция сервера..."
pnpm build:server

# Проверяем результат
if [ ! -d "client/dist" ] || [ ! -d "server/dist" ]; then
    echo "❌ Компиляция не удалась"
    exit 1
fi

echo "✅ Компиляция завершена!"

# Копируем в prod
echo "📋 Копирование в prod..."
cd "$PROD_DIR"

# Копируем файлы с правильной структурой для Docker
echo "📋 Создание правильной структуры директорий..."
mkdir -p client-dist server-dist common/src

echo "📋 Копирование client-dist..."
cp -r "$DEV_DIR/client/dist"/* client-dist/ 2>/dev/null || echo "⚠️  Client dist пустой"

echo "📋 Копирование server-dist..."
cp -r "$DEV_DIR/server/dist"/* server-dist/ 2>/dev/null || echo "⚠️  Server dist пустой"

echo "📋 Копирование common/src..."
cp -r "$DEV_DIR/common/src"/* common/src/ 2>/dev/null || echo "⚠️  Common src пустой"

echo "📋 Копирование package.json файлов..."
mkdir -p server
cp "$DEV_DIR/common/package.json" common/ 2>/dev/null || echo "⚠️  common/package.json не найден"
cp "$DEV_DIR/server/package.json" server/ 2>/dev/null || echo "⚠️  server/package.json не найден"

echo "📋 Копирование конфигурационных файлов..."
cp "$DEV_DIR/server/config.production.json" server-dist/config.json 2>/dev/null || echo "⚠️  config.production.json не найден"

# Копируем конфигурационные файлы
cp "$DEV_DIR/Dockerfile" . 2>/dev/null || echo "⚠️  Dockerfile не найден"
cp "$DEV_DIR/nginx.conf" . 2>/dev/null || echo "⚠️  nginx.conf не найден"
cp "$DEV_DIR/package.json" . 2>/dev/null || echo "⚠️  package.json не найден"

# Копируем исправленный Dockerfile для Railway
if [ -f "Dockerfile.railway" ]; then
    echo "✅ Dockerfile.railway уже готов"
else
    echo "📝 Создаем Dockerfile.railway с исправлениями..."
fi

echo "✅ Файлы скопированы в prod"
echo ""
echo "📁 Production файлы готовы в папке prod/"

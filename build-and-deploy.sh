#!/bin/bash
# Скрипт для сборки клиента из основной директории и деплоя
# Использование: ./build-and-deploy.sh [сообщение коммита]

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Suroi Client Build & Deploy${NC}"
echo -e "${BLUE}==============================${NC}"

# Путь к основной директории
MAIN_DIR="/var/www/neonpsh.ru/games_portal/suroi"

# Шаг 1: Переходим в основную директорию и собираем клиент
echo -e "${BLUE}📦 Переходим в основную директорию и собираем клиент...${NC}"

cd "$MAIN_DIR"
if ! cd client && pnpm build; then
    echo -e "${RED}❌ Ошибка сборки клиента${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Клиент успешно собран${NC}"

# Шаг 2: Возвращаемся в client_production и копируем файлы
echo -e "${BLUE}📋 Копируем файлы в client_production...${NC}"

cd "$MAIN_DIR/client_production"

# Очищаем старые файлы (кроме системных)
find . -not -path './.git*' -not -path './.git' -not -path './deploy.sh' -not -path './build-and-deploy.sh' -not -path './Dockerfile' -not -path './railway.toml' -not -path './nginx.conf' -not -path './.gitignore' -delete

# Копируем новые собранные файлы
cp -r "$MAIN_DIR/client/dist"/* ./

echo -e "${GREEN}✅ Файлы скопированы${NC}"

# Шаг 3: Запускаем деплой
echo -e "${BLUE}🚀 Запускаем деплой...${NC}"

if [ -n "$1" ]; then
    ./deploy.sh "$1"
else
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    ./deploy.sh "Build & Deploy: Client production - $TIMESTAMP"
fi

#!/bin/bash
# Автоматический скрипт для коммита и пуша в ветку server-team
# Работает ТОЛЬКО с веткой server-team
# Использование: ./git_push_server-team.sh [сообщение коммита]

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Suroi Production Deploy Script${NC}"
echo -e "${BLUE}=================================${NC}"

# Настройка Git конфигурации, если не настроена
if [ -z "$(git config user.name)" ]; then
    echo "⚙️  Настраиваем Git конфигурацию..."
    git config user.name "NeonPSH Admin"
    git config user.email "admin@neonpsh.ru"
    echo -e "${GREEN}✅ Git конфигурация настроена${NC}"
fi

# Проверяем текущую ветку
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 Текущая ветка: ${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" != "server-team" ]; then
    echo -e "${YELLOW}⚠️  Вы не в ветке server-team. Переключаемся...${NC}"
    git checkout server-team || {
        echo -e "${RED}❌ Ошибка при переключении на ветку server-team${NC}"
        echo -e "${YELLOW}💡 Попробуйте создать ветку: git checkout -b server-team${NC}"
        exit 1
    }
fi

# Синхронизация с основным репозиторием и локальная сборка
echo -e "${BLUE}🔄 Синхронизация с основным репозиторием...${NC}"
BASE_DIR="/var/www/neonpsh.ru/games_portal/suroi"

# Шаг 1: Сборка только серверной части
echo -e "${BLUE}📦 Сборка серверной части...${NC}"
cd "$BASE_DIR"
if ! pnpm run build:server; then
    echo -e "${RED}❌ Ошибка сборки сервера${NC}"
    exit 1
fi
cd "$BASE_DIR/server_team"

# Шаг 2: Копируем только необходимые production-ready файлы
echo "📋 Копируем production-ready код сервера..."
# Очищаем старую папку dist если существует
rm -rf ./dist
# Копируем содержимое скомпилированного кода
cp -r "$BASE_DIR/server/dist/." ./dist/ 2>/dev/null || true
cp "$BASE_DIR/server/package.json" ./package.json 2>/dev/null || true
cp "$BASE_DIR/server/config.team.json" ./config.json 2>/dev/null || true

# Сохраняем специфические файлы сервера (после копирования)
echo "💾 Сохраняем специфические файлы сервера..."
cp railway.toml railway.toml.backup 2>/dev/null || true
cp nginx.conf nginx.conf.backup 2>/dev/null || true
cp Dockerfile Dockerfile.backup 2>/dev/null || true
cp git_push_server-team.sh git_push_server-team.sh.backup 2>/dev/null || true
cp start-server.js start-server.js.backup 2>/dev/null || true

# Восстанавливаем специфические файлы
echo "🔄 Восстанавливаем специфические файлы..."
mv railway.toml.backup railway.toml 2>/dev/null || true
mv nginx.conf.backup nginx.conf 2>/dev/null || true
mv Dockerfile.backup Dockerfile 2>/dev/null || true
mv git_push_server-team.sh.backup git_push_server-team.sh 2>/dev/null || true
mv start-server.js.backup start-server.js 2>/dev/null || true

echo -e "${GREEN}✅ Синхронизация завершена${NC}"

# Установка зависимостей (без локальной сборки - код уже собран)
echo -e "${BLUE}📦 Устанавливаем зависимости...${NC}"
if ! pnpm install; then
    echo -e "${RED}❌ Ошибка установки зависимостей${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Зависимости установлены${NC}"

# Проверяем, есть ли изменения для коммита
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Нет изменений для коммита${NC}"
    echo -e "${GREEN}✅ Репозиторий уже актуален${NC}"
    echo -e "${BLUE}🌐 Production URL: https://suroi.neonpsh.games${NC}"
    exit 0
fi

# Показываем статус изменений
echo "📋 Изменения для коммита:"
git status --short
echo ""

# Добавляем все изменения
echo "📁 Добавляем все изменения..."
git add .

# Создаем сообщение коммита
if [ -n "$1" ]; then
    COMMIT_MESSAGE="$1"
else
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    COMMIT_MESSAGE="Auto-commit: $TIMESTAMP"
fi

# Делаем коммит
echo "📝 Создаем коммит с сообщением: '$COMMIT_MESSAGE'"
if git commit -m "$COMMIT_MESSAGE"; then
    echo -e "${GREEN}✅ Коммит успешно создан${NC}"
else
    echo -e "${RED}❌ Ошибка при создании коммита${NC}"
    exit 1
fi

# Пушим в server-team ветку
echo "⬆️  Пушим изменения в ветку server-team..."
if git push origin server-team; then
    echo -e "${GREEN}✅ Успешно запушено в server-team ветку${NC}"
    echo -e "${GREEN}🔗 Server-team ветка обновлена!${NC}"
else
    echo -e "${RED}❌ Ошибка при пуше в server-team ветку${NC}"
    echo -e "${YELLOW}💡 Возможные решения:${NC}"
    echo "   • Проверьте подключение к интернету"
    echo "   • Убедитесь что у вас есть права на push"
    echo "   • Попробуйте: git pull origin server-team --rebase"
    echo "   • Или создайте upstream: git push -u origin server-team"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Деплой завершен успешно!${NC}"
echo ""
echo -e "${BLUE}🔄 Railway автоматически:${NC}"
echo -e "${BLUE}   📦 Соберет Docker образ из server-team ветки${NC}"
echo -e "${BLUE}   🏗️  Использует уже скомпилированный TypeScript код${NC}"
echo -e "${BLUE}   🌐 Запустит Team сервер на порту 8080${NC}"
echo -e "${BLUE}   🔌 Настроит WebSocket прокси${NC}"
echo -e "${BLUE}   ⚡ Применит оптимизации производительности${NC}"
echo ""
echo -e "${YELLOW}⏱️  Ожидайте 1-2 минут для завершения деплоя${NC}"
echo ""
echo -e "${GREEN}🌐 Team Server URL: https://suroi-team-production.up.railway.app${NC}"
echo ""
echo -e "${BLUE}🎮 Режим игры:${NC}"
echo -e "${BLUE}   👥 Team Battles - https://suroi-team-production.up.railway.app/play${NC}"
echo ""
echo -e "${BLUE}🎯 Настройки камеры в игре (F1 console):${NC}"
echo -e "${BLUE}   cv_camera_interpolation_speed - скорость сглаживания${NC}"
echo -e "${BLUE}   cv_movement_smoothing - включить сглаживание${NC}"
echo -e "${BLUE}📱 Гироскоп настройки:${NC}"
echo -e "${BLUE}   cv_gyroscope_sensitivity - чувствительность${NC}"
echo -e "${BLUE}   cv_gyroscope_smoothing - сглаживание${NC}"
echo ""

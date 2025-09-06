#!/bin/bash
# Автоматический скрипт для коммита и пуша в ветку server-solo
# Работает ТОЛЬКО с веткой server-soloу меня еще
# Использование: ./git_push_production.sh [сообщение коммита]

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

if [ "$CURRENT_BRANCH" != "server-solo" ]; then
    echo -e "${YELLOW}⚠️  Вы не в ветке server-solo. Переключаемся...${NC}"
    git checkout server-solo || {
        echo -e "${RED}❌ Ошибка при переключении на ветку server-solo${NC}"
        echo -e "${YELLOW}💡 Попробуйте создать ветку: git checkout -b server-solo${NC}"
        exit 1
    }
fi

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

# Пушим в server-solo ветку
echo "⬆️  Пушим изменения в ветку server-solo..."
if git push origin server-solo; then
    echo -e "${GREEN}✅ Успешно запушено в server-solo ветку${NC}"
    echo -e "${GREEN}🔗 Server-solo ветка обновлена!${NC}"
else
    echo -e "${RED}❌ Ошибка при пуше в server-solo ветку${NC}"
    echo -e "${YELLOW}💡 Возможные решения:${NC}"
    echo "   • Проверьте подключение к интернету"
    echo "   • Убедитесь что у вас есть права на push"
    echo "   • Попробуйте: git pull origin server-solo --rebase"
    echo "   • Или создайте upstream: git push -u origin server-solo"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Деплой завершен успешно!${NC}"
echo ""
echo -e "${BLUE}🔄 Railway автоматически:${NC}"
echo -e "${BLUE}   📦 Соберет Docker образ из server-solo ветки${NC}"
echo -e "${BLUE}   🏗️  Перекомпилирует TypeScript${NC}"
echo -e "${BLUE}   🌐 Запустит Solo сервер на порту 8082${NC}"
echo -e "${BLUE}   🔌 Настроит WebSocket прокси${NC}"
echo -e "${BLUE}   ⚡ Применит оптимизации производительности${NC}"
echo ""
echo -e "${YELLOW}⏱️  Ожидайте 2-5 минут для завершения сборки${NC}"
echo ""
echo -e "${GREEN}🌐 Solo Server URL: https://suroi-solo.neonpsh.games${NC}"
echo ""
echo -e "${BLUE}🎮 Режим игры:${NC}"
echo -e "${BLUE}   👤 Solo Battles - https://suroi-solo.neonpsh.games/play${NC}"
echo ""
echo -e "${BLUE}🎯 Настройки камеры в игре (F1 console):${NC}"
echo -e "${BLUE}   cv_camera_interpolation_speed - скорость сглаживания${NC}"
echo -e "${BLUE}   cv_movement_smoothing - включить сглаживание${NC}"
echo -e "${BLUE}📱 Гироскоп настройки:${NC}"
echo -e "${BLUE}   cv_gyroscope_sensitivity - чувствительность${NC}"
echo -e "${BLUE}   cv_gyroscope_smoothing - сглаживание${NC}"
echo ""

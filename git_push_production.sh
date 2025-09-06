#!/bin/bash
# Автоматический скрипт для коммита и пуша в ветку dev
# Использование: ./git_push_production.sh [сообщение коммита]

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo -e "${YELLOW}⚠️  Вы не в ветке dev. Переключаемся...${NC}"
    git checkout dev || {
        echo -e "${RED}❌ Ошибка при переключении на ветку dev${NC}"
        exit 1
    }
fi

# Проверяем, есть ли изменения для коммита
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Нет изменений для коммита${NC}"
    echo -e "${GREEN}✅ Репозиторий уже актуален${NC}"
    echo -e "${BLUE}🌐 Railway URL: https://gamessuroi-production.up.railway.app${NC}"
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

# Пушим в dev ветку
echo "⬆️  Пушим изменения в ветку dev..."
if git push origin dev; then
    echo -e "${GREEN}✅ Успешно запушено в dev ветку${NC}"
    echo -e "${GREEN}🔗 Dev ветка обновлена!${NC}"
else
    echo -e "${RED}❌ Ошибка при пуше в dev ветку${NC}"
    echo -e "${YELLOW}💡 Возможные решения:${NC}"
    echo "   • Проверьте подключение к интернету"
    echo "   • Убедитесь что у вас есть права на push"
    echo "   • Попробуйте: git pull origin dev --rebase"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Деплой завершен успешно!${NC}"
echo ""
echo -e "${BLUE}🔄 Railway автоматически:${NC}"
echo -e "${BLUE}   📦 Соберет Docker образ из dev ветки${NC}"
echo -e "${BLUE}   🏗️  Перекомпилирует TypeScript${NC}"
echo -e "${BLUE}   🌐 Запустит nginx + Node.js сервер${NC}"
echo -e "${BLUE}   🔌 Настроит WebSocket прокси${NC}"
echo -e "${BLUE}   ⚡ Применит оптимизации производительности${NC}"
echo ""
echo -e "${YELLOW}⏱️  Ожидайте 2-5 минут для завершения сборки${NC}"
echo ""
echo -e "${GREEN}🌐 Production URL: https://gamessuroi-production.up.railway.app${NC}"
echo ""
echo -e "${BLUE}🎮 Новые возможности оптимизации:${NC}"
echo -e "${BLUE}   📊 Тестирование производительности: ./scripts/performance-test.js${NC}"
echo -e "${BLUE}   🎯 Настройки камеры в игре (F1 console):${NC}"
echo -e "${BLUE}      cv_camera_interpolation_speed - скорость сглаживания${NC}"
echo -e "${BLUE}      cv_movement_smoothing - включить сглаживание${NC}"
echo -e "${BLUE}   📱 Гироскоп настройки:${NC}"
echo -e "${BLUE}      cv_gyroscope_sensitivity - чувствительность${NC}"
echo -e "${BLUE}      cv_gyroscope_smoothing - сглаживание${NC}"
echo ""

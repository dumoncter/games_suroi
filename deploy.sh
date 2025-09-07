#!/bin/bash
# Скрипт для деплоя клиента из client_production директории
# Использование: ./deploy.sh [сообщение коммита]

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Suroi Client Deploy Script${NC}"
echo -e "${BLUE}==============================${NC}"

# Настройка Git если не настроена
if [ -z "$(git config user.name)" ]; then
    git config user.name "NeonPSH Admin"
    git config user.email "admin@neonpsh.ru"
    echo -e "${GREEN}✅ Git конфигурация настроена${NC}"
fi

# Синхронизация с удаленным репозиторием
echo -e "${BLUE}🔄 Синхронизация с удаленным репозиторием...${NC}"
git pull origin client --allow-unrelated-histories || true

# Создаем сообщение коммита
if [ -n "$1" ]; then
    COMMIT_MESSAGE="$1"
else
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    COMMIT_MESSAGE="Deploy: Client production build - $TIMESTAMP"
fi

# Добавляем все файлы
echo "📁 Добавляем все файлы..."
git add .

# Делаем коммит
echo "📝 Создаем коммит с сообщением: '$COMMIT_MESSAGE'"
if git commit -m "$COMMIT_MESSAGE"; then
    echo -e "${GREEN}✅ Коммит успешно создан${NC}"
else
    echo -e "${YELLOW}⚠️  Нет изменений для коммита${NC}"
fi

# Пушим в client ветку
echo "⬆️  Пушим изменения в ветку client..."
if git push -u origin client; then
    echo -e "${GREEN}✅ Успешно запушено в client ветку${NC}"
    echo -e "${GREEN}🔗 Client ветка обновлена!${NC}"
else
    echo -e "${RED}❌ Ошибка при пуше в client ветку${NC}"
    echo -e "${YELLOW}💡 Возможные решения:${NC}"
    echo "   • Проверьте подключение к интернету"
    echo "   • Убедитесь что у вас есть права на push"
    echo "   • Попробуйте: git pull origin client --rebase"
    echo "   • Или создайте upstream: git push -u origin client"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Деплой клиента завершен успешно!${NC}"
echo ""
echo -e "${BLUE}🔄 Railway автоматически:${NC}"
echo -e "${BLUE}   📦 Соберет Docker образ из client ветки${NC}"
echo -e "${BLUE}   🌐 Запустит клиент на порту 8081${NC}"
echo -e "${BLUE}   📊 Настроит проксирование на серверы${NC}"
echo ""
echo -e "${YELLOW}⏱️  Ожидайте 1-2 минут для завершения деплоя${NC}"
echo ""
echo -e "${GREEN}🌐 Client URLs:${NC}"
echo -e "${GREEN}   🎮 Solo: https://suroi-solo-production.up.railway.app${NC}"
echo -e "${GREEN}   👥 Team: https://suroi-team-production.up.railway.app${NC}"

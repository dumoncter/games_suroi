#!/bin/bash
# Полный скрипт: компиляция + развертывание
# Использование: ./full-deploy.sh [сообщение коммита]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Начинаем полный процесс: компиляция + развертывание${NC}"
echo ""

# Шаг 1: Компиляция
echo -e "${GREEN}🔨 Шаг 1: Компиляция проекта${NC}"
if [ -f "./build-and-deploy.sh" ]; then
    chmod +x ./build-and-deploy.sh
    ./build-and-deploy.sh "$1"
else
    echo -e "${RED}❌ Скрипт build-and-deploy.sh не найден!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Компиляция завершена${NC}"
echo ""

# Шаг 2: Деплой
echo -e "${GREEN}🚀 Шаг 2: Подготовка к развертыванию${NC}"
if [ -f "./deploy-to-railway.sh" ]; then
    chmod +x ./deploy-to-railway.sh
    ./deploy-to-railway.sh
else
    echo -e "${YELLOW}⚠️  Скрипт deploy-to-railway.sh не найден${NC}"
    echo -e "${BLUE}ℹ️  Используйте Railway GitHub integration${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Полный процесс завершен успешно!${NC}"
echo ""
echo -e "${YELLOW}📋 Что было выполнено:${NC}"
echo "  ✅ Код скомпилирован из dev директории"
echo "  ✅ Production файлы подготовлены"
echo "  ✅ Docker образ готов к развертыванию"
echo "  📝 Файлы готовы для GitHub/Railway integration"
echo ""
echo -e "${BLUE}🔄 Следующие шаги для развертывания:${NC}"
echo "  1. Создайте проект в Railway Dashboard"
echo "  2. Подключите GitHub репозиторий"
echo "  3. Выберите ветку 'production'"
echo "  4. Railway автоматически развернет при следующем пуше"
echo ""
echo -e "${GREEN}🌐 Автоматическое развертывание активно!${NC}"
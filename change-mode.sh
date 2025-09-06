#!/bin/bash

# 🎮 SUROI РЕЖИМ CHANGER SCRIPT
# Быстрая смена режима игры через переменные окружения

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода справки
show_help() {
    echo -e "${BLUE}🎮 SUROI РЕЖИМ CHANGER${NC}"
    echo ""
    echo "Использование: $0 [MAP] [TEAM_MODE] [MAX_PLAYERS] [MAX_GAMES]"
    echo ""
    echo "Аргументы:"
    echo "  MAP         - режим карты (normal, fall, halloween, infection, winter, hunted, birthday)"
    echo "  TEAM_MODE   - командный режим (solo, normal)"
    echo "  MAX_PLAYERS - макс игроков в игре (по умолчанию: 80)"
    echo "  MAX_GAMES   - макс одновременных игр (по умолчанию: 5)"
    echo ""
    echo "Примеры:"
    echo "  $0 halloween solo        # Хэллоуин соло"
    echo "  $0 winter normal         # Зима с командами"
    echo "  $0 hunted solo 60 8      # Охота соло (60 игроков, 8 игр)"
    echo "  $0 fall normal 90 4      # Осень с командами (90 игроков, 4 игры)"
    echo ""
    echo "Готовые пресеты:"
    echo "  halloween-solo    - Хэллоуин соло"
    echo "  winter-teams      - Зима с командами"
    echo "  hunted-solo       - Охота соло"
    echo "  infection-teams   - Заражение с командами"
    echo ""
    exit 1
}

# Функция для применения настроек
apply_settings() {
    local map=$1
    local team_mode=$2
    local max_players=$3
    local max_games=$4

    echo -e "${YELLOW}🔄 Применение настроек...${NC}"

    # Устанавливаем переменные окружения
    export GAME_MAP="$map"
    export GAME_TEAM_MODE="$team_mode"
    export GAME_MAX_PLAYERS="$max_players"
    export GAME_MAX_GAMES="$max_games"

    echo -e "${GREEN}✅ Настройки применены:${NC}"
    echo "  Карта: $map"
    echo "  Команды: $team_mode"
    echo "  Макс игроков: $max_players"
    echo "  Макс игр: $max_games"
    echo ""
    echo -e "${BLUE}🔄 Перезапуск сервера...${NC}"

    # Перезапускаем сервер
    pkill -f "pnpm start" || true
    sleep 2
    nohup pnpm start > server.log 2>&1 &

    echo -e "${GREEN}✅ Сервер перезапущен!${NC}"
    echo -e "${BLUE}📊 Логи сервера: tail -f server.log${NC}"
}

# Обработка пресетов
if [ "$1" = "halloween-solo" ]; then
    apply_settings "halloween" "solo" 80 5
    exit 0
elif [ "$1" = "winter-teams" ]; then
    apply_settings "winter" "normal" 100 3
    exit 0
elif [ "$1" = "hunted-solo" ]; then
    apply_settings "hunted" "solo" 60 8
    exit 0
elif [ "$1" = "infection-teams" ]; then
    apply_settings "infection" "normal" 70 6
    exit 0
fi

# Проверка аргументов
if [ $# -lt 2 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
fi

# Получение аргументов с значениями по умолчанию
MAP=$1
TEAM_MODE=$2
MAX_PLAYERS=${3:-80}
MAX_GAMES=${4:-5}

# Валидация карты
case $MAP in
    normal|fall|halloween|infection|winter|hunted|birthday)
        ;;
    *)
        echo -e "${RED}❌ Ошибка: Неверный режим карты '$MAP'${NC}"
        echo "Доступные: normal, fall, halloween, infection, winter, hunted, birthday"
        exit 1
        ;;
esac

# Валидация командного режима
case $TEAM_MODE in
    solo|normal)
        ;;
    *)
        echo -e "${RED}❌ Ошибка: Неверный командный режим '$TEAM_MODE'${NC}"
        echo "Доступные: solo, normal"
        exit 1
        ;;
esac

# Валидация числовых значений
if ! [[ "$MAX_PLAYERS" =~ ^[0-9]+$ ]] || [ "$MAX_PLAYERS" -lt 1 ] || [ "$MAX_PLAYERS" -gt 200 ]; then
    echo -e "${RED}❌ Ошибка: MAX_PLAYERS должно быть числом от 1 до 200${NC}"
    exit 1
fi

if ! [[ "$MAX_GAMES" =~ ^[0-9]+$ ]] || [ "$MAX_GAMES" -lt 1 ] || [ "$MAX_GAMES" -gt 20 ]; then
    echo -e "${RED}❌ Ошибка: MAX_GAMES должно быть числом от 1 до 20${NC}"
    exit 1
fi

# Применение настроек
apply_settings "$MAP" "$TEAM_MODE" "$MAX_PLAYERS" "$MAX_GAMES"

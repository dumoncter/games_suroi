# 🎮 SUROI ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ДЛЯ RAILWAY

## 🚀 БЫСТРАЯ НАСТРОЙКА ЧЕРЕЗ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

### Основные переменные:

```bash
# Режим карты (normal, fall, halloween, infection, winter, hunted, birthday)
GAME_MAP=halloween

# Командный режим (solo, normal)
GAME_TEAM_MODE=solo

# Максимальное количество игроков в игре
GAME_MAX_PLAYERS=80

# Максимальное количество одновременных игр
GAME_MAX_GAMES=5
```

## 🎯 ГОТОВЫЕ ПРЕСЕТЫ РЕЖИМОВ

### 🎃 Хэллоуин Solo (текущий):
```bash
GAME_MAP=halloween
GAME_TEAM_MODE=solo
GAME_MAX_PLAYERS=80
GAME_MAX_GAMES=5
```

### ❄️ Зима с командами:
```bash
GAME_MAP=winter
GAME_TEAM_MODE=normal
GAME_MAX_PLAYERS=100
GAME_MAX_GAMES=3
```

### 🏹 Охота Solo:
```bash
GAME_MAP=hunted
GAME_TEAM_MODE=solo
GAME_MAX_PLAYERS=60
GAME_MAX_GAMES=8
```

### 🍂 Осень Duo/Squad:
```bash
GAME_MAP=fall
GAME_TEAM_MODE=normal
GAME_MAX_PLAYERS=90
GAME_MAX_GAMES=4
```

### 🧟 Заражение с командами:
```bash
GAME_MAP=infection
GAME_TEAM_MODE=normal
GAME_MAX_PLAYERS=70
GAME_MAX_GAMES=6
```

### 🎂 День рождения:
```bash
GAME_MAP=birthday
GAME_TEAM_MODE=normal
GAME_MAX_PLAYERS=80
GAME_MAX_GAMES=5
```

## ⚙️ ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ

```bash
# Порт сервера (по умолчанию 8001)
GAME_PORT=8001

# Hostname сервера (по умолчанию 0.0.0.0)
GAME_HOSTNAME=0.0.0.0
```

## 🔄 КАК ИСПОЛЬЗОВАТЬ В RAILWAY

1. **Перейдите в настройки проекта** в Railway Dashboard
2. **Variables** → **Add Variable**
3. **Добавьте нужные переменные** из пресетов выше
4. **Передеплойте сервис** для применения изменений

## 🎮 БЫСТРАЯ СМЕНА РЕЖИМОВ

Чтобы быстро сменить режим:

1. **Измените переменную** `GAME_MAP` в Railway
2. **Измените переменную** `GAME_TEAM_MODE` если нужно
3. **Trigger redeploy** в Railway

Изменения применятся автоматически без изменения кода!

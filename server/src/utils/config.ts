import { existsSync, readFileSync, writeFileSync } from "fs";

let configExists = existsSync("config.json");
if (!configExists && existsSync("config.example.json")) {
    writeFileSync("config.json", readFileSync("config.example.json", "utf8"));
    configExists = true;
}

import type { ConfigSchema } from "./config.d";

// Функция для получения значения из переменных окружения с fallback
function getEnvValue<T>(envKey: string, defaultValue: T): T {
    const envValue = process.env[envKey];
    if (envValue === undefined) return defaultValue;

    // Парсим boolean значения
    if (typeof defaultValue === 'boolean') {
        return (envValue.toLowerCase() === 'true') as T;
    }

    // Парсим числа
    if (typeof defaultValue === 'number') {
        const parsed = parseInt(envValue, 10);
        return (isNaN(parsed) ? defaultValue : parsed) as T;
    }

    return envValue as T;
}

// Загружаем базовую конфигурацию
const baseConfig = (configExists ? JSON.parse(readFileSync("config.json", "utf8")) : {}) as ConfigSchema;

// Переопределяем через переменные окружения
export const Config: ConfigSchema = {
    ...baseConfig,

    // Переопределение режима игры через env
    map: getEnvValue('GAME_MAP', baseConfig.map || 'normal'),

    // Переопределение командного режима через env
    teamMode: getEnvValue('GAME_TEAM_MODE', baseConfig.teamMode || 'solo'),

    // Переопределение максимального количества игроков
    maxPlayersPerGame: getEnvValue('GAME_MAX_PLAYERS', baseConfig.maxPlayersPerGame || 80),

    // Переопределение максимального количества игр
    maxGames: getEnvValue('GAME_MAX_GAMES', baseConfig.maxGames || 5),

    // Переопределение порта
    port: getEnvValue('GAME_PORT', baseConfig.port || 8001),

    // Переопределение hostname
    hostname: getEnvValue('GAME_HOSTNAME', baseConfig.hostname || '0.0.0.0'),
};

#!/bin/bash
# Тестовый скрипт для проверки Docker сборки локально

echo "🚀 Тестирование Docker сборки Suroi..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен или не запущен"
    exit 1
fi

echo "✅ Docker найден"

# Сборка образа
echo "🔨 Собираем Docker образ..."
if docker build -t suroi-test .; then
    echo "✅ Docker образ успешно собран!"
    echo ""
    echo "📊 Информация об образе:"
    docker images suroi-test
    echo ""
    echo "🧪 Для тестирования запустите:"
    echo "docker run -p 3000:3000 suroi-test"
else
    echo "❌ Ошибка при сборке Docker образа"
    exit 1
fi

echo ""
echo "🎉 Тестирование завершено!"

#!/bin/bash
# Тестовый скрипт для проверки сервера

echo "🧪 Testing server functionality..."

# Test 1: Check if ports are free
echo "1. Checking ports..."
if lsof -i :8082 >/dev/null 2>&1; then
    echo "❌ Port 8082 is already in use"
    lsof -ti :8082 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

if lsof -i :8083 >/dev/null 2>&1; then
    echo "❌ Port 8083 is already in use"
    lsof -ti :8083 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Test 2: Start solo server
echo "2. Starting solo server..."
cd /var/www/neonpsh.ru/games_portal/suroi/server
CONFIG_FILE=config.solo.json pnpm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test 3: Check if server is running
echo "3. Testing server health..."
if curl -f http://localhost:8082/api/serverInfo >/dev/null 2>&1; then
    echo "✅ Solo server is running and responding"
else
    echo "❌ Solo server is not responding"
fi

# Test 4: Test getGame endpoint
echo "4. Testing /api/getGame endpoint..."
RESPONSE=$(curl -s http://localhost:8082/api/getGame)
if [[ $RESPONSE == *"success"* ]]; then
    echo "✅ /api/getGame endpoint is working"
    echo "Response: $RESPONSE"
else
    echo "❌ /api/getGame endpoint failed"
    echo "Response: $RESPONSE"
fi

# Test 5: Test with NGINX
echo "5. Testing through NGINX..."
if curl -f http://localhost:3000/api/getGame >/dev/null 2>&1; then
    echo "✅ NGINX proxy is working"
else
    echo "❌ NGINX proxy failed"
fi

# Cleanup
echo "6. Cleaning up..."
kill $SERVER_PID 2>/dev/null || true

echo "🧪 Test completed"

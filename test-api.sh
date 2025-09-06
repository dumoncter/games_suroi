#!/bin/bash
# Простой тест API

echo "🧪 Testing API endpoints..."

# Test 1: Direct server access
echo "1. Testing direct server access..."
if curl -f http://localhost:8082/api/serverInfo >/dev/null 2>&1; then
    echo "✅ Direct server access works"
    RESPONSE=$(curl -s http://localhost:8082/api/serverInfo)
    echo "Server info: $RESPONSE"
else
    echo "❌ Direct server access failed"
fi

# Test 2: API getGame endpoint
echo "2. Testing /api/getGame..."
if curl -f http://localhost:8082/api/getGame >/dev/null 2>&1; then
    echo "✅ /api/getGame works"
    RESPONSE=$(curl -s http://localhost:8082/api/getGame)
    echo "Response: $RESPONSE"
else
    echo "❌ /api/getGame failed"
    RESPONSE=$(curl -s http://localhost:8082/api/getGame 2>&1)
    echo "Error response: $RESPONSE"
fi

echo "🧪 API test completed"

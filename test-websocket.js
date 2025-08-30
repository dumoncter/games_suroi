#!/usr/bin/env node

/**
 * Тест WebSocket соединения для диагностики проблем с подключением
 * Использование: node test-websocket.js [url]
 */

const WebSocket = require('ws');
const https = require('https');
const http = require('http');

const testUrls = [
    'wss://gamessuroi-production.up.railway.app/game/1',
    'ws://127.0.0.1:8000/game/1',
    'https://gamessuroi-production.up.railway.app/api/serverInfo',
    'http://127.0.0.1:8000/api/serverInfo'
];

const testUrl = process.argv[2] || testUrls[0];

console.log(`🧪 Тестирование соединения: ${testUrl}`);
console.log('='.repeat(50));

if (testUrl.startsWith('ws')) {
    // Тест WebSocket
    testWebSocket(testUrl);
} else {
    // Тест HTTP
    testHttp(testUrl);
}

function testWebSocket(url) {
    console.log('🔌 Тестирование WebSocket соединения...');

    const ws = new WebSocket(url, {
        headers: {
            'User-Agent': 'Suroi-WebSocket-Test/1.0'
        }
    });

    ws.on('open', () => {
        console.log('✅ WebSocket соединение установлено успешно!');
        ws.close();
    });

    ws.on('error', (error) => {
        console.log('❌ Ошибка WebSocket соединения:');
        console.log(`   Код ошибки: ${error.code || 'Unknown'}`);
        console.log(`   Сообщение: ${error.message}`);

        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Возможные причины:');
            console.log('   • Сервер не запущен');
            console.log('   • Неправильный порт');
            console.log('   • Firewall блокирует соединение');
        } else if (error.code === 'ENOTFOUND') {
            console.log('💡 Возможные причины:');
            console.log('   • Неправильный домен');
            console.log('   • DNS проблема');
        }
    });

    ws.on('close', (code, reason) => {
        console.log(`🔚 WebSocket соединение закрыто (код: ${code})`);
    });

    // Таймаут 10 секунд
    setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
            console.log('⏰ Таймаут соединения (10 сек)');
            ws.close();
        }
    }, 10000);
}

function testHttp(url) {
    console.log('🌐 Тестирование HTTP соединения...');

    const client = url.startsWith('https') ? https : http;

    const req = client.request(url, {
        method: 'GET',
        headers: {
            'User-Agent': 'Suroi-HTTP-Test/1.0'
        }
    }, (res) => {
        console.log(`✅ HTTP ответ получен (статус: ${res.statusCode})`);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('📄 Данные ответа:');
            try {
                const json = JSON.parse(data);
                console.log(JSON.stringify(json, null, 2));
            } catch (e) {
                console.log(data.substring(0, 200) + (data.length > 200 ? '...' : ''));
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ Ошибка HTTP соединения:');
        console.log(`   Код ошибки: ${error.code || 'Unknown'}`);
        console.log(`   Сообщение: ${error.message}`);
    });

    req.setTimeout(10000, () => {
        console.log('⏰ Таймаут запроса (10 сек)');
        req.destroy();
    });

    req.end();
}

// Тестирование всех URL через 2 секунды
if (!process.argv[2]) {
    setTimeout(() => {
        console.log('\n🔄 Тестирование альтернативных URL...\n');

        testUrls.forEach((url, index) => {
            setTimeout(() => {
                console.log(`\n🧪 Тест ${index + 1}: ${url}`);
                console.log('-'.repeat(30));

                if (url.startsWith('ws')) {
                    testWebSocket(url);
                } else {
                    testHttp(url);
                }
            }, index * 2000);
        });
    }, 2000);
}

#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production config
process.env.NODE_ENV = 'production';

console.log('🚀 Starting Suroi servers for Railway...');

// Railway предоставляет PORT, используем его для основного сервера
const mainPort = process.env.PORT || '8082';
const secondaryPort = '8083'; // Второй сервер на фиксированном порту

// Определяем какой сервер будет основным (слушает на PORT от Railway)
const isSoloMain = mainPort === '8082';

if (isSoloMain) {
    console.log(`🚀 Starting SOLO server (main) on port ${mainPort}...`);
    console.log(`🚀 Starting TEAM server (secondary) on port ${secondaryPort}...`);
} else {
    console.log(`🚀 Starting TEAM server (main) on port ${mainPort}...`);
    console.log(`🚀 Starting SOLO server (secondary) on port ${secondaryPort}...`);
}

const mainProcess = spawn('pnpm', ['start:server'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        CONFIG_FILE: isSoloMain ? 'config.solo.json' : 'config.team.json',
        PORT: mainPort
    }
});

const secondaryProcess = spawn('pnpm', ['start:server'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        CONFIG_FILE: isSoloMain ? 'config.team.json' : 'config.solo.json',
        PORT: secondaryPort
    }
});

mainProcess.on('error', (error) => {
    console.error('Failed to start main server:', error);
    secondaryProcess.kill();
    process.exit(1);
});

secondaryProcess.on('error', (error) => {
    console.error('Failed to start secondary server:', error);
    mainProcess.kill();
    process.exit(1);
});

// Services are ready
console.log('✅ Both servers started successfully');
console.log(`🌐 Main server (${isSoloMain ? 'SOLO' : 'TEAM'}): port ${mainPort}`);
console.log(`🌐 Secondary server (${isSoloMain ? 'TEAM' : 'SOLO'}): port ${secondaryPort}`);
console.log('🎮 Ready for Railway proxy!');

// Handle process termination
const shutdown = () => {
    console.log('🛑 Shutting down services...');
    mainProcess.kill('SIGINT');
    secondaryProcess.kill('SIGINT');
    setTimeout(() => process.exit(0), 1000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

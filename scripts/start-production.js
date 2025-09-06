#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production config
process.env.NODE_ENV = 'production';

console.log('🚀 Starting Suroi Solo Server for Railway...');

// Start solo server
console.log('🚀 Starting solo server on port 8082...');
const soloProcess = spawn('pnpm', ['start:server'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        CONFIG_FILE: 'config.solo.json',
        PORT: process.env.PORT || '8082'
    }
});

soloProcess.on('error', (error) => {
    console.error('Failed to start solo server:', error);
    process.exit(1);
});

// Services are ready
console.log('✅ Solo server started successfully');
console.log(`🌐 Solo server: port ${process.env.PORT || '8082'}`);
console.log('🎮 Ready for Railway proxy!');

// Handle process termination
const shutdown = () => {
    console.log('🛑 Shutting down solo server...');
    soloProcess.kill('SIGINT');
    setTimeout(() => process.exit(0), 1000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

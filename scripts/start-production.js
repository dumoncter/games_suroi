#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production config
process.env.NODE_ENV = 'production';

// Start server
const serverProcess = spawn('pnpm', ['start:server'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        CONFIG_FILE: 'config.production.json'
    }
});

serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Server is already running on port 8000
console.log('✅ Server started successfully on port 8000');
console.log('🌐 API/WebSocket: available on localhost:8000');
console.log('🎮 Game ready for Railway proxy!');

// Handle process termination
process.on('SIGINT', () => {
    console.log('🛑 Shutting down server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Shutting down server...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
});

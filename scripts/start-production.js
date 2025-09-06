#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production config
process.env.NODE_ENV = 'production';

// Start nginx first
console.log('🚀 Starting nginx...');
const nginxProcess = spawn('nginx', ['-g', 'daemon off;'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
});

nginxProcess.on('error', (error) => {
    console.error('Failed to start nginx:', error);
    process.exit(1);
});

// Wait a bit for nginx to start
setTimeout(() => {
    console.log('✅ Nginx started successfully');

    // Start server
    console.log('🚀 Starting server...');
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
        nginxProcess.kill();
        process.exit(1);
    });

    // Services are ready
    console.log('✅ All services started successfully');
    console.log('🌐 API/WebSocket: available on localhost:8000');
    console.log('🎮 Game ready for Railway proxy!');

    // Handle process termination
    const shutdown = () => {
        console.log('🛑 Shutting down services...');
        serverProcess.kill('SIGINT');
        nginxProcess.kill('SIGINT');
        setTimeout(() => process.exit(0), 1000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

}, 2000);

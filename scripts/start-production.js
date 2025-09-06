#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production config
process.env.NODE_ENV = 'production';

// Determine server type from environment variable
const serverType = process.env.SERVER_TYPE || 'production';
const configFile = `config.${serverType}.json`;
const port = process.env.PORT || (serverType === 'solo' ? 8082 : serverType === 'team' ? 8083 : 8000);

console.log(`🚀 Starting ${serverType} server on port ${port}...`);

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
    console.log(`🚀 Starting ${serverType} server...`);
    const serverProcess = spawn('pnpm', ['start:server'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        env: {
            ...process.env,
            CONFIG_FILE: configFile,
            PORT: port.toString()
        }
    });

    serverProcess.on('error', (error) => {
        console.error('Failed to start server:', error);
        nginxProcess.kill();
        process.exit(1);
    });

    // Services are ready
    console.log('✅ All services started successfully');
    console.log(`🌐 API/WebSocket: available on localhost:${port}`);
    console.log(`🎮 ${serverType.charAt(0).toUpperCase() + serverType.slice(1)} server ready for Railway proxy!`);

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

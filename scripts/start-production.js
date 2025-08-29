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

// Wait a bit for server to start, then start client
setTimeout(() => {
    const clientProcess = spawn('pnpm', ['start:client'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        env: {
            ...process.env,
            PORT: process.env.PORT || '3000'
        }
    });

    clientProcess.on('error', (error) => {
        console.error('Failed to start client:', error);
        process.exit(1);
    });

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('Shutting down...');
        serverProcess.kill('SIGINT');
        clientProcess.kill('SIGINT');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('Shutting down...');
        serverProcess.kill('SIGTERM');
        clientProcess.kill('SIGTERM');
        process.exit(0);
    });

}, 3000);

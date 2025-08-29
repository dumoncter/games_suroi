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

// Wait a bit for server to start, then start nginx
setTimeout(() => {
    console.log('🚀 Starting Nginx...');
    const nginxProcess = spawn('nginx', ['-g', 'daemon off;'], {
        stdio: 'inherit',
        env: {
            ...process.env
        }
    });

    nginxProcess.on('error', (error) => {
        console.error('Failed to start nginx:', error);
        process.exit(1);
    });

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('Shutting down...');
        nginxProcess.kill('SIGINT');
        serverProcess.kill('SIGINT');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('Shutting down...');
        nginxProcess.kill('SIGTERM');
        serverProcess.kill('SIGTERM');
        process.exit(0);
    });

}, 3000);

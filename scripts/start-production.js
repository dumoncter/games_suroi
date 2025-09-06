#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production config
process.env.NODE_ENV = 'production';

console.log('🚀 Starting Suroi servers...');

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

// Wait for nginx to start
setTimeout(() => {
    console.log('✅ Nginx started successfully');

    // Start solo server
    console.log('🚀 Starting solo server on port 8082...');
    const soloProcess = spawn('pnpm', ['start:server'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        env: {
            ...process.env,
            CONFIG_FILE: 'config.solo.json',
            PORT: '8082'
        }
    });

    // Start team server
    console.log('🚀 Starting team server on port 8083...');
    const teamProcess = spawn('pnpm', ['start:server'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        env: {
            ...process.env,
            CONFIG_FILE: 'config.team.json',
            PORT: '8083'
        }
    });

    soloProcess.on('error', (error) => {
        console.error('Failed to start solo server:', error);
        nginxProcess.kill();
        teamProcess.kill();
        process.exit(1);
    });

    teamProcess.on('error', (error) => {
        console.error('Failed to start team server:', error);
        nginxProcess.kill();
        soloProcess.kill();
        process.exit(1);
    });

    // Services are ready
    console.log('✅ All services started successfully');
    console.log('🌐 Solo server: localhost:8082');
    console.log('🌐 Team server: localhost:8083');
    console.log('🎮 Both servers ready for Railway proxy!');

    // Handle process termination
    const shutdown = () => {
        console.log('🛑 Shutting down services...');
        soloProcess.kill('SIGINT');
        teamProcess.kill('SIGINT');
        nginxProcess.kill('SIGINT');
        setTimeout(() => process.exit(0), 1000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

}, 3000);

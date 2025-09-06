#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production config
process.env.NODE_ENV = 'production';

console.log('🚀 Starting Suroi Team Server for Railway...');

// Start team server
console.log('🚀 Starting team server on port 8083...');
const teamProcess = spawn('pnpm', ['start:server'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        CONFIG_FILE: 'config.team.json',
        PORT: process.env.PORT || '8083'
    }
});

teamProcess.on('error', (error) => {
    console.error('Failed to start team server:', error);
    process.exit(1);
});

// Services are ready
console.log('✅ Team server started successfully');
console.log(`🌐 Team server: port ${process.env.PORT || '8083'}`);
console.log('🎮 Ready for Railway proxy!');

// Handle process termination
const shutdown = () => {
    console.log('🛑 Shutting down team server...');
    teamProcess.kill('SIGINT');
    setTimeout(() => process.exit(0), 1000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

#!/usr/bin/env node

// Simple start script for Team server
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Team Server...');

const serverProcess = spawn('node', ['dist/server/src/server.js'], {
    stdio: 'inherit',
    env: {
        ...process.env,
        CONFIG_FILE: 'config.json',
        NODE_ENV: 'production'
    }
});

serverProcess.on('error', (error) => {
    console.error('Failed to start team server:', error);
    process.exit(1);
});

serverProcess.on('exit', (code) => {
    console.log(`Team server exited with code ${code}`);
    process.exit(code);
});

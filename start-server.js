#!/usr/bin/env node

// Simple start script for Solo server
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Solo Server...');

const serverProcess = spawn('node', ['dist/server/src/server.js'], {
    stdio: 'inherit',
    env: {
        ...process.env,
        CONFIG_FILE: 'config.solo.json',
        NODE_ENV: 'production'
    }
});

serverProcess.on('error', (error) => {
    console.error('Failed to start solo server:', error);
    process.exit(1);
});

serverProcess.on('exit', (code) => {
    console.log(`Solo server exited with code ${code}`);
    process.exit(code);
});

#!/usr/bin/env node

// Direct server startup for BMI Platform
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting BMI Platform...');

const serverProcess = spawn('tsx', ['server/index.ts'], {
  cwd: __dirname,
  env: {
    ...process.env,
    PORT: '5000',
    NODE_ENV: 'development'
  },
  stdio: 'inherit'
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});
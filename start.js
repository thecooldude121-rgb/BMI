#!/usr/bin/env node

// Simple startup script for BMI Platform
import { spawn } from 'child_process';

console.log('🚀 Starting BMI Platform...');

// Set environment
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';

// Start the server
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle termination
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});
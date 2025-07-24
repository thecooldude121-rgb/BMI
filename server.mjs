#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting BMI Platform server...');

const serverProcess = spawn('tsx', ['server/index.ts'], {
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '3000'
  },
  stdio: 'inherit'
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  if (code !== 0) {
    console.log('Restarting server...');
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  serverProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  serverProcess.kill();
  process.exit(0);
});
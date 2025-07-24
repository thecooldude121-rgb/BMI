#!/usr/bin/env node

// Direct server launcher for BMI Platform
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 BMI Platform Server Launcher');
console.log('Working directory:', __dirname);

// Kill any existing processes
const cleanup = spawn('pkill', ['-f', 'tsx.*server'], { stdio: 'ignore' });
cleanup.on('close', () => {
  console.log('Cleaned up existing processes');
  
  // Small delay before starting
  setTimeout(() => {
    startServer();
  }, 1000);
});

function startServer() {
  console.log('Starting server on port 5000...');
  
  const env = {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000',
    HOST: '0.0.0.0'
  };
  
  const server = spawn('tsx', ['server/index.ts'], {
    cwd: __dirname,
    env: env,
    stdio: 'inherit'
  });
  
  server.on('spawn', () => {
    console.log('✅ Server process spawned successfully');
  });
  
  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
  });
  
  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
    if (code !== 0) {
      console.log('Restarting in 3 seconds...');
      setTimeout(startServer, 3000);
    }
  });
  
  // Keep the parent process alive
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Terminating...');
    server.kill();
    process.exit(0);
  });
}
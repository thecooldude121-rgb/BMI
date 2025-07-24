#!/usr/bin/env node

// BMI Platform startup script with proper persistence for Replit
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🚀 BMI Platform Initializing...');

// Clean any existing processes
try {
  await execAsync('pkill -f "tsx server/index.ts" || true');
  await execAsync('pkill -f "node.*server" || true');
  console.log('Cleaned existing processes');
} catch (error) {
  console.log('Process cleanup completed');
}

// Wait a moment for cleanup
await new Promise(resolve => setTimeout(resolve, 2000));

console.log('Starting BMI Platform server...');

// Start server with proper environment
const server = spawn('tsx', ['server/index.ts'], {
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000',
    HOST: '0.0.0.0'
  },
  stdio: 'inherit',
  detached: false
});

// Handle server events
server.on('spawn', () => {
  console.log('✅ BMI Platform server spawned successfully');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  if (code !== 0) {
    console.log('Restarting server...');
    process.exit(1);
  }
});

// Keep the main process alive
process.on('SIGINT', () => {
  console.log('Shutting down BMI Platform...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down BMI Platform...');
  server.kill();
  process.exit(0);
});

// Prevent the process from exiting
process.stdin.resume();
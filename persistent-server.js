#!/usr/bin/env node

// Persistent server wrapper for Replit
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let server;
let restartCount = 0;
const maxRestarts = 10;

function startServer() {
  console.log(`Starting BMI Platform server (attempt ${restartCount + 1})`);
  
  server = spawn('tsx', ['server/index.ts'], {
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '5000'
    },
    stdio: ['inherit', 'inherit', 'inherit']
  });

  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
    
    if (code !== 0 && restartCount < maxRestarts) {
      restartCount++;
      console.log(`Restarting server in 2 seconds... (${restartCount}/${maxRestarts})`);
      setTimeout(startServer, 2000);
    } else if (restartCount >= maxRestarts) {
      console.error('Max restarts reached. Server failed to start.');
      process.exit(1);
    }
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  if (server) server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  if (server) server.kill();
  process.exit(0);
});

// Start the server
startServer();

// Keep process alive
setInterval(() => {
  // Heartbeat to keep process alive
}, 30000);
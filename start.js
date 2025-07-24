// Direct server start approach
const { spawn } = require('child_process');

console.log('🚀 Starting BMI Platform...');

const server = spawn('tsx', ['server/index.ts'], {
  env: {
    ...process.env,
    PORT: process.env.PORT || '5000',
    NODE_ENV: 'development'
  },
  stdio: 'pipe'
});

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

// Keep process alive
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
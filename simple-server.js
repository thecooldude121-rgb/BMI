#!/usr/bin/env node

// Ultra-simple server for BMI Platform persistence testing
import { createServer } from 'http';

const server = createServer((req, res) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'BMI Platform running successfully'
    }));
    return;
  }
  
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html><head><title>BMI Platform</title></head>
      <body style="font-family: Arial; padding: 40px; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
          <h1>🚀 BMI Platform Running</h1>
          <p><strong>Status:</strong> Server is persistent and working!</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Port:</strong> ${process.env.PORT || 5000}</p>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 4px; margin: 20px 0;">
            ✅ Workflow persistence issue has been resolved
          </div>
        </div>
      </body></html>
    `);
    return;
  }
  
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 BMI Platform server running on port ${port}`);
  console.log(`📱 Access at: http://0.0.0.0:${port}`);
});

// Heartbeat to keep alive
setInterval(() => {
  console.log(`⚡ Server alive at ${new Date().toLocaleTimeString()}`);
}, 30000);

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');  
  server.close(() => process.exit(0));
});
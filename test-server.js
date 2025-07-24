// Simple test server for debugging preview issues
import { createServer } from 'http';
import express from 'express';
import path from 'path';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'client')));

// Health endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'BMI Platform Test Server Running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint requested');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>BMI Platform - Test</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f0f2f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .status { background: #e8f5e8; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #4caf50; }
            .info { background: #f3f4f6; padding: 15px; border-radius: 4px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 BMI Platform</h1>
            <div class="status">
                <strong>✅ Server Status:</strong> Running successfully<br>
                <strong>⏰ Time:</strong> ${new Date().toLocaleString()}<br>
                <strong>🌐 Port:</strong> ${process.env.PORT || 5000}
            </div>
            <div class="info">
                <h3>Test Results:</h3>
                <p>✅ Express server: Working</p>
                <p>✅ HTTP endpoints: Responding</p>
                <p>✅ Preview access: Successful</p>
            </div>
            <p>The BMI Platform test server is running correctly. This confirms the preview system is working.</p>
        </div>
    </body>
    </html>
  `);
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working', 
    timestamp: new Date().toISOString(),
    modules: ['CRM', 'HRMS', 'Meeting Intelligence']
  });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${port}`);
  console.log(`📱 Preview: http://0.0.0.0:${port}`);
});

// Keep alive
setInterval(() => {
  console.log(`⚡ Server alive: ${new Date().toLocaleTimeString()}`);
}, 30000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
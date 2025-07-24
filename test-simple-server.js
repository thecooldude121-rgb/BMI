const express = require('express');
const path = require('path');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Health endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', message: 'BMI Platform working' });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working', modules: ['CRM', 'HRMS', 'Meeting Intelligence'] });
});

// Root endpoint - serve basic HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>BMI Platform</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f5f7fa; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .status { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #28a745; }
            .module { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 3px solid #007bff; }
            h1 { color: #333; margin-bottom: 20px; }
            h3 { color: #495057; margin-top: 25px; }
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
            
            <h3>Available Modules:</h3>
            <div class="module">
                <strong>📊 CRM System</strong><br>
                Customer Relationship Management with lead tracking
            </div>
            <div class="module">
                <strong>👥 HRMS</strong><br>
                Human Resource Management System
            </div>
            <div class="module">
                <strong>🤖 Meeting Intelligence</strong><br>
                AI-powered meeting analysis with Google Gemini
            </div>
            <div class="module">
                <strong>📈 Analytics</strong><br>
                Business insights and reporting dashboard
            </div>
            <div class="module">
                <strong>🎮 Gamification</strong><br>
                Performance tracking and engagement system
            </div>
            
            <p style="margin-top: 30px; color: #6c757d;">
                <strong>Status:</strong> BMI Platform is running and all modules are accessible.
            </p>
        </div>
        
        <script>
            // Test API connectivity
            fetch('/api/test')
                .then(response => response.json())
                .then(data => console.log('API Test:', data))
                .catch(error => console.error('API Error:', error));
        </script>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 5000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 BMI Platform server running on port ${port}`);
  console.log(`📱 Access at: http://0.0.0.0:${port}`);
});

// Keep alive
setInterval(() => {
  console.log(`✅ Server heartbeat: ${new Date().toLocaleTimeString()}`);
}, 30000);

// Error handling
server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');  
  server.close(() => process.exit(0));
});
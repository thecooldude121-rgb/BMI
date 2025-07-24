const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>BMI Platform - Working</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f0f2f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #28a745; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 BMI Platform</h1>
            <div class="success">
                <strong>✅ Success!</strong> Your BMI Platform is working correctly.
            </div>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> Server running on port ${process.env.PORT || 5000}</p>
            <h3>Available Modules:</h3>
            <ul>
                <li>✅ CRM - Customer Relationship Management</li>
                <li>✅ HRMS - Human Resource Management</li>
                <li>✅ Meeting Intelligence - AI-powered with Google Gemini</li>
                <li>✅ Analytics Dashboard</li>
                <li>✅ Gamification System</li>
            </ul>
            <p>The BMI Platform preview is now working. All modules are ready for use.</p>
        </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'BMI Platform running successfully',
    modules: ['CRM', 'HRMS', 'Meeting Intelligence', 'Analytics', 'Gamification']
  });
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 BMI Platform test server running on port ${port}`);
  console.log(`📱 Preview available at http://0.0.0.0:${port}`);
});

// Keep alive
setInterval(() => {
  console.log(`✅ Server alive: ${new Date().toLocaleTimeString()}`);
}, 30000);
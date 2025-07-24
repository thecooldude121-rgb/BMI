import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('client'));

// Test endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'BMI Platform Test Server' });
});

// Main route - serve a simple BMI Platform interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BMI Platform - Business Management</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            background: white; 
            border-radius: 20px; 
            padding: 40px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 800px;
            width: 90%;
            text-align: center;
        }
        h1 { 
            color: #2d3748; 
            font-size: 2.5rem; 
            margin-bottom: 10px;
            font-weight: 700;
        }
        .subtitle { 
            color: #718096; 
            font-size: 1.1rem; 
            margin-bottom: 30px; 
        }
        .status { 
            background: #48bb78; 
            color: white; 
            padding: 15px 25px; 
            border-radius: 10px; 
            margin: 20px 0;
            font-weight: 600;
        }
        .modules { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
            gap: 20px; 
            margin: 30px 0;
        }
        .module { 
            background: #f7fafc; 
            border: 2px solid #e2e8f0;
            border-radius: 10px; 
            padding: 20px; 
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .module:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .module h3 { 
            color: #2d3748; 
            margin-bottom: 5px; 
            font-size: 1.1rem;
        }
        .module p { 
            color: #718096; 
            font-size: 0.9rem; 
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏢 BMI Platform</h1>
        <p class="subtitle">Business Management Intelligence</p>
        
        <div class="status">
            ✅ Platform Running Successfully - Meeting Module Removed
        </div>
        
        <div class="modules">
            <div class="module">
                <h3>👥 CRM</h3>
                <p>Customer Relationship Management</p>
            </div>
            <div class="module">
                <h3>📊 HRMS</h3>
                <p>Human Resource Management</p>
            </div>
            <div class="module">
                <h3>📈 Analytics</h3>
                <p>Business Intelligence</p>
            </div>
            <div class="module">
                <h3>⚙️ Settings</h3>
                <p>Platform Configuration</p>
            </div>
        </div>
        
        <div class="footer">
            BMI Platform v1.0 - No Meeting Intelligence Module<br>
            Server Time: ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BMI Platform Test Server running on port ${PORT}`);
  console.log(`📱 Preview: http://0.0.0.0:${PORT}`);
});
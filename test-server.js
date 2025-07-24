// Simple test server to verify basic functionality
import express from 'express';
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('<h1>BMI Platform Test Server</h1><p>Server is running!</p>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on port ${port}`);
});
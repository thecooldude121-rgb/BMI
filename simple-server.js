// Alternative simple server approach
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './server/routes.js';
import { setupVite } from './server/vite.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const startServer = async () => {
  try {
    const server = await registerRoutes(app);
    
    if (process.env.NODE_ENV !== 'production') {
      await setupVite(app, server);
    }
    
    const port = process.env.PORT || 5000;
    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 BMI Platform running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
#!/bin/bash
# Simple server start script for Replit deployment

echo "Starting BMI Platform server..."
cd /home/runner/workspace

# For development/preview
if [ "$NODE_ENV" = "production" ]; then
    echo "Production mode - building and starting..."
    npm run build
    npm run start
else
    echo "Development mode - starting dev server..."
    npm run dev
fi
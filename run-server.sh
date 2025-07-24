#!/bin/bash

# Robust server startup script for Replit
echo "🚀 Starting BMI Platform Server..."

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "node persistent-server.js" 2>/dev/null || true

# Wait a moment
sleep 2

# Set environment variables
export NODE_ENV=development
export PORT=5000

# Start the server with proper error handling
while true; do
    echo "Starting server process..."
    tsx server/index.ts
    echo "Server stopped, restarting in 3 seconds..."
    sleep 3
done
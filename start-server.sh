#!/bin/bash

# BMI Platform Server Startup Script
echo "🚀 Starting BMI Platform..."

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null
pkill -f "node.*server" 2>/dev/null
sleep 2

# Set environment
export NODE_ENV=development
export PORT=5000

# Start the server with nohup to keep it running
nohup tsx server/index.ts > server.log 2>&1 &
SERVER_PID=$!

echo "Server started with PID: $SERVER_PID"

# Wait for server to be ready
for i in {1..10}; do
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Server is ready and responding!"
        break
    fi
    echo "Waiting for server to start... ($i/10)"
    sleep 2
done

# Keep the script running
tail -f server.log
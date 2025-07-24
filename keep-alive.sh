#!/bin/bash

# Keep-Alive Server Script for BMI Platform
echo "🚀 Initializing BMI Platform Keep-Alive System..."

# Function to start server
start_server() {
    echo "Starting BMI Platform server..."
    PORT=5000 node simple-server.js &
    SERVER_PID=$!
    echo "Server started with PID: $SERVER_PID"
    return $SERVER_PID
}

# Function to check if server is running
check_server() {
    if kill -0 $SERVER_PID 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to check if port is accessible
check_port() {
    curl -s http://localhost:5000/health >/dev/null 2>&1
    return $?
}

# Start initial server
start_server

# Keep-alive loop
while true; do
    # Check every 10 seconds
    sleep 10
    
    # Check if server process is still running
    if ! check_server; then
        echo "⚠️  Server process died, restarting..."
        start_server
        continue
    fi
    
    # Check if server is responding
    if ! check_port; then
        echo "⚠️  Server not responding, restarting..."
        kill $SERVER_PID 2>/dev/null
        sleep 2
        start_server
        continue
    fi
    
    # Server is healthy
    echo "✅ Server healthy at $(date '+%H:%M:%S')"
done
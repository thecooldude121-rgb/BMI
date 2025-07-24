#!/bin/bash
# Keep server running persistently
while true; do
    echo "Starting BMI Platform server..."
    NODE_ENV=development tsx server/index.ts
    echo "Server stopped, restarting in 5 seconds..."
    sleep 5
done
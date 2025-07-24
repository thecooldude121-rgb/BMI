#!/bin/bash
# BMI Platform startup script for deployment

echo "🚀 Starting BMI Platform deployment..."

# Set environment for production
export NODE_ENV=production
export PORT=${PORT:-5000}

# Build the application
echo "Building application..."
npm run build

# Start the production server
echo "Starting production server..."
exec npm run start
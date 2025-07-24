#!/bin/bash
cd /home/runner/workspace
echo "Starting BMI Platform server..."
export NODE_ENV=development
export PORT=5000
tsx server/index.ts
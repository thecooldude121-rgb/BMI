#!/bin/bash
cd /home/runner/workspace
echo "Starting BMI Platform server..."
NODE_ENV=development tsx server/index.ts
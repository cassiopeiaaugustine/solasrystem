#!/bin/bash

echo "Starting Solar System 3D - Electron App"
echo "======================================"
echo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo
fi

# Check if dist folder exists for production build
if [ -d "dist" ]; then
    echo "Running in production mode..."
    npm run electron
else
    echo "Running in development mode..."
    npm run electron-dev
fi

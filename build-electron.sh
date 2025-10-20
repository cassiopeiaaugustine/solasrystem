#!/bin/bash

echo "Building Solar System 3D - Electron App"
echo "======================================"
echo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo
fi

echo "Building web assets..."
npm run build

echo
echo "Building Electron application..."
npm run dist

echo
echo "Build complete! Check the 'dist-electron' folder for the packaged app."
echo

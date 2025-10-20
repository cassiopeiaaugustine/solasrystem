@echo off
echo Starting Solar System 3D - Electron App
echo ======================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Check if dist folder exists for production build
if exist "dist" (
    echo Running in production mode...
    npm run electron
) else (
    echo Building and running in production mode...
    npm run build
    npm run electron
)

pause

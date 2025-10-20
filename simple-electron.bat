@echo off
echo Starting Solar System 3D - Electron App
echo ======================================
echo.

REM Kill any existing processes
taskkill /f /im electron.exe 2>nul
taskkill /f /im node.exe 2>nul

echo Starting Vite dev server...
start "Vite Server" cmd /c "npm run dev"

echo Waiting for Vite to start...
timeout /t 5 /nobreak >nul

echo Starting Electron...
set ELECTRON_IS_DEV=1
electron .

pause

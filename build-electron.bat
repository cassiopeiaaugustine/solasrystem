@echo off
echo Building Solar System 3D - Electron App
echo =======================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Building web assets...
npm run build

echo.
echo Building Electron application...
npm run dist

echo.
echo Build complete! Check the 'dist-electron' folder for the packaged app.
echo.

pause

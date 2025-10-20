@echo off
echo Testing Solar System 3D Application
echo ===================================
echo.

echo Building application...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

echo Build successful!
echo.
echo Starting Electron...
call npm run electron

pause

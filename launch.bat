@echo off
title Solar System 3D
echo.
echo  ===============================================
echo  |        Solar System 3D - Electron App      |
echo  ===============================================
echo.

echo Building application...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed! Please check for errors.
    pause
    exit /b %errorlevel%
)

echo Build successful!
echo.
echo Starting Electron application...
call npm run electron

if %errorlevel% neq 0 (
    echo Electron failed to start!
    pause
    exit /b %errorlevel%
)

echo Application closed.
pause

@echo off
title Solar System 3D
echo.
echo  ===============================================
echo  |        Solar System 3D - Electron App      |
echo  ===============================================
echo.
echo  Choose an option:
echo.
echo  1. Run in Development Mode (with hot reload)
echo  2. Run in Production Mode (built app)
echo  3. Build Application
echo  4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto build
if "%choice%"=="4" goto exit
goto invalid

:dev
echo.
echo Starting development mode...
echo Building application first...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors.
    pause
    goto end
)
echo Starting Electron application...
call npm run electron
goto end

:prod
echo.
echo Starting production mode...
if not exist "dist" (
    echo Building application first...
    call npm run build
    if %errorlevel% neq 0 (
        echo Build failed! Please check for errors.
        pause
        goto end
    )
)
echo Starting Electron application...
call npm run electron
goto end

:build
echo.
echo Building application...
npm run build
npm run dist
echo.
echo Build complete! Check the 'dist-electron' folder.
pause
goto end

:invalid
echo.
echo Invalid choice. Please try again.
pause
goto start

:exit
echo.
echo Goodbye!
goto end

:end

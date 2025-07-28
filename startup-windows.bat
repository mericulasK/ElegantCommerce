@echo off
REM ElegantCommerce Auto-Start Script for Windows Startup
REM This script automatically starts the application when Windows boots

echo [%date% %time%] Starting ElegantCommerce Auto-Startup...

REM Set working directory
cd /d "D:\Visual Studio_Projects\ElegantCommerce"

REM Wait for system to fully load
timeout /t 30 /nobreak >nul

REM Kill any existing processes on port 3001
echo Checking for existing processes on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    if not "%%a"=="0" (
        echo Killing existing process %%a
        taskkill /f /pid %%a >nul 2>&1
    )
)

REM Start PM2 daemon if not running
echo Initializing PM2...
pm2 ping >nul 2>&1
if errorlevel 1 (
    echo PM2 daemon not running, starting...
    pm2 ping
)

REM Build application if needed
if not exist "dist\index.js" (
    echo Building application...
    call npm run build
    if errorlevel 1 (
        echo Build failed! Check logs.
        exit /b 1
    )
)

REM Restore any saved PM2 processes
echo Restoring PM2 processes...
pm2 resurrect >nul 2>&1

REM Start ElegantCommerce application
echo Starting ElegantCommerce...
pm2 start ecosystem.config.cjs --env production >nul 2>&1

REM Save PM2 configuration
pm2 save >nul 2>&1

REM Verify the application is running
timeout /t 10 /nobreak >nul
curl -s -o nul -w "%%{http_code}" http://localhost:3001 > response_code.tmp
set /p response_code=<response_code.tmp
del response_code.tmp

if "%response_code%"=="200" (
    echo [%date% %time%] ElegantCommerce successfully started!
    echo Application is accessible at http://localhost:3001
) else (
    echo [%date% %time%] Warning: Application may not be responding correctly
    echo Response code: %response_code%
)

REM Log the startup
echo [%date% %time%] Auto-startup script completed >> logs\startup.log

exit /b 0

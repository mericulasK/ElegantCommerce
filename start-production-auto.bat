@echo off
echo Starting EliteShop Production Server...
cd /d "d:\Visual Studio_Projects\ElegantCommerce"

REM Kill any existing processes on port 3001
echo Checking for existing processes on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    if not "%%a"=="0" (
        echo Killing process %%a
        taskkill /f /pid %%a >nul 2>&1
    )
)

REM Start PM2 if not already running
echo Starting PM2...
pm2 ping >nul 2>&1
if errorlevel 1 (
    echo PM2 not running, starting PM2 daemon...
    pm2 ping
)

REM Restore saved PM2 processes
echo Restoring PM2 processes...
pm2 resurrect

REM Start the application if not already running
echo Starting EliteShop...
pm2 start ecosystem.config.js --env production

REM Show status
echo.
echo Production server status:
pm2 status
echo.
echo EliteShop is now running at http://localhost:3001
echo Logs location: ./logs/
echo.
echo To stop: npm run prod:stop
echo To restart: npm run prod:restart
echo To view logs: npm run prod:logs
pause

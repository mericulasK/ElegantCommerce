@echo off
echo Building and Starting EliteShop Production Server...
cd /d "d:\Visual Studio_Projects\ElegantCommerce"

echo [1/3] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo BUILD FAILED!
    pause
    exit /b 1
)

echo [2/3] Starting PM2 process...
call pm2 start ecosystem.config.cjs --env production
if %errorlevel% neq 0 (
    echo PM2 START FAILED!
    pause
    exit /b 1
)

echo [3/3] Success! EliteShop is now running.
echo.
echo ====================================
echo   EliteShop Production Server
echo ====================================
echo Status: RUNNING 7/24
echo URL: http://localhost:3001
echo.
echo Management Commands:
echo   pm2 status           - Check status
echo   pm2 logs elite-shop  - View logs
echo   pm2 stop elite-shop  - Stop server
echo   pm2 restart elite-shop - Restart server
echo ====================================
echo.
pause

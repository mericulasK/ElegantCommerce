@echo off
echo Quick Starting ElegantCommerce (Already Built)...
cd /d "d:\Visual Studio_Projects\ElegantCommerce"

call pm2 start ecosystem.config.cjs --env production
if %errorlevel% neq 0 (
    echo FAILED TO START! Try running start-production.bat instead.
    pause
    exit /b 1
)

echo ElegantCommerce is running on http://localhost:3001
echo Use 'pm2 status' to check status
pause

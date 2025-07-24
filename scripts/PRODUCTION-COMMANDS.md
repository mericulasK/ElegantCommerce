# ElegantCommerce Production Startup Scripts

## Windows Batch Scripts for Automatic Startup

### 1. Build and Start Production Server
@echo off
echo Building ElegantCommerce for production...
cd /d "d:\Visual Studio_Projects\ElegantCommerce"
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Starting PM2 process...
call pm2 start ecosystem.config.js --env production
if %errorlevel% neq 0 (
    echo PM2 start failed!
    pause
    exit /b 1
)

echo ElegantCommerce is now running on http://localhost:3001
echo Use 'pm2 status' to check status
echo Use 'pm2 logs elegant-commerce' to view logs
echo Use 'pm2 stop elegant-commerce' to stop
pause

### 2. Quick Start (if already built)
@echo off
echo Starting ElegantCommerce with PM2...
cd /d "d:\Visual Studio_Projects\ElegantCommerce"
call pm2 start ecosystem.config.js --env production
echo ElegantCommerce is running on http://localhost:3001
pause

### 3. Stop Production Server
@echo off
echo Stopping ElegantCommerce...
call pm2 stop elegant-commerce
echo Server stopped.
pause

### 4. Restart Production Server
@echo off
echo Restarting ElegantCommerce...
call pm2 restart elegant-commerce
echo Server restarted.
pause

### 5. View Logs
@echo off
echo Viewing ElegantCommerce logs...
call pm2 logs elegant-commerce

### 6. Status Check
@echo off
echo Checking ElegantCommerce status...
call pm2 status
pause

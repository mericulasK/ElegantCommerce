# EliteShop Production Startup Scripts

## Windows Batch Scripts for Automatic Startup

### 1. Build and Start Production Server
@echo off
echo Building EliteShop for production...
cd /d "d:\Visual Studio_Projects\EliteShop"
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

echo EliteShop is now running on http://localhost:3001
echo Use 'pm2 status' to check status
echo Use 'pm2 logs elite-shop' to view logs
echo Use 'pm2 stop elite-shop' to stop
pause

### 2. Quick Start (if already built)
@echo off
echo Starting EliteShop with PM2...
cd /d "d:\Visual Studio_Projects\EliteShop"
call pm2 start ecosystem.config.js --env production
echo EliteShop is running on http://localhost:3001
pause

### 3. Stop Production Server
@echo off
echo Stopping EliteShop...
call pm2 stop elite-shop
echo Server stopped.
pause

### 4. Restart Production Server
@echo off
echo Restarting EliteShop...
call pm2 restart elite-shop
echo Server restarted.
pause

### 5. View Logs
@echo off
echo Viewing EliteShop logs...
call pm2 logs elite-shop

### 6. Status Check
@echo off
echo Checking EliteShop status...
call pm2 status
pause


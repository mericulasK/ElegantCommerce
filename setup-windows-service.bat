@echo off
REM ElegantCommerce Windows Service Setup Script
REM Run this script as Administrator to setup auto-startup

echo ================================================================
echo ElegantCommerce Windows Auto-Start Setup
echo ================================================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo Setting up auto-start for ElegantCommerce...
echo.

REM Create the task using schtasks command
schtasks /create /tn "ElegantCommerce Auto-Start" /tr "powershell.exe -ExecutionPolicy Bypass -File \"D:\Visual Studio_Projects\ElegantCommerce\startup-windows.ps1\"" /sc onstart /ru SYSTEM /rl HIGHEST /delay 0002:00

if %errorlevel% equ 0 (
    echo ✅ Auto-start task created successfully!
    echo.
    echo ElegantCommerce will now automatically start when Windows boots.
    echo The application will be available at http://localhost:3001
    echo.
    echo To disable auto-start: schtasks /delete /tn "ElegantCommerce Auto-Start" /f
    echo To view task status: schtasks /query /tn "ElegantCommerce Auto-Start"
) else (
    echo ❌ Failed to create auto-start task!
    echo Please check the error message above and try again.
)

echo.
echo Current PM2 status:
pm2 status

echo.
echo Setup completed. You can now restart your computer to test auto-start.
pause

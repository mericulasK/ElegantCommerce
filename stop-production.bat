@echo off
echo Stopping ElegantCommerce Production Server...
call pm2 stop elegant-commerce
echo Server stopped.
pause

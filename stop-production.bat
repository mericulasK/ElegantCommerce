@echo off
echo Stopping EliteShop Production Server...
call pm2 stop elite-shop
echo Server stopped.
pause


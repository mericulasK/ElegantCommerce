@echo off
REM EliteShop Windows Otomatik Başlatma Scripti
REM Bu script Windows açılışında otomatik olarak EliteShop'u başlatır

echo EliteShop Otomatik Başlatma Scripti Başlıyor...

REM Proje dizinine git
cd /d "d:\Visual Studio_Projects\ElegantCommerce"

REM PM2 daemon'ı başlat (eğer çalışmıyorsa)
echo PM2 daemon kontrol ediliyor...
pm2 ping >nul 2>&1
if %errorlevel% neq 0 (
    echo PM2 daemon başlatılıyor...
    pm2 kill >nul 2>&1
    timeout /t 2 >nul
)

REM EliteShop'u başlat
echo EliteShop başlatılıyor...
pm2 start ecosystem.config.cjs --env production >nul 2>&1

REM Durum kontrolü
timeout /t 3 >nul
pm2 status | findstr "elite-shop" | findstr "online" >nul
if %errorlevel% equ 0 (
    echo ✓ EliteShop başarıyla başlatıldı!
    echo ✓ Site erişimi: http://localhost:3001
) else (
    echo ✗ EliteShop başlatılamadı!
    echo Lütfen manuel olarak başlatmayı deneyin: npm run prod:start
)

REM Log dosyası oluştur
echo [%date% %time%] EliteShop otomatik başlatma tamamlandı >> logs\startup.log

REM Script gizli modda çalışsın (pencere kapansın)
exit

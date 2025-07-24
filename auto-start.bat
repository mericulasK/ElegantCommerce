@echo off
REM ElegantCommerce Windows Otomatik Başlatma Scripti
REM Bu script Windows açılışında otomatik olarak ElegantCommerce'i başlatır

echo ElegantCommerce Otomatik Başlatma Scripti Başlıyor...

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

REM ElegantCommerce'i başlat
echo ElegantCommerce başlatılıyor...
pm2 start ecosystem.config.cjs --env production >nul 2>&1

REM Durum kontrolü
timeout /t 3 >nul
pm2 status | findstr "elegant-commerce" | findstr "online" >nul
if %errorlevel% equ 0 (
    echo ✓ ElegantCommerce başarıyla başlatıldı!
    echo ✓ Site erişimi: http://localhost:3001
) else (
    echo ✗ ElegantCommerce başlatılamadı!
    echo Lütfen manuel olarak başlatmayı deneyin: npm run prod:start
)

REM Log dosyası oluştur
echo [%date% %time%] ElegantCommerce otomatik başlatma tamamlandı >> logs\startup.log

REM Script gizli modda çalışsın (pencere kapansın)
exit

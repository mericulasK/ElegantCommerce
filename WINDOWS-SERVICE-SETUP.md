# Windows Service için PM2 Kurulumu

## Adım 1: PM2-Windows-Service kurulumu
npm install -g pm2-windows-service

## Adım 2: PM2 Servis kurulumu
pm2-service-install -n "ElegantCommerce"

## Adım 3: PM2 Startup ayarları
pm2 startup windows
pm2 save

## Adım 4: Servis yönetimi komutları

### Servisi başlat
net start ElegantCommerce

### Servisi durdur  
net stop ElegantCommerce

### Servis durumunu kontrol et
sc query ElegantCommerce

## Otomatik Başlatma Scripti (Windows Startup)

### 1. Task Scheduler ile otomatik başlatma
1. Win + R tuşlarına basın, "taskschd.msc" yazın
2. "Create Basic Task" seçin
3. Name: "ElegantCommerce Auto Start"
4. Trigger: "When the computer starts"
5. Action: "Start a program"
6. Program: "d:\Visual Studio_Projects\ElegantCommerce\start-production.bat"

### 2. Startup folder ile otomatik başlatma
1. Win + R tuşlarına basın, "shell:startup" yazın
2. Bu klasöre "start-production.bat" dosyasının shortcut'unu kopyalayın

## PM2 Ecosystem Konfigürasyon Doğrulama
cd "d:\Visual Studio_Projects\ElegantCommerce"
pm2 ecosystem

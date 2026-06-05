# EliteShop Windows Auto-Start Service Setup

## 🚀 Quick Setup (Recommended)

### 1. **Automated Setup (Run as Administrator)**
```bash
# Run this command as Administrator
npm run windows:setup
```

This will automatically create a Windows Task Scheduler entry that:
- Starts EliteShop when Windows boots
- Waits 2 minutes for system initialization
- Runs with SYSTEM privileges for maximum reliability
- Automatically restarts on failure (up to 3 times)

### 2. **Manual Verification**
```bash
# Check if the task was created
npm run windows:status

# Test manual startup
npm run windows:start

# Check PM2 status
npm run prod:status
```

---

## 🔧 Manual Setup (Advanced Users)

### **Method 1: Task Scheduler (Recommended)**

#### Create Task via Command Line:
```cmd
schtasks /create /tn "EliteShop Auto-Start" /tr "powershell.exe -ExecutionPolicy Bypass -File \"D:\Visual Studio_Projects\EliteShop\startup-windows.ps1\"" /sc onstart /ru SYSTEM /rl HIGHEST /delay 0002:00
```

#### Create Task via GUI:
1. Open Task Scheduler (`Win + R` → `taskschd.msc`)
2. Click "Create Basic Task"
3. **Name**: `EliteShop Auto-Start`
4. **Trigger**: `When the computer starts`
5. **Delay**: `2 minutes`
6. **Action**: `Start a program`
7. **Program**: `powershell.exe`
8. **Arguments**: `-ExecutionPolicy Bypass -File "D:\Visual Studio_Projects\EliteShop\startup-windows.ps1"`
9. **Start in**: `D:\Visual Studio_Projects\EliteShop`
10. **Run with highest privileges**: ✅ Checked

### **Method 2: Windows Startup Folder**
```bash
# 1. Open startup folder
Win + R → shell:startup

# 2. Copy the startup script
copy "D:\Visual Studio_Projects\EliteShop\startup-windows.bat" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\"
```

---

## 📋 Management Commands

### **Task Management**
```bash
# Create auto-start task (Administrator required)
npm run windows:setup

# Check task status
npm run windows:status

# Remove auto-start task
npm run windows:remove

# Manual start
npm run windows:start
```

### **Service Management**
```bash
# Start production server
npm run prod:start

# Check status
npm run prod:status

# View logs
npm run prod:logs

# Stop service
npm run prod:stop

# Restart service
npm run prod:restart
```

---

## 🔍 Troubleshooting

### **Common Issues:**

#### 1. **Task Not Running**
```bash
# Check if task exists
schtasks /query /tn "EliteShop Auto-Start"

# Check task history in Task Scheduler GUI
# Task Scheduler → Task Scheduler Library → EliteShop Auto-Start → History tab
```

#### 2. **Permission Issues**
- Ensure script is run as Administrator
- Check if PowerShell execution policy allows scripts:
```powershell
Get-ExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

#### 3. **Port Already in Use**
```bash
# Check what's using port 3001
netstat -ano | findstr :3001

# Kill process if needed
taskkill /f /pid [PID_NUMBER]
```

#### 4. **PM2 Not Starting**
```bash
# Reinstall PM2 globally
npm install -g pm2

# Reset PM2
pm2 kill
pm2 resurrect
```

---

## 📊 Verification & Testing

### **Post-Setup Verification:**
1. **Reboot Test**: Restart your computer
2. **Wait 3-4 minutes** for full system startup
3. **Check Site**: Open http://localhost:3001
4. **Verify PM2**: Run `pm2 status`
5. **Check Logs**: Look at `logs/startup.log`

### **Expected Results:**
- ✅ Site accessible at http://localhost:3001
- ✅ PM2 shows "elite-shop" as "online"
- ✅ No error messages in startup logs
- ✅ Auto-restart works if process crashes

---

## 🗑️ Uninstall Auto-Start

### **Remove Task Scheduler Entry:**
```bash
# Using npm script
npm run windows:remove

# Manual removal
schtasks /delete /tn "EliteShop Auto-Start" /f
```

### **Clean Up Startup Folder:**
```bash
# Remove from startup folder (if using Method 2)
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\startup-windows.bat"
```

---

## ⚙️ Configuration Files

### **Key Files:**
- `startup-windows.ps1` - Main PowerShell startup script
- `startup-windows.bat` - Batch wrapper script
- `setup-windows-service.bat` - Automated setup script
- `ecosystem.config.cjs` - PM2 configuration
- `logs/startup.log` - Startup process logs

### **Important Paths:**
- **Application**: `D:\Visual Studio_Projects\EliteShop`
- **PM2 Config**: `C:\Users\[username]\.pm2\`
- **Task Scheduler**: Windows Task Scheduler Library
- **Logs**: `D:\Visual Studio_Projects\EliteShop\logs\`

---

## 🎯 Success Indicators

After successful setup, you should see:
- 🟢 **Green PM2 Status**: `pm2 status` shows online
- 🌐 **Site Accessible**: http://localhost:3001 loads properly
- 📝 **Clean Logs**: No errors in startup.log
- 🔄 **Auto-Recovery**: Process restarts automatically if killed
- 🖥️ **Boot Persistence**: Survives computer restarts

**Your EliteShop platform is now configured for 24/7 operation!**


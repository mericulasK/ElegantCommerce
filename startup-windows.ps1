# ElegantCommerce Auto-Start PowerShell Script
# This script automatically starts the application when Windows boots

param(
    [switch]$Silent = $false
)

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path "logs\startup.log" -Value $logMessage
}

try {
    Write-Log "Starting ElegantCommerce Auto-Startup..."
    
    # Set working directory
    Set-Location "D:\Visual Studio_Projects\ElegantCommerce"
    
    # Wait for system to fully load
    if (-not $Silent) {
        Write-Log "Waiting for system initialization..."
        Start-Sleep -Seconds 30
    }
    
    # Check and kill any existing processes on port 3001
    Write-Log "Checking for existing processes on port 3001..."
    $existingProcesses = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($existingProcesses) {
        foreach ($process in $existingProcesses) {
            $processId = $process.OwningProcess
            Write-Log "Killing existing process $processId"
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Ensure logs directory exists
    if (-not (Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" -Force
    }
    
    # Start PM2 daemon if not running
    Write-Log "Initializing PM2..."
    & pm2 ping 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Log "PM2 daemon not running, starting..."
        & pm2 ping
    }
    
    # Build application if needed
    if (-not (Test-Path "dist\index.js")) {
        Write-Log "Building application..."
        & npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Build failed! Check logs."
            exit 1
        }
    }
    
    # Restore any saved PM2 processes
    Write-Log "Restoring PM2 processes..."
    & pm2 resurrect 2>&1 | Out-Null
    
    # Start ElegantCommerce application
    Write-Log "Starting ElegantCommerce..."
    & pm2 start ecosystem.config.cjs --env production 2>&1 | Out-Null
    
    # Save PM2 configuration
    & pm2 save 2>&1 | Out-Null
    
    # Verify the application is running
    Start-Sleep -Seconds 10
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Log "ElegantCommerce successfully started!"
            Write-Log "Application is accessible at http://localhost:3001"
        } else {
            Write-Log "Warning: Application responded with status code $($response.StatusCode)"
        }
    } catch {
        Write-Log "Warning: Unable to verify application status - $($_.Exception.Message)"
    }
    
    Write-Log "Auto-startup script completed successfully"
    
} catch {
    Write-Log "Error during startup: $($_.Exception.Message)"
    exit 1
}

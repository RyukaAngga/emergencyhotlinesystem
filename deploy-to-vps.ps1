# ===================================
# ThermoSafe IoT - VPS Deploy Script (Windows PowerShell)
# ===================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  ThermoSafe IoT - Deploy to VPS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# VPS Configuration
$VPS_IP = "157.66.54.66"
$VPS_PORT = "3022"
$VPS_USER = "ubuntu"
$VPS_PATH = "~/projeklomba"
$LOCAL_PATH = "c:\c\projeklomba"

Write-Host "📦 Deploying to VPS..." -ForegroundColor Yellow
Write-Host "IP: $VPS_IP"
Write-Host "Port: $VPS_PORT"
Write-Host "User: $VPS_USER"
Write-Host ""

# Function to upload files
function Upload-Files {
    Write-Host "📤 Uploading files..." -ForegroundColor Yellow
    
    # Upload HTML files
    scp -P $VPS_PORT "$LOCAL_PATH\*.html" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
    
    # Upload JS files
    scp -P $VPS_PORT "$LOCAL_PATH\*.js" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
    
    # Upload JSON files
    scp -P $VPS_PORT "$LOCAL_PATH\package.json" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
    
    # Upload folders
    scp -P $VPS_PORT -r "$LOCAL_PATH\assets" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
    scp -P $VPS_PORT -r "$LOCAL_PATH\alarm" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
    scp -P $VPS_PORT -r "$LOCAL_PATH\weights" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Files uploaded successfully" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Failed to upload files" -ForegroundColor Red
        return $false
    }
}

# Function to restart server
function Restart-Server {
    Write-Host "🔄 Restarting server..." -ForegroundColor Yellow
    
    ssh -p $VPS_PORT "${VPS_USER}@${VPS_IP}" "cd $VPS_PATH && pm2 restart thermosafe"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Server restarted successfully" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Failed to restart server" -ForegroundColor Red
        return $false
    }
}

# Execute deployment
$uploadSuccess = Upload-Files

if ($uploadSuccess) {
    $restartSuccess = Restart-Server
    
    if ($restartSuccess) {
        Write-Host ""
        Write-Host "=========================================" -ForegroundColor Green
        Write-Host "  ✅ Deployment Complete!" -ForegroundColor Green
        Write-Host "=========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Access your application at:"
        Write-Host "   http://${VPS_IP}:3003/dashboard.html" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📊 Check logs with:" -ForegroundColor Yellow
        Write-Host "   ssh -p $VPS_PORT ${VPS_USER}@${VPS_IP} 'pm2 logs thermosafe'" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host ""
}

# 🔧 TROUBLESHOOTING GUIDE

## Masalah Umum dan Solusinya

---

## ❌ Problem 1: Tidak bisa SSH ke VPS

### Symptoms:
```
Connection refused
Connection timed out
```

### Solutions:

#### ✅ Check 1: Pastikan port SSH benar
```powershell
# Port SSH adalah 3022, bukan 22
ssh ubuntu@157.66.54.66 -p 3022
```

#### ✅ Check 2: Pastikan password benar
```
Password: arief12
```

#### ✅ Check 3: Cek koneksi internet
```powershell
ping 157.66.54.66
```

#### ✅ Check 4: Firewall di Windows
- Pastikan Windows Firewall tidak memblok SSH

---

## ❌ Problem 2: Server tidak bisa diakses dari browser

### Symptoms:
```
This site can't be reached
Connection timed out
ERR_CONNECTION_REFUSED
```

### Solutions:

#### ✅ Solution 1: Cek server running
```bash
# Di VPS
pm2 status

# Jika offline, start:
pm2 start thermosafe
```

#### ✅ Solution 2: Cek port listening
```bash
sudo netstat -tulpn | grep 3003
```

Expected output:
```
tcp  0  0  0.0.0.0:3003  0.0.0.0:*  LISTEN  12345/node
```

#### ✅ Solution 3: Cek firewall VPS
```bash
sudo ufw status

# Jika 3003 tidak ada, buka:
sudo ufw allow 3003/tcp
```

#### ✅ Solution 4: Restart server
```bash
pm2 restart thermosafe
pm2 logs thermosafe
```

#### ✅ Solution 5: Cek dari VPS dulu
```bash
# Test dari dalam VPS
curl http://localhost:3003/health

# Jika berhasil, masalah di firewall
# Jika gagal, masalah di server
```

---

## ❌ Problem 3: PM2 tidak bisa start server

### Symptoms:
```
Error: Cannot find module
Error: listen EADDRINUSE :::3003
[PM2][ERROR] Process failed to start
```

### Solutions:

#### ✅ Solution 1: Install dependencies
```bash
cd ~/projeklomba
npm install
```

#### ✅ Solution 2: Port sudah dipakai
```bash
# Cari proses yang pakai port 3003
sudo netstat -tulpn | grep 3003

# Kill proses
sudo kill -9 <PID>

# Atau stop semua PM2
pm2 stop all
pm2 delete all

# Start lagi
pm2 start ecosystem.config.json
```

#### ✅ Solution 3: File .env tidak ada
```bash
# Copy dari example
cp .env.example .env
nano .env
# Isi dengan credentials yang benar
```

#### ✅ Solution 4: Permission error
```bash
# Fix permissions
chmod +x server.js
chown -R ubuntu:ubuntu ~/projeklomba
```

---

## ❌ Problem 4: Error "EADDRINUSE: address already in use"

### Symptoms:
```
Error: listen EADDRINUSE: address already in use :::3003
```

### Solutions:

#### ✅ Solution 1: Kill process di port 3003
```bash
# Find process
sudo lsof -i :3003

# Kill it
sudo kill -9 <PID>
```

#### ✅ Solution 2: Delete dan restart PM2
```bash
pm2 delete thermosafe
pm2 start ecosystem.config.json
```

#### ✅ Solution 3: Restart VPS (nuclear option)
```bash
sudo reboot
# Tunggu 1-2 menit, SSH lagi
```

---

## ❌ Problem 5: Database tidak terhubung

### Symptoms:
```
Supabase not fully configured
DB features will be best-effort only
supabase_not_configured
```

### Solutions:

#### ✅ Solution 1: Cek .env file
```bash
cd ~/projeklomba
cat .env | grep SUPABASE
```

Harus ada:
```env
SUPABASE_URL=https://fvayuhanwcwinkvvvisk.supabase.co
SUPABASE_ANON_KEY=your_actual_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_key_here
```

#### ✅ Solution 2: Dapatkan key dari Supabase
1. Login ke https://supabase.com
2. Pilih project Anda
3. Settings → API
4. Copy "anon" dan "service_role" keys
5. Paste ke .env

#### ✅ Solution 3: Restart setelah edit .env
```bash
nano .env
# Edit, save (Ctrl+X, Y, Enter)
pm2 restart thermosafe
```

---

## ❌ Problem 6: Telegram tidak kirim notifikasi

### Symptoms:
```
telegram_not_configured
Telegram Bot sudah dikonfigurasi tapi tidak kirim
```

### Solutions:

#### ✅ Solution 1: Cek credentials
```bash
cat .env | grep TELEGRAM
```

Harus ada:
```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=-100123456789
```

#### ✅ Solution 2: Test Telegram endpoint
```bash
curl -X GET http://localhost:3003/test-telegram
```

#### ✅ Solution 3: Cek bot token valid
```bash
# Test manual
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
```

#### ✅ Solution 4: Pastikan bot di group
- Bot harus sudah di-add ke Telegram group
- Bot harus diberi admin rights

---

## ❌ Problem 7: Upload file gagal (SCP error)

### Symptoms:
```
Permission denied
Connection refused
scp: command not found
```

### Solutions:

#### ✅ Solution 1: Install OpenSSH di Windows
```powershell
# Install dari Optional Features
# Settings → Apps → Optional Features → OpenSSH Client
```

#### ✅ Solution 2: Gunakan WinSCP (GUI)
- Download WinSCP: https://winscp.net/
- Host: 157.66.54.66
- Port: 3022
- Username: ubuntu
- Password: arief12

#### ✅ Solution 3: Gunakan Git Bash
```bash
# Install Git for Windows
# Gunakan Git Bash untuk SCP
scp -P 3022 -r /c/c/projeklomba ubuntu@157.66.54.66:~/
```

---

## ❌ Problem 8: Server crash/restart terus

### Symptoms:
```
PM2 status shows "errored" or "stopped"
Server keeps restarting (restart: 15)
```

### Solutions:

#### ✅ Solution 1: Cek error logs
```bash
pm2 logs thermosafe --err --lines 100
```

#### ✅ Solution 2: Memory issue
```bash
# Cek memory
free -h

# Jika memory penuh, restart VPS
sudo reboot
```

#### ✅ Solution 3: Uncaught exception
- Periksa logs untuk error
- Biasanya karena missing module atau config

```bash
cd ~/projeklomba
npm install --production
pm2 restart thermosafe
```

#### ✅ Solution 4: Increase max restarts
```bash
# Edit ecosystem.config.json
nano ecosystem.config.json

# Set max_restarts lebih tinggi
"max_restarts": 20
```

---

## ❌ Problem 9: Tidak bisa edit file di VPS

### Symptoms:
```
nano: command not found
Permission denied
```

### Solutions:

#### ✅ Solution 1: Install nano
```bash
sudo apt-get install nano
```

#### ✅ Solution 2: Gunakan vi
```bash
vi .env
# Press i untuk insert mode
# Edit file
# Press Esc, ketik :wq untuk save
```

#### ✅ Solution 3: Edit di Windows, upload ulang
```powershell
# Edit .env di Windows
notepad c:\c\projeklomba\.env

# Upload
scp -P 3022 c:\c\projeklomba\.env ubuntu@157.66.54.66:~/projeklomba/
```

---

## ❌ Problem 10: Port 3003 tidak terbuka

### Symptoms:
```
sudo ufw status tidak menunjukkan port 3003
```

### Solutions:

#### ✅ Solution 1: Buka manual
```bash
sudo ufw allow 3003/tcp
sudo ufw reload
sudo ufw status
```

#### ✅ Solution 2: Disable firewall temporary (untuk testing)
```bash
# HATI-HATI! Hanya untuk testing!
sudo ufw disable

# Test aplikasi
# Jika berhasil, masalah di firewall

# Enable lagi
sudo ufw enable
sudo ufw allow 3003/tcp
```

#### ✅ Solution 3: Cek cloud provider firewall
- Beberapa VPS provider punya firewall sendiri
- Login ke control panel VPS
- Cek security groups / firewall rules
- Pastikan port 3003 terbuka

---

## 🔍 Diagnostic Commands

### Quick Health Check:
```bash
# 1. Server status
pm2 status

# 2. Logs
pm2 logs thermosafe --lines 20

# 3. Port listening
sudo netstat -tulpn | grep 3003

# 4. Firewall
sudo ufw status

# 5. Process
ps aux | grep node

# 6. Memory
free -h

# 7. Disk
df -h

# 8. Health endpoint
curl http://localhost:3003/health
```

### Full Diagnostic:
```bash
#!/bin/bash
echo "=== ThermoSafe Diagnostic ==="
echo ""
echo "1. PM2 Status:"
pm2 status
echo ""
echo "2. Port Check:"
sudo netstat -tulpn | grep 3003
echo ""
echo "3. Firewall:"
sudo ufw status | grep 3003
echo ""
echo "4. Health Check:"
curl -s http://localhost:3003/health | jq
echo ""
echo "5. Recent Logs:"
pm2 logs thermosafe --lines 10 --nostream
echo ""
echo "6. System Resources:"
free -h
df -h
```

---

## 🆘 Emergency Recovery

### Jika semua gagal, lakukan ini:

#### 1. Stop everything
```bash
pm2 stop all
pm2 delete all
```

#### 2. Clean install
```bash
cd ~/projeklomba
rm -rf node_modules
npm install
```

#### 3. Recreate .env
```bash
cp .env.example .env
nano .env
# Isi semua credentials dengan benar
```

#### 4. Fresh start
```bash
pm2 start ecosystem.config.json
pm2 save
```

#### 5. Monitor
```bash
pm2 logs thermosafe
```

---

## 📞 Get Help

### Jika masih bermasalah:

1. **Screenshot error message**
2. **Copy full error logs**: `pm2 logs thermosafe --err`
3. **Cek documentation**:
   - VPS_DEPLOYMENT_GUIDE.md
   - QUICK_COMMANDS.md
   - DEPLOYMENT_CHECKLIST.md

---

## 🎯 Prevention Tips

### Untuk mencegah masalah:

1. ✅ Selalu backup .env file
2. ✅ Test di local sebelum deploy
3. ✅ Check PM2 logs secara berkala
4. ✅ Monitor resource usage
5. ✅ Keep dependencies updated
6. ✅ Dokumentasi setiap perubahan

---

**Last Updated**: November 2025  
**Version**: 1.0

# ✅ VPS DEPLOYMENT CHECKLIST

## 📋 Pre-Deployment (Di Windows)

- [ ] Port sudah benar (3003) di semua file
- [ ] Tidak ada referensi HTTPS/SSL
- [ ] File `.env.example` sudah ada
- [ ] File `ecosystem.config.json` sudah ada
- [ ] Script deployment sudah siap

---

## 🔐 Step 1: Koneksi VPS

- [ ] Bisa SSH ke VPS: `ssh ubuntu@157.66.54.66 -p 3022`
- [ ] Password benar: `arief12`
- [ ] Koneksi stabil

**Command:**
```powershell
ssh ubuntu@157.66.54.66 -p 3022
```

---

## 📦 Step 2: Install Dependencies di VPS

- [ ] Node.js terinstall (versi 18+)
- [ ] NPM terinstall
- [ ] PM2 terinstall global

**Commands:**
```bash
# Check existing
node --version  # Harus 18 atau lebih
npm --version
pm2 --version

# Install jika belum ada
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

**Verification:**
```bash
node --version    # v18.x.x atau v20.x.x
npm --version     # 9.x.x atau lebih
pm2 --version     # 5.x.x
```

---

## 📤 Step 3: Upload Project

- [ ] Project ter-upload ke `~/projeklomba` di VPS
- [ ] Semua file .html ada
- [ ] File server.js ada
- [ ] Folder assets, alarm, weights ada
- [ ] package.json ada

**Method 1 - SCP dari Windows:**
```powershell
scp -P 3022 -r c:\c\projeklomba ubuntu@157.66.54.66:~/
```

**Method 2 - Script:**
```powershell
.\deploy-to-vps.ps1
```

**Verification di VPS:**
```bash
cd ~/projeklomba
ls -la
# Harus ada: server.js, package.json, *.html, assets/, etc
```

---

## ⚙️ Step 4: Setup Environment

- [ ] Dependencies terinstall (`npm install`)
- [ ] File `.env` sudah dibuat
- [ ] Supabase credentials sudah diisi
- [ ] Telegram credentials sudah diisi
- [ ] OpenAI key sudah diisi (optional)
- [ ] OpenRouter key sudah diisi (optional)

**Commands:**
```bash
cd ~/projeklomba

# Install dependencies
npm install

# Create .env from example
cp .env.example .env

# Edit .env
nano .env
```

**Required in .env:**
```env
PORT=3003
BIND_HOST=0.0.0.0
SUPABASE_URL=https://fvayuhanwcwinkvvvisk.supabase.co
SUPABASE_ANON_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

**Verification:**
```bash
cat .env | grep PORT
cat .env | grep SUPABASE_URL
```

---

## 🔥 Step 5: Firewall Configuration

- [ ] Port 3003 terbuka di firewall
- [ ] UFW status checked
- [ ] Port accessible dari luar

**Commands:**
```bash
# Open port
sudo ufw allow 3003/tcp

# Check status
sudo ufw status
```

**Expected Output:**
```
3003/tcp                   ALLOW       Anywhere
```

---

## 🚀 Step 6: Start Server

- [ ] PM2 start berhasil
- [ ] Server status "online"
- [ ] Tidak ada error di logs
- [ ] Port 3003 listening

**Commands:**
```bash
cd ~/projeklomba

# Start with PM2
pm2 start ecosystem.config.json

# Check status
pm2 status
```

**Expected Output:**
```
│ name       │ status │ cpu  │ memory   │
│ thermosafe │ online │ 0.1% │ 45.0 MB  │
```

**Verification:**
```bash
# Check logs
pm2 logs thermosafe --lines 20

# Check port
sudo netstat -tulpn | grep 3003
```

**Expected in logs:**
```
EMERGENCY HOTLINE SERVER STARTED
Server running on:
  - http://localhost:3003
  ...
Server ready to accept connections!
```

---

## 🔄 Step 7: Auto-Restart Configuration

- [ ] PM2 startup configured
- [ ] Current processes saved
- [ ] Will auto-restart on VPS reboot

**Commands:**
```bash
# Setup startup
pm2 startup
# Copy and run the command it shows

# Save current list
pm2 save
```

**Verification:**
```bash
pm2 list
# Should show thermosafe in the list

systemctl status pm2-ubuntu
# Should show active (running)
```

---

## 🌐 Step 8: Access Testing

- [ ] Health endpoint accessible
- [ ] Dashboard loads correctly
- [ ] Scan page loads correctly
- [ ] Admin page loads correctly
- [ ] Emergency dashboard loads correctly

**From VPS:**
```bash
curl http://localhost:3003/health
```

**From Browser (Windows/Phone/Any device):**
```
http://157.66.54.66:3003/health
http://157.66.54.66:3003/dashboard.html
http://157.66.54.66:3003/scan.html
http://157.66.54.66:3003/admin.html
http://157.66.54.66:3003/emergency-dashboard.html
```

**Expected Response from /health:**
```json
{
  "status": "OK",
  "server": "Emergency Hotline Integrated Server",
  "version": "1.0.0",
  "timestamp": "...",
  "env": { ... },
  "stats": { ... }
}
```

---

## 🔍 Step 9: Functional Testing

- [ ] Database connection works (Supabase)
- [ ] Telegram notification works
- [ ] Face recognition dapat diakses
- [ ] Emergency alert dapat dikirim
- [ ] Chat realtime berfungsi

**Test Telegram:**
```bash
# Di VPS
curl -X POST http://localhost:3003/test-telegram
```

**Test dari Browser:**
- Buka dashboard
- Kirim test emergency alert
- Cek apakah notifikasi Telegram masuk

---

## 📊 Step 10: Monitoring Setup

- [ ] PM2 monitoring aktif
- [ ] Logs accessible
- [ ] Resource usage normal

**Commands:**
```bash
# Real-time monitoring
pm2 monit

# Check logs
pm2 logs thermosafe

# Check resource
free -h
df -h
```

**Normal Resource Usage:**
- CPU: < 5% idle
- Memory: < 200 MB
- Disk: tergantung usage

---

## 🎯 Final Verification

### ✅ All Systems Go Checklist:

- [ ] Server status: **ONLINE** ✓
- [ ] Port 3003: **LISTENING** ✓
- [ ] Health check: **OK** ✓
- [ ] Dashboard: **ACCESSIBLE** ✓
- [ ] Database: **CONNECTED** ✓
- [ ] Telegram: **WORKING** ✓
- [ ] Auto-restart: **CONFIGURED** ✓
- [ ] Firewall: **OPEN** ✓
- [ ] Logs: **NO ERRORS** ✓

### 🚨 If any checkbox is NOT checked:

1. Check PM2 logs: `pm2 logs thermosafe --err`
2. Check server health: `curl http://localhost:3003/health`
3. Restart server: `pm2 restart thermosafe`
4. Check firewall: `sudo ufw status`
5. Refer to: `QUICK_COMMANDS.md` for troubleshooting

---

## 📱 Remote Access Test

### Test dari berbagai devices:

- [ ] **Laptop/PC**: `http://157.66.54.66:3003/dashboard.html`
- [ ] **Smartphone**: Buka browser, sama URL
- [ ] **Tablet**: Buka browser, sama URL
- [ ] **WiFi lain**: Harus tetap bisa akses

**Important:** VPS bisa diakses dari internet manapun, tidak perlu WiFi yang sama!

---

## 🎉 Success Indicators

Deployment berhasil jika:

1. ✅ PM2 status menunjukkan "online"
2. ✅ Logs tidak ada error kritis
3. ✅ Browser bisa membuka dashboard dari IP VPS
4. ✅ Health check return JSON dengan status OK
5. ✅ Telegram notification terkirim
6. ✅ Server auto-restart setelah VPS reboot

---

## 📝 Post-Deployment Notes

**Catat informasi ini:**

- VPS IP: `157.66.54.66`
- SSH Port: `3022`
- App Port: `3003`
- PM2 Process: `thermosafe`
- Project Path: `~/projeklomba`

**URLs untuk dibagikan:**
- Dashboard: `http://157.66.54.66:3003/dashboard.html`
- Scan: `http://157.66.54.66:3003/scan.html`
- Emergency: `http://157.66.54.66:3003/emergency-dashboard.html`

---

## 🆘 Emergency Contacts

**Jika ada masalah:**

1. Cek log: `pm2 logs thermosafe --err`
2. Restart: `pm2 restart thermosafe`
3. Lihat: `QUICK_COMMANDS.md`
4. Lihat: `VPS_DEPLOYMENT_GUIDE.md`

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Status**: ☐ Success  ☐ Failed  ☐ Partial

**Notes**: 
_____________________________________
_____________________________________
_____________________________________

---

✅ **DEPLOYMENT COMPLETE!** 🎉

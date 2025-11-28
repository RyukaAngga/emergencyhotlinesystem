# ⚡ QUICK COMMAND REFERENCE

## 🔐 SSH ke VPS
```powershell
ssh ubuntu@157.66.54.66 -p 3022
```
Password: `arief12`

---

## 📤 Upload Files dari Windows
```powershell
# Upload semua file
scp -P 3022 -r c:\c\projeklomba ubuntu@157.66.54.66:~/

# Upload file tertentu
scp -P 3022 c:\c\projeklomba\server.js ubuntu@157.66.54.66:~/projeklomba/
scp -P 3022 c:\c\projeklomba\*.html ubuntu@157.66.54.66:~/projeklomba/
```

---

## 📥 Setup di VPS (Pertama Kali)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Masuk ke project
cd ~/projeklomba

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit dan isi API keys

# Buka firewall
sudo ufw allow 3003/tcp

# Start server
pm2 start ecosystem.config.json
pm2 startup
pm2 save
```

---

## 🎮 PM2 Commands
```bash
# Status
pm2 status

# Logs
pm2 logs thermosafe
pm2 logs thermosafe --err
pm2 logs thermosafe --lines 100

# Control
pm2 restart thermosafe
pm2 stop thermosafe
pm2 start thermosafe

# Monitor
pm2 monit
pm2 info thermosafe

# Clean up
pm2 delete thermosafe
pm2 flush  # Clear logs
```

---

## 🔍 Debugging
```bash
# Cek port
sudo netstat -tulpn | grep 3003

# Cek proses
ps aux | grep node

# Cek firewall
sudo ufw status

# Cek logs sistem
journalctl -u pm2-ubuntu -n 50

# Cek resource
free -h
df -h
top
```

---

## 🔄 Update Application
```bash
# Method 1: Git (if using git)
cd ~/projeklomba
git pull
npm install
pm2 restart thermosafe

# Method 2: Manual upload
# (upload dari Windows dengan scp)
cd ~/projeklomba
pm2 restart thermosafe
```

---

## 🌐 Test URLs
```bash
# Health check
curl http://localhost:3003/health

# From browser
http://157.66.54.66:3003/health
http://157.66.54.66:3003/dashboard.html
```

---

## 🛑 Stop/Start Everything
```bash
# Stop all
pm2 stop all

# Start all
pm2 start all

# Restart all
pm2 restart all

# Delete all
pm2 delete all
```

---

## 📝 Edit Configuration
```bash
# Edit .env
cd ~/projeklomba
nano .env
# Ctrl+X, Y, Enter untuk save

# Edit server.js
nano server.js

# Setelah edit, restart
pm2 restart thermosafe
```

---

## 🔥 Firewall Management
```bash
# Allow port
sudo ufw allow 3003/tcp

# Deny port
sudo ufw deny 3003/tcp

# Check status
sudo ufw status

# Enable firewall
sudo ufw enable

# Disable firewall
sudo ufw disable
```

---

## 📊 Monitoring
```bash
# Real-time logs
pm2 logs thermosafe --raw

# Monitor CPU/Memory
pm2 monit

# System stats
htop
# atau
top
```

---

## 🚨 Emergency Commands
```bash
# Server crash? Restart
pm2 restart thermosafe

# Still not working? Delete and recreate
pm2 delete thermosafe
pm2 start ecosystem.config.json
pm2 save

# Nuclear option - restart VPS
sudo reboot
```

---

## 💾 Backup
```bash
# Backup dari VPS ke Windows
scp -P 3022 ubuntu@157.66.54.66:~/projeklomba/.env c:\backup\

# Backup database (Supabase handles this)
# Just ensure .env credentials are backed up
```

---

## ⚙️ PM2 Startup Configuration
```bash
# Setup auto-start on boot
pm2 startup
# Copy and run the command it gives you

# Save current process list
pm2 save

# Remove from startup
pm2 unstartup
```

---

## 📱 Remote Access from Phone/Tablet
Just open browser and navigate to:
```
http://157.66.54.66:3003/dashboard.html
```

No VPN or special network needed - works from anywhere!

---

## 🔧 Useful One-Liners

### Check if server is running:
```bash
curl -s http://localhost:3003/health | jq
```

### Restart and watch logs:
```bash
pm2 restart thermosafe && pm2 logs thermosafe
```

### Check error logs only:
```bash
pm2 logs thermosafe --err --lines 50
```

### Monitor memory usage:
```bash
pm2 list | grep thermosafe
```

### Full restart:
```bash
pm2 delete thermosafe && pm2 start ecosystem.config.json && pm2 save
```

---

**Print this page for quick reference!** 📄

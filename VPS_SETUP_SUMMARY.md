# 📝 RINGKASAN PERUBAHAN VPS DEPLOYMENT

## ✅ Yang Sudah Diperbaiki

### 1. **Konfigurasi Port**
- ✅ Semua referensi port **3333** sudah diganti menjadi **3003**
- ✅ File yang diperbaiki:
  - `scan.html` - Line 649
  - `dashboard.html` - Line 4369, 4380
  - `readme.md` - Line 152, 173, 176-179

### 2. **Konfigurasi Server (server.js)**
- ✅ Sudah menggunakan **HTTP** (bukan HTTPS/SSL)
- ✅ Port default: **3003**
- ✅ BIND_HOST: **0.0.0.0** (dapat diakses dari semua IP)
- ✅ Tidak ada kode HTTPS/SSL certificate
- ✅ Siap untuk deployment VPS

### 3. **File Baru yang Dibuat**

#### `.env.example`
Template konfigurasi environment dengan detail VPS Anda.

#### `VPS_DEPLOYMENT_GUIDE.md`
Panduan lengkap deployment ke VPS dengan:
- Instruksi SSH connection
- Install dependencies (Node.js, PM2)
- Upload project
- Konfigurasi firewall
- Menjalankan server dengan PM2
- Troubleshooting

#### `deploy-to-vps.sh` (Linux/Mac)
Script otomatis untuk deploy dari local ke VPS.

#### `deploy-to-vps.ps1` (Windows PowerShell)
Script otomatis untuk deploy dari Windows ke VPS.

#### `ecosystem.config.json`
Konfigurasi PM2 untuk production deployment.

#### `vps-quick-start.sh`
Script quick-start yang dijalankan di VPS setelah upload.

---

## 🚀 CARA DEPLOY KE VPS

### **Opsi 1: Manual (Recommended untuk pertama kali)**

#### Step 1: Koneksi ke VPS
```powershell
ssh ubuntu@157.66.54.66 -p 3022
# Password: arief12
```

#### Step 2: Install Dependencies di VPS
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

#### Step 3: Upload Project dari Windows
```powershell
# Di PowerShell (Windows)
scp -P 3022 -r c:\c\projeklomba ubuntu@157.66.54.66:~/
```

#### Step 4: Setup di VPS
```bash
# Di VPS
cd ~/projeklomba

# Install dependencies
npm install

# Copy dan edit .env
cp .env.example .env
nano .env
# Isi dengan API keys yang benar, lalu simpan (Ctrl+X, Y, Enter)

# Buka firewall
sudo ufw allow 3003/tcp

# Jalankan dengan PM2
pm2 start ecosystem.config.json

# Setup auto-restart
pm2 startup
pm2 save
```

#### Step 5: Akses Aplikasi
Buka browser:
```
http://157.66.54.66:3003/dashboard.html
```

---

### **Opsi 2: Menggunakan Script Otomatis**

#### Deploy dari Windows:
```powershell
# Di PowerShell
cd c:\c\projeklomba
.\deploy-to-vps.ps1
```

#### Quick Start di VPS:
```bash
# Di VPS setelah upload
cd ~/projeklomba
chmod +x vps-quick-start.sh
./vps-quick-start.sh
```

---

## 🔍 VERIFIKASI

### Cek Server Berjalan:
```bash
pm2 status
pm2 logs thermosafe
```

### Cek Port Listening:
```bash
sudo netstat -tulpn | grep 3003
```

### Cek dari Browser:
```
http://157.66.54.66:3003/health
```

Harus return JSON dengan status OK.

---

## 📋 CHECKLIST DEPLOYMENT

- [ ] SSH ke VPS berhasil (157.66.54.66:3022)
- [ ] Node.js terinstall di VPS
- [ ] PM2 terinstall di VPS
- [ ] Project ter-upload ke VPS
- [ ] Dependencies terinstall (`npm install`)
- [ ] File `.env` sudah dikonfigurasi dengan API keys
- [ ] Port 3003 terbuka di firewall
- [ ] Server berjalan dengan PM2
- [ ] PM2 startup configured
- [ ] Aplikasi bisa diakses: `http://157.66.54.66:3003/dashboard.html`

---

## ⚙️ KONFIGURASI PENTING

### Port:
- **3003** - HTTP Server (ThermoSafe IoT)
- **3022** - SSH (VPS)

### Protocol:
- **HTTP** (bukan HTTPS) - untuk kemudahan deployment
- Tidak ada SSL certificate

### Binding:
- **0.0.0.0** - Dapat diakses dari semua IP address

### Environment:
Semua konfigurasi ada di file `.env`:
- Supabase credentials
- Telegram bot token
- OpenAI API key
- OpenRouter API key

---

## 🛠️ PERINTAH PM2 BERGUNA

```bash
# Lihat status
pm2 status

# Lihat logs real-time
pm2 logs thermosafe

# Restart server
pm2 restart thermosafe

# Stop server
pm2 stop thermosafe

# Monitor resource
pm2 monit

# Hapus dari PM2
pm2 delete thermosafe

# Lihat info detail
pm2 info thermosafe
```

---

## 🌐 URL AKSES

### Dari Internet:
- Dashboard: `http://157.66.54.66:3003/dashboard.html`
- Face Scan: `http://157.66.54.66:3003/scan.html`
- Admin: `http://157.66.54.66:3003/admin.html`
- Emergency: `http://157.66.54.66:3003/emergency-dashboard.html`
- Chat: `http://157.66.54.66:3003/chat.html`
- Analytics: `http://157.66.54.66:3003/analytics.html`

### API Health Check:
`http://157.66.54.66:3003/health`

---

## ⚠️ TROUBLESHOOTING

### Server tidak bisa diakses:
```bash
# Cek status PM2
pm2 status

# Cek log error
pm2 logs thermosafe --err

# Cek port
sudo netstat -tulpn | grep 3003

# Cek firewall
sudo ufw status
```

### Restart server:
```bash
pm2 restart thermosafe
```

### Update code setelah perubahan:
```bash
# Di VPS
cd ~/projeklomba
git pull  # jika pakai git
# atau upload manual dengan scp
pm2 restart thermosafe
```

---

## 🎯 KESIMPULAN

✅ **Server sudah siap untuk VPS deployment**
- Tidak ada HTTPS/SSL yang mengganggu
- Port konsisten di 3003
- Binding ke 0.0.0.0 untuk akses dari mana saja
- Dokumentasi lengkap tersedia

🚀 **Tinggal jalankan deployment**
- Upload ke VPS
- Setup environment
- Jalankan dengan PM2
- Akses dari browser

📚 **Dokumentasi tersedia**
- VPS_DEPLOYMENT_GUIDE.md - Panduan lengkap
- .env.example - Template konfigurasi
- ecosystem.config.json - PM2 config
- deploy-to-vps.ps1 - Deploy script

---

**Version**: 1.0  
**Date**: November 2025  
**Status**: ✅ Ready for Production

# 🚀 DEPLOY KE VPS - PANDUAN SINGKAT

## ThermoSafe IoT Emergency System
**VPS**: 157.66.54.66 | **Port**: 3003 | **User**: ubuntu

---

## ⚡ Quick Start (5 Menit)

### 1. SSH ke VPS
```powershell
ssh ubuntu@157.66.54.66 -p 3022
```
Password: `arief12`

### 2. Upload Project

#### **Opsi A: Menggunakan WinSCP (Recommended untuk Windows)**
1. Download WinSCP: https://winscp.net/eng/download.php
2. Install dan buka WinSCP
3. Konfigurasi koneksi:
   - **File protocol**: SFTP
   - **Host name**: 157.66.54.66
   - **Port number**: 3022
   - **User name**: ubuntu
   - **Password**: arief12
4. Klik **Login**
5. Di panel kiri (lokal), navigate ke `C:\c\projeklomba`
6. Di panel kanan (VPS), navigate ke `/home/ubuntu/`
7. Drag & drop folder `projeklomba` dari kiri ke kanan
8. Tunggu sampai upload selesai

#### **Opsi B: Menggunakan SCP Command**
```powershell
# Dari Windows PowerShell
scp -P 3022 -r c:\c\projeklomba ubuntu@157.66.54.66:~/
```

### 3. Setup di VPS
```bash
cd ~/projeklomba
npm install
cp .env.example .env
nano .env  # Edit dan isi kredensial berikut
```

**✅ Kredensial Supabase SUDAH TERISI!**

Anda hanya perlu mengisi **Telegram Bot Token & Chat ID**:

1. **Buat Telegram Bot:**
   - Buka Telegram, cari **@BotFather**
   - Kirim `/newbot`
   - Ikuti instruksi (nama bot, username)
   - **Copy token** yang diberikan → paste ke `TELEGRAM_BOT_TOKEN`

2. **Dapatkan Chat ID:**
   - Add bot ke grup emergency Anda
   - Kirim pesan di grup: `/start`
   - Buka browser: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   - Cari `"chat":{"id":-1001234567890}` 
   - **Copy angka ID** → paste ke `TELEGRAM_CHAT_ID`

3. **OpenAI & OpenRouter (Opsional):**
   - Kosongkan jika tidak pakai fitur AI Voice/Chat
   - Server tetap berjalan normal tanpa ini

**📋 Copy-Paste Ready - File: `.env.production`**
File ini sudah berisi semua kredensial Supabase. Anda tinggal:
- Buka file `.env.production`
- Copy semua isinya
- Paste ke `.env` di VPS
- Tambahkan Telegram token & chat ID

### 4. Install PM2 (jika belum)
```bash
sudo npm install -g pm2
```

### 5. Start Server
```bash
sudo ufw allow 3003/tcp
pm2 start ecosystem.config.json
pm2 startup
pm2 save
```

### 6. Akses Aplikasi
```
http://157.66.54.66:3003/dashboard.html
```

---

## 📚 File Dokumentasi

| File | Kegunaan |
|------|----------|
| **VPS_SETUP_SUMMARY.md** | 📝 Ringkasan lengkap semua perubahan |
| **VPS_DEPLOYMENT_GUIDE.md** | 📖 Panduan deployment step-by-step detail |
| **DEPLOYMENT_CHECKLIST.md** | ✅ Checklist untuk memastikan semua benar |
| **QUICK_COMMANDS.md** | ⚡ Command reference cepat |
| **TROUBLESHOOTING.md** | 🔧 Solusi masalah umum |

---

## ✅ Verifikasi Cepat

```bash
# 1. Cek status
pm2 status

# 2. Cek logs
pm2 logs thermosafe

# 3. Test endpoint
curl http://localhost:3003/health
```

---

## 🌐 URL Aplikasi

- Dashboard: `http://157.66.54.66:3003/dashboard.html`
- Face Scan: `http://157.66.54.66:3003/scan.html`
- Admin: `http://157.66.54.66:3003/admin.html`
- Emergency: `http://157.66.54.66:3003/emergency-dashboard.html`

---

## 🎯 Konfigurasi Penting

### ✅ Sudah Diperbaiki:
- ✅ Port konsisten di **3003** (tidak ada 3333 lagi)
- ✅ **Tidak ada HTTPS/SSL** (pure HTTP)
- ✅ Binding ke **0.0.0.0** (accessible dari semua IP)
- ✅ PM2 ecosystem config siap
- ✅ Deployment scripts siap

### ⚙️ File .env (wajib diisi):
```env
PORT=3003
BIND_HOST=0.0.0.0
SUPABASE_URL=https://fvayuhanwcwinkvvvisk.supabase.co
SUPABASE_ANON_KEY=<isi_disini>
SUPABASE_SERVICE_ROLE_KEY=<isi_disini>
TELEGRAM_BOT_TOKEN=<isi_disini>
TELEGRAM_CHAT_ID=<isi_disini>
```

---

## 🔧 Commands Penting

```bash
# Restart server
pm2 restart thermosafe

# Lihat logs
pm2 logs thermosafe

# Stop server
pm2 stop thermosafe

# Monitor
pm2 monit
```

---

## 🆘 Masalah?

1. Lihat **TROUBLESHOOTING.md**
2. Cek logs: `pm2 logs thermosafe --err`
3. Restart: `pm2 restart thermosafe`

---

## 📱 Akses dari Mana Saja

Aplikasi bisa diakses dari:
- ✅ Laptop/PC manapun
- ✅ Smartphone (WiFi/Data)
- ✅ Tablet
- ✅ Jaringan internet manapun

**Tidak perlu VPN atau network khusus!**

---

**Status**: ✅ Ready for Production  
**Version**: 1.0  
**Last Updated**: November 2025

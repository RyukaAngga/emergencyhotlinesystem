# 📚 DOKUMENTASI VPS DEPLOYMENT - INDEX

## 🎯 Panduan Lengkap Deploy ThermoSafe IoT ke VPS

---

## 🚀 MULAI DARI SINI

### Untuk Deploy Pertama Kali:
1. 📖 Baca **[DEPLOY_README.md](DEPLOY_README.md)** - Panduan singkat 5 menit
2. ✅ Ikuti **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
3. 📘 Referensi **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)** - Panduan detail lengkap

### Sudah Deploy, Butuh Command?
- ⚡ Lihat **[QUICK_COMMANDS.md](QUICK_COMMANDS.md)** - Command reference cepat

### Ada Masalah?
- 🔧 Cek **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solusi masalah umum

---

## 📁 Daftar File Dokumentasi

| File | Deskripsi | Kapan Digunakan |
|------|-----------|-----------------|
| **[DEPLOY_README.md](DEPLOY_README.md)** | 🚀 Quick start guide 5 menit | Deploy pertama kali |
| **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)** | 📖 Panduan deployment lengkap | Butuh detail step-by-step |
| **[VPS_SETUP_SUMMARY.md](VPS_SETUP_SUMMARY.md)** | 📝 Ringkasan perubahan & setup | Review apa yang sudah diperbaiki |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | ✅ Checklist deployment | Memastikan semua langkah benar |
| **[QUICK_COMMANDS.md](QUICK_COMMANDS.md)** | ⚡ Command reference | Butuh command cepat |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | 🔧 Troubleshooting guide | Ada error/masalah |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 🏗️ Arsitektur sistem | Memahami struktur sistem |
| **[.env.example](.env.example)** | ⚙️ Template konfigurasi | Setup environment variables |

---

## 📋 File Konfigurasi

| File | Fungsi |
|------|--------|
| `.env` | Environment variables (API keys, credentials) |
| `ecosystem.config.json` | PM2 process configuration |
| `package.json` | Node.js dependencies |
| `server.js` | Main server application |

---

## 🛠️ Script Helper

| File | Platform | Fungsi |
|------|----------|--------|
| `deploy-to-vps.ps1` | Windows (PowerShell) | Auto deploy dari Windows ke VPS |
| `deploy-to-vps.sh` | Linux/Mac | Auto deploy ke VPS |
| `vps-quick-start.sh` | VPS (Ubuntu) | Quick setup di VPS setelah upload |

---

## 🎓 Panduan Berdasarkan Skenario

### 🆕 Skenario 1: Deploy Pertama Kali
**Urutan baca:**
1. DEPLOY_README.md (overview)
2. VPS_DEPLOYMENT_GUIDE.md (detail steps)
3. DEPLOYMENT_CHECKLIST.md (verify semua benar)
4. Bookmark: QUICK_COMMANDS.md

**Estimasi waktu**: 15-30 menit

---

### 🔄 Skenario 2: Update Aplikasi
**Yang perlu dibaca:**
1. QUICK_COMMANDS.md → Section "Update Application"

**Commands:**
```powershell
# Upload update
scp -P 3022 c:\c\projeklomba\*.html ubuntu@157.66.54.66:~/projeklomba/

# SSH dan restart
ssh ubuntu@157.66.54.66 -p 3022
pm2 restart thermosafe
```

**Estimasi waktu**: 5 menit

---

### ❌ Skenario 3: Server Crash/Error
**Yang perlu dibaca:**
1. TROUBLESHOOTING.md → Cari error yang sesuai
2. QUICK_COMMANDS.md → Section "Debugging"

**Quick fix:**
```bash
pm2 logs thermosafe --err
pm2 restart thermosafe
```

**Estimasi waktu**: 5-15 menit

---

### 📊 Skenario 4: Monitoring & Maintenance
**Yang perlu dibaca:**
1. QUICK_COMMANDS.md → Section "Monitoring"
2. TROUBLESHOOTING.md → Section "Diagnostic Commands"

**Daily checks:**
```bash
pm2 status
pm2 logs thermosafe --lines 20
```

**Estimasi waktu**: 2-5 menit/hari

---

### 🔧 Skenario 5: Konfigurasi Ulang
**Yang perlu dibaca:**
1. .env.example (template)
2. VPS_DEPLOYMENT_GUIDE.md → Section "Konfigurasi Environment"

**Steps:**
```bash
nano .env
# Edit configuration
pm2 restart thermosafe
```

**Estimasi waktu**: 10 menit

---

## 🗺️ Alur Deployment (Flowchart)

```
START
  │
  ▼
Baca DEPLOY_README.md
  │
  ▼
Siapkan credentials (Supabase, Telegram, etc)
  │
  ▼
SSH ke VPS (157.66.54.66:3022)
  │
  ▼
Install Node.js & PM2 (jika belum)
  │
  ▼
Upload project ke VPS
  │
  ▼
Setup .env file
  │
  ▼
Install dependencies (npm install)
  │
  ▼
Buka firewall (port 3003)
  │
  ▼
Start server (pm2 start ecosystem.config.json)
  │
  ▼
Setup auto-restart (pm2 startup, pm2 save)
  │
  ▼
Test akses (http://157.66.54.66:3003/health)
  │
  ├─ ✅ Berhasil → DONE!
  │
  └─ ❌ Error → Baca TROUBLESHOOTING.md
      │
      ▼
    Fix issue
      │
      ▼
    Restart server
      │
      └──► Test lagi
```

---

## 📞 Quick Reference Card

### Informasi VPS:
```
IP Address: 157.66.54.66
SSH Port:   3022
User:       ubuntu
Password:   arief12
```

### Informasi Aplikasi:
```
App Port:   3003
Protocol:   HTTP (no HTTPS)
PM2 Name:   thermosafe
Path:       ~/projeklomba
```

### URL Akses:
```
Dashboard:  http://157.66.54.66:3003/dashboard.html
Scan:       http://157.66.54.66:3003/scan.html
Admin:      http://157.66.54.66:3003/admin.html
Emergency:  http://157.66.54.66:3003/emergency-dashboard.html
Health:     http://157.66.54.66:3003/health
```

### Commands Paling Sering:
```bash
# SSH
ssh ubuntu@157.66.54.66 -p 3022

# Status
pm2 status

# Logs
pm2 logs thermosafe

# Restart
pm2 restart thermosafe

# Monitor
pm2 monit
```

---

## 🎯 Checklist Cepat

### Sebelum Deploy:
- [ ] Punya akses SSH ke VPS
- [ ] Punya semua API keys (Supabase, Telegram, etc)
- [ ] Project sudah di-test di local
- [ ] Sudah baca DEPLOY_README.md

### Setelah Deploy:
- [ ] Server status "online" di PM2
- [ ] Health endpoint return OK
- [ ] Dashboard bisa diakses dari browser
- [ ] Telegram notification berfungsi
- [ ] PM2 startup sudah configured

---

## 📖 Dokumentasi Tambahan (Yang Sudah Ada)

| File | Topik |
|------|-------|
| `readme.md` | Dokumentasi project utama |
| `CARA_MENJALANKAN_SERVER.md` | Cara run di local |
| `KONFIGURASI_IP_WIFI.md` | Konfigurasi WiFi/IP |
| `TELEGRAM_ALARM_TESTING.md` | Test Telegram alarm |
| `EMERGENCY_ALARM_SYSTEM.md` | Sistem emergency alarm |
| `AI_VOICE_ASSISTANT_SETUP.md` | Setup AI voice |

---

## 💡 Tips & Best Practices

### ✅ DO:
- Backup file .env secara berkala
- Monitor logs PM2 setiap hari
- Test aplikasi setelah setiap update
- Dokumentasi setiap perubahan konfigurasi
- Keep dependencies updated (`npm update`)

### ❌ DON'T:
- Jangan commit file .env ke git
- Jangan stop firewall tanpa alasan
- Jangan edit file production tanpa backup
- Jangan restart VPS saat peak hours
- Jangan sharing credentials di chat/public

---

## 🆘 Butuh Bantuan Cepat?

### Error saat deploy:
→ TROUBLESHOOTING.md → Section terkait error

### Lupa command:
→ QUICK_COMMANDS.md → Ctrl+F cari command

### Server crash:
```bash
pm2 logs thermosafe --err
pm2 restart thermosafe
```

### Tidak bisa akses:
1. Cek server running: `pm2 status`
2. Cek firewall: `sudo ufw status`
3. Test dari VPS: `curl http://localhost:3003/health`

---

## 🎓 Learning Path

### Level 1: Beginner
1. DEPLOY_README.md
2. VPS_DEPLOYMENT_GUIDE.md (ikuti step-by-step)
3. DEPLOYMENT_CHECKLIST.md

### Level 2: Intermediate
1. QUICK_COMMANDS.md (hafal command penting)
2. TROUBLESHOOTING.md (pahami common issues)
3. ARCHITECTURE.md (overview sistem)

### Level 3: Advanced
1. Modifikasi ecosystem.config.json
2. Setup Nginx reverse proxy
3. Implement SSL/TLS
4. Setup monitoring & alerting

---

## 📊 Dokumentasi Status

| Kategori | Status |
|----------|--------|
| VPS Configuration | ✅ Complete |
| Port Settings | ✅ Fixed (3003) |
| HTTPS/SSL | ✅ Removed |
| Deployment Guide | ✅ Complete |
| Troubleshooting | ✅ Complete |
| Scripts | ✅ Ready |
| Monitoring | ✅ Ready |

---

## 🔄 Update Log

**Version 1.0** (November 2025)
- ✅ Fixed port inconsistency (3333 → 3003)
- ✅ Removed HTTPS/SSL code
- ✅ Added comprehensive VPS documentation
- ✅ Created deployment scripts
- ✅ Added troubleshooting guide
- ✅ Ready for production deployment

---

## 📞 Support Resources

**Dokumentasi Lokal:**
- Semua file .md di folder project

**Online Resources:**
- PM2 Docs: https://pm2.keymetrics.io/docs/
- Node.js Docs: https://nodejs.org/docs/
- Express.js: https://expressjs.com/

**Emergency:**
- Check logs: `pm2 logs thermosafe --err`
- Restart: `pm2 restart thermosafe`
- Full diagnostic: TROUBLESHOOTING.md

---

**Navigation Version**: 1.0  
**Last Updated**: November 2025  
**Total Docs**: 8 main files + scripts + configs

---

## 🎯 QUICK START

**Belum deploy?** → Start here: **[DEPLOY_README.md](DEPLOY_README.md)**

**Sudah deploy?** → Quick ref: **[QUICK_COMMANDS.md](QUICK_COMMANDS.md)**

**Ada masalah?** → Fix here: **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

✅ **Semua dokumentasi lengkap dan siap digunakan!** 🚀

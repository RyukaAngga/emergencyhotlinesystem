# 🚀 Panduan Deploy ke Render

## 📋 Persiapan

### 1. Install Git (jika belum)
Download dari: https://git-scm.com/downloads

### 2. Buat Akun
- **GitHub**: https://github.com/signup (untuk simpan kode)
- **Render**: https://render.com/register (untuk hosting)

---

## 📦 Step 1: Upload Project ke GitHub

### A. Inisialisasi Git (di folder project)
```bash
cd "c:\iot - Copy"
git init
git add .
git commit -m "Initial commit - Emergency Hotline System"
```

### B. Buat Repository di GitHub
1. Buka https://github.com/new
2. Nama repository: `emergency-hotline-system`
3. Set ke **Private** (agar tidak public)
4. **JANGAN** centang "Add README"
5. Klik **Create repository**

### C. Push ke GitHub
```bash
git remote add origin https://github.com/USERNAME/emergency-hotline-system.git
git branch -M main
git push -u origin main
```
*Ganti `USERNAME` dengan username GitHub Anda*

---

## 🌐 Step 2: Deploy ke Render

### A. Connect GitHub ke Render
1. Login ke https://dashboard.render.com
2. Klik **New +** → **Web Service**
3. Klik **Connect GitHub** → Authorize Render
4. Pilih repository `emergency-hotline-system`

### B. Konfigurasi Web Service
**Basic Settings:**
- **Name**: `emergency-hotline-system`
- **Region**: `Singapore` (terdekat dengan Indonesia)
- **Branch**: `main`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

**Instance Type:**
- Pilih: **Free** (gratis selamanya)

### C. Environment Variables
Klik **Advanced** → **Add Environment Variable**, tambahkan:

| Key | Value | Keterangan |
|-----|-------|------------|
| `NODE_ENV` | `production` | Mode production |
| `PORT` | `10000` | Port default Render |
| `SUPABASE_URL` | `https://fvayuhanwcwinkvvvisk.supabase.co` | URL Supabase Anda |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Anon key Supabase |

### D. Deploy
1. Klik **Create Web Service**
2. Tunggu proses build (5-10 menit)
3. Status akan berubah menjadi **Live** ✅

---

## 🤖 Step 3: Deploy Telegram Bot (Opsional)

### A. Buat Background Worker
1. Dashboard Render → **New +** → **Background Worker**
2. Pilih repository yang sama
3. **Name**: `telegram-bot-worker`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `node telegram-server.js`

**Environment Variables** (sama seperti Web Service):
- `NODE_ENV`: `production`
- Tambahkan Telegram Bot Token jika ada

### B. Deploy Worker
Klik **Create Background Worker**

---

## 🔧 Step 4: Update Konfigurasi di Code

Setelah deploy, Render akan memberikan URL: `https://emergency-hotline-system.onrender.com`

### Update URL di File HTML
Cari dan ganti `localhost:3000` dengan URL Render di file:
- `dashboard.html` (Socket.IO connection)
- `service.html` (Socket.IO connection)
- `admin.html` (jika ada koneksi ke server)

**Contoh perubahan:**
```javascript
// SEBELUM
const socket = io('http://localhost:3000');

// SESUDAH
const socket = io('https://emergency-hotline-system.onrender.com');
```

### Commit & Push Update
```bash
git add .
git commit -m "Update server URL to Render"
git push
```
*Render akan auto-deploy ulang setelah detect perubahan*

---

## ✅ Step 5: Testing

### A. Test Website
Buka: `https://emergency-hotline-system.onrender.com`

**Cek fitur:**
- ✅ Scan wajah berfungsi
- ✅ Dashboard muncul
- ✅ Emergency alert berfungsi
- ✅ Koneksi Supabase berhasil
- ✅ Chat real-time berfungsi (jika Socket.IO aktif)

### B. Test dari Smartphone
1. Buka browser di HP Android
2. Akses URL Render
3. Test face recognition dengan kamera depan

---

## ⚠️ Catatan Penting

### Free Tier Limitations
- **Sleep Mode**: Server tidur setelah 15 menit tidak ada traffic
- **Wake Up**: Butuh 30-60 detik untuk bangun (first request lambat)
- **Bandwidth**: 100 GB/bulan
- **Build Time**: 500 jam/bulan

### Cara Atasi Sleep Mode
1. **Gunakan UptimeRobot**: Ping server setiap 5 menit (gratis)
   - https://uptimerobot.com
   - Add Monitor → HTTP(s)
   - URL: `https://emergency-hotline-system.onrender.com`
   - Interval: 5 minutes

2. **Upgrade ke Paid Plan**: $7/month (no sleep mode)

---

## 🐛 Troubleshooting

### 1. Build Gagal
**Error**: `npm install failed`
**Solusi**: 
- Pastikan `package.json` ada di root folder
- Cek log error di Render Dashboard

### 2. Server Crash
**Error**: `Application failed to start`
**Solusi**:
- Cek logs di Render Dashboard
- Pastikan `PORT` environment variable digunakan:
```javascript
const PORT = process.env.PORT || 3000;
```

### 3. Face Recognition Tidak Jalan
**Error**: Models tidak load
**Solusi**:
- Pastikan folder `weights/` ter-upload ke GitHub
- Cek path models di `face-recognition.js`

### 4. Socket.IO Connection Failed
**Error**: `WebSocket connection failed`
**Solusi**:
- Update URL socket ke URL Render
- Pastikan CORS di server.js sudah allow origin Render

---

## 🔐 Keamanan

### Protect Supabase Keys
Jangan commit `.env` file ke GitHub!

**Buat file `.env`:**
```
SUPABASE_URL=https://fvayuhanwcwinkvvvisk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Update code untuk pakai environment variables:**
```javascript
const supabaseUrl = process.env.SUPABASE_URL || 'https://...';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJ...';
```

---

## 📱 Custom Domain (Opsional)

### Gunakan Domain Sendiri
1. Beli domain di Namecheap/Niagahoster
2. Render Dashboard → Settings → Custom Domains
3. Add domain: `emergency.yourdomain.com`
4. Update DNS records sesuai instruksi Render
5. SSL certificate otomatis dari Render (gratis)

---

## 🎯 Alternative: Deploy ke Railway

Jika Render tidak cocok, coba **Railway**:

1. https://railway.app
2. Connect GitHub repo
3. Auto-detect Node.js
4. Free $5 credit/month
5. No sleep mode (selama credit ada)

**Kelebihan Railway:**
- Setup lebih mudah
- Logs lebih baik
- No sleep mode

**Kekurangan:**
- Credit terbatas ($5/month)
- Bisa habis jika traffic tinggi

---

## 📞 Support

Jika ada masalah saat deploy:
1. Cek Render Logs: Dashboard → Logs
2. Cek GitHub Actions (jika pakai)
3. Test locally dulu: `npm start`

**Status Check:**
- Render Status: https://status.render.com
- Supabase Status: https://status.supabase.com

---

## ✨ Selesai!

Website Anda sekarang online 24/7 dan bisa diakses dari mana saja!

**URL Anda**: `https://emergency-hotline-system.onrender.com`

Share URL ini ke smartphone/tablet untuk testing kiosk mode! 🚀

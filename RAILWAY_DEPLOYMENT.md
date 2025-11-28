# 🚂 Railway Deployment Guide

## Masalah yang Diperbaiki

**Mixed Content Error:**
```
Mixed Content: The page at 'https://emergency-hotline-system-production-4b02.up.railway.app/' 
was loaded over HTTPS, but requested an insecure resource 'http://192.168.18.30:3003/health'
```

**Solusi:** Kode frontend sudah diupdate untuk otomatis detect environment:
- Jika diakses via HTTPS → gunakan origin yang sama (Railway domain)
- Jika diakses via HTTP localhost → gunakan `http://localhost:3003`
- Jika diakses via IP LAN → gunakan IP tersebut dengan port 3003

---

## 📋 Environment Variables untuk Railway

Copy semua variable berikut ke Railway Dashboard → Settings → Variables → Raw Editor:

```env
NODE_ENV=production
SUPABASE_URL=https://fvayuhanwcwinkvvvisk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YXl1aGFud2N3aW5rdnZ2aXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDk1NTYsImV4cCI6MjA3NTQ4NTU1Nn0.AP0ZYsrUQ1ACD7fmX1wTM88_zzMtvyKXmgc9wCVvRrM
TELEGRAM_BOT_TOKEN=8198723255:AAHVETKgh3jeirGR-vzi0_MbF-B7qvjfSR8
TELEGRAM_CHAT_ID=-1003189919970
TWILIO_ACCOUNT_SID=AC60f308f2ce460b17807f0c1458ce286f
TWILIO_AUTH_TOKEN=49dbe9603ff988e5e9561e452cde4b8d
TWILIO_PHONE_NUMBER=+6285136447545
EMERGENCY_CONTACT_1=+6281234567890
EMERGENCY_CONTACT_2=+6282345678901
EMERGENCY_CONTACT_3=+6283456789012
LOCATION_NAME=SMK MARHAS Margahayu
LOCATION_ADDRESS=Jl. Raya Margahayu No.186, Margahayu, Kec. Margahayu, Kabupaten Bandung, Jawa Barat
LOCATION_LATITUDE=-6.9559
LOCATION_LONGITUDE=107.6411
LOCATION_GOOGLE_MAPS=https://maps.google.com/?q=-6.9559,107.6411
MESSAGE_TITLE=🚨 NOTIFIKASI DARURAT 🚨
MESSAGE_FOOTER=Pesan otomatis dari Emergency Hotline System - Kiosk SMK MARHAS Margahayu
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=anthropic/claude-sonnet-4.5
OPENAI_API_KEY=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
```

⚠️ **PENTING:** JANGAN set `PORT` di Railway! Railway akan inject secara otomatis.

---

## 🔧 Perubahan yang Dilakukan

### 1. `dashboard.html`, `scan.html`, `chat.html`
Fungsi `getServerURL()` diupdate untuk mendukung production:

```javascript
function getServerURL() {
    // Production: Railway atau domain lain dengan HTTPS
    if (window.location.protocol === 'https:') {
        return window.location.origin;
    }
    
    // Development: localhost atau IP LAN
    const WIFI_IPS = ['192.168.18.30', '192.168.18.31'];
    const PORT = 3003;

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://localhost:${PORT}`;
    }

    if (window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return `http://${window.location.hostname}:${PORT}`;
    }

    return `http://${WIFI_IPS[0]}:${PORT}`;
}
```

### 2. `server.js`
- Default PORT diubah dari 3333 ke 3003
- Ditambahkan logging untuk environment dan Railway domain
- Health endpoint menampilkan info environment

---

## 🚀 Deploy Steps

1. **Commit & Push perubahan:**
   ```bash
   git add .
   git commit -m "fix: support Railway production with dynamic URL detection"
   git push
   ```

2. **Di Railway Dashboard:**
   - Buka project: `emergency-hotline-system`
   - Settings → Variables → Raw Editor
   - Paste semua env variables di atas
   - Save

3. **Railway akan auto-deploy** setelah push

4. **Test:**
   - Buka: `https://emergency-hotline-system-production-4b02.up.railway.app/`
   - Cek health: `https://emergency-hotline-system-production-4b02.up.railway.app/health`

---

## ✅ Cara Kerja

| Environment | URL Pattern | Behavior |
|-------------|-------------|----------|
| Railway (HTTPS) | `https://...railway.app/` | Gunakan origin yang sama |
| Localhost | `http://localhost:3003/` | Gunakan `http://localhost:3003` |
| LAN IP | `http://192.168.x.x:3003/` | Gunakan IP dengan port 3003 |

Dengan pendekatan ini:
- ✅ Tidak ada Mixed Content error
- ✅ WebSocket (Socket.IO) juga otomatis pakai WSS di production
- ✅ Tetap bisa development di localhost
- ✅ Tetap bisa akses via LAN IP untuk testing device lain

---

## 📱 Testing Checklist

- [ ] Buka dashboard di Railway URL
- [ ] Test emergency button
- [ ] Test Socket.IO realtime updates
- [ ] Test AI Assistant
- [ ] Cek Telegram notification terkirim

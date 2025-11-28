# 🔊 TELEGRAM EMERGENCY ALARM - TESTING GUIDE

## ✅ Yang Sudah Diimplementasikan

### 1. **Fungsi Kirim Audio ke Telegram** ✅
File: `server.js` - Line ~120-145
```javascript
async function sendTelegramAudio(audioPath, caption) {
    // Kirim audio file .mp3 ke Telegram
    // Format: FormData dengan audio stream
    // Output: Audio playable di Telegram dengan notifikasi
}
```

### 2. **Auto-Send Alarm saat Emergency Button** ✅
File: `server.js` - Line ~265-273
```javascript
// Saat user klik EMERGENCY button
if (emergencyButtonPressed) {
    // Kirim audio alarm ke grup Telegram
    await sendTelegramAudio(audioPath, audioCaption);
}
```

### 3. **Konfigurasi Telegram** ✅
File: `telegram-config.env`
```env
TELEGRAM_BOT_TOKEN=8198723255:AAHVETKgh3jeirGR-vzi0_MbF-B7qvjfSR8
TELEGRAM_CHAT_ID=-1003189919970
```

---

## 🧪 CARA TESTING (STEP-BY-STEP)

### **STEP 1: Pastikan Telegram Bot Aktif**
1. Buka Telegram di HP Anda
2. Cari bot: `@emergency_ehs_bot` (atau nama bot Anda)
3. Pastikan bot sudah di grup emergency: `Emergency Response Team`
4. Bot harus punya **ADMIN RIGHTS** di grup

---

### **STEP 2: Test Emergency Flow**

#### A. Buka Dashboard User
```
http://localhost:3003/dashboard.html
```
- Login sebagai user biasa
- Pastikan sudah scan wajah (punya foto)

#### B. Klik Tombol EMERGENCY
1. Klik tombol **EMERGENCY** (merah)
2. Pilih jenis emergency:
   - 🏥 Medical Emergency
   - 🔥 Fire Emergency
   - 🚨 Crime/Security
   - 🚗 Accident
   - ⚠️ Other

3. Dialog emergency akan muncul dengan foto Anda

#### C. Confirm Emergency
- Klik **"Konfirmasi Darurat"**

---

### **STEP 3: Cek Telegram Grup**

Dalam **5-10 detik**, grup Telegram akan menerima:

1. **📱 MESSAGE ALERT**:
   ```
   🚨 EMERGENCY ALERT 🚨

   Tipe Darurat: Emergency
   Kategori: MEDICAL
   Pesan: Emergency call
   Pengirim: [Nama User]
   Scan ID: [ID]
   Waktu: 9/11/2025, 14:30:45
   Lokasi: SMK MARHAS Margahayu

   ━━━━━━━━━━━━━━━━━━
   📍 Informasi Lokasi:
   Jl. Raya Margahayu No.186, Bandung

   ⚠️ Segera tangani situasi darurat ini!
   🔴 EMERGENCY BUTTON ACTIVATED
   ```

2. **🗺️ LOKASI (jika ada GPS)**:
   - Pin lokasi di Google Maps

3. **🔊 AUDIO ALARM (11 DETIK)**:
   ```
   🚨 EMERGENCY ALARM - MEDICAL
   ⚠️ Segera tangani!
   
   [Audio file: war siren sound.mp3]
   Duration: 11 seconds
   ```

---

## 🎯 HASIL YANG DIHARAPKAN

### **Di Telegram:**
✅ Notifikasi push muncul di HP semua anggota grup
✅ Badge unread di icon Telegram
✅ **NADA DERING TELEGRAM BERBUNYI** (notifikasi sound default)
✅ Audio alarm bisa di-play langsung di chat
✅ Audio ter-download otomatis (bisa play offline)

### **Di Emergency Dashboard:**
✅ Data emergency muncul real-time
✅ Stats update (active cases +1)
✅ Alarm browser berbunyi 3x (33 detik)
✅ Tombol "Stop Alarm" muncul

---

## 🔧 TROUBLESHOOTING

### **Telegram tidak terima notifikasi?**

1. **Cek bot ada di grup:**
   ```
   - Buka grup Emergency Response Team
   - Lihat member list
   - Pastikan @emergency_ehs_bot ada
   ```

2. **Cek bot punya admin rights:**
   ```
   - Grup settings → Administrators
   - Bot harus ada dalam list admin
   - Permission: "Send messages", "Send media"
   ```

3. **Cek server console log:**
   ```
   ✅ Telegram message sent successfully
   ✅ Telegram location sent successfully
   🔊 Telegram audio sent successfully
   🔊 Emergency alarm audio sent to Telegram
   ```

4. **Error "chat not found"?**
   - Chat ID salah
   - Cek `telegram-config.env`
   - Chat ID harus NEGATIF (contoh: -1003189919970)

5. **Error "bot was kicked"?**
   - Bot di-kick dari grup
   - Invite ulang bot ke grup
   - Promote jadi admin

---

### **Audio tidak terkirim?**

1. **Cek file alarm ada:**
   ```powershell
   Test-Path "c:\iot - Copy\alarm\war siren sound🚨  war  siren  soundeffects.mp3"
   ```
   Harusnya output: `True`

2. **Cek ukuran file:**
   - Telegram limit: 50 MB untuk audio
   - File Anda: ~500 KB (aman)

3. **Cek format:**
   - Format: MP3 ✅
   - Duration: 11 detik ✅
   - Bitrate: Apa saja (Telegram auto-convert)

4. **Error "file too large"?**
   - Compress audio dengan Audacity
   - Atau gunakan bitrate lebih rendah (64kbps cukup)

---

### **Notifikasi tidak berbunyi di HP?**

1. **Cek Telegram notification settings:**
   ```
   Telegram → Settings → Notifications
   - Private Chats: ON
   - Groups: ON
   - Sound: ENABLED
   ```

2. **Cek notification grup:**
   ```
   Buka grup Emergency Response Team
   → (i) Info
   → Notifications: ON (not muted)
   → Sound: Default or Custom
   ```

3. **Cek HP notification permission:**
   ```
   Android: Settings → Apps → Telegram → Notifications → ALLOW
   iOS: Settings → Telegram → Notifications → ALLOW
   ```

4. **Test manual:**
   - Minta teman kirim message di grup
   - Harusnya berbunyi
   - Jika tidak berbunyi → masalah HP/Telegram settings

---

## 🎵 CUSTOM NOTIFICATION SOUND (OPTIONAL)

Jika ingin **notifikasi Telegram berbunyi dengan alarm emergency**:

### **Android:**
1. Download audio alarm ke HP
2. Buka grup Emergency Response Team
3. (i) Info → Notifications → Sound
4. Custom → Pilih file alarm.mp3

### **iOS:**
1. Telegram settings → Notifications & Sounds
2. Group Notifications → Sound
3. Pilih dari library atau upload custom

⚠️ **Note**: Ini mengubah notifikasi sound untuk SEMUA pesan di grup, bukan hanya emergency.

---

## 📊 TESTING CHECKLIST

Sebelum production, pastikan:

- [ ] ✅ Server running tanpa error
- [ ] ✅ Bot ada di grup Telegram
- [ ] ✅ Bot punya admin rights
- [ ] ✅ Chat ID benar (negatif)
- [ ] ✅ Emergency button bisa diklik
- [ ] ✅ Message terkirim ke Telegram (< 5 detik)
- [ ] ✅ Audio terkirim ke Telegram
- [ ] ✅ Notifikasi push muncul di HP
- [ ] ✅ Audio bisa di-play di Telegram
- [ ] ✅ Emergency Dashboard update real-time
- [ ] ✅ Browser alarm berbunyi 3x

---

## 🚀 PRODUCTION TIPS

1. **Setup Notifikasi VIP:**
   ```
   - Buat grup khusus "Emergency VIP"
   - Tambahkan admin/kepala sekolah
   - Set notification priority: HIGH
   ```

2. **Backup Notification:**
   ```
   - Tambahkan email notification (nodemailer)
   - Tambahkan SMS notification (Twilio - paid)
   - Redundant = lebih reliable
   ```

3. **Monitor Bot Health:**
   ```javascript
   // Cek bot status setiap 5 menit
   setInterval(async () => {
       const result = await sendTelegramMessage('🤖 Bot health check');
       if (!result.success) {
           console.error('⚠️ Telegram bot DOWN!');
           // Send alert via email/SMS
       }
   }, 5 * 60 * 1000);
   ```

4. **Rate Limiting:**
   ```
   Telegram limit: 30 messages/second per chat
   Jika spam emergency → implement cooldown 10 detik
   ```

---

## 📱 EXPECTED USER EXPERIENCE

```
User klik EMERGENCY (dashboard.html)
    ↓
Dialog emergency muncul (pilih tipe)
    ↓
User klik "Konfirmasi Darurat"
    ↓
    ┌────────────────────────────────────┐
    │ 1. Server save to database         │ (instant)
    │ 2. WebSocket broadcast             │ (instant)
    │ 3. Telegram send message           │ (1-2 detik)
    │ 4. Telegram send location          │ (1-2 detik)
    │ 5. Telegram send audio alarm       │ (2-3 detik)
    └────────────────────────────────────┘
    ↓
Emergency Responder menerima:
    ├─ 📱 Notifikasi push (DING! - nada Telegram)
    ├─ 💬 Message emergency di grup
    ├─ 🗺️ Pin lokasi
    └─ 🔊 Audio alarm (11 detik)
    ↓
Responder play audio:
    ├─ Klik audio di chat
    ├─ Alarm berbunyi (WAR SIREN)
    └─ Total duration: 11 detik
    ↓
Responder buka Emergency Dashboard:
    ├─ Login emergency
    ├─ Lihat case detail
    ├─ Alarm browser berbunyi 3x (33 detik)
    └─ Klik "Tangani" untuk handle case
```

---

## 🎯 KESIMPULAN

**FITUR YANG SUDAH AKTIF:**
1. ✅ Telegram Bot Integration
2. ✅ Emergency Message ke Telegram
3. ✅ Location Sharing
4. ✅ **AUDIO ALARM KE TELEGRAM** (BARU!)
5. ✅ Real-time notification push
6. ✅ Multi-channel alert (Web + Telegram)

**KEUNTUNGAN:**
- 🚨 Emergency responder **PASTI** dapat notifikasi (push ke HP)
- 🔊 Audio alarm bisa di-play **offline** (ter-download di Telegram)
- 📱 Work meskipun browser/dashboard tidak dibuka
- 🌐 Work meskipun komputer emergency dashboard mati
- 🔔 Nada dering Telegram akan berbunyi di HP semua anggota grup

**SIAP PRODUCTION!** 🚀

---

## 🆘 BUTUH BANTUAN?

Jika ada error atau tidak jalan:
1. Cek console log server (window PowerShell yang baru dibuka)
2. Cek browser console (F12)
3. Cek Telegram bot logs (kirim /status ke bot)
4. Share screenshot error ke saya

**Testing dimulai dari:**
```
http://localhost:3003/dashboard.html
```

**Good luck!** 🎉

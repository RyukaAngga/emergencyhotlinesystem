# 🔊 CARA SETUP ALARM SEBAGAI NOTIFIKASI TELEGRAM

## 📱 PANDUAN LENGKAP - Step by Step

Karena **Telegram Bot API tidak bisa set custom notification sound**, kita harus set **manual di HP** setiap emergency responder.

---

## 🎯 HASIL YANG DIINGINKAN:

```
User klik EMERGENCY
    ↓
Telegram kirim message
    ↓
HP emergency responder berbunyi:
    🔊 WAR SIREN ALARM (bukan notifikasi default)
    ↓
Responder langsung tahu: "INI EMERGENCY!"
```

---

## 📲 STEP 1: DOWNLOAD AUDIO ALARM KE HP

### **Cara A: Via Server (Paling Mudah)**

1. **Pastikan HP dan laptop connect ke WiFi yang sama**

2. **Buka browser di HP**, ketik:
   ```
   http://192.168.x.x:3003/alarm/war siren sound🚨  war  siren  soundeffects.mp3
   ```
   ⚠️ Ganti `192.168.x.x` dengan IP laptop Anda
   
   **Cara cek IP laptop:**
   ```powershell
   # Di PowerShell laptop
   ipconfig | Select-String "IPv4"
   ```
   Output contoh: `192.168.1.100`

3. **Download audio** yang muncul di browser
4. **Simpan ke HP** (biasanya otomatis ke folder Downloads)

---

### **Cara B: Via Telegram Saved Messages**

1. **Di laptop**, buka Telegram Desktop/Web
2. **Klik "Saved Messages"** (chat dengan diri sendiri)
3. **Upload file alarm:**
   - Klik attachment (📎)
   - Pilih: `c:\iot - Copy\alarm\war siren sound🚨  war  siren  soundeffects.mp3`
   - Send

4. **Di HP**, buka Telegram
5. **Masuk ke Saved Messages**
6. **Tap audio file** → **Download**
7. **Tap lagi** → **Share** → **Save to Files** (atau Downloads)

---

### **Cara C: Via Google Drive / Dropbox**

1. Upload file alarm dari laptop ke Google Drive
2. Share link ke diri sendiri
3. Download di HP

---

## 🔔 STEP 2: SET CUSTOM NOTIFICATION SOUND

### **ANDROID (Telegram Official):**

1. **Buka Telegram** di HP

2. **Masuk ke grup** "Emergency Response Team"

3. **Tap nama grup** di bagian atas

4. **Scroll ke bawah** → Cari **"Notifications"**

5. **Tap "Sound"** atau **"Notification Sound"**

6. Akan muncul pilihan:
   - ✅ **Default** (suara notifikasi biasa)
   - ✅ **None** (silent)
   - ✅ **Custom Sound** ← **PILIH INI**

7. **Tap "Custom Sound"** atau **"Choose from storage"**

8. **Navigasi ke folder** tempat Anda simpan audio:
   - Biasanya: `Internal Storage/Download/`
   - Atau: `Music/` atau `Ringtones/`

9. **Pilih file:** `war siren sound🚨 war siren soundeffects.mp3`

10. **Tap "Save"** atau **"OK"**

11. **Test:** Minta teman kirim pesan di grup
    - Harusnya berbunyi **war siren** bukan notifikasi default

---

### **iOS (iPhone/iPad):**

1. **Buka Settings** di iPhone → **Notifications** → **Telegram**

2. Pastikan **Allow Notifications: ON**

3. **Buka Telegram app**

4. **Masuk ke grup** "Emergency Response Team"

5. **Tap nama grup** di atas → **Info**

6. **Tap "Notifications and Sounds"**

7. **Tap "Sound"**

8. Pilihan yang muncul:
   - Default sounds (Tritone, Alert, dll)
   - **Upload Custom** ← **PILIH INI**

9. **Browse ke folder** tempat file audio disimpan:
   - Files app → Downloads atau iCloud Drive

10. **Pilih:** `war siren sound.mp3`

11. **Tap "Done"**

12. **Test:** Kirim test message di grup

⚠️ **Note iOS:** File harus format `.m4r` (ringtone) atau `.mp3` dengan durasi < 30 detik

---

## 🔧 STEP 3: SETTINGS TAMBAHAN (OPTIONAL)

### **Pastikan Notifikasi Priority HIGH:**

**Android:**
```
Telegram → Settings → Notifications and Sounds
→ Groups
→ Priority: HIGH atau URGENT
→ Show Previews: ON
→ Vibrate: ON (optional)
→ LED Color: Red (emergency) 🔴
```

**iOS:**
```
iPhone Settings → Notifications → Telegram
→ Allow Notifications: ON
→ Sounds: ON
→ Badges: ON
→ Show Previews: Always
→ Banner Style: Persistent (tidak auto-dismiss)
```

---

### **Disable Notification untuk Pesan Biasa (Opsional):**

Jika grup emergency juga dipakai chat biasa, Anda bisa:

1. **Mute notifikasi grup** (jangan khawatir, emergency tetap masuk!)
2. **Set keyword trigger** (Telegram Premium feature)
3. **Buat 2 grup terpisah:**
   - `Emergency Alerts Only` (notifikasi ON + alarm sound)
   - `Emergency Discussion` (notifikasi OFF atau default)

---

## 🎯 STEP 4: TEST NOTIFICATION

### **Test Manual:**

1. **Minta teman** kirim message di grup emergency
2. **Lock HP** (screen off)
3. **Tunggu notifikasi**
4. Harusnya HP berbunyi: **WAR SIREN ALARM** 🚨

### **Test via Emergency System:**

1. **Buka dashboard:** `http://localhost:3003/dashboard.html`
2. **Klik EMERGENCY** → Pilih jenis → Konfirmasi
3. **Tunggu 5-10 detik**
4. **HP emergency responder** harusnya:
   - 🔔 Notifikasi push muncul
   - 🔊 **War siren alarm berbunyi**
   - 📱 Screen menyala dengan preview emergency

---

## 🚨 TROUBLESHOOTING

### **Notifikasi masih berbunyi default?**

1. **Cek Custom Sound aktif:**
   - Buka grup → Info → Notifications → Sound
   - Pastikan NOT "Default"
   - Pastikan ada nama file audio (contoh: "war siren sound.mp3")

2. **Re-download audio:**
   - File mungkin corrupt
   - Download ulang dari server/Saved Messages

3. **Cek format file:**
   - Android: MP3, OGG, M4A (support semua)
   - iOS: MP3, M4R (harus < 30 detik)
   - Durasi: 11 detik ✅ (aman)

4. **Clear Telegram cache:**
   - Settings → Data and Storage → Storage Usage
   - Clear Cache
   - Restart Telegram
   - Set ulang custom sound

---

### **Notifikasi tidak muncul sama sekali?**

1. **Cek grup tidak di-mute:**
   ```
   Grup → Info → Notifications → Unmute
   ```

2. **Cek Telegram notification permission:**
   ```
   Android: Settings → Apps → Telegram → Notifications → ALLOW
   iOS: Settings → Notifications → Telegram → ALLOW
   ```

3. **Cek Do Not Disturb mode:**
   - Pastikan DND off, atau
   - Tambahkan Telegram ke exception list

4. **Battery Optimization:**
   ```
   Android: Settings → Apps → Telegram → Battery
   → Unrestricted atau Don't optimize
   ```

---

### **Audio tidak bisa dipilih di custom sound?**

**Android:**
1. **Move file ke folder Ringtones:**
   ```
   Internal Storage/Ringtones/war_siren.mp3
   ```
2. Set ulang custom sound, harusnya muncul

**iOS:**
1. **Convert ke M4R** (ringtone format):
   - Buka GarageBand di iPhone
   - Import audio → Export as Ringtone
   - Atau gunakan online converter: MP3 → M4R

2. **Atau gunakan iTunes:**
   - Sync ringtone dari laptop ke iPhone
   - File → Add to Library → Sync

---

## 📊 ALTERNATIVE: MENTION USER

Jika custom sound terlalu ribet, alternatif lain:

### **Telegram Bot mention username:**

Edit `server.js` untuk mention user tertentu:

```javascript
// Tambahkan username emergency responder
const emergencyResponders = ['@username1', '@username2', '@admin'];

const emergencyMessage = `
🚨🚨🚨 EMERGENCY ALERT 🚨🚨🚨

📢 URGENT: ${emergencyResponders.join(' ')}

...pesan emergency...
`;
```

**Keuntungan mention:**
- Notifikasi lebih urgent (Telegram prioritas tinggi)
- User langsung tahu dia di-mention
- Badge unread lebih prominent

**Cara dapat username Telegram:**
```
Settings → Username → @namauser
```

---

## 🎵 AUDIO ALARM SPECIFICATION

**File yang Anda punya:**
```
Filename: war siren sound🚨  war  siren  soundeffects.mp3
Duration: 11 seconds ✅
Format: MP3 ✅
Size: ~500 KB ✅
Bitrate: ~44.1 kHz
```

**Kompatibilitas:**
- ✅ Android: SUPPORT semua format
- ✅ iOS: SUPPORT (< 30 detik)
- ✅ Telegram: SUPPORT
- ✅ Duration: Perfect (tidak terlalu panjang)

---

## 🏆 BEST PRACTICE

### **Untuk Tim Emergency Responder (5+ orang):**

**Setup Grup:**
1. **Buat grup khusus:** "Emergency Alerts - DO NOT MUTE"
2. **Pin message** di atas: "JANGAN MUTE GRUP INI! Set custom alarm sound: [link panduan]"
3. **Admin set rules:** Hanya emergency alerts, no chitchat
4. **Buat grup kedua** untuk diskusi biasa

**Setup Individual:**
1. **Setiap responder** set custom alarm sound (panduan ini)
2. **Test berkala** (1x seminggu) untuk memastikan notifikasi work
3. **Backup notification:** Install Telegram di 2 device (HP + Tablet)

**Setup Server:**
1. **Send test alert** setiap hari jam 7 pagi: "System health check ✅"
2. **Log notification delivery** di server console
3. **Alert admin** jika message gagal terkirim

---

## 📱 EXPECTED USER EXPERIENCE (SETELAH SETUP)

```
BEFORE (Notifikasi Default):
User klik Emergency
    ↓
Telegram: "ding" (suara default kecil)
    ↓
Responder: "Oh, chat biasa" (ignored)
    ↓
❌ Emergency tidak ditangani cepat

──────────────────────────────────────

AFTER (Custom Alarm Sound):
User klik Emergency
    ↓
Telegram: 🚨 WAR SIREN! WEEE-WOOO-WEEE-WOOO 🚨
    ↓
Responder: "WOW! INI EMERGENCY!" (langsung cek HP)
    ↓
✅ Emergency ditangani dalam < 30 detik
```

---

## ✅ CHECKLIST SETUP

Print checklist ini dan pastikan semua responder sudah setup:

**Emergency Responder: [NAMA]**

- [ ] Download audio alarm ke HP
- [ ] Set custom notification sound di grup emergency
- [ ] Test notifikasi (berbunyi alarm)
- [ ] Telegram notification permission: ALLOW
- [ ] Grup emergency: NOT MUTED
- [ ] Notification priority: HIGH
- [ ] DND exception: Telegram ALLOWED
- [ ] Battery optimization: UNRESTRICTED
- [ ] Backup: Install Telegram di 2 devices

**Tanggal Setup:** ___________
**Tested By:** ___________
**Status:** ✅ PASS / ❌ FAIL

---

## 🆘 JIKA MASIH TIDAK BISA

Alternatif terakhir:

### **1. Gunakan Telegram Bot untuk Call (Telegram Call API - Beta)**
- Masih experimental
- Tidak reliable

### **2. Integrasi dengan Twilio Voice Call**
- Auto-call HP responder
- Voice message: "Darurat! Medical emergency di gedung A!"
- Biaya: $0.01 per call (~Rp 150)

### **3. Gunakan FCM (Firebase Cloud Messaging)**
- Buat Flutter app
- Custom notification sound via FCM
- Development time: 2 minggu

### **4. Hardware IoT Speaker**
- Raspberry Pi + Speaker
- Alarm fisik berbunyi di ruang emergency center
- Biaya: ~Rp 850.000

---

## 📞 SUPPORT

Jika ada yang tidak jelas atau stuck:

1. **Cek versi Telegram:** Update ke versi terbaru
2. **Cek OS version:** Android 8+ atau iOS 13+
3. **Screenshot error** dan share
4. **Test dengan HP lain** (apakah masalah global atau device-specific)

**Telegram Support:** https://telegram.org/support

---

## 🎯 KESIMPULAN

**Yang Sudah Diubah di Server:**
- ✅ Audio file DIHAPUS dari pesan Telegram
- ✅ Message emergency lebih jelas dengan emoji dan format
- ✅ Notifikasi lebih urgent dengan heading ganda 🚨🚨🚨

**Yang Harus Dilakukan Manual:**
- 📱 Setup custom notification sound di HP setiap responder
- ⏱️ Waktu setup: ~5 menit per orang
- 🔄 Test berkala untuk ensure work

**Hasil Akhir:**
- 🚨 Notifikasi HP berbunyi WAR SIREN ALARM
- 📵 Tidak ada audio file di chat Telegram
- ⚡ Responder langsung tahu ini emergency

**STATUS: ✅ SIAP DIGUNAKAN**

Download audio alarm via:
```
http://localhost:3003/alarm/war siren sound🚨  war  siren  soundeffects.mp3
```

**GOOD LUCK!** 🚀

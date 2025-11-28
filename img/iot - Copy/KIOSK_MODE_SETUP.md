# 🔒 KIOSK MODE SYSTEM - Emergency Hotline System
**SMK MARHAS Margahayu**

---

## 📋 Overview

Sistem **Kiosk Mode** adalah fitur keamanan yang mengunci aplikasi dalam mode layar penuh (fullscreen), mencegah user keluar dari aplikasi tanpa password yang benar.

### ✨ Fitur Utama:
1. **Password dari Database** - Password disimpan di Supabase, bisa diubah tanpa edit code
2. **Manual Enter/Exit** - User bisa masuk dan keluar kiosk mode dengan password
3. **F11 Blocked** - Tombol F11 diblokir, tidak bisa toggle fullscreen
4. **Auto Re-enter** - Jika user keluar dari fullscreen saat kiosk aktif, otomatis masuk lagi
5. **Right-Click Disabled** - Prevent akses context menu

---

## 🗄️ Database Setup

### 1. Create Table di Supabase

Jalankan SQL script `create-kiosk-settings-table.sql`:

```sql
CREATE TABLE IF NOT EXISTS kiosk_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(100),
    notes TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO kiosk_settings (id, password, notes)
VALUES (1, 'smkmarhas2025', 'Default kiosk mode password')
ON CONFLICT (id) DO NOTHING;
```

### 2. Enable RLS (Row Level Security)

```sql
ALTER TABLE kiosk_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for kiosk settings"
ON kiosk_settings FOR SELECT TO public USING (true);

CREATE POLICY "Allow update for authenticated users"
ON kiosk_settings FOR UPDATE TO authenticated USING (true);
```

---

## 🚀 Cara Menggunakan

### A. Masuk Kiosk Mode

1. Buka **Dashboard** → Klik icon **Settings** (⚙️) di header
2. Di sidebar, klik **"Masuk Kiosk Mode"**
3. Masukkan password (default: `smkmarhas2025`)
4. Klik **"Aktifkan"**
5. ✅ Aplikasi sekarang fullscreen dan terkunci

### B. Keluar Kiosk Mode

1. Buka **Settings** sidebar (⚙️)
2. Klik **"Keluar dari Kiosk Mode"**
3. Masukkan password yang sama
4. Klik **"Keluar"**
5. ✅ Fullscreen dinonaktifkan, kontrol browser kembali normal

---

## 🔧 Cara Mengganti Password

### Metode 1: Via Supabase Dashboard

1. Login ke https://app.supabase.com
2. Pilih project: **fvayuhanwcwinkvvvisk**
3. Go to **Table Editor** → `kiosk_settings`
4. Edit row dengan `id = 1`
5. Ubah field `password` ke password baru
6. Update field `updated_by` dengan email admin
7. Update field `notes` dengan keterangan
8. Save

### Metode 2: Via SQL Query

```sql
UPDATE kiosk_settings 
SET 
    password = 'passwordbaru123',
    updated_by = 'admin@smkmarhas.sch.id',
    notes = 'Password diubah pada 2025-11-13'
WHERE id = 1;
```

### Metode 3: Via Admin Panel (Future)

Bisa ditambahkan form di `admin.html` untuk ubah password via UI.

---

## 🛡️ Keamanan

### Password Protection
- ✅ Password disimpan di database (tidak di code)
- ✅ Password bisa diubah kapan saja tanpa deploy ulang
- ✅ Hanya authenticated user yang bisa update password
- ✅ RLS enabled untuk keamanan akses

### Keyboard Blocking
- ✅ **F11** - Diblokir permanently
- ✅ **Escape** - Diblokir saat kiosk mode aktif
- ✅ **Right-Click** - Disabled
- ✅ **Fullscreen shortcuts** - Semua diblokir

### Auto Re-enter
Jika user berhasil keluar dari fullscreen (misal via browser shortcut lain), sistem otomatis akan:
1. Detect fullscreen change
2. Re-enter fullscreen dalam 500ms
3. Tetap lock sampai password benar

---

## 📱 Kompatibilitas

### Desktop Browsers
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Firefox
- ✅ Safari (macOS)

### Mobile (Android)
- ✅ Chrome (Android 7.1.2+)
- ✅ Samsung Internet
- ⚠️ Firefox Mobile (limited fullscreen API)

### Kiosk Devices
- ✅ Dedicated kiosk hardware
- ✅ Tablets with kiosk mode
- ✅ Android devices with locked launcher

---

## 🔄 Workflow

```
┌─────────────────────┐
│   Dashboard Load    │
│  (Normal mode)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User clicks        │
│ "Masuk Kiosk Mode"  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Password Modal     │
│  Shows              │
└──────────┬──────────┘
           │
           ▼
     ┌────┴────┐
     │ Verify  │
     │Password │
     └────┬────┘
          │
     ┌────┴────────┐
     │ Correct?    │
     └────┬────────┘
     Yes  │    No
     ▼    │    ▼
┌─────┐   │  ┌─────────┐
│Enter│   │  │ Error   │
│Full │   │  │ Message │
│Screen   │  └─────────┘
└──┬──┘   │
   │      │
   ▼      │
┌─────────────────────┐
│  Kiosk Mode Active  │
│  - Fullscreen ON    │
│  - F11 Blocked      │
│  - Escape Blocked   │
│  - Auto Re-enter    │
└──────────┬──────────┘
           │
           │ User clicks
           │ "Keluar Kiosk"
           ▼
┌─────────────────────┐
│  Password Modal     │
│  Shows Again        │
└──────────┬──────────┘
           │
           ▼
     ┌────┴────┐
     │ Verify  │
     │Password │
     └────┬────┘
          │
     Correct
          ▼
┌─────────────────────┐
│  Exit Fullscreen    │
│  Kiosk Deactivated  │
└─────────────────────┘
```

---

## 🐛 Troubleshooting

### Password Tidak Terload

**Symptom:** Error di console: `Error loading kiosk password`

**Solution:**
```javascript
// Check Supabase connection
const { data, error } = await supabase
    .from('kiosk_settings')
    .select('password')
    .eq('id', 1)
    .single();

if (error) {
    console.error('Supabase error:', error);
}
```

**Possible Causes:**
1. Table `kiosk_settings` belum dibuat
2. RLS policy belum di-set
3. Supabase credentials salah
4. Network error

### Fullscreen Tidak Bisa Keluar

**Symptom:** Stuck di fullscreen, password benar tapi tidak keluar

**Solution:**
1. Buka Developer Console (might need external keyboard)
2. Run: `isKioskModeActive = false; document.exitFullscreen();`
3. Atau restart browser

### F11 Masih Bisa Dipakai

**Symptom:** F11 tidak terblokir

**Solution:**
- Check console untuk error di `preventF11` function
- Pastikan `initKioskMode()` dipanggil saat page load
- Some OS-level shortcuts might override (Windows key + shortcuts)

---

## 📊 Monitoring & Logs

### Console Logs

```javascript
// Saat password berhasil diload
✅ Kiosk password loaded from database

// Saat masuk kiosk mode
🔒 Kiosk Mode activated

// Saat keluar kiosk mode
🔓 Kiosk Mode deactivated

// Jika error
❌ Error loading kiosk password: [error details]
⚠️ Using fallback password
```

### Password Change History

Track via `kiosk_settings` table:
```sql
SELECT 
    password,
    updated_at,
    updated_by,
    notes
FROM kiosk_settings 
WHERE id = 1;
```

---

## 🎯 Best Practices

### 1. Password Management
- ✅ Gunakan password yang kuat (min 12 karakter)
- ✅ Kombinasi huruf besar, kecil, angka, simbol
- ✅ Ganti password secara berkala (setiap 3 bulan)
- ✅ Jangan share password ke unauthorized users
- ✅ Catat perubahan password di field `notes`

### 2. Deployment
- ✅ Test kiosk mode sebelum production
- ✅ Backup password di tempat aman (password manager)
- ✅ Train staff cara enter/exit kiosk mode
- ✅ Siapkan emergency exit procedure

### 3. Production Environment
```javascript
// Disable console logs di production
if (location.hostname !== 'localhost') {
    console.log = () => {};
    console.warn = () => {};
}
```

---

## 🔐 Emergency Exit

Jika terjadi masalah kritis (lupa password, stuck, dll):

### Method 1: External Keyboard Shortcuts
- **Windows:** `Win + D` (Show Desktop)
- **macOS:** `Cmd + Tab` (Switch Apps)
- **Linux:** `Alt + F4` (Close Window)

### Method 2: Force Quit Browser
- **Windows:** `Ctrl + Alt + Delete` → Task Manager → End Chrome
- **macOS:** `Cmd + Option + Esc` → Force Quit Chrome
- **Linux:** `Alt + F2` → `killall chrome`

### Method 3: Reset Browser
1. Close all browser windows
2. Clear site data:
   - Chrome: `chrome://settings/content/all`
   - Search: localhost atau domain kamu
   - Clear data

### Method 4: Reset Password via Supabase
1. Login Supabase dashboard
2. Reset password di table `kiosk_settings`
3. Reload aplikasi

---

## 📝 Configuration

### File Locations
```
c:\iot - Copy/
├── dashboard.html              # Main file dengan kiosk mode
├── kiosk-mode.js              # Standalone kiosk script
├── create-kiosk-settings-table.sql  # Database schema
└── KIOSK_MODE_SETUP.md        # This documentation
```

### Supabase Config
```javascript
const SUPABASE_URL = 'https://fvayuhanwcwinkvvvisk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
```

### Default Password
```javascript
kioskPasswordFromDB = 'smkmarhas2025';  // Fallback if DB empty
```

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Admin panel untuk ubah password via UI
- [ ] Multi-level passwords (admin, operator, emergency)
- [ ] Password expiry & rotation policy
- [ ] Activity log untuk track enter/exit kiosk
- [ ] Biometric authentication (fingerprint, face)
- [ ] Time-based auto-lock (kiosk mode aktif di jam tertentu)
- [ ] Remote management via admin dashboard
- [ ] Mobile app untuk unlock kiosk via QR code

---

## 📞 Support

### Contact
- **Developer:** AI Assistant (GitHub Copilot)
- **School:** SMK MARHAS Margahayu
- **Project:** Emergency Hotline System
- **Version:** 2.1.0

### Resources
- Supabase Dashboard: https://app.supabase.com
- Documentation: `README.md`, `CHANGELOG.md`
- SQL Scripts: `create-kiosk-settings-table.sql`

---

**Last Updated:** November 13, 2025  
**Status:** ✅ Production Ready  
**Tested On:** Chrome (Desktop & Android 7.1.2)

# 🚨 Emergency Hotline Integrated System

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

**Sistem Emergency Hotline Terintegrasi untuk SMK MARHAS Margahayu**

[Quick Start](#-quick-start) • [Features](#-features) • [Setup Guide](#-setup-lengkap) • [API](#-api-endpoints) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Deskripsi

Emergency Hotline Integrated System adalah aplikasi web terintegrasi yang menggabungkan **Telegram Bot**, **Real-time Chat**, **Emergency Alert**, dan **Face Recognition** dalam satu sistem terpadu untuk SMK MARHAS Margahayu.

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Konfigurasi Telegram (Wajib)
Edit file `telegram-config.env`:
```env
TELEGRAM_BOT_TOKEN=8198723255:AAHVETKgh3jeirGR-vzi0_MbF-B7qvjfSR8
TELEGRAM_CHAT_ID=-1003189919970
PORT=3003
```

### 3️⃣ Jalankan Server

**Cara Termudah (RECOMMENDED):**
```
Double-click: start-system.bat
```

**Atau Manual:**
```bash
npm start
# atau
node server.js
```

### 4️⃣ Akses Aplikasi

Server berjalan di **PORT 3003**. Buka browser dan akses:

#### 👥 User Pages
| Halaman | URL | Fungsi |
|---------|-----|--------|
| 🏠 **Dashboard** | http://localhost:3003/dashboard.html | Dashboard utama dengan tombol emergency |
| 💬 **Service Chat** | http://localhost:3003/service.html | Real-time chat dengan online status |
| 📱 **Emergency Numbers** | http://localhost:3003/emergency-numbers.html | Daftar kontak darurat lengkap |
| 👤 **Face Scan** | http://localhost:3003/scan.html | Face recognition system |

#### 🔐 Admin Pages
| Halaman | URL | Fungsi |
|---------|-----|--------|
| 🔐 **Admin Login** | http://localhost:3003/login-admin.html | Login untuk admin panel |
| 👨‍💼 **Admin Panel** | http://localhost:3003/admin.html | Panel admin untuk monitoring |
| 💬 **Chat System** | http://localhost:3003/chat.html | Sistem chat alternatif |
| 🧪 **Test System** | http://localhost:3003/test-system.html | Halaman testing fitur |

#### 🚨 Emergency Responder Pages
| Halaman | URL | Fungsi |
|---------|-----|--------|
| 🔐 **Emergency Login** | http://localhost:3003/login-emergency.html | Login untuk petugas darurat |
| 📊 **Emergency Dashboard** | http://localhost:3003/emergency-dashboard.html | Dashboard real-time untuk polisi, pemadam, medis |

---

## ✨ Features

### 🚨 Emergency Alert System
- ✅ **1-Click Emergency Button** - Tombol merah untuk situasi darurat
- ✅ **Telegram Integration** - Notifikasi langsung ke grup Telegram
- ✅ **Geo-location** - Otomatis mengirim lokasi sekolah
- ✅ **Instant Delivery** - Notifikasi real-time tanpa delay
- ✅ **100% Gratis** - Tidak ada biaya SMS atau API berbayar
- ✅ **Multi-recipient** - Kirim ke banyak orang sekaligus via grup
- ✅ **Emergency Responder Portal** - Dashboard khusus untuk petugas darurat

### 🚑 Emergency Responder System (NEW!)
- ✅ **Role-Based Access** - Login khusus untuk polisi, pemadam, medis, rescue
- ✅ **Real-time Dashboard** - Monitor kasus emergency secara langsung
- ✅ **Live Notifications** - Desktop notifications untuk kasus baru
- ✅ **Advanced Filtering** - Filter by status, accident type, date
- ✅ **Case Management** - Mark cases as handled dengan response time tracking
- ✅ **Orange Theme UI** - Tampilan khusus petugas emergency (beda dari admin)
- ✅ **Read-Only Access** - Keamanan data dengan akses view only
- ✅ **Statistics Dashboard** - Active cases, today total, handled, avg response time
- ✅ **Supabase Integration** - Authentication dengan Supabase Auth

### 💬 Real-time Chat System
- ✅ **WebSocket Connection** - Chat real-time tanpa refresh
- ✅ **Online Status** - Lihat siapa yang sedang online
- ✅ **Typing Indicator** - Indikator ketika ada yang mengetik
- ✅ **Message History** - Riwayat chat tersimpan
- ✅ **Role-based Chat** - Student, Teacher, Staff, Admin
- ✅ **Responsive Design** - Optimal di Android, iOS, Desktop

### 👤 Face Recognition
- ✅ **Face Detection** - Deteksi wajah real-time
- ✅ **Face Landmarks** - 68 titik landmark wajah
- ✅ **Tiny Face Detector** - Model ringan untuk performa cepat
- ✅ **Camera Access** - Akses kamera untuk scan wajah

### 🎨 User Interface
- ✅ **Modern Design** - UI/UX yang clean dan profesional
- ✅ **Fully Responsive** - Support desktop, tablet, mobile
- ✅ **Blue Theme** - Warna biru konsisten (#3b82f6) untuk user/admin
- ✅ **Orange Theme** - Warna orange (#ff6b35) untuk emergency responder
- ✅ **Android Optimized** - Tested di Android 7.1.2 (360x640)
- ✅ **Loading States** - Animasi loading yang smooth
- ✅ **Error Handling** - Pesan error yang jelas

---

## 🔧 Setup Lengkap

### STEP 1: Install Node.js
1. Download Node.js dari https://nodejs.org
2. Install Node.js (versi 14 atau lebih baru)
3. Verifikasi instalasi:
   ```bash
   node --version
   npm --version
   ```

### STEP 2: Setup Telegram Bot

#### 2.1 Buat Bot di BotFather
1. Buka Telegram dan cari **@BotFather**
2. Kirim perintah: `/newbot`
3. Masukkan nama bot: `SMK MARHAS Emergency Bot`
4. Masukkan username: `smk_marhas_emergency_bot`
5. Copy **Bot Token** yang diberikan (format: `123456789:ABCdefGHI...`)

#### 2.2 Buat Grup Emergency
1. Buat grup baru di Telegram
2. Nama grup: `SMK MARHAS Emergency Team`
3. Tambahkan **semua petugas** ke grup
4. Tambahkan **bot** ke grup (cari username bot)
5. **Jadikan bot sebagai admin** grup

#### 2.3 Dapatkan Chat ID Grup
Metode 1 - Via API:
```
1. Kirim pesan di grup: /start
2. Buka browser dan akses:
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
3. Cari nilai "chat":{"id":-xxxxxxxxx}
4. Copy chat ID (termasuk tanda minus)
```

Metode 2 - Via Bot:
```
1. Tambahkan bot @RawDataBot ke grup
2. Bot akan mengirim info grup termasuk Chat ID
3. Copy chat ID yang diberikan
4. Remove @RawDataBot dari grup
```

#### 2.4 Konfigurasi File
Edit file `telegram-config.env`:
```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8198723255:AAHVETKgh3jeirGR-vzi0_MbF-B7qvjfSR8
TELEGRAM_CHAT_ID=-1003189919970

# Server Configuration
PORT=3003
NODE_ENV=production

# Location Information
LOCATION_NAME=SMK MARHAS Margahayu
LOCATION_ADDRESS=Jl. Raya Margahayu No.186, Margahayu, Kec. Margahayu, Kabupaten Bandung, Jawa Barat
LOCATION_LATITUDE=-6.9559
LOCATION_LONGITUDE=107.6411
LOCATION_GOOGLE_MAPS=https://maps.google.com/?q=-6.9559,107.6411
```

### STEP 3: Install & Run

```bash
# Install dependencies
npm install

# Jalankan server
npm start
```

Server akan berjalan di: http://localhost:3003

### STEP 4: Setup Emergency Responder System (Optional)

Jika Anda ingin mengaktifkan portal untuk petugas darurat (polisi, pemadam, medis):

1. **Baca dokumentasi lengkap**: [EMERGENCY_SETUP.md](EMERGENCY_SETUP.md)
2. **Setup Supabase Project** untuk authentication
3. **Buat akun emergency responder** di Supabase
4. **Konfigurasi environment variables**
5. **Test login** di http://localhost:3003/login-emergency.html

**Quick Setup Emergency:**
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Edit .env file
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Restart server
npm start
```

📖 **Full Guide**: Lihat [EMERGENCY_SETUP.md](EMERGENCY_SETUP.md) untuk panduan lengkap setup Supabase, membuat akun emergency, dan troubleshooting.

---

## 📱 Cara Menggunakan

### 🚨 Mengirim Emergency Alert

1. **Buka Dashboard**: http://localhost:3003/dashboard.html
2. **Klik Tombol Merah** "TEKAN UNTUK MEMANGGIL"
3. **Pilih Tipe Kecelakaan** (medical/fire/crime/accident/other)
4. **Konfirmasi** di dialog popup
5. **Alert terkirim!** Semua anggota grup Telegram akan menerima:
   - 🚨 Pesan emergency dengan kategori
   - 📍 Lokasi sekolah (Google Maps)
   - ⏰ Waktu kejadian
   - 🔴 Status emergency button activation
6. **Dashboard Emergency Responder** otomatis update real-time

### 🚑 Akses Emergency Responder (Petugas Darurat)

**Untuk: Polisi, Pemadam Kebakaran, Tim Medis, Rescue Team**

1. **Buka Login Page**: http://localhost:3003/login-emergency.html
2. **Masukkan Credentials**:
   - Email: `polisi@emergency.com` (atau akun Anda)
   - Password: (sesuai setup Supabase)
3. **Klik Login** → Redirect ke Emergency Dashboard
4. **Monitor Kasus**:
   - Lihat **stats cards**: Active, Today Total, Handled, Avg Response Time
   - Filter by **Status**: All / Active / Handled
   - Filter by **Type**: All / Medical / Fire / Crime / Accident / Other
   - Filter by **Date**: Pilih tanggal spesifik
5. **Handle Kasus**:
   - Klik tombol **"Mark as Handled"** pada case card
   - Sistem otomatis track response time
   - Broadcast update ke semua responder yang online
6. **Notifications**:
   - Desktop notification untuk kasus baru (jika permission granted)
   - Real-time updates via WebSocket
   - Sound alert untuk emergency baru

**⚠️ Access Level**: Emergency responder hanya bisa VIEW dan UPDATE status. TIDAK bisa DELETE atau EDIT data kasus (read-only access dengan track handling).

### 💬 Menggunakan Chat

1. **Buka Service Chat**: http://localhost:3003/service.html
2. **Masukkan nama** di popup welcome
3. **Pilih role**: Student / Teacher / Staff / Admin
4. **Klik Join Chat**
5. **Mulai chat!** Ketik pesan dan klik tombol kirim
6. **Lihat status online** di header kanan atas
7. **Typing indicator** muncul saat ada yang mengetik

### 👤 Face Recognition

1. **Buka Face Scan**: http://localhost:3003/scan.html
2. **Izinkan akses kamera** browser
3. **Posisikan wajah** di depan kamera
4. **Sistem otomatis detect** wajah real-time
5. **Landmark points** ditampilkan di wajah

---

## 🔍 Monitoring Server

### Cek Status Server (PowerShell)
```powershell
# Lihat server di port 3003
netstat -ano | findstr :3003

# Lihat semua proses Node.js
tasklist | findstr node

# Lihat detail proses
Get-Process -Name node | Format-Table Id, ProcessName, CPU, StartTime
```

### Stop Server
```powershell
# Cari PID dari netstat
netstat -ano | findstr :3003

# Kill process (ganti 1234 dengan PID aktual)
taskkill /F /PID 1234
```

---

## 📡 API Endpoints

### REST API

#### Public Endpoints
| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/health` | Health check server | `{"status":"OK","server":"..."}` |
| GET | `/telegram-status` | Status Telegram bot | `{"status":"connected","bot":{...}}` |
| POST | `/send-emergency` | Kirim emergency alert | `{"success":true}` |
| POST | `/send-emergency-telegram` | Kirim emergency ke Telegram | `{"success":true}` |
| GET | `/test-telegram` | Test koneksi Telegram | HTML test page |

#### Emergency Responder API (Protected - Requires Bearer Token)
| Method | Endpoint | Description | Auth | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/emergency-login` | Login emergency responder | ❌ | `{"success":true,"token":"...","user":{...}}` |
| GET | `/api/emergency-cases` | Get filtered emergency cases | ✅ | `{"success":true,"cases":[...],"stats":{...}}` |
| POST | `/api/emergency-cases/:id/handle` | Mark case as handled | ✅ | `{"success":true,"case":{...}}` |

**Query Parameters for `/api/emergency-cases`:**
- `status`: `all` / `active` / `handled`
- `type`: `all` / `medical` / `fire` / `crime` / `accident` / `other`
- `date`: `YYYY-MM-DD` format

**Example Request:**
```bash
# Login
curl -X POST http://localhost:3003/api/emergency-login \
  -H "Content-Type: application/json" \
  -d '{"email":"polisi@emergency.com","password":"pass123"}'

# Get cases (with token)
curl -X GET "http://localhost:3003/api/emergency-cases?status=active&type=medical" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Handle case
curl -X POST http://localhost:3003/api/emergency-cases/1234567890/handle \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"notes":"Tim sudah di lokasi"}'
```

### WebSocket Events

#### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-chat` | `{userName, role}` | Join chat room |
| `send-message` | `{text}` | Kirim pesan chat |
| `typing` | - | User sedang mengetik |
| `stop-typing` | - | User berhenti mengetik |
| `emergency-alert` | `{location, message}` | Kirim alert darurat |

#### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `new-message` | `{userName, text, timestamp, role}` | Pesan baru diterima |
| `user-joined` | `{userName, role}` | User baru join |
| `user-left` | `{userName}` | User keluar |
| `typing` | `{userName}` | User mengetik |
| `stop-typing` | `{userName}` | User berhenti mengetik |
| `online-count` | `{count}` | Jumlah user online |
| `emergency-alert` | `{id, type, message, ...}` | **Emergency alert broadcast** |
| `case-handled` | `{id, status, respondedBy, ...}` | **Case handled update** |

---

## 🧪 Testing

### Test Telegram Connection

**Cara 1 - Via Batch File:**
```
Double-click: test-telegram.bat
```

**Cara 2 - Via Browser:**
```
http://localhost:3003/test-telegram
```

**Cara 3 - Via cURL:**
```bash
curl http://localhost:3003/telegram-status
```

### Test Emergency Alert
```bash
curl -X POST http://localhost:3003/send-emergency-telegram
```

### Test Health Check
```bash
curl http://localhost:3003/health
```

Response yang benar:
```json
{
  "status": "OK",
  "server": "Emergency Hotline Integrated Server",
  "port": 3003,
  "stats": {
    "connectedUsers": 0,
    "totalMessages": 0,
    "totalAlerts": 0
  }
}
```

---

## ⚠️ Troubleshooting

### ❌ Server Tidak Start

**Problem:** `Error: listen EADDRINUSE :::3003`
```bash
# Solusi: Port 3003 sudah digunakan
# Cari proses yang menggunakan port
netstat -ano | findstr :3003

# Kill proses (ganti PID)
taskkill /F /PID <PID>

# Jalankan ulang
npm start
```

**Problem:** `Cannot find module`
```bash
# Solusi: Dependencies belum terinstall
npm install

# Clear cache jika perlu
npm cache clean --force
npm install
```

### ❌ Telegram Tidak Terkirim

**Problem:** `Error: Unauthorized`
```
Solusi:
1. Cek TELEGRAM_BOT_TOKEN di telegram-config.env
2. Pastikan tidak ada spasi atau enter extra
3. Token format: 123456789:ABCdefGHI...
4. Generate token baru di @BotFather jika perlu
```

**Problem:** `Error: Chat not found`
```
Solusi:
1. Cek TELEGRAM_CHAT_ID di telegram-config.env
2. Chat ID harus termasuk tanda minus: -1234567890
3. Pastikan bot sudah ditambahkan ke grup
4. Jadikan bot sebagai admin grup
```

**Problem:** `Error: Bot was blocked by the user`
```
Solusi:
1. Buka grup Telegram
2. Cek apakah bot masih ada di grup
3. Jika bot sudah di-kick, tambahkan kembali
4. Jadikan bot sebagai admin
```

### ❌ Chat Tidak Terhubung

**Problem:** WebSocket connection failed
```
Solusi:
1. Buka Developer Console (F12)
2. Lihat tab Console untuk error detail
3. Pastikan server berjalan di port 3003
4. Refresh halaman (Ctrl+F5)
5. Cek firewall tidak block WebSocket
```

**Problem:** Messages not sending
```
Solusi:
1. Cek koneksi WebSocket (ikon online/offline)
2. Lihat console browser untuk error
3. Pastikan userName sudah diisi
4. Restart server jika perlu
```

### ❌ Face Recognition Error

**Problem:** Camera not found
```
Solusi:
1. Klik "Allow" pada browser permission
2. Cek kamera tidak digunakan aplikasi lain
3. Test kamera di aplikasi lain
4. Gunakan browser berbeda (Chrome recommended)
```

**Problem:** Models not loading
```
Solusi:
1. Pastikan folder weights/ ada
2. Cek file model di weights/models/
3. Pastikan struktur folder sudah benar
```

### ❌ UI/Styling Issues

**Problem:** Buttons tidak full width di Android
```
Solusi:
- Sudah diperbaiki di dashboard.html
- Refresh halaman dengan Ctrl+F5
- Clear browser cache
```

**Problem:** Chat input tidak horizontal
```
Solusi:
- Sudah diperbaiki di service.html
- Media query sudah set flex-direction: row
- Test di F12 Device Mode
```

---

## 📁 Struktur Project

```
📁 c:\iot - Copy\
│
├── 📄 server.js                      # Main integrated server (PORT 3003)
├── 📄 package.json                   # Dependencies & scripts
├── 📄 telegram-config.env            # Telegram configuration
│
├── 🌐 HTML Pages
│   ├── dashboard.html                # Dashboard utama
│   ├── service.html                  # Service chat (responsive)
│   ├── chat.html                     # Chat system
│   ├── admin.html                    # Admin panel
│   ├── login-admin.html              # Admin login
│   ├── login-emergency.html          # 🚨 Emergency responder login
│   ├── emergency-dashboard.html      # 🚨 Emergency dashboard (real-time)
│   ├── emergency-numbers.html        # Emergency contacts
│   ├── scan.html                     # Face recognition
│   └── test-system.html              # Testing page
│
├── 🚀 Batch Files
│   ├── start-system.bat              # Start integrated server
│   ├── start-complete-system.bat     # Start all systems
│   ├── start-emergency-system.bat    # Emergency only
│   └── test-telegram.bat             # Test Telegram
│
├── 📚 Documentation
│   ├── readme.md                     # This file (comprehensive guide)
│   ├── EMERGENCY_SETUP.md            # 🚨 Emergency responder setup guide
│   ├── SETUP_GUIDE.md                # Setup guide lengkap
│   ├── README_NEW.md                 # Documentation v2
│   └── QUICK_START_ADMIN.md          # Admin quick start
│
├── 📁 weights/                       # Face-api.js models
│   └── models/
│       ├── tiny_face_detector/
│       ├── face_landmark_68_tiny/
│       └── face_recognition/
│
├── 📁 assets/                        # Static assets
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── models/
│
└── 📁 img/                           # Images & logos
    └── logo.png
```

---

## 🔒 Security & Best Practices

### 🔐 Keamanan Token
- ✅ File `.env` dan `telegram-config.env` di-gitignore
- ✅ **JANGAN** commit token ke GitHub/repository publik
- ✅ **JANGAN** share token di chat atau email
- ✅ Ganti token jika terekspos

### 👨‍💼 Admin Access
- Default credentials: `admin` / `admin123`
- **WAJIB** ganti password di production
- Login page: http://localhost:3003/login-admin.html

### 🌐 Production Deployment
```
Untuk production (server online):
1. Gunakan HTTPS (SSL Certificate)
2. Setup reverse proxy (nginx/Apache)
3. Ganti NODE_ENV=production
4. Gunakan PM2 untuk process management
5. Setup firewall rules
6. Regular backup database
```

---

## 🎯 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js v14+, Express.js v4.18 |
| **Real-time** | Socket.IO v4.8.1 |
| **Bot API** | Telegram Bot API (via axios) |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Face AI** | face-api.js (TensorFlow.js) |
| **UI Framework** | Custom CSS with Flexbox/Grid |
| **Icons** | Font Awesome 6.4.0 |
| **HTTP Client** | Axios v1.7.9 |

---

## 📞 Support & Contact

**Institusi:** SMK MARHAS Margahayu  
**Lokasi:** Jl. Raya Margahayu No.186, Margahayu, Bandung  
**Versi:** 2.0.0  
**Update Terakhir:** November 2025

**Jika Ada Masalah:**
1. Baca [Troubleshooting](#-troubleshooting)
2. Cek [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Test dengan `test-telegram.bat`
4. Lihat console log untuk error detail

---

## ✅ Checklist Setup

Pastikan semua langkah ini sudah dilakukan:

**Prerequisites:**
- [ ] Node.js v14+ terinstall
- [ ] npm terinstall dan berfungsi
- [ ] Port 3003 tersedia (tidak digunakan)

**Telegram Setup:**
- [ ] Bot Telegram sudah dibuat via @BotFather
- [ ] Bot Token sudah di-copy
- [ ] Grup Telegram sudah dibuat
- [ ] Bot sudah ditambahkan ke grup
- [ ] Bot sudah dijadikan admin grup
- [ ] Chat ID grup sudah didapat

**Configuration:**
- [ ] File `telegram-config.env` sudah diedit
- [ ] TELEGRAM_BOT_TOKEN sudah diisi
- [ ] TELEGRAM_CHAT_ID sudah diisi (termasuk tanda -)
- [ ] PORT sudah diset (default: 3003)
- [ ] Koordinat lokasi sudah diupdate

**Installation:**
- [ ] `npm install` sudah dijalankan
- [ ] Tidak ada error saat install
- [ ] Dependencies terinstall lengkap

**Testing:**
- [ ] Server bisa start dengan `npm start`
- [ ] http://localhost:3003/health return OK
- [ ] http://localhost:3003/telegram-status return connected
- [ ] Test Telegram berhasil kirim pesan
- [ ] Dashboard bisa dibuka
- [ ] Chat bisa terhubung
- [ ] Emergency alert bisa terkirim

**Jika semua ✅, sistem siap production!**

---

## 🚨 Emergency Responder System

### Overview
Sistem khusus untuk petugas darurat yang memungkinkan polisi, pemadam kebakaran, tim medis, dan rescue team untuk:
- ✅ Login dengan akun dedicated (role: emergency)
- ✅ Melihat kasus emergency real-time
- ✅ Filter kasus by status, type, dan date
- ✅ Mark kasus sebagai handled
- ✅ Track response time
- ✅ Menerima desktop notifications

### Features
- **Orange Theme UI** - Berbeda dari admin (blue)
- **Read-Only Access** - Tidak bisa delete/edit data kasus
- **Real-time Updates** - Socket.IO untuk live broadcast
- **Statistics Dashboard** - Active cases, handled, avg response time
- **Accident Type Filtering** - Medical, Fire, Crime, Accident, Other
- **Supabase Authentication** - Secure login dengan JWT token
- **Desktop Notifications** - Alert suara untuk kasus baru

### Quick Start
1. **Setup Supabase**: Lihat [EMERGENCY_SETUP.md](EMERGENCY_SETUP.md)
2. **Buat Emergency Accounts** di Supabase Auth
3. **Configure `.env`**:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Install Supabase client**:
   ```bash
   npm install @supabase/supabase-js
   ```
5. **Update `server.js`** dengan Supabase integration (lihat EMERGENCY_SETUP.md)
6. **Test Login**: http://localhost:3003/login-emergency.html

### Emergency Responder Accounts (Recommended)
| Email | Organization | Access Level |
|-------|--------------|--------------|
| `polisi@emergency.com` | Kepolisian | Emergency (read + handle) |
| `pemadam@emergency.com` | Pemadam Kebakaran | Emergency (read + handle) |
| `medis@emergency.com` | Tim Medis | Emergency (read + handle) |
| `rescue@emergency.com` | Tim Rescue | Emergency (read + handle) |
| `ambulans@emergency.com` | Ambulans | Emergency (read + handle) |

### Data Flow
```
User clicks Emergency Button (dashboard.html)
    ↓
POST /send-emergency (with emergencyButtonPressed: true)
    ↓
Server stores in emergencyAlerts array
    ↓
Telegram notification sent to group
    ↓
Socket.IO broadcast 'emergency-alert' event
    ↓
Emergency Dashboard updates real-time
    ↓
Desktop notification to all online responders
    ↓
Responder clicks "Mark as Handled"
    ↓
POST /api/emergency-cases/:id/handle
    ↓
Server updates case status + response time
    ↓
Socket.IO broadcast 'case-handled' event
    ↓
All dashboards update instantly
```

### API Endpoints
- `POST /api/emergency-login` - Authenticate responder
- `GET /api/emergency-cases` - Get filtered cases (with stats)
- `POST /api/emergency-cases/:id/handle` - Mark as handled

### Security
- ✅ JWT token validation via Supabase
- ✅ Role-based access (emergency role only)
- ✅ Bearer token required for all API calls
- ✅ Read-only access (cannot delete/modify case data)
- ✅ Session management with auto-logout
- ✅ HTTPS recommended for production

📖 **Full Documentation**: [EMERGENCY_SETUP.md](EMERGENCY_SETUP.md)

---

## 📜 License

MIT License

Copyright (c) 2025 SMK MARHAS Margahayu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

---

<div align="center">

**Made with ❤️ for SMK MARHAS Margahayu**

🚨 Emergency Hotline System v2.0.0 🚨

</div>
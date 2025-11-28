#  Emergency Hotline System (EHS)

<div align="center">

![EHS Logo](./img/logo.png)

**Sistem Kiosk Darurat Cerdas dengan Face Recognition & AI Voice Assistant**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E.svg)](https://supabase.com/)

[Demo Video](#) • [Dokumentasi](#fitur-utama) • [Instalasi](#instalasi)

</div>

---

##  Tentang Proyek

**Emergency Hotline System (EHS)** adalah sistem kiosk interaktif berbasis web yang memudahkan pengguna untuk memanggil layanan darurat (Polisi, Ambulans, Damkar, SAR) dengan cepat dan efisien. Sistem ini dilengkapi dengan teknologi **Face Recognition** untuk identifikasi pengguna dan **AI Voice Assistant** untuk panduan pertolongan pertama.

###  Tujuan
- Mempercepat waktu respon layanan darurat di lingkungan sekolah dan fasilitas umum
- Memberikan akses mudah ke layanan darurat tanpa perlu mengingat nomor telepon
- Menyediakan panduan pertolongan pertama real-time melalui AI
- Meningkatkan keamanan dengan sistem notifikasi otomatis ke petugas

###  Dikembangkan oleh
**SMK MARHAS Margahayu** - Bandung, Jawa Barat

---

##  Fitur Utama

### 1.  Face Recognition
- **Deteksi wajah otomatis** menggunakan `face-api.js`
- **Identifikasi pengguna** untuk tracking dan keamanan
- **Pengukuran suhu tubuh simulasi** untuk screening kesehatan

### 2.  Emergency Button
- **One-tap emergency call** untuk 4 jenis layanan:
  -  **Polisi** (110)
  -  **Ambulans** (118/119)
  -  **Damkar** (113)
  -  **SAR** (115)
- **Notifikasi real-time** ke Telegram & Dashboard Emergency Responder
- **GPS Location Sharing** otomatis

### 3.  AI Voice Assistant
- **Voice-activated** pertolongan pertama menggunakan OpenAI Realtime API
- **Panduan P3K** dalam Bahasa Indonesia
- **Text-to-Speech** untuk instruksi langkah demi langkah

### 4.  Dashboard Admin
- **Multi-Kiosk Management**: Pantau status semua kiosk dari satu dashboard
- **Emergency Case Tracking**: Lihat riwayat laporan dan status penanganan
- **Analytics**: Statistik kejadian darurat per tipe, lokasi, dan waktu

### 5.  Real-time Chat
- **WebSocket (Socket.IO)** untuk komunikasi instant
- **Chat antara pengguna dan petugas** emergency responder
- **Typing indicators** dan status online

---

##  Arsitektur Sistem

```

   Kiosk (Web)    ← Face Recognition + Emergency Button

         
         

   Node.js        ← Express + Socket.IO
   Server        

         
    
                                 
   
Supabase Telegram OpenAI   Socket.IO
  DB       Bot    Realtime  Clients 
   
```

---

##  Tech Stack

### Frontend
- **HTML5 + Vanilla CSS** - UI/UX modern dengan glassmorphism
- **JavaScript (ES6+)** - Logika client-side
- **face-api.js** - Face detection & recognition
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js + Express.js** - REST API server
- **Socket.IO** - WebSocket untuk real-time features
- **Supabase** - PostgreSQL database & authentication
- **Axios** - HTTP client untuk API calls

### AI & Integrations
- **OpenAI Realtime API** - Voice assistant (GPT-4o)
- **Telegram Bot API** - Notifikasi darurat
- **Web Speech API** - Text-to-Speech

---

##  Instalasi

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Akun Supabase ([Daftar Gratis](https://supabase.com/))
- Telegram Bot Token ([Tutorial](https://core.telegram.org/bots#6-botfather))
- OpenAI API Key ([Dapatkan di sini](https://platform.openai.com/))

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/emergency-hotline-system.git
cd emergency-hotline-system
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
Buat file `.env` di root folder:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# OpenAI
OPENAI_API_KEY=sk-your-api-key

# OpenRouter (Alternative AI)
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=anthropic/claude-sonnet-4.5

# Server Configuration
PORT=3003
LOCATION_NAME=SMK MARHAS Margahayu
LOCATION_ADDRESS=Jl. Raya Margahayu No.186, Bandung
LOCATION_LATITUDE=-6.9759367
LOCATION_LONGITUDE=107.5704834
```

4. **Setup Database**
Jalankan SQL scripts di Supabase SQL Editor:
```bash
# Buat tabel yang diperlukan
database-schema.sql
create-emergency-table.sql
create-face-scans-table.sql
```

5. **Run Server**
```bash
npm start
```

Server akan berjalan di `http://localhost:3003`

6. **Akses Aplikasi**
- **Dashboard**: `http://localhost:3003/dashboard.html`
- **Face Scan**: `http://localhost:3003/scan.html`
- **Admin Panel**: `http://localhost:3003/admin.html`
- **Emergency Dashboard**: `http://localhost:3003/emergency-dashboard.html`

---

##  Penggunaan

### Untuk Pengguna (Kiosk)
1. Buka `dashboard.html` di browser kiosk
2. Klik **"Scan Wajah"** untuk identifikasi
3. Pilih jenis emergency (Polisi/Ambulans/Damkar/SAR)
4. Tekan tombol darurat merah
5. Sistem otomatis mengirim notifikasi ke petugas

### Untuk Petugas (Emergency Responder)
1. Login di `emergency-dashboard.html`
2. Terima notifikasi real-time via Telegram
3. Lihat detail kasus (foto, lokasi, waktu)
4. Tandai kasus sebagai "Handled" setelah ditangani

---

##  Fitur Mendatang (Roadmap)

- [ ] **Mobile App** (Android/iOS) menggunakan React Native
- [ ] **Multi-Language Support** (Sunda, Jawa, dll)
- [ ] **AI Predictive Analytics** untuk hotspot kejahatan
- [ ] **Integrasi API 112 Nasional** (Kemenkominfo)
- [ ] **Offline Mode** dengan PWA Service Workers
- [ ] **Docker Containerization** untuk deployment mudah

Lihat [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) untuk detail lengkap.

---

##  Kontribusi

Kami menerima kontribusi dari komunitas! Silakan:
1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

##  Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

##  Tim Pengembang

**SMK MARHAS Margahayu**
-  Email: contact@smkmarhas.sch.id
-  Website: [www.smkmarhas.sch.id](https://www.smkmarhas.sch.id)
-  Lokasi: Jl. Raya Margahayu No.186, Bandung, Jawa Barat

---

##  Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Face recognition library
- [Supabase](https://supabase.com/) - Backend as a Service
- [OpenAI](https://openai.com/) - AI Voice Assistant
- [Socket.IO](https://socket.io/) - Real-time engine
- [Telegram](https://telegram.org/) - Notification platform

---

<div align="center">

**Dibuat dengan  untuk Indonesia yang lebih aman**

 Star proyek ini jika bermanfaat!

</div>
#  ANALISIS LENGKAP PROYEK IOT - EMERGENCY HOTLINE SYSTEM

##  OVERVIEW PROYEK

**Nama Proyek:** Emergency Hotline Integrated System  
**Versi:** 2.0.0  
**Institusi:** SMK MARHAS Margahayu  
**Tipe:** Sistem Emergency Hotline Terintegrasi dengan Face Recognition, Telegram Bot, dan Real-time Chat

---

##  KOMPONEN UTAMA PROYEK

### 1. **Backend Server** (`server.js`)
- **Framework:** Node.js + Express.js
- **Port:** 3003 (default) atau dari env
- **Fungsi Utama:**
  - REST API untuk emergency alerts
  - WebSocket server (Socket.IO) untuk real-time communication
  - Integrasi Telegram Bot API
  - Integrasi Supabase (database & authentication)
  - OpenAI Realtime API proxy
  - OpenRouter AI Assistant proxy

### 2. **Telegram Server** (`telegram-server.js`)
- **Port:** 3003 (alternatif)
- **Fungsi:** Server khusus untuk Telegram bot notifications
- **Fitur:** Chat system, emergency notifications

### 3. **Frontend Pages (HTML)**

#### A. **User Pages:**
- **`dashboard.html`** - Dashboard utama dengan tombol emergency
- **`service.html`** - Real-time chat service
- **`scan.html`** - Face recognition scanning
- **`scan-manual.html`** - Manual face scanning
- **`register-face.html`** - Registrasi wajah baru
- **`view-registered-faces.html`** - Lihat wajah terdaftar
- **`test-temperature-detection.html`** - Test deteksi suhu

#### B. **Admin Pages:**
- **`admin.html`** - Admin panel untuk monitoring
- **`login-admin.html`** - Login admin
- **`analytics.html`** - Analytics dashboard
- **`chat.html`** - Chat system alternatif

#### C. **Emergency Responder Pages:**
- **`login-emergency.html`** - Login untuk petugas darurat
- **`emergency-dashboard.html`** - Dashboard real-time untuk polisi, pemadam, medis

### 4. **Face Recognition System**
- **Library:** face-api.js (TensorFlow.js)
- **Models:**
  - `tiny_face_detector` - Deteksi wajah
  - `face_landmark_68_tiny` - Landmark 68 titik
  - `face_recognition` - Face descriptor (128 angka)
- **File:** `face-recognition.js` - Utility functions untuk matching

### 5. **Database (Supabase)**
- **Tables:**
  - `registered_faces` - Data wajah terdaftar
  - `face_scans` - Metadata setiap scan
  - `emergency_alerts` - Data emergency alerts
  - `access_logs` - Log akses sistem
  - `kiosk_settings` - Settings kiosk mode

### 6. **Batch Files (Windows)**
- **`start-system.bat`** - Start integrated server
- **`start-complete-system.bat`** - Start semua sistem
- **`start-emergency-system.bat`** - Start emergency only
- **`start-kiosk-mode.bat`** - Start kiosk mode
- **`test-telegram.bat`** - Test Telegram connection
- **`auto-start-kiosk.bat`** - Auto start kiosk

### 7. **Documentation Files**
- **`readme.md`** - Dokumentasi utama
- **`EMERGENCY_ALARM_SYSTEM.md`** - Dokumentasi alarm system
- **`DEPLOYMENT_GUIDE.md`** - Panduan deployment
- **`KIOSK_MODE_SETUP.md`** - Setup kiosk mode
- Dan banyak dokumentasi lainnya

---

##  ALUR KERJA SISTEM (FLOW)

### **ALUR 1: EMERGENCY BUTTON PRESSED**

```
1. User membuka dashboard.html
   ↓
2. User login (opsional) atau langsung akses
   ↓
3. User klik tombol EMERGENCY (merah besar)
   ↓
4. Dialog muncul: Pilih tipe emergency
   - Medical ()
   - Fire ()
   - Crime ()
   - Accident ()
   - Other ()
   ↓
5. User konfirmasi
   ↓
6. Frontend kirim POST ke /send-emergency dengan data:
   {
     type: 'Emergency Alert',
     message: 'Emergency button pressed - {accidentType}',
     userName: ...,
     userPhoto: ...,
     emergencyButtonPressed: true,
     accidentType: 'medical' | 'fire' | 'crime' | 'accident' | 'other',
     scanId: ... (jika ada),
     scanPhoto: ...,
     bodyTemperature: ...,
     location: { latitude, longitude }
   }
   ↓
7. Server (server.js) menerima request:
   a. Format pesan untuk Telegram
   b. Kirim ke Telegram Bot API
   c. Kirim lokasi GPS ke Telegram
   d. Simpan ke database (emergency_alerts table)
   e. Update face_scans table jika ada scanId
   f. Broadcast via Socket.IO: 'emergency-alert' event
   ↓
8. Semua client yang terhubung menerima:
   - Emergency Dashboard: Update real-time + alarm berbunyi
   - Dashboard: Notifikasi sukses
   - Admin Panel: Log emergency baru
   ↓
9. Telegram Group menerima:
   - Pesan emergency dengan detail lengkap
   - Lokasi Google Maps
   - Info pengirim, waktu, tipe emergency
```

### **ALUR 2: FACE RECOGNITION SCANNING**

```
1. User membuka scan.html
   ↓
2. Sistem load face-api.js models
   ↓
3. Akses kamera (permission)
   ↓
4. Real-time detection:
   - Deteksi wajah dengan TinyFaceDetector
   - Ekstrak face descriptor (128 angka)
   - Tampilkan landmark 68 titik
   ↓
5. User klik "Capture" atau auto-capture
   ↓
6. Sistem:
   a. Ambil foto dari video stream
   b. Ekstrak face descriptor
   c. Cari match di registered_faces (cosine similarity)
   d. Jika match (similarity >= 0.6):
      - Tampilkan: "Selamat datang, {name}!"
      - matchedUser = face data
   e. Jika tidak match:
      - Auto-register sebagai "Guest Emergency"
      - matchedUser = guest data
   ↓
7. Upload foto ke Supabase Storage:
   - Path: YYYY/Bulan/DD/filename.jpg
   - Generate scanId unik
   ↓
8. Simpan metadata ke face_scans table:
   {
     scanid: ...,
     imagepath: ...,
     scantime: ...,
     isemergency: false (default),
     body_temperature: ... (jika ada),
     usernote: ...
   }
   ↓
9. Jika ada matchedUser:
   - Log ke access_logs
   - Tampilkan info user
   ↓
10. scanId disimpan di localStorage
    - Digunakan untuk emergency button
    - Link scan dengan emergency alert
```

### **ALUR 3: EMERGENCY RESPONDER DASHBOARD**

```
1. Petugas darurat buka login-emergency.html
   ↓
2. Login dengan Supabase Auth:
   - Email: polisi@emergency.com
   - Password: ...
   ↓
3. POST /api/emergency-login
   - Authenticate via Supabase
   - Return JWT token
   ↓
4. Redirect ke emergency-dashboard.html
   ↓
5. Dashboard load:
   a. GET /api/emergency-cases?status=all&type=all
      - Headers: Authorization: Bearer {token}
      - Return: { cases: [...], stats: {...} }
   b. Connect Socket.IO
   ↓
6. Display:
   - Stats cards: Active, Today Total, Handled, Avg Response Time
   - Filter: Status, Type, Date
   - Case cards: List emergency cases
   ↓
7. Real-time updates:
   - Socket.IO listen: 'emergency-alert' event
   - Auto refresh cases
   - Desktop notification
   - Alarm berbunyi (3x)
   ↓
8. Handle case:
   - Klik "Mark as Handled"
   - POST /api/emergency-cases/:id/handle
   - Update status: 'handled'
   - Calculate response time
   - Broadcast: 'case-handled' event
   ↓
9. Semua dashboard update real-time
```

### **ALUR 4: REAL-TIME CHAT SYSTEM**

```
1. User buka service.html
   ↓
2. Popup: Masukkan nama & pilih role
   - Student
   - Teacher
   - Staff
   - Admin
   ↓
3. Connect Socket.IO ke server
   ↓
4. Emit: 'join-chat' event
   {
     name: ...,
     role: ...
   }
   ↓
5. Server:
   - Add user ke connectedUsers Map
   - Broadcast: 'user-joined' ke semua client
   - Send: 'chat-history' ke user baru
   ↓
6. User kirim pesan:
   - Emit: 'send-message' event
   - Server broadcast: 'new-message' ke semua
   ↓
7. Typing indicator:
   - Emit: 'typing' saat mengetik
   - Emit: 'stop-typing' saat berhenti
   - Broadcast ke semua client
   ↓
8. Online status:
   - Display jumlah user online
   - Update real-time
```

### **ALUR 5: AI VOICE ASSISTANT (OpenAI Realtime)**

```
1. User klik voice assistant button di dashboard
   ↓
2. Frontend request session token:
   POST /api/openai-session
   ↓
3. Server generate ephemeral token:
   - POST https://api.openai.com/v1/realtime/sessions
   - Return: client_secret (token)
   ↓
4. Frontend connect WebSocket:
   ws://localhost:3003/ws/openai-realtime
   ↓
5. Server proxy:
   - Client WS <-> Server <-> OpenAI WS
   - Relay messages bidirectional
   ↓
6. Voice interaction:
   - User speak -> Audio stream -> OpenAI
   - OpenAI response -> Audio stream -> User
   - Real-time conversation
```

---

##  ARSITEKTUR SISTEM

```

                    CLIENT LAYER (Browser)                    

            
   dashboard       scan.html       emergency-         
   .html                           dashboard          
                                   .html              
            
                                                          
                       
                                                             

                             
                              HTTP/REST + WebSocket
                             

                    SERVER LAYER (Node.js)                    

                                                             
                      
                  server.js (Port 3003)                    
                           
            Express.js REST API                          
            - /send-emergency                            
            - /api/emergency-cases                       
            - /api/ai-assistant                          
            - /api/openai-session                        
                           
                           
            Socket.IO WebSocket                          
            - join-chat                                  
            - send-message                               
            - emergency-alert                             
            - case-handled                               
                           
                           
            OpenAI Realtime Proxy                       
            - WebSocket proxy                            
                           
                      
                                                             

                             
        
                                                
                                                
        
  Telegram           Supabase          OpenAI     
  Bot API            Database          Realtime   
                     + Auth            API        
  - Send msg                                      
  - Send loc        - Tables          - Voice AI  
  - Notify          - Storage          - Session   
        
```

---

##  DATABASE SCHEMA

### **Table: registered_faces**
```sql
- id (TEXT PRIMARY KEY)
- name (TEXT)
- nik (TEXT)
- email (TEXT)
- face_descriptor (JSONB) - 128 angka array
- registered_at (TIMESTAMPTZ)
- registered_by (TEXT)
- is_active (BOOLEAN)
- is_guest (BOOLEAN)
- guest_type (TEXT)
- photo_path (TEXT)
```

### **Table: face_scans**
```sql
- scanid (TEXT PRIMARY KEY)
- imagepath (TEXT)
- scantime (TIMESTAMPTZ)
- isemergency (BOOLEAN)
- telegrammessagesent (BOOLEAN)
- body_temperature (FLOAT)
- usernote (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### **Table: emergency_alerts**
```sql
- alert_id (TEXT PRIMARY KEY)
- type (TEXT)
- message (TEXT)
- user_name (TEXT)
- user_photo (TEXT)
- location (JSONB)
- timestamp (TIMESTAMPTZ)
- telegram_sent (BOOLEAN)
- emergency_button_pressed (BOOLEAN)
- accident_type (TEXT) - 'medical', 'fire', 'crime', 'accident', 'other'
- scan_id (TEXT)
- scan_photo (TEXT)
- body_temperature (FLOAT)
- status (TEXT) - 'active', 'handled'
- response_time (BIGINT) - milliseconds
- responded_by (TEXT)
- handled_at (TIMESTAMPTZ)
- notes (TEXT)
```

### **Table: access_logs**
```sql
- id (UUID PRIMARY KEY)
- scan_id (TEXT)
- user_id (TEXT)
- access_type (TEXT) - 'registered', 'guest_emergency', 'unknown'
- similarity_score (FLOAT)
- timestamp (TIMESTAMPTZ)
```

---

##  API ENDPOINTS

### **Public Endpoints:**
- `GET /health` - Health check
- `GET /telegram-status` - Status Telegram bot
- `GET /chat-history` - Get chat history
- `GET /emergency-alerts` - Get emergency alerts
- `POST /send-emergency` - Send emergency alert
- `POST /send-telegram` - Send Telegram message
- `POST /api/ai-assistant` - AI assistant (OpenRouter)
- `POST /api/openai-session` - Generate OpenAI session token

### **Protected Endpoints (Bearer Token):**
- `POST /api/emergency-login` - Login emergency responder
- `GET /api/emergency-cases` - Get filtered cases
- `POST /api/emergency-cases/:id/handle` - Mark case as handled

### **WebSocket Events:**

**Client → Server:**
- `join-chat` - Join chat room
- `send-message` - Send chat message
- `typing` - User typing
- `stop-typing` - User stop typing
- `emergency-alert` - Send emergency alert

**Server → Client:**
- `new-message` - New chat message
- `user-joined` - User joined
- `user-left` - User left
- `user-typing` - User typing indicator
- `online-count` - Online users count
- `emergency-alert` - Emergency alert broadcast
- `case-handled` - Case handled update

---

##  TEKNOLOGI STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Node.js | >=14.0.0 |
| **Framework** | Express.js | 4.18.2 |
| **Real-time** | Socket.IO | 4.8.1 |
| **Database** | Supabase (PostgreSQL) | - |
| **Auth** | Supabase Auth | - |
| **Storage** | Supabase Storage | - |
| **Bot API** | Telegram Bot API | - |
| **AI** | OpenAI Realtime API | - |
| **AI Assistant** | OpenRouter | - |
| **Face Recognition** | face-api.js | - |
| **ML Framework** | TensorFlow.js | - |
| **Frontend** | HTML5, CSS3, Vanilla JS | - |
| **Icons** | Font Awesome | 6.4.0 |
| **HTTP Client** | Axios | 1.12.2 |

---

##  STRUKTUR FILE PENTING

```
 iot - Copy/

  server.js                    # Main server (integrated)
  telegram-server.js           # Telegram-only server
  package.json                 # Dependencies
  face-recognition.js          # Face matching utilities
  kiosk-mode.js                # Kiosk mode utilities

  HTML Pages
    dashboard.html              # Main dashboard
    scan.html                   # Face scanning
    emergency-dashboard.html     # Emergency responder dashboard
    service.html                # Chat service
    admin.html                  # Admin panel
    ...

  weights/models/              # Face-api.js models
    tiny_face_detector/
    face_landmark_68_tiny/
    face_recognition/

  alarm/                       # Alarm sound files
    war siren sound.mp3

  assets/                      # Static assets
    fonts/
    icons/
    images/

  *.sql                        # Database schema files
```

---

##  KEAMANAN & AUTHENTICATION

### **1. Supabase Authentication**
- JWT token-based
- Role-based access (emergency responder)
- Session management

### **2. API Protection**
- Bearer token untuk protected endpoints
- Token validation via Supabase
- Read-only access untuk emergency responder

### **3. Environment Variables**
- `.env` - Main config
- `telegram-config.env` - Telegram config
- Jangan commit ke repository!

---

##  DEPLOYMENT

### **Local Development:**
```bash
npm install
npm start
# atau
node server.js
```

### **Production:**
- Setup environment variables
- Use HTTPS (SSL)
- Setup reverse proxy (nginx)
- Use PM2 untuk process management
- Setup firewall rules

### **Kiosk Mode:**
- Auto-start dengan `auto-start-kiosk.bat`
- Fullscreen mode
- Disable browser controls

---

##  FITUR UTAMA

###  **Emergency Alert System**
- 1-click emergency button
- Telegram integration
- Geo-location
- Real-time broadcast
- Multi-recipient notifications

###  **Face Recognition**
- Real-time face detection
- Face matching dengan registered faces
- Auto-register guest emergency
- Temperature detection (opsional)
- Scan history tracking

###  **Emergency Responder Portal**
- Role-based login
- Real-time dashboard
- Case management
- Response time tracking
- Statistics dashboard
- Desktop notifications
- Alarm system (3x repeat)

###  **Real-time Chat**
- WebSocket connection
- Online status
- Typing indicators
- Message history
- Role-based chat

###  **AI Voice Assistant**
- OpenAI Realtime API
- Voice interaction
- Real-time conversation
- Pertolongan pertama guidance

---

##  INTEGRASI ANTAR KOMPONEN

### **Face Scan → Emergency Alert:**
```
scan.html → capture → scanId → localStorage → 
dashboard.html → emergency button → POST /send-emergency → 
server.js → update face_scans.isemergency = true
```

### **Emergency Alert → Telegram:**
```
POST /send-emergency → server.js → 
format message → Telegram Bot API → 
Telegram Group → All members notified
```

### **Emergency Alert → Dashboard:**
```
POST /send-emergency → server.js → 
Socket.IO emit('emergency-alert') → 
emergency-dashboard.html → update UI + play alarm
```

### **Database Sync:**
```
Memory array (emergencyAlerts) ↔ Supabase (emergency_alerts table)
- Load on startup
- Save on new alert
- Update on handle
```

---

##  KESIMPULAN

Proyek ini adalah **sistem emergency hotline terintegrasi** yang menggabungkan:

1. **Face Recognition** untuk identifikasi user
2. **Telegram Bot** untuk notifikasi darurat
3. **Real-time Chat** untuk komunikasi
4. **Emergency Dashboard** untuk monitoring petugas
5. **AI Voice Assistant** untuk panduan pertolongan pertama
6. **Database** untuk tracking dan history

**Alur utama:**
- User scan wajah → Identifikasi → Dashboard → Emergency button → 
- Alert ke Telegram + Database + Real-time broadcast → 
- Emergency responder handle → Update status → Broadcast update

Sistem ini dirancang untuk **SMK MARHAS Margahayu** sebagai solusi emergency response yang cepat, terintegrasi, dan real-time.

---

**Dibuat:** November 2025  
**Versi:** 2.0.0  
**Status:** Production Ready 


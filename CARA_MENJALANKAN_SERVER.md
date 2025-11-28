#  CARA MENJALANKAN SERVER EHS

##  Quick Start (Pertama Kali)

Buka terminal di folder `E:\ehs`, lalu jalankan:

```bash
npm start
# atau
node server.js
```

**Output yang diharapkan:**
```
 Supabase initialized
 EMERGENCY HOTLINE SERVER STARTED
 Server running on:
   - http://localhost:3003
   - http://192.168.8.107:3003  (IP Anda)
 Server is ready to accept connections!
```

---

##  Cara Restart Server

### Opsi 1: Gunakan Script Otomatis  (Recommended)

**Windows:**
```bash
restart-server.bat
```

Script ini akan **otomatis**:
1. Kill proses server yang lama
2. Start server yang baru

### Opsi 2: Manual (Jika Script Bermasalah)

**Step 1:** Cari PID proses yang menggunakan port 3003
```bash
netstat -ano | findstr :3003
```

**Output:**
```
TCP    0.0.0.0:3003    0.0.0.0:0    LISTENING    12345
                                                  ^^^^^
                                                  PID ini
```

**Step 2:** Kill proses tersebut
```bash
taskkill /F /PID 12345
# Ganti 12345 dengan PID yang muncul
```

**Step 3:** Start server baru
```bash
npm start
```

---

##  Error: "EADDRINUSE: address already in use"

**Artinya:** Server sudah running! Tidak perlu start lagi.

**Solusi:**
- Jika server sudah jalan dengan baik → **ABAIKAN**, tidak perlu start ulang
- Jika ingin restart → Gunakan cara restart di atas

---

##  Cek Status Server

### Cek Apakah Server Running
```bash
netstat -ano | findstr :3003
```

**Output jika server running:**
```
TCP    0.0.0.0:3003    0.0.0.0:0    LISTENING    12345
```

**Output jika server TIDAK running:** (kosong, tidak ada output)

### Test Server dari Browser
```
http://localhost:3003/health
http://192.168.8.107:3003/health
```

**Output jika server OK:**
```json
{
  "status": "OK",
  "server": "Emergency Hotline Integrated Server",
  "timestamp": "..."
}
```

---

##  Akses Aplikasi

### Dari Komputer
- Dashboard: `http://localhost:3003/dashboard.html`
- Scan Face: `http://localhost:3003/scan.html`
- Admin: `http://localhost:3003/admin.html`
- Emergency: `http://localhost:3003/emergency-dashboard.html`

### Dari HP/Tablet (WiFi yang Sama)
Ganti `localhost` dengan IP komputer Anda (cek dengan `ipconfig`):

- Dashboard: `http://192.168.8.107:3003/dashboard.html`
- Scan Face: `http://192.168.8.107:3003/scan.html`
- Admin: `http://192.168.8.107:3003/admin.html`
- Emergency: `http://192.168.8.107:3003/emergency-dashboard.html`

---

##  Stop Server

**Cara 1:** Tekan `CTRL + C` di terminal yang menjalankan server

**Cara 2:** Force kill via PID
```bash
# Cari PID
netstat -ano | findstr :3003

# Kill
taskkill /F /PID <PID>
```

---

##  Tips

1. **Server sudah running?** Cek dengan logo browser: buka `http://localhost:3003/health`
2. **Error EADDRINUSE?** Server sudah jalan, tidak perlu start lagi
3. **Ingin auto-restart saat ubah kode?** Gunakan `nodemon`:
   ```bash
   npm install -g nodemon
   nodemon server.js
   ```

---

##  Troubleshooting

### Server tidak bisa diakses dari HP
1.  Pastikan server running
2.  Pastikan HP dan komputer dalam WiFi yang sama
3.  Cek firewall sudah allow port 3003
4.  Gunakan IP yang benar (cek dengan `ipconfig`)

### Port 3003 sudah dipakai aplikasi lain
Ubah port di file `.env`:
```env
PORT=3004  # atau port lain yang kosong
```

---

**Update:** 27 November 2025  
**Status:**  Server berhasil binding ke 0.0.0.0 dan dapat diakses via IP address

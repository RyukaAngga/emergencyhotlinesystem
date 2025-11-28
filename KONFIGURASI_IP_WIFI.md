#  KONFIGURASI IP WIFI - AKSES DARI HP

##  Perubahan yang Telah Dilakukan

Semua file HTML telah diupdate untuk **auto-detect IP address** sehingga bisa diakses dari HP melalui WiFi.

### IP Address yang Dikonfigurasi:
- **192.168.18.30** (Primary)
- **192.168.18.31** (Secondary)

### File yang Telah Diupdate:
1.  `dashboard.html` - Dashboard utama
2.  `scan.html` - Face recognition scanning
3.  `service.html` - Real-time chat service
4.  `chat.html` - Chat system (port 3004)

##  Cara Kerja

Sistem akan **otomatis mendeteksi** IP address berdasarkan:
1. Jika diakses via `localhost` → menggunakan `localhost:3003`
2. Jika diakses via IP (contoh: `192.168.18.30`) → menggunakan IP tersebut
3. Jika tidak terdeteksi → fallback ke IP pertama (`192.168.18.30`)

##  Cara Akses dari HP

### Opsi 1: Menggunakan IP 192.168.18.30
```
http://192.168.18.30:3003/dashboard.html
http://192.168.18.30:3003/scan.html
http://192.168.18.30:3003/service.html
```

### Opsi 2: Menggunakan IP 192.168.18.31
```
http://192.168.18.31:3003/dashboard.html
http://192.168.18.31:3003/scan.html
http://192.168.18.31:3003/service.html
```

##  Mengubah IP Address

Jika IP address WiFi Anda berubah, edit fungsi `getServerURL()` di setiap file HTML:

```javascript
function getServerURL() {
  // Ganti dengan IP WiFi Anda
  const WIFI_IPS = ['192.168.18.30', '192.168.18.31'];
  const PORT = 3003;
  
  // ... rest of code
}
```

**File yang perlu diubah:**
- `dashboard.html` (baris ~2319)
- `scan.html` (baris ~451)
- `service.html` (baris ~728)
- `chat.html` (baris ~557)

##  Testing

1. **Pastikan server berjalan:**
   ```bash
   npm start
   # atau
   node server.js
   ```

2. **Cek IP address komputer:**
   - Windows: `ipconfig` (lihat IPv4 Address)
   - Linux/Mac: `ifconfig` atau `ip addr`

3. **Akses dari HP:**
   - Pastikan HP dan komputer dalam WiFi yang sama
   - Buka browser di HP
   - Masukkan: `http://[IP-KOMPUTER]:3003/dashboard.html`

##  Troubleshooting

### Problem: HP tidak bisa akses
**Solusi:**
1. Pastikan HP dan komputer dalam WiFi yang sama
2. Cek firewall Windows tidak block port 3003
3. Cek IP address komputer sudah benar
4. Restart server setelah mengubah IP

### Problem: Server tidak bisa diakses
**Solusi:**
1. Buka Windows Firewall
2. Allow port 3003 untuk inbound connections
3. Atau disable firewall sementara untuk testing

### Problem: IP berubah setiap restart
**Solusi:**
1. Set static IP di router
2. Atau update IP di file HTML setiap kali berubah

##  Catatan

- **Relative URL** (seperti `/api/emergency-login`) sudah otomatis menggunakan hostname yang sama
- File `emergency-dashboard.html` dan `login-emergency.html` menggunakan relative URL, jadi tidak perlu diubah
- Port default: **3003** (kecuali `chat.html` yang menggunakan port 3004)

##  Quick Reference

| File | Port | URL Pattern |
|------|------|-------------|
| dashboard.html | 3003 | `http://[IP]:3003/dashboard.html` |
| scan.html | 3003 | `http://[IP]:3003/scan.html` |
| service.html | 3003 | `http://[IP]:3003/service.html` |
| chat.html | 3004 | `http://[IP]:3004/chat.html` |
| emergency-dashboard.html | 3003 | `http://[IP]:3003/emergency-dashboard.html` |
| login-emergency.html | 3003 | `http://[IP]:3003/login-emergency.html` |

---

**Update:** November 2025  
**Status:**  Selesai - Semua file telah diupdate


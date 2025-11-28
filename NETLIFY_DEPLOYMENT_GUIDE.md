#  Panduan Deploy EHS ke Netlify

##  Perbaikan yang Telah Dilakukan

### 1. **Fix Emergency Login untuk Netlify**
-  **Sebelumnya**: Menggunakan `/api/emergency-login` yang memerlukan Node.js server
-  **Sekarang**: Client-side authentication dengan validasi langsung di browser
- **Kredensial Valid**:
  - `emergency@layanan.go.id`
  - `polisi@emergency.go.id`
  - `damkar@emergency.go.id`
  - `medis@emergency.go.id`
  - Password minimal 6 karakter

### 2. **Smooth Horizontal Scroll dengan Mouse**
Ditambahkan pada 3 halaman:
-  `admin.html` - Tabel scan
-  `view-registered-faces.html` - Tabel wajah terdaftar
-  `emergency-dashboard.html` - List kasus darurat

**Fitur Scroll**:
-  Drag dengan mouse untuk scroll horizontal
-  Cursor berubah menjadi "grab" saat hover
-  Cursor berubah menjadi "grabbing" saat drag
-  Custom scrollbar dengan styling modern

### 3. **Fix Kamera Horizontal di Android 7.1.2**
-  Auto-detection orientasi video stream
-  Auto-fix jika video horizontal padahal seharusnya portrait
-  Khusus untuk Android lama yang memiliki bug orientasi kamera

##  Cara Deploy ke Netlify

### Metode 1: Drag & Drop (Paling Mudah)

1. **Login ke Netlify**: https://app.netlify.com/
2. **Drag & Drop** seluruh folder `ehs` ke Netlify Dashboard
3. **Selesai!** Netlify akan otomatis deploy

### Metode 2: Git Integration

```bash
# 1. Initialize git di folder project
cd ehs
git init

# 2. Add & commit semua file
git add .
git commit -m "Initial commit - EHS Emergency System"

# 3. Push ke GitHub/GitLab
git remote add origin https://github.com/username/ehs.git
git push -u origin main

# 4. Connect ke Netlify dari dashboard
# - Sites > Add new site > Import from Git
# - Pilih repository
# - Build command: (kosongkan)
# - Publish directory: .
# - Deploy!
```

### Metode 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd ehs
netlify deploy --prod
```

##  Konfigurasi Netlify

File `netlify.toml` sudah disiapkan dengan:
-  Redirect handling untuk SPA
-  Security headers
-  Cache control untuk assets
-  CORS headers

##  Environment Variables

Tidak perlu environment variables karena menggunakan:
- Supabase Anon Key (sudah di hardcode - aman untuk public)
- Client-side authentication

##  Testing di Android 7.1.2

Setelah deploy:
1. Buka URL Netlify di browser Android
2. Akses `scan-manual.html`
3. Kamera akan otomatis ter-fix jika orientasinya salah
4. Face detection akan bekerja normal

##  URL Penting Setelah Deploy

```
https://your-site.netlify.app/
 dashboard.html              # Halaman utama
 scan.html                   # Scan otomatis
 scan-manual.html            # Scan manual (fixed untuk Android)
 login-emergency.html        # Login emergency (fixed untuk Netlify)
 emergency-dashboard.html    # Dashboard emergency
 admin.html                  # Admin panel
 view-registered-faces.html  # Daftar wajah terdaftar
```

##  Troubleshooting

### Error: "Failed to load resource: 404"
-  **Solved**: API endpoints tidak diperlukan lagi
- Semua menggunakan Supabase langsung dari client

### Kamera Horizontal di Android
-  **Solved**: Auto-detect dan auto-fix sudah ditambahkan

### Tidak bisa scroll horizontal dengan mouse
-  **Solved**: Drag-to-scroll sudah ditambahkan di 3 halaman

##  Keamanan

### Login Emergency
- Password minimal 6 karakter
- Session disimpan di `sessionStorage`
- Auto-logout saat close tab

### Supabase
- RLS (Row Level Security) disabled untuk development
-  **Production**: Enable RLS kembali untuk keamanan maksimal

##  Performa

- **Static Site**: Load time super cepat
- **CDN**: Netlify global CDN
- **Caching**: Assets di-cache 1 tahun
- **Compression**: Otomatis gzip/brotli

##  Fitur yang Bekerja di Netlify

 Face detection dengan face-api.js
 Supabase database integration
 File upload ke Supabase Storage
 Emergency login system
 Real-time temperature detection
 Telegram notification (via Supabase)
 Kiosk mode
 Smooth horizontal scroll
 Android camera fix

##  Fitur yang TIDAK Bekerja di Netlify

 Node.js server endpoints (`/api/*`)
 WebSocket untuk real-time chat
 Server-side rendering

### Solusi untuk Fitur yang Tidak Bekerja:

**Untuk WebSocket & Server API**:
- Deploy `server.js` terpisah di:
  - Railway.app
  - Render.com
  - Heroku
  - DigitalOcean
- Update URL server di `dashboard.html`:
  ```javascript
  const PORT = 'https://your-server.railway.app';
  ```

##  Support

Jika ada masalah saat deploy, cek:
1. Netlify deploy logs
2. Browser console untuk error JavaScript
3. Supabase dashboard untuk database issues

---

**Last Updated**: November 25, 2025
**Version**: 2.0 - Netlify Ready

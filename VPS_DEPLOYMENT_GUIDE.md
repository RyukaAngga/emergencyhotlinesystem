# 🚀 PANDUAN DEPLOYMENT VPS
## ThermoSafe IoT Emergency System

---

## 📋 Informasi VPS
- **IP Address**: 157.66.54.66
- **SSH Port**: 3022
- **User**: ubuntu
- **Password**: arief12

---

## 🔧 Langkah-langkah Deployment

### 1️⃣ Koneksi ke VPS via SSH

```bash
# Dari Windows (PowerShell atau CMD)
ssh ubuntu@157.66.54.66 -p 3022

# Masukkan password: arief12
```

---

### 2️⃣ Install Dependencies di VPS

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (jika belum ada)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi instalasi
node --version
npm --version

# Install PM2 untuk menjalankan server secara persisten
sudo npm install -g pm2
```

---

### 3️⃣ Upload Project ke VPS

#### Opsi A: Menggunakan Git (Recommended)
```bash
# Di VPS
cd ~
git clone https://github.com/username/projeklomba.git
cd projeklomba
npm install
```

#### Opsi B: Menggunakan SCP dari Local
```bash
# Dari komputer lokal (PowerShell)
scp -P 3022 -r c:\c\projeklomba ubuntu@157.66.54.66:~/

# Kemudian di VPS
cd ~/projeklomba
npm install
```

---

### 4️⃣ Konfigurasi Environment

```bash
# Di VPS, buat file .env
cd ~/projeklomba
nano .env
```

**Copy konfigurasi berikut ke .env:**
```env
# Server Configuration
PORT=3003
BIND_HOST=0.0.0.0

# Location Information
LOCATION_NAME=SMK MARHAS Margahayu
LOCATION_ADDRESS=Jl. Raya Margahayu No.186, Bandung
LOCATION_LATITUDE=-6.9759367
LOCATION_LONGITUDE=107.5704834

# Supabase Configuration
SUPABASE_URL=https://fvayuhanwcwinkvvvisk.supabase.co
SUPABASE_ANON_KEY=isi_dengan_anon_key_anda
SUPABASE_SERVICE_ROLE_KEY=isi_dengan_service_role_key_anda

# Telegram Configuration
TELEGRAM_BOT_TOKEN=isi_dengan_bot_token_anda
TELEGRAM_CHAT_ID=isi_dengan_chat_id_anda

# OpenAI Configuration
OPENAI_API_KEY=isi_dengan_openai_key_anda

# OpenRouter Configuration
OPENROUTER_API_KEY=isi_dengan_openrouter_key_anda
OPENROUTER_MODEL=anthropic/claude-sonnet-4.5
```

**Simpan dengan**: `Ctrl+X`, lalu `Y`, lalu `Enter`

---

### 5️⃣ Buka Port di Firewall

```bash
# Buka port 3003 untuk HTTP
sudo ufw allow 3003/tcp

# Cek status firewall
sudo ufw status
```

---

### 6️⃣ Jalankan Server dengan PM2

```bash
# Masuk ke direktori project
cd ~/projeklomba

# Jalankan server dengan PM2
pm2 start server.js --name thermosafe

# Auto-restart saat VPS reboot
pm2 startup
pm2 save

# Cek status server
pm2 status
pm2 logs thermosafe
```

---

### 7️⃣ Akses Aplikasi

Setelah server berjalan, akses melalui browser:

- **Dashboard**: `http://157.66.54.66:3003/dashboard.html`
- **Face Scan**: `http://157.66.54.66:3003/scan.html`
- **Admin Panel**: `http://157.66.54.66:3003/admin.html`
- **Emergency Dashboard**: `http://157.66.54.66:3003/emergency-dashboard.html`
- **Chat**: `http://157.66.54.66:3003/chat.html`
- **Analytics**: `http://157.66.54.66:3003/analytics.html`

---

## 🛠️ Perintah PM2 Berguna

```bash
# Lihat status semua proses
pm2 status

# Lihat log real-time
pm2 logs thermosafe

# Restart server
pm2 restart thermosafe

# Stop server
pm2 stop thermosafe

# Hapus dari PM2
pm2 delete thermosafe

# Monitor resource usage
pm2 monit
```

---

## 🔄 Update Aplikasi

Jika ada perubahan code di local dan ingin update ke VPS:

```bash
# Dari komputer lokal
scp -P 3022 -r c:\c\projeklomba\*.html ubuntu@157.66.54.66:~/projeklomba/
scp -P 3022 c:\c\projeklomba\server.js ubuntu@157.66.54.66:~/projeklomba/

# Kemudian di VPS
cd ~/projeklomba
pm2 restart thermosafe
```

---

## ⚠️ Troubleshooting

### Server tidak bisa diakses dari luar:
```bash
# Cek apakah server jalan
pm2 status

# Cek log error
pm2 logs thermosafe --err

# Cek port listening
sudo netstat -tulpn | grep 3003

# Cek firewall
sudo ufw status
```

### Restart server jika error:
```bash
pm2 restart thermosafe

# Atau restart dengan clean
pm2 delete thermosafe
pm2 start server.js --name thermosafe
pm2 save
```

### Cek resource VPS:
```bash
# Cek memory
free -h

# Cek disk space
df -h

# Cek CPU usage
top
```

---

## 🌐 Akses dari Perangkat Lain (Smartphone/Tablet)

1. Pastikan perangkat terhubung ke internet
2. Buka browser di perangkat
3. Akses: `http://157.66.54.66:3003/dashboard.html`

**Catatan**: Tidak perlu WiFi yang sama, karena VPS bisa diakses dari internet mana saja!

---

## 🔒 Keamanan (Opsional tapi Disarankan)

### Install Let's Encrypt SSL (jika ingin HTTPS nanti):
```bash
# Install Nginx sebagai reverse proxy
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Konfigurasi domain dulu (butuh domain name)
# Kemudian jalankan:
# sudo certbot --nginx -d yourdomain.com
```

**Untuk saat ini, HTTP sudah cukup untuk testing dan development.**

---

## 📊 Monitoring

```bash
# Lihat log akses
pm2 logs thermosafe

# Monitor real-time
pm2 monit

# Lihat info lengkap
pm2 info thermosafe
```

---

## ✅ Checklist Deployment

- [ ] SSH ke VPS berhasil
- [ ] Node.js & NPM terinstall
- [ ] PM2 terinstall global
- [ ] Project ter-upload ke VPS
- [ ] File .env sudah dikonfigurasi
- [ ] Port 3003 sudah dibuka di firewall
- [ ] Server berjalan dengan PM2
- [ ] PM2 startup configured (auto-restart)
- [ ] Aplikasi bisa diakses dari browser
- [ ] Telegram notification berfungsi
- [ ] Database terhubung dengan Supabase

---

## 📞 Support

Jika ada masalah:
1. Cek log dengan: `pm2 logs thermosafe`
2. Restart server dengan: `pm2 restart thermosafe`
3. Periksa file .env sudah benar
4. Pastikan semua API keys valid

---

**Deployment Version**: 1.0  
**Last Updated**: November 2025  
**Port**: 3003 (HTTP)  
**Protocol**: HTTP (No HTTPS/SSL)

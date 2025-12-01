# Emergency Hotline System - SMK MARHAS Margahayu

Halo! Selamat datang di projek Emergency Hotline System. 

## Apa sih ini?

Jadi gini, projek ini adalah sistem panggilan darurat yang bisa digunakan di lingkungan sekolah ataupun tempat tepat lainnya. Bayangkan ada kejadian darurat seperti kecelakaan, kebakaran, atau situasi gawat lainnya - dengan sistem ini, informasi bisa langsung sampai ke tim responder dengan cepat!

Fitur utamanya:
- **Face Recognition** - Sistem bisa mengenali wajah siswa/guru yang sudah terdaftar
- **Tombol Emergency** - Tinggal tekan tombol, notifikasi langsung terkirim
- **Notifikasi Telegram** - Tim darurat langsung dapat notifikasi di HP mereka
- **Dashboard Real-time** - Pantau semua kejadian darurat dalam satu layar
- **Alarm Otomatis** - Bunyi alarm saat ada emergency baru

## Kenapa dibuat?

Untuk mengurangi angka angka kecelakaan agar tetap damai dan tentram tanpa ada kekhawatiran. Tapi kadang kejadian darurat bisa terjadi kapan saja. Dengan sistem ini, kita bisa:
- Merespon lebih cepat saat ada kejadian
- Mencatat semua kejadian untuk evaluasi
- Memudahkan koordinasi tim darurat
- Memberikan rasa aman untuk semua warga sekolah

## Cara Menjalankan

### Yang dibutuhkan:
- Node.js (versi 20 ke atas)
- Koneksi internet

### Langkah-langkah:

1. **Download/Clone projek ini**
   ```
   git clone https://github.com/RyukaAngga/emergencyhotlinesystem.git
   ```

2. **Masuk ke folder projek**
   ```
   cd emergencyhotlinesystem
   ```

3. **Install semua yang diperlukan**
   ```
   npm install
   ```

4. **Jalankan servernya**
   ```
   npm start
   ```

5. **Buka di browser**
   ```
   http://localhost:3003
   ```

## Halaman-halaman yang ada

| Halaman | Fungsi |
|---------|--------|
| `dashboard.html` | Halaman utama, bisa akses semua fitur |
| `scan.html` | Scan wajah untuk identifikasi |
| `register-face.html` | Daftarkan wajah baru ke sistem |
| `emergency-dashboard.html` | Khusus tim darurat untuk pantau kejadian |
| `login-emergency.html` | Login untuk tim darurat |
| `admin.html` | Halaman admin |
| `analytics.html` | Lihat statistik dan data |

## Cara Pakai

### Untuk User:
1. Buka halaman scan
2. Arahkan wajah ke kamera
3. Sistem akan mengenali wajah secara otomatis
4. Kalau ada darurat, tekan tombol emergency
5. Pilih jenis darurat (medis, kebakaran, dll)
6. Notifikasi akan terkirim ke tim darurat

### Untuk Tim Darurat:
1. Login di halaman login-emergency
2. Buka emergency-dashboard
3. Aktifkan suara alarm (penting!)
4. Pantau semua kejadian yang masuk
5. Tangani kasus dan update statusnya

## Teknologi yang Dipakai

- **Backend**: Node.js + Express
- **Database**: Supabase
- **Real-time**: Socket.io
- **Notifikasi**: Telegram Bot API

## Catatan Penting

- Pastikan kamera berfungsi dengan baik untuk face recognition
- Koneksi internet harus stabil untuk notifikasi real-time
- Jangan lupa aktifkan suara di dashboard emergency untuk mendengar alarm

## Kontribusi

Projek ini masih terus dikembangkan. Kalau ada ide atau nemuin bug, feel free untuk:
- Buat issue di GitHub
- Submit pull request
- Atau hubungi langsung

## Kesimpulan

Emergency Hotline System ini dibuat dengan harapan bisa membantu menciptakan kondisi yang bisa membantu orang orang dalam menanggani kasus seperti kecelakaan. Dengan teknologi yang tepat, kita bisa merespon situasi darurat dengan lebih cepat dan terorganisir.

Semoga bermanfaat! 🙏

---

*Dibuat dengan ❤️ untuk SMK MARHAS Margahayu*

*Versi 1.0.0*

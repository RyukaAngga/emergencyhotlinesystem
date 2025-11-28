# Troubleshooting Database face_scans

## Error: 400 Bad Request saat insert ke face_scans

### Kemungkinan Penyebab:

1. **Column name tidak match**
2. **Tipe data salah**
3. **RLS Policy terlalu ketat**
4. **Primary key conflict**

---

## Cara Cek & Fix:

### 1. Cek Struktur Table di Supabase

**Buka Supabase Dashboard → Table Editor → face_scans**

Pastikan column-nya:
- `scanid` (TEXT, PRIMARY KEY)
- `imagepath` (TEXT)
- `scantime` (TIMESTAMPTZ)
- `isemergency` (BOOLEAN)
- `telegrammessagesent` (BOOLEAN)
- `usernote` (TEXT, nullable)

### 2. Cek RLS Policies

**Dashboard → Authentication → Policies → face_scans**

Pastikan ada policy:
```
Allow insert face_scans
FOR INSERT
WITH CHECK (true)
```

Jika tidak ada, buat policy baru atau **disable RLS sementara** untuk testing:
```sql
ALTER TABLE face_scans DISABLE ROW LEVEL SECURITY;
```

### 3. Test Insert Manual di SQL Editor

```sql
-- Test insert manual
INSERT INTO face_scans (
    scanid, 
    imagepath, 
    scantime, 
    isemergency, 
    telegrammessagesent, 
    usernote
) VALUES (
    'test_123',
    '2025/November/16/test.jpg',
    NOW(),
    false,
    false,
    'Test manual insert'
);

-- Cek hasil
SELECT * FROM face_scans ORDER BY scantime DESC LIMIT 5;
```

**Jika error**, catat error message-nya!

### 4. Cek Console Browser untuk Error Detail

1. Buka Developer Tools (F12)
2. Tab **Console**
3. Lihat error message lengkap
4. Tab **Network** → Klik request `face_scans` yang error
5. Tab **Response** → Lihat error detail dari Supabase

---

## Solusi Berdasarkan Error:

### Error: "column does not exist"
**Penyebab**: Nama column salah di code

**Fix**: Update code dengan nama column yang benar

```javascript
// Contoh jika column di database bernama 'scan_time' bukan 'scantime'
const scanRecord = {
    scanid: scanId,
    imagepath: fileName,
    scan_time: now.toISOString(),  // ← ganti sesuai nama di database
    is_emergency: false,
    telegram_message_sent: false,
    user_note: 'Manual photo capture'
};
```

### Error: "violates row-level security policy"
**Penyebab**: RLS policy terlalu ketat

**Fix Option 1** - Disable RLS sementara:
```sql
ALTER TABLE face_scans DISABLE ROW LEVEL SECURITY;
```

**Fix Option 2** - Update policy:
```sql
-- Hapus policy lama
DROP POLICY IF EXISTS "Allow insert face_scans" ON face_scans;

-- Buat policy baru yang permissive
CREATE POLICY "Allow insert face_scans" ON face_scans
    FOR INSERT
    WITH CHECK (true);
```

### Error: "duplicate key value violates unique constraint"
**Penyebab**: scanid sudah ada di database

**Fix**: Pastikan timestamp di scanid unique
```javascript
// scanid dengan timestamp + random string lebih panjang
const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
```

### Error: "invalid input syntax for type boolean"
**Penyebab**: Kirim string instead of boolean

**Fix**: Pastikan boolean bukan string
```javascript
isemergency: false,  //  benar
isemergency: "false", //  salah
```

---

## Temporary Workaround (Jika Masih Error)

Jika database tetap error, sistem tetap bisa jalan **tanpa simpan ke face_scans**:

### Update Code untuk Skip Database:

**scan.html & scan-manual.html:**

```javascript
// Comment out database insert
/*
const { data: scanData, error: scanError } = await supabase
    .from('face_scans')
    .insert(scanRecord)
    .select();
*/

// Langsung lanjut ke step berikutnya
```

**Data tetap tersimpan di:**
-  Supabase Storage (foto)
-  localStorage (metadata untuk dashboard)

**Yang hilang:**
-  History log di database
-  Query data scan dari admin panel

---

## Test After Fix:

1. **Clear browser cache** (Ctrl+Shift+Del)
2. **Reload halaman** (Ctrl+F5)
3. **Coba scan wajah/manual photo**
4. **Cek Console** - tidak ada error
5. **Cek Supabase Table Editor** - data masuk

---

## Contact Info

Jika masih error, share:
1. Screenshot error di Console (tab Console & Network)
2. Screenshot struktur table di Supabase
3. Screenshot RLS policies

Akan saya bantu debug lebih lanjut! 

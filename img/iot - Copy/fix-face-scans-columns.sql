-- Fix face_scans table - Tambahkan DEFAULT value untuk created_at dan updated_at
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor

-- LANGKAH 1: CEK STRUKTUR TABLE DULU
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'face_scans'
ORDER BY ordinal_position;

-- Jika kolom created_at dan updated_at sudah ada, lanjut ke LANGKAH 2
-- Jika belum ada, lanjut ke LANGKAH 3

-- ========================================
-- LANGKAH 2: Jika kolom sudah ada, set DEFAULT-nya
-- ========================================
ALTER TABLE face_scans 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE face_scans 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Ubah jadi nullable (opsional tapi aman)
ALTER TABLE face_scans 
ALTER COLUMN created_at DROP NOT NULL;

ALTER TABLE face_scans 
ALTER COLUMN updated_at DROP NOT NULL;

-- ========================================
-- LANGKAH 3: Jika kolom belum ada, tambahkan
-- ========================================

-- Opsi 1: Tambahkan kolom dengan DEFAULT jika belum ada
ALTER TABLE face_scans 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE face_scans 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ========================================
-- VERIFIKASI: Cek hasil akhir
-- ========================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'face_scans'
ORDER BY ordinal_position;

-- ========================================
-- CATATAN PENTING:
-- ========================================
-- Storage Bucket: Harusnya bernama "faces" (bukan "face_scans")
-- Table: Harusnya bernama "face_scans"
-- 
-- Jika kamu salah buat bucket "face_scans", hapus dan buat ulang "faces"

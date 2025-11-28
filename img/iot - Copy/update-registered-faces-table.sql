-- ============================================
-- UPDATE REGISTERED_FACES TABLE
-- Menambahkan kolom baru untuk data lengkap KTP
-- ============================================

-- Tambahkan kolom tempat lahir
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS tempat_lahir TEXT;

-- Tambahkan kolom tanggal lahir
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS tanggal_lahir DATE;

-- Tambahkan kolom jenis kelamin
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS jenis_kelamin TEXT CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan'));

-- Tambahkan kolom agama
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS agama TEXT CHECK (agama IN ('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'));

-- Tambahkan kolom pekerjaan
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS pekerjaan TEXT;

-- Tambahkan kolom kewarganegaraan
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS kewarganegaraan TEXT CHECK (kewarganegaraan IN ('WNI', 'WNA'));

-- Tambahkan kolom RT
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS rt TEXT;

-- Tambahkan kolom RW
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS rw TEXT;

-- Tambahkan kolom kelurahan/desa
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS kelurahan TEXT;

-- Tambahkan kolom kecamatan
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS kecamatan TEXT;

-- Tambahkan kolom alamat lengkap
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS alamat_lengkap TEXT;

-- Tambahkan kolom nomor HP/WhatsApp
ALTER TABLE registered_faces 
ADD COLUMN IF NOT EXISTS no_hp TEXT;

-- Tambahkan index untuk pencarian berdasarkan NIK
CREATE INDEX IF NOT EXISTS idx_registered_faces_nik ON registered_faces(nik);

-- Tambahkan index untuk pencarian berdasarkan nama
CREATE INDEX IF NOT EXISTS idx_registered_faces_name ON registered_faces(name);

-- Tambahkan index untuk pencarian berdasarkan kecamatan
CREATE INDEX IF NOT EXISTS idx_registered_faces_kecamatan ON registered_faces(kecamatan);

-- Tambahkan comment untuk dokumentasi
COMMENT ON COLUMN registered_faces.tempat_lahir IS 'Tempat lahir sesuai KTP';
COMMENT ON COLUMN registered_faces.tanggal_lahir IS 'Tanggal lahir sesuai KTP';
COMMENT ON COLUMN registered_faces.jenis_kelamin IS 'Jenis kelamin: Laki-laki atau Perempuan';
COMMENT ON COLUMN registered_faces.agama IS 'Agama: Islam, Kristen, Katolik, Hindu, Buddha, Konghucu';
COMMENT ON COLUMN registered_faces.pekerjaan IS 'Pekerjaan/profesi';
COMMENT ON COLUMN registered_faces.kewarganegaraan IS 'WNI atau WNA';
COMMENT ON COLUMN registered_faces.rt IS 'RT tempat tinggal';
COMMENT ON COLUMN registered_faces.rw IS 'RW tempat tinggal';
COMMENT ON COLUMN registered_faces.kelurahan IS 'Kelurahan atau Desa';
COMMENT ON COLUMN registered_faces.kecamatan IS 'Kecamatan';
COMMENT ON COLUMN registered_faces.alamat_lengkap IS 'Alamat lengkap (jalan, gang, nomor rumah)';
COMMENT ON COLUMN registered_faces.no_hp IS 'Nomor HP/WhatsApp untuk kontak';

-- Verify struktur tabel
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'registered_faces'
ORDER BY ordinal_position;

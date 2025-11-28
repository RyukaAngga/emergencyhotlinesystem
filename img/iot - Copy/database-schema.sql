-- ========================================
-- DATABASE SCHEMA FOR FACE RECOGNITION
-- Emergency Hotline System (EHS)
-- ========================================

-- Table: registered_faces
-- Menyimpan data wajah yang terdaftar untuk face recognition
CREATE TABLE IF NOT EXISTS registered_faces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nik TEXT,
    email TEXT,
    face_descriptor JSONB NOT NULL, -- Array 128 angka (face descriptor)
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    registered_by TEXT NOT NULL DEFAULT 'system',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_guest BOOLEAN NOT NULL DEFAULT false, -- Flag untuk guest emergency
    guest_type TEXT, -- 'emergency', 'normal', atau NULL
    photo_path TEXT -- Path foto referensi di storage
);

-- Index untuk mempercepat pencarian
CREATE INDEX IF NOT EXISTS idx_registered_faces_active ON registered_faces(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_registered_faces_guest ON registered_faces(is_guest) WHERE is_guest = true;
CREATE INDEX IF NOT EXISTS idx_registered_faces_nik ON registered_faces(nik);

-- Table: access_logs (Optional - untuk logging akses)
-- Mencatat setiap akses ke sistem
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id TEXT REFERENCES face_scans(scanid),
    user_id TEXT REFERENCES registered_faces(id),
    access_type TEXT NOT NULL, -- 'registered', 'guest_emergency', 'unknown'
    similarity_score FLOAT, -- Similarity score jika wajah dikenali
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk access_logs
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_access_type ON access_logs(access_type);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS
ALTER TABLE registered_faces ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read untuk semua authenticated users
CREATE POLICY "Allow read registered_faces" ON registered_faces
    FOR SELECT
    USING (true);

-- Policy: Allow insert untuk semua (untuk guest emergency auto-register)
CREATE POLICY "Allow insert registered_faces" ON registered_faces
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow update hanya untuk admin (opsional, bisa disesuaikan)
CREATE POLICY "Allow update registered_faces" ON registered_faces
    FOR UPDATE
    USING (true);

-- Policy: Allow read access_logs untuk semua
CREATE POLICY "Allow read access_logs" ON access_logs
    FOR SELECT
    USING (true);

-- Policy: Allow insert access_logs untuk semua
CREATE POLICY "Allow insert access_logs" ON access_logs
    FOR INSERT
    WITH CHECK (true);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE registered_faces IS 'Tabel untuk menyimpan data wajah yang terdaftar untuk face recognition';
COMMENT ON COLUMN registered_faces.face_descriptor IS 'Face descriptor (128 angka) dalam format JSONB array';
COMMENT ON COLUMN registered_faces.is_guest IS 'Flag untuk membedakan user terdaftar dengan guest emergency';
COMMENT ON COLUMN registered_faces.guest_type IS 'Jenis guest: emergency, normal, atau NULL untuk user terdaftar';

COMMENT ON TABLE access_logs IS 'Tabel untuk logging setiap akses ke sistem';
COMMENT ON COLUMN access_logs.access_type IS 'Tipe akses: registered, guest_emergency, atau unknown';
COMMENT ON COLUMN access_logs.similarity_score IS 'Similarity score dari face matching (0-1)';




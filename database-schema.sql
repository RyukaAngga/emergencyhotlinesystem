CREATE TABLE IF NOT EXISTS registered_faces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nik TEXT,
    email TEXT,
    face_descriptor JSONB NOT NULL, 
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    registered_by TEXT NOT NULL DEFAULT 'system',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_guest BOOLEAN NOT NULL DEFAULT false, 
    guest_type TEXT, 
    photo_path TEXT 
);
CREATE INDEX IF NOT EXISTS idx_registered_faces_active ON registered_faces(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_registered_faces_guest ON registered_faces(is_guest) WHERE is_guest = true;
CREATE INDEX IF NOT EXISTS idx_registered_faces_nik ON registered_faces(nik);
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id TEXT REFERENCES face_scans(scanid),
    user_id TEXT REFERENCES registered_faces(id),
    access_type TEXT NOT NULL, 
    similarity_score FLOAT, 
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_access_type ON access_logs(access_type);
ALTER TABLE registered_faces ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read registered_faces" ON registered_faces
    FOR SELECT
    USING (true);
CREATE POLICY "Allow insert registered_faces" ON registered_faces
    FOR INSERT
    WITH CHECK (true);
CREATE POLICY "Allow update registered_faces" ON registered_faces
    FOR UPDATE
    USING (true);
CREATE POLICY "Allow read access_logs" ON access_logs
    FOR SELECT
    USING (true);
CREATE POLICY "Allow insert access_logs" ON access_logs
    FOR INSERT
    WITH CHECK (true);
COMMENT ON TABLE registered_faces IS 'Tabel untuk menyimpan data wajah yang terdaftar untuk face recognition';
COMMENT ON COLUMN registered_faces.face_descriptor IS 'Face descriptor (128 angka) dalam format JSONB array';
COMMENT ON COLUMN registered_faces.is_guest IS 'Flag untuk membedakan user terdaftar dengan guest emergency';
COMMENT ON COLUMN registered_faces.guest_type IS 'Jenis guest: emergency, normal, atau NULL untuk user terdaftar';
COMMENT ON TABLE access_logs IS 'Tabel untuk logging setiap akses ke sistem';
COMMENT ON COLUMN access_logs.access_type IS 'Tipe akses: registered, guest_emergency, atau unknown';
COMMENT ON COLUMN access_logs.similarity_score IS 'Similarity score dari face matching (0-1)';
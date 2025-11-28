CREATE TABLE IF NOT EXISTS face_scans (
    scanid TEXT PRIMARY KEY,
    imagepath TEXT NOT NULL,
    scantime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    isemergency BOOLEAN NOT NULL DEFAULT false,
    telegrammessagesent BOOLEAN NOT NULL DEFAULT false,
    usernote TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_face_scans_scantime ON face_scans(scantime DESC);
CREATE INDEX IF NOT EXISTS idx_face_scans_emergency ON face_scans(isemergency) WHERE isemergency = true;
ALTER TABLE face_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read face_scans" ON face_scans
    FOR SELECT
    USING (true);
CREATE POLICY "Allow insert face_scans" ON face_scans
    FOR INSERT
    WITH CHECK (true);
CREATE POLICY "Allow update face_scans" ON face_scans
    FOR UPDATE
    USING (true);
CREATE POLICY "Allow delete face_scans" ON face_scans
    FOR DELETE
    USING (true);
COMMENT ON TABLE face_scans IS 'Tabel untuk menyimpan metadata setiap scan/foto wajah';
COMMENT ON COLUMN face_scans.scanid IS 'Unique identifier untuk setiap scan';
COMMENT ON COLUMN face_scans.imagepath IS 'Path foto di Supabase Storage (folder struktur: YYYY/Bulan/DD/filename.jpg)';
COMMENT ON COLUMN face_scans.scantime IS 'Timestamp saat foto diambil';
COMMENT ON COLUMN face_scans.isemergency IS 'Flag apakah scan ini untuk situasi emergency';
COMMENT ON COLUMN face_scans.telegrammessagesent IS 'Flag apakah notifikasi Telegram sudah dikirim';
COMMENT ON COLUMN face_scans.usernote IS 'Catatan tambahan (contoh: "Scan wajah berhasil - John Doe", "Manual photo capture")';
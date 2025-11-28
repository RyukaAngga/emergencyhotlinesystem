ALTER TABLE face_scans
ADD COLUMN IF NOT EXISTS body_temperature DECIMAL(3,1);
COMMENT ON COLUMN face_scans.body_temperature IS 'Suhu tubuh yang terdeteksi saat scan (dalam Celsius). Contoh: 36.5, 37.2, 38.0';
CREATE INDEX IF NOT EXISTS idx_face_scans_temperature 
ON face_scans(body_temperature);
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'face_scans'
ORDER BY ordinal_position;
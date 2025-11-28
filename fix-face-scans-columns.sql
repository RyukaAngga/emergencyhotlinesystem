SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'face_scans'
ORDER BY ordinal_position;
ALTER TABLE face_scans 
ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE face_scans 
ALTER COLUMN updated_at SET DEFAULT NOW();
ALTER TABLE face_scans 
ALTER COLUMN created_at DROP NOT NULL;
ALTER TABLE face_scans 
ALTER COLUMN updated_at DROP NOT NULL;
ALTER TABLE face_scans 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE face_scans 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'face_scans'
ORDER BY ordinal_position;
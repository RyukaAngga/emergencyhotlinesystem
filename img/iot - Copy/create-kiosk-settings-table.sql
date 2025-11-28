`-- ========================================
-- KIOSK MODE SETTINGS TABLE
-- SMK MARHAS Margahayu - Emergency Hotline System
-- ========================================

-- Create table untuk menyimpan password kiosk mode
CREATE TABLE IF NOT EXISTS kiosk_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(100),
    notes TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default password
INSERT INTO kiosk_settings (id, password, notes)
VALUES (1, 'smkmarhas2025', 'Default kiosk mode password')
ON CONFLICT (id) DO NOTHING;

-- Add RLS (Row Level Security) policies
ALTER TABLE kiosk_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read for authenticated and anonymous users
CREATE POLICY "Allow read access for kiosk settings"
ON kiosk_settings
FOR SELECT
TO public
USING (true);

-- Policy: Allow update only for authenticated users
CREATE POLICY "Allow update for authenticated users"
ON kiosk_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_kiosk_settings_timestamp()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create trigger untuk auto-update timestamp
CREATE TRIGGER update_kiosk_settings_timestamp
BEFORE UPDATE ON kiosk_settings
FOR EACH ROW
EXECUTE FUNCTION update_kiosk_settings_timestamp();

-- ========================================
-- USAGE EXAMPLES
-- ========================================

-- Read password
-- SELECT password FROM kiosk_settings WHERE id = 1;

-- Update password (butuh authentication)
-- UPDATE kiosk_settings 
-- SET password = 'newpassword123', updated_by = 'admin@smkmarhas.sch.id', notes = 'Password changed by admin'
-- WHERE id = 1;

-- ========================================
-- NOTES
-- ========================================
-- 1. Table ini hanya boleh punya 1 row (enforced by CONSTRAINT)
-- 2. Password bisa diubah dari admin panel
-- 3. RLS enabled untuk keamanan
-- 4. Auto-update timestamp saat password diubah

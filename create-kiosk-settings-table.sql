`
CREATE TABLE IF NOT EXISTS kiosk_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(100),
    notes TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO kiosk_settings (id, password, notes)
VALUES (1, 'smkmarhas2025', 'Default kiosk mode password')
ON CONFLICT (id) DO NOTHING;
ALTER TABLE kiosk_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for kiosk settings"
ON kiosk_settings
FOR SELECT
TO public
USING (true);
CREATE POLICY "Allow update for authenticated users"
ON kiosk_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
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
CREATE TRIGGER update_kiosk_settings_timestamp
BEFORE UPDATE ON kiosk_settings
FOR EACH ROW
EXECUTE FUNCTION update_kiosk_settings_timestamp();
-- Create emergency_alerts table in Supabase
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    message TEXT,
    user_name TEXT,
    user_photo TEXT,
    location JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    telegram_sent BOOLEAN DEFAULT FALSE,
    emergency_button_pressed BOOLEAN DEFAULT FALSE,
    accident_type TEXT,
    scan_id TEXT,
    scan_photo TEXT,
    status TEXT DEFAULT 'active',
    response_time BIGINT,
    responded_by TEXT,
    handled_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_alert_id ON emergency_alerts(alert_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON emergency_alerts(status);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_timestamp ON emergency_alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_accident_type ON emergency_alerts(accident_type);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_scan_id ON emergency_alerts(scan_id);

-- Enable Row Level Security (RLS)
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow ALL operations for authenticated users
CREATE POLICY "Allow authenticated users full access to emergency_alerts"
ON emergency_alerts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow ALL operations for anon (for emergency button from public dashboard)
CREATE POLICY "Allow anon full access to emergency_alerts"
ON emergency_alerts FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Create policy to allow service role to do everything
CREATE POLICY "Allow service role full access to emergency_alerts"
ON emergency_alerts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMENT ON TABLE emergency_alerts IS 'Stores all emergency alerts triggered by users';
COMMENT ON COLUMN emergency_alerts.alert_id IS 'Unique identifier for the alert (timestamp-based)';
COMMENT ON COLUMN emergency_alerts.accident_type IS 'Type of emergency: medical, fire, crime, accident, other';
COMMENT ON COLUMN emergency_alerts.status IS 'Status: active or handled';
COMMENT ON COLUMN emergency_alerts.response_time IS 'Time taken to handle the case in milliseconds';

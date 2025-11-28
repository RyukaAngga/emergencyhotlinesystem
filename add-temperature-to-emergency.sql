ALTER TABLE emergency_alerts 
ADD COLUMN IF NOT EXISTS body_temperature DECIMAL(3,1);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_body_temperature 
ON emergency_alerts(body_temperature);
COMMENT ON COLUMN emergency_alerts.body_temperature IS 'Body temperature in Celsius (e.g., 36.5, 37.2)';
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'emergency_alerts'
ORDER BY ordinal_position;
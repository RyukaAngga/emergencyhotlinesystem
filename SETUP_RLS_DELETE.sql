ALTER TABLE registered_faces DISABLE ROW LEVEL SECURITY;
SELECT 
  tablename,
  rowsecurity as "RLS Status (should be false)"
FROM pg_tables
WHERE tablename = 'registered_faces';
DROP POLICY IF EXISTS "Anyone can view registered faces" ON registered_faces;
DROP POLICY IF EXISTS "Authenticated users can insert" ON registered_faces;
DROP POLICY IF EXISTS "Authenticated users can update" ON registered_faces;
DROP POLICY IF EXISTS "Authenticated users can delete" ON registered_faces;
ALTER TABLE registered_faces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view registered faces"
ON registered_faces
FOR SELECT
TO public
USING (true);
CREATE POLICY "Authenticated users can insert"
ON registered_faces
FOR INSERT
TO authenticated
WITH CHECK (true);
CREATE POLICY "Authenticated users can update"
ON registered_faces
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
CREATE POLICY "Authenticated users can delete"
ON registered_faces
FOR DELETE
TO authenticated
USING (true);
DROP POLICY IF EXISTS "Anyone can view registered faces" ON registered_faces;
DROP POLICY IF EXISTS "Authenticated users can insert" ON registered_faces;
DROP POLICY IF EXISTS "Authenticated users can update" ON registered_faces;
DROP POLICY IF EXISTS "Authenticated users can delete" ON registered_faces;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'registered_faces';
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'registered_faces';
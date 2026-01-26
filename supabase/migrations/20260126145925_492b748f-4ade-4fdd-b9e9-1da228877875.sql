-- Allow anyone to view profiles for AR experience (public access to avatar data)
CREATE POLICY "Anyone can view profiles for AR"
  ON profiles FOR SELECT
  USING (true);
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Allow authenticated users to create their own profile during signup
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admins to manage all profiles
CREATE POLICY "Admins can manage all profiles"
ON profiles FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles admin 
    WHERE admin.user_id = auth.uid() 
    AND admin.role IN ('super_admin', 'admin')
  )
);
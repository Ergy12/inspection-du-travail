/*
  # Fix profiles table RLS policies

  1. Changes
    - Add RLS policies for profiles table to allow:
      - Users to insert their own profile during signup
      - Users to read their own profile
      - Super admins and admins to manage profiles
*/

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Allow users to insert their own profile during signup
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

-- Allow super_admin and admin to manage all profiles
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
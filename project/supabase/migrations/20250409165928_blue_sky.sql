/*
  # Profile Security Policies

  1. Changes
    - Enable Row Level Security on profiles table
    - Create policies for user profile management
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - User self-management (create, read, update)
      - Admin management of all profiles
*/

-- Safely enable RLS and manage policies using PL/pgSQL
DO $$ 
BEGIN
  -- Enable RLS
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can create their own profile') THEN
    DROP POLICY "Users can create their own profile" ON profiles;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
    DROP POLICY "Users can view their own profile" ON profiles;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    DROP POLICY "Users can update their own profile" ON profiles;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can manage all profiles') THEN
    DROP POLICY "Admins can manage all profiles" ON profiles;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles"
ON profiles FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM profiles admin 
    WHERE admin.user_id = auth.uid() 
    AND admin.role IN ('super_admin', 'admin')
  )
);
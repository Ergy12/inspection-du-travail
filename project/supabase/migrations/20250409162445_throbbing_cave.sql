/*
  # Administrative System Schema

  1. New Tables
    - provinces
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - directions
      - id (uuid, primary key)
      - name (text)
      - province_id (uuid, foreign key)
      - address (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - branches
      - id (uuid, primary key)
      - name (text)
      - direction_id (uuid, foreign key)
      - address (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - profiles
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - first_name (text)
      - last_name (text)
      - role (user_role)
      - direction_id (uuid, foreign key, nullable)
      - branch_id (uuid, foreign key, nullable)
      - is_active (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
*/

-- Create provinces table
CREATE TABLE IF NOT EXISTS provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create directions table
CREATE TABLE IF NOT EXISTS directions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  province_id uuid REFERENCES provinces(id) ON DELETE CASCADE,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  direction_id uuid REFERENCES directions(id) ON DELETE CASCADE,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role NOT NULL,
  direction_id uuid REFERENCES directions(id) ON DELETE SET NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create complaint assignments table
CREATE TABLE IF NOT EXISTS complaint_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  inspector_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  removed_at timestamptz
);

-- Create complaint history table
CREATE TABLE IF NOT EXISTS complaint_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  details text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create complaint documents table
CREATE TABLE IF NOT EXISTS complaint_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create complaint reports table
CREATE TABLE IF NOT EXISTS complaint_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_reports ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Super admin can do everything
CREATE POLICY "Super admin full access on provinces"
  ON provinces
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'super_admin'
  ));

CREATE POLICY "Super admin full access on directions"
  ON directions
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'super_admin'
  ));

CREATE POLICY "Super admin full access on branches"
  ON branches
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'super_admin'
  ));

-- Profiles can be read by authenticated users
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Complaint assignments viewable by relevant users
CREATE POLICY "Complaint assignments viewable by relevant users"
  ON complaint_assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        profiles.role IN ('super_admin', 'admin', 'complaint_manager')
        OR profiles.id = inspector_id
      )
    )
  );

-- Complaint history viewable by relevant users
CREATE POLICY "Complaint history viewable by relevant users"
  ON complaint_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        profiles.role IN ('super_admin', 'admin', 'complaint_manager')
        OR profiles.id IN (
          SELECT inspector_id FROM complaint_assignments
          WHERE complaint_assignments.complaint_id = complaint_history.complaint_id
          AND removed_at IS NULL
        )
      )
    )
  );

-- Documents and reports policies
CREATE POLICY "Documents viewable by relevant users"
  ON complaint_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        profiles.role IN ('super_admin', 'admin', 'complaint_manager')
        OR profiles.id IN (
          SELECT inspector_id FROM complaint_assignments
          WHERE complaint_assignments.complaint_id = complaint_documents.complaint_id
          AND removed_at IS NULL
        )
      )
    )
  );

CREATE POLICY "Reports viewable by relevant users"
  ON complaint_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        profiles.role IN ('super_admin', 'admin', 'complaint_manager')
        OR profiles.id IN (
          SELECT inspector_id FROM complaint_assignments
          WHERE complaint_assignments.complaint_id = complaint_reports.complaint_id
          AND removed_at IS NULL
        )
      )
    )
  );
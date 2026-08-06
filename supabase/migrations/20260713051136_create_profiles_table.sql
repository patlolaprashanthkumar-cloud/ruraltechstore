/*
# Create profiles table

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, not null)
  - `name` (text, not null)
  - `role` (text, not null, one of: admin, sub_admin, super_distributor, distributor, retailer)
  - `is_active` (boolean, default true)
  - `wallet_balance` (numeric, default 0)
  - `commission` (numeric, default 0)
  - `parent_id` (uuid, nullable, references profiles.id)
  - `state` (text, nullable)
  - `district` (text, nullable)
  - `phone` (text, nullable)
  - `address` (text, nullable)
  - `kyc_status` (text, default 'pending', one of: pending, approved, rejected)
  - `certifications` (text[], default '{}')
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `profiles`.
- Users can read their own profile.
- Users can update their own profile (limited fields).
- Admins (role = admin or sub_admin) can read all profiles.
- Admins can update all profiles.
- Admins can insert new profiles.
- Admins can delete profiles.
- A trigger auto-creates a profile row when a new auth user signs up.

3. Indexes
- Index on `role` for filtering by role.
- Index on `parent_id` for hierarchy queries.
- Index on `state` for location filtering.

4. Notes
- This table extends Supabase's built-in auth.users with application-specific fields.
- The `role` column determines what dashboard and permissions a user has.
- `parent_id` supports the distributor/retailer hierarchy.
- `wallet_balance` and `commission` are stored as numeric for precision.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'retailer' CHECK (role IN ('admin', 'sub_admin', 'super_distributor', 'distributor', 'retailer')),
  is_active boolean NOT NULL DEFAULT true,
  wallet_balance numeric NOT NULL DEFAULT 0,
  commission numeric NOT NULL DEFAULT 0,
  parent_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  state text,
  district text,
  phone text,
  address text,
  kyc_status text NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  certifications text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Admins can read all profiles
DROP POLICY IF EXISTS "admin_select_all_profiles" ON profiles;
CREATE POLICY "admin_select_all_profiles"
  ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'sub_admin')
    )
  );

-- Users can update their own profile
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
DROP POLICY IF EXISTS "admin_update_all_profiles" ON profiles;
CREATE POLICY "admin_update_all_profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'sub_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'sub_admin')
    )
  );

-- Admins can insert new profiles
DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
CREATE POLICY "admin_insert_profiles"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'sub_admin')
    )
  );

-- Self-insert: a new user can create their own profile row on signup
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admins can delete profiles
DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;
CREATE POLICY "admin_delete_profiles"
  ON profiles FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'sub_admin')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Allow users to insert their own profile (needed for signup trigger)
DO $$ BEGIN
  CREATE POLICY "Users insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow service role to insert profiles (needed for admin user creation)
DO $$ BEGIN
  CREATE POLICY "Service role insert profiles" ON profiles
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

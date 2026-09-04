-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses"
  ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses"
  ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses"
  ON addresses FOR DELETE USING (auth.uid() = user_id);
-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wishlist"
  ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their wishlist"
  ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their wishlist"
  ON wishlists FOR DELETE USING (auth.uid() = user_id);
-- Add avatar_url to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

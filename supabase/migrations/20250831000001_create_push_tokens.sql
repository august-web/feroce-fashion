-- Push notification tokens table
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  platform TEXT NOT NULL DEFAULT 'ios',
  device_info JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON push_tokens(active) WHERE active = true;
-- RLS policies
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
-- Anyone can insert their own token
CREATE POLICY "Users can insert their own push token"
  ON push_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
-- Users can update their own tokens
CREATE POLICY "Users can update their own push tokens"
  ON push_tokens FOR UPDATE
  USING (auth.uid() = user_id);
-- Users can delete their own tokens
CREATE POLICY "Users can delete their own push tokens"
  ON push_tokens FOR DELETE
  USING (auth.uid() = user_id);
-- Admin can read all tokens (for sending push notifications)
CREATE POLICY "Admins can read all push tokens"
  ON push_tokens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
-- Admin can manage all tokens
CREATE POLICY "Admins can manage all push tokens"
  ON push_tokens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

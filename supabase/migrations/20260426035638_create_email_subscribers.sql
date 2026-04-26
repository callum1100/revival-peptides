/*
  # Create email_subscribers table

  1. New Tables
    - `email_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique) - subscriber email address
      - `source` (text) - where they subscribed from (exit_intent, footer, etc.)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Allow anonymous inserts (anyone can subscribe)
    - Allow service role to read all subscribers
*/

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'exit_intent',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON email_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can read subscribers"
  ON email_subscribers
  FOR SELECT
  TO service_role
  USING (true);

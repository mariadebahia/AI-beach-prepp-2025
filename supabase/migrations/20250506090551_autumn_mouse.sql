/*
  # Create submissions table for competition entries

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `company_name` (text)
      - `contact_name` (text)
      - `email` (text)
      - `phone` (text)
      - `motivation` (text)

  2. Security
    - Enable RLS on `submissions` table
    - Add policy for authenticated users to read their own submissions
    - Add policy for anyone to insert submissions
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  motivation text NOT NULL
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert submissions"
  ON submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid()
    FROM auth.users
    WHERE users.email = submissions.email
  ));
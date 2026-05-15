-- Seller-facing test metadata (description, attempt limit, certificate name).
-- Safe to run multiple times; does not modify or delete existing rows.

ALTER TABLE tests ADD COLUMN IF NOT EXISTS description text DEFAULT '';
ALTER TABLE tests ADD COLUMN IF NOT EXISTS max_attempts text DEFAULT 'unlimited';
ALTER TABLE tests ADD COLUMN IF NOT EXISTS certificate_name text DEFAULT '';

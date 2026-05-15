-- Seller-facing test metadata (description, attempt limit, certificate name).
-- Safe to run multiple times; does not modify or delete existing rows.

ALTER TABLE tests ADD COLUMN IF NOT EXISTS description text DEFAULT '';
ALTER TABLE tests ADD COLUMN IF NOT EXISTS certificate_name text DEFAULT '';
-- max_attempts: integer, NULL = unlimited (do not use text 'unlimited')
ALTER TABLE tests ADD COLUMN IF NOT EXISTS max_attempts integer;

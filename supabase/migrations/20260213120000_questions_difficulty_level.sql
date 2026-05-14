-- Question bank: difficulty metadata (safe additive migration; no data loss).
-- Run against your Supabase project (SQL editor or `supabase db push`).
-- If PostgREST still errors on insert: Dashboard → Project Settings → API → "Reload schema" (schema cache).

-- 1) Bank questions live in `questions`; tests live in `tests` with JSON `questions` array (snapshots).
--    Relationship is denormalized in JSON — duplicate prevention is enforced in app + optional unique
--    if you later introduce a join table. This migration only adds difficulty on the bank table.

alter table public.questions
  add column if not exists difficulty_level text;

-- Backfill existing rows (nullable column first, then default for new inserts via app)
update public.questions
set difficulty_level = 'medium'
where difficulty_level is null or trim(difficulty_level) = '';

update public.questions
set difficulty_level = 'medium'
where lower(trim(difficulty_level)) not in ('easy', 'medium', 'hard');

alter table public.questions
  alter column difficulty_level set default 'medium';

alter table public.questions
  drop constraint if exists questions_difficulty_level_check;

alter table public.questions
  add constraint questions_difficulty_level_check
  check (difficulty_level in ('easy', 'medium', 'hard'));

alter table public.questions
  alter column difficulty_level set not null;

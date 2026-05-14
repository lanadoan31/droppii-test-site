import { supabase } from '../lib/supabaseClient';
import { canonicalQuestionCategory } from './questionBankCategories.js';

/**
 * When `questions.difficulty_level` is missing from PostgREST, inserts omit it.
 * Session overlay remembers chosen difficulty per id so refresh still matches the admin UI
 * until you run: `supabase/migrations/20260213120000_questions_difficulty_level.sql` in Supabase.
 */
const DIFFICULTY_OVERLAY_KEY = 'droppii_q_difficulty_overlay_v1';

function readDifficultyOverlay() {
  try {
    const raw = sessionStorage.getItem(DIFFICULTY_OVERLAY_KEY);
    const o = raw ? JSON.parse(raw) : {};
    return o && typeof o === 'object' ? o : {};
  } catch {
    return {};
  }
}

function writeDifficultyOverlay(obj) {
  try {
    sessionStorage.setItem(DIFFICULTY_OVERLAY_KEY, JSON.stringify(obj));
  } catch {
    /* ignore quota / private mode */
  }
}

function rememberDifficultyInOverlay(id, level) {
  if (!id) return;
  const o = readDifficultyOverlay();
  o[id] = normalizeDifficultyLevel(level);
  writeDifficultyOverlay(o);
}

function forgetDifficultyInOverlay(id) {
  if (!id) return;
  const o = readDifficultyOverlay();
  delete o[id];
  writeDifficultyOverlay(o);
}

function normalizeDifficultyLevel(v) {
  const x = String(v ?? 'medium').trim().toLowerCase();
  if (x === 'easy' || x === 'hard' || x === 'medium') return x;
  return 'medium';
}

function missingDifficultyColumnError(error) {
  if (!error) return false;
  const msg = String(error.message || '');
  return /difficulty_level/i.test(msg);
}

function questionToRow(q, { omitDifficulty = false } = {}) {
  const row = {
    content:        q.text || '',
    type:           q.type || 'multiple-choice',
    options:        q.type === 'short-answer' ? null : (q.options || []),
    correct_answer: q.correct || [],
    category:       canonicalQuestionCategory(q.category),
  };
  if (!omitDifficulty) {
    row.difficulty_level = normalizeDifficultyLevel(q.difficultyLevel);
  }
  return row;
}

function rowHasPersistedDifficulty(row) {
  const v = row?.difficulty_level;
  return v != null && String(v).trim() !== '';
}

/** When PostgREST has no `difficulty_level` column, inserts omit it — merge client choice for correct UI until migration is applied. */
function mergeClientDifficultyIntoRow(data, question) {
  if (!data || !question) return data;
  if (rowHasPersistedDifficulty(data)) return data;
  return {
    ...data,
    difficulty_level: normalizeDifficultyLevel(question.difficultyLevel),
  };
}

function rowToQuestion(row) {
  return {
    id:               row.id,
    text:             row.content || '',
    type:             row.type || 'multiple-choice',
    options:          Array.isArray(row.options) ? row.options : [],
    correct:          Array.isArray(row.correct_answer) ? row.correct_answer : [],
    category:         canonicalQuestionCategory(row.category),
    difficultyLevel:  normalizeDifficultyLevel(row.difficulty_level),
    createdAt:        row.created_at,
    updatedAt:      row.updated_at,
  };
}

/** Human-readable Supabase / PostgREST errors for toasts (no secrets). */
export function formatQuestionStoreError(error) {
  if (!error) return 'Unknown error';
  const parts = [error.message, error.code && `(${error.code})`, error.details].filter(Boolean);
  return parts.join(' — ') || 'Unknown error';
}

export async function getAllQuestions() {
  console.log('[Supabase] fetching questions');
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('[Supabase] getAllQuestions error:', error); return []; }
  const overlay = readDifficultyOverlay();
  return (data || []).map((row) => {
    if (rowHasPersistedDifficulty(row)) return rowToQuestion(row);
    const fromOverlay = overlay[row.id];
    if (fromOverlay) return rowToQuestion({ ...row, difficulty_level: fromOverlay });
    return rowToQuestion(row);
  });
}

async function insertQuestionRow(row) {
  return supabase.from('questions').insert(row).select().single();
}

async function updateQuestionRow(id, row) {
  return supabase.from('questions').update(row).eq('id', id).select().single();
}

export async function createQuestion(question) {
  console.log('[Supabase] saving question:', question.text?.slice(0, 60));
  let row = questionToRow(question, { omitDifficulty: false });
  let { data, error } = await insertQuestionRow(row);

  if (error && missingDifficultyColumnError(error)) {
    console.warn('[Supabase] questions.difficulty_level missing — retry without column (run migration to persist difficulty).');
    row = questionToRow(question, { omitDifficulty: true });
    ({ data, error } = await insertQuestionRow(row));
  }

  if (error) { console.error('[Supabase] createQuestion error:', error); throw error; }
  const merged = mergeClientDifficultyIntoRow(data, question);
  if (rowHasPersistedDifficulty(data)) forgetDifficultyInOverlay(data.id);
  else rememberDifficultyInOverlay(data.id, question.difficultyLevel);
  return rowToQuestion(merged);
}

export async function updateQuestion(id, question) {
  console.log('[Supabase] saving question:', id);
  let row = questionToRow(question, { omitDifficulty: false });
  let { data, error } = await updateQuestionRow(id, row);

  if (error && missingDifficultyColumnError(error)) {
    console.warn('[Supabase] questions.difficulty_level missing — retry update without column.');
    row = questionToRow(question, { omitDifficulty: true });
    ({ data, error } = await updateQuestionRow(id, row));
  }

  if (error) { console.error('[Supabase] updateQuestion error:', error); throw error; }
  const merged = mergeClientDifficultyIntoRow(data, question);
  if (rowHasPersistedDifficulty(data)) forgetDifficultyInOverlay(data.id);
  else rememberDifficultyInOverlay(data.id, question.difficultyLevel);
  return rowToQuestion(merged);
}

export async function deleteQuestion(id) {
  console.log('[Supabase] deleting question:', id);
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);
  if (error) { console.error('[Supabase] deleteQuestion error:', error); throw error; }
  forgetDifficultyInOverlay(id);
}

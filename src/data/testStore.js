import { supabase } from '../lib/supabaseClient';
import { normalizeQuestion } from '../admin-v2-new/testExport.js';
import { canonicalQuestionCategory } from './questionBankCategories.js';
import { formatAttemptLimit } from './testMetaFormat.js';

// ── DB ↔ App mapping ─────────────────────────────────────────────────────────

// DB row (snake_case) → admin test object used by React state
function rowToTest(row) {
  const rawList = Array.isArray(row.questions) ? row.questions : [];
  const questionsList = rawList.map((q) => normalizeQuestion(q));
  return {
    id:                 row.id,
    title:              row.title || '',
    category:           canonicalQuestionCategory(row.category || ''),
    description:        row.description || '',
    status:             row.status || 'draft',
    duration:           row.duration || 30,
    passingScore:       row.passing_score || 70,
    questionsList,
    questions:          questionsList.length,
    maxAttempts:        parseMaxAttempts(row.max_attempts),
    certificateName:    row.certificate_name || '',
    availability:       { type: 'always' },
    randomizeQuestions: true,
    randomizeOptions:   true,
    showCorrectAnswers: true,
    requireWebcam:      false,
    assignedUsers:      'all',
    attempts:           0,
    avgScore:           0,
    passRate:           0,
    updatedAt:          row.updated_at
      ? new Date(row.updated_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
      : 'just now',
  };
}

// Admin test object → DB row (snake_case)
function testToRow(test) {
  const questionsPayload = (test.questionsList || []).map((q) => normalizeQuestion(q));
  return {
    id:            test.id,
    title:         test.title || '',
    category:      canonicalQuestionCategory(test.category || ''),
    duration:      Number(test.duration) || 30,
    passing_score:    Number(test.passingScore) || 70,
    description:      test.description || '',
    max_attempts:     serializeMaxAttempts(test.maxAttempts),
    certificate_name: test.certificateName || '',
    status:           test.status || 'draft',
    questions:        questionsPayload,
  };
}

function parseMaxAttempts(value) {
  if (value == null || value === '') return 'unlimited';
  const n = Number(value);
  return !Number.isNaN(n) && n > 0 ? n : 'unlimited';
}

function serializeMaxAttempts(value) {
  if (value === 'unlimited' || value == null || value === '') return null;
  const n = Number(value);
  return !Number.isNaN(n) && n > 0 ? n : null;
}

function collectTopicLabels(test) {
  const labels = new Set();
  const testCategory = canonicalQuestionCategory(test.category || '');
  if (testCategory) labels.add(testCategory);

  for (const q of test.questionsList || []) {
    const cat = canonicalQuestionCategory(q.category || '');
    if (cat) labels.add(cat);
  }

  const arr = [...labels];
  if (arr.length === 0) {
    return [{ id: 'general', label: testCategory || 'Kiến thức chung' }];
  }
  return arr.map((label, i) => ({ id: `topic-${i}`, label }));
}

// ── Seller transform ──────────────────────────────────────────────────────────

const LETTER_IDS = ['a', 'b', 'c', 'd', 'e', 'f'];

function typeToSeller(adminType) {
  switch (adminType) {
    case 'multiple-choice': return 'single';
    case 'multi-select':    return 'multi';
    case 'true-false':      return 'single';
    case 'short-answer':    return 'short';
    default:                return 'single';
  }
}

export function adaptForSeller(test) {
  const ql = (test.questionsList || []).map((q) => normalizeQuestion(q));
  const questions = ql.map((q) => {
    const sellerQ = {
      id:          q.id,
      type:        typeToSeller(q.type),
      prompt:      q.text,
      explanation: q.explanation || '',
      topic:       'published',
      topicLabel:  canonicalQuestionCategory(q.category || test.category || ''),
    };
    if (q.type === 'short-answer') {
      const kw = Array.isArray(q.keywords) ? q.keywords.join(', ') : (q.keywords || '');
      sellerQ.sample = kw ? `Keywords: ${kw}` : (q.explanation || '');
    } else {
      sellerQ.options = (q.options || []).map((opt, i) => ({
        id:   LETTER_IDS[i] || String(i),
        text: typeof opt === 'string' ? opt : (opt?.text ?? ''),
      }));
      sellerQ.correct = (q.correct || []).map((idx) => LETTER_IDS[idx] || String(idx));
    }
    return sellerQ;
  });

  const passingScore = Number(test.passingScore) || 70;
  const durationMinutes = Number(test.duration) || 30;

  return {
    questions,
    testMeta: {
      id:              test.id,
      title:           test.title || 'Bài kiểm tra',
      subtitle:        (test.description || '').trim() || 'Bài kiểm tra kiến thức',
      durationMinutes,
      passingScore,
      totalQuestions:  questions.length,
      maxAttempts:     test.maxAttempts ?? 'unlimited',
      attemptLimitLabel: formatAttemptLimit(test.maxAttempts),
      certificateName: (test.certificateName || '').trim() || 'Chứng chỉ Droppii',
      category:        canonicalQuestionCategory(test.category || ''),
      topics:          collectTopicLabels(test),
    },
  };
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export function formatSupabaseError(error) {
  if (!error) return 'Unknown error';
  const msg = error.message || String(error);
  if (error.code === '42501') return `RLS policy blocked update — ${msg}`;
  if (error.code === '22P02') return `Invalid data — ${msg}`;
  if (error.code === 'PGRST204') return `Missing column — ${msg}`;
  return msg;
}

export async function getAllTests() {
  console.log('[Supabase] fetching tests');
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('[Supabase] getAllTests error:', error); return []; }
  return (data || []).map(rowToTest);
}

// Insert (new) or update (existing) a test.
export async function saveTest(test) {
  console.log('Saving test:', test);
  console.log('[Supabase] saving test:', test.id, 'status:', test.status);
  if (test.status === 'published') {
    console.log('[Supabase] published to Supabase:', test.id);
  }
  const row = testToRow(test);
  const { data, error } = await supabase
    .from('tests')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) {
    console.error('[Supabase] saveTest error:', error.message, error);
    const wrapped = new Error(formatSupabaseError(error));
    wrapped.cause = error;
    throw wrapped;
  }
  return rowToTest(data);
}

// ── Seller reads ──────────────────────────────────────────────────────────────

export async function getAllPublishedTests() {
  console.log('[Supabase] fetching published tests');
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('status', 'published');
  if (error) { console.error('[Supabase] getAllPublishedTests error:', error); return []; }
  const tests = (data || []).map(rowToTest);
  console.log('[Supabase] published tests found:', tests.length, tests.map(t => t.id));
  return tests;
}

// Returns all published tests visible to this seller.
// assignedUsers filtering is not yet persisted to DB — returns all published for now.
export async function getTestsForUser(_userId) {
  return getAllPublishedTests();
}

// Alias — returns all tests regardless of status (used by admin analytics).
export const getAllStoredTests = getAllTests;

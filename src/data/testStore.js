import { supabase } from '../lib/supabaseClient';

// ── DB ↔ App mapping ─────────────────────────────────────────────────────────

// DB row (snake_case) → admin test object used by React state
function rowToTest(row) {
  return {
    id:                 row.id,
    title:              row.title || '',
    category:           row.category || 'General',
    description:        '',
    status:             row.status || 'draft',
    duration:           row.duration || 30,
    passingScore:       row.passing_score || 70,
    questionsList:      Array.isArray(row.questions) ? row.questions : [],
    questions:          Array.isArray(row.questions) ? row.questions.length : 0,
    maxAttempts:        'unlimited',
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
  return {
    id:            test.id,
    title:         test.title || '',
    category:      test.category || 'General',
    duration:      Number(test.duration) || 30,
    passing_score: Number(test.passingScore) || 70,
    status:        test.status || 'draft',
    questions:     test.questionsList || [],
  };
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
  const ql = test.questionsList || [];
  const questions = ql.map((q) => {
    const sellerQ = {
      id:          q.id,
      type:        typeToSeller(q.type),
      prompt:      q.text,
      explanation: q.explanation || '',
      topic:       'published',
      topicLabel:  test.category || 'General',
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

  return {
    questions,
    testMeta: {
      id:              test.id,
      title:           test.title,
      subtitle:        'Bài kiểm tra kiến thức',
      durationMinutes: test.duration || 30,
      passingScore:    test.passingScore || 70,
      totalQuestions:  questions.length,
      topics:          [{ id: 'cat', label: test.category || 'General' }],
    },
  };
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────

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
    throw error;
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

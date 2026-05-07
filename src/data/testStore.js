// sessionStorage-backed store for published tests (keyed by test ID).
// Bridges admin-v2 export format → seller flow format.

const STORE_KEY = 'droppii_published_tests';

const LETTER_IDS = ['a', 'b', 'c', 'd', 'e', 'f'];

function getAllRaw() {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function typeToSeller(adminType) {
  switch (adminType) {
    case 'multiple-choice': return 'single';
    case 'multi-select':    return 'multi';
    case 'true-false':      return 'single';
    case 'short-answer':    return 'short';
    default:                return 'single';
  }
}

export function adaptForSeller(exportedTest) {
  const questions = exportedTest.questions.map((q) => {
    const sellerQ = {
      id:          q.id,
      type:        typeToSeller(q.type),
      prompt:      q.text,
      explanation: q.explanation || '',
      topic:       'published',
      topicLabel:  exportedTest.category || 'General',
    };

    if (q.type === 'short-answer') {
      const kw = Array.isArray(q.keywords) ? q.keywords.join(', ') : (q.keywords || '');
      sellerQ.sample = kw ? `Keywords: ${kw}` : (q.explanation || '');
    } else {
      sellerQ.options = (q.options || []).map((opt, i) => ({
        id:   LETTER_IDS[i] || String(i),
        text: typeof opt === 'string' ? opt : opt.text,
      }));
      sellerQ.correct = (q.correct || []).map((idx) => LETTER_IDS[idx] || String(idx));
    }

    return sellerQ;
  });

  const testMeta = {
    id:              exportedTest.id,
    title:           exportedTest.title,
    subtitle:        exportedTest.description || 'Bài kiểm tra kiến thức',
    durationMinutes: exportedTest.duration,
    passingScore:    exportedTest.passingScore,
    totalQuestions:  questions.length,
    topics:          [{ id: 'cat', label: exportedTest.category || 'General' }],
  };

  return { questions, testMeta };
}

export function publishTest(exportedTest) {
  try {
    const all = getAllRaw();
    all[exportedTest.id] = exportedTest;
    sessionStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {
    // sessionStorage unavailable
  }
}

// Returns true if this exported test should be visible to a seller right now.
export function isTestAvailable(test) {
  const { status, availability } = test;
  if (status === 'draft' || status === 'archived') return false;
  if (status === 'published') return true;
  if (status === 'scheduled') {
    const now = Date.now();
    const { startAt, endAt } = availability || {};
    if (startAt && new Date(startAt).getTime() > now) return false; // not started yet
    if (endAt   && new Date(endAt).getTime()   < now) return false; // already ended
    return true;
  }
  return false;
}

export function getAllPublishedTests() {
  return Object.values(getAllRaw()).filter(isTestAvailable);
}

// Returns tests that are available AND assigned to the given userId (seller name).
// assignedUsers === 'all' or undefined → visible to everyone.
// assignedUsers is a string[] → visible only if userId matches one entry (case-insensitive).
// Treats missing assignedUsers (older exports) as 'all' for backward compatibility.
export function getTestsForUser(userId) {
  const uid = (userId || '').trim().toLowerCase();
  return getAllPublishedTests().filter((test) => {
    const au = test.assignedUsers;
    if (!au || au === 'all') return true;
    if (!Array.isArray(au) || au.length === 0) return false;
    return au.some((u) => u.trim().toLowerCase() === uid);
  });
}

// All tests in the store regardless of availability — for admin analytics.
export function getAllStoredTests() {
  return Object.values(getAllRaw());
}

export function getTestById(testId) {
  return getAllRaw()[testId] || null;
}

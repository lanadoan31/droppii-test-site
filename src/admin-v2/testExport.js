// Validation and export utilities for the admin-v2 builder.
// exportTest() produces the standard format that the seller test flow will consume.

// ── Normalize ──────────────────────────────────────────────────────────────────
// Ensures every question object has all fields, regardless of how it was created.
export function normalizeQuestion(q) {
  const type = q.type || 'multiple-choice';
  let options;
  if (type === 'short-answer') {
    options = undefined;
  } else if (type === 'true-false') {
    options = ['True', 'False'];
  } else {
    options = Array.isArray(q.options) ? q.options : ['', '', '', ''];
  }
  return {
    id:          q.id || ('bq' + Date.now() + Math.random().toString(36).slice(2, 5)),
    type,
    text:        q.text || '',
    options,
    correct:     Array.isArray(q.correct) ? q.correct : [0],
    explanation: q.explanation || '',
    points:      q.points ?? 1,
    keywords:    type === 'short-answer' ? (q.keywords || '') : '',
  };
}

// ── Per-question validation ────────────────────────────────────────────────────
// Returns an array of error codes (empty = valid).
export function validateQuestion(q) {
  const errors = [];
  if (!q.text?.trim()) {
    errors.push('empty-text');
  }
  if (q.type !== 'short-answer') {
    if (!Array.isArray(q.correct) || q.correct.length === 0) {
      errors.push('no-correct');
    }
  }
  return errors;
}

// ── Test-level validation ──────────────────────────────────────────────────────
// Returns an array of human-readable error strings; empty = publishable.
export function validateForPublish(questions, passingScore) {
  const errors = [];

  if (!questions || questions.length === 0) {
    errors.push('Add at least one question before publishing.');
    return errors; // no point checking individual questions
  }

  const score = Number(passingScore);
  if (isNaN(score) || score < 1 || score > 100) {
    errors.push('Passing score must be between 1 and 100.');
  }

  const badQs = questions.filter((q) => validateQuestion(q).length > 0);
  if (badQs.length > 0) {
    errors.push(
      `${badQs.length} question${badQs.length !== 1 ? 's' : ''} need${badQs.length === 1 ? 's' : ''} to be fixed (missing text or correct answer).`
    );
  }

  return errors;
}

// ── Availability normalizer ────────────────────────────────────────────────────
// Converts internal admin availability format to the portable { type, startAt, endAt } shape.
function normalizeAvailability(avail) {
  if (!avail || avail.type === 'always') {
    return { type: 'always', startAt: null, endAt: null };
  }
  // 'window' (internal) → 'scheduled' (exported)
  const startAt = avail.opens  ? new Date(avail.opens).toISOString()  : null;
  const endAt   = avail.closes ? new Date(avail.closes).toISOString() : null;
  return { type: 'scheduled', startAt, endAt };
}

// ── Export ─────────────────────────────────────────────────────────────────────
// Converts the admin-v2 test object into a portable format for the seller test flow.
export function exportTest(test) {
  const questions = (test.questionsList || []).map((q) => {
    const base = {
      id:          q.id,
      type:        q.type,
      text:        (q.text || '').trim(),
      explanation: (q.explanation || '').trim(),
      points:      q.points ?? 1,
    };

    if (q.type === 'short-answer') {
      base.keywords = (q.keywords || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
    } else {
      base.options = (q.options || []).map((text, i) => ({ id: i, text: (text || '').trim() }));
      base.correct = q.correct || [0];
    }

    return base;
  });

  return {
    id:           test.id,
    title:        test.title,
    description:  test.description || '',
    category:     test.category,
    status:       test.status,
    duration:     test.duration,
    passingScore: test.passingScore,
    maxAttempts:  test.maxAttempts,
    availability: normalizeAvailability(test.availability),
    config: {
      randomizeQuestions: test.randomizeQuestions,
      randomizeOptions:   test.randomizeOptions,
      showCorrectAnswers: test.showCorrectAnswers,
      requireWebcam:      test.requireWebcam,
    },
    questions,
    totalPoints:   questions.reduce((sum, q) => sum + (q.points || 1), 0),
    questionCount: questions.length,
    exportedAt:    new Date().toISOString(),
  };
}

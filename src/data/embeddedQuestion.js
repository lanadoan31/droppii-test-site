/**
 * Normalizes embedded question objects inside `tests.questions` JSON.
 * Handles admin shape (text, correct, options[]) and DB / legacy shapes
 * (content, correct_answer, options as { text }[]).
 */
function firstNonEmptyString(...candidates) {
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim().length > 0) return v;
  }
  const firstString = candidates.find((v) => typeof v === 'string');
  return typeof firstString === 'string' ? firstString : '';
}

function normalizeCorrectIndices(cr) {
  if (Array.isArray(cr)) {
    return cr.map((x) => {
      const n = Number(x);
      return Number.isFinite(n) ? n : 0;
    });
  }
  if (cr != null && cr !== '') {
    const n = Number(cr);
    if (Number.isFinite(n)) return [n];
  }
  return [0];
}

function normalizeOptionsList(type, raw) {
  if (type === 'short-answer') return undefined;
  if (type === 'true-false') return ['True', 'False'];
  if (!Array.isArray(raw) || raw.length === 0) return ['', '', '', ''];
  const first = raw[0];
  if (first != null && typeof first === 'object' && !Array.isArray(first) && ('text' in first || 'label' in first)) {
    return raw.map((o) => {
      if (typeof o?.text === 'string') return o.text;
      if (typeof o?.label === 'string') return o.label;
      return String(o?.text ?? o?.label ?? '');
    });
  }
  return raw.map((o) => (typeof o === 'string' ? o : String(o ?? '')));
}

export function mergeLegacyQuestionFields(q) {
  if (!q || typeof q !== 'object') return {};
  const out = { ...q };

  out.id = out.id ?? out.question_id ?? out.questionId;
  out.type = out.type || out.question_type || 'multiple-choice';

  out.text = firstNonEmptyString(
    out.text,
    out.content,
    out.question_text,
    out.questionText,
    out.prompt,
  );

  const cr = out.correct ?? out.correct_answer ?? out.correctAnswer;
  out.correct = normalizeCorrectIndices(cr);

  out.options = normalizeOptionsList(out.type, out.options);

  if (out.category == null && out.topic != null) out.category = out.topic;

  if (out.difficultyLevel == null && out.difficulty_level != null) {
    out.difficultyLevel = out.difficulty_level;
  }

  return out;
}

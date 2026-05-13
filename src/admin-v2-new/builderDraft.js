// Module-level draft store — survives Builder component unmount/remount during navigation.
// Keyed by testId. No React state involved, so reads/writes don't trigger renders.

const _drafts = new Map();

export function getDraft(testId) {
  return _drafts.get(testId) ?? null;
}

export function saveDraft(testId, draft) {
  _drafts.set(testId, draft);
}

export function clearDraft(testId) {
  _drafts.delete(testId);
}

/** Vietnamese labels for seller-facing test intro screens. */

export function formatAttemptLimit(maxAttempts) {
  if (maxAttempts === 'unlimited' || maxAttempts == null || maxAttempts === '') {
    return 'Không giới hạn';
  }
  const n = Number(maxAttempts);
  if (!Number.isNaN(n) && n > 0) {
    return n === 1 ? '1 lần' : `${n} lần`;
  }
  return 'Không giới hạn';
}

export function formatPassCondition(passingScore, fallback = 70) {
  const score = Number(passingScore);
  const pct = !Number.isNaN(score) && score > 0 ? score : fallback;
  return `≥ ${pct}%`;
}

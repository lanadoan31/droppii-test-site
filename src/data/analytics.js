// Analytics helpers — pure functions that aggregate result arrays.
// No side effects, no storage access — just computation.

function avg(arr) {
  return arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}

function pct(num, denom) {
  return denom > 0 ? Math.round((num / denom) * 100) : 0;
}

// ── Test-level metrics ─────────────────────────────────────────────────────────
// Returns one row per unique testId, sorted by most attempts first.
export function getTestMetrics(results) {
  const map = {};
  results.forEach((r) => {
    if (!map[r.testId]) {
      map[r.testId] = {
        testId:    r.testId,
        testTitle: r.testTitle || r.testId,
        totalAttempts: 0,
        passCount:     0,
        scores:        [],
      };
    }
    const t = map[r.testId];
    t.totalAttempts++;
    if (r.passed) t.passCount++;
    t.scores.push(r.score);
  });

  return Object.values(map)
    .map((t) => ({
      testId:        t.testId,
      testTitle:     t.testTitle,
      totalAttempts: t.totalAttempts,
      passCount:     t.passCount,
      failCount:     t.totalAttempts - t.passCount,
      passRate:      pct(t.passCount, t.totalAttempts),
      avgScore:      avg(t.scores),
    }))
    .sort((a, b) => b.totalAttempts - a.totalAttempts);
}

// ── User-level metrics ─────────────────────────────────────────────────────────
// Returns one row per unique userId, sorted by most attempts first.
export function getUserMetrics(results) {
  const map = {};
  results.forEach((r) => {
    const key = r.userId || r.userName;
    if (!map[key]) {
      map[key] = {
        userId:   key,
        userName: r.userName,
        totalTestsTaken: 0,
        passCount:       0,
        scores:          [],
      };
    }
    const u = map[key];
    u.totalTestsTaken++;
    if (r.passed) u.passCount++;
    u.scores.push(r.score);
  });

  return Object.values(map)
    .map((u) => ({
      userId:          u.userId,
      userName:        u.userName,
      totalTestsTaken: u.totalTestsTaken,
      passCount:       u.passCount,
      passRate:        pct(u.passCount, u.totalTestsTaken),
      averageScore:    avg(u.scores),
    }))
    .sort((a, b) => b.totalTestsTaken - a.totalTestsTaken);
}

// ── Dashboard summary ──────────────────────────────────────────────────────────
export function getDashboardSummary(results, totalPublishedTests) {
  const totalAttempts = results.length;
  const passCount     = results.filter((r) => r.passed).length;
  const testMetrics   = getTestMetrics(results).filter((t) => t.totalAttempts > 0);
  const sorted        = [...testMetrics].sort((a, b) => a.passRate - b.passRate);

  return {
    totalPublishedTests,
    totalAttempts,
    overallPassRate: pct(passCount, totalAttempts),
    hardestTests:   sorted.slice(0, 3),
    easiestTests:   sorted.slice(-3).reverse(),
  };
}

// localStorage-backed store for test results (persists across page reloads).

const STORE_KEY = 'droppii_test_results';

function getAllRaw() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// result shape: { testId, testTitle, userName, userId, score, passed, correctCount, totalQuestions, submittedAt }
export function saveTestResult(result) {
  try {
    const all = getAllRaw();
    all.push({ ...result, id: 'r' + Date.now() });
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable
  }
}

export function getAllResults() {
  return getAllRaw();
}

export function getResultsByUser(userId) {
  return getAllRaw().filter((r) => r.userId === userId);
}

import { useState, useEffect, useMemo } from 'react';
import { getAllResults } from '../data/resultStore.js';

export default function Results({ navigate }) {
  const [results,    setResults]    = useState([]);
  const [filterTest, setFilterTest] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [sortBy,     setSortBy]     = useState('date-desc');

  useEffect(() => { setResults(getAllResults()); }, []);

  // Unique test options derived from loaded results
  const testOptions = useMemo(() => {
    const seen = new Map();
    results.forEach((r) => {
      if (!seen.has(r.testId)) seen.set(r.testId, r.testTitle || r.testId);
    });
    return Array.from(seen.entries()).map(([id, title]) => ({ id, title }));
  }, [results]);

  // Unique user options derived from loaded results
  const userOptions = useMemo(() => {
    const seen = new Map();
    results.forEach((r) => {
      if (!seen.has(r.userId)) seen.set(r.userId, r.userName);
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [results]);

  const filtered = useMemo(() => {
    let rows = [...results];
    if (filterTest) rows = rows.filter((r) => r.testId === filterTest);
    if (filterUser) rows = rows.filter((r) => r.userId === filterUser);
    switch (sortBy) {
      case 'date-asc':   rows.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)); break;
      case 'date-desc':  rows.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)); break;
      case 'score-high': rows.sort((a, b) => b.score - a.score); break;
      case 'score-low':  rows.sort((a, b) => a.score - b.score); break;
    }
    return rows;
  }, [results, filterTest, filterUser, sortBy]);

  const hasFilters = filterTest || filterUser;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Filter bar */}
      <div className="results-filter-bar">
        <select
          className="select"
          value={filterTest}
          onChange={(e) => setFilterTest(e.target.value)}
        >
          <option value="">All tests</option>
          {testOptions.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>

        <select
          className="select"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        >
          <option value="">All users</option>
          {userOptions.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select
          className="select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="score-high">Score: high → low</option>
          <option value="score-low">Score: low → high</option>
        </select>

        {hasFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setFilterTest(''); setFilterUser(''); }}
          >
            Clear filters
          </button>
        )}

        <span className="results-count">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="results-table-wrap" style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div className="results-empty">
            {results.length === 0
              ? 'No results yet. Publish a test and have sellers take it.'
              : 'No results match the current filters.'}
          </div>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>User</th>
                <th>Score</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}
                  onClick={() => navigate?.('takerResult', r.id)}
                  style={{ cursor: navigate ? 'pointer' : undefined }}
                >
                  <td>{r.testTitle || r.testId}</td>
                  <td>
                    <div>{r.userName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{r.userId !== r.userName ? r.userId : ''}</div>
                  </td>
                  <td>
                    <strong>{r.score}%</strong>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>
                      ({r.correctCount}/{r.totalQuestions})
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${r.passed ? 'pass' : 'fail'}`}>
                      <span className="badge-dot" />
                      {r.passed ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(r.submittedAt).toLocaleString('vi-VN', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

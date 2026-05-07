import { useState, useEffect } from 'react';
import { getAllResults } from '../data/resultStore.js';

export default function Results() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(getAllResults().slice().reverse()); // newest first
  }, []);

  if (rows.length === 0) {
    return (
      <div className="results-empty">
        No results yet. Publish a test and have sellers take it.
      </div>
    );
  }

  return (
    <div className="results-table-wrap">
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
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.testTitle || r.testId}</td>
              <td>
                <div>{r.userName}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{r.userId}</div>
              </td>
              <td>
                <strong>{r.score}%</strong>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>
                  ({r.correctCount}/{r.totalQuestions})
                </span>
              </td>
              <td>
                <span className={`badge ${r.passed ? 'published' : 'archived'}`}>
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
    </div>
  );
}

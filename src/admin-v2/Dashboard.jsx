import { useMemo } from 'react';
import { getAllResults } from '../data/resultStore.js';
import { getAllStoredTests } from '../data/testStore.js';
import { getTestMetrics, getUserMetrics, getDashboardSummary } from '../data/analytics.js';

function StatCard({ label, value, sub }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-value">{value}</div>
      <div className="dash-stat-label">{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function RateBar({ pct, pass }) {
  const color = pass ? 'var(--accent-green)' : 'var(--accent-red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--ink-150)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width .3s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 34, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

export default function Dashboard() {
  const results     = useMemo(() => getAllResults(), []);
  const storedTests = useMemo(() => getAllStoredTests(), []);
  const testMetrics = useMemo(() => getTestMetrics(results), [results]);
  const userMetrics = useMemo(() => getUserMetrics(results), [results]);
  const summary     = useMemo(
    () => getDashboardSummary(results, storedTests.length),
    [results, storedTests]
  );

  const hasData = results.length > 0;

  return (
    <div className="dash-outer">
      {/* Summary stat cards */}
      <div>
        <div className="dash-section-title">Overview</div>
        <div className="dash-stats-row">
          <StatCard
            label="Tests in store"
            value={summary.totalPublishedTests}
            sub={summary.totalPublishedTests === 0 ? 'Publish a test to get started' : undefined}
          />
          <StatCard
            label="Total attempts"
            value={summary.totalAttempts}
            sub={summary.totalAttempts === 0 ? 'No submissions yet' : undefined}
          />
          <StatCard
            label="Overall pass rate"
            value={hasData ? `${summary.overallPassRate}%` : '—'}
            sub={hasData ? `${results.filter(r => r.passed).length} passed / ${results.length} total` : undefined}
          />
        </div>
      </div>

      {/* Hardest / Easiest */}
      {hasData && (summary.hardestTests.length > 0 || summary.easiestTests.length > 0) && (
        <div>
          <div className="dash-section-title">Pass rate extremes</div>
          <div className="dash-split">
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent-red)', marginBottom: 8 }}>
                Hardest tests
              </div>
              <div className="dash-rank-list">
                {summary.hardestTests.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Not enough data</div>
                ) : summary.hardestTests.map((t, i) => (
                  <div key={t.testId} className="dash-rank-item">
                    <span className="dash-rank-num">{i + 1}</span>
                    <span className="dash-rank-name" title={t.testTitle}>{t.testTitle}</span>
                    <div style={{ minWidth: 120 }}>
                      <RateBar pct={t.passRate} pass={false} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)', flexShrink: 0 }}>
                      {t.totalAttempts} att.
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent-green)', marginBottom: 8 }}>
                Easiest tests
              </div>
              <div className="dash-rank-list">
                {summary.easiestTests.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Not enough data</div>
                ) : summary.easiestTests.map((t, i) => (
                  <div key={t.testId} className="dash-rank-item">
                    <span className="dash-rank-num">{i + 1}</span>
                    <span className="dash-rank-name" title={t.testTitle}>{t.testTitle}</span>
                    <div style={{ minWidth: 120 }}>
                      <RateBar pct={t.passRate} pass={true} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)', flexShrink: 0 }}>
                      {t.totalAttempts} att.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test metrics table */}
      <div>
        <div className="dash-section-title">Per-test metrics</div>
        {testMetrics.length === 0 ? (
          <div className="results-empty" style={{ padding: '24px 0' }}>
            No test data yet.
          </div>
        ) : (
          <div className="results-table-wrap" style={{ padding: 0 }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Attempts</th>
                  <th>Pass</th>
                  <th>Fail</th>
                  <th>Pass rate</th>
                  <th>Avg score</th>
                </tr>
              </thead>
              <tbody>
                {testMetrics.map((t) => (
                  <tr key={t.testId}>
                    <td>{t.testTitle}</td>
                    <td>{t.totalAttempts}</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{t.passCount}</td>
                    <td style={{ color: 'var(--accent-red)',   fontWeight: 600 }}>{t.failCount}</td>
                    <td style={{ minWidth: 140 }}>
                      <RateBar pct={t.passRate} pass={t.passRate >= 50} />
                    </td>
                    <td>
                      <strong>{t.avgScore}%</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User metrics table */}
      <div>
        <div className="dash-section-title">Per-user metrics</div>
        {userMetrics.length === 0 ? (
          <div className="results-empty" style={{ padding: '24px 0' }}>
            No user data yet.
          </div>
        ) : (
          <div className="results-table-wrap" style={{ padding: 0 }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Tests taken</th>
                  <th>Passed</th>
                  <th>Pass rate</th>
                  <th>Avg score</th>
                </tr>
              </thead>
              <tbody>
                {userMetrics.map((u) => (
                  <tr key={u.userId}>
                    <td>
                      <div>{u.userName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{u.userId !== u.userName ? u.userId : ''}</div>
                    </td>
                    <td>{u.totalTestsTaken}</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{u.passCount}</td>
                    <td style={{ minWidth: 140 }}>
                      <RateBar pct={u.passRate} pass={u.passRate >= 50} />
                    </td>
                    <td>
                      <strong>{u.averageScore}%</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

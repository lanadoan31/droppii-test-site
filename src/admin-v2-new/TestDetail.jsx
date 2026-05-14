import { useState, useMemo } from 'react';
import { getAllResults } from '../data/resultStore.js';
import { saveTest } from '../data/testStore.js';
import Icon from './icons.jsx';

function Pill({ status }) {
  const labels = { published: 'Published', draft: 'Draft', scheduled: 'Scheduled', archived: 'Archived' };
  return (
    <span className={`badge ${status}`}>
      <span className="badge-dot" />
      {labels[status] || status}
    </span>
  );
}

function StatCard({ icon, iconClass, label, value }) {
  return (
    <div className="stat">
      <div className="stat-label">
        <span className={`stat-icon ${iconClass || ''}`}>
          <Icon name={icon} size={14} />
        </span>
        {label}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function AvailCard({ availability, onEdit }) {
  const isWindow = availability?.type === 'window';
  function fmt(s) {
    return new Date(s).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  }
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-pad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0,
            background: isWindow ? 'color-mix(in srgb, var(--accent-blue) 12%, transparent)' : 'var(--surface-2)',
            color: isWindow ? 'var(--accent-blue)' : 'var(--text-muted)',
          }}>
            <Icon name={isWindow ? 'clock' : 'globe'} size={18} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Availability
            </div>
            {isWindow ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Scheduled window</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
                  {fmt(availability.opens)} → {fmt(availability.closes)}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Always open</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
                  Takers can take this test any time.
                </div>
              </>
            )}
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onEdit}>
          <Icon name="edit" size={13} /> Edit schedule
        </button>
      </div>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────
function OverviewTab({ test, results, navigate, onViewAll }) {
  const recent = useMemo(
    () => [...results].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5),
    [results]
  );
  const passCount = results.filter((r) => r.passed).length;

  return (
    <div>
      <div className="stats-grid">
        <StatCard icon="users"  iconClass="blue"   label="Attempts"   value={test.attempts.toLocaleString()} />
        <StatCard icon="target" iconClass="green"  label="Avg score"  value={test.attempts > 0 ? `${test.avgScore}` : '—'} />
        <StatCard icon="award"  iconClass="yellow" label="Pass rate"   value={test.attempts > 0 ? `${test.passRate}%` : '—'} />
        <StatCard icon="tests"                     label="Questions"  value={test.questions} />
      </div>

      <AvailCard availability={test.availability} onEdit={() => navigate('builder', test.id)} />

      <div className="grid-2">
        {/* Recent takers */}
        <div className="card">
          <div className="card-header">
            <h3>Recent takers</h3>
            <button className="btn btn-ghost btn-sm" onClick={onViewAll}>
              View all <Icon name="chevRight" size={12} />
            </button>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '20px 20px', color: 'var(--text-faint)', fontSize: 13 }}>
              No submissions yet.
            </div>
          ) : (
            <table className="data">
              <thead>
                <tr>
                  <th>Taker</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.userName}</td>
                    <td className="num"><strong>{r.score}</strong>/100</td>
                    <td>
                      <span className={`badge ${r.passed ? 'pass' : 'fail'}`}>
                        <span className="badge-dot" />
                        {r.passed ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      {new Date(r.submittedAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Performance summary */}
        <div className="card">
          <div className="card-header"><h3>Performance summary</h3></div>
          <div className="card-pad">
            {results.length === 0 ? (
              <div style={{ color: 'var(--text-faint)', fontSize: 13 }}>No data yet.</div>
            ) : (
              <div className="row" style={{ gap: 24 }}>
                <div
                  className="score-ring lg"
                  style={{ '--pct': test.passRate, '--color': test.passRate >= 70 ? 'var(--accent-green)' : 'var(--accent-red)' }}
                >
                  <span>{test.passRate}%</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Pass rate</div>
                  <div style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6 }}>
                    <strong>{passCount}</strong> of <strong>{results.length}</strong> takers passed
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 8 }}>
                    Avg score: <strong>{test.avgScore}/100</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Questions Tab ───────────────────────────────────────
function QuestionsTab({ test, navigate }) {
  const questions = test.questionsList || [];
  const TYPE_LABEL = {
    'multiple-choice': 'Multiple choice',
    'multi-select':    'Multi-select',
    'true-false':      'True / False',
    'short-answer':    'Short answer',
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Questions in this test</h3>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('builder', test.id)}>
          <Icon name="edit" size={13} /> Open builder
        </button>
      </div>
      {questions.length === 0 ? (
        <div style={{ padding: '24px 20px', color: 'var(--text-faint)', fontSize: 13 }}>
          No questions yet.{' '}
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('builder', test.id)}>
            Open builder to add some.
          </button>
        </div>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th>Question</th>
              <th>Type</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr key={q.id}>
                <td className="num">{i + 1}</td>
                <td style={{ maxWidth: 480 }}>{q.text}</td>
                <td>
                  <span className="badge">{TYPE_LABEL[q.type] || q.type}</span>
                </td>
                <td className="num">{q.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Results Tab ─────────────────────────────────────────
function ResultsTab({ results }) {
  const [sortBy, setSortBy] = useState('date-desc');

  const sorted = useMemo(() => {
    const rows = [...results];
    switch (sortBy) {
      case 'date-asc':   rows.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)); break;
      case 'date-desc':  rows.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)); break;
      case 'score-high': rows.sort((a, b) => b.score - a.score); break;
      case 'score-low':  rows.sort((a, b) => a.score - b.score); break;
    }
    return rows;
  }, [results, sortBy]);

  return (
    <div className="card">
      <div className="card-header">
        <h3>All takers <span className="tab-count" style={{ marginLeft: 6 }}>{results.length}</span></h3>
        <select className="select" style={{ width: 180 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="score-high">Score: high → low</option>
          <option value="score-low">Score: low → high</option>
        </select>
      </div>
      {sorted.length === 0 ? (
        <div style={{ padding: '24px 20px', color: 'var(--text-faint)', fontSize: 13 }}>
          No results for this test yet.
        </div>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Taker</th>
              <th>Score</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.userName}</div>
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
                  {new Date(r.submittedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────
function SettingsTab({ test, setTests, showToast, navigate }) {
  const [duration,     setDuration]     = useState(String(test.duration));
  const [passingScore, setPassingScore] = useState(String(test.passingScore));

  function handleSave(e) {
    e.preventDefault();
    const dur = Math.max(1, parseInt(duration, 10) || test.duration);
    const ps  = Math.min(100, Math.max(1, parseInt(passingScore, 10) || test.passingScore));
    setTests((prev) =>
      prev.map((t) =>
        t.id === test.id ? { ...t, duration: dur, passingScore: ps, updatedAt: 'just now' } : t
      )
    );
    showToast('Settings saved');
  }

  const isWindow = test.availability?.type === 'window';
  function fmtDt(s) {
    return new Date(s).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  }

  return (
    <div className="card">
      <div className="card-pad" style={{ maxWidth: 640 }}>
        <h3 style={{ marginTop: 0, marginBottom: 4 }}>Test configuration</h3>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 0', fontSize: 13.5 }}>
          Control how takers interact with this test.
        </p>
        <div className="divider" style={{ margin: '16px 0' }} />
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="field">
              <label className="field-label">Time limit (minutes)</label>
              <input
                className="input"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Passing score (%)</label>
              <input
                className="input"
                type="number"
                min="1"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Availability</label>
            <div style={{ fontSize: 13.5, color: 'var(--ink-700)', marginBottom: 8 }}>
              {isWindow
                ? `Scheduled: ${fmtDt(test.availability.opens)} → ${fmtDt(test.availability.closes)}`
                : 'Always open'}
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('builder', test.id)}>
              <Icon name="edit" size={13} /> Edit in builder
            </button>
          </div>

          <div className="divider" style={{ margin: '20px 0 16px' }} />
          <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn btn-ghost"
              onClick={() => { setDuration(String(test.duration)); setPassingScore(String(test.passingScore)); }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Icon name="save" size={14} /> Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────
export default function TestDetail({ tests, setTests, testId, navigate, showToast }) {
  const test = tests.find((t) => t.id === testId);
  const [tab, setTab] = useState('overview');
  const results = useMemo(
    () => getAllResults().filter((r) => r.testId === testId),
    [testId]
  );

  if (!test) {
    return (
      <div className="content">
        <div className="coming-soon">Test not found</div>
      </div>
    );
  }

  async function togglePublish() {
    const newStatus = test.status === 'published' ? 'draft' : 'published';
    const updated = { ...test, status: newStatus, updatedAt: 'just now' };
    try {
      const saved = await saveTest(updated);
      setTests((prev) => prev.map((t) => (t.id === test.id ? saved : t)));
      showToast(newStatus === 'published' ? 'Test published' : 'Test unpublished');
    } catch (err) {
      console.error(err);
      showToast('Could not update publish status — check console');
    }
  }

  return (
    <div className="content" style={{ animation: 'v2SlideUp .2s ease' }}>
      {/* Back */}
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('tests')}>
          <Icon name="chevLeft" size={13} /> Back to tests
        </button>
      </div>

      {/* Page header */}
      <div className="page-header">
        <div style={{ minWidth: 0 }}>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <Pill status={test.status} />
            <span className="badge brand">{test.category}</span>
          </div>
          <h1 className="page-title">{test.title}</h1>
          <p className="page-sub">
            {test.questions} questions · {test.duration} min · Updated {test.updatedAt}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => navigate('builder', test.id)}>
            <Icon name="edit" size={14} /> Edit
          </button>
          <button
            className={`btn ${test.status === 'published' ? 'btn-secondary' : 'btn-primary'}`}
            onClick={togglePublish}
          >
            {test.status === 'published'
              ? <><Icon name="x" size={14} /> Unpublish</>
              : <><Icon name="upload" size={14} /> Publish</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'overview'  ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`tab ${tab === 'questions' ? 'active' : ''}`} onClick={() => setTab('questions')}>
          Questions <span className="tab-count">{test.questions}</span>
        </button>
        <button className={`tab ${tab === 'results'   ? 'active' : ''}`} onClick={() => setTab('results')}>
          Results <span className="tab-count">{results.length}</span>
        </button>
        <button className={`tab ${tab === 'settings'  ? 'active' : ''}`} onClick={() => setTab('settings')}>Settings</button>
      </div>

      {tab === 'overview'  && <OverviewTab  test={test} results={results} navigate={navigate} onViewAll={() => setTab('results')} />}
      {tab === 'questions' && <QuestionsTab test={test} navigate={navigate} />}
      {tab === 'results'   && <ResultsTab  results={results} />}
      {tab === 'settings'  && <SettingsTab test={test} setTests={setTests} showToast={showToast} navigate={navigate} />}
    </div>
  );
}

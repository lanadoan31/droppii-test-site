import { useMemo } from 'react';
import { getAllResults } from '../data/resultStore.js';
import Icon from './icons.jsx';

// ─── Question review helpers ──────────────────────────────

function OptionRow({ text, isCorrect, isChosen }) {
  let bg = 'transparent';
  let border = 'var(--border)';
  let color = 'var(--text)';

  if (isCorrect) { bg = '#F0FAF4'; border = 'var(--accent-green)'; color = 'var(--ink-800)'; }
  else if (isChosen) { bg = '#FEF0F0'; border = 'var(--accent-red)'; color = 'var(--ink-800)'; }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px', marginBottom: 6,
      border: `1px solid ${border}`, borderRadius: 6,
      background: bg, color, fontSize: 13.5,
    }}>
      <span>{text}</span>
      <div className="row" style={{ gap: 6 }}>
        {isChosen && !isCorrect && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Your answer</span>
        )}
        {isChosen && isCorrect && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-green)' }}>Your answer</span>
        )}
        {isCorrect && <Icon name="check" size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />}
        {isChosen && !isCorrect && <Icon name="x" size={14} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />}
      </div>
    </div>
  );
}

function QuestionReview({ q, index, chosen }) {
  // chosen: array of chosen option letter-ids, or string for short-answer
  const isShort = q.type === 'short';
  const correct = q.correct || [];

  // Determine if question was answered correctly
  let gotRight = false;
  if (isShort) {
    gotRight = typeof chosen === 'string' && chosen.trim().length >= 30;
  } else {
    const chosenSorted   = [...(Array.isArray(chosen) ? chosen : [])].sort();
    const expectedSorted = [...correct].sort();
    gotRight = JSON.stringify(chosenSorted) === JSON.stringify(expectedSorted);
  }

  return (
    <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
      <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
        {/* Correct / wrong indicator */}
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: gotRight ? '#E5F5EC' : '#FCE8E8',
          color: gotRight ? 'var(--accent-green)' : 'var(--accent-red)',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={gotRight ? 'check' : 'x'} size={15} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
            Question {index + 1}
            {q.points != null && ` · ${q.points} pt${q.points !== 1 ? 's' : ''}`}
            {' · '}{q.type === 'single' ? 'Multiple choice' : q.type === 'multi' ? 'Multi-select' : q.type === 'short' ? 'Short answer' : q.type}
          </div>
          <div style={{ fontWeight: 600, marginBottom: 10, color: 'var(--ink-900)', lineHeight: 1.4 }}>
            {q.prompt}
          </div>

          {isShort ? (
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Taker's answer
              </div>
              <div style={{
                padding: '8px 12px', borderRadius: 6, fontSize: 13.5,
                border: `1px solid ${gotRight ? 'var(--accent-green)' : 'var(--border)'}`,
                background: gotRight ? '#F0FAF4' : 'var(--surface-2)',
                color: 'var(--ink-800)',
              }}>
                {chosen || <span style={{ color: 'var(--text-faint)', fontStyle: 'italic' }}>No answer provided</span>}
              </div>
              {q.sample && (
                <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-muted)' }}>
                  <strong>Expected:</strong> {q.sample}
                </div>
              )}
            </div>
          ) : (
            <div>
              {(q.options || []).map((opt) => {
                const isCorrect = correct.includes(opt.id);
                const isChosen  = Array.isArray(chosen) && chosen.includes(opt.id);
                return (
                  <OptionRow
                    key={opt.id}
                    text={opt.text}
                    isCorrect={isCorrect}
                    isChosen={isChosen}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────

export default function TakerResult({ resultId, navigate }) {
  const result = useMemo(
    () => getAllResults().find((r) => r.id === resultId) ?? null,
    [resultId]
  );

  if (!result) {
    return (
      <div className="content">
        <div className="coming-soon">Result not found</div>
      </div>
    );
  }

  const {
    userName, userId, testTitle,
    score, passed, correctCount, totalQuestions,
    submittedAt, answers = {}, questions = [],
  } = result;

  const incorrectCount = totalQuestions - correctCount;
  const hasReview = questions.length > 0;

  return (
    <div className="content" style={{ animation: 'v2SlideUp .2s ease' }}>
      {/* Back */}
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('results')}>
          <Icon name="chevLeft" size={13} /> Back to results
        </button>
      </div>

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{userName}</h1>
          <p className="page-sub">
            {userId !== userName ? `${userId} · ` : ''}{testTitle}
          </p>
        </div>
        <div className="page-actions">
          <span className={`badge ${passed ? 'pass' : 'fail'}`} style={{ fontSize: 13, padding: '5px 12px' }}>
            <span className="badge-dot" />
            {passed ? 'Passed' : 'Failed'}
          </span>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Score ring card */}
        <div className="card card-pad">
          <div className="row" style={{ gap: 24 }}>
            <div
              className="score-ring lg"
              style={{ '--pct': score, '--color': passed ? 'var(--accent-green)' : 'var(--accent-red)' }}
            >
              <span>{score}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ marginBottom: 8, gap: 8 }}>
                <span className={`badge ${passed ? 'pass' : 'fail'}`} style={{ fontSize: 12, padding: '3px 10px' }}>
                  <span className="badge-dot" />{passed ? 'Passed' : 'Failed'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pass mark: {result.passingScore ?? 70}%</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 4 }}>
                {testTitle}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Submitted {new Date(submittedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown cards */}
        <div className="card card-pad">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-800)', marginBottom: 16 }}>
            Performance breakdown
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-green)' }}>{correctCount}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Correct</div>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-red)' }}>{incorrectCount}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Incorrect</div>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink-700)' }}>{totalQuestions}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Question-by-question review */}
      <div className="card">
        <div className="card-header">
          <h3>Question-by-question review</h3>
        </div>
        {!hasReview ? (
          <div style={{ padding: '24px 20px', color: 'var(--text-faint)', fontSize: 13 }}>
            Detailed review not available for this result — only new submissions include per-question data.
          </div>
        ) : (
          <div>
            {questions.map((q, i) => (
              <QuestionReview
                key={q.id ?? i}
                q={q}
                index={i}
                chosen={answers[q.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import Icon from './icons.jsx';
import { CATEGORIES, INITIAL_QUESTION_BANK } from './data-v2.js';
import { getDraft, saveDraft } from './builderDraft.js';
import { normalizeQuestion, validateQuestion, validateForPublish } from './testExport.js';
import { saveTest } from '../data/testStore.js';

const TYPE_LABELS = {
  'multiple-choice': 'Multiple choice',
  'multi-select':    'Multi-select',
  'true-false':      'True / False',
  'short-answer':    'Short answer',
};

function newQuestion(type = 'multiple-choice') {
  const id = 'bq' + Date.now() + Math.random().toString(36).slice(2, 6);
  return normalizeQuestion({ id, type });
}

function Pill({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`badge ${status}`}><span className="badge-dot" />{label}</span>;
}

// ── Option row ──────────────────────────────────────────────────────────────────
function OptionRow({ option, index, isCorrect, type, onToggleCorrect, onChange, onRemove, canRemove }) {
  const isMulti = type === 'multi-select';
  return (
    <div className="option-row">
      <button
        type="button"
        className={`opt-correct ${isMulti ? 'checkbox' : 'radio'}${isCorrect ? ' active' : ''}`}
        onClick={() => onToggleCorrect(index)}
        aria-label={isCorrect ? 'Correct answer' : 'Mark as correct'}
        title={isCorrect ? 'Correct answer' : 'Mark as correct'}
      >
        {isCorrect && <Icon name="check" size={10} strokeWidth={3} />}
      </button>
      <input
        className="input opt-input"
        placeholder={`Option ${String.fromCharCode(65 + index)}`}
        value={option}
        onChange={(e) => onChange(index, e.target.value)}
        readOnly={type === 'true-false'}
      />
      {canRemove && (
        <button
          type="button"
          className="icon-btn"
          style={{ width: 28, height: 28, flexShrink: 0 }}
          onClick={() => onRemove(index)}
          aria-label="Remove option"
        >
          <Icon name="x" size={13} />
        </button>
      )}
    </div>
  );
}

// ── Question editor card ────────────────────────────────────────────────────────
function QuestionEditor({ q, index, onUpdate, onDelete }) {
  const errors = validateQuestion(q);
  const hasTextError  = errors.includes('empty-text');
  const hasCorrectError = errors.includes('no-correct');

  function toggleCorrect(idx) {
    if (q.type === 'multi-select') {
      const next = q.correct.includes(idx)
        ? q.correct.filter((i) => i !== idx)
        : [...q.correct, idx];
      onUpdate({ correct: next.length ? next : [idx] });
    } else {
      onUpdate({ correct: [idx] });
    }
  }

  function updateOption(idx, val) {
    const options = [...(q.options || [])];
    options[idx] = val;
    onUpdate({ options });
  }

  function removeOption(idx) {
    const options = (q.options || []).filter((_, i) => i !== idx);
    const correct = (q.correct || [])
      .filter((i) => i !== idx)
      .map((i) => (i > idx ? i - 1 : i));
    onUpdate({ options, correct: correct.length ? correct : [0] });
  }

  function addOption() {
    if ((q.options || []).length >= 6) return;
    onUpdate({ options: [...(q.options || []), ''] });
  }

  function changeType(newType) {
    onUpdate({ type: newType, ...normalizeQuestion({ ...q, type: newType }) });
  }

  return (
    <div className="q-card">
      <div className="q-card-head">
        <span className="q-num-large">{index + 1}</span>
        <select
          className="select q-type-sel"
          value={q.type}
          onChange={(e) => changeType(e.target.value)}
        >
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <label className="field-label" style={{ marginBottom: 0, fontSize: 12, whiteSpace: 'nowrap' }}>
            Points
          </label>
          <input
            className="input"
            type="number"
            min="1"
            max="10"
            value={q.points}
            onChange={(e) => onUpdate({ points: Math.max(1, Number(e.target.value) || 1) })}
            style={{ width: 60, marginBottom: 0 }}
          />
        </div>
        <button
          className="icon-btn btn-danger-subtle"
          onClick={onDelete}
          aria-label="Delete question"
          title="Delete question"
        >
          <Icon name="trash" size={15} />
        </button>
      </div>

      <div className="q-card-body">
        {/* Question text */}
        <div className="field">
          <label className="field-label">Question</label>
          <textarea
            className={`textarea${hasTextError ? ' input-error' : ''}`}
            placeholder="Enter your question…"
            value={q.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            style={{ minHeight: 80 }}
          />
          {hasTextError && (
            <div className="field-error">Question text is required.</div>
          )}
        </div>

        {/* Answer options */}
        {q.type !== 'short-answer' && (
          <div className="field">
            <label className="field-label">
              {q.type === 'multi-select'
                ? 'Options — select all correct answers'
                : 'Options — click the circle to mark correct'}
            </label>
            {(q.options || []).map((opt, i) => (
              <OptionRow
                key={i}
                option={opt}
                index={i}
                isCorrect={(q.correct || []).includes(i)}
                type={q.type}
                onToggleCorrect={toggleCorrect}
                onChange={updateOption}
                onRemove={removeOption}
                canRemove={q.type !== 'true-false' && (q.options || []).length > 2}
              />
            ))}
            {hasCorrectError && (
              <div className="field-error">Mark at least one correct answer.</div>
            )}
            {q.type !== 'true-false' && (q.options || []).length < 6 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: 4 }}
                onClick={addOption}
              >
                <Icon name="plus" size={13} /> Add option
              </button>
            )}
          </div>
        )}

        {/* Short-answer keywords */}
        {q.type === 'short-answer' && (
          <div className="field">
            <label className="field-label">
              Accepted keywords{' '}
              <span style={{ fontWeight: 400, color: 'var(--text-faint)' }}>(comma-separated)</span>
            </label>
            <input
              className="input"
              placeholder="e.g. 24 hours, 24h, one day"
              value={q.keywords || ''}
              onChange={(e) => onUpdate({ keywords: e.target.value })}
            />
            <div className="field-help">Auto-graded if the response contains any keyword.</div>
          </div>
        )}

        {/* Explanation */}
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label">
            Explanation{' '}
            <span style={{ fontWeight: 400, color: 'var(--text-faint)' }}>(optional)</span>
          </label>
          <textarea
            className="textarea"
            placeholder="Shown to takers after submission — explain why the answer is correct."
            value={q.explanation}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            style={{ minHeight: 60 }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Settings rail ───────────────────────────────────────────────────────────────
function SettingsRail({
  category, setCategory,
  duration, setDuration,
  passingScore, setPassingScore,
  maxAttempts, setMaxAttempts,
  availability, setAvailability,
  randomizeQuestions, setRandomizeQuestions,
  randomizeOptions, setRandomizeOptions,
  showCorrectAnswers, setShowCorrectAnswers,
  requireWebcam, setRequireWebcam,
  assignedUsers, setAssignedUsers,
}) {
  // Local raw text state so the textarea doesn't reset cursor while the user types
  const [rawAssigned, setRawAssigned] = useState(() =>
    Array.isArray(assignedUsers) ? assignedUsers.join(', ') : ''
  );

  function handleAssignedTextChange(e) {
    const raw = e.target.value;
    setRawAssigned(raw);
    const parsed = raw.split(',').map((s) => s.trim()).filter(Boolean);
    setAssignedUsers(parsed);
  }
  const isWindow = availability.type === 'window';
  const scoreNum = Number(passingScore);
  const scoreInvalid = isNaN(scoreNum) || scoreNum < 1 || scoreNum > 100;

  function fmtDt(val) {
    if (!val) return '';
    try {
      return new Date(val).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return val;
    }
  }

  return (
    <div className="settings-rail">
      <div className="rail-section">
        <div className="rail-section-title">Test settings</div>

        <div className="field">
          <label className="field-label">Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label">Time limit (min)</label>
            <input
              className="input"
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">Passing score (%)</label>
            <input
              className={`input${scoreInvalid ? ' input-error' : ''}`}
              type="number"
              min="1"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
            />
            {scoreInvalid && (
              <div className="field-error">Must be 1–100.</div>
            )}
          </div>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label">Max attempts</label>
          <select
            className="select"
            value={String(maxAttempts)}
            onChange={(e) =>
              setMaxAttempts(e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value))
            }
          >
            <option value="unlimited">Unlimited</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      <div className="rail-divider" />

      <div className="rail-section">
        <div className="rail-section-title">Availability</div>

        <div className="avail-toggle" style={{ marginBottom: 12 }}>
          <button
            type="button"
            className={`avail-btn${!isWindow ? ' active' : ''}`}
            onClick={() => setAvailability({ type: 'always' })}
          >
            Always open
          </button>
          <button
            type="button"
            className={`avail-btn${isWindow ? ' active' : ''}`}
            onClick={() =>
              setAvailability({
                type: 'window', opens: '', closes: '',
                tz: 'Asia/Ho_Chi_Minh', autoSubmitOnClose: false, reminder15min: true,
              })
            }
          >
            Scheduled
          </button>
        </div>

        {isWindow ? (
          <>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label" style={{ fontSize: 11.5 }}>Opens</label>
                <input
                  className="input"
                  type="datetime-local"
                  value={availability.opens || ''}
                  onChange={(e) => setAvailability((a) => ({ ...a, opens: e.target.value }))}
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label" style={{ fontSize: 11.5 }}>Closes</label>
                <input
                  className="input"
                  type="datetime-local"
                  value={availability.closes || ''}
                  onChange={(e) => setAvailability((a) => ({ ...a, closes: e.target.value }))}
                />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 10 }}>
              <label className="field-label" style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="globe" size={12} /> Timezone
              </label>
              <select
                className="select"
                value={availability.tz || 'Asia/Ho_Chi_Minh'}
                onChange={(e) => setAvailability((a) => ({ ...a, tz: e.target.value }))}
              >
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>

            <label className="check-row">
              <input
                type="checkbox"
                checked={availability.autoSubmitOnClose || false}
                onChange={(e) => setAvailability((a) => ({ ...a, autoSubmitOnClose: e.target.checked }))}
              />
              <span>Auto-submit when window closes</span>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={availability.reminder15min ?? true}
                onChange={(e) => setAvailability((a) => ({ ...a, reminder15min: e.target.checked }))}
              />
              <span>Send 15-min reminder to takers</span>
            </label>

            {availability.opens && availability.closes && (
              <div className="avail-callout">
                <Icon name="clock" size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{fmtDt(availability.opens)} &ndash; {fmtDt(availability.closes)}</span>
              </div>
            )}
          </>
        ) : (
          <p className="field-help" style={{ margin: 0 }}>
            Takers can attempt this test any time once published.
          </p>
        )}
      </div>

      <div className="rail-divider" />

      <div className="rail-section">
        <div className="rail-section-title">Behavior</div>

        <label className="check-row">
          <input type="checkbox" checked={randomizeQuestions} onChange={(e) => setRandomizeQuestions(e.target.checked)} />
          <span>Randomize question order</span>
        </label>
        <label className="check-row">
          <input type="checkbox" checked={randomizeOptions} onChange={(e) => setRandomizeOptions(e.target.checked)} />
          <span>Randomize option order</span>
        </label>
        <label className="check-row">
          <input type="checkbox" checked={showCorrectAnswers} onChange={(e) => setShowCorrectAnswers(e.target.checked)} />
          <span>Show correct answers after submit</span>
        </label>
        <label className="check-row">
          <input type="checkbox" checked={requireWebcam} onChange={(e) => setRequireWebcam(e.target.checked)} />
          <span>Require webcam during test</span>
        </label>
      </div>

      <div className="rail-divider" />

      <div className="rail-section">
        <div className="rail-section-title">Assignment</div>

        <label className="check-row" style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={assignedUsers === 'all'}
            onChange={(e) => {
              if (e.target.checked) {
                setAssignedUsers('all');
                setRawAssigned('');
              } else {
                setAssignedUsers([]);
              }
            }}
          />
          <span>Assign to all users</span>
        </label>

        {assignedUsers !== 'all' && (
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label">
              User names{' '}
              <span style={{ fontWeight: 400, color: 'var(--text-faint)' }}>(comma-separated)</span>
            </label>
            <textarea
              className={`textarea${assignedUsers !== 'all' && Array.isArray(assignedUsers) && assignedUsers.length === 0 ? ' input-error' : ''}`}
              placeholder="e.g. Nguyen Van A, Tran Thi B"
              value={rawAssigned}
              onChange={handleAssignedTextChange}
              style={{ minHeight: 64 }}
            />
            <div className="field-help">
              {Array.isArray(assignedUsers) && assignedUsers.length > 0
                ? `${assignedUsers.length} user${assignedUsers.length !== 1 ? 's' : ''} assigned.`
                : 'Enter at least one name to publish.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Preview modal ───────────────────────────────────────────────────────────────
// Uses the EXACT question data passed from Builder state — no transformation.
function PreviewModal({ questions, test, onClose }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  if (questions.length === 0) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
          <div className="modal-header">
            <div><h2>Preview</h2><p>No questions to preview yet.</p></div>
            <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
          </div>
          <div className="modal-body" style={{ paddingBottom: 8 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>Add questions to the test before previewing.</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  function selectAnswer(qId, idx, isMulti) {
    if (isMulti) {
      setAnswers((a) => {
        const prev = a[qId] || [];
        return { ...a, [qId]: prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx] };
      });
    } else {
      setAnswers((a) => ({ ...a, [qId]: idx }));
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        style={{ maxWidth: 600 }}
      >
        <div className="modal-header">
          <div>
            <h2 id="preview-title" style={{ fontSize: 16 }}>{test?.title || 'Preview'}</h2>
            <p>Question {current + 1} of {questions.length}</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
        </div>

        <div className="modal-body">
          <div className="preview-progress"><div style={{ width: `${progress}%` }} /></div>

          <p style={{ fontWeight: 600, marginTop: 16, marginBottom: 14, fontSize: 14.5 }}>
            {q.text || <em style={{ color: 'var(--text-faint)' }}>Untitled question</em>}
          </p>

          {q.type !== 'short-answer' && (q.options || []).map((opt, i) => {
            const sel = answers[q.id];
            const isSelected = q.type === 'multi-select'
              ? (Array.isArray(sel) && sel.includes(i))
              : sel === i;
            return (
              <div
                key={i}
                className={`preview-option${isSelected ? ' selected' : ''}`}
                onClick={() => selectAnswer(q.id, i, q.type === 'multi-select')}
              >
                <span
                  className={`opt-correct ${q.type === 'multi-select' ? 'checkbox' : 'radio'}${isSelected ? ' active' : ''}`}
                  aria-hidden="true"
                >
                  {isSelected && <Icon name="check" size={10} strokeWidth={3} />}
                </span>
                {opt || <span style={{ color: 'var(--text-faint)' }}>Option {String.fromCharCode(65 + i)}</span>}
              </div>
            );
          })}

          {q.type === 'short-answer' && (
            <textarea
              className="textarea"
              placeholder="Type your answer here…"
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              style={{ minHeight: 80 }}
            />
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            Previous
          </button>
          {current < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setCurrent((c) => c + 1)}>Next</button>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bank picker modal ───────────────────────────────────────────────────────────
function BankPickerModal({ onAdd, onClose }) {
  const [selected, setSelected] = useState(new Set());

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleAdd() {
    const qs = INITIAL_QUESTION_BANK
      .filter((b) => selected.has(b.id))
      .map((b) => {
        const type = ['fill-blank', 'matching'].includes(b.type) ? 'short-answer' : b.type;
        return normalizeQuestion({ id: 'bq' + Date.now() + Math.random().toString(36).slice(2, 5), type, text: b.text });
      });
    onAdd(qs);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-title"
        style={{ maxWidth: 640 }}
      >
        <div className="modal-header">
          <div>
            <h2 id="bank-title">Question bank</h2>
            <p>Select questions to add to this test.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
        </div>

        <div className="modal-body">
          <div className="bank-list">
            {INITIAL_QUESTION_BANK.map((q) => (
              <div
                key={q.id}
                className={`bank-item${selected.has(q.id) ? ' selected' : ''}`}
                onClick={() => toggle(q.id)}
              >
                <span className={`opt-correct checkbox${selected.has(q.id) ? ' active' : ''}`} aria-hidden="true">
                  {selected.has(q.id) && <Icon name="check" size={10} strokeWidth={3} />}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{q.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge brand" style={{ fontSize: 10.5 }}>{q.category}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{TYPE_LABELS[q.type] || q.type}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{q.difficulty}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>
                      Used in {q.usedInCount} test{q.usedInCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={selected.size === 0} onClick={handleAdd}>
            Add {selected.size > 0 ? `${selected.size} ` : ''}question{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Builder (main component) ────────────────────────────────────────────────────
export default function Builder({ tests, setTests, testId, navigate, showToast }) {
  const test = tests.find((t) => t.id === testId);

  // Initialize from persistent draft (survives navigation) or test data.
  // All state is seeded once — subsequent updates stay in local state until Save.
  const [questions, setQuestions] = useState(() => {
    const d = getDraft(testId);
    return (d?.questions || test?.questionsList || []).map(normalizeQuestion);
  });
  const [activeId, setActiveId] = useState(() => {
    const d = getDraft(testId);
    const qs = d?.questions || test?.questionsList || [];
    const id = d?.activeId || qs[0]?.id || null;
    return qs.some((q) => q.id === id) ? id : (qs[0]?.id || null);
  });
  const [title,              setTitle]              = useState(() => { const d = getDraft(testId); return (d ?? test)?.title ?? ''; });
  const [category,           setCategory]           = useState(() => { const d = getDraft(testId); return (d ?? test)?.category ?? 'Onboarding'; });
  const [duration,           setDuration]           = useState(() => { const d = getDraft(testId); return (d ?? test)?.duration ?? 30; });
  const [passingScore,       setPassingScore]       = useState(() => { const d = getDraft(testId); return (d ?? test)?.passingScore ?? 70; });
  const [maxAttempts,        setMaxAttempts]        = useState(() => { const d = getDraft(testId); return (d ?? test)?.maxAttempts ?? 'unlimited'; });
  const [availability,       setAvailability]       = useState(() => { const d = getDraft(testId); return (d ?? test)?.availability ?? { type: 'always' }; });
  const [randomizeQuestions, setRandomizeQuestions] = useState(() => { const d = getDraft(testId); return (d ?? test)?.randomizeQuestions ?? true; });
  const [randomizeOptions,   setRandomizeOptions]   = useState(() => { const d = getDraft(testId); return (d ?? test)?.randomizeOptions ?? true; });
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(() => { const d = getDraft(testId); return (d ?? test)?.showCorrectAnswers ?? true; });
  const [requireWebcam,      setRequireWebcam]      = useState(() => { const d = getDraft(testId); return (d ?? test)?.requireWebcam ?? false; });
  const [assignedUsers,      setAssignedUsers]      = useState(() => { const d = getDraft(testId); return (d ?? test)?.assignedUsers ?? 'all'; });
  const [modal,              setModal]              = useState(null);

  // Persist draft on navigation away. Ref always holds latest state — safe in cleanup.
  const draftRef = useRef(null);
  draftRef.current = {
    testId, questions, activeId, title, category, duration, passingScore,
    maxAttempts, availability, randomizeQuestions, randomizeOptions,
    showCorrectAnswers, requireWebcam, assignedUsers,
  };
  useEffect(() => {
    return () => { if (draftRef.current) saveDraft(draftRef.current.testId, draftRef.current); };
  }, []); // intentionally empty — cleanup runs on unmount only

  if (!test) {
    return (
      <div className="content">
        <div className="coming-soon">Test not found</div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('tests')}>
            ← Back to tests
          </button>
        </div>
      </div>
    );
  }

  const activeQ   = questions.find((q) => q.id === activeId);
  const activeIdx = questions.findIndex((q) => q.id === activeId);

  function addQuestion(type = 'multiple-choice') {
    const q = newQuestion(type);
    setQuestions((prev) => [...prev, q]);
    setActiveId(q.id);
  }

  function updateActive(patch) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === activeId ? { ...q, ...patch } : q))
    );
  }

  function deleteQuestion(id) {
    setQuestions((prev) => {
      const next = prev.filter((q) => q.id !== id);
      if (id === activeId) {
        setActiveId(next.length ? next[Math.min(activeIdx, next.length - 1)].id : null);
      }
      return next;
    });
  }

  function moveQuestion(id, dir) {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }

  function addFromBank(qs) {
    setQuestions((prev) => [...prev, ...qs]);
    if (qs.length > 0) setActiveId(qs[qs.length - 1].id);
  }

  async function save(newStatus) {
    if (newStatus === 'published' || newStatus === 'scheduled') {
      if (!questions || questions.length === 0) {
        showToast('You must add at least 1 question before publishing');
        return;
      }
    }
    if (newStatus === 'published') {
      const errors = validateForPublish(questions, passingScore, assignedUsers);
      if (errors.length > 0) { showToast(errors[0]); return; }
    }
    if (newStatus === 'scheduled') {
      const errors = validateForPublish(questions, passingScore, assignedUsers);
      if (errors.length > 0) { showToast(errors[0]); return; }
      if (availability.type !== 'window' || !availability.opens || !availability.closes) {
        showToast('Set opens and closes times in Availability before scheduling.');
        return;
      }
      if (new Date(availability.opens) >= new Date(availability.closes)) {
        showToast('Opens time must be before closes time.');
        return;
      }
    }

    const scoreNum = Math.max(1, Math.min(100, Number(passingScore) || 70));
    const durNum   = Math.max(1, Math.min(180, Number(duration) || 30));

    const patch = {
      title:              title.trim() || test.title,
      category,
      duration:           durNum,
      passingScore:       scoreNum,
      maxAttempts,
      availability,
      randomizeQuestions,
      randomizeOptions,
      showCorrectAnswers,
      requireWebcam,
      assignedUsers,
      questions:          questions.length,
      questionsList:      questions,
      updatedAt:          'just now',
    };
    if (newStatus) patch.status = newStatus;

    const updatedTest = { ...test, ...patch };
    setTests((prev) => prev.map((t) => (t.id === testId ? updatedTest : t)));

    try {
      await saveTest(updatedTest);
    } catch (err) {
      showToast('Error saving to Supabase — check console');
      return;
    }

    const TOAST = {
      published: 'Test published',
      scheduled: 'Test scheduled',
      archived:  'Test archived',
      draft:     'Moved to draft',
    };
    showToast(TOAST[newStatus] || 'Draft saved');
  }

  const isActive      = test.status === 'published' || test.status === 'scheduled';
  const isArchived    = test.status === 'archived';
  const canPublish    = questions.length > 0;
  const invalidCount  = questions.filter((q) => validateQuestion(q).length > 0).length;

  // Label and target status for the primary action button
  const primaryLabel = test.status === 'published' ? 'Unpublish'
    : test.status === 'scheduled' ? 'Unschedule'
    : test.status === 'archived'  ? 'Restore'
    : availability.type === 'window' ? 'Schedule'
    : 'Publish';
  const primaryTarget = isActive ? 'draft'
    : isArchived ? 'draft'
    : availability.type === 'window' ? 'scheduled'
    : 'published';

  return (
    <div className="builder-outer">
      {/* Sub-header */}
      <div className="builder-header">
        <button className="icon-btn" onClick={() => navigate('tests')} title="Back to tests" aria-label="Back to tests">
          <Icon name="chevLeft" size={18} />
        </button>

        <input
          className="builder-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Test title"
        />

        <Pill status={test.status} />

        <span className="builder-q-count">
          {questions.length} question{questions.length !== 1 ? 's' : ''}
          {invalidCount > 0 && (
            <span className="builder-warn-badge" title={`${invalidCount} question${invalidCount !== 1 ? 's' : ''} need attention`}>
              {invalidCount}
            </span>
          )}
        </span>

        <div style={{ flex: 1 }} />

        <button className="btn btn-secondary btn-sm" onClick={() => setModal('preview')}>
          <Icon name="eye" size={13} /> Preview
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => save(null)}>
          Save draft
        </button>
        {!isArchived && (
          <button className="btn btn-secondary btn-sm" onClick={() => save('archived')}>
            Archive
          </button>
        )}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => save(primaryTarget)}
          disabled={!isActive && !isArchived && !canPublish}
          title={!isActive && !isArchived && !canPublish ? 'Add at least one question first' : undefined}
        >
          {primaryLabel}
        </button>
      </div>

      {/* 3-pane body */}
      <div className="builder-body">
        {/* Left pane: question list */}
        <div className="builder-pane">
          <div className="pane-header">
            <span style={{ fontWeight: 600, fontSize: 13 }}>Questions</span>
            <span className="nav-badge" style={{ marginLeft: 'auto' }}>{questions.length}</span>
          </div>

          <div className="q-list">
            {questions.length === 0 && (
              <div style={{ padding: '20px 14px', color: 'var(--text-faint)', fontSize: 12.5, textAlign: 'center' }}>
                No questions yet — add one below.
              </div>
            )}
            {questions.map((q, i) => {
              const qErrors = validateQuestion(q);
              return (
                <div
                  key={q.id}
                  className={`q-list-item${activeId === q.id ? ' active' : ''}`}
                  onClick={() => setActiveId(q.id)}
                >
                  <span className="q-num">{i + 1}</span>
                  <span className="q-list-text">
                    {q.text || <span style={{ color: 'var(--text-faint)', fontStyle: 'italic' }}>Untitled</span>}
                  </span>
                  {qErrors.length > 0 && (
                    <span className="q-error-dot" aria-label="Needs attention" title="Question has missing required fields" />
                  )}
                  <div className="q-list-actions">
                    <button
                      className="icon-btn q-move-btn"
                      style={{ width: 22, height: 22 }}
                      onClick={(e) => { e.stopPropagation(); moveQuestion(q.id, -1); }}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      <Icon name="chevLeft" size={11} style={{ transform: 'rotate(90deg)' }} />
                    </button>
                    <button
                      className="icon-btn q-move-btn"
                      style={{ width: 22, height: 22 }}
                      onClick={(e) => { e.stopPropagation(); moveQuestion(q.id, 1); }}
                      disabled={i === questions.length - 1}
                      aria-label="Move down"
                    >
                      <Icon name="chevLeft" size={11} style={{ transform: 'rotate(-90deg)' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pane-add-section">
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginBottom: 6 }}
              onClick={() => addQuestion('multiple-choice')}
            >
              <Icon name="plus" size={13} /> New question
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginBottom: 14 }}
              onClick={() => setModal('bank')}
            >
              <Icon name="bank" size={13} /> From bank
            </button>
            <div className="add-type-label">Add by type</div>
            <div className="add-type-grid">
              {Object.entries(TYPE_LABELS).map(([type, label]) => (
                <button key={type} className="add-type-btn" onClick={() => addQuestion(type)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center pane: editor */}
        <div className="builder-canvas">
          {!activeQ && (
            <div className="builder-empty">
              <div className="empty-icon"><Icon name="tests" size={22} /></div>
              <div style={{ fontWeight: 600, color: 'var(--ink-800)', marginBottom: 6 }}>No question selected</div>
              <div style={{ fontSize: 13 }}>Add a question from the left panel to start editing.</div>
            </div>
          )}
          {activeQ && (
            <QuestionEditor
              q={activeQ}
              index={activeIdx}
              onUpdate={updateActive}
              onDelete={() => deleteQuestion(activeId)}
            />
          )}
        </div>

        {/* Right pane: settings */}
        <SettingsRail
          category={category}           setCategory={setCategory}
          duration={duration}           setDuration={setDuration}
          passingScore={passingScore}   setPassingScore={setPassingScore}
          maxAttempts={maxAttempts}     setMaxAttempts={setMaxAttempts}
          availability={availability}   setAvailability={setAvailability}
          randomizeQuestions={randomizeQuestions} setRandomizeQuestions={setRandomizeQuestions}
          randomizeOptions={randomizeOptions}     setRandomizeOptions={setRandomizeOptions}
          showCorrectAnswers={showCorrectAnswers} setShowCorrectAnswers={setShowCorrectAnswers}
          requireWebcam={requireWebcam}           setRequireWebcam={setRequireWebcam}
          assignedUsers={assignedUsers}           setAssignedUsers={setAssignedUsers}
        />
      </div>

      {modal === 'preview' && (
        <PreviewModal questions={questions} test={{ ...test, title }} onClose={() => setModal(null)} />
      )}
      {modal === 'bank' && (
        <BankPickerModal onAdd={addFromBank} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

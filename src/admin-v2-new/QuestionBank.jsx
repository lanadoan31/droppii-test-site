import { useState, useEffect, useMemo } from 'react';
import Icon from './icons.jsx';
import {
  QUESTION_CATEGORIES,
  DEFAULT_QUESTION_CATEGORY,
  canonicalQuestionCategory,
} from '../data/questionBankCategories.js';
import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  formatQuestionStoreError,
} from '../data/questionStore.js';
import { saveTest } from '../data/testStore.js';
import { normalizeQuestion } from './testExport.js';

const TYPE_LABELS = {
  'multiple-choice': 'Multiple choice',
  'multi-select':    'Multi-select',
  'true-false':      'True / False',
  'short-answer':    'Short answer',
};

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

function normalizeDifficulty(v) {
  const x = String(v ?? 'medium').trim().toLowerCase();
  return x === 'easy' || x === 'hard' || x === 'medium' ? x : 'medium';
}

function difficultyBadgeClass(level) {
  const k = normalizeDifficulty(level);
  if (k === 'easy') return 'badge diff-easy';
  if (k === 'hard') return 'badge diff-hard';
  return 'badge diff-medium';
}

function difficultyLabel(level) {
  const k = normalizeDifficulty(level);
  return DIFFICULTY_OPTIONS.find((o) => o.value === k)?.label || 'Medium';
}

function typeDefaults(type) {
  if (type === 'true-false')   return { options: ['True', 'False'], correct: [0] };
  if (type === 'short-answer') return { options: [], correct: [] };
  return { options: ['', '', '', ''], correct: [0] };
}

function blankQuestion() {
  return {
    id: null,
    text: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correct: [0],
    category: DEFAULT_QUESTION_CATEGORY,
    difficultyLevel: 'medium',
  };
}

// ── Question form ─────────────────────────────────────────────────────────────
function QuestionForm({ initial, onSave, onDelete, onCancel, showToast, saving }) {
  const [text,     setText]     = useState(initial.text || '');
  const [type,     setType]     = useState(initial.type || 'multiple-choice');
  const [options,  setOptions]  = useState(() =>
    initial.options?.length ? [...initial.options] : [...typeDefaults(initial.type || 'multiple-choice').options]
  );
  const [correct,  setCorrect]  = useState(() =>
    initial.correct?.length ? [...initial.correct] : [...typeDefaults(initial.type || 'multiple-choice').correct]
  );
  const [category, setCategory] = useState(() => canonicalQuestionCategory(initial.category));
  const [difficultyLevel, setDifficultyLevel] = useState(normalizeDifficulty(initial.difficultyLevel));
  const isNew = !initial.id;

  function handleTypeChange(t) {
    const d = typeDefaults(t);
    setType(t);
    setOptions([...d.options]);
    setCorrect([...d.correct]);
  }

  function toggleCorrect(i) {
    if (type === 'multi-select') {
      setCorrect((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
    } else {
      setCorrect([i]);
    }
  }

  function updateOption(i, val) {
    setOptions((prev) => prev.map((o, idx) => idx === i ? val : o));
  }

  function addOption() {
    if (options.length >= 6) return;
    setOptions((prev) => [...prev, '']);
  }

  function removeOption(i) {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    setCorrect((prev) =>
      prev.filter((x) => x !== i).map((x) => x > i ? x - 1 : x)
    );
  }

  function validate() {
    if (!text.trim()) { showToast('Question content is required'); return false; }
    if (type !== 'short-answer') {
      if (options.length < 2) { showToast('Add at least 2 options'); return false; }
      if (correct.length === 0) { showToast('Select at least one correct answer'); return false; }
    }
    return true;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({ text, type, options, correct, category, difficultyLevel });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Form header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{isNew ? 'New question' : 'Edit question'}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isNew && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--accent-red)' }}
              onClick={onDelete}
            >
              <Icon name="trash" size={13} /> Delete
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create Question' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Type, Category, Difficulty */}
      <div className="grid-3-meta">
        <div className="field">
          <label className="field-label">Type</label>
          <select className="select" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {QUESTION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Difficulty level</label>
          <select className="select" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
            {DIFFICULTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Question text */}
      <div className="field">
        <label className="field-label">Question</label>
        <textarea
          className="textarea"
          placeholder="Enter your question…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 88 }}
        />
      </div>

      {/* Options */}
      {type !== 'short-answer' && (
        <div className="field">
          <label className="field-label">
            {type === 'multi-select'
              ? 'Options — select all correct answers'
              : 'Options — click to mark correct'}
          </label>
          {options.map((opt, i) => (
            <div key={i} className="option-row">
              <button
                type="button"
                className={`opt-correct ${type === 'multi-select' ? 'checkbox' : 'radio'}${correct.includes(i) ? ' active' : ''}`}
                onClick={() => toggleCorrect(i)}
                aria-label={correct.includes(i) ? 'Correct' : 'Mark correct'}
              >
                {correct.includes(i) && <Icon name="check" size={10} strokeWidth={3} />}
              </button>
              <input
                className="input opt-input"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                readOnly={type === 'true-false'}
              />
              {type !== 'true-false' && options.length > 2 && (
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 28, height: 28, flexShrink: 0 }}
                  onClick={() => removeOption(i)}
                  aria-label="Remove option"
                >
                  <Icon name="x" size={13} />
                </button>
              )}
            </div>
          ))}
          {type !== 'true-false' && options.length < 6 && (
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

      {/* Short answer note */}
      {type === 'short-answer' && (
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label">Grading</label>
          <p className="field-help" style={{ margin: 0 }}>
            Short answers are graded manually or by minimum character count.
          </p>
        </div>
      )}
    </div>
  );
}

function AddQuestionToTestModal({ question, tests, onClose, onConfirm }) {
  const [search, setSearch] = useState('');
  const [testId, setTestId] = useState('');

  const editableTests = useMemo(
    () => (tests || []).filter((t) => t.status === 'draft' || t.status === 'scheduled'),
    [tests],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return editableTests;
    const q = search.toLowerCase();
    return editableTests.filter((t) => (t.title || '').toLowerCase().includes(q));
  }, [editableTests, search]);

  useEffect(() => {
    setTestId('');
  }, [question?.id]);

  function handleConfirm() {
    if (!testId) return;
    onConfirm(testId);
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-labelledby="qb-add-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 id="qb-add-title">Add question to test</h2>
            {question?.text && (
              <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>
                {question.text.length > 120 ? `${question.text.slice(0, 120)}…` : question.text}
              </p>
            )}
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 13.5 }}>
              Select a draft or scheduled test. The question is copied into the test as a snapshot.
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal-body">
          {editableTests.length === 0 ? (
            <div className="empty" style={{ padding: '20px 0' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                No tests found. Create a test first.
              </div>
            </div>
          ) : (
            <>
              <div className="search-box" style={{ width: '100%', marginBottom: 12 }}>
                <Icon name="search" size={14} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                <input
                  placeholder="Search tests…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search tests"
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="qb-add-test-select">Select test</label>
                <select
                  id="qb-add-test-select"
                  className="select"
                  value={testId}
                  onChange={(e) => setTestId(e.target.value)}
                >
                  <option value="">— Choose a test —</option>
                  {filtered.map((t) => (
                    <option key={t.id} value={t.id}>
                      {(t.title || 'Untitled').slice(0, 80)}
                      {t.status === 'draft' ? ' (Draft)' : ' (Scheduled)'}
                    </option>
                  ))}
                </select>
              </div>
              {search.trim() && filtered.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                  No tests match your search.
                </p>
              )}
            </>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!testId || editableTests.length === 0}
            onClick={handleConfirm}
          >
            Add to test
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function QuestionBank({ showToast, tests = [], setTests }) {
  const [questions,  setQuestions]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null); // question object | 'new' | null
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [saving,     setSaving]     = useState(false);
  const [addModalQuestion, setAddModalQuestion] = useState(null);

  useEffect(() => {
    getAllQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const visible = useMemo(() => questions.filter((q) => {
    if (catFilter !== 'All' && q.category !== catFilter) return false;
    if (diffFilter !== 'All' && normalizeDifficulty(q.difficultyLevel) !== diffFilter) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [questions, catFilter, diffFilter, search]);

  async function handleSave(formData) {
    setSaving(true);
    try {
      if (!selected || selected === 'new') {
        const saved = await createQuestion(formData);
        setQuestions((prev) => [saved, ...prev]);
        setSelected(null);
        showToast('New question added');
      } else {
        const saved = await updateQuestion(selected.id, formData);
        setQuestions((prev) => prev.map((q) => q.id === selected.id ? saved : q));
        setSelected(null);
        showToast('Question updated');
      }
    } catch (e) {
      console.error(e);
      showToast(`Error saving: ${formatQuestionStoreError(e)}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected?.id) return;
    if (!window.confirm('Delete this question? This cannot be undone.')) return;
    try {
      await deleteQuestion(selected.id);
      setQuestions((prev) => prev.filter((q) => q.id !== selected.id));
      setSelected(null);
      showToast('Question deleted');
    } catch (e) {
      console.error(e);
      showToast(`Error deleting: ${formatQuestionStoreError(e)}`);
    }
  }

  const editorInitial = selected === 'new' ? blankQuestion() : selected;
  const editorKey     = selected === 'new' ? 'new' : (selected?.id ?? 'none');

  async function handleAddQuestionToTest(testId) {
    const bankQ = addModalQuestion;
    if (!bankQ?.id || !setTests) {
      showToast('Could not add question. Please try again.');
      return;
    }
    const test = tests.find((t) => t.id === testId);
    if (!test) {
      showToast('Could not add question. Please try again.');
      return;
    }
    const ql = test.questionsList || [];
    if (ql.some((x) => x.id === bankQ.id)) {
      showToast('This question is already in this test.');
      return;
    }
    try {
      const snapshot = normalizeQuestion({
        id: bankQ.id,
        type: bankQ.type,
        text: bankQ.text,
        options: bankQ.options,
        correct: bankQ.correct,
        explanation: bankQ.explanation || '',
        points: bankQ.points ?? 1,
        keywords: bankQ.keywords || '',
        category: bankQ.category,
        difficultyLevel: bankQ.difficultyLevel,
      });
      const next = {
        ...test,
        questionsList: [...ql, snapshot],
        questions: ql.length + 1,
      };
      const saved = await saveTest(next);
      setTests((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      showToast('Question added to test.');
      setAddModalQuestion(null);
    } catch (e) {
      console.error(e);
      showToast('Could not add question. Please try again.');
    }
  }

  return (
    <div className="content" style={{ animation: 'v2SlideUp .2s ease' }}>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Question Bank</h1>
          <p className="page-sub">Manage reusable questions across all tests.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setSelected('new')}>
            <Icon name="plus" size={14} /> New question
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Left panel — question list */}
        <div style={{ width: 360, flexShrink: 0 }}>
          {/* Search + filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-box" style={{ flex: '1 1 140px', minWidth: 0 }}>
              <Icon name="search" size={14} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
              <input
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search questions"
              />
            </div>
            <select
              className="select"
              style={{ width: 120, flexShrink: 0 }}
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="All">Category</option>
              {QUESTION_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="select"
              style={{ width: 130, flexShrink: 0 }}
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
            >
              <option value="All">All levels</option>
              {DIFFICULTY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* List */}
          {loading ? (
            <div className="card">
              <div style={{ padding: '24px 20px', color: 'var(--text-faint)', fontSize: 13 }}>Loading…</div>
            </div>
          ) : visible.length === 0 ? (
            <div className="card">
              <div className="empty">
                <div className="empty-icon"><Icon name="bank" size={22} /></div>
                <div style={{ fontWeight: 600, color: 'var(--ink-800)', marginBottom: 4 }}>
                  {questions.length === 0 ? 'No questions yet' : 'No results'}
                </div>
                <div style={{ fontSize: 13 }}>
                  {questions.length === 0
                    ? 'Click "New question" to add one.'
                    : 'Try a different search, category, or difficulty.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data">
                <tbody>
                  {visible.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => setSelected(q)}
                      style={{
                        cursor: 'pointer',
                        background: selected?.id === q.id ? 'var(--brand-50)' : undefined,
                      }}
                    >
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{
                          fontWeight: 500, fontSize: 13.5, marginBottom: 5,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap', maxWidth: 220,
                        }}>
                          {q.text || <span style={{ color: 'var(--text-faint)', fontStyle: 'italic' }}>Untitled</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span className="badge">{TYPE_LABELS[q.type] || q.type}</span>
                          <span className="badge brand" style={{ fontSize: 10.5 }}>{q.category}</span>
                          <span className={difficultyBadgeClass(q.difficultyLevel)}>
                            {difficultyLabel(q.difficultyLevel)}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{ width: 1, whiteSpace: 'nowrap', verticalAlign: 'middle', paddingLeft: 8 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          title="Add to test"
                          onClick={() => setAddModalQuestion(q)}
                        >
                          <Icon name="plus" size={12} /> Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-faint)' }}>
            {visible.length} of {questions.length} question{questions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Right panel — editor */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selected ? (
            <div className="card">
              <div className="empty" style={{ padding: '48px 24px' }}>
                <div className="empty-icon"><Icon name="bank" size={22} /></div>
                <div style={{ fontWeight: 600, color: 'var(--ink-800)', marginBottom: 4 }}>
                  Select a question to edit
                </div>
                <div style={{ fontSize: 13 }}>Or click "New question" to create one.</div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 24 }}>
              <QuestionForm
                key={editorKey}
                initial={editorInitial}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={() => setSelected(null)}
                showToast={showToast}
                saving={saving}
              />
            </div>
          )}
        </div>
      </div>

      {addModalQuestion && (
        <AddQuestionToTestModal
          question={addModalQuestion}
          tests={tests}
          onClose={() => setAddModalQuestion(null)}
          onConfirm={handleAddQuestionToTest}
        />
      )}
    </div>
  );
}

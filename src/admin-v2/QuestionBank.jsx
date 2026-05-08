import { useState, useEffect, useMemo } from 'react';
import Icon from './icons.jsx';
import { CATEGORIES } from './data-v2.js';
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion } from '../data/questionStore.js';

const TYPE_LABELS = {
  'multiple-choice': 'Multiple choice',
  'multi-select':    'Multi-select',
  'true-false':      'True / False',
  'short-answer':    'Short answer',
};

function typeDefaults(type) {
  if (type === 'true-false')   return { options: ['True', 'False'], correct: [0] };
  if (type === 'short-answer') return { options: [], correct: [] };
  return { options: ['', '', '', ''], correct: [0] };
}

function blankQuestion() {
  return { id: null, text: '', type: 'multiple-choice', options: ['', '', '', ''], correct: [0], category: 'General' };
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
  const [category, setCategory] = useState(initial.category || 'General');
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
    onSave({ text, type, options, correct, category });
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
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Type + Category */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="field">
          <label className="field-label">Type</label>
          <select className="select" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function QuestionBank({ showToast }) {
  const [questions,  setQuestions]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null); // question object | 'new' | null
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('All');
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    getAllQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const visible = useMemo(() => questions.filter((q) => {
    if (catFilter !== 'All' && q.category !== catFilter) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [questions, catFilter, search]);

  async function handleSave(formData) {
    setSaving(true);
    try {
      if (!selected || selected === 'new') {
        const saved = await createQuestion(formData);
        setQuestions((prev) => [saved, ...prev]);
        setSelected(saved);
        showToast('Question created');
      } else {
        const saved = await updateQuestion(selected.id, formData);
        setQuestions((prev) => prev.map((q) => q.id === selected.id ? saved : q));
        setSelected(saved);
        showToast('Question saved');
      }
    } catch {
      showToast('Error saving — check console');
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
    } catch {
      showToast('Error deleting — check console');
    }
  }

  const editorInitial = selected === 'new' ? blankQuestion() : selected;
  const editorKey     = selected === 'new' ? 'new' : (selected?.id ?? 'none');

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
        <div style={{ width: 320, flexShrink: 0 }}>
          {/* Search + category filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div className="search-box" style={{ flex: 1 }}>
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
              style={{ width: 120 }}
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="All">All</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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
                    : 'Try a different search or category.'}
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
                      <td>
                        <div style={{
                          fontWeight: 500, fontSize: 13.5, marginBottom: 5,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap', maxWidth: 250,
                        }}>
                          {q.text || <span style={{ color: 'var(--text-faint)', fontStyle: 'italic' }}>Untitled</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span className="badge">{TYPE_LABELS[q.type] || q.type}</span>
                          <span className="badge brand" style={{ fontSize: 10.5 }}>{q.category}</span>
                        </div>
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
    </div>
  );
}

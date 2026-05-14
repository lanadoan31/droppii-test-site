import { useState } from 'react';
import Icon from './icons.jsx';
import { DEFAULT_QUESTION_CATEGORY, QUESTION_CATEGORIES } from '../data/questionBankCategories.js';

export default function CreateTestModal({ onClose, onCreate }) {
  const [title,        setTitle]        = useState('');
  const [category,     setCategory]     = useState(DEFAULT_QUESTION_CATEGORY);
  const [duration,     setDuration]     = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [description,  setDescription]  = useState('');
  const [availability, setAvailability] = useState('always');
  const [opens,        setOpens]        = useState('');
  const [closes,       setCloses]       = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), category, duration, passingScore, description, availability, opens, closes });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div>
            <h2 id="modal-title">Create new test</h2>
            <p>Set the basics now — fine-tune everything in the builder.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="field">
              <label className="field-label" htmlFor="test-title">Test title</label>
              <input
                id="test-title"
                className="input"
                autoFocus
                placeholder="e.g. Returns & Refunds Knowledge Check"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="field">
              <label className="field-label" htmlFor="test-category">Category</label>
              <select
                id="test-category"
                className="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {QUESTION_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Duration + Passing score */}
            <div className="grid-2">
              <div className="field">
                <label className="field-label" htmlFor="test-duration">Time limit (minutes)</label>
                <input
                  id="test-duration"
                  className="input"
                  type="number"
                  min="1"
                  max="180"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <div className="field-help">How long takers have per attempt.</div>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="test-passing">Passing score (%)</label>
                <input
                  id="test-passing"
                  className="input"
                  type="number"
                  min="1"
                  max="100"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                />
                <div className="field-help">Minimum score to pass.</div>
              </div>
            </div>

            {/* Description */}
            <div className="field">
              <label className="field-label" htmlFor="test-desc">Description <span style={{ fontWeight: 400, color: 'var(--text-faint)' }}>(optional)</span></label>
              <textarea
                id="test-desc"
                className="textarea"
                placeholder="What is this test for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Availability */}
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="field-label">Availability</label>
              <div className="avail-toggle">
                <button
                  type="button"
                  className={`avail-btn${availability === 'always' ? ' active' : ''}`}
                  onClick={() => setAvailability('always')}
                >
                  Always open
                </button>
                <button
                  type="button"
                  className={`avail-btn${availability === 'window' ? ' active' : ''}`}
                  onClick={() => setAvailability('window')}
                >
                  Scheduled window
                </button>
              </div>

              {availability === 'always' ? (
                <div className="field-help" style={{ marginTop: 8 }}>
                  Takers can take this test any time once published.
                </div>
              ) : (
                <div className="grid-2" style={{ marginTop: 10 }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 11.5 }}>Opens</label>
                    <input
                      className="input"
                      type="datetime-local"
                      value={opens}
                      onChange={(e) => setOpens(e.target.value)}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 11.5 }}>Closes</label>
                    <input
                      className="input"
                      type="datetime-local"
                      value={closes}
                      onChange={(e) => setCloses(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
              <Icon name="plus" size={14} /> Create &amp; open builder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

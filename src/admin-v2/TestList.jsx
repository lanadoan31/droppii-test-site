import { useState, useEffect, useRef } from 'react';
import Icon from './icons.jsx';

const STATUS_LABELS = {
  published: 'Published',
  draft:     'Draft',
  scheduled: 'Scheduled',
  archived:  'Archived',
};

function Pill({ status }) {
  return (
    <span className={`badge ${status}`}>
      <span className="badge-dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress">
      <div style={{ width: `${value}%` }} />
    </div>
  );
}

function RowMenu({ test, onEdit, onDuplicate, onTogglePublish, onArchive, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  const isPublished = test.status === 'published';

  return (
    <div className="row-menu" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button className="menu-item" onClick={onEdit}>
        <Icon name="edit" size={14} /> Edit
      </button>
      <button className="menu-item" onClick={() => {}}>
        <Icon name="eye" size={14} /> Preview
      </button>
      <button className="menu-item" onClick={onDuplicate}>
        <Icon name="copy" size={14} /> Duplicate
      </button>
      <button className="menu-item" onClick={onTogglePublish}>
        <Icon name={isPublished ? 'x' : 'check'} size={14} />
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>
      <div className="menu-divider" />
      <button className="menu-item danger" onClick={onArchive}>
        <Icon name="trash" size={14} /> Archive
      </button>
    </div>
  );
}

function TestCard({ test, onClick }) {
  return (
    <div className="test-card" onClick={onClick}>
      <div className="test-card-header">
        <Pill status={test.status} />
        <span className="badge brand" style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 11 }}>
          {test.category}
        </span>
      </div>
      <div className="card-pad">
        <div style={{ fontWeight: 600, marginBottom: 4, lineHeight: 1.35 }}>{test.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          {test.questions} questions · {test.duration} min
        </div>
        <div className="row" style={{ fontSize: 12, color: 'var(--text-muted)', justifyContent: 'space-between' }}>
          <span>{test.attempts > 0 ? `${test.attempts.toLocaleString()} attempts` : 'No attempts yet'}</span>
          <span>{test.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'all',       label: 'All'       },
  { id: 'published', label: 'Published' },
  { id: 'draft',     label: 'Drafts'    },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'archived',  label: 'Archived'  },
];

export default function TestList({ tests, setTests, navigate, openModal, showToast }) {
  const [tab, setTab]     = useState('all');
  const [view, setView]   = useState('table');
  const [search, setSearch] = useState('');
  const [menuId, setMenuId] = useState(null);

  const counts = {
    all:       tests.length,
    published: tests.filter((t) => t.status === 'published').length,
    draft:     tests.filter((t) => t.status === 'draft').length,
    scheduled: tests.filter((t) => t.status === 'scheduled').length,
    archived:  tests.filter((t) => t.status === 'archived').length,
  };

  const visible = tests.filter((t) => {
    if (tab !== 'all' && t.status !== tab) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function togglePublish(id) {
    setTests((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'published' ? 'draft' : 'published', updatedAt: 'just now' }
          : t
      )
    );
    const t = tests.find((x) => x.id === id);
    showToast(t?.status === 'published' ? 'Test unpublished' : 'Test published');
    setMenuId(null);
  }

  function duplicate(id) {
    const orig = tests.find((t) => t.id === id);
    const copy = {
      ...orig,
      id: 't' + Date.now(),
      title: orig.title + ' (Copy)',
      status: 'draft',
      attempts: 0, avgScore: 0, passRate: 0,
      updatedAt: 'just now',
    };
    setTests((prev) => [copy, ...prev]);
    showToast('Test duplicated');
    setMenuId(null);
  }

  function archive(id) {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'archived', updatedAt: 'just now' } : t))
    );
    showToast('Test archived');
    setMenuId(null);
  }

  return (
    <div className="content" style={{ animation: 'v2SlideUp .2s ease' }}>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tests</h1>
          <p className="page-sub">Create, edit, and publish assessments for sellers.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <Icon name="upload" size={14} /> Import
          </button>
          <button className="btn btn-primary" onClick={() => openModal('newTest')}>
            <Icon name="plus" size={14} /> New test
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className="tab-count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="row" style={{ marginBottom: 16, gap: 8, flexWrap: 'wrap' }}>
        <div className="search-box" style={{ width: 280 }}>
          <Icon name="search" size={14} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
          <input
            placeholder="Search tests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tests"
          />
        </div>
        <button className="btn btn-secondary btn-sm">
          <Icon name="filter" size={13} /> Category
        </button>
        <button className="btn btn-secondary btn-sm">
          <Icon name="filter" size={13} /> Last updated
        </button>
        <div style={{ flex: 1 }} />
        <div className="segmented" role="group" aria-label="View mode">
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')} aria-label="Table view">
            <Icon name="list" size={13} />
          </button>
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Grid view">
            <Icon name="grid" size={13} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon"><Icon name="tests" size={22} /></div>
            <div style={{ fontWeight: 600, color: 'var(--ink-800)', marginBottom: 4 }}>No tests found</div>
            <div style={{ fontSize: 13 }}>Try a different filter or create a new test.</div>
          </div>
        </div>
      )}

      {/* Table view */}
      {visible.length > 0 && view === 'table' && (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Test</th>
                <th>Status</th>
                <th>Questions</th>
                <th>Attempts</th>
                <th>Pass rate</th>
                <th>Updated</th>
                <th style={{ width: 56 }} />
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.id} onClick={() => navigate('testDetail', t.id)}>
                  {/* Title cell */}
                  <td>
                    <div className="row" style={{ gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600 }}>{t.title}</span>
                      {t.availability?.type === 'window' && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: 10.5, fontWeight: 600, color: 'var(--brand-700)',
                          background: 'var(--brand-50)', padding: '2px 6px', borderRadius: 4,
                        }}>
                          <Icon name="clock" size={10} /> 7:00–8:00 PM
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                      <span className="badge brand" style={{ marginRight: 6 }}>{t.category}</span>
                      {t.duration} min
                      {t.availability?.type !== 'window' && (
                        <span style={{ marginLeft: 6 }}>· Always open</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td><Pill status={t.status} /></td>

                  {/* Questions */}
                  <td className="num">{t.questions}</td>

                  {/* Attempts */}
                  <td className="num">
                    {t.attempts > 0 ? t.attempts.toLocaleString() : (
                      <span style={{ color: 'var(--text-faint)' }}>—</span>
                    )}
                  </td>

                  {/* Pass rate */}
                  <td>
                    {t.attempts > 0 ? (
                      <div className="row" style={{ gap: 8 }}>
                        <div style={{ width: 60 }}>
                          <ProgressBar value={t.passRate} />
                        </div>
                        <span className="num" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {t.passRate}%
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-faint)' }}>—</span>
                    )}
                  </td>

                  {/* Updated */}
                  <td style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{t.updatedAt}</td>

                  {/* Row menu */}
                  <td onClick={(e) => e.stopPropagation()} className="row-menu-wrap">
                    <button
                      className="icon-btn"
                      style={{ width: 28, height: 28 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuId(menuId === t.id ? null : t.id);
                      }}
                      aria-label="Row options"
                      aria-haspopup="true"
                    >
                      <Icon name="more" size={16} />
                    </button>
                    {menuId === t.id && (
                      <RowMenu
                        test={t}
                        onEdit={() => { navigate('builder', t.id); setMenuId(null); }}
                        onDuplicate={() => duplicate(t.id)}
                        onTogglePublish={() => togglePublish(t.id)}
                        onArchive={() => archive(t.id)}
                        onClose={() => setMenuId(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid view */}
      {visible.length > 0 && view === 'grid' && (
        <div className="test-grid">
          {visible.map((t) => (
            <TestCard key={t.id} test={t} onClick={() => navigate('testDetail', t.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

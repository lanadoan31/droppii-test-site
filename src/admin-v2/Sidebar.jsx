import { useState, useEffect, useRef } from 'react';
import Icon from './icons.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',     icon: 'dashboard' },
  { id: 'tests',     label: 'Tests',         icon: 'tests',  badge: null },
  { id: 'bank',      label: 'Question bank', icon: 'bank'  },
  { id: 'results',   label: 'Results',       icon: 'results' },
];

function DropItem({ icon, label, sub, onClick, disabled }) {
  return (
    <button className="drop-item" onClick={onClick} disabled={disabled}
      style={{ color: disabled ? 'var(--text-faint)' : 'var(--ink-700)' }}>
      <Icon name={icon} size={14} />
      <span style={{ flex: 1 }}>{label}</span>
      {sub && <span className="drop-item-sub">{sub}</span>}
    </button>
  );
}

export default function Sidebar({ collapsed, section, navigate, user, onLogout, testCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDoc(e) {
      if (footerRef.current && !footerRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">D</div>
        <div className="sidebar-brand-name hide-when-collapsed">
          Droppii
          <small>Test Admin</small>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        <div className="sidebar-section-label">Workspace</div>
        {NAV_ITEMS.map((item) => {
          const badge = item.id === 'tests' ? testCount : item.badge;
          return (
            <button
              key={item.id}
              className={`nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.id)}
              aria-current={section === item.id ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon name={item.icon} size={17} />
              <span className="nav-item-label hide-when-collapsed">{item.label}</span>
              {badge != null && (
                <span className="nav-badge hide-when-collapsed">{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer" ref={footerRef}>
        <button className="user-chip" onClick={() => setMenuOpen((o) => !o)}>
          <div className="avatar" aria-hidden="true">{user.initials}</div>
          <div className="user-chip-info hide-when-collapsed">
            <div className="name">{user.name}</div>
            <div className="email">{user.email}</div>
          </div>
          <Icon name="chevDown" size={14} className="hide-when-collapsed"
            style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
        </button>

        {menuOpen && (
          <div className="profile-dropdown">
            <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{user.email}</div>
              <span className="badge brand" style={{ marginTop: 6, display: 'inline-block' }}>
                {user.role}
              </span>
            </div>
            <DropItem icon="user"  label="Profile"      onClick={() => setMenuOpen(false)} />
            <DropItem icon="users" label="Team members" sub="Soon" disabled />
            <DropItem icon="bell"  label="Notifications" sub="Soon" disabled />
            <div className="divider" />
            <DropItem icon="logout" label="Sign out"
              onClick={() => { setMenuOpen(false); onLogout?.(); }} />
          </div>
        )}
      </div>
    </aside>
  );
}

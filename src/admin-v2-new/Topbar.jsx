import Icon from './icons.jsx';

export default function Topbar({ title, subtitle, toggleCollapse }) {
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={toggleCollapse} title="Toggle sidebar" aria-label="Toggle sidebar">
        <Icon name="list" size={18} />
      </button>

      <div className="topbar-title">
        {title}
        {subtitle && <small>{subtitle}</small>}
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-search">
        <Icon name="search" size={15} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
        <input placeholder="Search tests, questions…" aria-label="Global search" />
        <kbd>⌘K</kbd>
      </div>

      <button className="icon-btn" title="Notifications" aria-label="Notifications">
        <Icon name="bell" size={18} />
        <span className="notif-dot" aria-hidden="true" />
      </button>

      <button className="icon-btn" title="Help" aria-label="Help">
        <Icon name="info" size={18} />
      </button>
    </header>
  );
}

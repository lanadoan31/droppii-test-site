import { CURRENT_ADMIN } from './data.js';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    icon: 'M3 12L12 3l9 9M5 10v10h14V10',
  },
  {
    id: 'tests',
    label: 'Bài kiểm tra',
    icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  },
  {
    id: 'questions',
    label: 'Ngân hàng câu hỏi',
    icon: 'M9 8h6M9 12h6M9 16h3M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  },
  {
    id: 'sellers',
    label: 'Nhà bán hàng',
    icon: 'M16 11a4 4 0 100-8 4 4 0 000 8zM8 11a4 4 0 100-8 4 4 0 000 8zM2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M14 13h2a4 4 0 014 4v2',
  },
  {
    id: 'analytics',
    label: 'Phân tích & Kết quả',
    icon: 'M3 21V9M9 21V3M15 21V13M21 21V7',
  },
  {
    id: 'reports',
    label: 'Báo cáo & Xuất file',
    icon: 'M9 11l3 3 8-8M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
  },
];

function NavIcon({ path }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-logo">
        <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" style={{ width: 22, height: 22, color: 'var(--adm-blue-700)', flexShrink: 0 }}>
          <path d="M34.149 5.618C30.246 1.875 25.548 0 20.062 0 14.499 0 9.76 1.875 5.857 5.618 1.954 9.367 0 13.907 0 19.248c0 3.264.753 6.24 2.26 8.916l-.011.028L.041 38.034c-.276 1.219.93 2.27 2.172 1.886l9.896-3.055c2.431.999 5.08 1.507 7.953 1.507 5.486 0 10.178-1.868 14.081-5.618C38.051 29.011 40 24.505 40 19.248c.006-5.341-1.949-9.881-5.851-13.63zM30.104 16.504c-.094 5.302-4.862 9.639-10.39 9.452-5.38-.18-9.683-4.421-9.683-9.621v-.284c.012-1.784 2.237-2.778 3.679-1.643 1.731 1.361 3.944 2.179 6.358 2.179 2.39 0 4.58-.801 6.304-2.134 1.478-1.146 3.744-.124 3.732 1.705v.346z" />
        </svg>
        <span className="adm-logo-word">droppii<span className="adm-logo-dot">.</span></span>
        <span className="adm-logo-badge">Admin</span>
      </div>

      <nav className="adm-nav" aria-label="Admin navigation">
        <div className="adm-nav-section">Quản lý</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`adm-nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
            aria-current={active === item.id ? 'page' : undefined}
          >
            <NavIcon path={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="adm-sidebar-footer">
        <div className="adm-avatar" aria-hidden="true">{CURRENT_ADMIN.initials}</div>
        <div className="adm-sidebar-user">
          <div className="adm-sidebar-user-name">{CURRENT_ADMIN.name}</div>
          <div className="adm-sidebar-user-role">{CURRENT_ADMIN.role}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--adm-ink-400)" strokeWidth="2" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </aside>
  );
}

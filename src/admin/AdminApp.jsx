import { useState, useEffect } from 'react';
import './admin.css';
import Sidebar from './Sidebar.jsx';
import TestList from './TestList.jsx';

// Derive the initial section from the URL path:
//   /admin          → 'dashboard'
//   /admin/tests    → 'tests'
//   /admin/questions → 'questions'
function pathToSection(pathname) {
  const seg = pathname.replace(/^\/admin\/?/, '').split('/')[0];
  return seg || 'dashboard';
}

// Placeholder for screens not yet built
function ComingSoon({ label }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--adm-ink-400)', fontSize: 14 }}>
      {label} — sắp ra mắt
    </div>
  );
}

export default function AdminApp() {
  const [section, setSection] = useState(() => pathToSection(window.location.pathname));

  // Keep URL in sync when navigating via sidebar
  useEffect(() => {
    const url = section === 'dashboard' ? '/admin' : `/admin/${section}`;
    if (window.location.pathname !== url) {
      window.history.pushState(null, '', url);
    }
  }, [section]);

  // Handle browser back/forward
  useEffect(() => {
    function onPop() {
      setSection(pathToSection(window.location.pathname));
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function renderScreen() {
    switch (section) {
      case 'tests':
        return (
          <TestList
            onCreateTest={() => setSection('tests/new')}
          />
        );
      case 'dashboard':
        return <ComingSoon label="Tổng quan" />;
      case 'questions':
        return <ComingSoon label="Ngân hàng câu hỏi" />;
      case 'sellers':
        return <ComingSoon label="Nhà bán hàng" />;
      case 'analytics':
        return <ComingSoon label="Phân tích & Kết quả" />;
      case 'reports':
        return <ComingSoon label="Báo cáo & Xuất file" />;
      default:
        return <ComingSoon label={section} />;
    }
  }

  // Map sub-paths back to top-level nav item for sidebar highlight
  const activeNav = section.split('/')[0];

  return (
    <div className="adm-root">
      <div className="adm-layout">
        <Sidebar active={activeNav} onNav={setSection} />
        <main className="adm-main" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

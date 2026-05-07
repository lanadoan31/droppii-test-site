import { useState, useEffect } from 'react';
import './admin-v2.css';
import { INITIAL_TESTS, MOCK_USER, makeWindow, makeAlways } from './data-v2.js';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import TestList from './TestList.jsx';
import CreateTestModal from './CreateTestModal.jsx';
import Builder from './Builder.jsx';

function pathToSection(pathname) {
  const seg = pathname.replace(/^\/admin-v2\/?/, '').split('/')[0];
  return seg || 'tests';
}

const PAGE_TITLES = {
  tests:     'Tests',
  dashboard: 'Dashboard',
  bank:      'Question bank',
  results:   'Results',
};

function ComingSoon({ label }) {
  return <div className="coming-soon">{label} — coming soon</div>;
}

export default function AdminAppV2() {
  const [section,   setSection]   = useState(() => pathToSection(window.location.pathname));
  const [contextId, setContextId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [tests,     setTests]     = useState(INITIAL_TESTS);
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);

  // Keep URL in sync with active section
  useEffect(() => {
    const url = section === 'tests' ? '/admin-v2' : `/admin-v2/${section}`;
    if (window.location.pathname !== url) {
      window.history.pushState(null, '', url);
    }
  }, [section]);

  // Handle browser back/forward
  useEffect(() => {
    function onPop() { setSection(pathToSection(window.location.pathname)); }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function navigate(page, id = null) {
    setSection(page);
    setContextId(id);
    setModal(null);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleCreateTest(data) {
    const id = 't' + Date.now();
    const newTest = {
      id,
      title:        data.title,
      category:     data.category,
      description:  data.description || '',
      status:       'draft',
      questions:    0,
      duration:     Number(data.duration) || 30,
      passingScore: Number(data.passingScore) || 70,
      maxAttempts:  'unlimited',
      availability: data.availability === 'window'
        ? makeWindow(data.opens, data.closes)
        : makeAlways(),
      randomizeQuestions: true,
      randomizeOptions:   true,
      showCorrectAnswers: true,
      requireWebcam:      false,
      attempts:  0,
      avgScore:  0,
      passRate:  0,
      updatedAt: 'just now',
    };
    setTests((prev) => [newTest, ...prev]);
    setModal(null);
    showToast('Draft test created');
    navigate('builder', id);
  }

  const activeNav = section.split('/')[0] || 'tests';
  const pageTitle = PAGE_TITLES[activeNav] || 'Tests';

  function renderScreen() {
    switch (activeNav) {
      case 'tests':
        return (
          <TestList
            tests={tests}
            setTests={setTests}
            navigate={navigate}
            openModal={setModal}
            showToast={showToast}
          />
        );
      case 'builder':
        return (
          <Builder
            tests={tests}
            setTests={setTests}
            testId={contextId}
            navigate={navigate}
            showToast={showToast}
          />
        );
      case 'testDetail':
        return <ComingSoon label="Test detail" />;
      default:
        return <ComingSoon label={pageTitle} />;
    }
  }

  return (
    <div className={`v2${collapsed ? ' collapsed' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        section={activeNav}
        navigate={navigate}
        user={MOCK_USER}
        onLogout={() => {}}
        testCount={tests.length}
      />

      <div className="main">
        <Topbar
          title={pageTitle}
          toggleCollapse={() => setCollapsed((c) => !c)}
        />
        {renderScreen()}
      </div>

      {modal === 'newTest' && (
        <CreateTestModal
          onClose={() => setModal(null)}
          onCreate={handleCreateTest}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}

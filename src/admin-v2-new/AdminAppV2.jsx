import { useState, useEffect } from 'react';
import './admin-v2.css';
import { MOCK_USER, makeWindow, makeAlways } from './data-v2.js';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import TestList from './TestList.jsx';
import CreateTestModal from './CreateTestModal.jsx';
import Builder from './Builder.jsx';
import Results from './Results.jsx';
import Dashboard from './Dashboard.jsx';
import TestDetail from './TestDetail.jsx';
import TakerResult from './TakerResult.jsx';
import { getAllTests, saveTest } from '../data/testStore.js';
import QuestionBank from './QuestionBank.jsx';

function pathToSection(pathname) {
  const seg = pathname.replace(/^\/admin-v2-new\/?/, '').split('/')[0];
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
  const [tests,     setTests]     = useState([]);
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);

  // Keep URL in sync with active section
  useEffect(() => {
    const url = section === 'tests' ? '/admin-v2-new' : `/admin-v2-new/${section}`;
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

  // Load all tests from Supabase on mount
  useEffect(() => {
    getAllTests().then(setTests);
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

  async function handleCreateTest(data) {
    const id = crypto.randomUUID();
    const newTest = {
      id,
      title:              data.title,
      category:           data.category,
      description:        data.description || '',
      status:             'draft',
      questions:          0,
      questionsList:      [],
      duration:           Number(data.duration) || 30,
      passingScore:       Number(data.passingScore) || 70,
      maxAttempts:        'unlimited',
      availability:       data.availability === 'window'
        ? makeWindow(data.opens, data.closes)
        : makeAlways(),
      randomizeQuestions: true,
      randomizeOptions:   true,
      showCorrectAnswers: true,
      requireWebcam:      false,
      attempts:           0,
      avgScore:           0,
      passRate:           0,
      updatedAt:          'just now',
    };
    setModal(null);
    try {
      const saved = await saveTest(newTest);
      setTests((prev) => [saved, ...prev]);
    } catch (err) {
      showToast('Error saving to Supabase — check console');
      return;
    }
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
            key={contextId}
            tests={tests}
            setTests={setTests}
            testId={contextId}
            navigate={navigate}
            showToast={showToast}
          />
        );
      case 'testDetail':
        return (
          <TestDetail
            tests={tests}
            setTests={setTests}
            testId={contextId}
            navigate={navigate}
            showToast={showToast}
          />
        );
      case 'bank':
        return (
          <QuestionBank
            tests={tests}
            setTests={setTests}
            showToast={showToast}
          />
        );
      case 'results':
        return <Results navigate={navigate} />;
      case 'takerResult':
        return <TakerResult resultId={contextId} navigate={navigate} />;
      case 'dashboard':
        return <Dashboard />;
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

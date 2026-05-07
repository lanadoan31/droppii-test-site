// droppii-sync.js — shared bridge between Admin Portal and Seller test site.
// Persists tests, drafts, and seller results in localStorage; both pages
// read/write through this API so publishing in admin updates seller flow.

(function () {
  const KEY = 'droppii_sync_v1';
  const SEED = {
    tests: [
      {
        id: 'DRP-AI-2026',
        name: 'Kiến thức AI cho Nhà bán hàng — 2026',
        status: 'Đang mở',
        type: 'Định kỳ',
        duration_min: 30,
        pass_score: 70,
        questions_total: 20,
        published_at: '2026-04-12T08:00:00Z',
        updated_at: '2026-05-04T11:30:00Z',
        cohort: 'Đợt T05/2026',
      },
      {
        id: 'DRP-TPCN-Q1',
        name: 'Tư vấn TPCN — Tình huống lâm sàng',
        status: 'Đang mở',
        type: 'Định kỳ',
        duration_min: 25,
        pass_score: 75,
        questions_total: 15,
        published_at: '2026-03-01T08:00:00Z',
        updated_at: '2026-04-29T09:10:00Z',
      },
      {
        id: 'DRP-PROD-26',
        name: 'Kiến thức sản phẩm Q2/2026',
        status: 'Đang mở',
        type: 'Bắt buộc',
        duration_min: 35,
        pass_score: 70,
        questions_total: 25,
        published_at: '2026-04-20T08:00:00Z',
        updated_at: '2026-05-03T15:20:00Z',
      },
      {
        id: 'DRP-NEW-26',
        name: 'Onboarding — Người bán mới T05',
        status: 'Bản nháp',
        type: 'Bắt buộc',
        duration_min: 20,
        pass_score: 60,
        questions_total: 12,
        published_at: null,
        updated_at: '2026-05-06T10:00:00Z',
      },
    ],
    results: [], // seller submissions go here
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(SEED));
      const parsed = JSON.parse(raw);
      // hydrate any missing top-level keys
      return { ...JSON.parse(JSON.stringify(SEED)), ...parsed };
    } catch (e) {
      return JSON.parse(JSON.stringify(SEED));
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
    // Notify same-tab listeners (storage event only fires cross-tab)
    window.dispatchEvent(new CustomEvent('droppii-sync', { detail: state }));
  }

  const Sync = {
    state: load(),

    refresh() {
      this.state = load();
      return this.state;
    },

    getTests() { return this.refresh().tests; },
    getPublishedTests() { return this.getTests().filter(t => t.status === 'Đang mở'); },
    getTest(id) { return this.getTests().find(t => t.id === id); },

    publishTest(id) {
      const s = this.refresh();
      const t = s.tests.find(x => x.id === id);
      if (t) {
        t.status = 'Đang mở';
        t.published_at = new Date().toISOString();
        t.updated_at = new Date().toISOString();
        save(s);
      }
      return t;
    },

    archiveTest(id) {
      const s = this.refresh();
      const t = s.tests.find(x => x.id === id);
      if (t) {
        t.status = 'Đã lưu trữ';
        t.updated_at = new Date().toISOString();
        save(s);
      }
      return t;
    },

    addTest(test) {
      const s = this.refresh();
      const next = {
        id: test.id || ('DRP-' + Math.random().toString(36).slice(2, 7).toUpperCase()),
        status: 'Bản nháp',
        type: 'Định kỳ',
        duration_min: 30,
        pass_score: 70,
        questions_total: 0,
        published_at: null,
        updated_at: new Date().toISOString(),
        ...test,
      };
      s.tests.unshift(next);
      save(s);
      return next;
    },

    submitResult(result) {
      const s = this.refresh();
      const entry = {
        id: 'R-' + Date.now().toString(36),
        when: new Date().toISOString(),
        ...result,
      };
      s.results.unshift(entry);
      save(s);
      return entry;
    },

    getResults() { return this.refresh().results; },

    onChange(cb) {
      const handler = () => cb(this.refresh());
      window.addEventListener('droppii-sync', handler);
      window.addEventListener('storage', handler);
      return () => {
        window.removeEventListener('droppii-sync', handler);
        window.removeEventListener('storage', handler);
      };
    },

    reset() {
      localStorage.removeItem(KEY);
      this.refresh();
    },
  };

  window.DroppiiSync = Sync;
})();

import { useState } from 'react';
import { TESTS } from './data.js';
import StatusPill from './StatusPill.jsx';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n);

function SearchIcon() {
  return (
    <svg className="adm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="5"  r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const FILTER_TABS = ['Tất cả', 'Đang mở', 'Bản nháp', 'Đã lưu trữ'];

const TABLE_HEADERS = [
  'Bài kiểm tra', 'Trạng thái', 'Loại', 'Cấu hình', 'Lượt thi', 'Tỷ lệ đậu', 'Cập nhật', '',
];

export default function TestList({ onCreateTest }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const [tests, setTests] = useState(TESTS);

  const visible = tests.filter((t) => {
    if (filter !== 'Tất cả' && t.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const openCount = tests.filter((t) => t.status === 'Đang mở').length;

  function publish(id) {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Đang mở', updated: 'Vừa cập nhật' } : t))
    );
  }

  function archive(id) {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Đã lưu trữ', updated: 'Vừa cập nhật' } : t))
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Bài kiểm tra</h1>
          <div className="adm-page-subtitle">
            {tests.length} bài · {openCount} đang mở
          </div>
        </div>
        <div className="adm-header-actions">
          <button className="adm-btn adm-btn-secondary">Nhập từ Excel</button>
          <button className="adm-btn adm-btn-primary" onClick={onCreateTest}>
            <PlusIcon />
            Tạo bài kiểm tra mới
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="adm-screen-body">
        {/* Filter strip */}
        <div className="adm-card adm-filter-strip">
          <div className="adm-search-wrap">
            <SearchIcon />
            <input
              className="adm-input"
              placeholder="Tìm theo tên, mã đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="adm-filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`adm-filter-tab${filter === tab ? ' active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <span className="adm-sort-label">
            Sắp xếp: <strong>Cập nhật mới nhất</strong>
          </span>
        </div>

        {/* Tests table */}
        <div className="adm-card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                {TABLE_HEADERS.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.id}>
                  {/* Name + ID */}
                  <td>
                    <div className="adm-test-name">{t.name}</div>
                    <div className="adm-test-id">{t.id}</div>
                  </td>

                  {/* Status */}
                  <td>
                    <StatusPill status={t.status} />
                  </td>

                  {/* Type */}
                  <td className="adm-col-type">{t.type}</td>

                  {/* Config */}
                  <td className="adm-col-config">
                    {t.questions} câu · {t.duration_min}&apos; · ≥{t.pass_score}%
                  </td>

                  {/* Taken */}
                  <td className="adm-col-num">
                    {t.taken > 0 ? fmt(t.taken) : <span className="adm-empty-val">—</span>}
                  </td>

                  {/* Pass rate */}
                  <td>
                    {t.taken > 0 ? (
                      <div className="adm-pass-rate">
                        <div className="adm-pass-bar">
                          <div
                            className={`adm-pass-fill${t.pass_rate < 70 ? ' warn' : ''}`}
                            style={{ width: `${t.pass_rate}%` }}
                          />
                        </div>
                        <span className="adm-pass-pct">{t.pass_rate}%</span>
                      </div>
                    ) : (
                      <span className="adm-empty-val">—</span>
                    )}
                  </td>

                  {/* Updated */}
                  <td className="adm-col-updated">{t.updated}</td>

                  {/* Actions */}
                  <td className="adm-col-actions">
                    <div className="adm-row-actions">
                      {t.status === 'Bản nháp' && (
                        <button
                          className="adm-btn adm-btn-primary adm-btn-sm"
                          onClick={() => publish(t.id)}
                        >
                          Xuất bản
                        </button>
                      )}
                      {t.status === 'Đang mở' && (
                        <button
                          className="adm-btn adm-btn-ghost adm-btn-sm"
                          onClick={() => archive(t.id)}
                        >
                          Lưu trữ
                        </button>
                      )}
                      <button
                        className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon"
                        title="Tuỳ chọn thêm"
                        aria-label="Tuỳ chọn thêm"
                      >
                        <DotsIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visible.length === 0 && (
            <div className="adm-empty-state">
              {search
                ? `Không tìm thấy bài nào khớp với "${search}".`
                : 'Không có bài kiểm tra nào trong danh mục này.'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

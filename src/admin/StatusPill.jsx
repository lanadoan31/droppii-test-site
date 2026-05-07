const PILL_STYLES = {
  'Đang mở':    { bg: 'var(--adm-success-100)', fg: 'var(--adm-success-700)', dot: 'var(--adm-success-500)' },
  'Bản nháp':   { bg: 'var(--adm-ink-100)',     fg: 'var(--adm-ink-700)',     dot: 'var(--adm-ink-400)'    },
  'Đã lưu trữ':{ bg: 'var(--adm-archive-bg)',   fg: 'var(--adm-archive-fg)',  dot: 'var(--adm-archive-dot)'},
  'Hoạt động':  { bg: 'var(--adm-success-100)', fg: 'var(--adm-success-700)', dot: 'var(--adm-success-500)' },
  'Cần ôn lại': { bg: 'var(--adm-warn-bg)',     fg: 'var(--adm-warn-fg)',     dot: 'var(--adm-warning-500)'},
  'Đang thi':   { bg: 'var(--adm-blue-100)',    fg: 'var(--adm-blue-700)',    dot: 'var(--adm-blue-500)'   },
  'đậu':        { bg: 'var(--adm-success-100)', fg: 'var(--adm-success-700)', dot: 'var(--adm-success-500)' },
  'rớt':        { bg: 'var(--adm-danger-100)',  fg: 'var(--adm-danger-700)',  dot: 'var(--adm-danger-500)' },
  'đang làm':   { bg: 'var(--adm-blue-100)',    fg: 'var(--adm-blue-700)',    dot: 'var(--adm-blue-500)'   },
};

const FALLBACK = { bg: 'var(--adm-ink-100)', fg: 'var(--adm-ink-700)', dot: 'var(--adm-ink-400)' };

export default function StatusPill({ status }) {
  const s = PILL_STYLES[status] ?? FALLBACK;
  return (
    <span
      className="adm-pill"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="adm-pill-dot" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

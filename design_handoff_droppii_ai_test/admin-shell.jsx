// Admin portal — shared shell + utility components.
// All UI in Vietnamese. Direction matches "A · clean corporate" from seller side.

const { useState: useStateAdmin, useEffect: useEffectAdmin, useMemo: useMemoAdmin } = React;

function AdmLogo({ size = 22 }) {
  return (
    <span className="dr-logo" style={{ fontSize: size, color:'var(--ink-900)' }}>
      <svg className="mark" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" style={{color:'var(--droppii-blue-700)'}}>
        <path d="M 34.149 5.618 C 30.246 1.875 25.548 0 20.062 0 C 14.499 0 9.76 1.875 5.857 5.618 C 1.954 9.367 0 13.907 0 19.248 C 0 22.512 0.753 25.488 2.26 28.164 C 2.26 28.175 2.255 28.181 2.249 28.192 L 0.041 38.034 C -0.235 39.253 0.971 40.304 2.213 39.92 L 12.109 36.865 C 14.54 37.864 17.189 38.372 20.062 38.372 C 25.548 38.372 30.24 36.504 34.143 32.754 C 38.051 29.011 40 24.505 40 19.248 C 40.006 13.907 38.051 9.367 34.149 5.618 Z M 30.104 16.504 C 30.01 21.806 25.242 26.143 19.714 25.956 C 14.334 25.776 10.031 21.535 10.031 16.335 C 10.031 16.318 10.031 16.301 10.031 16.284 C 10.043 14.5 12.268 13.506 13.71 14.641 C 15.441 16.002 17.654 16.82 20.068 16.82 C 22.458 16.82 24.648 16.019 26.372 14.686 C 27.85 13.54 30.116 14.562 30.104 16.391 C 30.104 16.425 30.104 16.465 30.104 16.504 Z"/>
      </svg>
      <span className="word" style={{fontWeight:700}}>droppii<span style={{color:'var(--droppii-orange-600)'}}>.</span></span>
      <span style={{fontSize: '.62em', fontWeight: 500, color:'var(--ink-500)', letterSpacing:'.04em', textTransform:'uppercase', marginLeft: 6, padding:'2px 6px', background:'var(--ink-100)', borderRadius:4}}>Admin</span>
    </span>
  );
}

const NAV_ITEMS = [
  { id:'dashboard', label:'Tổng quan', icon:'M3 12L12 3l9 9M5 10v10h14V10' },
  { id:'tests', label:'Bài kiểm tra', icon:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { id:'questions', label:'Ngân hàng câu hỏi', icon:'M9 8h6M9 12h6M9 16h3M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z' },
  { id:'sellers', label:'Nhà bán hàng', icon:'M16 11a4 4 0 100-8 4 4 0 000 8zM8 11a4 4 0 100-8 4 4 0 000 8zM2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M14 13h2a4 4 0 014 4v2' },
  { id:'analytics', label:'Phân tích & Kết quả', icon:'M3 21V9M9 21V3M15 21V13M21 21V7' },
  { id:'reports', label:'Báo cáo & Xuất file', icon:'M9 11l3 3 8-8M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
];

function AdmSidebar({ active, onNav }) {
  return (
    <aside style={{width: 232, background:'white', borderRight:'1px solid var(--ink-200)', display:'flex', flexDirection:'column', flexShrink:0}}>
      <div style={{padding:'18px 20px', borderBottom:'1px solid var(--ink-100)'}}>
        <AdmLogo/>
      </div>
      <nav style={{padding: 12, flex:1, overflow:'auto'}}>
        <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em', padding:'10px 12px 6px'}}>
          Quản lý
        </div>
        {NAV_ITEMS.map(it => {
          const isActive = it.id === active;
          return (
            <button
              key={it.id}
              onClick={() => onNav && onNav(it.id)}
              style={{
                display:'flex', alignItems:'center', gap: 10, width:'100%',
                padding:'9px 12px', marginBottom: 2,
                background: isActive ? 'var(--droppii-blue-50)' : 'transparent',
                color: isActive ? 'var(--droppii-blue-700)' : 'var(--ink-700)',
                border:'none', borderRadius: 'var(--r-sm)',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                cursor:'pointer', textAlign:'left',
                fontFamily:'inherit',
                transition:'background .12s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={it.icon}/>
              </svg>
              {it.label}
            </button>
          );
        })}
      </nav>
      <div style={{padding: 14, borderTop:'1px solid var(--ink-100)', display:'flex', alignItems:'center', gap: 10}}>
        <div style={{width: 32, height: 32, borderRadius:'50%', background:'var(--droppii-blue-700)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, flexShrink:0}}>
          {window.ADMIN.current_admin.initials}
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
            {window.ADMIN.current_admin.name}
          </div>
          <div style={{fontSize:11, color:'var(--ink-500)'}}>{window.ADMIN.current_admin.role}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
      </div>
    </aside>
  );
}

function AdmHeader({ title, subtitle, actions }) {
  return (
    <header style={{padding:'20px 28px', background:'white', borderBottom:'1px solid var(--ink-200)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, flexShrink:0}}>
      <div>
        <h1 style={{margin:'0 0 4px', fontSize: 22, fontWeight: 700, letterSpacing:'-0.01em', color:'var(--ink-900)'}}>{title}</h1>
        {subtitle && <div style={{fontSize:13, color:'var(--ink-500)'}}>{subtitle}</div>}
      </div>
      {actions && <div style={{display:'flex', gap: 10, alignItems:'center'}}>{actions}</div>}
    </header>
  );
}

function StatusPill({ status }) {
  const map = {
    'Đang mở':       { bg:'var(--success-100)', fg:'var(--success-700)', dot:'var(--success-500)' },
    'Bản nháp':      { bg:'var(--ink-100)', fg:'var(--ink-700)', dot:'var(--ink-500)' },
    'Đã lưu trữ':    { bg:'#f3e8ff', fg:'#6d28d9', dot:'#a78bfa' },
    'Hoạt động':     { bg:'var(--success-100)', fg:'var(--success-700)', dot:'var(--success-500)' },
    'Cần ôn lại':    { bg:'#fff4cc', fg:'#8a5800', dot:'var(--warning-500)' },
    'Đang thi':      { bg:'var(--droppii-blue-100)', fg:'var(--droppii-blue-700)', dot:'var(--droppii-blue-500)' },
    'đậu':           { bg:'var(--success-100)', fg:'var(--success-700)', dot:'var(--success-500)' },
    'rớt':           { bg:'var(--danger-100)', fg:'var(--danger-700)', dot:'var(--danger-500)' },
    'đang làm':      { bg:'var(--droppii-blue-100)', fg:'var(--droppii-blue-700)', dot:'var(--droppii-blue-500)' },
  };
  const s = map[status] || map['Bản nháp'];
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:6, padding:'3px 10px', borderRadius:99, background:s.bg, color:s.fg, fontSize:12, fontWeight:600, whiteSpace:'nowrap'}}>
      <span style={{width:6, height:6, borderRadius:'50%', background:s.dot}}/>
      {status}
    </span>
  );
}

// Tiny sparkline
function Spark({ data, color='var(--droppii-blue-700)', height=32, width=120 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(data.length-1)/(data.length-1)*width} cy={height - ((data[data.length-1] - min)/range)*(height-4)-2} r="3" fill={color}/>
    </svg>
  );
}

window.AdmLogo = AdmLogo;
window.AdmSidebar = AdmSidebar;
window.AdmHeader = AdmHeader;
window.StatusPill = StatusPill;
window.Spark = Spark;
window.NAV_ITEMS = NAV_ITEMS;

// Direction A — Clean Corporate Exam
// Tone: focused, professional, certification-style. Minimal chrome, strong typography,
// horizontal progress bar, single accent (Droppii blue).

const { useState, useEffect, useRef } = React;

function DirALogo({ size = 28 }) {
  return (
    <span className="dr-logo" style={{ fontSize: size }}>
      <svg className="mark" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
        <path d="M 34.149 5.618 C 30.246 1.875 25.548 0 20.062 0 C 14.499 0 9.76 1.875 5.857 5.618 C 1.954 9.367 0 13.907 0 19.248 C 0 22.512 0.753 25.488 2.26 28.164 C 2.26 28.175 2.255 28.181 2.249 28.192 L 0.041 38.034 C -0.235 39.253 0.971 40.304 2.213 39.92 L 12.109 36.865 C 14.54 37.864 17.189 38.372 20.062 38.372 C 25.548 38.372 30.24 36.504 34.143 32.754 C 38.051 29.011 40 24.505 40 19.248 C 40.006 13.907 38.051 9.367 34.149 5.618 Z M 30.104 16.504 C 30.01 21.806 25.242 26.143 19.714 25.956 C 14.334 25.776 10.031 21.535 10.031 16.335 C 10.031 16.318 10.031 16.301 10.031 16.284 C 10.043 14.5 12.268 13.506 13.71 14.641 C 15.441 16.002 17.654 16.82 20.068 16.82 C 22.458 16.82 24.648 16.019 26.372 14.686 C 27.85 13.54 30.116 14.562 30.104 16.391 C 30.104 16.425 30.104 16.465 30.104 16.504 Z" />
      </svg>
      <span className="word">droppii<span style={{color:'var(--droppii-orange-600)'}}>.</span></span>
    </span>
  );
}

// Stamp/seal SVG used on certificate + result hero
function DirAStamp() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <path id="dir-a-arc" d="M 60 60 m -45 0 a 45 45 0 1 1 90 0 a 45 45 0 1 1 -90 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="var(--droppii-blue-700)" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--droppii-blue-700)" strokeWidth="0.5" />
      <text fontSize="7.2" fontWeight="600" letterSpacing="2" fill="var(--droppii-blue-700)">
        <textPath href="#dir-a-arc" startOffset="0%">DROPPII · CERTIFIED · AI ADVISOR · 2026 · </textPath>
      </text>
      <g transform="translate(60 60)">
        <circle r="22" fill="var(--droppii-blue-700)" />
        <text textAnchor="middle" y="-2" fontSize="8" fill="white" fontWeight="600" letterSpacing="1">PASSED</text>
        <text textAnchor="middle" y="10" fontSize="14" fill="white" fontWeight="700">88%</text>
      </g>
    </svg>
  );
}

// ─── 1. Login ─────────────────────────────────────────────────────────────
function DirA_Login() {
  const [, force] = useState(0);
  React.useEffect(() => window.DroppiiSync && window.DroppiiSync.onChange(() => force(x => x+1)), []);
  const published = (window.DroppiiSync ? window.DroppiiSync.getPublishedTests() : []);
  return (
    <div className="dr-app dirA" style={{height: '100%', background: 'var(--paper)', display:'flex'}}>
      <div style={{flex:'1 1 56%', padding: '56px 64px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <DirALogo size={26} />
        <div style={{maxWidth: 420}}>
          <div className="dr-chip dr-chip-blue" style={{marginBottom: 20}}>Đợt T05/2026 · Đang mở</div>
          <h1 style={{fontSize: 40, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.02em', fontWeight: 700}}>
            Bài kiểm tra Kiến thức AI<br/>
            <span style={{color: 'var(--droppii-blue-700)'}}>cho Nhà bán hàng</span>
          </h1>
          <p style={{color: 'var(--ink-600)', margin: '0 0 32px', fontSize: 16, lineHeight: 1.55}}>
            Hoàn thành bài kiểm tra để nhận chứng nhận năng lực tư vấn TPCN có hỗ trợ AI cho khách hàng của Droppii.
          </p>
          <div style={{display:'grid', gap: 14}}>
            <label style={{display:'block'}}>
              <span style={{fontSize:13, fontWeight:600, color:'var(--ink-700)', display:'block', marginBottom:6}}>Mã nhà bán hàng</span>
              <input className="dr-input" defaultValue="DRP-58294" />
            </label>
            <label style={{display:'block'}}>
              <span style={{fontSize:13, fontWeight:600, color:'var(--ink-700)', display:'block', marginBottom:6}}>Bài kiểm tra đang mở</span>
              <select className="dr-input" style={{height: 44}}>
                {published.length === 0 && <option>(chưa có bài kiểm tra nào được xuất bản)</option>}
                {published.map(t => <option key={t.id}>{t.id} — {t.name}</option>)}
              </select>
              <span style={{fontSize:11, color:'var(--success-700)', marginTop:5, display:'inline-flex', alignItems:'center', gap:5}}>
                <span style={{width:6, height:6, borderRadius:'50%', background:'var(--success-500)'}}/>
                Đồng bộ trực tiếp với hệ thống Admin · {published.length} bài đang mở
              </span>
            </label>
            <button className="dr-btn dr-btn-primary dr-btn-lg dr-btn-block" style={{marginTop: 8}}>
              Đăng nhập để bắt đầu →
            </button>
            <a href="#" style={{fontSize:13, color:'var(--ink-600)', textDecoration:'none', marginTop:4}}>Quên mật khẩu?</a>
          </div>
        </div>
        <div style={{fontSize: 12, color: 'var(--ink-500)'}}>
          © 2026 Droppii Business · Hệ thống đào tạo & chứng nhận nội bộ
        </div>
      </div>
      <div style={{flex:'1 1 44%', background: 'var(--droppii-blue-700)', position:'relative', overflow:'hidden', color:'white', padding: '56px 48px'}}>
        {/* Pattern of droplets */}
        <svg style={{position:'absolute', inset:0, opacity:0.08}} viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({length: 18}).map((_, i) => (
            <g key={i} transform={`translate(${(i%5)*90 + (i%2)*30} ${Math.floor(i/5)*120 + 40}) scale(0.6)`}>
              <path d="M 34 5.6 C 30 1.9 25.5 0 20 0 C 14.5 0 9.8 1.9 5.9 5.6 C 2 9.4 0 13.9 0 19.2 C 0 22.5 0.8 25.5 2.3 28.2 L 0 38 C -0.2 39.3 1 40.3 2.2 39.9 L 12.1 36.9 C 14.5 37.9 17.2 38.4 20.1 38.4 C 25.5 38.4 30.2 36.5 34.1 32.8 C 38.1 29 40 24.5 40 19.2 C 40 13.9 38.1 9.4 34 5.6 Z" fill="white"/>
            </g>
          ))}
        </svg>
        <div style={{position:'relative', zIndex:1, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
          <div className="dr-chip" style={{background:'rgba(255,255,255,.15)', color:'white', alignSelf:'flex-start'}}>DRP-AI-2026</div>
          <div>
            <div style={{fontSize: 13, opacity: .8, fontWeight: 500, marginBottom: 16, letterSpacing: '.04em', textTransform:'uppercase'}}>Bộ chứng nhận năm 2026</div>
            <h2 style={{fontSize: 28, lineHeight: 1.25, margin:0, fontWeight: 600, letterSpacing:'-0.01em'}}>
              "Tư vấn an toàn — chính xác — có trách nhiệm với sự hỗ trợ của AI."
            </h2>
            <div style={{marginTop: 28, display:'flex', gap: 28, fontSize: 13, opacity: .85}}>
              <div><b style={{display:'block', fontSize:22, fontWeight:700}}>20</b>câu hỏi</div>
              <div><b style={{display:'block', fontSize:22, fontWeight:700}}>30'</b>thời gian làm</div>
              <div><b style={{display:'block', fontSize:22, fontWeight:700}}>70%</b>điểm đậu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.DirA_Login = DirA_Login;
window.DirALogo = DirALogo;
window.DirAStamp = DirAStamp;

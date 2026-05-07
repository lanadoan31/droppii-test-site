// Direction B — Warm, Human-Centered
// Tone: encouraging, narrative, warmer typography, generous spacing,
// orange accent + soft blue, illustrated touches.
// Builds same flow (login → test → result) but with more visual warmth.

const { useState: useStateB, useEffect: useEffectB } = React;

function DirBLogo({ size = 28, mono }) {
  const c = mono ? 'currentColor' : 'var(--droppii-orange-600)';
  return (
    <span className="dr-logo" style={{ fontSize: size }}>
      <svg viewBox="0 0 40 40" width="1.2em" height="1.2em" style={{color: c}} fill="currentColor">
        <path d="M 34.149 5.618 C 30.246 1.875 25.548 0 20.062 0 C 14.499 0 9.76 1.875 5.857 5.618 C 1.954 9.367 0 13.907 0 19.248 C 0 22.512 0.753 25.488 2.26 28.164 C 2.26 28.175 2.255 28.181 2.249 28.192 L 0.041 38.034 C -0.235 39.253 0.971 40.304 2.213 39.92 L 12.109 36.865 C 14.54 37.864 17.189 38.372 20.062 38.372 C 25.548 38.372 30.24 36.504 34.143 32.754 C 38.051 29.011 40 24.505 40 19.248 C 40.006 13.907 38.051 9.367 34.149 5.618 Z M 30.104 16.504 C 30.01 21.806 25.242 26.143 19.714 25.956 C 14.334 25.776 10.031 21.535 10.031 16.335 C 10.031 16.318 10.031 16.301 10.031 16.284 C 10.043 14.5 12.268 13.506 13.71 14.641 C 15.441 16.002 17.654 16.82 20.068 16.82 C 22.458 16.82 24.648 16.019 26.372 14.686 C 27.85 13.54 30.116 14.562 30.104 16.391 C 30.104 16.425 30.104 16.465 30.104 16.504 Z" />
      </svg>
      <span className="word">droppii</span>
    </span>
  );
}

// Decorative pattern of brand droplets — rhythmic, warm
function DirBPattern() {
  const items = [
    {x: 8, y: 12, s: 1, c: 'var(--droppii-orange-100)'},
    {x: 80, y: 18, s: .7, c: 'var(--droppii-blue-100)'},
    {x: 30, y: 70, s: 1.4, c: 'var(--droppii-mint-100)'},
    {x: 68, y: 55, s: .9, c: 'var(--droppii-orange-100)'},
    {x: 12, y: 85, s: .6, c: 'var(--droppii-blue-100)'},
    {x: 88, y: 88, s: 1.1, c: 'var(--droppii-orange-100)'},
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
      {items.map((it, i) => (
        <g key={i} transform={`translate(${it.x} ${it.y}) scale(${it.s * 0.18})`}>
          <path d="M 34 5.6 C 30 1.9 25.5 0 20 0 C 14.5 0 9.8 1.9 5.9 5.6 C 2 9.4 0 13.9 0 19.2 C 0 22.5 0.8 25.5 2.3 28.2 L 0 38 C -0.2 39.3 1 40.3 2.2 39.9 L 12.1 36.9 C 14.5 37.9 17.2 38.4 20.1 38.4 C 25.5 38.4 30.2 36.5 34.1 32.8 C 38.1 29 40 24.5 40 19.2 C 40 13.9 38.1 9.4 34 5.6 Z" fill={it.c}/>
        </g>
      ))}
    </svg>
  );
}

// ─── 1. Login (warm) ─────────────────────────────────────────────────────
function DirB_Login() {
  return (
    <div className="dr-app dirB" style={{height:'100%', background:'#fcfaf6', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>
      <DirBPattern/>
      <header style={{position:'relative', padding:'24px 40px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <DirBLogo size={26}/>
        <div style={{fontSize:13, color:'var(--ink-600)'}}>Cần hỗ trợ? <a href="#" style={{color:'var(--droppii-orange-700)', fontWeight:600, textDecoration:'none'}}>Liên hệ trainer</a></div>
      </header>
      <div style={{flex:1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding: '20px 40px 40px'}}>
        <div style={{maxWidth: 460, width:'100%', position:'relative', zIndex:1}}>
          {/* Illustrated badge */}
          <div style={{display:'flex', justifyContent:'center', marginBottom: 20}}>
            <div style={{width: 88, height: 88, borderRadius: '50%', background:'white', border:'1px solid var(--ink-200)', boxShadow:'var(--sh-2)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="dirb-grad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--droppii-orange-500)"/>
                    <stop offset="1" stopColor="var(--droppii-orange-700)"/>
                  </linearGradient>
                </defs>
                <path d="M12 2l2.5 5.2L20 8l-4 4 1 5.7L12 15l-5 2.7L8 12 4 8l5.5-.8z" fill="url(#dirb-grad)"/>
              </svg>
              <div style={{position:'absolute', bottom:-4, right:-4, width:28, height:28, borderRadius:'50%', background:'var(--droppii-blue-700)', color:'white', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white'}}>AI</div>
            </div>
          </div>
          <h1 style={{textAlign:'center', fontSize: 34, lineHeight: 1.15, margin:'0 0 12px', letterSpacing:'-0.02em', fontWeight: 700, color:'var(--ink-900)'}}>
            Sẵn sàng cho<br/>buổi kiểm tra hôm nay?
          </h1>
          <p style={{textAlign:'center', color:'var(--ink-600)', margin:'0 0 32px', fontSize:15, lineHeight:1.55}}>
            Bài kiểm tra giúp bạn tự tin hơn khi sử dụng AI để tư vấn TPCN cho khách. Hãy thoải mái — chúng ta cùng làm tốt nhé. 🌱
          </p>

          <div className="dr-card" style={{padding: 24, borderRadius:'var(--r-xl)', boxShadow:'var(--sh-2)'}}>
            <label style={{display:'block', marginBottom: 14}}>
              <span style={{fontSize:13, fontWeight:600, color:'var(--ink-700)', display:'block', marginBottom:6}}>Mã nhà bán hàng</span>
              <input className="dr-input" defaultValue="DRP-58294"/>
            </label>
            <label style={{display:'block', marginBottom: 18}}>
              <span style={{fontSize:13, fontWeight:600, color:'var(--ink-700)', display:'block', marginBottom:6}}>Mật khẩu</span>
              <input className="dr-input" type="password" defaultValue="••••••••"/>
            </label>
            <button className="dr-btn dr-btn-warm dr-btn-lg dr-btn-block" style={{borderRadius:'var(--r-md)'}}>
              Bắt đầu — Tôi đã sẵn sàng
            </button>
            <div style={{display:'flex', gap: 8, marginTop: 14, padding: 12, background:'var(--droppii-blue-50)', borderRadius: 'var(--r-md)', fontSize:13, color:'var(--droppii-blue-800)'}}>
              <span>ℹ️</span>
              <span>Bạn có <b>30 phút</b> và có thể tạm dừng giữa chừng. Mọi câu trả lời đều được lưu tự động.</span>
            </div>
          </div>

          <div style={{textAlign:'center', marginTop: 20, fontSize: 12, color:'var(--ink-500)'}}>
            "Học để tư vấn tốt hơn — không phải để vượt qua bài thi" · Droppii Academy
          </div>
        </div>
      </div>
    </div>
  );
}

window.DirB_Login = DirB_Login;
window.DirBLogo = DirBLogo;
window.DirBPattern = DirBPattern;

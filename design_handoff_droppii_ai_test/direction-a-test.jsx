// Direction A — In-test screen (the main / hero screen)
// Clean exam: top progress bar, question card, sticky bottom action bar.

const { useState: useStateA2, useEffect: useEffectA2 } = React;

function DirA_Test() {
  const Q = window.QUIZ.questions[2]; // the medical scenario question (#7)
  const [selected, setSelected] = useStateA2(1);
  const [secondsLeft, setSecondsLeft] = useStateA2(18 * 60 + 42);
  const total = window.QUIZ.test.questions_total;
  const current = 7;
  const pct = (current / total) * 100;

  useEffectA2(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="dr-app dirA" style={{height:'100%', background:'var(--ink-50)', display:'flex', flexDirection:'column'}}>
      {/* Top bar */}
      <header style={{height: 64, background:'white', borderBottom:'1px solid var(--ink-200)', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', gap: 24}}>
          <DirALogo size={22} />
          <div style={{width: 1, height: 24, background:'var(--ink-200)'}} />
          <div>
            <div style={{fontSize: 13, fontWeight: 600, color:'var(--ink-900)'}}>Bài kiểm tra Kiến thức AI</div>
            <div style={{fontSize: 11, color:'var(--ink-500)'}}>Mã đề: DRP-AI-2026 · Đợt T05/2026</div>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 16}}>
          <div className="dr-chip" style={{background:'var(--ink-100)'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            Còn lại <b style={{fontVariantNumeric:'tabular-nums'}}>{mm}:{ss}</b>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <div style={{width:30, height:30, borderRadius:'50%', background:'var(--droppii-blue-700)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12}}>
              {window.QUIZ.seller.avatar_initials}
            </div>
            <div style={{fontSize:12}}>
              <div style={{fontWeight:600}}>{window.QUIZ.seller.name}</div>
              <div style={{color:'var(--ink-500)'}}>{window.QUIZ.seller.id}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{padding:'14px 32px 0', background:'var(--ink-50)'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8}}>
          <div style={{fontSize:13, color:'var(--ink-700)'}}>
            Câu <b style={{color:'var(--ink-900)'}}>{current}</b> / {total}
          </div>
          <div style={{fontSize:12, color:'var(--ink-500)'}}>{Math.round(pct)}% hoàn thành</div>
        </div>
        <div style={{height: 6, background:'var(--ink-200)', borderRadius:99, overflow:'hidden'}}>
          <div style={{height:'100%', width: pct + '%', background:'var(--droppii-blue-700)', transition:'width .3s'}} />
        </div>
        {/* question dots */}
        <div style={{display:'flex', gap:5, marginTop:14, flexWrap:'wrap'}}>
          {Array.from({length: total}).map((_, i) => {
            const n = i + 1;
            const state = n < current ? 'done' : n === current ? 'cur' : 'todo';
            const bg = state === 'done' ? 'var(--droppii-blue-700)' : state === 'cur' ? 'white' : 'var(--ink-100)';
            const border = state === 'cur' ? '2px solid var(--droppii-blue-700)' : '1px solid var(--ink-200)';
            const color = state === 'done' ? 'white' : state === 'cur' ? 'var(--droppii-blue-700)' : 'var(--ink-500)';
            return (
              <div key={n} style={{width: 28, height: 28, borderRadius: 6, background: bg, border, color, fontSize: 12, fontWeight: 600, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {n}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question card */}
      <main style={{flex:1, padding:'24px 32px 0', overflow:'auto'}}>
        <div style={{maxWidth: 760, margin:'0 auto'}}>
          <div className="dr-card" style={{padding: '28px 32px'}}>
            <div style={{display:'flex', gap:8, marginBottom: 18, flexWrap:'wrap'}}>
              <span className="dr-chip dr-chip-blue">Câu {Q.id}</span>
              <span className="dr-chip">{Q.topic}</span>
              <span className="dr-chip dr-chip-warn">Tình huống · 1 đáp án đúng</span>
              <span className="dr-chip" style={{marginLeft:'auto'}}>+5 điểm</span>
            </div>
            <div style={{fontSize: 17, lineHeight: 1.6, color:'var(--ink-900)', whiteSpace:'pre-wrap', marginBottom: 24, fontWeight: 500}}>
              {Q.stem}
            </div>
            <div style={{display:'grid', gap: 10}}>
              {Q.options.map((opt, i) => {
                const isSel = selected === i;
                const letter = String.fromCharCode(65 + i);
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    style={{
                      textAlign:'left',
                      padding:'16px 18px',
                      border: isSel ? '2px solid var(--droppii-blue-700)' : '1.5px solid var(--ink-200)',
                      background: isSel ? 'var(--droppii-blue-50)' : 'white',
                      borderRadius: 'var(--r-md)',
                      cursor:'pointer',
                      display:'flex', alignItems:'flex-start', gap: 14,
                      transition:'border-color .12s, background .12s',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: isSel ? 'var(--droppii-blue-700)' : 'white',
                      color: isSel ? 'white' : 'var(--ink-700)',
                      border: isSel ? 'none' : '1.5px solid var(--ink-300)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: 13, fontWeight: 700,
                    }}>{letter}</div>
                    <span style={{fontSize:15, lineHeight:1.5, color:'var(--ink-800)', paddingTop: 4}}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:16, fontSize:13, color:'var(--ink-500)', justifyContent:'center'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l1.5 6 6 1-4.5 4 1.5 6L12 16l-5.5 3 1.5-6L3.5 9l6-1z"/></svg>
            Đánh dấu để xem lại
          </div>
        </div>
      </main>

      {/* Sticky action bar */}
      <footer style={{flexShrink:0, padding:'16px 32px', background:'white', borderTop:'1px solid var(--ink-200)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <button className="dr-btn dr-btn-ghost">← Câu trước</button>
        <div style={{fontSize:12, color:'var(--ink-500)'}}>Câu trả lời được lưu tự động</div>
        <button className="dr-btn dr-btn-primary">Câu tiếp →</button>
      </footer>
    </div>
  );
}
window.DirA_Test = DirA_Test;

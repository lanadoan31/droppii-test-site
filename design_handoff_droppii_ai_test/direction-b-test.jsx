// Direction B — Test screen (warm, narrative)
// Vertical progress on left + chat-bubble style question card

const { useState: useStateB2, useEffect: useEffectB2 } = React;

function DirB_Test() {
  const Q = window.QUIZ.questions[2];
  const [selected, setSelected] = useStateB2(1);
  const [secondsLeft, setSecondsLeft] = useStateB2(18 * 60 + 42);
  const total = window.QUIZ.test.questions_total;
  const current = 7;

  useEffectB2(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const timePct = (Q.time_sec - 32) / Q.time_sec * 100;

  return (
    <div className="dr-app dirB" style={{height:'100%', background:'#fcfaf6', display:'flex', flexDirection:'column'}}>
      {/* Top: warm bar with seller greeting */}
      <header style={{padding:'18px 36px', background:'white', borderBottom:'1px solid var(--ink-200)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', gap: 16}}>
          <DirBLogo size={22}/>
          <div style={{width:1, height: 22, background:'var(--ink-200)'}}/>
          <div style={{fontSize:13, color:'var(--ink-700)'}}>
            Chào <b style={{color:'var(--ink-900)'}}>{window.QUIZ.seller.name.split(' ').slice(-2).join(' ')}</b>, bạn đang làm rất tốt 👏
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 12}}>
          <button className="dr-btn dr-btn-ghost" style={{height:36, fontSize:13, padding:'0 12px'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
            Tạm dừng
          </button>
          <div style={{padding:'8px 14px', background:'var(--droppii-orange-100)', color:'var(--droppii-orange-700)', borderRadius:99, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            <span style={{fontVariantNumeric:'tabular-nums'}}>{mm}:{ss}</span>
          </div>
        </div>
      </header>

      <div style={{flex:1, display:'flex', minHeight:0}}>
        {/* Left rail — vertical progress */}
        <aside style={{width: 220, padding:'28px 20px', borderRight:'1px solid var(--ink-200)', background:'white', overflow:'auto', flexShrink:0}}>
          <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom: 14}}>Tiến độ</div>
          <div style={{display:'flex', alignItems:'baseline', gap:6, marginBottom: 4}}>
            <span style={{fontSize: 36, fontWeight: 700, color:'var(--droppii-orange-600)', letterSpacing:'-0.02em', lineHeight: 1}}>{current}</span>
            <span style={{fontSize: 16, color:'var(--ink-500)'}}>/ {total}</span>
          </div>
          <div style={{fontSize: 12, color:'var(--ink-500)', marginBottom: 22}}>câu đã hoàn thành</div>

          {/* mini map of question states grouped by topic */}
          {[
            {topic:'Cơ bản về AI', range:[1,4], done:[1,2,3,4]},
            {topic:'Đạo đức & Tuân thủ', range:[5,9], done:[5,6], cur:7},
            {topic:'Tình huống lâm sàng', range:[10,14], done:[]},
            {topic:'Sản phẩm Droppii', range:[15,17], done:[]},
            {topic:'Tư vấn cá nhân hoá', range:[18,20], done:[]},
          ].map((g, gi) => (
            <div key={gi} style={{marginBottom: 18}}>
              <div style={{fontSize:11, color:'var(--ink-600)', fontWeight:600, marginBottom: 8}}>{g.topic}</div>
              <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
                {Array.from({length: g.range[1] - g.range[0] + 1}).map((_, i) => {
                  const n = g.range[0] + i;
                  const isCur = n === g.cur;
                  const isDone = g.done.includes(n);
                  const bg = isCur ? 'var(--droppii-orange-600)' : isDone ? 'var(--droppii-blue-100)' : 'var(--ink-100)';
                  const color = isCur ? 'white' : isDone ? 'var(--droppii-blue-700)' : 'var(--ink-500)';
                  return (
                    <div key={n} style={{width:24, height:24, borderRadius:6, background:bg, color, fontSize:11, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center'}}>{n}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Main — question with bubble + scenario */}
        <main style={{flex:1, overflow:'auto', padding:'32px 40px'}}>
          <div style={{maxWidth: 720, margin:'0 auto'}}>
            {/* Topic banner */}
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom: 20}}>
              <div style={{width:40, height:40, borderRadius:12, background:'var(--droppii-orange-100)', color:'var(--droppii-orange-700)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>🧪</div>
              <div>
                <div style={{fontSize:11, color:'var(--ink-500)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em'}}>Tình huống lâm sàng</div>
                <div style={{fontSize:14, color:'var(--ink-700)', fontWeight:500}}>Câu {Q.id} · 1 đáp án đúng · 2 phút</div>
              </div>
              <div style={{flex:1}}/>
              <div style={{width: 90, height:4, background:'var(--ink-200)', borderRadius:99, overflow:'hidden'}}>
                <div style={{height:'100%', width: timePct + '%', background:'var(--droppii-orange-600)'}}/>
              </div>
            </div>

            {/* Scenario as a "patient case" card */}
            <div style={{background:'white', border:'1px solid var(--ink-200)', borderRadius:'var(--r-xl)', padding:'24px 28px', marginBottom: 16, boxShadow:'var(--sh-1)', position:'relative'}}>
              <div style={{position:'absolute', top:-12, left: 24, background:'var(--droppii-blue-700)', color:'white', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:99, letterSpacing:'.04em'}}>HỒ SƠ KHÁCH HÀNG</div>
              <div style={{fontSize: 16, lineHeight: 1.65, color:'var(--ink-800)', whiteSpace:'pre-wrap'}}>
                {Q.stem.split('\n\n')[0]}
              </div>
            </div>

            {/* Question prompt as warm bubble */}
            <div style={{display:'flex', gap: 12, marginBottom: 20, alignItems:'flex-start'}}>
              <div style={{width:32, height:32, borderRadius:'50%', background:'var(--droppii-blue-700)', color:'white', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700}}>Q</div>
              <div style={{background:'var(--droppii-blue-50)', border:'1px solid var(--droppii-blue-100)', borderRadius:'4px 16px 16px 16px', padding:'14px 18px', fontSize:16, fontWeight:600, color:'var(--ink-900)'}}>
                Nhận định nào đúng nhất?
              </div>
            </div>

            {/* Options - card style */}
            <div style={{display:'grid', gap: 10, marginBottom: 24}}>
              {Q.options.map((opt, i) => {
                const isSel = selected === i;
                const letter = String.fromCharCode(65 + i);
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    style={{
                      textAlign:'left',
                      padding:'14px 18px',
                      border: isSel ? '2px solid var(--droppii-orange-600)' : '1.5px solid var(--ink-200)',
                      background: isSel ? '#fff7f1' : 'white',
                      borderRadius: 'var(--r-lg)',
                      cursor:'pointer',
                      display:'flex', alignItems:'center', gap: 14,
                      fontFamily:'inherit',
                      transition:'all .12s',
                      boxShadow: isSel ? '0 4px 12px rgba(238, 90, 34, .12)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink:0,
                      background: isSel ? 'var(--droppii-orange-600)' : 'white',
                      color: isSel ? 'white' : 'var(--ink-600)',
                      border: isSel ? 'none' : '1.5px solid var(--ink-300)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: 13, fontWeight: 700,
                    }}>{letter}</div>
                    <span style={{fontSize:15, lineHeight:1.5, color:'var(--ink-800)', flex:1}}>{opt}</span>
                    {isSel && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--droppii-orange-600)" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <button className="dr-btn dr-btn-ghost">← Câu trước</button>
              <div style={{display:'flex', gap: 12}}>
                <button className="dr-btn dr-btn-secondary">Đánh dấu xem lại</button>
                <button className="dr-btn dr-btn-warm">Câu tiếp →</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.DirB_Test = DirB_Test;

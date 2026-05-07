// Direction B — Result screen (warm, celebratory)
function DirB_Result() {
  const score = 88;
  const correct = 18;
  const total = 20;

  return (
    <div className="dr-app dirB" style={{height:'100%', background:'#fcfaf6', overflow:'auto', position:'relative'}}>
      {/* confetti pattern */}
      <svg style={{position:'absolute', top:0, left:0, right:0, height:200, width:'100%', opacity:.6}} viewBox="0 0 600 200" preserveAspectRatio="none">
        {Array.from({length: 30}).map((_, i) => {
          const colors = ['var(--droppii-orange-500)','var(--droppii-blue-500)','var(--droppii-yellow)','var(--droppii-mint)'];
          return <circle key={i} cx={Math.random()*600} cy={Math.random()*200} r={2 + Math.random()*4} fill={colors[i%4]}/>;
        })}
      </svg>

      <header style={{position:'relative', padding:'24px 36px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <DirBLogo size={22}/>
        <button className="dr-btn dr-btn-ghost" style={{height:36, padding:'0 14px'}}>Trang chủ</button>
      </header>

      <main style={{maxWidth: 760, margin:'0 auto', padding:'12px 36px 40px', position:'relative'}}>
        {/* Hero */}
        <div style={{textAlign:'center', marginBottom: 32}}>
          <div style={{fontSize: 64, marginBottom: 8}}>🎉</div>
          <h1 style={{margin:'0 0 10px', fontSize: 36, letterSpacing:'-0.02em', fontWeight: 700, lineHeight:1.15}}>
            Tuyệt vời, {window.QUIZ.seller.name.split(' ').slice(-1)[0]}!
          </h1>
          <p style={{margin:'0 auto', maxWidth: 480, color:'var(--ink-600)', fontSize: 16, lineHeight: 1.55}}>
            Bạn đã đậu bài kiểm tra <b>Kiến thức AI cho Nhà bán hàng</b>. Khách hàng sẽ rất tin tưởng khi được bạn tư vấn.
          </p>
        </div>

        {/* Score donut + tiles */}
        <div className="dr-card" style={{padding: 32, borderRadius: 'var(--r-xl)', marginBottom: 20, display:'flex', gap: 32, alignItems:'center'}}>
          <div style={{position:'relative', width: 160, height: 160, flexShrink:0}}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="64" fill="none" stroke="var(--ink-100)" strokeWidth="14"/>
              <circle cx="80" cy="80" r="64" fill="none"
                stroke="var(--droppii-orange-600)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${score / 100 * 402} 402`}
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
              <div style={{fontSize:42, fontWeight:700, color:'var(--ink-900)', letterSpacing:'-0.02em', lineHeight:1}}>{score}<span style={{fontSize:20, color:'var(--ink-500)'}}>%</span></div>
              <div style={{fontSize:11, color:'var(--ink-500)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em', marginTop:4}}>Điểm tổng</div>
            </div>
          </div>
          <div style={{flex:1}}>
            <div className="dr-chip dr-chip-success" style={{marginBottom: 12}}>● ĐẠT chứng nhận Droppii AI Advisor</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginBottom: 18}}>
              <div>
                <div style={{fontSize:12, color:'var(--ink-500)', marginBottom:4}}>Câu đúng</div>
                <div style={{fontSize:22, fontWeight:700}}>{correct}/{total}</div>
              </div>
              <div>
                <div style={{fontSize:12, color:'var(--ink-500)', marginBottom:4}}>Thời gian làm bài</div>
                <div style={{fontSize:22, fontWeight:700}}>24:18</div>
              </div>
              <div>
                <div style={{fontSize:12, color:'var(--ink-500)', marginBottom:4}}>Xếp loại</div>
                <div style={{fontSize:22, fontWeight:700, color:'var(--droppii-orange-600)'}}>Giỏi</div>
              </div>
              <div>
                <div style={{fontSize:12, color:'var(--ink-500)', marginBottom:4}}>Hiệu lực đến</div>
                <div style={{fontSize:22, fontWeight:700}}>05/2027</div>
              </div>
            </div>
            <div style={{display:'flex', gap:10}}>
              <button className="dr-btn dr-btn-warm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
                Tải chứng nhận
              </button>
              <button className="dr-btn dr-btn-secondary">Chia sẻ</button>
            </div>
          </div>
        </div>

        {/* Highlight reel */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginBottom: 20}}>
          <div style={{padding:'20px 22px', background:'var(--mint-bg, var(--droppii-mint-100))', borderRadius:'var(--r-lg)', border:'1px solid #c8e8db'}}>
            <div style={{fontSize:11, fontWeight:700, color:'#0d6b50', textTransform:'uppercase', letterSpacing:'.06em', marginBottom: 8}}>✨ Điểm mạnh</div>
            <div style={{fontSize:14, color:'var(--ink-800)', lineHeight:1.55}}>
              Nắm chắc <b>nguyên tắc đạo đức khi dùng AI</b> và phân biệt rõ vai trò TPCN vs thuốc điều trị trong các tình huống lâm sàng.
            </div>
          </div>
          <div style={{padding:'20px 22px', background:'#fff8e6', borderRadius:'var(--r-lg)', border:'1px solid #ffe39a'}}>
            <div style={{fontSize:11, fontWeight:700, color:'#7a4e00', textTransform:'uppercase', letterSpacing:'.06em', marginBottom: 8}}>💡 Cần ôn thêm</div>
            <div style={{fontSize:14, color:'var(--ink-800)', lineHeight:1.55}}>
              Kỹ năng <b>cá nhân hoá tư vấn</b> theo từng nhóm khách hàng. <a href="#" style={{color:'var(--droppii-orange-700)', fontWeight:600}}>Mở module 5 →</a>
            </div>
          </div>
        </div>

        {/* Story strip — what happens next */}
        <div className="dr-card" style={{padding:'22px 26px', borderRadius:'var(--r-lg)'}}>
          <div style={{fontSize:14, fontWeight:600, marginBottom:14}}>Tiếp theo của bạn</div>
          <div style={{display:'grid', gap:12}}>
            {[
              {ico:'📧', t:'Kết quả đã gửi đến quản lý khu vực', sub: window.QUIZ.seller.region + ' · vừa gửi'},
              {ico:'🏷️', t:'Huy hiệu "AI Advisor 2026" được kích hoạt', sub:'Hiển thị trên hồ sơ Droppii của bạn'},
              {ico:'📚', t:'Mở khoá khoá học nâng cao "AI cho tư vấn chuyên sâu"', sub:'4 module · ~2 giờ'},
            ].map((it, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:14, padding:'10px 0', borderTop: i ? '1px solid var(--ink-100)' : 'none'}}>
                <div style={{width:36, height:36, borderRadius:'50%', background:'var(--ink-100)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>{it.ico}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:500, color:'var(--ink-900)'}}>{it.t}</div>
                  <div style={{fontSize:12, color:'var(--ink-500)'}}>{it.sub}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400)" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
window.DirB_Result = DirB_Result;

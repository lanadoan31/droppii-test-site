// Direction A — Result + Certificate screen
const { useState: useStateA3 } = React;

function DirA_Result() {
  const score = 88;
  const correct = 18;
  const total = 20;
  const passed = score >= 70;

  return (
    <div className="dr-app dirA" style={{height:'100%', background:'var(--ink-50)', overflow:'auto'}}>
      <header style={{height: 64, background:'white', borderBottom:'1px solid var(--ink-200)', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <DirALogo size={22} />
        <button className="dr-btn dr-btn-ghost" style={{height: 36, padding:'0 14px'}}>Trở về Trang chủ</button>
      </header>

      <main style={{maxWidth: 880, margin:'0 auto', padding:'40px 32px'}}>
        {/* Hero result card */}
        <div className="dr-card" style={{padding: '36px 40px', marginBottom: 24, display:'flex', gap: 32, alignItems:'center'}}>
          <DirAStamp />
          <div style={{flex:1}}>
            <div className="dr-chip dr-chip-success" style={{marginBottom: 12}}>● Đạt yêu cầu chứng nhận</div>
            <h1 style={{margin:'0 0 6px', fontSize: 32, letterSpacing:'-0.02em', fontWeight: 700}}>
              Chúc mừng, {window.QUIZ.seller.name.split(' ').slice(-1)[0]}!
            </h1>
            <p style={{margin: 0, color:'var(--ink-600)', fontSize: 15, lineHeight: 1.55}}>
              Bạn đã hoàn thành bài kiểm tra <b>Kiến thức AI cho Nhà bán hàng — DRP-AI-2026</b> với kết quả đạt chuẩn Droppii. Chứng nhận có hiệu lực đến <b>05/2027</b>.
            </p>
            <div style={{display:'flex', gap: 12, marginTop: 24}}>
              <button className="dr-btn dr-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
                Tải chứng nhận PDF
              </button>
              <button className="dr-btn dr-btn-secondary">Xem giải thích đáp án</button>
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12, marginBottom: 24}}>
          {[
            {label:'Điểm tổng', value: score + '%', accent:'var(--droppii-blue-700)'},
            {label:'Câu đúng', value: `${correct}/${total}`, accent:'var(--success-700)'},
            {label:'Thời gian', value: '24:18', accent:'var(--ink-900)'},
            {label:'Xếp loại', value: 'Giỏi', accent:'var(--droppii-orange-600)'},
          ].map(s => (
            <div key={s.label} className="dr-card" style={{padding:'18px 20px'}}>
              <div style={{fontSize:12, color:'var(--ink-500)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6}}>{s.label}</div>
              <div style={{fontSize: 28, fontWeight: 700, color: s.accent, letterSpacing:'-0.02em'}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Topic breakdown */}
        <div className="dr-card" style={{padding:'24px 28px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 18}}>
            <h3 style={{margin:0, fontSize:16, fontWeight:600}}>Phân tích theo chủ đề</h3>
            <span style={{fontSize:12, color:'var(--ink-500)'}}>5 lĩnh vực · so với chuẩn 70%</span>
          </div>
          <div style={{display:'grid', gap: 14}}>
            {[
              {topic:'Cơ bản về AI & cách AI hỗ trợ tư vấn', score: 100, count:'4/4'},
              {topic:'Đạo đức & Tuân thủ khi dùng AI', score: 90, count:'4.5/5'},
              {topic:'Tình huống lâm sàng có hỗ trợ TPCN', score: 83, count:'5/6'},
              {topic:'Kiến thức sản phẩm Droppii', score: 80, count:'4/5'},
              {topic:'Tư vấn cá nhân hoá', score: 60, count:'1.2/2', warn: true},
            ].map((t, i) => (
              <div key={i}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13}}>
                  <span style={{color:'var(--ink-800)', fontWeight:500}}>{t.topic}</span>
                  <span style={{color:'var(--ink-600)', fontVariantNumeric:'tabular-nums'}}>
                    <b style={{color: t.warn ? 'var(--warning-500)' : 'var(--ink-900)'}}>{t.score}%</b> · {t.count}
                  </span>
                </div>
                <div style={{height:8, borderRadius:99, background:'var(--ink-100)', overflow:'hidden'}}>
                  <div style={{height:'100%', width: t.score+'%', background: t.warn ? 'var(--warning-500)' : 'var(--droppii-blue-700)'}} />
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:18, padding:'12px 14px', background:'#fff8e6', border:'1px solid #ffe39a', borderRadius: 'var(--r-md)', fontSize: 13, color:'#7a4e00', display:'flex', gap:10}}>
            <span style={{fontSize:14}}>💡</span>
            <span><b>Gợi ý:</b> Ôn lại module "Tư vấn cá nhân hoá" trong thư viện Droppii Academy để nâng tỷ lệ đáp ứng kỳ vọng khách hàng.</span>
          </div>
        </div>

        <div style={{textAlign:'center', marginTop: 28, fontSize: 12, color:'var(--ink-500)'}}>
          Kết quả đã được gửi tự động đến quản lý khu vực · {window.QUIZ.seller.region}
        </div>
      </main>
    </div>
  );
}
window.DirA_Result = DirA_Result;

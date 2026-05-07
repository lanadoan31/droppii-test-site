// Admin — Question Bank, Sellers, Analytics, Reports

const { useState: useStateMore } = React;

// ─────────────────── Question Bank ───────────────────
function AdmQuestionBank() {
  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)'}}>
      <AdmHeader
        title="Ngân hàng câu hỏi"
        subtitle={`${window.ADMIN.question_bank.length} câu hỏi · 5 chủ đề · sử dụng trong ${window.ADMIN.tests.length} bài kiểm tra`}
        actions={
          <>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 14px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
              Nhập từ Excel/CSV
            </button>
            <button className="dr-btn dr-btn-primary" style={{height:38, fontSize:13, padding:'0 14px'}}>+ Thêm câu hỏi</button>
          </>
        }
      />
      <main style={{padding: 24, display:'grid', gridTemplateColumns:'200px 1fr', gap: 16}}>
        {/* Left: topics filter */}
        <aside className="dr-card" style={{padding: 14, height:'fit-content'}}>
          <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Chủ đề</div>
          {[
            {n:'Tất cả', count: 247, active:true},
            {n:'Cơ bản về AI', count: 48},
            {n:'Đạo đức & Tuân thủ', count: 52},
            {n:'Lâm sàng', count: 64},
            {n:'Sản phẩm Droppii', count: 48},
            {n:'Tư vấn cá nhân hoá', count: 35},
          ].map(t => (
            <div key={t.n} style={{
              padding:'7px 10px', marginBottom: 2, borderRadius: 'var(--r-sm)',
              background: t.active ? 'var(--droppii-blue-50)' : 'transparent',
              color: t.active ? 'var(--droppii-blue-700)' : 'var(--ink-700)',
              fontWeight: t.active ? 600 : 500,
              fontSize:13, cursor:'pointer',
              display:'flex', justifyContent:'space-between',
            }}>
              <span>{t.n}</span>
              <span style={{fontSize:11, color: t.active ? 'var(--droppii-blue-700)' : 'var(--ink-500)'}}>{t.count}</span>
            </div>
          ))}
          <div style={{borderTop:'1px solid var(--ink-100)', marginTop:10, paddingTop:10}}>
            <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Độ khó</div>
            {['Dễ', 'Vừa', 'Khó'].map(d => (
              <label key={d} style={{display:'flex', alignItems:'center', gap:8, padding:'4px 10px', fontSize:13, color:'var(--ink-700)'}}>
                <input type="checkbox" defaultChecked/> {d}
              </label>
            ))}
          </div>
        </aside>

        {/* Right: table */}
        <div className="dr-card" style={{overflow:'hidden'}}>
          <div style={{padding:'12px 16px', borderBottom:'1px solid var(--ink-100)', display:'flex', gap:10}}>
            <div style={{position:'relative', flex:1}}>
              <svg style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)'}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
              <input className="dr-input" style={{height:34, paddingLeft:34, fontSize:13}} placeholder="Tìm theo nội dung, mã câu..."/>
            </div>
            <span style={{fontSize:12, color:'var(--ink-500)', alignSelf:'center'}}>{window.ADMIN.question_bank.length} kết quả</span>
          </div>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
            <thead>
              <tr style={{background:'var(--ink-50)', textAlign:'left'}}>
                {['Mã','Câu hỏi','Loại','Độ khó','% đúng','Sử dụng',''].map(h => (
                  <th key={h} style={{padding:'10px 14px', fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'1px solid var(--ink-200)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {window.ADMIN.question_bank.map((q, i) => (
                <tr key={q.id} style={{borderBottom: i < window.ADMIN.question_bank.length-1 ? '1px solid var(--ink-100)' : 'none'}}>
                  <td style={{padding:'12px 14px', fontFamily:'ui-monospace, Menlo, monospace', fontSize:11, color:'var(--ink-600)'}}>{q.id}</td>
                  <td style={{padding:'12px 14px', maxWidth: 380}}>
                    <div style={{color:'var(--ink-900)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{q.stem}</div>
                    <div style={{fontSize:11, color:'var(--ink-500)', marginTop:2}}>{q.topic}</div>
                  </td>
                  <td style={{padding:'12px 14px'}}><span className="dr-chip">{q.type}</span></td>
                  <td style={{padding:'12px 14px'}}>
                    <span style={{
                      fontSize:12, fontWeight:600,
                      color: q.difficulty === 'Khó' ? 'var(--danger-700)' : q.difficulty === 'Vừa' ? 'var(--warning-500)' : 'var(--success-700)',
                    }}>{q.difficulty}</span>
                  </td>
                  <td style={{padding:'12px 14px', fontVariantNumeric:'tabular-nums', fontWeight:600}}>{q.correct_rate}%</td>
                  <td style={{padding:'12px 14px', color:'var(--ink-700)'}}>{q.used_in} bài</td>
                  <td style={{padding:'12px 14px', textAlign:'right'}}>
                    <button style={{background:'none', border:'none', cursor:'pointer'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-600)" strokeWidth="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ─────────────────── Sellers ───────────────────
function AdmSellers() {
  const fmt = n => n.toLocaleString('vi-VN');
  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)'}}>
      <AdmHeader
        title="Nhà bán hàng"
        subtitle={`${fmt(window.ADMIN.org.seller_count)} nhà bán hàng đang hoạt động · 8 khu vực`}
        actions={
          <>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 14px'}}>Đồng bộ từ CRM</button>
            <button className="dr-btn dr-btn-primary" style={{height:38, fontSize:13, padding:'0 14px'}}>+ Mời nhà bán hàng</button>
          </>
        }
      />
      <main style={{padding:24}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:14}}>
          {[
            {l:'Tổng', v: fmt(52481), c:'var(--ink-900)'},
            {l:'Đã chứng nhận', v: fmt(38927), c:'var(--success-700)'},
            {l:'Cần ôn lại', v: fmt(4218), c:'var(--warning-500)'},
            {l:'Chưa thi', v: fmt(9336), c:'var(--ink-600)'},
          ].map(s => (
            <div key={s.l} className="dr-card" style={{padding:'14px 18px'}}>
              <div style={{fontSize:11, color:'var(--ink-500)', marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:22, fontWeight:700, color:s.c, letterSpacing:'-0.02em'}}>{s.v}</div>
            </div>
          ))}
        </div>

        <div className="dr-card" style={{overflow:'hidden'}}>
          <div style={{padding:'12px 16px', display:'flex', gap:10, borderBottom:'1px solid var(--ink-100)'}}>
            <div style={{position:'relative', flex:1, maxWidth:300}}>
              <svg style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)'}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
              <input className="dr-input" style={{height:34, paddingLeft:34, fontSize:13}} placeholder="Tìm theo tên, mã, email..."/>
            </div>
            <select className="dr-input" style={{height:34, fontSize:13, width:140}}><option>Tất cả khu vực</option></select>
            <select className="dr-input" style={{height:34, fontSize:13, width:140}}><option>Tất cả trạng thái</option></select>
            <div style={{flex:1}}/>
            <span style={{fontSize:12, color:'var(--ink-500)', alignSelf:'center'}}>1–8 / {fmt(52481)}</span>
          </div>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
            <thead>
              <tr style={{background:'var(--ink-50)', textAlign:'left'}}>
                {['Nhà bán hàng','Khu vực','Tham gia','Số bài thi','Đã chứng nhận','Điểm gần nhất','Trạng thái',''].map(h => (
                  <th key={h} style={{padding:'10px 14px', fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'1px solid var(--ink-200)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {window.ADMIN.sellers.map((s, i) => (
                <tr key={s.id} style={{borderBottom: i < window.ADMIN.sellers.length-1 ? '1px solid var(--ink-100)' : 'none'}}>
                  <td style={{padding:'12px 14px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{width:32, height:32, borderRadius:'50%', background:'var(--ink-100)', color:'var(--ink-700)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600}}>{s.name.split(' ').slice(-2).map(x=>x[0]).join('')}</div>
                      <div>
                        <div style={{fontWeight:600, color:'var(--ink-900)'}}>{s.name}</div>
                        <div style={{fontSize:11, color:'var(--ink-500)', fontFamily:'ui-monospace, Menlo, monospace'}}>{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'12px 14px', color:'var(--ink-700)'}}>{s.region}</td>
                  <td style={{padding:'12px 14px', color:'var(--ink-700)'}}>{s.joined}</td>
                  <td style={{padding:'12px 14px', fontWeight:500, fontVariantNumeric:'tabular-nums'}}>{s.tests}</td>
                  <td style={{padding:'12px 14px', fontWeight:500, fontVariantNumeric:'tabular-nums', color: s.certified === s.tests ? 'var(--success-700)' : 'var(--ink-700)'}}>{s.certified}/{s.tests}</td>
                  <td style={{padding:'12px 14px', fontVariantNumeric:'tabular-nums', fontWeight:600}}>
                    {s.last_score !== null ? (
                      <span style={{color: s.last_score >= 70 ? 'var(--ink-900)' : 'var(--danger-700)'}}>{s.last_score}</span>
                    ) : <span style={{color:'var(--ink-400)'}}>—</span>}
                  </td>
                  <td style={{padding:'12px 14px'}}><StatusPill status={s.status}/></td>
                  <td style={{padding:'12px 14px', textAlign:'right'}}>
                    <button style={{background:'none', border:'none', cursor:'pointer'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-600)" strokeWidth="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ─────────────────── Analytics ───────────────────
function AdmAnalytics() {
  const fmt = n => n.toLocaleString('vi-VN');
  const hist = window.ADMIN.histogram;
  const maxH = Math.max(...hist);
  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)'}}>
      <AdmHeader
        title="Phân tích & Kết quả"
        subtitle="DRP-AI-2026 · Kiến thức AI cho Nhà bán hàng · 38,421 lượt thi"
        actions={
          <>
            <select className="dr-input" style={{height:38, fontSize:13, width:240}}>
              <option>DRP-AI-2026 — Kiến thức AI cho Nhà bán hàng</option>
            </select>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 14px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
              Xuất báo cáo
            </button>
          </>
        }
      />
      <main style={{padding:24, display:'flex', flexDirection:'column', gap: 16}}>
        {/* Histogram + cohort comparison side by side */}
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14}}>
          <div className="dr-card" style={{padding:'22px 24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 18}}>
              <div>
                <h3 style={{margin:'0 0 2px', fontSize:15, fontWeight:600}}>Phân bố điểm số</h3>
                <div style={{fontSize:12, color:'var(--ink-500)'}}>Điểm trung bình: <b style={{color:'var(--ink-800)'}}>81.6</b> · trung vị: 84 · điểm đậu: 70</div>
              </div>
            </div>
            <svg viewBox="0 0 600 220" style={{width:'100%', height:220}}>
              {hist.map((v, i) => {
                const barW = 600/hist.length - 6;
                const barX = i * (600/hist.length) + 3;
                const h = (v / maxH) * 170;
                const isPass = i*10 >= 70;
                return (
                  <g key={i}>
                    <rect x={barX} y={190 - h} width={barW} height={h} rx="3"
                      fill={isPass ? 'var(--droppii-blue-700)' : 'var(--ink-300)'}/>
                    <text x={barX + barW/2} y={206} fontSize="10" textAnchor="middle" fill="var(--ink-500)">{i*10}-{i*10+10}</text>
                    <text x={barX + barW/2} y={190-h-5} fontSize="9" textAnchor="middle" fill="var(--ink-500)">{(v/1000).toFixed(1)}k</text>
                  </g>
                );
              })}
              <line x1={60+540*0.7/1.0} x2={60+540*0.7/1.0} y1={20} y2={190} stroke="var(--success-500)" strokeDasharray="4 4"/>
              <text x={60+540*0.7/1.0+5} y={30} fontSize="11" fill="var(--success-700)" fontWeight="600">Điểm đậu</text>
            </svg>
          </div>

          <div className="dr-card" style={{padding:'22px 24px'}}>
            <h3 style={{margin:'0 0 14px', fontSize:15, fontWeight:600}}>So sánh giữa các đợt</h3>
            <div style={{display:'flex', flexDirection:'column', gap:14}}>
              {window.ADMIN.cohorts.map(c => (
                <div key={c.name}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13}}>
                    <span style={{color:'var(--ink-800)', fontWeight:500}}>Đợt {c.name}</span>
                    <span style={{color:'var(--ink-500)'}}>{fmt(c.takers)} người · <b style={{color:'var(--ink-900)'}}>{c.pass}%</b></span>
                  </div>
                  <div style={{height:10, background:'var(--ink-100)', borderRadius:99, overflow:'hidden'}}>
                    <div style={{height:'100%', width: c.pass+'%', background:'var(--droppii-blue-700)'}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:14, padding:'10px 12px', background:'var(--success-100)', borderRadius:'var(--r-md)', fontSize:12, color:'var(--success-700)', display:'flex', alignItems:'center', gap:6}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
              <span>Tỷ lệ đậu cải thiện <b>+9.8 điểm</b> sau 4 đợt</span>
            </div>
          </div>
        </div>

        {/* Topic mastery heatmap */}
        <div className="dr-card" style={{padding:'22px 24px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14}}>
            <div>
              <h3 style={{margin:'0 0 2px', fontSize:15, fontWeight:600}}>Bản đồ thành thạo theo chủ đề</h3>
              <div style={{fontSize:12, color:'var(--ink-500)'}}>Khu vực × Chủ đề · % câu trả lời đúng</div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8, fontSize:11, color:'var(--ink-500)'}}>
              <span>40%</span>
              <div style={{width:120, height:8, borderRadius:4, background:'linear-gradient(to right, #fed7aa, #fdba74, #fb923c, #2978d8, #0f4c9c)'}}/>
              <span>100%</span>
            </div>
          </div>
          <table style={{width:'100%', borderCollapse:'separate', borderSpacing:'2px 2px', fontSize:12}}>
            <thead>
              <tr>
                <th style={{padding:'4px 8px', textAlign:'left', color:'var(--ink-500)', fontWeight:600, fontSize:11}}>Khu vực</th>
                {window.ADMIN.topics.map(t => (
                  <th key={t} style={{padding:'4px 8px', color:'var(--ink-500)', fontWeight:600, fontSize:11}}>{t}</th>
                ))}
                <th style={{padding:'4px 8px', color:'var(--ink-500)', fontWeight:600, fontSize:11, textAlign:'right'}}>Trung bình</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Hà Nội',         [88, 84, 76, 82, 71]],
                ['TP.HCM',         [92, 88, 81, 85, 76]],
                ['Đà Nẵng',        [82, 79, 68, 78, 64]],
                ['Hải Phòng',      [85, 82, 72, 80, 68]],
                ['Cần Thơ',        [78, 74, 62, 75, 58]],
                ['Nghệ An',        [80, 77, 70, 76, 65]],
                ['Khánh Hoà',      [83, 80, 71, 79, 67]],
                ['Lâm Đồng',       [76, 72, 60, 73, 55]],
              ].map(([region, vals]) => {
                const avg = Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
                return (
                  <tr key={region}>
                    <td style={{padding:'8px 10px', color:'var(--ink-800)', fontWeight:500}}>{region}</td>
                    {vals.map((v, i) => {
                      // color: orange→blue gradient based on value
                      let bg, fg = 'white';
                      if (v >= 85) bg = 'var(--droppii-blue-700)';
                      else if (v >= 75) bg = 'var(--droppii-blue-500)';
                      else if (v >= 65) { bg = 'var(--droppii-orange-500)'; fg = 'white'; }
                      else { bg = 'var(--droppii-orange-100)'; fg = 'var(--droppii-orange-700)'; }
                      return (
                        <td key={i} style={{padding:'10px 10px', textAlign:'center', background: bg, color: fg, fontWeight:600, borderRadius:6, fontVariantNumeric:'tabular-nums'}}>
                          {v}%
                        </td>
                      );
                    })}
                    <td style={{padding:'8px 10px', textAlign:'right', color:'var(--ink-900)', fontWeight:700, fontVariantNumeric:'tabular-nums'}}>{avg}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Per-question difficulty */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
          <div className="dr-card" style={{padding:'22px 24px'}}>
            <h3 style={{margin:'0 0 14px', fontSize:15, fontWeight:600}}>Độ khó từng câu</h3>
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {window.ADMIN.question_perf.slice(0,10).map(q => (
                <div key={q.n} style={{display:'flex', alignItems:'center', gap:10, fontSize:12}}>
                  <div style={{width:24, fontFamily:'ui-monospace, Menlo, monospace', color:'var(--ink-500)'}}>{q.n}</div>
                  <div style={{flex:1, height:14, background:'var(--ink-100)', borderRadius:4, overflow:'hidden', position:'relative'}}>
                    <div style={{height:'100%', width: q.correct+'%', background: q.flag ? 'var(--danger-500)' : q.correct >= 80 ? 'var(--success-500)' : 'var(--droppii-blue-500)'}}/>
                  </div>
                  <span style={{minWidth:36, textAlign:'right', fontWeight:600, fontVariantNumeric:'tabular-nums', color: q.flag ? 'var(--danger-700)' : 'var(--ink-800)'}}>{q.correct}%</span>
                  <span style={{minWidth:38, textAlign:'right', color:'var(--ink-500)', fontVariantNumeric:'tabular-nums'}}>{q.avg_time}s</span>
                  {q.flag && <span style={{fontSize:10, color:'var(--danger-700)', fontWeight:600, padding:'1px 6px', background:'var(--danger-100)', borderRadius:99}}>cảnh báo</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="dr-card" style={{padding:'22px 24px'}}>
            <h3 style={{margin:'0 0 14px', fontSize:15, fontWeight:600}}>Phễu hoàn thành bài thi</h3>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {[
                {step:'Bắt đầu bài thi', count: 41892, pct:100},
                {step:'Hoàn thành câu 5', count: 41203, pct:98.4},
                {step:'Hoàn thành câu 10', count: 40118, pct:95.8},
                {step:'Hoàn thành câu 15', count: 39204, pct:93.6},
                {step:'Nộp bài', count: 38421, pct:91.7},
              ].map((s, i) => (
                <div key={i}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4}}>
                    <span style={{color:'var(--ink-700)'}}>{s.step}</span>
                    <span style={{color:'var(--ink-500)'}}>{fmt(s.count)} <b style={{color:'var(--ink-900)'}}>· {s.pct}%</b></span>
                  </div>
                  <div style={{height:18, background:'var(--ink-100)', borderRadius:4, overflow:'hidden'}}>
                    <div style={{height:'100%', width: s.pct+'%', background:`linear-gradient(90deg, var(--droppii-blue-700) 0%, var(--droppii-blue-500) 100%)`}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:14, padding:'10px 12px', background:'#fff8e6', border:'1px solid #ffe39a', borderRadius:'var(--r-md)', fontSize:12, color:'#7a4e00'}}>
              <b>💡</b> Tỷ lệ bỏ lớn nhất ở câu 6→10 (Lâm sàng). Cân nhắc giảm độ khó hoặc thêm hướng dẫn.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─────────────────── Reports ───────────────────
function AdmReports() {
  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)'}}>
      <AdmHeader title="Báo cáo & Xuất file" subtitle="Tạo báo cáo cho ban quản lý hoặc xuất dữ liệu thô."/>
      <main style={{padding: 24, display:'grid', gridTemplateColumns:'2fr 1fr', gap: 16}}>
        <div className="dr-card" style={{padding:24}}>
          <h3 style={{margin:'0 0 4px', fontSize:15, fontWeight:600}}>Tạo báo cáo nhanh</h3>
          <div style={{fontSize:12, color:'var(--ink-500)', marginBottom:18}}>Chọn mẫu, hệ thống sẽ tạo file PDF/CSV trong vài giây.</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            {[
              {ico:'📊', t:'Tổng kết bài kiểm tra', sub:'Pass/fail, điểm TB, top khu vực · PDF', accent:'var(--droppii-blue-700)'},
              {ico:'🎓', t:'Danh sách chứng nhận', sub:'Tất cả seller đã đậu, kèm mã chứng nhận · CSV', accent:'var(--success-700)'},
              {ico:'⚠️', t:'Seller cần đào tạo lại', sub:'Điểm < 70%, sắp hết hạn chứng nhận · CSV', accent:'var(--warning-500)'},
              {ico:'🗺️', t:'So sánh khu vực', sub:'Heatmap chủ đề × khu vực · PDF', accent:'var(--droppii-orange-600)'},
              {ico:'📈', t:'Phân tích câu hỏi', sub:'Câu khó, câu dễ, gợi ý chỉnh sửa · PDF', accent:'var(--ink-700)'},
              {ico:'📦', t:'Xuất dữ liệu thô', sub:'Toàn bộ bài thi, tích hợp BI · CSV/JSON', accent:'var(--ink-700)'},
            ].map(r => (
              <button key={r.t} style={{
                textAlign:'left', padding:'16px 18px',
                border:'1px solid var(--ink-200)', borderRadius:'var(--r-md)', background:'white',
                cursor:'pointer', fontFamily:'inherit',
                display:'flex', gap:12, alignItems:'flex-start',
              }}>
                <div style={{fontSize:22, lineHeight:1}}>{r.ico}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:600, color:'var(--ink-900)', marginBottom:2}}>{r.t}</div>
                  <div style={{fontSize:12, color:'var(--ink-500)', lineHeight:1.4}}>{r.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="dr-card" style={{padding:'4px 0'}}>
          <div style={{padding:'18px 24px 10px'}}>
            <h3 style={{margin:'0 0 2px', fontSize:15, fontWeight:600}}>Báo cáo gần đây</h3>
            <div style={{fontSize:12, color:'var(--ink-500)'}}>30 ngày qua</div>
          </div>
          {[
            {n:'Tổng kết DRP-AI-2026 — T05', d:'Hôm nay 09:14', s:'PDF · 2.1 MB'},
            {n:'Danh sách chứng nhận T04', d:'2 ngày trước', s:'CSV · 8.3 MB'},
            {n:'Seller cần đào tạo lại — Q2', d:'1 tuần trước', s:'CSV · 412 KB'},
            {n:'So sánh khu vực T03', d:'2 tuần trước', s:'PDF · 1.8 MB'},
            {n:'Xuất dữ liệu — DRP-TPCN-Q1', d:'3 tuần trước', s:'CSV · 14.6 MB'},
          ].map((r, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'12px 24px', borderTop:'1px solid var(--ink-100)'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--droppii-blue-700)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:500, color:'var(--ink-900)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.n}</div>
                <div style={{fontSize:11, color:'var(--ink-500)'}}>{r.d} · {r.s}</div>
              </div>
              <button style={{background:'none', border:'none', cursor:'pointer', color:'var(--droppii-blue-700)'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

window.AdmQuestionBank = AdmQuestionBank;
window.AdmSellers = AdmSellers;
window.AdmAnalytics = AdmAnalytics;
window.AdmReports = AdmReports;

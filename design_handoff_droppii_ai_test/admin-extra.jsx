// Admin — Question Editor + Seller Detail
// Two screens commonly missing from prototypes; built to support handoff.

const { useState: useStateExt } = React;

// ─────────────────────────── Question Editor ───────────────────────────
function AdmQuestionEditor() {
  const [type, setType] = useStateExt('single');
  const [stem, setStem] = useStateExt('Trong vai trò Nhà bán hàng Droppii, AI hỗ trợ bạn HIỆU QUẢ NHẤT ở khâu nào?');
  const [options, setOptions] = useStateExt([
    { text: 'Thay thế hoàn toàn việc tư vấn của nhà bán hàng cho khách', correct: false },
    { text: 'Gợi ý sản phẩm phù hợp dựa trên nhu cầu và lịch sử của khách', correct: true },
    { text: 'Tự động đặt hàng giúp khách mà không cần xác nhận', correct: false },
    { text: 'Quyết định liều dùng và phác đồ điều trị cho khách', correct: false },
  ]);
  const [explain, setExplain] = useStateExt('AI là công cụ HỖ TRỢ — gợi ý cá nhân hoá, phân loại nhu cầu, tóm tắt thông tin sản phẩm. Mọi quyết định tư vấn cuối cùng và liều dùng phải do nhà bán hàng (và bác sĩ khi cần) đưa ra.');
  const [topic, setTopic] = useStateExt('Cơ bản về AI');
  const [difficulty, setDifficulty] = useStateExt('Trung bình');
  const [timeSec, setTimeSec] = useStateExt(60);
  const [points, setPoints] = useStateExt(1);

  const updateOption = (i, patch) => setOptions(opts => opts.map((o, idx) => idx === i ? { ...o, ...patch } : o));
  const toggleCorrect = (i) => setOptions(opts => opts.map((o, idx) => {
    if (type === 'single') return { ...o, correct: idx === i };
    return idx === i ? { ...o, correct: !o.correct } : o;
  }));
  const addOption = () => setOptions(opts => [...opts, { text: '', correct: false }]);
  const removeOption = (i) => setOptions(opts => opts.filter((_, idx) => idx !== i));

  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)', display:'flex', flexDirection:'column'}}>
      <div style={{padding:'14px 28px', background:'white', borderBottom:'1px solid var(--ink-100)', flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontSize:12, color:'var(--ink-500)', marginBottom: 4}}>
            <a href="#" style={{color:'var(--ink-500)', textDecoration:'none'}}>Ngân hàng câu hỏi</a>
            <span style={{margin:'0 6px'}}>/</span>
            <span style={{color:'var(--ink-700)'}}>Câu hỏi mới</span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <h1 style={{margin:0, fontSize: 20, fontWeight:700, letterSpacing:'-0.01em'}}>Soạn câu hỏi</h1>
            <StatusPill status="Bản nháp"/>
          </div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button className="dr-btn dr-btn-ghost" style={{height:36, fontSize:13, padding:'0 14px'}}>Huỷ</button>
          <button className="dr-btn dr-btn-secondary" style={{height:36, fontSize:13, padding:'0 14px'}}>Lưu nháp</button>
          <button className="dr-btn dr-btn-primary" style={{height:36, fontSize:13, padding:'0 14px'}}>Lưu vào ngân hàng</button>
        </div>
      </div>

      <div style={{flex:1, display:'grid', gridTemplateColumns:'1fr 360px', overflow:'hidden'}}>
        {/* Editor area */}
        <div style={{padding: 24, overflow:'auto'}}>
          <div style={{maxWidth: 760}}>
            {/* Type selector */}
            <div className="dr-card" style={{padding:'18px 20px', marginBottom: 14}}>
              <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 10}}>Loại câu hỏi</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8}}>
                {[
                  { id:'single', label:'Một đáp án', ico:'⊙' },
                  { id:'multi', label:'Nhiều đáp án', ico:'☷' },
                  { id:'scenario', label:'Tình huống', ico:'📋' },
                  { id:'short', label:'Trả lời ngắn', ico:'✎' },
                ].map(t => {
                  const isOn = type === t.id;
                  return (
                    <button key={t.id} onClick={() => setType(t.id)} style={{
                      padding:'10px 8px', borderRadius: 'var(--r-sm)', cursor:'pointer',
                      border: isOn ? '1.5px solid var(--droppii-blue-700)' : '1px solid var(--ink-200)',
                      background: isOn ? 'var(--droppii-blue-50)' : 'white',
                      color: isOn ? 'var(--droppii-blue-700)' : 'var(--ink-700)',
                      fontFamily:'inherit', fontSize: 12, fontWeight: isOn ? 600 : 500,
                      display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                    }}>
                      <span style={{fontSize:18}}>{t.ico}</span>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stem */}
            <div className="dr-card" style={{padding:'20px 22px', marginBottom: 14}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
                <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)'}}>Đề bài <span style={{color:'var(--danger-700)'}}>*</span></div>
                <div style={{display:'flex', gap: 6}}>
                  {['B','I','U','•','🖼'].map(t => (
                    <button key={t} style={{width:28, height:28, border:'1px solid var(--ink-200)', background:'white', borderRadius:4, cursor:'pointer', fontSize:12, fontWeight:600}}>{t}</button>
                  ))}
                </div>
              </div>
              <textarea
                value={stem}
                onChange={e => setStem(e.target.value)}
                style={{width:'100%', padding:'12px 14px', minHeight: 90, border:'1px solid var(--ink-200)', borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:14, lineHeight:1.55, resize:'vertical', boxSizing:'border-box'}}
              />
              <div style={{fontSize:11, color:'var(--ink-500)', marginTop:6}}>{stem.length} ký tự · Hỗ trợ Markdown, công thức LaTeX, hình ảnh</div>
            </div>

            {/* Options */}
            {(type === 'single' || type === 'multi' || type === 'scenario') && (
              <div className="dr-card" style={{padding:'20px 22px', marginBottom: 14}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12}}>
                  <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)'}}>
                    Lựa chọn đáp án
                    <span style={{fontSize:11, color:'var(--ink-500)', fontWeight:500, marginLeft:8}}>
                      {type === 'single' ? '· chỉ 1 đáp án đúng' : '· tích chọn các đáp án đúng'}
                    </span>
                  </div>
                </div>
                <div style={{display:'grid', gap: 8}}>
                  {options.map((o, i) => (
                    <div key={i} style={{display:'flex', alignItems:'flex-start', gap: 10, padding:'10px 12px', border:'1px solid', borderColor: o.correct ? 'var(--success-500)' : 'var(--ink-200)', borderRadius:'var(--r-sm)', background: o.correct ? 'var(--success-100)' : 'white'}}>
                      <button onClick={() => toggleCorrect(i)} style={{
                        width: 22, height: 22, borderRadius: type === 'single' ? '50%' : 5,
                        border: o.correct ? 'none' : '1.5px solid var(--ink-300)',
                        background: o.correct ? 'var(--success-500)' : 'white',
                        cursor:'pointer', flexShrink:0, marginTop: 2,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        {o.correct && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M5 13l4 4L19 7"/></svg>}
                      </button>
                      <span style={{fontSize:13, color:'var(--ink-500)', fontWeight:600, marginTop:5, width:14}}>{String.fromCharCode(65+i)}.</span>
                      <input
                        value={o.text}
                        onChange={e => updateOption(i, { text: e.target.value })}
                        placeholder={`Đáp án ${String.fromCharCode(65+i)}...`}
                        style={{flex:1, border:'none', background:'transparent', fontSize:14, fontFamily:'inherit', padding:'5px 0', outline:'none'}}
                      />
                      {options.length > 2 && (
                        <button onClick={() => removeOption(i)} style={{background:'none', border:'none', cursor:'pointer', color:'var(--ink-500)', padding:4}}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addOption} className="dr-btn dr-btn-ghost" style={{marginTop: 10, height:34, fontSize:12, padding:'0 12px'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
                  Thêm đáp án
                </button>
              </div>
            )}

            {type === 'short' && (
              <div className="dr-card" style={{padding:'20px 22px', marginBottom: 14}}>
                <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 10}}>Đáp án mẫu (dùng để chấm tự động)</div>
                <textarea placeholder="Nhập câu trả lời mẫu hoặc các từ khoá bắt buộc, mỗi dòng một mục..." style={{width:'100%', padding:'12px 14px', minHeight: 80, border:'1px solid var(--ink-200)', borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:14, resize:'vertical', boxSizing:'border-box'}}/>
                <div style={{display:'flex', alignItems:'center', gap:8, marginTop:10, padding:'10px 12px', background:'var(--droppii-blue-50)', borderRadius:'var(--r-sm)'}}>
                  <span style={{fontSize:16}}>🤖</span>
                  <span style={{fontSize:12, color:'var(--ink-700)'}}>AI sẽ chấm điểm tự động dựa trên độ tương đồng ngữ nghĩa và từ khoá.</span>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="dr-card" style={{padding:'20px 22px', marginBottom: 14}}>
              <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 4}}>Giải thích</div>
              <div style={{fontSize:11, color:'var(--ink-500)', marginBottom: 10}}>Hiển thị cho seller sau khi nộp bài (nếu bài thi có cài đặt "Hiển thị đáp án").</div>
              <textarea
                value={explain}
                onChange={e => setExplain(e.target.value)}
                style={{width:'100%', padding:'12px 14px', minHeight: 80, border:'1px solid var(--ink-200)', borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:13, lineHeight:1.55, resize:'vertical', boxSizing:'border-box'}}
              />
            </div>
          </div>
        </div>

        {/* Sidebar — metadata + preview */}
        <aside style={{borderLeft:'1px solid var(--ink-200)', background:'white', padding: 22, overflow:'auto'}}>
          <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom: 12}}>Thuộc tính</div>

          <div style={{marginBottom:14}}>
            <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 5}}>Chủ đề</div>
            <select className="dr-input" value={topic} onChange={e => setTopic(e.target.value)} style={{height:36, fontSize:13}}>
              <option>Cơ bản về AI</option>
              <option>Đạo đức & Tuân thủ</option>
              <option>Tình huống lâm sàng</option>
              <option>Sản phẩm Droppii</option>
              <option>Tư vấn cá nhân hoá</option>
            </select>
          </div>

          <div style={{marginBottom:14}}>
            <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Độ khó</div>
            <div style={{display:'flex', gap: 4}}>
              {['Dễ', 'Trung bình', 'Khó'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  flex:1, padding:'8px 0', fontSize:12, fontWeight:500,
                  border: difficulty === d ? '1.5px solid var(--droppii-blue-700)' : '1px solid var(--ink-200)',
                  background: difficulty === d ? 'var(--droppii-blue-50)' : 'white',
                  color: difficulty === d ? 'var(--droppii-blue-700)' : 'var(--ink-700)',
                  borderRadius:'var(--r-sm)', cursor:'pointer', fontFamily:'inherit',
                }}>{d}</button>
              ))}
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom:14}}>
            <div>
              <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 5}}>Thời gian</div>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <input className="dr-input" type="number" value={timeSec} onChange={e => setTimeSec(+e.target.value)} style={{height:36, fontSize:13, width:70, textAlign:'center'}}/>
                <span style={{fontSize:12, color:'var(--ink-700)'}}>giây</span>
              </div>
            </div>
            <div>
              <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 5}}>Điểm</div>
              <input className="dr-input" type="number" value={points} onChange={e => setPoints(+e.target.value)} style={{height:36, fontSize:13}}/>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Thẻ (tags)</div>
            <div style={{display:'flex', gap:5, flexWrap:'wrap', padding:'6px 8px', border:'1px solid var(--ink-200)', borderRadius:'var(--r-sm)', minHeight:36}}>
              {['#ai-cơ-bản', '#tư-vấn'].map(t => (
                <span key={t} style={{padding:'3px 8px', background:'var(--ink-100)', borderRadius:99, fontSize:11, color:'var(--ink-700)', display:'inline-flex', alignItems:'center', gap:4}}>
                  {t} <span style={{cursor:'pointer', opacity:.6}}>×</span>
                </span>
              ))}
              <input placeholder="+ thêm thẻ" style={{border:'none', outline:'none', fontSize:11, fontFamily:'inherit', flex:1, minWidth:60}}/>
            </div>
          </div>

          <div style={{borderTop:'1px solid var(--ink-100)', paddingTop:16, marginBottom: 16}}>
            <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom: 10}}>Đang dùng trong</div>
            <div style={{display:'grid', gap:6}}>
              {[
                { code:'DRP-AI-2026', name:'Kiến thức AI 2026' },
                { code:'DRP-PROD-26', name:'Sản phẩm Q2/2026' },
              ].map(t => (
                <div key={t.code} style={{padding:'8px 10px', background:'var(--ink-50)', borderRadius:'var(--r-sm)'}}>
                  <div style={{fontSize:12, color:'var(--ink-900)', fontWeight:500}}>{t.name}</div>
                  <div style={{fontSize:10, color:'var(--ink-500)', fontFamily:'ui-monospace, Menlo, monospace'}}>{t.code}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{borderTop:'1px solid var(--ink-100)', paddingTop:16}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10}}>
              <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em'}}>Hiệu suất</div>
              <span style={{fontSize:10, color:'var(--ink-500)'}}>247 lượt thi</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8}}>
              <div style={{padding:'10px 12px', background:'var(--ink-50)', borderRadius:'var(--r-sm)'}}>
                <div style={{fontSize:18, fontWeight:700, color:'var(--success-700)', fontVariantNumeric:'tabular-nums'}}>78%</div>
                <div style={{fontSize:10, color:'var(--ink-500)'}}>Tỷ lệ đúng</div>
              </div>
              <div style={{padding:'10px 12px', background:'var(--ink-50)', borderRadius:'var(--r-sm)'}}>
                <div style={{fontSize:18, fontWeight:700, color:'var(--ink-900)', fontVariantNumeric:'tabular-nums'}}>52s</div>
                <div style={{fontSize:10, color:'var(--ink-500)'}}>Thời gian TB</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────── Seller Detail ───────────────────────────
function AdmSellerDetail() {
  const seller = {
    name: 'Nguyễn Thị Mai Anh',
    id: 'DRP-58294',
    region: 'Hà Nội',
    joined: '12/03/2024',
    email: 'maianh.nguyen@droppii.vn',
    phone: '+84 912 345 678',
    status: 'Đang hoạt động',
    badges: ['AI Advisor 2026', 'Top 10% Hà Nội', 'Tư vấn TPCN'],
  };
  const attempts = [
    { id:'A-9f2', test:'Kiến thức AI 2026', code:'DRP-AI-2026', date:'05/05/2026 · 14:32', score: 88, pass: true, duration:'24:18' },
    { id:'A-9f1', test:'Sản phẩm Q2/2026', code:'DRP-PROD-26', date:'28/04/2026 · 09:15', score: 76, pass: true, duration:'31:02' },
    { id:'A-8e7', test:'Kiến thức AI 2026', code:'DRP-AI-2026', date:'12/04/2026 · 10:08', score: 62, pass: false, duration:'29:44' },
    { id:'A-8d2', test:'TPCN Lâm sàng Q1', code:'DRP-TPCN-Q1', date:'02/03/2026 · 16:22', score: 84, pass: true, duration:'22:10' },
  ];

  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)'}}>
      {/* Header */}
      <div style={{padding:'14px 28px', background:'white', borderBottom:'1px solid var(--ink-100)'}}>
        <div style={{fontSize:12, color:'var(--ink-500)', marginBottom: 12}}>
          <a href="#" style={{color:'var(--ink-500)', textDecoration:'none'}}>Nhà bán hàng</a>
          <span style={{margin:'0 6px'}}>/</span>
          <span style={{color:'var(--ink-700)'}}>{seller.id}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:20}}>
          <div style={{display:'flex', gap:16, alignItems:'center'}}>
            <div style={{width:60, height:60, borderRadius:'50%', background:'var(--droppii-blue-700)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, flexShrink:0}}>
              MA
            </div>
            <div>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:4}}>
                <h1 style={{margin:0, fontSize: 22, fontWeight:700, letterSpacing:'-0.01em'}}>{seller.name}</h1>
                <span style={{padding:'3px 10px', background:'var(--success-100)', color:'var(--success-700)', borderRadius:99, fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', gap:4}}>
                  <span style={{width:6, height:6, borderRadius:'50%', background:'var(--success-500)'}}/>
                  {seller.status}
                </span>
              </div>
              <div style={{display:'flex', gap:14, fontSize:12, color:'var(--ink-500)'}}>
                <span style={{fontFamily:'ui-monospace, Menlo, monospace'}}>{seller.id}</span>
                <span>·</span>
                <span>📍 {seller.region}</span>
                <span>·</span>
                <span>Tham gia {seller.joined}</span>
              </div>
            </div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="dr-btn dr-btn-ghost" style={{height:36, fontSize:13, padding:'0 14px'}}>Gửi tin nhắn</button>
            <button className="dr-btn dr-btn-secondary" style={{height:36, fontSize:13, padding:'0 14px'}}>Gán bài thi</button>
            <button className="dr-btn dr-btn-secondary" style={{height:36, fontSize:13, padding:'0 14px'}}>⋯</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex', gap:0, marginTop: 18, marginBottom:-1}}>
          {['Tổng quan', 'Lịch sử thi', 'Chứng nhận', 'Hoạt động', 'Cài đặt'].map((t, i) => (
            <button key={t} style={{
              padding:'10px 16px', border:'none', background:'none', cursor:'pointer',
              fontFamily:'inherit', fontSize:13,
              borderBottom: i === 0 ? '2px solid var(--droppii-blue-700)' : '2px solid transparent',
              color: i === 0 ? 'var(--droppii-blue-700)' : 'var(--ink-500)',
              fontWeight: i === 0 ? 600 : 500,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <main style={{padding: 24}}>
        {/* KPI cards */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom: 18}}>
          {[
            { l:'Bài đã thi', v:'4', sub:'3 đậu · 1 trượt' },
            { l:'Điểm trung bình', v:'77.5%', sub:'+8% so với khu vực' },
            { l:'Chứng nhận', v:'3', sub:'1 sắp hết hạn' },
            { l:'Xếp hạng KV', v:'#42', sub:'trên 4,820 seller HN' },
          ].map(k => (
            <div key={k.l} className="dr-card" style={{padding:'16px 18px'}}>
              <div style={{fontSize:11, color:'var(--ink-500)', marginBottom: 4}}>{k.l}</div>
              <div style={{fontSize:24, fontWeight:700, color:'var(--ink-900)', fontVariantNumeric:'tabular-nums', marginBottom:3}}>{k.v}</div>
              <div style={{fontSize:11, color:'var(--ink-500)'}}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap: 16}}>
          {/* Attempts table */}
          <div className="dr-card" style={{overflow:'hidden'}}>
            <div style={{padding:'14px 18px', borderBottom:'1px solid var(--ink-100)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{fontSize:14, fontWeight:600, color:'var(--ink-900)'}}>Lịch sử làm bài</div>
              <a href="#" style={{fontSize:12, color:'var(--droppii-blue-700)', textDecoration:'none', fontWeight:500}}>Xem tất cả →</a>
            </div>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
              <thead>
                <tr style={{background:'var(--ink-50)'}}>
                  {['Bài kiểm tra', 'Ngày', 'Thời gian', 'Điểm', 'Kết quả', ''].map(h => (
                    <th key={h} style={{padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'1px solid var(--ink-200)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={a.id} style={{borderBottom: i < attempts.length-1 ? '1px solid var(--ink-100)' : 'none'}}>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{fontWeight:500, color:'var(--ink-900)'}}>{a.test}</div>
                      <div style={{fontSize:10, color:'var(--ink-500)', fontFamily:'ui-monospace, Menlo, monospace'}}>{a.code}</div>
                    </td>
                    <td style={{padding:'12px 14px', color:'var(--ink-700)', fontSize:12}}>{a.date}</td>
                    <td style={{padding:'12px 14px', color:'var(--ink-700)', fontVariantNumeric:'tabular-nums'}}>{a.duration}</td>
                    <td style={{padding:'12px 14px'}}>
                      <span style={{fontSize:15, fontWeight:700, color: a.pass ? 'var(--success-700)' : 'var(--danger-700)', fontVariantNumeric:'tabular-nums'}}>{a.score}%</span>
                    </td>
                    <td style={{padding:'12px 14px'}}>
                      <span style={{padding:'3px 9px', borderRadius: 99, fontSize:11, fontWeight:600, background: a.pass ? 'var(--success-100)' : 'var(--danger-100)', color: a.pass ? 'var(--success-700)' : 'var(--danger-700)'}}>
                        {a.pass ? 'Đậu' : 'Chưa đậu'}
                      </span>
                    </td>
                    <td style={{padding:'12px 14px', textAlign:'right'}}>
                      <button className="dr-btn dr-btn-ghost" style={{height:28, fontSize:11, padding:'0 10px'}}>Chi tiết →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div style={{display:'grid', gap: 14}}>
            <div className="dr-card" style={{padding:'16px 18px'}}>
              <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 12}}>Liên hệ</div>
              <div style={{display:'grid', gap: 10, fontSize:12}}>
                <div>
                  <div style={{color:'var(--ink-500)', fontSize:11, marginBottom:2}}>Email</div>
                  <div style={{color:'var(--ink-900)'}}>{seller.email}</div>
                </div>
                <div>
                  <div style={{color:'var(--ink-500)', fontSize:11, marginBottom:2}}>Điện thoại</div>
                  <div style={{color:'var(--ink-900)'}}>{seller.phone}</div>
                </div>
                <div>
                  <div style={{color:'var(--ink-500)', fontSize:11, marginBottom:2}}>Quản lý khu vực</div>
                  <div style={{color:'var(--ink-900)'}}>Trần Văn Hưng (RM-HN-03)</div>
                </div>
              </div>
            </div>

            <div className="dr-card" style={{padding:'16px 18px'}}>
              <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 12}}>Huy hiệu & Chứng nhận</div>
              <div style={{display:'flex', flexDirection:'column', gap: 8}}>
                {seller.badges.map(b => (
                  <div key={b} style={{display:'flex', alignItems:'center', gap: 10, padding:'8px 10px', background:'var(--droppii-blue-50)', borderRadius:'var(--r-sm)'}}>
                    <div style={{width:28, height:28, borderRadius:6, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0}}>🏆</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:12, fontWeight:600, color:'var(--ink-900)'}}>{b}</div>
                      <div style={{fontSize:10, color:'var(--ink-500)'}}>Cấp 05/05/2026</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dr-card" style={{padding:'16px 18px'}}>
              <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 12}}>Điểm mạnh & yếu</div>
              {[
                { topic:'Cơ bản về AI', score: 92, color:'var(--success-500)' },
                { topic:'Đạo đức & Tuân thủ', score: 88, color:'var(--success-500)' },
                { topic:'Sản phẩm Droppii', score: 76, color:'var(--success-500)' },
                { topic:'Tình huống lâm sàng', score: 58, color:'var(--warning-500)' },
              ].map(t => (
                <div key={t.topic} style={{marginBottom:10}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:4}}>
                    <span style={{color:'var(--ink-700)'}}>{t.topic}</span>
                    <span style={{fontWeight:600, fontVariantNumeric:'tabular-nums', color:'var(--ink-900)'}}>{t.score}%</span>
                  </div>
                  <div style={{height:5, background:'var(--ink-100)', borderRadius:99, overflow:'hidden'}}>
                    <div style={{height:'100%', width: t.score+'%', background: t.color}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

window.AdmQuestionEditor = AdmQuestionEditor;
window.AdmSellerDetail = AdmSellerDetail;

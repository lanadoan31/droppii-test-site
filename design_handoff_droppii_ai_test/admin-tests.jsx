// Admin — Test Builder (list + editor)
// Two views: AdmTestList (table of all tests) and AdmTestEditor (build single test)

const { useState: useStateBuilder } = React;

function AdmTestList({ onCreate }) {
  const fmt = n => n.toLocaleString('vi-VN');
  const [, force] = useStateBuilder(0);
  React.useEffect(() => window.DroppiiSync.onChange(() => force(x => x+1)), []);
  const liveTests = window.DroppiiSync.getTests();
  // merge live status onto seed taken/pass_rate for display
  const tests = liveTests.map(t => {
    const seed = window.ADMIN.tests.find(x => x.id === t.id) || {};
    return { ...seed, ...t, questions: t.questions_total || seed.questions || 0, taken: seed.taken || 0, pass_rate: seed.pass_rate || 0, updated: 'Vừa cập nhật' };
  });
  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)'}}>
      <AdmHeader
        title="Bài kiểm tra"
        subtitle={`${window.ADMIN.tests.length} bài · ${window.ADMIN.tests.filter(t=>t.status==='Đang mở').length} đang mở`}
        actions={
          <>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 14px'}}>Nhập từ Excel</button>
            <button className="dr-btn dr-btn-primary" style={{height:38, fontSize:13, padding:'0 14px'}} onClick={onCreate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
              Tạo bài kiểm tra mới
            </button>
          </>
        }
      />
      <main style={{padding: 24}}>
        {/* filter strip */}
        <div className="dr-card" style={{padding: '12px 16px', marginBottom: 14, display:'flex', gap:10, alignItems:'center'}}>
          <div style={{position:'relative', flex:1, maxWidth: 320}}>
            <svg style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)'}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
            <input className="dr-input" style={{height: 36, paddingLeft:34, fontSize:13}} placeholder="Tìm theo tên, mã đề..."/>
          </div>
          <div style={{display:'flex', gap: 6}}>
            {['Tất cả', 'Đang mở', 'Bản nháp', 'Đã lưu trữ'].map((t, i) => (
              <button key={t} style={{
                padding:'7px 12px', border:'1px solid var(--ink-200)', borderRadius:99,
                background: i===0 ? 'var(--ink-900)' : 'white',
                color: i===0 ? 'white' : 'var(--ink-700)',
                fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'inherit',
              }}>{t}</button>
            ))}
          </div>
          <div style={{flex:1}}/>
          <span style={{fontSize:12, color:'var(--ink-500)'}}>Sắp xếp: <b style={{color:'var(--ink-800)'}}>Cập nhật mới nhất</b></span>
        </div>

        {/* Tests table */}
        <div className="dr-card" style={{overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize: 13}}>
            <thead>
              <tr style={{background:'var(--ink-50)', textAlign:'left'}}>
                {['Bài kiểm tra', 'Trạng thái', 'Loại', 'Cấu hình', 'Lượt thi', 'Tỷ lệ đậu', 'Cập nhật', ''].map(h => (
                  <th key={h} style={{padding:'12px 16px', fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'1px solid var(--ink-200)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tests.map((t, i) => (
                <tr key={t.id} style={{borderBottom: i < tests.length-1 ? '1px solid var(--ink-100)' : 'none'}}>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{fontWeight:600, color:'var(--ink-900)', marginBottom:2}}>{t.name}</div>
                    <div style={{fontSize:11, color:'var(--ink-500)', fontFamily:'ui-monospace, Menlo, monospace'}}>{t.id}</div>
                  </td>
                  <td style={{padding:'14px 16px'}}><StatusPill status={t.status}/></td>
                  <td style={{padding:'14px 16px', color:'var(--ink-700)'}}>{t.type}</td>
                  <td style={{padding:'14px 16px', color:'var(--ink-700)', fontVariantNumeric:'tabular-nums'}}>{t.questions} câu · {t.duration_min}' · ≥{t.pass_score}%</td>
                  <td style={{padding:'14px 16px', color:'var(--ink-900)', fontWeight:500, fontVariantNumeric:'tabular-nums'}}>{fmt(t.taken)}</td>
                  <td style={{padding:'14px 16px'}}>
                    {t.taken > 0 ? (
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <div style={{width:60, height:5, background:'var(--ink-100)', borderRadius:99, overflow:'hidden'}}>
                          <div style={{height:'100%', width:t.pass_rate+'%', background: t.pass_rate >= 70 ? 'var(--success-500)' : 'var(--warning-500)'}}/>
                        </div>
                        <span style={{fontWeight:600, color:'var(--ink-900)', fontVariantNumeric:'tabular-nums'}}>{t.pass_rate}%</span>
                      </div>
                    ) : <span style={{color:'var(--ink-400)'}}>—</span>}
                  </td>
                  <td style={{padding:'14px 16px', color:'var(--ink-500)'}}>{t.updated}</td>
                  <td style={{padding:'14px 16px', textAlign:'right'}}>
                    {t.status === 'Bản nháp' && (
                      <button className="dr-btn dr-btn-primary" style={{height:30, fontSize:12, padding:'0 10px'}} onClick={() => window.DroppiiSync.publishTest(t.id)}>Xuất bản</button>
                    )}
                    {t.status === 'Đang mở' && (
                      <button className="dr-btn dr-btn-ghost" style={{height:30, fontSize:12, padding:'0 10px'}} onClick={() => window.DroppiiSync.archiveTest(t.id)}>Lưu trữ</button>
                    )}
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

function AdmTestEditor() {
  const Q = window.QUIZ.questions[2];
  const [activeTab, setActiveTab] = useStateBuilder('questions');

  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)', display:'flex', flexDirection:'column'}}>
      {/* breadcrumb header */}
      <div style={{padding:'14px 28px 0', background:'white', borderBottom:'1px solid var(--ink-100)', flexShrink:0}}>
        <div style={{fontSize:12, color:'var(--ink-500)', marginBottom: 8}}>
          <a href="#" style={{color:'var(--ink-500)', textDecoration:'none'}}>Bài kiểm tra</a>
          <span style={{margin:'0 6px'}}>/</span>
          <span style={{color:'var(--ink-700)'}}>DRP-AI-2026 · Kiến thức AI cho Nhà bán hàng</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', paddingBottom: 14}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom: 4}}>
              <h1 style={{margin:0, fontSize: 22, fontWeight:700, letterSpacing:'-0.01em'}}>Kiến thức AI cho Nhà bán hàng — 2026</h1>
              <StatusPill status="Đang mở"/>
            </div>
            <div style={{fontSize:13, color:'var(--ink-500)'}}>20 câu hỏi · 30 phút · điểm đậu 70% · cập nhật 2 ngày trước</div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="dr-btn dr-btn-ghost" style={{height:38, fontSize:13, padding:'0 14px'}}>Xem trước</button>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 14px'}}>Lưu nháp</button>
            <button className="dr-btn dr-btn-primary" style={{height:38, fontSize:13, padding:'0 14px'}}>Xuất bản thay đổi</button>
          </div>
        </div>
        {/* tabs */}
        <div style={{display:'flex', gap: 4}}>
          {[
            {id:'settings', label:'Cấu hình'},
            {id:'questions', label:'Câu hỏi (20)'},
            {id:'schedule', label:'Lịch & Phân công'},
            {id:'preview', label:'Xem trước'},
          ].map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              padding:'10px 14px', border:'none', background:'none',
              fontSize:13, fontWeight: activeTab===t.id ? 600 : 500,
              color: activeTab===t.id ? 'var(--droppii-blue-700)' : 'var(--ink-600)',
              borderBottom: activeTab===t.id ? '2px solid var(--droppii-blue-700)' : '2px solid transparent',
              marginBottom:-1, cursor:'pointer', fontFamily:'inherit',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1, display:'flex', minHeight:0}}>
        {/* Question list (left) */}
        <aside style={{width: 280, borderRight:'1px solid var(--ink-200)', background:'white', overflow:'auto', flexShrink:0}}>
          <div style={{padding:'14px 16px', borderBottom:'1px solid var(--ink-100)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{fontSize:13, fontWeight:600}}>Danh sách câu hỏi</div>
            <button className="dr-btn dr-btn-ghost" style={{height:28, fontSize:12, padding:'0 8px'}}>+ Thêm</button>
          </div>
          {Array.from({length: 20}).map((_, i) => {
            const n = i + 1;
            const isActive = n === 7;
            const topic = ['Cơ bản AI','Đạo đức','Cơ bản AI','Đạo đức','Sản phẩm','Sản phẩm','Lâm sàng','Lâm sàng','Tư vấn','Tư vấn','Cơ bản AI','Đạo đức','Sản phẩm','Lâm sàng','Tư vấn','Cơ bản AI','Đạo đức','Sản phẩm','Lâm sàng','Tư vấn'][i];
            return (
              <div key={n} style={{
                padding:'10px 16px',
                background: isActive ? 'var(--droppii-blue-50)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--droppii-blue-700)' : '3px solid transparent',
                borderBottom:'1px solid var(--ink-100)',
                cursor:'pointer',
                display:'flex', alignItems:'center', gap:10,
              }}>
                <div style={{
                  width:24, height:24, borderRadius:6, fontSize:11, fontWeight:700,
                  background: isActive ? 'var(--droppii-blue-700)' : 'var(--ink-100)',
                  color: isActive ? 'white' : 'var(--ink-700)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>{n}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize: 12, color:'var(--ink-800)', fontWeight: isActive ? 600 : 500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {n === 7 ? 'Nam 55t, đái tháo đường type 2…' : `Câu hỏi mẫu số ${n}`}
                  </div>
                  <div style={{fontSize:10, color:'var(--ink-500)', marginTop:2}}>{topic}</div>
                </div>
              </div>
            );
          })}
        </aside>

        {/* Question editor (center) */}
        <main style={{flex:1, padding: 24, overflow:'auto'}}>
          <div style={{maxWidth: 760, margin:'0 auto'}}>
            <div className="dr-card" style={{padding: '24px 28px', marginBottom: 16}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 18}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <span className="dr-chip dr-chip-blue">Câu 7</span>
                  <span style={{fontSize:13, color:'var(--ink-700)', fontWeight:500}}>Đang chỉnh sửa</span>
                  <span className="dr-chip dr-chip-warn">Khó bất thường · 54% đúng</span>
                </div>
                <div style={{display:'flex', gap:6}}>
                  <button className="dr-btn dr-btn-ghost" style={{height:30, fontSize:12, padding:'0 8px'}}>Sao chép</button>
                  <button className="dr-btn dr-btn-ghost" style={{height:30, fontSize:12, padding:'0 8px', color:'var(--danger-700)'}}>Xoá</button>
                </div>
              </div>

              {/* Type selector */}
              <FieldRow label="Loại câu hỏi">
                <div style={{display:'flex', gap:6}}>
                  {[
                    {id:'single', label:'1 đáp án', active:true},
                    {id:'multi', label:'Nhiều đáp án'},
                    {id:'tf', label:'Đúng/Sai'},
                    {id:'scenario', label:'Tình huống'},
                    {id:'short', label:'Trả lời ngắn'},
                  ].map(o => (
                    <button key={o.id} style={{
                      padding:'7px 12px', borderRadius: 'var(--r-sm)',
                      border: o.active ? '1.5px solid var(--droppii-blue-700)' : '1px solid var(--ink-200)',
                      background: o.active ? 'var(--droppii-blue-50)' : 'white',
                      color: o.active ? 'var(--droppii-blue-700)' : 'var(--ink-700)',
                      fontSize:12, fontWeight: o.active ? 600 : 500, cursor:'pointer', fontFamily:'inherit',
                    }}>{o.label}</button>
                  ))}
                </div>
              </FieldRow>

              <FieldRow label="Nội dung câu hỏi">
                <textarea className="dr-input" style={{height: 'auto', padding: 12, fontSize:14, lineHeight:1.55, resize:'vertical', minHeight: 110}} defaultValue={Q.stem}/>
                <div style={{fontSize:11, color:'var(--ink-500)', marginTop:6, display:'flex', justifyContent:'space-between'}}>
                  <span>Hỗ trợ Markdown · có thể chèn ảnh, bảng</span>
                  <button style={{background:'none', border:'none', color:'var(--droppii-blue-700)', fontSize:11, fontWeight:600, cursor:'pointer'}}>+ Chèn ảnh / bảng dữ liệu</button>
                </div>
              </FieldRow>

              <FieldRow label="Đáp án (chọn ô bên trái cho đáp án đúng)">
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  {Q.options.map((opt, i) => {
                    const isCorrect = i === 1;
                    return (
                      <div key={i} style={{display:'flex', alignItems:'center', gap:10}}>
                        <label style={{display:'flex', alignItems:'center', gap:8, padding:'10px 12px', border:'1px solid var(--ink-200)', borderRadius:'var(--r-sm)', background: isCorrect ? 'var(--success-100)' : 'white', flex:1, cursor:'pointer'}}>
                          <div style={{width:18, height:18, borderRadius:'50%', border: isCorrect ? 'none' : '1.5px solid var(--ink-300)', background: isCorrect ? 'var(--success-500)' : 'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                            {isCorrect && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M5 13l4 4L19 7"/></svg>}
                          </div>
                          <input defaultValue={opt} style={{border:'none', outline:'none', flex:1, fontSize:13, fontFamily:'inherit', background:'transparent', color: isCorrect ? 'var(--success-700)' : 'var(--ink-800)', fontWeight: isCorrect ? 600 : 400}}/>
                        </label>
                        <button style={{background:'none', border:'none', padding:6, color:'var(--ink-500)', cursor:'pointer'}}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                        </button>
                      </div>
                    );
                  })}
                  <button style={{padding:'8px 12px', border:'1px dashed var(--ink-300)', borderRadius:'var(--r-sm)', background:'transparent', color:'var(--ink-600)', fontSize:13, fontWeight:500, cursor:'pointer', alignSelf:'flex-start', fontFamily:'inherit'}}>+ Thêm đáp án</button>
                </div>
              </FieldRow>

              <FieldRow label="Giải thích (hiển thị sau khi nộp)">
                <textarea className="dr-input" style={{height:'auto', padding:12, fontSize:13, minHeight:80, resize:'vertical'}} defaultValue={Q.explain}/>
              </FieldRow>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14, marginTop: 14}}>
                <FieldRow label="Chủ đề" compact>
                  <select className="dr-input" style={{height: 38, fontSize:13}} defaultValue="Lâm sàng">
                    <option>Cơ bản về AI</option>
                    <option>Đạo đức & Tuân thủ</option>
                    <option>Lâm sàng</option>
                    <option>Sản phẩm</option>
                    <option>Tư vấn</option>
                  </select>
                </FieldRow>
                <FieldRow label="Độ khó" compact>
                  <select className="dr-input" style={{height: 38, fontSize:13}} defaultValue="Khó">
                    <option>Dễ</option><option>Vừa</option><option>Khó</option>
                  </select>
                </FieldRow>
                <FieldRow label="Thời gian (giây)" compact>
                  <input className="dr-input" style={{height: 38, fontSize:13}} defaultValue="120"/>
                </FieldRow>
              </div>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <button className="dr-btn dr-btn-ghost">← Câu 6</button>
              <span style={{fontSize:12, color:'var(--ink-500)'}}>Tự động lưu lúc 14:32</span>
              <button className="dr-btn dr-btn-secondary">Câu 8 →</button>
            </div>
          </div>
        </main>

        {/* Right inspector */}
        <aside style={{width: 260, borderLeft:'1px solid var(--ink-200)', background:'white', padding: 20, overflow:'auto', flexShrink:0}}>
          <div style={{fontSize:11, fontWeight:600, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom: 12}}>Hiệu năng câu hỏi</div>
          <div style={{padding:'14px 0', borderBottom:'1px solid var(--ink-100)'}}>
            <div style={{fontSize:11, color:'var(--ink-500)', marginBottom:4}}>Tỷ lệ đúng</div>
            <div style={{fontSize:24, fontWeight:700, color:'var(--warning-500)'}}>54%</div>
            <div style={{fontSize:11, color:'var(--ink-500)', marginTop:2}}>Trung bình bài: 76%</div>
          </div>
          <div style={{padding:'14px 0', borderBottom:'1px solid var(--ink-100)'}}>
            <div style={{fontSize:11, color:'var(--ink-500)', marginBottom:4}}>Thời gian trung bình</div>
            <div style={{fontSize:24, fontWeight:700}}>1:58</div>
            <div style={{fontSize:11, color:'var(--ink-500)', marginTop:2}}>Trung bình bài: 1:02</div>
          </div>
          <div style={{padding:'14px 0', borderBottom:'1px solid var(--ink-100)'}}>
            <div style={{fontSize:11, color:'var(--ink-500)', marginBottom:8}}>Phân bố lựa chọn</div>
            {[
              {label:'A · Có thể ngừng thuốc...', pct: 8, danger:true},
              {label:'B · TPCN và chế độ ăn hỗ trợ...', pct: 54, ok:true},
              {label:'C · Chỉ cần TPCN...', pct: 24, danger:true},
              {label:'D · Không cần duy trì chế độ ăn...', pct: 14, danger:true},
            ].map((r, i) => (
              <div key={i} style={{marginBottom: 8}}>
                <div style={{fontSize:11, color:'var(--ink-700)', marginBottom: 3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.label}</div>
                <div style={{display:'flex', alignItems:'center', gap: 6}}>
                  <div style={{flex:1, height:5, background:'var(--ink-100)', borderRadius:99, overflow:'hidden'}}>
                    <div style={{height:'100%', width: r.pct + '%', background: r.ok ? 'var(--success-500)' : 'var(--danger-500)'}}/>
                  </div>
                  <span style={{fontSize:11, color:'var(--ink-700)', fontWeight:600, minWidth: 28, textAlign:'right'}}>{r.pct}%</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding: 12, marginTop: 14, background:'#fff8e6', border:'1px solid #ffe39a', borderRadius:'var(--r-md)', fontSize:12, color:'#7a4e00', lineHeight:1.5}}>
            <b style={{display:'block', marginBottom:4}}>💡 Gợi ý</b>
            Tỷ lệ đúng thấp hơn trung bình. Cân nhắc làm rõ ngữ cảnh hoặc bổ sung gợi ý ngữ pháp cho đáp án A,C,D.
          </div>
        </aside>
      </div>
    </div>
  );
}

function FieldRow({ label, children, compact }) {
  return (
    <div style={{marginBottom: compact ? 0 : 16}}>
      <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>{label}</div>
      {children}
    </div>
  );
}

// ─────────────────── Create New Test (empty state / wizard) ───────────────────
function AdmTestCreate({ onPublished }) {
  const [step, setStep] = useStateBuilder(1);
  const [name, setName] = useStateBuilder('');
  const [code, setCode] = useStateBuilder('DRP-NEW-' + Math.random().toString(36).slice(2,5).toUpperCase());
  const publish = () => {
    window.DroppiiSync.addTest({ id: code, name: name || 'Bài kiểm tra mới', questions_total: 20, status:'Đang mở', published_at: new Date().toISOString() });
    if (onPublished) onPublished();
  };
  const steps = [
    { n: 1, label: 'Thông tin chung' },
    { n: 2, label: 'Cấu hình bài thi' },
    { n: 3, label: 'Thêm câu hỏi' },
    { n: 4, label: 'Xem lại & Xuất bản' },
  ];

  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)', display:'flex', flexDirection:'column'}}>
      {/* breadcrumb header */}
      <div style={{padding:'14px 28px 0', background:'white', borderBottom:'1px solid var(--ink-100)', flexShrink:0}}>
        <div style={{fontSize:12, color:'var(--ink-500)', marginBottom: 8}}>
          <a href="#" style={{color:'var(--ink-500)', textDecoration:'none'}}>Bài kiểm tra</a>
          <span style={{margin:'0 6px'}}>/</span>
          <span style={{color:'var(--ink-700)'}}>Tạo bài kiểm tra mới</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', paddingBottom: 16}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom: 4}}>
              <h1 style={{margin:0, fontSize: 22, fontWeight:700, letterSpacing:'-0.01em'}}>Tạo bài kiểm tra mới</h1>
              <StatusPill status="Bản nháp"/>
            </div>
            <div style={{fontSize:13, color:'var(--ink-500)'}}>Bài kiểm tra sẽ tự động lưu nháp. Chỉ xuất bản khi bạn nhấn "Xuất bản".</div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="dr-btn dr-btn-ghost" style={{height:38, fontSize:13, padding:'0 14px'}}>Huỷ</button>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 14px'}}>Lưu nháp</button>
          </div>
        </div>

        {/* step indicator */}
        <div style={{display:'flex', alignItems:'center', gap: 0, paddingBottom: 0}}>
          {steps.map((s, i) => {
            const isActive = s.n === step;
            const isDone = s.n < step;
            return (
              <React.Fragment key={s.n}>
                <button onClick={() => setStep(s.n)} style={{
                  display:'flex', alignItems:'center', gap: 8,
                  padding:'10px 4px', border:'none', background:'none', cursor:'pointer',
                  fontFamily:'inherit',
                  borderBottom: isActive ? '2px solid var(--droppii-blue-700)' : '2px solid transparent',
                  marginBottom: -1,
                }}>
                  <span style={{
                    width:22, height:22, borderRadius:'50%',
                    background: isActive ? 'var(--droppii-blue-700)' : isDone ? 'var(--success-500)' : 'var(--ink-100)',
                    color: isActive || isDone ? 'white' : 'var(--ink-600)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {isDone ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M5 13l4 4L19 7"/></svg> : s.n}
                  </span>
                  <span style={{
                    fontSize:13,
                    color: isActive ? 'var(--droppii-blue-700)' : isDone ? 'var(--ink-700)' : 'var(--ink-500)',
                    fontWeight: isActive ? 600 : 500,
                  }}>{s.label}</span>
                </button>
                {i < steps.length - 1 && <div style={{flex: '0 0 36px', height: 1, background:'var(--ink-200)', margin:'0 12px'}}/>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <main style={{flex:1, padding: 28, overflow:'auto'}}>
        <div style={{maxWidth: 760, margin:'0 auto'}}>
          {step === 1 && <CreateStep1/>}
          {step === 2 && <CreateStep2/>}
          {step === 3 && <CreateStep3/>}
          {step === 4 && <CreateStep4/>}

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 20}}>
            <button className="dr-btn dr-btn-ghost" disabled={step === 1} onClick={() => setStep(s => Math.max(1, s-1))} style={{opacity: step === 1 ? 0.4 : 1}}>← Quay lại</button>
            <span style={{fontSize:12, color:'var(--ink-500)'}}>Bước {step} / 4 · tự động lưu</span>
            {step < 4 ? (
              <button className="dr-btn dr-btn-primary" onClick={() => setStep(s => Math.min(4, s+1))}>Tiếp theo →</button>
            ) : (
              <button className="dr-btn dr-btn-primary" onClick={publish}>Xuất bản bài kiểm tra</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CreateStep1() {
  return (
    <>
      <div className="dr-card" style={{padding:'28px 32px', marginBottom: 16}}>
        <h2 style={{margin:'0 0 4px', fontSize:18, fontWeight:600}}>Thông tin chung</h2>
        <p style={{margin:'0 0 22px', fontSize:13, color:'var(--ink-500)'}}>Đặt tên dễ nhận biết. Mã bài thi sẽ được tự sinh và có thể chỉnh sửa.</p>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Tên bài kiểm tra <span style={{color:'var(--danger-700)'}}>*</span></div>
          <input className="dr-input" style={{height:42, fontSize:14}} placeholder="VD: Kiến thức AI cho Nhà bán hàng — 2026" autoFocus/* live binding handled by parent *//>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom:16}}>
          <div>
            <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Mã bài thi</div>
            <input className="dr-input" style={{height:42, fontSize:14, fontFamily:'ui-monospace, Menlo, monospace'}} defaultValue="DRP-NEW-2026"/>
            <div style={{fontSize:11, color:'var(--ink-500)', marginTop:5}}>Hiển thị trong báo cáo và URL</div>
          </div>
          <div>
            <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Loại bài thi</div>
            <select className="dr-input" style={{height:42, fontSize:14}}>
              <option>Định kỳ — bất cứ ai cũng có thể thi</option>
              <option>Bắt buộc — gán cho seller mới</option>
              <option>Lịch cố định — tổ chức theo đợt</option>
            </select>
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Mô tả ngắn</div>
          <textarea className="dr-input" style={{padding:12, fontSize:13, minHeight:80, resize:'vertical', height:'auto'}} placeholder="Hiển thị cho nhà bán hàng trước khi bắt đầu thi..."/>
        </div>

        <div>
          <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 8}}>Chủ đề chính</div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            {['Cơ bản về AI', 'Đạo đức & Tuân thủ', 'Lâm sàng', 'Sản phẩm Droppii', 'Tư vấn cá nhân hoá'].map((t, i) => (
              <button key={t} style={{
                padding:'7px 12px', borderRadius: 99,
                border: i === 0 ? '1.5px solid var(--droppii-blue-700)' : '1px solid var(--ink-200)',
                background: i === 0 ? 'var(--droppii-blue-50)' : 'white',
                color: i === 0 ? 'var(--droppii-blue-700)' : 'var(--ink-700)',
                fontSize:12, fontWeight: i === 0 ? 600 : 500, cursor:'pointer', fontFamily:'inherit',
              }}>{i === 0 ? '✓ ' : '+ '}{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="dr-card" style={{padding:'20px 24px', marginBottom: 16, background:'var(--droppii-blue-50)', border:'1px solid var(--droppii-blue-100)'}}>
        <div style={{display:'flex', gap:14}}>
          <div style={{fontSize:24}}>📋</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14, fontWeight:600, color:'var(--droppii-blue-700)', marginBottom:4}}>Hoặc bắt đầu từ mẫu có sẵn</div>
            <div style={{fontSize:12, color:'var(--ink-700)', marginBottom: 10}}>Sao chép cấu trúc và câu hỏi từ một bài kiểm tra hiện có.</div>
            <div style={{display:'flex', gap:8}}>
              <button className="dr-btn dr-btn-secondary" style={{height:32, fontSize:12, padding:'0 12px'}}>Sao chép từ DRP-AI-2026</button>
              <button className="dr-btn dr-btn-secondary" style={{height:32, fontSize:12, padding:'0 12px'}}>Mẫu trống</button>
              <button className="dr-btn dr-btn-secondary" style={{height:32, fontSize:12, padding:'0 12px'}}>Nhập từ Excel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateStep2() {
  return (
    <div className="dr-card" style={{padding:'28px 32px'}}>
      <h2 style={{margin:'0 0 4px', fontSize:18, fontWeight:600}}>Cấu hình bài thi</h2>
      <p style={{margin:'0 0 22px', fontSize:13, color:'var(--ink-500)'}}>Quy tắc chấm điểm, thời gian, và hành vi khi thi.</p>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 18}}>
        <div>
          <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Thời gian làm bài</div>
          <div style={{display:'flex', alignItems:'center', gap: 8}}>
            <input className="dr-input" style={{height:42, fontSize:14, width: 80, textAlign:'center'}} defaultValue="30"/>
            <span style={{fontSize:13, color:'var(--ink-700)'}}>phút</span>
          </div>
        </div>
        <div>
          <div style={{fontSize:12, fontWeight:600, color:'var(--ink-700)', marginBottom: 6}}>Điểm đậu tối thiểu</div>
          <div style={{display:'flex', alignItems:'center', gap: 8}}>
            <input className="dr-input" style={{height:42, fontSize:14, width: 80, textAlign:'center'}} defaultValue="70"/>
            <span style={{fontSize:13, color:'var(--ink-700)'}}>%</span>
          </div>
        </div>
      </div>

      <div style={{borderTop:'1px solid var(--ink-100)', paddingTop: 18, marginBottom: 18}}>
        <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 14}}>Hành vi khi thi</div>
        {[
          { t: 'Trộn thứ tự câu hỏi', s: 'Mỗi seller sẽ nhận thứ tự câu hỏi khác nhau', on: true },
          { t: 'Trộn thứ tự đáp án', s: 'Vị trí A/B/C/D ngẫu nhiên cho mỗi câu', on: true },
          { t: 'Cho phép quay lại câu trước', s: 'Seller có thể chỉnh sửa câu đã trả lời', on: true },
          { t: 'Hiển thị câu nào còn thiếu', s: 'Bảng đánh dấu các câu chưa làm', on: true },
          { t: 'Bắt buộc fullscreen', s: 'Tự động nộp bài nếu seller thoát fullscreen', on: false },
          { t: 'Hiển thị đáp án đúng sau khi nộp', s: 'Seller có thể xem lại bài và giải thích', on: false },
        ].map((opt, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom: i < 5 ? '1px solid var(--ink-100)' : 'none'}}>
            <div>
              <div style={{fontSize:13, color:'var(--ink-900)', fontWeight:500}}>{opt.t}</div>
              <div style={{fontSize:12, color:'var(--ink-500)', marginTop:2}}>{opt.s}</div>
            </div>
            <div style={{
              width: 36, height: 20, borderRadius: 99,
              background: opt.on ? 'var(--droppii-blue-700)' : 'var(--ink-200)',
              position:'relative', cursor:'pointer', flexShrink:0, transition:'background .15s',
            }}>
              <div style={{
                position:'absolute', top:2, left: opt.on ? 18 : 2,
                width:16, height:16, borderRadius:'50%', background:'white',
                boxShadow:'0 1px 2px rgba(0,0,0,0.2)', transition:'left .15s',
              }}/>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 14}}>Cấp chứng nhận</div>
        <div style={{display:'flex', gap: 10}}>
          {[
            { id:'auto', label:'Tự động khi đậu', desc:'Hệ thống cấp ngay khi seller đạt điểm', active: true },
            { id:'manual', label:'Cấp thủ công', desc:'Admin xét duyệt từng trường hợp' },
          ].map(o => (
            <label key={o.id} style={{
              flex: 1, padding:'14px 16px', borderRadius:'var(--r-md)', cursor:'pointer',
              border: o.active ? '1.5px solid var(--droppii-blue-700)' : '1px solid var(--ink-200)',
              background: o.active ? 'var(--droppii-blue-50)' : 'white',
              display:'flex', alignItems:'flex-start', gap:10,
            }}>
              <div style={{width:18, height:18, borderRadius:'50%', border: o.active ? 'none' : '1.5px solid var(--ink-300)', background: o.active ? 'var(--droppii-blue-700)' : 'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2}}>
                {o.active && <div style={{width:8, height:8, borderRadius:'50%', background:'white'}}/>}
              </div>
              <div>
                <div style={{fontSize:13, fontWeight:600, color: o.active ? 'var(--droppii-blue-700)' : 'var(--ink-900)'}}>{o.label}</div>
                <div style={{fontSize:12, color:'var(--ink-500)', marginTop:2}}>{o.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateStep3() {
  return (
    <>
      <div className="dr-card" style={{padding:'28px 32px', marginBottom: 16}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 22}}>
          <div>
            <h2 style={{margin:'0 0 4px', fontSize:18, fontWeight:600}}>Thêm câu hỏi</h2>
            <p style={{margin:0, fontSize:13, color:'var(--ink-500)'}}>Tạo mới hoặc chọn từ ngân hàng câu hỏi đã có.</p>
          </div>
          <span style={{padding:'4px 10px', background:'var(--ink-100)', borderRadius: 99, fontSize:11, fontWeight:600, color:'var(--ink-700)'}}>0 / 20 câu</span>
        </div>

        {/* Empty state */}
        <div style={{
          border:'2px dashed var(--ink-200)', borderRadius:'var(--r-md)',
          padding:'48px 24px', textAlign:'center',
          background:'var(--ink-50)',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius:'50%', background:'white',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 14px', border:'1px solid var(--ink-200)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--droppii-blue-700)" strokeWidth="1.8"><path d="M9 8h6M9 12h6M9 16h3M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>
          </div>
          <div style={{fontSize:15, fontWeight:600, color:'var(--ink-900)', marginBottom: 4}}>Chưa có câu hỏi nào</div>
          <div style={{fontSize:13, color:'var(--ink-500)', marginBottom: 20, maxWidth: 360, margin:'0 auto 20px'}}>Mỗi bài kiểm tra cần ít nhất 5 câu hỏi để xuất bản.</div>
          <div style={{display:'flex', gap: 10, justifyContent:'center', flexWrap:'wrap'}}>
            <button className="dr-btn dr-btn-primary" style={{height:38, fontSize:13, padding:'0 16px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
              Tạo câu hỏi mới
            </button>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 16px'}}>Chọn từ ngân hàng câu hỏi</button>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 16px'}}>Nhập từ Excel/CSV</button>
          </div>
        </div>
      </div>

      {/* Question types preview */}
      <div className="dr-card" style={{padding:'20px 24px'}}>
        <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', marginBottom: 12}}>Các loại câu hỏi được hỗ trợ</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 10}}>
          {[
            { ico:'⊙', t:'Một đáp án đúng', s:'Người thi chọn 1 trong nhiều lựa chọn' },
            { ico:'☷', t:'Nhiều đáp án đúng', s:'Tích chọn tất cả đáp án phù hợp' },
            { ico:'📋', t:'Tình huống lâm sàng', s:'Đề bài dài kèm bảng/dữ liệu, có ngữ cảnh' },
            { ico:'✎', t:'Trả lời ngắn', s:'Tự luận ngắn, AI hỗ trợ chấm điểm' },
          ].map(t => (
            <div key={t.t} style={{display:'flex', gap: 10, padding:'10px 12px', border:'1px solid var(--ink-200)', borderRadius:'var(--r-sm)'}}>
              <div style={{width:30, height:30, borderRadius:6, background:'var(--ink-100)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0}}>{t.ico}</div>
              <div style={{flex:1, minWidth: 0}}>
                <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)'}}>{t.t}</div>
                <div style={{fontSize:11, color:'var(--ink-500)', marginTop:1}}>{t.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CreateStep4() {
  return (
    <div className="dr-card" style={{padding:'28px 32px'}}>
      <h2 style={{margin:'0 0 4px', fontSize:18, fontWeight:600}}>Xem lại & Xuất bản</h2>
      <p style={{margin:'0 0 22px', fontSize:13, color:'var(--ink-500)'}}>Kiểm tra tổng quan trước khi mở cho 52,481 nhà bán hàng.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginBottom: 18}}>
        {[
          { l:'Tên bài kiểm tra', v:'Kiến thức AI cho Nhà bán hàng — 2026' },
          { l:'Mã', v:'DRP-NEW-2026' },
          { l:'Số câu hỏi', v:'20 câu' },
          { l:'Thời gian', v:'30 phút' },
          { l:'Điểm đậu', v:'≥ 70%' },
          { l:'Cấp chứng nhận', v:'Tự động khi đậu' },
        ].map(r => (
          <div key={r.l} style={{padding:'12px 14px', background:'var(--ink-50)', borderRadius:'var(--r-sm)'}}>
            <div style={{fontSize:11, color:'var(--ink-500)', marginBottom:3}}>{r.l}</div>
            <div style={{fontSize:13, color:'var(--ink-900)', fontWeight:500}}>{r.v}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'14px 16px', background:'var(--success-100)', borderRadius:'var(--r-md)', display:'flex', gap:10, alignItems:'center'}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-700)" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
        <div style={{fontSize:13, color:'var(--success-700)', fontWeight:500}}>Sẵn sàng để xuất bản. Sau khi xuất bản, bài thi sẽ hiện trên trang nhà bán hàng.</div>
      </div>
    </div>
  );
}

window.AdmTestList = AdmTestList;
window.AdmTestEditor = AdmTestEditor;
window.AdmTestCreate = AdmTestCreate;

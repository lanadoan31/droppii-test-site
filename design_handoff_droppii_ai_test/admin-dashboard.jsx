// Admin — Dashboard screen (Tổng quan)
// KPI tiles, pass-rate chart, recent activity, active tests strip.

function AdmDashboard() {
  const k = window.ADMIN.kpis;
  const fmt = n => n.toLocaleString('vi-VN');
  const series = window.ADMIN.pass_rate_series;

  return (
    <div style={{flex:1, overflow:'auto', background:'var(--ink-50)'}}>
      <AdmHeader
        title="Tổng quan hệ thống"
        subtitle={
          <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
            <span>{fmt(window.ADMIN.org.seller_count)} nhà bán hàng · {window.ADMIN.org.region_count} khu vực</span>
            <span style={{display:'inline-flex', alignItems:'center', gap:5, padding:'2px 8px', background:'var(--success-100)', color:'var(--success-700)', borderRadius:99, fontSize:11, fontWeight:600}}>
              <span style={{width:6, height:6, borderRadius:'50%', background:'var(--success-500)'}}/>
              Đồng bộ trực tiếp với trang nhà bán hàng
            </span>
          </span>
        }
        actions={
          <>
            <button className="dr-btn dr-btn-secondary" style={{height:38, fontSize:13, padding:'0 14px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0z"/></svg>
              30 ngày qua
            </button>
            <button className="dr-btn dr-btn-primary" style={{height:38, fontSize:13, padding:'0 14px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
              Tạo bài kiểm tra
            </button>
          </>
        }
      />

      <main style={{padding: 24}}>
        {/* KPI tiles */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14, marginBottom: 20}}>
          {[
            { label:'Tổng nhà bán hàng', value: fmt(k.sellers_total), delta: '+842 tháng này', up:true, sub:`${fmt(k.sellers_certified)} đã có chứng nhận`, accent:'var(--droppii-blue-700)' },
            { label:'Tỷ lệ đậu', value: k.pass_rate + '%', delta: `+${k.pass_rate_delta}% vs tháng trước`, up:true, sub:'Chuẩn ngành: 70%', accent:'var(--success-700)' },
            { label:'Điểm trung bình', value: k.avg_score, delta: `+${k.avg_score_delta} điểm`, up:true, sub:'Trên 100 điểm', accent:'var(--ink-900)' },
            { label:'Bỏ giữa chừng', value: k.drop_off_rate + '%', delta: `${k.drop_off_delta}% vs tháng trước`, up:false, sub:'Mục tiêu: <10%', accent:'var(--droppii-orange-600)' },
          ].map(t => (
            <div key={t.label} className="dr-card" style={{padding:'18px 20px'}}>
              <div style={{fontSize:12, color:'var(--ink-500)', fontWeight:500, marginBottom:8}}>{t.label}</div>
              <div style={{fontSize:28, fontWeight:700, color: t.accent, letterSpacing:'-0.02em', lineHeight:1}}>{t.value}</div>
              <div style={{display:'flex', alignItems:'center', gap:6, marginTop:10, fontSize:12}}>
                <span style={{color: t.up ? 'var(--success-700)' : 'var(--success-700)', fontWeight:600, display:'inline-flex', alignItems:'center', gap:2}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{transform: t.up ? '' : 'rotate(180deg)'}}><path d="M12 5v14M5 12l7-7 7 7"/></svg>
                  {t.delta}
                </span>
              </div>
              <div style={{fontSize:11, color:'var(--ink-500)', marginTop:4}}>{t.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart + active tests */}
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 14, marginBottom: 20}}>
          <div className="dr-card" style={{padding:'22px 24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 18}}>
              <div>
                <h3 style={{margin:'0 0 2px', fontSize:15, fontWeight:600}}>Tỷ lệ đậu theo tuần</h3>
                <div style={{fontSize:12, color:'var(--ink-500)'}}>13 tuần qua · tất cả bài kiểm tra</div>
              </div>
              <div style={{fontSize:12, color:'var(--ink-500)'}}>
                <span style={{display:'inline-flex', alignItems:'center', gap:5, marginRight:14}}>
                  <span style={{width:10, height:2, background:'var(--droppii-blue-700)', borderRadius:2, display:'inline-block'}}/>
                  Tỷ lệ đậu
                </span>
                <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
                  <span style={{width:10, height:2, background:'var(--ink-300)', borderStyle:'dashed', borderWidth:'1px 0 0 0', borderColor:'var(--ink-400)', display:'inline-block'}}/>
                  Mục tiêu 70%
                </span>
              </div>
            </div>
            <AdmLineChart data={series}/>
          </div>

          <div className="dr-card" style={{padding:'22px 24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14}}>
              <h3 style={{margin:0, fontSize:15, fontWeight:600}}>Bài kiểm tra đang mở</h3>
              <a href="#" style={{fontSize:12, color:'var(--droppii-blue-700)', fontWeight:600, textDecoration:'none'}}>Tất cả →</a>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {window.ADMIN.tests.filter(t => t.status === 'Đang mở').slice(0,3).map(t => (
                <div key={t.id} style={{padding:'12px 14px', border:'1px solid var(--ink-200)', borderRadius:'var(--r-md)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
                    <div style={{fontSize:13, fontWeight:600, color:'var(--ink-900)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.name}</div>
                    <StatusPill status={t.status}/>
                  </div>
                  <div style={{fontSize:11, color:'var(--ink-500)', marginBottom: 8}}>{t.id} · {fmt(t.taken)} lượt thi · {t.pass_rate}% đậu</div>
                  <div style={{height: 5, background:'var(--ink-100)', borderRadius:99, overflow:'hidden'}}>
                    <div style={{height:'100%', width: t.pass_rate+'%', background: t.pass_rate >= 70 ? 'var(--success-500)' : 'var(--warning-500)'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="dr-card" style={{padding:'4px 0'}}>
          <div style={{padding:'18px 24px 14px', display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <div>
              <h3 style={{margin:'0 0 2px', fontSize:15, fontWeight:600}}>Hoạt động gần đây</h3>
              <div style={{fontSize:12, color:'var(--ink-500)'}}>Nhật ký theo thời gian thực</div>
            </div>
            <button className="dr-btn dr-btn-ghost" style={{height:32, fontSize:12, padding:'0 10px'}}>Lọc</button>
          </div>
          <div style={{borderTop:'1px solid var(--ink-100)'}}>
            {window.ADMIN.recent_activity.map((a, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap: 14, padding:'12px 24px', borderBottom: i < window.ADMIN.recent_activity.length-1 ? '1px solid var(--ink-100)' : 'none'}}>
                <div style={{width:32, height:32, borderRadius:'50%', background:'var(--ink-100)', color:'var(--ink-700)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, flexShrink:0}}>
                  {a.who.split(' ').slice(-2).map(s=>s[0]).join('')}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, color:'var(--ink-900)'}}>
                    <b>{a.who}</b>
                    <span style={{color:'var(--ink-500)', margin:'0 6px'}}>·</span>
                    <span style={{color:'var(--ink-500)'}}>{a.id} · {a.region}</span>
                  </div>
                  <div style={{fontSize:12, color:'var(--ink-500)', marginTop:2}}>
                    {a.action === 'đang làm' ? 'Đang làm' : a.action === 'đậu' ? 'Đã đậu' : 'Đã rớt'} <b>{a.test}</b>{a.score !== null ? ` · ${a.score} điểm` : ''}
                  </div>
                </div>
                <StatusPill status={a.action}/>
                <div style={{fontSize:11, color:'var(--ink-500)', minWidth: 80, textAlign:'right'}}>{a.when}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function AdmLineChart({ data }) {
  const W = 600, H = 200, PAD = { l: 36, r: 12, t: 12, b: 26 };
  const minY = 60, maxY = 80;
  const x = i => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const y = v => PAD.t + (1 - (v - minY) / (maxY - minY)) * (H - PAD.t - PAD.b);
  const path = data.map((v, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(v)}`).join(' ');
  const area = `${path} L ${x(data.length-1)} ${H - PAD.b} L ${x(0)} ${H - PAD.b} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', height: 200}}>
      <defs>
        <linearGradient id="adm-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--droppii-blue-700)" stopOpacity="0.18"/>
          <stop offset="1" stopColor="var(--droppii-blue-700)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Y grid */}
      {[60, 65, 70, 75, 80].map(v => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--ink-100)"/>
          <text x={PAD.l - 8} y={y(v)+4} fontSize="10" fill="var(--ink-500)" textAnchor="end">{v}%</text>
        </g>
      ))}
      <line x1={PAD.l} x2={W - PAD.r} y1={y(70)} y2={y(70)} stroke="var(--ink-400)" strokeDasharray="3 4"/>
      <path d={area} fill="url(#adm-area)"/>
      <path d={path} fill="none" stroke="var(--droppii-blue-700)" strokeWidth="2.2" strokeLinejoin="round"/>
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length-1 ? 4 : 2.5} fill="white" stroke="var(--droppii-blue-700)" strokeWidth="2"/>
      ))}
      {/* x-axis weeks */}
      {data.map((_, i) => i % 2 === 0 && (
        <text key={i} x={x(i)} y={H - 8} fontSize="10" fill="var(--ink-500)" textAnchor="middle">T-{12-i}</text>
      ))}
    </svg>
  );
}

window.AdmDashboard = AdmDashboard;
window.AdmLineChart = AdmLineChart;

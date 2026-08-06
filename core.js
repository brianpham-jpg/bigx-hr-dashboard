const API = 'https://script.google.com/macros/s/AKfycbxp_DCrToKsLfUa3rWMJhXi1-zjbSXs5hWRa0hSfy3OW90Vyb6UvuSv5ROKFPSPX9pR2Q/exec?action=data';
let rawData = null, filter = 'month', dfrom = null, dto = null;
let chartTrend = null, chartPipeline = null;

/* ─── DATE HELPERS ─── */
function parseDate(s){
  if(!s) return null;
  const p = String(s).split('/');
  if(p.length!==3) return null;
  const d = new Date(+p[2], +p[1]-1, +p[0]);
  return isNaN(d) ? null : d;
}
function fmtDate(s){ return s ? String(s) : '—'; }
function weekOf(d){
  const day=d.getDay()||7;
  const mon=new Date(d); mon.setDate(d.getDate()-day+1); mon.setHours(0,0,0,0);
  const sun=new Date(mon); sun.setDate(mon.getDate()+6); sun.setHours(23,59,59,999);
  return [mon,sun];
}
function getRange(f){
  const now=new Date();
  if(f==='week') return weekOf(now);
  if(f==='last-week'){ const lw=new Date(now); lw.setDate(now.getDate()-7); return weekOf(lw); }
  if(f==='month') return [new Date(now.getFullYear(),now.getMonth(),1), new Date(now.getFullYear(),now.getMonth()+1,0,23,59,59)];
  if(f==='last-month') return [new Date(now.getFullYear(),now.getMonth()-1,1), new Date(now.getFullYear(),now.getMonth(),0,23,59,59)];
  if(f==='year') return [new Date(now.getFullYear(),0,1), new Date(now.getFullYear(),11,31,23,59,59)];
  return null;
}
function getPrevRange(f){
  const now=new Date();
  if(f==='week'){ const pw=new Date(now); pw.setDate(now.getDate()-7); return weekOf(pw); }
  if(f==='last-week'){ const pw=new Date(now); pw.setDate(now.getDate()-14); return weekOf(pw); }
  if(f==='month') return [new Date(now.getFullYear(),now.getMonth()-1,1), new Date(now.getFullYear(),now.getMonth(),0,23,59,59)];
  if(f==='last-month') return [new Date(now.getFullYear(),now.getMonth()-2,1), new Date(now.getFullYear(),now.getMonth()-1,0,23,59,59)];
  if(f==='year') return [new Date(now.getFullYear()-1,0,1), new Date(now.getFullYear()-1,11,31,23,59,59)];
  return null;
}

/* ─── FILTER LOGIC ─── */
function filterCVs(cvs, range){
  if(!range) return cvs;
  const [a,b]=range;
  return cvs.filter(c=>{ const d=parseDate(c['NGAY']); return d&&d>=a&&d<=b; });
}
function applyFilter(cvs){ return filterCVs(cvs, filter==='custom'?[dfrom,dto]:getRange(filter)); }
function applyPrevFilter(cvs){ return filterCVs(cvs, getPrevRange(filter)); }

function setFilter(f){
  filter=f; dfrom=dto=null;
  document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));
  const map={'week':0,'last-week':1,'month':2,'last-month':3,'year':4,'all':5};
  document.querySelectorAll('.fb')[map[f]]?.classList.add('active');
  if(rawData) render();
}
function applyRange(){
  const a=document.getElementById('df').value, b=document.getElementById('dt').value;
  if(!a||!b) return;
  filter='custom'; dfrom=new Date(a); dto=new Date(b); dto.setHours(23,59,59,999);
  document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));
  if(rawData) render();
}

/* ─── BADGE HELPERS ─── */
function badge(curr, prev){
  if(!prev && prev!==0) return '<span class="badge-neutral"><i class="ti ti-minus"></i>—</span>';
  if(prev===0) return '<span class="badge-neutral"><i class="ti ti-minus"></i>—</span>';
  const pct=((curr-prev)/prev*100);
  const sign=pct>0?'+':'';
  if(Math.abs(pct)<0.05) return `<span class="badge-neutral"><i class="ti ti-minus"></i>Không đổi</span>`;
  return pct>0
    ? `<span class="badge-up"><i class="ti ti-trending-up"></i>${sign}${pct.toFixed(1)}%</span>`
    : `<span class="badge-down"><i class="ti ti-trending-down"></i>${pct.toFixed(1)}%</span>`;
}
function badgePt(curr, prev){
  if(!prev && prev!==0) return '<span class="badge-neutral"><i class="ti ti-minus"></i>—</span>';
  const diff=curr-prev;
  const sign=diff>0?'+':'';
  if(Math.abs(diff)<0.05) return `<span class="badge-neutral"><i class="ti ti-minus"></i>Không đổi</span>`;
  return diff>0
    ? `<span class="badge-up"><i class="ti ti-trending-up"></i>${sign}${diff.toFixed(1)}pt</span>`
    : `<span class="badge-down"><i class="ti ti-trending-down"></i>${diff.toFixed(1)}pt</span>`;
}
function getField(obj,...keys){
  for(const k of keys){ if(obj[k]!==undefined&&obj[k]!==null&&String(obj[k]).trim()!=='') return String(obj[k]).trim(); }
  return null;
}
function getFieldLike(obj,...patterns){
  const allKeys=Object.keys(obj);
  for(const p of patterns){
    const found=allKeys.find(k=>k.toUpperCase().replace(/\s/g,'').includes(p.toUpperCase().replace(/\s/g,'')));
    if(found&&obj[found]!==undefined&&obj[found]!==null&&String(obj[found]).trim()!=='') return String(obj[found]).trim();
  }
  return null;
}
function initials(name){
  if(!name) return '?';
  const parts=name.trim().split(' ');
  if(parts.length===1) return parts[0][0].toUpperCase();
  return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
}

/* ─── FETCH ─── */
const CACHE_KEY='bigx_hr_v2';
async function loadData(){
  /* Hiện cache ngay nếu có */
  const cached=localStorage.getItem(CACHE_KEY);
  if(cached){
    try{
      rawData=JSON.parse(cached);
      if(document.getElementById('nav-td').classList.contains('active')) render(); if(_khoActive()) renderKhoCV();
      document.getElementById('uptime').textContent='Đang làm mới...';
    }catch(_){}
  } else {
    document.getElementById('content').innerHTML='<div class="loading"><i class="ti ti-loader"></i>Đang tải dữ liệu...</div>';
    document.getElementById('uptime').textContent='Đang tải...';
  }
  /* Fetch mới ngầm */
  try{
    const r=await fetch(API);
    rawData=await r.json();
    localStorage.setItem(CACHE_KEY,JSON.stringify(rawData));
    document.getElementById('uptime').textContent='Cập nhật: '+new Date().toLocaleTimeString('vi-VN');
    if(document.getElementById('nav-td').classList.contains('active')) render(); if(_khoActive()) renderKhoCV();
    /* Nếu đang ở tab Công việc thì fetch task data riêng */
    if(document.getElementById('nav-cv').classList.contains('active')){
      loadTaskData();
    }
  }catch(e){
    if(!cached){
      document.getElementById('content').innerHTML=`<div class="error-msg"><i class="ti ti-wifi-off"></i>Lỗi kết nối API<br><small style="color:#94a3b8">${e.message}</small></div>`;
    }
    document.getElementById('uptime').textContent=cached?'Offline — dùng cache':'Lỗi';
  }
}

/* ─── RENDER ─── */
function render(){
  const cvs=rawData.cvs||[], viTri=rawData.positions||[];
  const fCVs=applyFilter(cvs);
  const pCVs=applyPrevFilter(cvs);

  /* KPI */
  const total=fCVs.length, pTotal=pCVs.length;
  /* Trúng tuyển tính theo NGÀY NHẬN VIỆC (không phải ngày nộp CV) */
  const _rNow=filter==='custom'?[dfrom,dto]:getRange(filter);
  const _rPrev=getPrevRange(filter);
  const inJoin=(s,r)=>{ if(!r) return true; const d=parseDate(s); return d&&d>=r[0]&&d<=r[1]; };
  const hiredArr=cvs.filter(c=>c['FINAL']==='TRÚNG TUYỂN'&&inJoin(c['NGÀY NHẬN VIỆC'],_rNow));
  const hired=hiredArr.length;
  const pHired=cvs.filter(c=>c['FINAL']==='TRÚNG TUYỂN'&&inJoin(c['NGÀY NHẬN VIỆC'],_rPrev)).length;
  const rate=total>0?(hired/total*100):0;
  const pRate=pTotal>0?(pHired/pTotal*100):0;
  const open=viTri.filter(v=>v['Trang Thai']==='Đang mở').length;
  const prevLabel=filter==='month'?'T.trước':filter==='week'?'Tuần trước':filter==='year'?'Năm trước':filter==='last-month'?'2 tháng trước':filter==='last-week'?'2 tuần trước':'';

  /* Pipeline by position (toàn bộ rawData, không filter date) */
  const byPos={};
  cvs.forEach(c=>{
    const vt=(c['VI TRI']||'Khác').trim();
    if(!byPos[vt]) byPos[vt]={cv:0,pass:0,hire:0};
    byPos[vt].cv++;
    if(c['HR REVIEW CV']&&String(c['HR REVIEW CV']).trim()) byPos[vt].pass++;
    if(c['FINAL']==='TRÚNG TUYỂN') byPos[vt].hire++;
  });
  const topPos=Object.entries(byPos).sort((a,b)=>b[1].cv-a[1].cv).slice(0,6);
  const maxCV=Math.max(...topPos.map(p=>p[1].cv),1);

  /* Trend 6 months */
  const now=new Date(), yr=now.getFullYear();
  const months=Array.from({length:6},(_,i)=>{
    const raw=now.getMonth()-5+i;
    const m=((raw%12)+12)%12;
    const y=raw<0?yr-1:yr;
    return {label:`T${m+1}`,m,y,cv:0,hire:0,rate:0};
  });
  cvs.forEach(c=>{
    const d=parseDate(c['NGAY']); if(!d) return;
    const idx=months.findIndex(mo=>mo.m===d.getMonth()&&mo.y===d.getFullYear());
    if(idx>=0){ months[idx].cv++; if(c['FINAL']==='TRÚNG TUYỂN') months[idx].hire++; }
  });
  months.forEach(m=>{ m.rate=m.cv>0?parseFloat((m.hire/m.cv*100).toFixed(1)):0; });

  /* Danh sách ứng viên trúng tuyển trong kỳ */
  const hiredList=hiredArr;

  /* ─── BUILD HTML ─── */
  document.getElementById('content').innerHTML=`
  <div class="td-kpi-grid">
    <div class="td-kpi">
      <div class="td-kpi-top">
        <span class="td-kpi-lbl">Tổng CV nhận</span>
        <div class="td-kpi-icon" style="background:#eff6ff;"><i class="ti ti-files" style="color:#3b82f6;"></i></div>
      </div>
      <div class="td-kpi-val">${total}</div>
      <div class="td-kpi-footer">
        <span class="td-kpi-prev">${prevLabel?prevLabel+': '+pTotal:'Tổng: '+cvs.length}</span>
        ${prevLabel?badge(total,pTotal):''}
      </div>
    </div>
    <div class="td-kpi">
      <div class="td-kpi-top">
        <span class="td-kpi-lbl">Trúng tuyển</span>
        <div class="td-kpi-icon" style="background:#f0fdf4;"><i class="ti ti-user-check" style="color:#22c55e;"></i></div>
      </div>
      <div class="td-kpi-val">${hired}</div>
      <div class="td-kpi-footer">
        <span class="td-kpi-prev">${prevLabel?prevLabel+': '+pHired:'Tổng: '+cvs.filter(c=>c['FINAL']==='TRÚNG TUYỂN').length}</span>
        ${prevLabel?badge(hired,pHired):''}
      </div>
    </div>
    <div class="td-kpi">
      <div class="td-kpi-top">
        <span class="td-kpi-lbl">Tỷ lệ đậu</span>
        <div class="td-kpi-icon" style="background:#fff7ed;"><i class="ti ti-chart-pie" style="color:#f97316;"></i></div>
      </div>
      <div class="td-kpi-val" style="color:#f97316;">${rate.toFixed(1)}%</div>
      <div class="td-kpi-footer">
        <span class="td-kpi-prev">${prevLabel?prevLabel+': '+pRate.toFixed(1)+'%':'Trúng / CV nhận'}</span>
        ${prevLabel?badgePt(rate,pRate):''}
      </div>
    </div>
    <div class="td-kpi">
      <div class="td-kpi-top">
        <span class="td-kpi-lbl">Vị trí đang mở</span>
        <div class="td-kpi-icon" style="background:#fdf4ff;"><i class="ti ti-briefcase" style="color:#a855f7;"></i></div>
      </div>
      <div class="td-kpi-val">${open}</div>
      <div class="td-kpi-footer">
        <span class="td-kpi-prev">Tổng vị trí: ${viTri.length}</span>
        <span class="badge-neutral"><i class="ti ti-minus"></i>Không đổi</span>
      </div>
    </div>
  </div>

  <div class="td-row-charts">
    <div class="td-card">
      <div class="td-card-title"><i class="ti ti-chart-line"></i>Xu hướng 6 tháng gần nhất</div>
      <div class="td-legend">
        <span class="td-leg"><span class="td-leg-sq" style="background:#818cf8;"></span>CV nhận</span>
        <span class="td-leg"><span class="td-leg-sq" style="background:#34d399;"></span>Trúng tuyển</span>
        <span class="td-leg"><span class="td-leg-sq" style="background:#fb923c;border-radius:50%;"></span>Tỷ lệ đậu (%)</span>
      </div>
      <div class="td-chart-wrap"><canvas id="chart-trend"></canvas></div>
    </div>
    <div class="td-card">
      <div class="td-card-title"><i class="ti ti-filter"></i>Pipeline theo vị trí</div>
      <div class="td-legend">
        <span class="td-leg"><span class="td-leg-sq" style="background:#c7d2fe;"></span>CV nhận</span>
        <span class="td-leg"><span class="td-leg-sq" style="background:#818cf8;"></span>HR pass</span>
        <span class="td-leg"><span class="td-leg-sq" style="background:#34d399;"></span>Trúng tuyển</span>
      </div>
      <div id="td-pipeline">
        ${topPos.map(([name,d])=>`
        <div class="td-bar-row">
          <div class="td-bar-lbl"><span>${name}</span><span>${d.cv}</span></div>
          <div class="td-bar-track" style="position:relative;height:7px;background:#f1f5f9;border-radius:4px;overflow:hidden;">
            <div class="td-bar-fill" style="width:${Math.round(d.cv/maxCV*100)}%;background:#c7d2fe;position:absolute;left:0;top:0;height:100%;border-radius:4px;"></div>
            <div class="td-bar-fill" style="width:${Math.round(d.pass/maxCV*100)}%;background:#818cf8;position:absolute;left:0;top:0;height:100%;border-radius:4px;"></div>
            <div class="td-bar-fill" style="width:${Math.round(d.hire/maxCV*100)}%;background:#34d399;position:absolute;left:0;top:0;height:100%;border-radius:4px;"></div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="td-row-bottom">
    <div class="td-card">
      <div class="td-card-title"><i class="ti ti-briefcase"></i>Danh sách vị trí tuyển dụng</div>
      <table class="td-table">
        <thead><tr>
          <th>Vị trí</th>
          <th>Lương</th>
          <th style="text-align:center;">SL</th>
          <th>Trạng thái</th>
        </tr></thead>
        <tbody>
          ${viTri.length===0?`<tr><td colspan="4" class="td-muted" style="text-align:center;padding:16px;">Không có dữ liệu</td></tr>`:
          viTri.map(v=>{
            const ten=getField(v,'Ten Vi Tri','VI TRI','Vị trí','TEN VI TRI','Ten','TEN')||'—';
            const luong=getField(v,'Muc Luong','Luong','LUONG','MUC LUONG','Lương','Mức lương')||'—';
            const sl=getField(v,'SL Can Tuyen','So Luong','SO LUONG','SL','Số lượng')||'—';
            const status=getField(v,'Trang Thai','Trạng thái')||'';
            const isOpen=status==='Đang mở';
            const statusLabel=status||'—';
            return `<tr>
              <td>${ten}</td>
              <td class="td-muted">${luong}</td>
              <td style="text-align:center;"><span class="qty-badge">${sl}</span></td>
              <td>${isOpen?'<span class="tag-open">Đang mở</span>':'<span class="tag-closed">'+statusLabel+'</span>'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="td-card">
      <div class="td-card-title" style="justify-content:space-between;">
        <span style="display:flex;align-items:center;gap:6px;">
          <i class="ti ti-user-check" style="color:#22c55e;"></i>Ứng viên trúng tuyển trong kỳ
        </span>
        <span class="td-count-badge">${hiredList.length} người</span>
      </div>
      <table class="td-table">
        <thead><tr>
          <th>Ứng viên</th>
          <th>Vị trí</th>
          <th>Ngày nộp CV</th>
          <th>Ngày nhận việc</th>
          <th>Kết quả</th>
        </tr></thead>
        <tbody>
          ${hiredList.length===0?`<tr><td colspan="5" class="td-muted" style="text-align:center;padding:16px;">Không có ứng viên trúng tuyển trong kỳ này</td></tr>`:
          hiredList.map(c=>{
            const ten=getField(c,'HO VA TEN','HO TEN','Ho Ten','TEN','Ten','Họ tên','HỌ TÊN')||'—';
            const vt=getField(c,'VI TRI','Vị trí')||'—';
            const ngayNop=getField(c,'NGAY','Ngày nộp','NGAY NOP')||'—';
            const ngayNV=getField(c,'NGÀY NHẬN VIỆC','NGAY NHAN VIEC','Ngay Nhan Viec','Ngày nhận việc','NNV')||'—';
            return `<tr>
              <td><span class="td-av">${initials(ten)}</span>${ten}</td>
              <td class="td-muted">${vt}</td>
              <td class="td-muted">${ngayNop}</td>
              <td class="td-muted">${ngayNV}</td>
              <td><span class="tag-hire">Trúng tuyển</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

  /* ─── CHARTS ─── */
  if(chartTrend) chartTrend.destroy();
  if(chartPipeline) chartPipeline.destroy();

  chartTrend = new Chart(document.getElementById('chart-trend').getContext('2d'),{
    type:'bar',
    data:{
      labels:months.map(m=>m.label),
      datasets:[
        {label:'CV nhận',data:months.map(m=>m.cv),backgroundColor:'rgba(129,140,248,0.2)',borderColor:'#818cf8',borderWidth:1.5,borderRadius:4,yAxisID:'y'},
        {label:'Trúng tuyển',data:months.map(m=>m.hire),backgroundColor:'rgba(52,211,153,0.2)',borderColor:'#34d399',borderWidth:1.5,borderRadius:4,yAxisID:'y'},
        {label:'Tỷ lệ đậu (%)',data:months.map(m=>m.rate),type:'line',borderColor:'#fb923c',backgroundColor:'transparent',borderWidth:2,pointRadius:4,pointBackgroundColor:'#fb923c',tension:0.4,yAxisID:'y2'}
      ]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{
        x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10},color:'#64748b'}},
        y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:10},color:'#64748b'},beginAtZero:true},
        y2:{position:'right',grid:{drawOnChartArea:false},ticks:{font:{size:10},color:'#ea7434',callback:v=>v+'%'},beginAtZero:true}
      }
    }
  });
}

function nav(v){
  document.querySelectorAll('.nav-item,.nav-sub').forEach(e=>e.classList.remove('active'));
  const fb=document.getElementById('filter-bar');
  if(v==='coming'){
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-tools"></i> Dashboard <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    document.getElementById('content').innerHTML='<div class="coming"><i class="ti ti-tools"></i>Chức năng đang phát triển</div>';
    return;
  }
  if(v==='tuyen-dung'){
    document.getElementById('nav-td').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-file-description"></i> Tuyển dụng <span class="live-tag">● Live</span>';
    fb.classList.remove('hidden');
    if(rawData) render(); else loadData();
    return;
  }
  if(v==='kho-cv'){
    document.getElementById('nav-khocv').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-folder"></i> Kho CV <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    loadKhoCV();
    return;
  }
  if(v==='so-do'){
    document.getElementById('nav-so-do').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-sitemap"></i> Sơ đồ tổ chức <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    renderSoDo();
    return;
  }
  if(v==='cong-viec'){
    document.getElementById('nav-cv').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-checklist"></i> Công việc nhân sự <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    loadTaskData();
    return;
  }
  if(v==='quy-trinh'){
    document.getElementById('nav-qt').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-arrow-guide"></i> Quy trình <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    renderQuyTrinh();
    return;
  }
  if(v==='quy-dinh'){
    document.getElementById('nav-qd').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-book"></i> Quy định <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    renderQuyDinh();
    return;
  }
  if(v==='calendar'){
    document.getElementById('nav-cal').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-calendar"></i> Calendar <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    calAuto();
    return;
  }
  if(v==='ho-so'){
    document.getElementById('nav-hs').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-id-badge"></i> Hồ sơ nhân sự <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    renderHoSo();
    loadHS();
    return;
  }
  if(v==='overview'){
    document.getElementById('nav-ov').classList.add('active');
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-layout-dashboard"></i> Tổng quan <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    loadOverview();
    return;
  }
  if(v==='form-hd'){
    document.getElementById('topbar-left').innerHTML='<i class="ti ti-template"></i> Form mẫu HĐ BigX <span class="live-tag">● Live</span>';
    fb.classList.add('hidden');
    document.getElementById('content').innerHTML=`<div style="padding:24px;max-width:920px;"><div style="display:flex;align-items:center;gap:8px;margin:2px 0 14px;"><i class="ti ti-building" style="font-size:16px;color:#6d28d9;"></i><span style="font-size:13px;font-weight:600;color:#334155;">Mẫu chung — các phòng ban</span><span style="flex:1;height:1px;background:#e2e8f0;"></span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><i class="ti ti-file-text" style="font-size:19px;color:#6d28d9;"></i><span style="font-size:14px;font-weight:600;color:#1e293b;">Hợp đồng thử việc</span></div><div style="font-size:12px;color:#64748b;line-height:1.85;"><div><i class="ti ti-clock" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Giờ làm: 09:00–18:00, T2–T6</div><div><i class="ti ti-cash" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Hỗ trợ: 6.000.000đ (không BHXH)</div></div><a href="https://docs.google.com/document/d/1pOJs13V_157I3qHJ9o1cGLYz16BRtQiitBZK-17L1SU/edit" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;margin-top:12px;font-size:12px;color:#6d28d9;text-decoration:none;font-weight:500;">Xem chi tiết <i class="ti ti-external-link" style="font-size:14px;"></i></a></div><div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><i class="ti ti-file-certificate" style="font-size:19px;color:#6d28d9;"></i><span style="font-size:14px;font-weight:600;color:#1e293b;">Hợp đồng lao động</span></div><div style="font-size:12px;color:#64748b;line-height:1.85;"><div><i class="ti ti-clock" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Thời hạn 6 tháng · 8h/ngày</div><div><i class="ti ti-cash" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Lương CB: 6.000.000đ + BHXH/YT/TN</div></div><a href="https://docs.google.com/document/d/1x2Kh9koe47NPdf66MBUZp1f8WkVMDzcNpAjbw27RrTM/edit" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;margin-top:12px;font-size:12px;color:#6d28d9;text-decoration:none;font-weight:500;">Xem chi tiết <i class="ti ti-external-link" style="font-size:14px;"></i></a></div></div><div style="display:flex;align-items:center;gap:8px;margin:22px 0 14px;"><i class="ti ti-briefcase" style="font-size:16px;color:#0f766e;"></i><span style="font-size:13px;font-weight:600;color:#334155;">Mẫu Sales — Business Development Executive</span><span style="flex:1;height:1px;background:#e2e8f0;"></span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;"><div style="background:#fff;border:1px solid #5DCAA5;border-radius:12px;padding:16px 18px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><i class="ti ti-file-text" style="font-size:19px;color:#0f766e;"></i><span style="font-size:14px;font-weight:600;color:#1e293b;">Hợp đồng thử việc</span></div><div style="font-size:12px;color:#64748b;line-height:1.85;"><div><i class="ti ti-clock" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Giờ làm: 09:00–18:00, T2–T6</div><div><i class="ti ti-cash" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Hỗ trợ: 6.000.000đ (không BHXH)</div></div><a href="https://docs.google.com/document/d/1pJN50xj6RFd89XdkatQEQTAdMJ-UX51XGZ6UrHKdD00/edit" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;margin-top:12px;font-size:12px;color:#0f766e;text-decoration:none;font-weight:500;">Xem chi tiết <i class="ti ti-external-link" style="font-size:14px;"></i></a></div><div style="background:#fff;border:1px solid #5DCAA5;border-radius:12px;padding:16px 18px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><i class="ti ti-file-certificate" style="font-size:19px;color:#0f766e;"></i><span style="font-size:14px;font-weight:600;color:#1e293b;">Hợp đồng lao động</span></div><div style="font-size:12px;color:#64748b;line-height:1.85;"><div><i class="ti ti-clock" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Thời hạn 6 tháng · 8h/ngày</div><div><i class="ti ti-cash" style="font-size:14px;vertical-align:-2px;margin-right:5px;"></i>Lương CB: 6.000.000đ + BHXH/YT/TN</div></div><a href="https://docs.google.com/document/d/1QPG2RHPAT4a2PS66-A_iQYqvSwKUUPGzQDA4WJZeZnQ/edit" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;margin-top:12px;font-size:12px;color:#0f766e;text-decoration:none;font-weight:500;">Xem chi tiết <i class="ti ti-external-link" style="font-size:14px;"></i></a></div></div></div>`;
    return;
  }
  document.getElementById('nav-td').classList.add('active');
  fb.classList.remove('hidden');
  if(rawData) render(); else loadData();
}

/* ══════════════════════════════════════════
   TỔNG QUAN — Overview (Style B)
══════════════════════════════════════════ */

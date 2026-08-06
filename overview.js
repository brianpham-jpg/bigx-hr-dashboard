const TQ_NV_TOTAL=26; /* Tổng nhân sự — cập nhật khi có nguồn data NV */
function tqIsActive(){ return document.getElementById('nav-ov').classList.contains('active'); }
function tqParseDate(s){ if(!s) return null; const p=String(s).trim().split('/'); if(p.length<3) return null; const d=+p[0],m=+p[1],y=+p[2]; if(!d||!m||!y) return null; return new Date(y,m-1,d); }
function tqProg(t){ const v=parseInt(String(t['Tiến độ (%)']||'').replace(/[^0-9]/g,''),10); return isNaN(v)?0:v; }

async function loadOverview(){
  renderTongQuan();
  if(!rawData){
    try{ const c=localStorage.getItem(CACHE_KEY); if(c) rawData=JSON.parse(c); }catch(_){}
    if(!rawData){ try{ const r=await fetch(API); rawData=await r.json(); localStorage.setItem(CACHE_KEY,JSON.stringify(rawData)); }catch(_){} }
    if(tqIsActive()) renderTongQuan();
  }
  if(!taskDataLoaded){
    const c=localStorage.getItem(TASK_CACHE_KEY);
    if(c){ try{ applyTaskData(JSON.parse(c)); }catch(_){ applyTaskData(null); } } else { applyTaskData(null); }
    taskDataLoaded=true;
    if(tqIsActive()) renderTongQuan();
    fetch(TASK_API).then(r=>r.json()).then(d=>{ applyTaskData(d); localStorage.setItem(TASK_CACHE_KEY,JSON.stringify({taskLH:rawTaskLH,taskCD:rawTaskCD})); if(tqIsActive()) renderTongQuan(); }).catch(()=>{});
  }
}

function tqEmptyBlock(title,icon,accent){
  return `<div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><i class="ti ${icon}" style="color:${accent};font-size:18px;"></i><span style="font-size:14px;font-weight:500;color:#1e293b;">${title}</span></div>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:96px;color:#94a3b8;font-size:12.5px;"><i class="ti ti-database-off" style="font-size:26px;color:#e2e8f0;"></i>Chưa có dữ liệu · cập nhật sau</div>
  </div>`;
}

function tqDept(){
  var empty='<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:96px;color:#94a3b8;font-size:12.5px;"><i class="ti ti-database-off" style="font-size:26px;color:#e2e8f0;"></i>Chưa có dữ liệu</div>';
  if(typeof HS_DATA==='undefined') return empty;
  var g={}; HS_DATA.forEach(function(e){ if(/ngh/i.test(e.tt||'')) return; if(String(e.pb||'').toUpperCase()==='GIÁM ĐỐC') return; var k=e.pb||'Khác'; g[k]=(g[k]||0)+1; });
  var arr=Object.keys(g).map(function(k){return {k:k,n:g[k]};}); if(!arr.length) return empty;
  arr.sort(function(a,b){return b.n-a.n;});
  var mx=Math.max.apply(null,arr.map(function(o){return o.n;}));
  return arr.map(function(o){var c=hsDC(o.k);return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:7px;"><span style="width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+o.k+'</span><div style="flex:1;height:8px;background:#f1f5f9;border-radius:20px;"><div style="width:'+Math.round(o.n/mx*100)+'%;height:8px;background:'+c[1]+';border-radius:20px;"></div></div><span style="width:20px;text-align:right;">'+o.n+'</span></div>';}).join('');
}
function tqBoard(){
  var empty='<div style="display:flex;align-items:center;justify-content:center;height:96px;color:#94a3b8;font-size:12.5px;">Chưa có dữ liệu</div>';
  if(typeof HS_DATA==='undefined') return empty;
  var arr=HS_DATA.filter(function(e){return String(e.pb||'').toUpperCase()==='GIÁM ĐỐC' && !/ngh/i.test(e.tt||'');});
  if(!arr.length) return empty;
  return arr.map(function(e){return '<div style="display:flex;align-items:center;gap:10px;font-size:12.5px;margin-bottom:10px;">'+hsImg(e,34)+'<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><b style="font-weight:600;">'+e.ten+'</b></span><span style="font-size:10px;font-weight:600;color:#5b21b6;background:#eeedfe;padding:2px 10px;border-radius:20px;white-space:nowrap;">'+(e.vt||'')+'</span></div>';}).join('');
}
function tqContracts(){
  var empty='<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:96px;color:#94a3b8;font-size:12.5px;"><i class="ti ti-file-check" style="font-size:26px;color:#e2e8f0;"></i>Không có hợp đồng sắp hết hạn</div>';
  if(typeof HS_DATA==='undefined') return empty;
  var now=new Date();
  var arr=HS_DATA.filter(function(e){return e.hetHan && !/ngh/i.test(e.tt||'');}).map(function(e){var d=hsPD(e.hetHan); return d?{e:e,d:d,days:Math.round((d-now)/86400000)}:null;}).filter(function(o){return o;});
  if(!arr.length) return empty;
  arr.sort(function(a,b){return a.d-b.d;});
  return arr.map(function(o){
    var loai=/thử việc/i.test(o.e.loaiHD||'')?'HĐTV':'HĐLĐ';
    var badge=o.days<0?('Quá hạn '+(-o.days)+'d'):(o.days+' ngày');
    var c=(o.days<=14)?['#faece7','#993c1d']:['#faeeda','#854f0b'];
    return '<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;margin-bottom:10px;"><span style="font-size:10px;font-weight:500;color:#0c447c;background:#e6f1fb;padding:2px 7px;border-radius:20px;white-space:nowrap;">'+loai+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+o.e.ten+'</span><span style="color:#94a3b8;white-space:nowrap;">'+o.e.hetHan.slice(0,5)+'</span><span style="font-size:10px;font-weight:500;color:'+c[1]+';background:'+c[0]+';padding:2px 8px;border-radius:20px;white-space:nowrap;">'+badge+'</span></div>';
  }).join('');
}
function tqBirthdays(){
  var empty='<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:96px;color:#94a3b8;font-size:12.5px;"><i class="ti ti-cake" style="font-size:26px;color:#e2e8f0;"></i>Không có sinh nhật tháng này / tháng sau</div>';
  if(typeof HS_DATA==='undefined') return empty;
  var now=new Date(), cm=now.getMonth(), nm=(cm+1)%12, today=now.getDate();
  var mn=['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  var arr=HS_DATA.filter(function(e){return e.ns && !/ngh/i.test(e.tt||'');}).map(function(e){var d=hsPD(e.ns); return d?{e:e,m:d.getMonth(),d:d.getDate()}:null;}).filter(function(o){return o && (o.m===cm||o.m===nm);});
  if(!arr.length) return empty;
  arr.sort(function(a,b){ var ma=(a.m-cm+12)%12, mb=(b.m-cm+12)%12; return ma-mb || a.d-b.d; });
  var html='', lastM=-1;
  arr.forEach(function(o){
    if(o.m!==lastM){ html+='<div style="font-size:11px;color:#94a3b8;font-weight:600;margin:10px 0 4px;">'+mn[o.m]+(o.m===cm?' (tháng này)':'')+'</div>'; lastM=o.m; }
    var soon=(o.m===cm && o.d>=today);
    html+='<div style="display:flex;align-items:center;gap:10px;font-size:12.5px;margin-bottom:8px;">'+hsImg(o.e,28)+'<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+o.e.ten+'</span><span style="font-size:10px;font-weight:500;color:#993556;background:#fbeaf0;padding:2px 8px;border-radius:20px;white-space:nowrap;">'+String(o.d).padStart(2,'0')+'/'+String(o.m+1).padStart(2,'0')+(soon?' · sắp tới':'')+'</span></div>';
  });
  return html;
}
function renderTongQuan(){
  const C=document.getElementById('content'); if(!C) return;
  const cvs=(rawData&&rawData.cvs)||[], viTri=(rawData&&rawData.positions)||[];
  const now=new Date();
  const cvThisMonth=cvs.filter(c=>{ const d=parseDate(c['NGAY']); return d&&d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); }).length;
  const open=viTri.filter(v=>v['Trang Thai']==='Đang mở').length;
  const totalCV=cvs.length, hired=cvs.filter(c=>c['FINAL']==='TRÚNG TUYỂN').length;
  const rate=totalCV>0?(hired/totalCV*100):0;
  const byPos={}; cvs.forEach(c=>{ const vt=(c['VI TRI']||'Khác').trim(); byPos[vt]=(byPos[vt]||0)+1; });
  const topPos=Object.entries(byPos).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const maxCV=Math.max(...topPos.map(p=>p[1]),1);
  const running=rawTaskLH.filter(t=>tqProg(t)<100), runCount=running.length;
  const attention=running.slice().sort((a,b)=>{ const da=tqParseDate(a.Deadline),db=tqParseDate(b.Deadline); return (da?da.getTime():9e15)-(db?db.getTime():9e15); }).slice(0,5);

  const kpi=(lbl,val,icon,bg,ic,tc,vc)=>`<div style="background:${bg};border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;">
    <div style="width:38px;height:38px;border-radius:10px;background:${ic};display:flex;align-items:center;justify-content:center;flex:none;"><i class="ti ${icon}" style="color:#fff;font-size:20px;"></i></div>
    <div><div style="font-size:22px;font-weight:600;color:${vc};">${val}</div><div style="font-size:11px;color:${tc};">${lbl}</div></div></div>`;
  const priBadge=(p)=>{ const m={'Cao':['#faece7','#993c1d'],'Trung bình':['#faeeda','#854f0b'],'Thấp':['#f1f5f9','#475569']}; const c=m[p]||m['Thấp']; return `<span style="font-size:10px;font-weight:600;color:${c[1]};background:${c[0]};padding:2px 8px;border-radius:20px;white-space:nowrap;">${p||'—'}</span>`; };
  const fmtDl=(s)=>{ const d=tqParseDate(s); return d?String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0'):(s||''); };
  const quick=(lbl,icon,v)=>`<div onclick="nav('${v}')" style="display:flex;align-items:center;gap:8px;border:0.5px solid #cbd5e1;border-radius:8px;padding:10px 12px;font-size:12.5px;cursor:pointer;"><i class="ti ${icon}" style="color:#5b21b6;"></i>${lbl}</div>`;

  const recruitCard=`<div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
    <div style="display:flex;align-items:center;margin-bottom:12px;"><span style="font-size:14px;font-weight:500;color:#1e293b;">Tuyển dụng</span><span onclick="nav('tuyen-dung')" style="margin-left:auto;font-size:12px;color:#5b21b6;cursor:pointer;">Chi tiết <i class="ti ti-arrow-right"></i></span></div>
    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div><div style="font-size:20px;font-weight:600;">${totalCV}</div><div style="font-size:11px;color:#94a3b8;">Tổng CV</div></div>
      <div><div style="font-size:20px;font-weight:600;">${hired}</div><div style="font-size:11px;color:#94a3b8;">Trúng tuyển</div></div>
      <div><div style="font-size:20px;font-weight:600;color:#d85a30;">${rate.toFixed(1)}%</div><div style="font-size:11px;color:#94a3b8;">Tỷ lệ đậu</div></div>
    </div>
    ${topPos.length?`<div style="font-size:11px;color:#64748b;margin-bottom:6px;">Pipeline theo vị trí</div>`+topPos.map(([n,v])=>`<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:6px;"><span style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${n}</span><div style="flex:1;height:8px;background:#eeedfe;border-radius:20px;"><div style="width:${Math.round(v/maxCV*100)}%;height:8px;background:#534ab7;border-radius:20px;"></div></div><span style="width:28px;text-align:right;">${v}</span></div>`).join(''):`<div style="color:#94a3b8;font-size:12px;">Đang tải dữ liệu tuyển dụng...</div>`}
  </div>`;

  const taskCard=`<div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
    <div style="display:flex;align-items:center;margin-bottom:12px;"><span style="font-size:14px;font-weight:500;color:#1e293b;">Công việc cần chú ý</span><span onclick="nav('cong-viec')" style="margin-left:auto;font-size:12px;color:#5b21b6;cursor:pointer;">Tất cả <i class="ti ti-arrow-right"></i></span></div>
    ${attention.length?attention.map(t=>`<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;margin-bottom:10px;">${priBadge(t['Ưu tiên'])}<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t['Nội dung chi tiết']||''}</span><span style="color:#94a3b8;white-space:nowrap;">${fmtDl(t.Deadline)}</span></div>`).join(''):`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:96px;color:#94a3b8;font-size:12.5px;"><i class="ti ti-checks" style="font-size:26px;color:#e2e8f0;"></i>Không có công việc tồn đọng</div>`}
  </div>`;

  C.innerHTML=`
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px;">
    ${kpi('Tổng nhân sự',TQ_NV_TOTAL,'ti-users','#eeedfe','#534ab7','#3c3489','#26215c')}
    ${kpi('Vị trí đang tuyển',rawData?open:'—','ti-briefcase','#e6f1fb','#185fa5','#0c447c','#042c53')}
    ${kpi('CV tháng này',rawData?cvThisMonth:'—','ti-file-cv','#e1f5ee','#0f6e56','#085041','#04342c')}
    ${kpi('Task đang chạy',taskDataLoaded?runCount:'—','ti-checklist','#faeeda','#854f0b','#633806','#412402')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-bottom:16px;">
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><i class="ti ti-cake" style="color:#d4537e;font-size:18px;"></i><span style="font-size:14px;font-weight:500;color:#1e293b;">Sinh nhật sắp tới</span></div>${tqBirthdays()}</div>
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><i class="ti ti-file-alert" style="color:#d85a30;font-size:18px;"></i><span style="font-size:14px;font-weight:500;color:#1e293b;">Sắp hết hạn hợp đồng</span></div>${tqContracts()}</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-bottom:16px;">
    ${recruitCard}
    ${taskCard}
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-bottom:16px;">
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><i class="ti ti-building" style="color:#1d9e75;font-size:18px;"></i><span style="font-size:14px;font-weight:500;color:#1e293b;">Nhân sự theo phòng ban</span></div>${tqDept()}</div>
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><i class="ti ti-crown" style="color:#5b21b6;font-size:18px;"></i><span style="font-size:14px;font-weight:500;color:#1e293b;">Ban giám đốc</span></div>${tqBoard()}</div>
  </div>
  <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
    <div style="font-size:14px;font-weight:500;color:#1e293b;margin-bottom:12px;">Truy cập nhanh</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;">
      ${quick('Quy định','ti-book','quy-dinh')}
      ${quick('Quy trình','ti-arrow-guide','quy-trinh')}
      ${quick('Tuyển dụng','ti-file-description','tuyen-dung')}
      ${quick('Công việc','ti-checklist','cong-viec')}
      ${quick('Calendar','ti-calendar','calendar')}
    </div>
  </div>`;
}

/* ══════════════════════════════════════════
   HỒ SƠ NHÂN SỰ — Directory + Analytics
   (DỮ LIỆU MẪU — thay bằng data thật / nối Sheet sau)
══════════════════════════════════════════ */
let hsView='list', hsSel=null, hsSearch='', hsDept='all', hsStatus='all';
/* Data thật: tab "Hồ sơ" (bộ phận + phân loại→tt/loaiHD + vao) ghép tab "Data nhân viên"
   (ns/sdt/cccd/ngayCap/tamTru/hocVan/vt). TODO: giới tính (gt), ảnh (anh), link HĐ. */

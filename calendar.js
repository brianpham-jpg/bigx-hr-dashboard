const CAL_CLIENT_ID='188787944192-9iq8f8gsrc1gctpcf34qbp0sc2itkngf.apps.googleusercontent.com';
const CAL_ID='brian.pham@bigx.vn';
const CAL_SCOPE='https://www.googleapis.com/auth/calendar.readonly';
const CAL_DOW=['Th 2','Th 3','Th 4','Th 5','Th 6','Th 7','CN'];
let calToken=null, calTokenClient=null, calEvents=[], calLoading=false, calErr=null, calRef=new Date();
const CAL_TK_KEY='bigx_cal_tk';
function calSaveTok(r){ try{ localStorage.setItem(CAL_TK_KEY, JSON.stringify({t:r.access_token, exp:Date.now()+((+r.expires_in||3600)*1000)})); }catch(_){} }
function calCachedTok(){ try{ const c=JSON.parse(localStorage.getItem(CAL_TK_KEY)||'null'); if(c&&c.t&&c.exp>Date.now()+60000) return c.t; }catch(_){} return null; }
function calAuto(){ if(calToken){ calFetch(); return; } const t=calCachedTok(); if(t){ calToken=t; calFetch(); return; } renderCalendar(); if(calInit()){ try{ calTokenClient.requestAccessToken({prompt:''}); }catch(_){} } }

function calInit(){
  if(calTokenClient) return true;
  if(!(window.google&&google.accounts&&google.accounts.oauth2)) return false;
  calTokenClient=google.accounts.oauth2.initTokenClient({
    client_id:CAL_CLIENT_ID, scope:CAL_SCOPE,
    callback:(r)=>{ if(r&&r.access_token){ calToken=r.access_token; calSaveTok(r); calFetch(); } else { renderCalendar(); } }
  });
  return true;
}
function calSignIn(){
  if(!calInit()){ calErr='Google Sign-In chưa tải xong, thử lại sau vài giây.'; renderCalendar(); return; }
  calErr=null; calTokenClient.requestAccessToken();
}
async function calFetch(){
  if(!calToken) return;
  calLoading=true; calErr=null; renderCalendar();
  const tMin=new Date(calRef.getFullYear(),calRef.getMonth()-1,1).toISOString();
  const tMax=new Date(calRef.getFullYear(),calRef.getMonth()+2,0,23,59,59).toISOString();
  const url='https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(CAL_ID)
    +'/events?singleEvents=true&orderBy=startTime&maxResults=250'
    +'&timeMin='+encodeURIComponent(tMin)+'&timeMax='+encodeURIComponent(tMax);
  try{
    const res=await fetch(url,{headers:{Authorization:'Bearer '+calToken}});
    if(res.status===401||res.status===403){ calToken=null; try{localStorage.removeItem(CAL_TK_KEY);}catch(_){} if(calInit()){try{calTokenClient.requestAccessToken({prompt:''});}catch(_){}} throw new Error('Đang làm mới đăng nhập...'); }
    if(!res.ok) throw new Error('Lỗi API '+res.status);
    const d=await res.json();
    calEvents=(d.items||[]).map(e=>({
      title:e.summary||'(không tiêu đề)',
      raw:(e.start&&(e.start.dateTime||e.start.date))||null,
      allDay:!!(e.start&&e.start.date&&!e.start.dateTime)
    })).filter(e=>e.raw);
  }catch(err){ calErr=err.message; }
  calLoading=false; renderCalendar();
}
function calDate(ev){
  if(!ev.raw) return null;
  if(ev.allDay){ const p=ev.raw.split('-'); return new Date(+p[0],+p[1]-1,+p[2]); }
  const d=new Date(ev.raw); return isNaN(d)?null:d;
}
function calTime(ev){
  if(ev.allDay) return 'Cả ngày';
  const d=calDate(ev); if(!d) return '';
  return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
function calCat(t){
  const s=(t||'').toLowerCase();
  if(/train|đào tạo|workshop/.test(s)) return 'cev-b';
  if(/tuyển|phỏng vấn|\bhr\b|onboard|\bcv\b/.test(s)) return 'cev-g';
  if(/thông báo|nghỉ|lương|thanh toán|nhắc/.test(s)) return 'cev-o';
  return 'cev-p';
}
function calChange(delta){ calRef=new Date(calRef.getFullYear(),calRef.getMonth()+delta,1); if(calToken) calFetch(); else renderCalendar(); }
function calSameDay(a,b){ return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function calEsc(s){ return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

function renderCalendar(){
  const c=document.getElementById('content');
  if(!calToken && !calLoading){
    c.innerHTML=`<div class="cal-signin">
      <i class="ti ti-calendar-event"></i>
      <div style="font-size:13px">Kết nối Google Calendar (bigx.vn) để xem lịch trên dashboard</div>
      ${calErr?`<div style="font-size:11px;color:#ef4444">${calEsc(calErr)}</div>`:''}
      <button class="cal-btn" onclick="calSignIn()"><i class="ti ti-brand-google"></i>Đăng nhập Google</button>
    </div>`;
    return;
  }
  const today=new Date();
  const first=new Date(calRef.getFullYear(),calRef.getMonth(),1);
  const off=(first.getDay()||7)-1;
  const gridStart=new Date(first); gridStart.setDate(1-off);
  const byDay={};
  calEvents.forEach(ev=>{ const d=calDate(ev); if(!d) return; const k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(); (byDay[k]=byDay[k]||[]).push(ev); });
  let cells='';
  for(let i=0;i<42;i++){
    const d=new Date(gridStart); d.setDate(gridStart.getDate()+i);
    const out=d.getMonth()!==calRef.getMonth();
    const k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
    const evs=(byDay[k]||[]).sort((a,b)=>calDate(a)-calDate(b));
    let chips='';
    evs.slice(0,2).forEach(ev=>{ const tm=calTime(ev); chips+=`<div class="cal-ev ${calCat(ev.title)}">${tm!=='Cả ngày'?tm+' ':''}${calEsc(ev.title)}</div>`; });
    if(evs.length>2) chips+=`<div class="cal-more">+${evs.length-2} nữa</div>`;
    const dn=calSameDay(d,today)?`<span class="cal-tdy">${d.getDate()}</span>`:d.getDate();
    cells+=`<div class="cal-cell ${out?'out':''}"><div class="cal-dn">${dn}</div>${chips}</div>`;
  }
  const todayMid=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const up=calEvents.map(ev=>({ev,d:calDate(ev)})).filter(x=>x.d&&x.d>=todayMid).sort((a,b)=>a.d-b.d).slice(0,3);
  let ups='';
  up.forEach(x=>{ const d=x.d; const lbl=calSameDay(d,today)?'Hôm nay':String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');
    ups+=`<div class="cal-uc"><span class="cal-ub">${lbl} · ${calTime(x.ev)}</span><div class="cal-un">${calEsc(x.ev.title)}</div></div>`; });
  if(!ups) ups=`<div class="cal-uc" style="grid-column:1/-1;color:#94a3b8;font-size:11px">Không có sự kiện sắp tới</div>`;
  const status=calLoading?'Đang tải lịch…':(calErr||'Đã kết nối Google Calendar');
  c.innerHTML=`
  <div class="cal-wrap">
    <div class="cal-toolbar">
      <div style="font-size:11px;color:${calErr?'#ef4444':'#94a3b8'}">${calEsc(status)}</div>
      <div style="display:flex;gap:6px">
        <button class="cal-vb" onclick="calFetch()"><i class="ti ti-refresh"></i>Làm mới</button>
        <a class="cal-open" href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noopener"><i class="ti ti-external-link"></i>Mở Google Calendar</a>
      </div>
    </div>
    <div class="cal-card">
      <div class="cal-head">
        <span class="cal-nav" onclick="calChange(-1)"><i class="ti ti-chevron-left"></i></span>
        <span class="cal-nav" onclick="calChange(1)"><i class="ti ti-chevron-right"></i></span>
        <span class="cal-mtitle">Tháng ${calRef.getMonth()+1}, ${calRef.getFullYear()}</span>
      </div>
      <div class="cal-dow">${CAL_DOW.map(x=>`<span>${x}</span>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
      <div class="cal-lg">
        <span class="cal-l"><span class="cal-d" style="background:#5b21b6"></span>Họp / Nội bộ</span>
        <span class="cal-l"><span class="cal-d" style="background:#1d4ed8"></span>Đào tạo</span>
        <span class="cal-l"><span class="cal-d" style="background:#15803d"></span>HR / Tuyển dụng</span>
        <span class="cal-l"><span class="cal-d" style="background:#c2410c"></span>Thông báo</span>
      </div>
    </div>
    <div class="cal-up">${ups}</div>
  </div>`;
}

/* ==========================================================
   KHO CV — tab con cua Tuyen dung (chi doc, doc rawData.cvs)
========================================================== */

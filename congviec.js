const SHEET_ID = '1ahePajJUtjB6LqIfBByEwwyvGlMXtJz0ymardz8ygCY';
let rawTaskLH = [], rawTaskCD = [], taskDataLoaded = false;
let cvYear = new Date().getFullYear(), cvMonth = new Date().getMonth();
let cvFilterMang = 'all', cvFilterUu = 'all';
let cvChartYear = null;
let cvRangeStart = null, cvRangeEnd = null;

function cvDayClick(y,m,d){
  const clicked=new Date(y,m,d);
  if(!cvRangeStart||cvRangeEnd){
    cvRangeStart=clicked; cvRangeEnd=null;
  } else {
    if(clicked<cvRangeStart){ cvRangeEnd=cvRangeStart; cvRangeStart=clicked; }
    else { cvRangeEnd=clicked; }
  }
  renderCongViec();
}
function cvClearRange(){ cvRangeStart=null; cvRangeEnd=null; renderCongViec(); }

function parseGViz(text){
  try{
    const json = text.replace(/^[^(]*\(/, '').replace(/\);\s*$/, '');
    return JSON.parse(json);
  }catch(e){ return null; }
}
function gvizRows(data){
  if(!data||!data.table) return [];
  const cols = data.table.cols.map(c=>c.label||'');
  return (data.table.rows||[]).map(r=>{
    const obj={};
    (r.c||[]).forEach((cell,i)=>{ obj[cols[i]] = cell&&cell.v!==null&&cell.v!==undefined ? String(cell.v).trim() : ''; });
    return obj;
  });
}
function parseTaskDate(s){
  if(!s) return null;
  const p=String(s).trim().split('/');
  if(p.length!==3) return null;
  const d=new Date(+p[2],+p[1]-1,+p[0]);
  return isNaN(d)?null:d;
}
function fmtTaskDate(s){
  const d=parseTaskDate(s); if(!d) return s||'—';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}
function dlClass(s){
  const d=parseTaskDate(s); if(!d) return 'cv-dl-norm';
  const now=new Date(); now.setHours(0,0,0,0);
  const pct=parseInt(s&&s.replace('%',''))||0;
  if(pct===100) return 'cv-dl-done';
  if(d<now) return 'cv-dl-over';
  return 'cv-dl-norm';
}
function mangBadge(m){
  if(!m) return '';
  m=m.trim();
  if(m==='Tuyển dụng') return `<span class="cv-badge cv-b-tuyen">Tuyển dụng</span>`;
  if(m==='C&B') return `<span class="cv-badge cv-b-cb">C&amp;B</span>`;
  if(m==='Văn hóa nội bộ') return `<span class="cv-badge cv-b-vh">Văn hóa</span>`;
  if(m==='Đào tạo') return `<span class="cv-badge cv-b-dt">Đào tạo</span>`;
  return `<span class="cv-badge cv-b-thap">${m}</span>`;
}
function uuBadge(u){
  if(!u) return '';
  if(u==='Cao') return `<span class="cv-badge cv-b-cao">Cao</span>`;
  if(u==='Trung bình') return `<span class="cv-badge cv-b-tb">Trung bình</span>`;
  return `<span class="cv-badge cv-b-thap">Thấp</span>`;
}
function progColor(p){
  const n=parseInt(p)||0;
  if(n===100) return '#22c55e';
  if(n>=50) return '#f97316';
  return '#e2e8f0';
}

/* Dữ liệu mặc định — tự động cập nhật bởi Claude theo lịch */
const DEFAULT_LH=[
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Đăng tuyển dụng vị trí Kế toán Thuế','Ưu tiên':'Cao',Deadline:'25/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Thiết kế poster pass probation cho nhân sự Hương, Đào.','Ưu tiên':'Trung bình',Deadline:'08/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Design poster chúc mừng nhân sự được level up (Kim Dung)','Ưu tiên':'Trung bình',Deadline:'08/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Soạn HĐTV cho nhân sự Minh Thiện & Phụng','Ưu tiên':'Cao',Deadline:'12/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Đăng tuyển dụng vị trí Booking KOC','Ưu tiên':'Trung bình',Deadline:'20/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Soạn HĐLĐ cho nhân sự Hương & Đào','Ưu tiên':'Trung bình',Deadline:'11/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Báo giảm BH của nhân sự Sale Hưng','Ưu tiên':'Cao',Deadline:'11/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Chuẩn bị poster pass probation của Nghĩa','Ưu tiên':'Trung bình',Deadline:'20/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Set lịch meeting review cho nhân sự Nghĩa','Ưu tiên':'Cao',Deadline:'25/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Thiết kế poster pass probation cho nhân sự Nghĩa.','Ưu tiên':'Trung bình',Deadline:'20/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Set lịch review cho nhân sự Nghĩa.','Ưu tiên':'Trung bình',Deadline:'22/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Kiểm tra lại toàn bộ hồ sơ của nhân sự, thông báo bổ sung nếu cần.','Ưu tiên':'Trung bình',Deadline:'31/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Sắp xếp meeting để trao đổi về JD Kế toán Thuế.','Ưu tiên':'Cao',Deadline:'16/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Thông báo sinh nhật của nhân sự tháng 5 đến team Kế toán.','Ưu tiên':'Thấp',Deadline:'21/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Sắp xếp tuyển dụng Mar Event.','Ưu tiên':'Cao',Deadline:'23/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Sắp xếp phỏng vấn round 2 Booking.','Ưu tiên':'Thấp',Deadline:'18/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Xây dựng kế hoạch Company trip 2026.','Ưu tiên':'Cao',Deadline:'25/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Đào tạo','Nội dung chi tiết':'Chia sẻ văn hóa, quy định, nội bộ cho nhân sự mới','Ưu tiên':'Thấp',Deadline:'25/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Chuẩn bị HĐTV cho nhân sự Bé và Thủy','Ưu tiên':'Thấp',Deadline:'30/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Báo cáo tình hình tuyển dụng hằng tuần','Ưu tiên':'Trung bình',Deadline:'31/12/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Sắp xếp meeting review sau thử việc cho nhân sự Chi','Ưu tiên':'Trung bình',Deadline:'31/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Thiết kế poster pass thử việc cho Chi','Ưu tiên':'Thấp',Deadline:'31/05/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Chia sẻ văn hóa, quy định, nội bộ cho nhân sự mới','Ưu tiên':'Trung bình',Deadline:'01/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Post chúc mừng nhân sự Chi passed','Ưu tiên':'Thấp',Deadline:'03/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Hoàn thành hồ sơ nghỉ việc của nhân sự Sales Vi','Ưu tiên':'Trung bình',Deadline:'03/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Báo giảm BH của nhân sự Sale Vi ở gr Nhân sự','Ưu tiên':'Trung bình',Deadline:'03/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Báo tăng BH cho nhân sự Chi','Ưu tiên':'Trung bình',Deadline:'03/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Hoàn thành file check công việc của HR phối hợp với các bộ phận','Ưu tiên':'Trung bình',Deadline:'10/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Nhận thông tin tuyển dụng Booking mới từ giữa tháng 6.','Ưu tiên':'Trung bình',Deadline:'20/07/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Thiết kế poster pass thử việc cho Vy và Thiện','Ưu tiên':'Trung bình',Deadline:'10/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Báo tăng BH cho nhân sự Vy và Thiên','Ưu tiên':'Thấp',Deadline:'30/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Hoàn thành file report phối hợp làm việc giữa HR và các team','Ưu tiên':'Cao',Deadline:'08/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Cho các nhân sự kí HĐTV/HĐLĐ: Thủy, Vy, Quang, Bé, Chi.','Ưu tiên':'Trung bình',Deadline:'05/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Hoàn thành JD Booking mới, rà soát thị trường.','Ưu tiên':'Cao',Deadline:'25/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Tìm hiểu "Công đoàn"','Ưu tiên':'Trung bình',Deadline:'15/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Xây dựng JD tuyển dụng mới cho vị trí Booking','Ưu tiên':'Cao',Deadline:'20/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Tiến hành bầu ban chấp hành công đoàn','Ưu tiên':'Cao',Deadline:'15/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Set lịch họp bàn giao của KT và BCH công đoàn','Ưu tiên':'Cao',Deadline:'16/06/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Chuẩn bị thông báo sinh nhật tháng 6','Ưu tiên':'Cao',Deadline:'19/6/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Hoàn thành web dashboard tổng hợp','Ưu tiên':'Cao',Deadline:'19/6/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Tuyển dụng final 1 Booking KOC, OBD tuần sau','Ưu tiên':'Cao',Deadline:'19/6/2026','Tiến độ (%)':'100%'},
  {Mảng:'C&B','Nội dung chi tiết':'Tạo web chấm công onl, tối ưu thủ công','Ưu tiên':'Cao',Deadline:'25/6/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Tuyển 1 EDIT, OBD tuần sau.','Ưu tiên':'Cao',Deadline:'25/6/2026','Tiến độ (%)':'100%'},
  {Mảng:'Văn hóa nội bộ','Nội dung chi tiết':'Meeting thống nhất plan team building','Ưu tiên':'Cao',Deadline:'24/6/2026','Tiến độ (%)':'100%'},
  {Mảng:'Tuyển dụng','Nội dung chi tiết':'Phỏng vấn round 1/2: SM,S,B,E','Ưu tiên':'Cao',Deadline:'25/6/2026','Tiến độ (%)':'100%'},
];
const DEFAULT_CD=[
  {'Nội dung chi tiết':'Công đoàn',Loại:'Cố định'},
  {'Nội dung chi tiết':'Hỗ trợ OBD (Onboarding)',Loại:'Cố định'},
  {'Nội dung chi tiết':'Lên theo dõi hợp đồng lao động (điền thông tin nhân sự, chữ ký)',Loại:'Cố định'},
  {'Nội dung chi tiết':'Lên hợp đồng công tác viên (điền thông tin nhân sự)',Loại:'Cố định'},
  {'Nội dung chi tiết':'Quản lý file theo dõi nhân sự',Loại:'Cố định'},
  {'Nội dung chi tiết':'Chấm công',Loại:'Cố định'},
  {'Nội dung chi tiết':'Theo dõi báo tăng giảm nhân sự tòa nhà + check chi tiết lên VP với tòa nhà',Loại:'Cố định'},
  {'Nội dung chi tiết':'Teambuilding, YEP, sinh nhật,...',Loại:'Cố định'},
];

const TASK_API='https://script.google.com/macros/s/AKfycbxp_DCrToKsLfUa3rWMJhXi1-zjbSXs5hWRa0hSfy3OW90Vyb6UvuSv5ROKFPSPX9pR2Q/exec';
const TASK_CACHE_KEY='bigx_task_v1';
function cvIsActive(){ return document.getElementById('nav-cv').classList.contains('active'); }
function applyTaskData(d){
  rawTaskLH=(d&&d.taskLH&&d.taskLH.length>0)?d.taskLH:DEFAULT_LH;
  rawTaskCD=(d&&d.taskCD&&d.taskCD.length>0)?d.taskCD:DEFAULT_CD;
}
async function loadTaskData(force){
  /* 1) Hiện ngay dữ liệu có sẵn — không chờ mạng */
  if(taskDataLoaded && !force){
    renderCongViec();                       // đã có trong bộ nhớ → render tức thì
  } else {
    const cached=localStorage.getItem(TASK_CACHE_KEY);
    if(cached){
      try{ applyTaskData(JSON.parse(cached)); }catch(_){ applyTaskData(null); }
    } else {
      applyTaskData(null);                  // dùng DEFAULT để màn hình không trống
    }
    taskDataLoaded=true;
    renderCongViec();
  }
  /* 2) Fetch mới ngầm rồi cập nhật lại (chỉ render nếu vẫn đang ở tab) */
  try{
    const r=await fetch(TASK_API);
    const d=await r.json();
    applyTaskData(d);
    localStorage.setItem(TASK_CACHE_KEY,JSON.stringify({taskLH:rawTaskLH,taskCD:rawTaskCD}));
    taskDataLoaded=true;
    if(cvIsActive()) renderCongViec();
  }catch(e){
    /* giữ nguyên dữ liệu đang hiển thị nếu fetch lỗi */
  }
}
// tự cập nhật ngầm mỗi 5 phút, chỉ khi đang xem tab Công việc
setInterval(()=>{ if(cvIsActive()) loadTaskData(true); }, 5*60*1000);

function cvSetMonth(y,m){
  cvYear=y; cvMonth=m; cvRangeStart=null; cvRangeEnd=null;
  renderCongViec();
}

function renderCongViec(){
  const today=new Date();
  const curY=new Date().getFullYear();

  /* ── Tasks in selected month ── */
  const monthTasks=rawTaskLH.filter(t=>{
    const d=parseTaskDate(t['Deadline']||t['deadline']||t['DEADLINE']);
    return d&&d.getFullYear()===cvYear&&d.getMonth()===cvMonth;
  });
  const totalCD=rawTaskCD.filter(t=>t['Nội dung chi tiết']).length;
  const totalM=monthTasks.length+totalCD;
  const doneM=monthTasks.filter(t=>(parseInt(t['Tiến độ (%)'||t['Tiến độ']||t['TIEN DO']])||0)===100||(t['Tiến độ (%)'||'']||'').trim()==='100%').length;

  /* better pct parse */
  function getPct(t){
    const raw=t['Tiến độ (%)']; if(raw===undefined||raw===null||raw==='') return 0;
    const n=parseFloat(String(raw).replace('%',''));
    if(isNaN(n)) return 0;
    /* Google Sheets % format lưu dạng decimal: 100% → 1, 50% → 0.5 */
    if(n>=0 && n<=1) return Math.round(n*100);
    return Math.round(n);
  }
  const doneM2=monthTasks.filter(t=>getPct(t)===100).length;
  const overdueM=monthTasks.filter(t=>{
    const d=parseTaskDate(t['Deadline']); if(!d) return false;
    const n=new Date(); n.setHours(0,0,0,0);
    return d<n && getPct(t)<100;
  }).length;

  /* ── Calendar task dates ── */
  const taskDates=new Set();
  rawTaskLH.forEach(t=>{
    const d=parseTaskDate(t['Deadline']);
    if(d&&d.getFullYear()===cvYear&&d.getMonth()===cvMonth) taskDates.add(d.getDate());
  });

  /* ── Year chart data ── */
  const yearCounts=Array(12).fill(0);
  rawTaskLH.forEach(t=>{
    const d=parseTaskDate(t['Deadline']);
    if(d&&d.getFullYear()===cvYear) yearCounts[d.getMonth()]++;
  });

  /* ── Filtered table rows ── */
  const basePool=cvRangeStart&&cvRangeEnd?rawTaskLH.filter(t=>{
    const d=parseTaskDate(t['Deadline']); if(!d) return false;
    const dn=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    const rs=new Date(cvRangeStart.getFullYear(),cvRangeStart.getMonth(),cvRangeStart.getDate());
    const re=new Date(cvRangeEnd.getFullYear(),cvRangeEnd.getMonth(),cvRangeEnd.getDate());
    return dn>=rs&&dn<=re;
  }):monthTasks;
  let filtered=basePool.filter(t=>{
    if(cvFilterMang!=='all'&&t['Mảng']!==cvFilterMang) return false;
    if(cvFilterUu!=='all'&&t['Ưu tiên']!==cvFilterUu) return false;
    return true;
  });

  /* ── Calendar HTML ── */
  const firstDay=new Date(cvYear,cvMonth,1).getDay();
  const daysInMonth=new Date(cvYear,cvMonth+1,0).getDate();
  const prevDays=new Date(cvYear,cvMonth,0).getDate();
  const monthNames=['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  const prevM=cvMonth===0?11:cvMonth-1;
  const prevY=cvMonth===0?cvYear-1:cvYear;
  const nextM=cvMonth===11?0:cvMonth+1;
  const nextY=cvMonth===11?cvYear+1:cvYear;

  /* range helpers */
  function dayTs(y,m,d){ return new Date(y,m,d).getTime(); }
  const rsTs=cvRangeStart?dayTs(cvRangeStart.getFullYear(),cvRangeStart.getMonth(),cvRangeStart.getDate()):null;
  const reTs=cvRangeEnd?dayTs(cvRangeEnd.getFullYear(),cvRangeEnd.getMonth(),cvRangeEnd.getDate()):null;

  let daysCells='';
  for(let i=0;i<firstDay;i++){
    daysCells+=`<span class="cv-day other">${prevDays-firstDay+1+i}</span>`;
  }
  for(let d=1;d<=daysInMonth;d++){
    const isToday=d===today.getDate()&&cvMonth===today.getMonth()&&cvYear===today.getFullYear();
    const hasTsk=taskDates.has(d);
    const dTs=dayTs(cvYear,cvMonth,d);
    const isRS=rsTs&&dTs===rsTs;
    const isRE=reTs&&dTs===reTs;
    const inRange=rsTs&&reTs&&dTs>rsTs&&dTs<reTs;
    const cls=['cv-day',isToday?'today':'',hasTsk?'has-task':'',isRS?'range-s':'',isRE?'range-e':'',inRange?'in-range':''].filter(Boolean).join(' ');
    daysCells+=`<span class="${cls}" onclick="cvDayClick(${cvYear},${cvMonth},${d})">${d}</span>`;
  }
  const remain=42-firstDay-daysInMonth;
  for(let d=1;d<=remain;d++) daysCells+=`<span class="cv-day other">${d}</span>`;

  /* ── Table rows HTML ── */
  const taskRows=filtered.length===0
    ? `<tr><td colspan="5" style="text-align:center;padding:16px;color:#94a3b8;font-size:12px;">Không có task trong tháng này</td></tr>`
    : filtered.map(t=>{
        const pct=getPct(t);
        const dl=t['Deadline']||'';
        const d=parseTaskDate(dl);
        const now2=new Date(); now2.setHours(0,0,0,0);
        const isOver=d&&d<now2&&pct<100;
        const dlHtml=pct===100
          ? `<span class="cv-dl-done">✓ ${fmtTaskDate(dl)}</span>`
          : isOver
            ? `<span class="cv-dl-over">! ${fmtTaskDate(dl)}</span>`
            : `<span class="cv-dl-norm">${fmtTaskDate(dl)}</span>`;
        return `<tr>
          <td><div style="display:flex;align-items:center;gap:7px;">
            ${pct===100?'<div class="cv-check"><i class="ti ti-check"></i></div>':'<div class="cv-check" style="border-color:#e2e8f0;background:none;"></div>'}
            <span style="font-size:12px;">${t['Nội dung chi tiết']||'—'}</span>
          </div></td>
          <td>${mangBadge(t['Mảng'])}</td>
          <td>${uuBadge(t['Ưu tiên'])}</td>
          <td>${dlHtml}</td>
          <td><div class="cv-prog-wrap">
            <div class="cv-prog-bar"><div class="cv-prog-fill" style="width:${pct}%;background:${progColor(pct)};"></div></div>
            <span class="cv-prog-pct">${pct}%</span>
          </div></td>
        </tr>`;
      }).join('');

  /* ── Fixed rows ── */
  const fixedIcons={'Công đoàn':'ti-flag','Hỗ trợ OBD (Onboarding)':'ti-user-plus','Chấm công':'ti-clock','Quản lý file theo dõi nhân sự':'ti-folder','Theo dõi báo tăng giảm nhân sự tòa nhà + check chi tiết lên VP với tòa nhà':'ti-building','Teambuilding, YEP, sinh nhật,...':'ti-confetti'};
  const fixedRows=rawTaskCD.length===0
    ? `<div class="cv-fixed-row"><span style="color:#94a3b8;font-size:12px;padding:4px 0;">Không có dữ liệu</span></div>`
    : rawTaskCD.map(t=>{
        const name=t['Nội dung chi tiết']||'';
        if(!name) return '';
        const icon=Object.entries(fixedIcons).find(([k])=>name.includes(k.split(' ')[0]))?.[1]||'ti-repeat';
        return `<div class="cv-fixed-row"><i class="ti ${icon} fi"></i><span>${name}</span><span class="cv-always">Hằng tháng</span></div>`;
      }).join('');

  /* ── KPI tags ── */
  const doneTag=doneM2===totalM&&totalM>0?'cv-tag-g':doneM2>0?'cv-tag-a':'cv-tag-n';
  const overTag=overdueM>0?'cv-tag-r':'cv-tag-g';

  /* ── RENDER ── */
  document.getElementById('content').innerHTML=`
  <div class="cv-layout">
    <div class="cv-left">
      <!-- Calendar -->
      <div class="cv-cal">
        <div class="cv-cal-hdr">
          <span class="cv-cal-title">${monthNames[cvMonth]}, ${cvYear}</span>
          <div class="cv-cal-nav">
            <button onclick="cvSetMonth(${prevM===11?prevY:cvYear},${prevM})" title="Tháng trước">▲</button>
            <button onclick="cvSetMonth(${nextM===0?nextY:cvYear},${nextM})" title="Tháng sau">▼</button>
          </div>
        </div>
        <div class="cv-cal-grid">
          <div class="cv-cal-dow"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
          <div class="cv-cal-days">${daysCells}</div>
        </div>
        <div class="cv-cal-leg">
          <div class="cv-cal-leg-row"><span class="cv-ldot" style="background:#5b21b6;"></span>Có deadline task</div>
          <div class="cv-cal-leg-row"><span class="cv-ldot" style="background:#5b21b6;opacity:.4;"></span>Click chọn khoảng thời gian</div>
        </div>
        <div class="cv-range-bar">
          ${cvRangeStart&&cvRangeEnd
            ? `<span class="cv-range-txt"><i class="ti ti-calendar-event"></i>${cvRangeStart.getDate()}/${cvRangeStart.getMonth()+1} → ${cvRangeEnd.getDate()}/${cvRangeEnd.getMonth()+1}</span>
               <span class="cv-range-clear" onclick="cvClearRange()">Xoá</span>`
            : cvRangeStart
              ? `<span class="cv-range-hint">Chọn ngày kết thúc...</span>`
              : `<span class="cv-range-hint">Click ngày để chọn khoảng</span>`
          }
        </div>
      </div>
      <!-- Year chart mini -->
      <div class="cv-chart-card">
        <div class="cv-chart-title"><i class="ti ti-chart-bar-popular"></i>Khối lượng năm ${cvYear}</div>
        <div class="cv-mini-chart">
          ${(()=>{
            const maxC=Math.max(...yearCounts,1);
            return yearCounts.map((c,i)=>{
              if(c===0) return `<div class="cv-mc-row"><span class="cv-mc-label">T${i+1}</span><div class="cv-mc-track"><div class="cv-mc-fill" style="width:2%"></div></div><span class="cv-mc-count" style="color:#e2e8f0">0</span></div>`;
              const isCur=i===cvMonth;
              return `<div class="cv-mc-row">
                <span class="cv-mc-label" style="${isCur?'color:#5b21b6;font-weight:600;':''}"">T${i+1}</span>
                <div class="cv-mc-track"><div class="cv-mc-fill${isCur?' cur':''}" style="width:${Math.round(c/maxC*100)}%"></div></div>
                <span class="cv-mc-count${isCur?' cur':''}">${c}</span>
              </div>`;
            }).join('');
          })()}
        </div>
      </div>
    </div>

    <div class="cv-right">
      <!-- KPIs -->
      <div class="cv-kpi-row">
        <div class="cv-kpi"><div class="cv-kpi-accent" style="background:#5b21b6;"></div>
          <div class="cv-kpi-lbl">Task ${monthNames[cvMonth]}</div>
          <div class="cv-kpi-val">${totalM}</div>
          <span class="cv-kpi-tag cv-tag-n">Linh hoạt + Cố định</span>
        </div>
        <div class="cv-kpi"><div class="cv-kpi-accent" style="background:#22c55e;"></div>
          <div class="cv-kpi-lbl">Hoàn thành</div>
          <div class="cv-kpi-val">${doneM2}</div>
          <span class="cv-kpi-tag ${doneTag}">${totalM>0?Math.round(doneM2/totalM*100):0}%</span>
        </div>
        <div class="cv-kpi"><div class="cv-kpi-accent" style="background:#ef4444;"></div>
          <div class="cv-kpi-lbl">Quá deadline</div>
          <div class="cv-kpi-val">${overdueM}</div>
          <span class="cv-kpi-tag ${overTag}">${overdueM===0?'On track':'Cần xử lý'}</span>
        </div>
      </div>

      <!-- Bảng LINH HOẠT -->
      <div class="cv-tbl-card">
        <div class="cv-tbl-hdr">
          <div class="cv-tbl-hdr-left"><i class="ti ti-adjustments-horizontal"></i>Task linh hoạt <span class="cv-count">${filtered.length} task${cvRangeStart&&cvRangeEnd?' (theo khoảng)':''}</span></div>
        </div>
        <div class="cv-filter-row">
          <select onchange="cvFilterMang=this.value;renderCongViec()">
            <option value="all">Tất cả mảng</option>
            <option value="Tuyển dụng" ${cvFilterMang==='Tuyển dụng'?'selected':''}>Tuyển dụng</option>
            <option value="C&B" ${cvFilterMang==='C&B'?'selected':''}>C&B</option>
            <option value="Văn hóa nội bộ" ${cvFilterMang==='Văn hóa nội bộ'?'selected':''}>Văn hóa nội bộ</option>
            <option value="Đào tạo" ${cvFilterMang==='Đào tạo'?'selected':''}>Đào tạo</option>
          </select>
          <select onchange="cvFilterUu=this.value;renderCongViec()">
            <option value="all">Tất cả ưu tiên</option>
            <option value="Cao" ${cvFilterUu==='Cao'?'selected':''}>Cao</option>
            <option value="Trung bình" ${cvFilterUu==='Trung bình'?'selected':''}>Trung bình</option>
            <option value="Thấp" ${cvFilterUu==='Thấp'?'selected':''}>Thấp</option>
          </select>
        </div>
        <table class="cv-table">
          <thead><tr>
            <th style="width:42%;">Nội dung</th>
            <th style="width:14%;">Mảng</th>
            <th style="width:13%;">Ưu tiên</th>
            <th style="width:12%;">Deadline</th>
            <th style="width:19%;">Tiến độ</th>
          </tr></thead>
          <tbody>${taskRows}</tbody>
        </table>
      </div>

      <!-- Bảng CỐ ĐỊNH -->
      <div class="cv-tbl-card">
        <div class="cv-tbl-hdr">
          <div class="cv-tbl-hdr-left"><i class="ti ti-pin"></i>Task cố định <span class="cv-count">${rawTaskCD.filter(t=>t['Nội dung chi tiết']).length} task</span></div>
          <span class="cv-tbl-hdr-right">Thực hiện mỗi tháng</span>
        </div>
        ${fixedRows}
      </div>
    </div>
  </div>`;

}

/* ══════════════════════════════════════════
   SƠ ĐỒ TỔ CHỨC
══════════════════════════════════════════ */

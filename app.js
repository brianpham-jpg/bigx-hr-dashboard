/* ============================================================
   BigX HR Analytics Dashboard — app.js
   Điều hướng + data thật từ API hub (1 nguồn, đã lọc PII).
   ============================================================ */

var API_URL = 'https://script.google.com/macros/s/AKfycbwEnVeOgLI8DSnLjCWDGyCZx-878CJNVRWtobRX8AXadpiXfy4lXCQvXx0KMNUSm2AQ/exec';

/* Kho dữ liệu (nạp 1 lần) */
var HR = { loaded:false, error:null, updated:'', nhansu:[], tuyendung:[] };

/* ---- Cấu trúc điều hướng (5 nhóm) ---- */
const NAV = [
  { group:'Tổng quan', items:[
    { id:'overview', label:'Bảng điều khiển', icon:'ti-layout-dashboard',
      lead:'Một màn hình để nhìn nhanh trong 10 giây: các chỉ số chính, funnel tóm tắt, cảnh báo hợp đồng & sinh nhật.',
      points:['Dải KPI: tổng nhân sự, đang tuyển, CV trong kỳ','Funnel tuyển dụng rút gọn + cảnh báo hết hạn hợp đồng','Nhắc sinh nhật và công việc cần chú ý'],
      skeleton:'kpi' }
  ]},
  { group:'Vận hành — dữ liệu gốc', items:[
    { id:'ho-so',    label:'Hồ sơ nhân sự', icon:'ti-id-badge',
      lead:'Danh sách nhân sự để tra cứu — đọc từ file nguồn qua API, đã ẩn cột nhạy cảm (CCCD, SĐT, địa chỉ).' },
    { id:'tuyen-dung', label:'Tuyển dụng', icon:'ti-file-description',
      lead:'Danh sách CV & vị trí tuyển dụng — nơi tra cứu và cập nhật trạng thái ứng viên.',
      points:['Danh sách vị trí đang mở','Bảng CV theo vị trí & trạng thái','Ghi chú kết quả từng vòng'] },
    { id:'kho-cv',   label:'Kho CV', icon:'ti-folder',
      lead:'Kho lưu và tra cứu hồ sơ CV ứng viên.',
      points:['Lưu trữ CV theo vị trí','Tra cứu nhanh','Gắn kết với pipeline tuyển dụng'] },
    { id:'cong-viec', label:'Công việc HR', icon:'ti-checklist',
      lead:'Danh sách task HR: phụ trách, phòng ban, deadline, ưu tiên, trạng thái.',
      points:['Bảng task đang chạy','Lọc theo người phụ trách / trạng thái','Nhắc deadline'] },
    { id:'cham-cong', label:'Chấm công & phép', icon:'ti-calendar-stats', badge:'gộp',
      lead:'Bảng công theo tháng và phép năm còn lại — gộp chung một chỗ.',
      points:['Ngày công, đi trễ, tăng ca theo tháng','Nghỉ phép & phép còn lại','Theo khoá Tháng + Mã NV'] },
    { id:'hop-dong', label:'Hợp đồng', icon:'ti-file-certificate', badge:'new',
      lead:'Theo dõi hợp đồng nhân sự và cảnh báo sắp hết hạn.',
      points:['Loại HĐ, ngày bắt đầu / hết hạn, trạng thái','Cảnh báo hết hạn / quá hạn','Form mẫu HĐ BigX'] }
  ]},
  { group:'Phân tích', star:true, items:[
    { id:'pt-chi-so', label:'Chỉ số & xu hướng', icon:'ti-chart-bar', badge:'new',
      lead:'Biến số liệu thành xu hướng: headcount, cơ cấu, và các chỉ số HR theo thời gian.',
      points:['Headcount theo tháng (vào / nghỉ / ròng)','Cơ cấu theo phòng ban, loại HĐ, thâm niên','Xu hướng nhiều kỳ để so sánh'],
      skeleton:'charts' },
    { id:'pt-tuyen-dung', label:'Hiệu quả tuyển dụng', icon:'ti-activity', badge:'new',
      lead:'Funnel & hiệu quả nguồn CV: nơi biến tuyển dụng thành quyết định.',
      points:['Funnel: CV → phỏng vấn → offer → nhận việc','Tỷ lệ chuyển đổi từng bước','Hiệu quả theo nguồn CV, time-to-hire'],
      skeleton:'charts' },
    { id:'pt-bien-dong', label:'Biến động nhân sự', icon:'ti-trending-up', badge:'new',
      lead:'Turnover & giữ chân: ai vào, ai nghỉ, và vì sao.',
      points:['Turnover / attrition rate theo kỳ','Tỷ lệ giữ chân, thâm niên trung bình','Biến động theo phòng ban'],
      skeleton:'charts' },
    { id:'pt-nang-suat', label:'Chấm công & năng suất', icon:'ti-clock', badge:'new',
      lead:'Từ bảng công đến góc nhìn năng suất.',
      points:['Ngày công, đi trễ, tăng ca theo nhóm','So sánh giữa phòng ban','Xu hướng theo tháng'],
      skeleton:'charts' }
  ]},
  { group:'Tổ chức & tham chiếu', items:[
    { id:'so-do',   label:'Sơ đồ tổ chức', icon:'ti-sitemap',
      lead:'Sơ đồ tổ chức BigX — tài liệu tĩnh, ít thay đổi.',
      points:['Cây tổ chức theo phòng ban','Ban giám đốc & đầu mối'] },
    { id:'quy-dinh', label:'Quy định & Quy trình', icon:'ti-book',
      lead:'Quy định nội bộ và quy trình HR.',
      points:['Bộ quy định nhân sự','Quy trình tuyển dụng / onboarding','Tài liệu tham chiếu'] },
    { id:'calendar', label:'Calendar', icon:'ti-calendar',
      lead:'Lịch HR — sự kiện, deadline, mốc quan trọng.',
      points:['Lịch tháng','Sự kiện & nhắc việc'] }
  ]},
  { group:'Hệ thống', items:[
    { id:'nguon',   label:'Nguồn dữ liệu', icon:'ti-database-import', badge:'new',
      lead:'Trái tim kiến trúc "1 nguồn": web đọc từ đúng 1 API, ghép theo Mã NV, lọc PII. Mọi tab đọc từ đây.',
      points:['API hub đọc: Hồ sơ + Tuyển dụng (Chấm công cắm sau)','Kiểm tra tính toàn vẹn theo Mã NV','PII (CCCD/SĐT/địa chỉ) không bao giờ rời file nguồn'],
      skeleton:'source' }
  ]}
];

var MAP = {};
NAV.forEach(function(g){ g.items.forEach(function(it){ MAP[it.id]={item:it, group:g}; }); });

/* ---- Data loader ---- */
function loadData(){
  HR.error=null;
  fetch(API_URL)
    .then(function(r){ return r.json(); })
    .then(function(d){
      HR.loaded=true; HR.updated=d.updated||''; HR.nhansu=d.nhansu||[]; HR.tuyendung=d.tuyendung||[];
      var up=document.getElementById('tb-note'); if(up) up.textContent = 'Cập nhật: '+HR.updated;
      if(currentTab) go(currentTab); // vẽ lại tab hiện tại khi data về
    })
    .catch(function(e){
      HR.error = e.message||'Lỗi kết nối';
      if(currentTab) go(currentTab);
    });
}

/* ---- Sidebar ---- */
function renderNav(){
  var nav=document.getElementById('nav');
  nav.innerHTML = NAV.map(function(g){
    return '<div class="nav-group"><div class="nav-glabel">'+g.group+(g.star?'<span class="star">★</span>':'')+'</div>'+
      g.items.map(function(it){
        return '<div class="nav-item" id="nav-'+it.id+'" onclick="go(\''+it.id+'\')"><i class="ti '+it.icon+'"></i><span>'+it.label+'</span>'+
          (it.badge==='new'?'<span class="nav-badge new">Mới</span>':'')+
          (it.badge==='gộp'?'<span class="nav-badge new">Gộp</span>':'')+'</div>';
      }).join('')+'</div>';
  }).join('');
}

/* ---- Helpers ---- */
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function statusPill(tt){
  var cls='gray';
  if(tt==='Đang làm việc') cls='teal';
  else if(tt==='Nghỉ việc') cls='rust';
  else if(tt==='Thử việc') cls='clay';
  return '<span class="pill '+cls+'">'+esc(tt||'—')+'</span>';
}
function parseDMY(s){ var p=String(s||'').split('/'); return p.length===3? new Date(+p[2],+p[1]-1,+p[0]) : null; }
function loaiHDShort(s){ return s==='Lao động chính thức' ? 'Chính thức' : (s||'—'); }
function isNewHire(ngayVao){ var d=parseDMY(ngayVao); if(!d) return false; var days=(Date.now()-d.getTime())/86400000; return days>=0 && days<=45; }
/* sắp theo ngày vào giảm dần (mới nhất trên đầu); thiếu ngày xuống cuối */
function byNgayVaoDesc(a,b){
  var da=parseDMY(a.ngayVao), db=parseDMY(b.ngayVao);
  if(!da && !db) return 0; if(!da) return 1; if(!db) return -1;
  return db.getTime()-da.getTime();
}

/* ---- Skeleton (khung gợi ý) ---- */
function skeleton(kind){
  if(kind==='kpi') return '<div class="skeleton-grid">'+Array.from({length:4}).map(function(){return '<div class="sk-card"><div class="sk-tag">Chỉ số</div><div class="sk-num"></div><div class="sk-line w60"></div></div>';}).join('')+'</div>';
  if(kind==='charts') return '<div class="skeleton-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));">'+Array.from({length:2}).map(function(){return '<div class="sk-card" style="min-height:200px;"><div class="sk-tag">Biểu đồ</div><div class="sk-line w40"></div><div style="flex:1;border-radius:8px;background:var(--line-soft);margin-top:6px;"></div></div>';}).join('')+'</div>';
  if(kind==='source') return '<div class="skeleton-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));">'+['NhanSu','TuyenDung','ChamCong','HopDong'].map(function(s){return '<div class="sk-card" style="min-height:88px;"><div class="sk-tag" style="color:var(--teal);">'+s+'</div><div class="sk-line w80"></div><div class="sk-line w60"></div></div>';}).join('')+'</div>';
  return '';
}

/* ---- Empty state (tab chưa gắn data) ---- */
function emptyState(item, group){
  var points=(item.points||[]).map(function(p){return '<div class="empty-li"><i class="ti ti-point"></i>'+esc(p)+'</div>';}).join('');
  return '<div class="empty"><div class="empty-icon"><i class="ti '+item.icon+'"></i></div><div class="empty-body">'+
    '<div class="empty-kicker">'+(group.star?'Phân tích ★':esc(group.group))+'</div>'+
    '<div class="empty-title">Khung đã sẵn sàng — chưa gắn dữ liệu</div>'+
    '<div class="empty-text">Nội dung sẽ hiển thị ở đây sau khi nạp dữ liệu từ <b>Nguồn dữ liệu</b>. Bố cục dự kiến:</div>'+
    '<div class="empty-list">'+points+'</div>'+
    '<div class="empty-foot"><i class="ti ti-plug-connected"></i>Bước tiếp theo: gắn dữ liệu cho tab này.</div>'+
    '</div></div>'+(item.skeleton?skeleton(item.skeleton):'');
}

/* ---- Trạng thái tải ---- */
function loadingBox(){ return '<div class="empty"><div class="empty-icon"><i class="ti ti-loader"></i></div><div class="empty-body"><div class="empty-title">Đang tải dữ liệu…</div><div class="empty-text">Đọc từ API hub (Hồ sơ + Tuyển dụng).</div></div></div>'; }
function errorBox(){ return '<div class="empty"><div class="empty-icon" style="color:var(--rust);"><i class="ti ti-wifi-off"></i></div><div class="empty-body"><div class="empty-kicker" style="color:var(--rust);">Lỗi kết nối</div><div class="empty-title">Không đọc được dữ liệu</div><div class="empty-text">'+esc(HR.error)+'</div><div class="empty-foot"><i class="ti ti-refresh"></i>Thử tải lại trang, hoặc kiểm tra API hub đã deploy "Bất kỳ ai".</div></div></div>'; }

/* ============================================================
   TAB: HỒ SƠ NHÂN SỰ
   ============================================================ */
var hsFilter = { q:'', phong:'', tt:'' };

function renderHoSo(){
  if(HR.error) return errorBox();
  if(!HR.loaded) return loadingBox();
  var ns = HR.nhansu.slice().sort(function(a,b){ return String(a.maNV).localeCompare(String(b.maNV)); });

  var tong = ns.length;
  var dangLam = ns.filter(function(e){ return e.tinhTrang!=='Nghỉ việc'; }).length;
  var nghi = ns.filter(function(e){ return e.tinhTrang==='Nghỉ việc'; }).length;
  var phongList = []; ns.forEach(function(e){ if(e.phong && phongList.indexOf(e.phong)<0) phongList.push(e.phong); });
  var ttList = []; ns.forEach(function(e){ if(e.tinhTrang && ttList.indexOf(e.tinhTrang)<0) ttList.push(e.tinhTrang); });

  var kpis = [
    ['Tổng nhân sự', tong, 'ti-users'],
    ['Đang làm', dangLam, 'ti-user-check'],
    ['Nghỉ việc', nghi, 'ti-user-off'],
    ['Phòng ban', phongList.length, 'ti-building']
  ].map(function(k){
    return '<div class="stat"><div class="stat-top"><span class="stat-lbl">'+k[0]+'</span><i class="ti '+k[2]+'"></i></div><div class="stat-val">'+k[1]+'</div></div>';
  }).join('');

  var opt = function(list, sel){ return '<option value="">Tất cả</option>'+list.map(function(x){return '<option value="'+esc(x)+'"'+(sel===x?' selected':'')+'>'+esc(x)+'</option>';}).join(''); };

  var html =
    '<div class="page-head"><div class="page-h1">Hồ sơ nhân sự</div>'+
    '<div class="page-lead">'+esc(MAP['ho-so'].item.lead)+'</div></div>'+
    '<div class="stat-row">'+kpis+'</div>'+
    '<div class="toolbar">'+
      '<div class="tb-search"><i class="ti ti-search"></i><input id="hs-q" placeholder="Tìm tên hoặc mã NV…" value="'+esc(hsFilter.q)+'" oninput="hsOn()"></div>'+
      '<select id="hs-phong" onchange="hsOn()"><option value="">Tất cả phòng</option>'+phongList.map(function(x){return '<option value="'+esc(x)+'"'+(hsFilter.phong===x?' selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select>'+
      '<select id="hs-tt" onchange="hsOn()"><option value="">Mọi trạng thái</option>'+ttList.map(function(x){return '<option value="'+esc(x)+'"'+(hsFilter.tt===x?' selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select>'+
      '<span class="tb-count" id="hs-count"></span>'+
    '</div>'+
    '<div class="table-wrap"><table class="dt"><thead><tr>'+
      '<th>Mã NV</th><th>Họ tên</th><th>Phòng ban</th><th>Chức vụ</th><th>Trạng thái</th><th>Ngày vào</th><th>Thâm niên</th><th>Loại HĐ</th><th>Sinh nhật</th>'+
    '</tr></thead><tbody id="hs-body"></tbody></table></div>';

  setTimeout(hsRenderBody, 0);
  return html;
}

function hsOn(){
  hsFilter.q = (document.getElementById('hs-q')||{}).value || '';
  hsFilter.phong = (document.getElementById('hs-phong')||{}).value || '';
  hsFilter.tt = (document.getElementById('hs-tt')||{}).value || '';
  hsRenderBody();
}

function hsRenderBody(){
  var body=document.getElementById('hs-body'); if(!body) return;
  var q=hsFilter.q.trim().toLowerCase();
  var rows = HR.nhansu.slice().sort(byNgayVaoDesc).filter(function(e){
    if(hsFilter.phong && e.phong!==hsFilter.phong) return false;
    if(hsFilter.tt && e.tinhTrang!==hsFilter.tt) return false;
    if(q){ var hay=((e.hoTen||'')+' '+(e.maNV||'')).toLowerCase(); if(hay.indexOf(q)<0) return false; }
    return true;
  });
  var cnt=document.getElementById('hs-count'); if(cnt) cnt.textContent = rows.length+' người';
  if(!rows.length){ body.innerHTML='<tr><td colspan="9" class="dt-empty">Không có nhân sự khớp bộ lọc.</td></tr>'; return; }
  body.innerHTML = rows.map(function(e){
    var moi = isNewHire(e.ngayVao) ? ' <span class="tag-new">Mới</span>' : '';
    return '<tr>'+
      '<td class="dt-mono">'+esc(e.maNV||'—')+'</td>'+
      '<td class="dt-name">'+esc(e.hoTen||'—')+'</td>'+
      '<td class="nw">'+esc(e.phong||'—')+'</td>'+
      '<td class="dt-muted">'+esc(e.chucVu||'—')+'</td>'+
      '<td class="nw">'+statusPill(e.tinhTrang)+'</td>'+
      '<td class="dt-date nw">'+esc(e.ngayVao||'—')+moi+'</td>'+
      '<td class="dt-muted nw">'+esc(e.thamNien||'—')+'</td>'+
      '<td class="dt-muted nw">'+esc(loaiHDShort(e.loaiHD))+'</td>'+
      '<td class="dt-muted nw">'+esc(e.sinhNhat||'—')+'</td>'+
    '</tr>';
  }).join('');
}

/* ---- Router ---- */
var currentTab = null;
function go(id){
  var entry=MAP[id]; if(!entry) return;
  currentTab=id;
  var item=entry.item, group=entry.group;

  document.querySelectorAll('.nav-item').forEach(function(e){ e.classList.remove('active'); });
  var nb=document.getElementById('nav-'+id); if(nb) nb.classList.add('active');

  document.getElementById('tb-icon').innerHTML='<i class="ti '+item.icon+'"></i>';
  document.getElementById('tb-title').textContent=item.label;
  document.getElementById('tb-crumb').textContent=group.group;

  var content=document.getElementById('content');
  if(id==='ho-so') content.innerHTML=renderHoSo();
  else content.innerHTML='<div class="page-head"><div class="page-h1">'+esc(item.label)+'</div><div class="page-lead">'+esc(item.lead||'')+'</div></div>'+emptyState(item, group);
  content.scrollTop=0;
}

/* ---- Khởi động ---- */
renderNav();
loadData();
go('overview');

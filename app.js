/* ============================================================
   BigX HR Analytics Dashboard — app.js
   Khung điều hướng + trạng thái trống. Chưa gắn dữ liệu.
   Data sẽ được add ở bước sau (kiến trúc "1 nguồn").
   ============================================================ */

/* ---- Cấu trúc điều hướng (5 nhóm, theo mockup) ---- */
const NAV = [
  { group:'Tổng quan', items:[
    { id:'overview', label:'Bảng điều khiển', icon:'ti-layout-dashboard',
      lead:'Một màn hình để nhìn nhanh trong 10 giây: các chỉ số chính, funnel tóm tắt, cảnh báo hợp đồng & sinh nhật.',
      points:['Dải KPI: tổng nhân sự, vị trí đang tuyển, CV trong kỳ, task đang chạy',
              'Funnel tuyển dụng rút gọn + cảnh báo hết hạn hợp đồng',
              'Nhắc sinh nhật và công việc cần chú ý'],
      skeleton:'kpi' }
  ]},
  { group:'Vận hành — dữ liệu gốc', items:[
    { id:'ho-so',    label:'Hồ sơ nhân sự', icon:'ti-id-badge',
      lead:'Bảng danh sách để tra cứu và nhập liệu hồ sơ nhân sự. Dữ liệu cá nhân (PII) chỉ nằm trong file nguồn offline.',
      points:['Danh sách nhân sự theo phòng ban','Lọc, tìm kiếm, xuất Excel','Cột PII ẩn khỏi bản public'] },
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
      lead:'Trái tim của kiến trúc "1 nguồn": nơi nạp file master, xem trạng thái cập nhật và báo lỗi dữ liệu. Mọi tab đọc từ đây.',
      points:['Nạp file BigX_HR_Master.xlsx (5 sheet: NhanSu, TuyenDung, CongViec, HopDong, ChamCong)',
              'Kiểm tra tính toàn vẹn: thiếu cột, sai định dạng ngày, trùng khoá',
              'PII nằm trong file offline — không đẩy lên repo/web public'],
      skeleton:'source' }
  ]}
];

/* map id -> {item, group} để router tra nhanh */
const MAP = {};
NAV.forEach(g=>g.items.forEach(it=>{ MAP[it.id]={item:it, group:g}; }));

/* ---- Render sidebar ---- */
function renderNav(){
  const nav = document.getElementById('nav');
  nav.innerHTML = NAV.map(g=>`
    <div class="nav-group">
      <div class="nav-glabel">${g.group}${g.star?'<span class="star">★</span>':''}</div>
      ${g.items.map(it=>`
        <div class="nav-item" id="nav-${it.id}" onclick="go('${it.id}')">
          <i class="ti ${it.icon}"></i><span>${it.label}</span>
          ${it.badge==='new'?'<span class="nav-badge new">Mới</span>':''}
          ${it.badge==='gộp'?'<span class="nav-badge new">Gộp</span>':''}
        </div>`).join('')}
    </div>`).join('');
}

/* ---- Skeleton blocks (khung gợi ý bố cục, chưa data) ---- */
function skeleton(kind){
  if(kind==='kpi'){
    const cards = Array.from({length:4}).map(()=>`
      <div class="sk-card">
        <div class="sk-tag">Chỉ số</div>
        <div class="sk-num"></div>
        <div class="sk-line w60"></div>
      </div>`).join('');
    return `<div class="skeleton-grid">${cards}</div>`;
  }
  if(kind==='charts'){
    return `<div class="skeleton-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));">
      ${Array.from({length:2}).map(()=>`
        <div class="sk-card" style="min-height:200px;">
          <div class="sk-tag">Biểu đồ</div>
          <div class="sk-line w40"></div>
          <div style="flex:1;border-radius:8px;background:var(--line-soft);margin-top:6px;"></div>
        </div>`).join('')}
    </div>`;
  }
  if(kind==='source'){
    return `<div class="skeleton-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));">
      ${['NhanSu','TuyenDung','CongViec','HopDong','ChamCong'].map(s=>`
        <div class="sk-card" style="min-height:88px;">
          <div class="sk-tag" style="color:var(--teal);">${s}</div>
          <div class="sk-line w80"></div>
          <div class="sk-line w60"></div>
        </div>`).join('')}
    </div>`;
  }
  return '';
}

/* ---- Render một tab (trạng thái trống) ---- */
function go(id){
  const entry = MAP[id]; if(!entry) return;
  const {item, group} = entry;

  document.querySelectorAll('.nav-item').forEach(e=>e.classList.remove('active'));
  document.getElementById('nav-'+id)?.classList.add('active');

  document.getElementById('tb-icon').innerHTML = `<i class="ti ${item.icon}"></i>`;
  document.getElementById('tb-title').textContent = item.label;
  document.getElementById('tb-crumb').textContent = group.group;

  const points = (item.points||[]).map(p=>`<div class="empty-li"><i class="ti ti-point"></i>${p}</div>`).join('');

  document.getElementById('content').innerHTML = `
    <div class="page-head">
      <div class="page-h1">${item.label}</div>
      <div class="page-lead">${item.lead||''}</div>
    </div>
    <div class="empty">
      <div class="empty-icon"><i class="ti ${item.icon}"></i></div>
      <div class="empty-body">
        <div class="empty-kicker">${group.star?'Phân tích ★':group.group}</div>
        <div class="empty-title">Khung đã sẵn sàng — chưa gắn dữ liệu</div>
        <div class="empty-text">Nội dung sẽ hiển thị ở đây sau khi nạp dữ liệu từ <b>Nguồn dữ liệu</b>. Bố cục dự kiến:</div>
        <div class="empty-list">${points}</div>
        <div class="empty-foot"><i class="ti ti-plug-connected"></i>Bước tiếp theo: gắn dữ liệu từ file BigX_HR_Master.xlsx.</div>
      </div>
    </div>
    ${item.skeleton?skeleton(item.skeleton):''}
  `;
  document.getElementById('content').scrollTop = 0;
}

/* ---- Khởi động ---- */
renderNav();
go('overview');

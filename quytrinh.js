let qtView='overview', qtSelected=null, qtExpanded=new Set(), qtFilterLoai='all', qtSearch='';

const quyTrinhData=[{
  id:'onboarding',ten:'Onboarding nhân sự',loai:'Onboarding',
  docUrl:'https://docs.google.com/document/d/1742S6A_0lBjkh_J1xuuiCzeiq6-l9QSMG5O-0_e4-n0/edit',
  formUrl:'https://docs.google.com/spreadsheets/d/1bi-VQq_WxQ7vWpp_FvuUQbU0sWRvjrmJ2OLsy6qao6E/edit',
  formLabel:'Bảng checklist OBD',formIcon:'ti-table',
  icon:'ti-user-plus',iconBg:'#ede9fe',iconColor:'#5b21b6',tagBg:'#ede9fe',tagColor:'#5b21b6',
  steps:[
    {stt:'01',ten:'Đón nhân sự',giaiDoan:'Tiếp nhận',moTa:'Bộ phận HR đón nhân sự mới tại sảnh, hỗ trợ thủ tục vào cổng, dẫn tham quan không gian văn phòng.',checklist:['Chuẩn bị quà OBD','Phân công nhân viên HR đón tiếp tại sảnh đúng giờ','Dẫn tham quan: khu làm việc','Giới thiệu sơ lược lịch trình ngày đầu tiên']},
    {stt:'02',ten:'Chào mừng tại phòng',giaiDoan:'Tiếp nhận',moTa:'Team leader và đồng nghiệp chào đón nhân sự mới tại khu vực làm việc, giới thiệu từng thành viên trong nhóm.',checklist:['Sắp xếp buổi chào hỏi ngắn (5–10 phút) với toàn team','Giới thiệu sơ đồ tổ chức phòng ban: Sale, Booking, E-COM (Edit, Content), Per, CAM, TSP, Kế Toán, Nhân sự','Thông báo về mentor sẽ hỗ trợ nhân sự mới']},
    {stt:'03',ten:'Tặng quà OBD',giaiDoan:'Gắn kết',moTa:'Trao Welcome Kit của BIGX: sổ tay và bình nước.',checklist:['Bình nước có thương hiệu BIGX','Sổ tay có in logo']},
    {stt:'04',ten:'Chia sẻ văn hóa',giaiDoan:'Gắn kết',moTa:'HR tổ chức buổi chia sẻ về tầm nhìn, sứ mệnh, văn hóa và các quy tắc ứng xử tại BIGX trong phòng họp.',checklist:['Tầm nhìn, sứ mệnh, giá trị cốt lõi, quy định, quy trình','Cơ cấu tổ chức và sơ đồ phòng ban','Văn hóa làm việc, chuẩn mực ứng xử nội bộ','Phúc lợi và chính sách đãi ngộ chung']},
    {stt:'05',ten:'Gửi quy trình & quy định',giaiDoan:'Đào tạo',moTa:'HR cung cấp đầy đủ bộ tài liệu nội quy, quy trình làm việc và chính sách của công ty.',checklist:['Nội quy lao động công ty','Quy trình xử lý công việc theo phòng ban','Chính sách nghỉ phép, làm thêm giờ','Quy định bảo mật thông tin (NDA)','Hướng dẫn sử dụng hệ thống nội bộ']},
    {stt:'06',ten:'Làm bài test',giaiDoan:'Đào tạo',dieuKien:true,moTa:'Nhân sự mới hoàn thành bài kiểm tra đánh giá hiểu biết về văn hóa, quy định. Đạt điểm yêu cầu mới tiến sang bước tiếp theo.',checklist:['Đạt yêu cầu → Tiến sang Bước 07 — Ký biên bản cam kết','Chưa đạt → Ôn lại tài liệu và thực hiện lại bài test, HR hỗ trợ giải đáp']},
    {stt:'07',ten:'Ký biên bản cam kết',giaiDoan:'Cam kết',moTa:'Nhân sự ký kết biên bản cam kết tuân thủ quy định, bảo mật thông tin và các chính sách của BIGX.',checklist:['<a href="https://drive.google.com/file/d/1_LkY-B92Ux6hCM1oNSu_8BqczhThk50-/view?usp=sharing" target="_blank" style="color:#5b21b6;text-decoration:underline;">Biên bản cam kết tuân thủ nội quy lao động</a>','Cam kết bảo mật thông tin công ty (NDA)','Xác nhận đã nhận và đọc hiểu tài liệu OBD','Cam kết hoàn thành thử việc theo quy định']}
  ]
},{
  id:'offboarding',ten:'Offboarding nhân sự',loai:'Offboarding',
  docUrl:'https://docs.google.com/document/d/1ARWwpOD2NRFh_uollOrEKfwmaq5IAEtv2CbMoCJhNmE/edit',
  formUrl:'https://drive.google.com/drive/folders/1qJMixmHEpjM1r1OUUwKuz9GfFegBZ9-d',
  formLabel:'Biểu mẫu offboarding',
  icon:'ti-user-minus',iconBg:'#fee2e2',iconColor:'#ef4444',tagBg:'#fee2e2',tagColor:'#ef4444',
  steps:[
    {stt:'01',ten:'Tiếp nhận đơn xin nghỉ việc',giaiDoan:'Phê duyệt',moTa:'HR nhận đơn xin nghỉ việc và kiểm tra thời hạn báo trước theo HĐLĐ (thường 30 ngày với HĐ xác định thời hạn).',checklist:['Xác nhận thời hạn báo trước theo HĐLĐ','Ghi nhận ngày nộp đơn chính thức']},
    {stt:'02',ten:'Xét duyệt đơn',giaiDoan:'Phê duyệt',moTa:'Quản lý trực tiếp và Giám đốc ký duyệt đơn xin nghỉ việc.',checklist:['Manager ký duyệt đơn','Giám đốc ký xác nhận']},
    {stt:'03',ten:'Email xác nhận Last Working Day',giaiDoan:'Phê duyệt',moTa:'HR gửi email xác nhận ngày làm việc cuối cùng và danh mục đầu việc cần bàn giao.',checklist:['Email xác nhận ngày làm việc cuối (Last Working Day)','Đính kèm checklist bàn giao']},
    {stt:'04',ten:'Thông báo phối hợp nội bộ',giaiDoan:'Phê duyệt',moTa:'HR thông báo cho các bộ phận liên quan để chuẩn bị phối hợp quy trình.',checklist:['Thông báo Kế toán để chốt lương & phép năm','Thông báo Trưởng bộ phận để chuẩn bị thu hồi quyền truy cập']},
    {stt:'05',ten:'Bàn giao dự án & tài khoản',giaiDoan:'Bàn giao',moTa:'Nhân sự lập biên bản bàn giao chi tiết về dự án, client và tài khoản dùng chung.',checklist:['Trạng thái các dự án đang chạy và deadline tiếp theo','Danh sách liên hệ client/vendors và lưu ý làm việc','Tài khoản dùng chung: Meta Ads, Google Ads, Canva, Figma, fanpage,...','Link Google Drive, source file thiết kế']},
    {stt:'06',ten:'Ký biên bản bàn giao',giaiDoan:'Bàn giao',moTa:'Lập và ký biên bản bàn giao với đủ 3 chữ ký theo quy định.',checklist:['Manager chỉ định người tiếp nhận','3 chữ ký: Người nghỉ – Người nhận – Manager','<a href="https://drive.google.com/file/d/1rRuNLwgZhq6cXvFbr4ska7bukqy3BBXH/view" target="_blank" style="color:#5b21b6;text-decoration:none;">→ Xem mẫu biên bản bàn giao</a>']},
    {stt:'07',ten:'Email bàn giao đến Line Manager',giaiDoan:'Bàn giao',moTa:'Nhân sự gửi email tóm tắt toàn bộ nội dung bàn giao đến Line Manager, cc Phòng Nhân sự.',checklist:['Tóm tắt nội dung bàn giao','Gửi đến: Line Manager — CC: Phòng Nhân sự']},
    {stt:'08',ten:'Exit Interview',giaiDoan:'Thu hồi',moTa:'HR thực hiện phỏng vấn nghỉ việc để thu thập phản hồi và ghi nhận lý do rời đi.',checklist:['Phỏng vấn 1-1 với HR','Ghi nhận lý do nghỉ việc vào hồ sơ nội bộ']},
    {stt:'09',ten:'Thu hồi thiết bị',giaiDoan:'Thu hồi',moTa:'HR kiểm tra và thu hồi toàn bộ tài sản công ty.',checklist:['Laptop và phụ kiện đi kèm','Thẻ gửi xe, thẻ nhân viên','Các thiết bị khác (nếu có)']},
    {stt:'10',ten:'Thu hồi quyền truy cập',giaiDoan:'Thu hồi',moTa:'Trưởng bộ phận phối hợp xóa toàn bộ quyền truy cập của nhân sự khỏi hệ thống và tools.',checklist:['Email công ty','Tài khoản tools: Canva, Figma, Meta Ads, Google Ads,...','Hệ thống quản lý nội bộ','Tài khoản fanpage, group nội bộ']},
    {stt:'11',ten:'Nộp hồ sơ & ký đủ 3 giấy tờ',giaiDoan:'Thanh lý',moTa:'Nhân sự nộp đầy đủ hồ sơ và ký đủ 3 biểu mẫu theo quy định trước ngày làm việc cuối.',checklist:['<a href="https://drive.google.com/file/d/1yqlPPs6Mg5IObaqpAkIEV_3FVqZAyUNe/view" target="_blank" style="color:#5b21b6;text-decoration:none;">Đơn xin nghỉ việc</a>','<a href="https://drive.google.com/file/d/1rRuNLwgZhq6cXvFbr4ska7bukqy3BBXH/view" target="_blank" style="color:#5b21b6;text-decoration:none;">Biên bản bàn giao</a>','<a href="https://drive.google.com/file/d/1xZ77G7MqpmhsX_IvROC5H6HIKK1GYVYu/view" target="_blank" style="color:#5b21b6;text-decoration:none;">Thoả thuận chấm dứt hợp đồng</a>']},
    {stt:'12',ten:'Quyết toán tài chính',giaiDoan:'Thanh lý',moTa:'Kế toán và HR hoàn tất các khoản quyết toán tài chính trước ngày làm việc cuối.',checklist:['Hoàn tất tạm ứng còn nợ (nếu có)','Chốt số ngày phép năm chưa dùng và quy đổi thành tiền']},
    {stt:'13',ten:'Báo giảm BHXH & chốt sổ',giaiDoan:'Thanh lý',moTa:'HR thực hiện báo giảm BHXH và gửi sổ BHXH đã chốt cho nhân viên theo lịch cơ quan bảo hiểm.',checklist:['Làm thủ tục báo giảm BHXH','Gửi sổ BHXH đã chốt cho nhân viên']},
    {stt:'14',ten:'Ký biên bản thanh lý HĐLĐ',giaiDoan:'Thanh lý',moTa:'Hai bên ký biên bản thanh lý HĐLĐ và xác nhận không còn nợ nần tài sản/công việc.',checklist:['<a href="https://drive.google.com/file/d/1xZ77G7MqpmhsX_IvROC5H6HIKK1GYVYu/view" target="_blank" style="color:#5b21b6;text-decoration:none;">→ Xem mẫu thoả thuận chấm dứt hợp đồng</a>','Xác nhận không còn nợ tài sản/công việc']}
  ]
}];

function qtPhaseColor(g){
  if(g==='Tiếp nhận') return {circle:'#dbeafe',border:'#3b82f6',text:'#1d4ed8',line:'#dbeafe',bb:'#dbeafe',bt:'#1d4ed8'};
  if(g==='Gắn kết')  return {circle:'#fdf4ff',border:'#a855f7',text:'#7e22ce',line:'#f3e8ff',bb:'#fdf4ff',bt:'#7e22ce'};
  if(g==='Đào tạo')  return {circle:'#fefce8',border:'#eab308',text:'#a16207',line:'#fef9c3',bb:'#fefce8',bt:'#a16207'};
  if(g==='Cam kết')  return {circle:'#f0fdf4',border:'#22c55e',text:'#15803d',line:'#dcfce7',bb:'#f0fdf4',bt:'#15803d'};
  if(g==='Phê duyệt') return {circle:'#dbeafe',border:'#3b82f6',text:'#1d4ed8',line:'#dbeafe',bb:'#dbeafe',bt:'#1d4ed8'};
  if(g==='Bàn giao')  return {circle:'#fdf4ff',border:'#a855f7',text:'#7e22ce',line:'#f3e8ff',bb:'#fdf4ff',bt:'#7e22ce'};
  if(g==='Thu hồi')   return {circle:'#fff7ed',border:'#f97316',text:'#c2410c',line:'#fed7aa',bb:'#fff7ed',bt:'#c2410c'};
  if(g==='Thanh lý')  return {circle:'#f0fdf4',border:'#22c55e',text:'#15803d',line:'#dcfce7',bb:'#f0fdf4',bt:'#15803d'};
  return {circle:'#f1f5f9',border:'#94a3b8',text:'#64748b',line:'#f1f5f9',bb:'#f1f5f9',bt:'#64748b'};
}
function qtToggleStep(stt){
  qtExpanded.has(stt)?qtExpanded.delete(stt):qtExpanded.add(stt);
  renderQuyTrinh();
}
function qtOpenDetail(id){ qtSelected=id; qtView='detail'; qtExpanded=new Set(); renderQuyTrinh(); }
function qtBack(){ qtView='overview'; qtSelected=null; renderQuyTrinh(); }
function qtSetFilter(l){ qtFilterLoai=l; renderQuyTrinh(); }

function renderQuyTrinh(){
  if(qtView==='detail'){
    const qt=quyTrinhData.find(q=>q.id===qtSelected);
    if(!qt){ qtView='overview'; renderQuyTrinh(); return; }
    const stepRows=qt.steps.map((s,i)=>{
      const c=qtPhaseColor(s.giaiDoan);
      const isLast=i===qt.steps.length-1;
      const isOpen=qtExpanded.has(s.stt);
      const body=isOpen?`<div class="qt-step-body"><div class="qt-step-desc">${s.moTa}</div>${s.checklist.map(ch=>`<div class="qt-check-item"><i class="ti ti-check"></i>${ch}</div>`).join('')}</div>`:'';
      return `<div class="qt-step-row">
        <div class="qt-step-line-col">
          <div class="qt-step-circle" style="background:${c.circle};border-color:${c.border};color:${c.text};">${s.stt}</div>
          ${!isLast?`<div class="qt-step-vline" style="background:${c.line};"></div>`:''}
        </div>
        <div class="qt-step-content">
          <div class="qt-step-card">
            <div class="qt-step-hdr" onclick="qtToggleStep('${s.stt}')">
              <div class="qt-step-hdr-left">
                <span class="qt-step-badge" style="background:${c.bb};color:${c.bt};">${s.giaiDoan}</span>
                <span class="qt-step-name">${s.ten}</span>
                ${s.dieuKien?'<span class="qt-step-cond">Có điều kiện</span>':''}
              </div>
              <i class="ti ${isOpen?'ti-chevron-down':'ti-chevron-right'}" style="font-size:14px;color:#94a3b8;"></i>
            </div>
            ${body}
          </div>
        </div>
      </div>`;
    }).join('');
    document.getElementById('content').innerHTML=`
    <div style="max-width:680px;">
      <div class="qt-back" onclick="qtBack()"><i class="ti ti-arrow-left"></i>Quay lại danh sách</div>
      <div class="qt-detail-title">${qt.ten}</div>
      <div class="qt-detail-sub">${qt.steps.length} bước · ${[...new Set(qt.steps.map(s=>s.giaiDoan))].length} giai đoạn</div>
      ${qt.docUrl||qt.formUrl?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin:2px 0 14px;">${qt.docUrl?`<a href="${qt.docUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:${qt.iconBg};color:${qt.iconColor};font-size:12.5px;font-weight:600;border-radius:8px;text-decoration:none;"><i class="ti ti-file-text"></i>${qt.docLabel||'Xem quy trình gốc'}</a>`:''}${qt.formUrl?`<a href="${qt.formUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#fef3c7;color:#b45309;font-size:12.5px;font-weight:600;border-radius:8px;text-decoration:none;"><i class="ti ${qt.formIcon||'ti-folder'}"></i>${qt.formLabel||'Biểu mẫu'}</a>`:''}</div>`:''}
      <div>${stepRows}</div>
    </div>`;
    return;
  }
  const loaiList=[...new Set(quyTrinhData.map(q=>q.loai))];
  const filtered=quyTrinhData.filter(q=>(qtFilterLoai==='all'||q.loai===qtFilterLoai)&&(!qtSearch||q.ten.toLowerCase().includes(qtSearch.toLowerCase())));
  const cards=filtered.map(q=>`
    <div class="qt-card" onclick="qtOpenDetail('${q.id}')">
      <div class="qt-card-top">
        <div class="qt-card-icon" style="background:${q.iconBg};"><i class="ti ${q.icon}" style="color:${q.iconColor};"></i></div>
        <div><div class="qt-card-name">${q.ten}</div><div class="qt-card-sub">${q.steps.length} bước · ${[...new Set(q.steps.map(s=>s.giaiDoan))].length} giai đoạn</div></div>
      </div>
      <span class="qt-card-tag" style="background:${q.tagBg};color:${q.tagColor};">${q.loai}</span>
      <div class="qt-card-prog"><div class="qt-card-prog-bar"><div class="qt-card-prog-fill" style="width:0%;background:${q.tagColor};"></div></div><div class="qt-card-prog-txt">Chưa bắt đầu</div></div>
    </div>`).join('');
  document.getElementById('content').innerHTML=`
  <div class="qt-search-bar">
    <div class="qt-search-box"><i class="ti ti-search"></i><input type="text" placeholder="Tìm quy trình..." value="${qtSearch}" oninput="qtSearch=this.value;renderQuyTrinh()"></div>
    <div class="qt-filters">
      <span class="qt-fb ${qtFilterLoai==='all'?'active':''}" onclick="qtSetFilter('all')">Tất cả</span>
      ${loaiList.map(l=>`<span class="qt-fb ${qtFilterLoai===l?'active':''}" onclick="qtSetFilter('${l}')">${l}</span>`).join('')}
    </div>
  </div>
  <div class="qt-grid">${cards}<div class="qt-add"><i class="ti ti-plus"></i>Thêm quy trình</div></div>`;
}

/* ══════════════════════════════════════════
   QUY ĐỊNH
══════════════════════════════════════════ */

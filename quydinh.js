let qdView='overview', qdSelected=null, qdExpanded=new Set();

const qdDocs=[
  {
    id:'lv',
    title:'Quy định & Nguyên tắc làm việc chung',
    tag:'Nội quy',tagBg:'#ede9fe',tagColor:'#5b21b6',
    icon:'ti-book',iconBg:'#ede9fe',iconColor:'#5b21b6',
    updated:'08/07/2026',applyTo:'Toàn thể nhân viên',
    docUrl:'https://drive.google.com/file/d/1mzFazEGdAV-qM6JWPAkBC61g6Y_XYxca/view',
    sections:[
      {id:'1',num:'I',title:'Thời gian làm việc',icon:'ti-clock',iconBg:'#eff6ff',iconColor:'#3b82f6',badgeBg:'#eff6ff',badgeColor:'#1d4ed8',badge:'Giờ hành chính',
       items:['<b>Giờ làm việc chính thức:</b> 09h00 – 18h00, thứ Hai đến thứ Sáu. Nghỉ trưa: 12h00 – 13h00.','Nhân viên có trách nhiệm online đúng giờ và đảm bảo khả năng phối hợp xử lý công việc kịp thời.']},
      {id:'2',num:'II',title:'Check-in & Check-out',icon:'ti-login',iconBg:'#ede9fe',iconColor:'#5b21b6',badgeBg:'#ede9fe',badgeColor:'#5b21b6',badge:'Chấm công',
       items:['<b>Check-in:</b> 09h00 và 13h00 hằng ngày. Thông báo trạng thái online trên kênh nội bộ, bật camera khi check-in.','<b>Check-out:</b> Cập nhật tình trạng công việc (done/đang xử lý), báo cáo trên hệ thống hoặc kênh theo yêu cầu của Line Manager.','<b>Đến trễ / không check-in chung:</b> Check-in ngay khi có mặt. Tại văn phòng: chụp hình check-in gửi HR.']},
      {id:'3',num:'III',title:'Nguyên tắc trong giờ làm việc',icon:'ti-shield-check',iconBg:'#f0fdf4',iconColor:'#16a34a',badgeBg:'#f0fdf4',badgeColor:'#15803d',badge:'Hành vi',
       items:['Luôn trong trạng thái sẵn sàng trao đổi qua các kênh làm việc chính thức.','<b>Thời gian phản hồi:</b> Không quá 15 phút, trừ khi đang họp hoặc xử lý task phức tạp có thông báo trước.','Không tự ý rời công việc trong giờ làm mà không báo cáo Quản lý trực tiếp.','Tất cả lịch họp bắt buộc phải được cập nhật đầy đủ trên Calendar cá nhân.']},
      {id:'4',num:'IV',title:'Năng suất & trách nhiệm công việc',icon:'ti-target',iconBg:'#fff7ed',iconColor:'#f97316',badgeBg:'#fff7ed',badgeColor:'#c2410c',badge:'KPI',
       items:['Mỗi nhân viên chịu trách nhiệm hoàn thành KPI và task được giao theo ngày/tuần/tháng.','<b>Nguy cơ chậm tiến độ:</b> Báo ngay cho Quản lý và chủ động đề xuất phương án xử lý.','Công việc bàn giao cần rõ ràng, đầy đủ thông tin, tránh gây gián đoạn bộ phận khác.','Tuân thủ đúng trách nhiệm cá nhân/bộ phận theo KPI đã được phê duyệt.']},
      {id:'5',num:'V',title:'Họp & trao đổi công việc',icon:'ti-video',iconBg:'#fdf4ff',iconColor:'#a855f7',badgeBg:'#fdf4ff',badgeColor:'#7e22ce',badge:'Meeting',
       items:['Họp team định kỳ theo lịch của Quản lý trực tiếp. Tham gia đầy đủ, đúng giờ.','Bật camera trong các buổi họp online quan trọng.','Tôn trọng ý kiến đồng nghiệp, trao đổi chuyên nghiệp, không cắt ngang hoặc gây gián đoạn.']},
      {id:'6',num:'VI',title:'Kỷ luật & xử lý vi phạm',icon:'ti-gavel',iconBg:'#fef2f2',iconColor:'#ef4444',badgeBg:'#fef2f2',badgeColor:'#b91c1c',badge:'Phạt',special:true},
      {id:'7',num:'VII',title:'Văn hóa làm việc remote',icon:'ti-home-2',iconBg:'#fefce8',iconColor:'#ca8a04',badgeBg:'#fefce8',badgeColor:'#a16207',badge:'Remote',
       items:['Chủ động, minh bạch trong giao tiếp. Ưu tiên hiệu quả công việc, không "online cho có".','Nhân viên mới: add friend chéo với toàn thể thành viên ngay ngày đầu tiên.','Khi nhận tin nhắn giao việc / thông báo từ cấp trên: <b>bắt buộc phản hồi hoặc react</b> để xác nhận đã nắm thông tin.','<b>Bảo mật thông tin:</b> Tuyệt đối bảo mật dữ liệu. Chỉ chia sẻ link tài liệu, không gửi file trực tiếp. File phải cài đúng quyền truy cập theo email được cấp phép.']},
      {id:'8',num:'VIII',title:'Quy trình nghỉ phép',icon:'ti-calendar-off',iconBg:'#f0fdf4',iconColor:'#16a34a',badgeBg:'#f0fdf4',badgeColor:'#15803d',badge:'Nghỉ phép',specialFn:'v8'},
      {id:'9',num:'IX',title:'Mục tiêu áp dụng',icon:'ti-flag',iconBg:'#f8fafc',iconColor:'#64748b',badgeBg:'#f8fafc',badgeColor:'#475569',badge:'Tổng quan',badgeExtra:'border:1px solid #e2e8f0;',
       items:['Đảm bảo tính <b>kỷ luật – thống nhất – trách nhiệm</b> trong môi trường làm việc từ xa.','Xây dựng môi trường làm việc <b>chuyên nghiệp, minh bạch, hợp tác</b>.','Nâng cao hiệu quả công việc và hiệu suất chung của toàn Công ty.']},
      {id:'10',num:'X',title:'Hiệu lực thi hành & trách nhiệm tuân thủ',icon:'ti-file-check',iconBg:'#ede9fe',iconColor:'#5b21b6',badgeBg:'#ede9fe',badgeColor:'#5b21b6',badge:'Hiệu lực',
       items:['<b>Trạng thái:</b> Có hiệu lực tức thì kể từ ngày ban hành.','<b>Đầu mối hỗ trợ:</b> Phòng Human Resources (HR).','Mọi nhân sự BigX có trách nhiệm tuân thủ nghiêm ngặt chuẩn mực này.','HR đóng vai trò hoa tiêu: hướng dẫn, theo dõi và đề xuất nâng cấp quy trình để thích ứng với tốc độ phát triển của Công ty.','<i>"Sự chuẩn bị của cá nhân là nền tảng cho sự vững vàng của cả tập thể."</i>']}
    ]
  },
  {
    id:'lt',
    title:'Quy chế chính sách lương thưởng - BigX',
    tag:'C&B',tagBg:'#fff7ed',tagColor:'#c2410c',
    icon:'ti-coin',iconBg:'#fff7ed',iconColor:'#f97316',
    updated:'01/09/2023',applyTo:'Toàn thể NLĐ theo HĐLĐ chính thức',
    docUrl:'https://docs.google.com/document/d/1Nsr9NNwdbBmY3Blej2tcPxg-NZVBxyjS/edit',docLabel:'Xem file gốc',
    sections:[
      {id:'d1',num:'Điều 1',title:'Đối tượng áp dụng',icon:'ti-users',iconBg:'#eff6ff',iconColor:'#3b82f6',badgeBg:'#eff6ff',badgeColor:'#1d4ed8',badge:'Phạm vi',
       items:['Toàn bộ NLĐ làm việc theo <b>HĐLĐ chính thức</b> (xác định và không xác định thời hạn) tại Công ty Bigx.','Không áp dụng cho hợp đồng học việc và thử việc.']},
      {id:'d2',num:'Điều 2',title:'Mục đích',icon:'ti-target',iconBg:'#fff7ed',iconColor:'#f97316',badgeBg:'#fff7ed',badgeColor:'#c2410c',badge:'Tổng quan',
       items:['Khuyến khích NLĐ hoàn thành tốt công việc theo nguyên tắc <b>làm nhiều hưởng nhiều</b>.','Đảm bảo đời sống NLĐ, đáp ứng mức sống cơ bản.','Tuân thủ đúng quy định pháp luật lao động về lương thưởng và các chế độ.']},
      {id:'d3',num:'Điều 3',title:'Cơ sở căn cứ',icon:'ti-book-2',iconBg:'#f8fafc',iconColor:'#64748b',badgeBg:'#f8fafc',badgeColor:'#475569',badge:'Pháp lý',badgeExtra:'border:1px solid #e2e8f0;',
       items:['Luật Việc làm 38/2013 · Bộ luật Lao động 10/2012 · Luật BHBB 25/2008 · Luật Doanh nghiệp 68/2014 · Nghị định 141/2017/NĐ-CP.','Điều lệ tổ chức và hoạt động của Công ty Bigx · Quyết định Giám đốc ngày 01/09/2023.']},
      {id:'d4',num:'Điều 4',title:'Nguyên tắc tính lương, thưởng',icon:'ti-scale',iconBg:'#ede9fe',iconColor:'#5b21b6',badgeBg:'#ede9fe',badgeColor:'#5b21b6',badge:'Nguyên tắc',
       items:['Lương, thưởng dựa trên kết quả kinh doanh và mức đóng góp cá nhân. <b>Làm nhiều hưởng nhiều, làm ít hưởng ít.</b>','Khi thay đổi vị trí hoặc chức vụ → hưởng lương theo vị trí mới.','Khi kết quả kinh doanh tăng → lương, thưởng tăng theo hiệu quả thực tế, do Giám đốc phê duyệt.']},
      {id:'d5',num:'Điều 5',title:'Phân loại tiền lương',icon:'ti-layers-subtract',iconBg:'#f0fdf4',iconColor:'#16a34a',badgeBg:'#f0fdf4',badgeColor:'#15803d',badge:'Phân loại',
       items:['<b>Lương chính:</b> Trả cho NLĐ làm việc đủ giờ, điều kiện bình thường. Ghi rõ trong HĐLĐ theo Nghị định 141/2017/NĐ-CP.','<b>Lương khoán:</b> Theo hợp đồng giao khoán, thể hiện rõ nội dung, thời gian, mức lương.','<b>Lương thử việc:</b> Bộ phận kinh doanh: <b>85%</b> mức thỏa thuận. Các bộ phận khác: <b>100%</b> mức thỏa thuận.']},
      {id:'d6',num:'Điều 6',title:'Các khoản hỗ trợ đi kèm',icon:'ti-plus',iconBg:'#f0fdf4',iconColor:'#16a34a',badgeBg:'#f0fdf4',badgeColor:'#15803d',badge:'Phụ cấp',
       items:['Ngoài lương chính, NLĐ có thể nhận thêm các khoản hỗ trợ tùy vị trí và đặc thù công việc. Mức hỗ trợ thể hiện trong phụ lục HĐLĐ hoặc quyết định bổ nhiệm.']},
      {id:'d7',num:'Điều 7',title:'Cách tính lương',icon:'ti-calculator',iconBg:'#eff6ff',iconColor:'#3b82f6',badgeBg:'#eff6ff',badgeColor:'#1d4ed8',badge:'Công thức',specialFn:'d7'},
      {id:'d8',num:'Điều 8',title:'Thời hạn trả lương',icon:'ti-calendar-due',iconBg:'#fdf4ff',iconColor:'#a855f7',badgeBg:'#fdf4ff',badgeColor:'#7e22ce',badge:'Thanh toán',
       items:['Trả lương vào <b>ngày 30 – 31 hàng tháng</b> của tháng kế tiếp (trả lương tháng này vào cuối tháng sau).','Nếu trùng ngày nghỉ lễ/cuối tuần → Công ty thông báo trước qua email nội bộ.']},
      {id:'d9',num:'Điều 9',title:'Chế độ xét nâng lương',icon:'ti-trending-up',iconBg:'#f0fdf4',iconColor:'#16a34a',badgeBg:'#f0fdf4',badgeColor:'#15803d',badge:'Nâng lương',
       items:['Xét nâng lương <b>1 lần/năm vào tháng 01</b>, áp dụng với NLĐ đã đủ 12 tháng hưởng mức lương hiện tại.','<b>Điều kiện:</b> Hoàn thành tốt nhiệm vụ, không vi phạm nội quy, không bị kỷ luật khiển trách bằng văn bản trở lên.','<b>Mức nâng:</b> 5% – 10% lương hiện tại, căn cứ kết quả kinh doanh thực tế của Công ty.','Phòng Nhân sự tổng hợp danh sách → trình Giám đốc phê duyệt → họp thông báo và trao Quyết định nâng lương.']},
      {id:'d10',num:'Điều 10',title:'Bảo hiểm & chăm sóc sức khỏe',icon:'ti-shield-heart',iconBg:'#eff6ff',iconColor:'#3b82f6',badgeBg:'#eff6ff',badgeColor:'#1d4ed8',badge:'Phúc lợi',
       items:['<b>Bảo hiểm bắt buộc:</b> NLĐ chính thức được mua BHXH, BHYT, BHTN đầy đủ theo quy định Nhà nước.','<b>Khám sức khỏe định kỳ:</b> Hàng năm tại các cơ sở uy tín tại Hà Nội và TP.HCM, Công ty chi trả 100%.']},
      {id:'d11',num:'Điều 11',title:'Thưởng & phúc lợi',icon:'ti-gift',iconBg:'#fefce8',iconColor:'#ca8a04',badgeBg:'#fefce8',badgeColor:'#a16207',badge:'8 khoản',specialFn:'d11'},
      {id:'d12',num:'Điều 12',title:'Điều khoản thi hành',icon:'ti-file-check',iconBg:'#f8fafc',iconColor:'#64748b',badgeBg:'#f8fafc',badgeColor:'#475569',badge:'Hiệu lực',badgeExtra:'border:1px solid #e2e8f0;',
       items:['Quy chế có hiệu lực kể từ ngày <b>01/09/2023</b>.','Giao Trưởng phòng Nhân sự và Kế toán phối hợp triển khai thực hiện.','Quá trình phát sinh vướng mắc sẽ được nghiên cứu, điều chỉnh phù hợp theo tình hình thực tế.']}
    ]
  }
];

function qdOpenDoc(id){qdSelected=id;qdView='detail';qdExpanded=new Set();renderQuyDinh();}
function qdBack(){qdView='overview';qdSelected=null;renderQuyDinh();}
function qdToggle(id){qdExpanded.has(id)?qdExpanded.delete(id):qdExpanded.add(id);renderQuyDinh();}

function renderQuyDinh(){
  if(qdView==='detail'){
    const doc=qdDocs.find(d=>d.id===qdSelected);
    if(!doc){qdView='overview';renderQuyDinh();return;}

    function bodySection6(){
      return `
      <div class="qd-divider">Đi trễ có thông báo trước</div>
      <div class="qd-item"><span class="qd-dot"></span><span>Thông báo trước ít nhất 01 ngày cho Quản lý / HR. Chỉ áp dụng khi được cấp trên đồng ý.</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span>Trường hợp khẩn cấp (hỏng xe...): được xem là có thông báo, tối đa <b>01 lần/tháng</b>, không phạt.</span></div>
      <div class="qd-divider">Đi trễ không thông báo (kẹt xe không được chấp nhận)</div>
      <table class="qd-tbl">
        <thead><tr><th>Thời gian trễ</th><th>Hình thức phạt</th></tr></thead>
        <tbody>
          <tr><td>03 – 20 phút</td><td><span class="qd-fine">20.000đ / lần</span></td></tr>
          <tr><td>21 – 45 phút</td><td><span class="qd-fine">50.000đ / lần</span></td></tr>
          <tr><td>Trên 45 phút</td><td><span class="qd-warn">Tính nghỉ 01 buổi sáng</span></td></tr>
        </tbody>
      </table>
      <div class="qd-divider">Quy định chung</div>
      <div class="qd-item"><span class="qd-dot"></span><span>Tổng số lần đi trễ (kể cả có lý do) <b>không vượt quá 03 lần/tháng</b>. Vi phạm ảnh hưởng trực tiếp đến đánh giá hiệu suất cuối kỳ.</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span>Thiếu trách nhiệm, sai sót lặp lại nhiều lần: bị xem xét giảm thưởng hoặc hạ bậc đánh giá cuối kỳ.</span></div>`;
    }

    function bodyDieu7(){
      return `<div class="qd-formula">
        <div style="font-size:11.5px;font-weight:600;color:#334155;margin-bottom:4px;">Lương thực nhận hàng tháng</div>
        <div class="qd-formula-num">(Lương chính + Hỗ trợ nếu có) &times; Số ngày công đi làm</div>
        <div class="qd-formula-bar">Số ngày công chuẩn &nbsp;(tối đa 26 ngày/tháng)</div>
      </div>
      <div class="qd-item" style="margin-top:8px;"><span class="qd-dot" style="background:#3b82f6;"></span><span>Phòng Nhân sự tính lương dựa trên bảng chấm công hàng tháng.</span></div>`;
    }
    function bodyDieu11(){
      return `<div class="qd-divider">1. Nghỉ lễ, tết hưởng nguyên lương</div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Tết Dương lịch 1 ngày · Tết Âm lịch 5 ngày · 30/4 · 1/5 · Quốc khánh 2/9 (2 ngày) · Giỗ Tổ Hùng Vương 10/3 âm lịch.</span></div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Nghỉ việc riêng hưởng lương: Kết hôn 3 ngày · Con kết hôn 1 ngày · Bố/mẹ/vợ/chồng/con mất 3 ngày.</span></div>
      <div class="qd-divider">2. Hỗ trợ đám hiếu, hỷ, thiên tai, ốm đau</div>
      <table class="qd-tbl"><thead><tr><th>Đối tượng</th><th>Hiếu hỷ / sinh bé</th><th>Thiên tai / ốm đau</th></tr></thead>
      <tbody>
        <tr><td>Bản thân NLĐ</td><td><span class="qd-fine">1.000.000đ</span></td><td><span class="qd-fine">500.000đ</span></td></tr>
        <tr><td>Vợ/chồng, bố mẹ, anh chị em</td><td><span class="qd-fine">500.000đ</span></td><td><span class="qd-fine">200.000đ</span></td></tr>
      </tbody></table>
      <div class="qd-divider">3. Team building & du lịch</div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Công ty tổ chức định kỳ: sinh nhật, outdoor meeting, team building. Du lịch/nghỉ mát hàng năm tùy kết quả kinh doanh — Giám đốc quyết định thời gian và mức phí.</span></div>
      <div class="qd-divider">4. Hỗ trợ học phí đào tạo</div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Khi công việc yêu cầu NLĐ đi học → Công ty chi trả học phí theo hóa đơn thực tế.</span></div>
      <div class="qd-divider">5. Thưởng cuối năm</div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Căn cứ lợi nhuận thực tế. Mức thưởng dựa trên đóng góp và chất lượng công tác. Điều kiện: vẫn còn làm việc tại thời điểm chi thưởng (không trong danh sách báo nghỉ trước).</span></div>
      <div class="qd-divider">6. Lương tháng 13</div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Đủ 12 tháng → 1 tháng lương cứng. Chưa đủ → <i>(Số tháng làm việc / 12) × Lương cứng trung bình</i>. Không tính thời gian thử việc.</span></div>
      <div class="qd-divider">7. Thưởng sinh nhật & ngày lễ (8/3, 30/4, 1/5, 2/9, Trung thu, Tết)</div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Mức thưởng: <span class="qd-fine">300.000 – 500.000đ</span>/người. Tùy kết quả kinh doanh và đóng góp thực tế.</span></div>
      <div class="qd-divider">8. Thưởng sáng kiến / đột xuất</div>
      <div class="qd-item"><span class="qd-dot" style="background:#ca8a04;"></span><span>Khi có thành tích đặc biệt hoặc đóng góp sáng tạo vào phát triển Công ty. Mức thưởng do Giám đốc quyết định bằng văn bản.</span></div>`;
    }
    function bodyV8(){
      return `<div class="qd-item"><span class="qd-dot"></span><span><b>Mục tiêu:</b> Nghỉ ngơi không làm gián đoạn vận hành — bảo vệ luồng công việc, minh bạch thông tin giữa các phòng ban, và lưu vết dữ liệu nghỉ phép chuẩn xác.</span></div>
      <div class="qd-divider">1. Quy định phê duyệt nghỉ phép</div>
      <table class="qd-tbl">
        <thead><tr><th>Phân loại nghỉ</th><th>Báo trước tối thiểu</th><th>Người phê duyệt</th><th>SLA phản hồi</th></tr></thead>
        <tbody>
          <tr><td>1 ngày (gồm nghỉ theo giờ)</td><td>24 giờ trước thời điểm nghỉ</td><td>Leader trực tiếp</td><td>04 giờ làm việc</td></tr>
          <tr><td>2 – 3 ngày</td><td>03 ngày làm việc</td><td>Leader trực tiếp</td><td>04 giờ làm việc</td></tr>
          <tr><td>Từ 3 ngày trở lên</td><td>05 ngày làm việc</td><td>Leader đề xuất → CEO phê duyệt</td><td>04 giờ (Leader) + 04 giờ (CEO)</td></tr>
        </tbody>
      </table>
      <div class="qd-item"><span class="qd-dot"></span><span>Trường hợp vắng mặt, người có thẩm quyền phải chủ động <b>ủy quyền</b> để không làm đứt gãy quy trình.</span></div>
      <div class="qd-divider">2. Luồng xử lý xin nghỉ phép</div>
      <div class="qd-item"><span class="qd-dot"></span><span>① Nhân viên gửi yêu cầu & kế hoạch bàn giao → ② Leader đánh giá & phê duyệt → ③ CEO phê duyệt cấp cao (chỉ khi nghỉ ≥ 3 ngày) → ④ Nhân viên hoàn tất bàn giao thực tế → ⑤ Gửi hồ sơ phê duyệt cho HR → ⑥ Cập nhật trạng thái trên Google Calendar → ⑦ HR ghi nhận hệ thống → ⑧ Thông báo trên group tổng của Công ty.</span></div>
      <div class="qd-divider">3. Tốc độ xử lý — trách nhiệm cấp quản lý</div>
      <table class="qd-tbl">
        <thead><tr><th>Cấp</th><th>SLA</th><th>Trách nhiệm</th></tr></thead>
        <tbody>
          <tr><td>Leader</td><td>04 giờ làm việc</td><td>Đánh giá ảnh hưởng vận hành, bố trí người thay thế, chốt phê duyệt/từ chối.</td></tr>
          <tr><td>CEO (nếu áp dụng)</td><td>04 giờ làm việc</td><td>Kể từ khi Leader trình duyệt — chỉ dành cho nghỉ ≥ 3 ngày.</td></tr>
          <tr><td>HR</td><td>Trong ngày làm việc</td><td>Xử lý ngay khi nhận đủ thông tin minh chứng hợp lệ.</td></tr>
        </tbody>
      </table>
      <div class="qd-divider">4. Thông tin bắt buộc gửi HR (Pre-Flight Checklist)</div>
      <div class="qd-item"><span class="qd-dot"></span><span>Họ và tên · Phòng ban · Chức danh.</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span>Thời gian nghỉ & tổng số ngày nghỉ · Lý do xin nghỉ.</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span>Thông tin người nhận bàn giao (tên & kênh liên lạc).</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span><b>BẮT BUỘC:</b> Ảnh chụp màn hình minh chứng Leader/CEO đã phê duyệt. <span class="qd-warn">HR từ chối ghi nhận nếu thiếu minh chứng hoặc sai thẩm quyền.</span></span></div>
      <div class="qd-divider">5. Đồng bộ hệ thống — Google Calendar</div>
      <div class="qd-item"><span class="qd-dot"></span><span>Chuyển trạng thái thành <b>Out of Office / Off</b> trong suốt thời gian nghỉ.</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span>Cập nhật thông điệp tự động (VD: "Tôi đang nghỉ phép, vui lòng liên hệ [Tên người bàn giao] khi khẩn cấp").</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span>Chủ động mời các thành viên phối hợp trực tiếp vào sự kiện để họ nắm lịch trình.</span></div>
      <div class="qd-divider">6. Quy trình khẩn cấp (Bypass Flow)</div>
      <div class="qd-item"><span class="qd-dot"></span><span><b>Áp dụng cho:</b> ốm đau đột xuất, tai nạn, người thân qua đời, việc gia đình khẩn cấp.</span></div>
      <div class="qd-item"><span class="qd-dot"></span><span>① <b>Cấp báo (ngay lập tức):</b> nhân viên/người thân báo ngay cho Leader (Call/Zalo), bỏ qua thời gian báo trước → ② <b>Điều phối (Leader):</b> gánh vác điều phối vận hành và báo trực tiếp HR → ③ <b>Ghi nhận tạm thời (HR):</b> note trạng thái nghỉ khẩn cấp, thông báo các bên → ④ <b>Bổ sung (hậu kỳ):</b> nhân viên bổ sung minh chứng cho HR ngay khi quay lại làm việc.</span></div>
      <div class="qd-divider">7. Tiêu chí xác nhận nghỉ phép hợp lệ</div>
      <table class="qd-tbl">
        <thead><tr><th>Yếu tố</th><th>Điều kiện</th></tr></thead>
        <tbody>
          <tr><td>Thẩm quyền</td><td>Được phê duyệt đúng cấp (Leader/CEO) & có ảnh chụp minh chứng.</td></tr>
          <tr><td>Vận hành</td><td>Đã hoàn tất bàn giao công việc cho người thay thế.</td></tr>
          <tr><td>Dữ liệu</td><td>Hồ sơ thông tin đã gửi và HR xác nhận cập nhật.</td></tr>
          <tr><td>Hệ thống</td><td>Google Calendar hiển thị OOO/Off & HR đã thông báo toàn công ty.</td></tr>
        </tbody>
      </table>
      <div class="qd-item"><span class="qd-dot"></span><span><span class="qd-warn">Thiếu bất kỳ 1 trong 4 yếu tố trên</span> → yêu cầu nghỉ phép tính là chưa hợp lệ và có thể ảnh hưởng đến quyền lợi nhân sự.</span></div>`;
    }
    function buildCard(s){
      const isOpen=qdExpanded.has(s.id);
      const body=s.special?bodySection6():s.specialFn==='d7'?bodyDieu7():s.specialFn==='d11'?bodyDieu11():s.specialFn==='v8'?bodyV8():(s.items||[]).map(t=>`<div class="qd-item"><span class="qd-dot"></span><span>${t}</span></div>`).join('');
      return `<div class="qd-card">
        <div class="qd-hdr" onclick="qdToggle('${s.id}')">
          <div class="qd-ico" style="background:${s.iconBg};"><i class="ti ${s.icon}" style="color:${s.iconColor};"></i></div>
          <span class="qd-num">${s.num}</span>
          <span class="qd-title">${s.title}</span>
          <span class="qd-badge" style="background:${s.badgeBg};color:${s.badgeColor};${s.badgeExtra||''}">${s.badge}</span>
          <i class="ti ${isOpen?'ti-chevron-down':'ti-chevron-right'} qd-chev"></i>
        </div>
        <div class="qd-body${isOpen?' open':''}">${body}</div>
      </div>`;
    }

    const detailContent=doc.sections.length===0
      ? `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:200px;color:#94a3b8;font-size:13px;gap:10px;"><i class="ti ti-file-off" style="font-size:36px;color:#e2e8f0;display:block;"></i>Chưa có nội dung. Liên hệ HR để cập nhật.</div>`
      : doc.sections.map(buildCard).join('');

    document.getElementById('content').innerHTML=`
    <div style="max-width:680px;">
      <div class="qt-back" onclick="qdBack()"><i class="ti ti-arrow-left"></i>Quay lại danh sách</div>
      <div class="qt-detail-title">${doc.title}</div>
      <div class="qt-detail-sub">${doc.sections.length>0?doc.sections.length+' mục · '+doc.applyTo+' · Cập nhật: '+doc.updated:doc.applyTo+' · Chưa có nội dung'}</div>
      ${doc.docUrl?`<a href="${doc.docUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;margin:2px 0 14px;padding:7px 14px;background:#ede9fe;color:#5b21b6;font-size:12.5px;font-weight:600;border-radius:8px;text-decoration:none;"><i class="ti ti-file-text"></i>${doc.docLabel||'Xem file gốc (PDF)'}</a>`:''}
      <div>${detailContent}</div>
    </div>`;
    return;
  }

  /* ── OVERVIEW ── */
  const cards=qdDocs.map(d=>`
    <div class="qt-card" onclick="qdOpenDoc('${d.id}')">
      <div class="qt-card-top">
        <div class="qt-card-icon" style="background:${d.iconBg};"><i class="ti ${d.icon}" style="color:${d.iconColor};"></i></div>
        <div><div class="qt-card-name">${d.title}</div><div class="qt-card-sub">${d.sections.length>0?d.sections.length+' mục · '+d.applyTo:'Chưa có nội dung'}</div></div>
      </div>
      <span class="qt-card-tag" style="background:${d.tagBg};color:${d.tagColor};">${d.tag}</span>
      <div class="qt-card-prog">
        <div class="qt-card-prog-bar"><div class="qt-card-prog-fill" style="width:${d.sections.length>0?100:0}%;background:${d.tagColor};"></div></div>
        <div class="qt-card-prog-txt">${d.updated!=='—'?'Cập nhật: '+d.updated:'Chưa có nội dung'}</div>
      </div>
    </div>`).join('');

  document.getElementById('content').innerHTML=`
  <div class="qt-grid">${cards}<div class="qt-add"><i class="ti ti-plus"></i>Thêm quy định</div></div>`;
}

/* ══════════════════════════════════════════
   CALENDAR — Google Calendar API (OAuth GIS)
══════════════════════════════════════════ */

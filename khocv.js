var khoState={q:'',pos:'',status:'',page:0};
function _khoActive(){var e=document.getElementById('nav-khocv');return !!(e&&e.classList.contains('active'));}
function khoEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function khoParse(s){ if(!s) return null; var p=String(s).trim().split('/'); if(p.length<3) return null; var d=+p[0],m=+p[1],y=+p[2]; if(!d||!m||!y) return null; var dt=new Date(y,m-1,d); return isNaN(dt)?null:dt; }
function khoGoPage(n){ khoState.page=n; khoRenderRows(); }
function khoSetPos(i){khoState.pos=(i<0)?'':(window._khoPos[i]||'');khoState.page=0;renderKhoCV();}
function khoSetStatus(v){khoState.status=(khoState.status===v)?'':v;khoState.page=0;renderKhoCV();}
/* Suy ra ket qua: FINAL co san -> dung; FINAL trong -> theo ngay PV */
function khoDerive(c){
  var f=(c['FINAL']||'').trim();
  if(f==='TRÚNG TUYỂN') return {k:'hired',label:'Trúng tuyển',bg:'#E1F5EE',fg:'#0F6E56'};
  if(f==='TỪ CHỐI OFFER') return {k:'rejected',label:'Từ chối offer',bg:'#FAEEDA',fg:'#854F0B'};
  if(f==='FAIL') return {k:'rejected',label:'Trượt',bg:'#f1f5f9',fg:'#64748b'};
  if(f) return {k:'other',label:f,bg:'#f1f5f9',fg:'#64748b'};
  var pv=khoParse(c['NGAY LICH PV']);
  var today=new Date(); today.setHours(0,0,0,0);
  if(pv){
    if(pv.getTime()<today.getTime()) return {k:'rejected',label:'Trượt',bg:'#f1f5f9',fg:'#64748b'};
    return {k:'waiting',label:'Đang đợi kết quả',bg:'#fff7ed',fg:'#c2410c'};
  }
  return {k:'processing',label:'Chưa xử lý',bg:'#eff6ff',fg:'#1d4ed8'};
}
function khoStatusTag(c){ var d=khoDerive(c); return '<span style="font-size:9px;font-weight:500;padding:2px 8px;border-radius:20px;background:'+d.bg+';color:'+d.fg+';">'+khoEsc(d.label)+'</span>'; }
function khoDot(v){
  v=(v||'').trim().toUpperCase();
  if(v==='PASS') return '<i class="ti ti-circle-check" style="color:#22c55e;font-size:14px;"></i>';
  if(v==='FAIL') return '<i class="ti ti-circle-x" style="color:#ef4444;font-size:14px;"></i>';
  if(v) return '<i class="ti ti-circle-dot" style="color:#f59e0b;font-size:14px;"></i>';
  return '<i class="ti ti-minus" style="color:#cbd5e1;font-size:14px;"></i>';
}
var KHO_SCAN_PASS=60;
var KHO_RULES=[
 {id:'sales_mgr', label:'Sales Manager', match:['sales manager','trưởng phòng kinh doanh','trưởng phòng sales','trưởng phòng bán hàng','quản lý kinh doanh','trưởng nhóm kinh doanh'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) >= 3 năm kinh nghiệm quản lý/lãnh đạo đội ngũ kinh doanh có kết quả; (b) tư duy chiến lược, biết xây hệ thống bán hàng B2B bài bản. Trọng số điểm: 3-5 năm quản lý đội sales có kết quả=30; tư duy chiến lược & xây quy trình bán hàng=20; KN B2B/khách SMB/kinh doanh online-ecommerce=15; am hiểu TikTok Shop & TikTok Ads=10; kỹ năng lãnh đạo/đào tạo/tạo động lực đội=10; phân tích dữ liệu/quản trị KPI/CRM=10; chịu áp lực doanh số & đàm phán=5.'},
 {id:'booking', label:'Booking KOC/KOL Executive', match:['booking','koc','kol','influencer'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) kinh nghiệm booking KOC/KOL hoặc Influencer Marketing >= 6 tháng; (b) am hiểu TikTok (video, livestream, affiliate). Trọng số điểm: KN booking/Influencer >=6 tháng=30; am hiểu TikTok=25; từng chịu KPI doanh thu/GMV không chỉ content=15; có sẵn network KOC/KOL ưu tiên thời trang=10; giao tiếp/thương lượng/xây quan hệ=10; biết Excel/Google Sheets=5; chủ động chịu áp lực=5.'},
 {id:'content_b2b', label:'B2B Content Marketer', match:['content marketer','content marketing','b2b content','content b2b','inbound'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) >= 2 năm kinh nghiệm Content B2B (SaaS/agency/fintech/ecommerce), KHÔNG phải content giải trí/influencer; (b) có portfolio B2B (blog SEO / case study / whitepaper / email funnel). Trọng số điểm: >=2-3 năm Content B2B=25; portfolio blog SEO B2B + case study/whitepaper/email funnel=20; copywriting B2B thuyết phục=15; hiểu phễu TOFU/MOFU/BOFU đo bằng organic MQL/form/time-on-page=15; SEO on-page (keyword research/meta/internal link)=10; storytelling case study từ số liệu=10; data-driven & phối hợp Sales=5.'},
 {id:'digital_mkt', label:'Digital Marketing Executive', match:['digital marketing','digital mkt','chạy quảng cáo','ads executive','performance marketing','digital'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) >= 1 năm kinh nghiệm Digital Marketing, trong đó >= 1 năm chạy quảng cáo TikTok; (b) tư duy data-driven và hiểu nền tảng TikTok. Trọng số điểm: >=1 năm Digital Marketing + >=1 năm chạy TikTok Ads=30; tư duy data-driven, phân tích/trực quan hóa dữ liệu quảng cáo=20; tối ưu ngân sách & hiệu quả chiến dịch=15; nghiên cứu insight/hành vi khách trên TikTok=12; lập kế hoạch & báo cáo ngày/tuần/tháng=10; thành thạo MS Office/Google Workspace & trình bày=8; sáng tạo/chủ động/teamwork=5.'},
 {id:'creative_video', label:'Creative Video Content Executive', match:['creative video','video content','sáng tạo video','content executive','creative'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) 1-3 năm kinh nghiệm sản xuất/sáng tạo video TikTok/Reels/Shorts; (b) có portfolio sản phẩm thực tế và hiểu người dùng TikTok. Trọng số điểm: 1-3 năm KN sáng tạo video TikTok/Reels/Shorts=25; portfolio sản phẩm thực tế=15; tư duy nội dung & hiểu hành vi người dùng TikTok=15; gu thẩm mỹ thời trang & nhạy trend=15; kịch bản/storytelling bằng hình ảnh=10; KN thời trang/lifestyle=10; tư duy ứng dụng AI & bắt trend=10.'},
 {id:'edit_capcut', label:'Edit Video CapCut Senior', match:['edit video','capcut','video editor','senior edit','dựng video','editor'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) >= 1 năm kinh nghiệm video editing (ít nhất 6 tháng short-form); (b) thành thạo CapCut trên cả PC và Mobile. Trọng số điểm: >=1 năm editing & >=6 tháng short-form=25; thành thạo CapCut PC & Mobile=20; tính năng nâng cao Keyframe/Masking/Chroma Key=15; bố cục 9:16/typography/tạo Hook=12; dựng nhanh đáp ứng deadline & thẩm mỹ=10; hiểu thuật toán & hành vi người dùng TikTok=10; xử lý âm thanh/SFX/color grading & review Junior=8.'},
 {id:'ke_toan_thue', label:'Kế toán Thuế Doanh Nghiệp', match:['kế toán thuế','kế toán','ke toan','accountant','kiểm toán'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) >= 3 năm kinh nghiệm Kế toán thuế hoặc kế toán tổng hợp có làm thuế; (b) nắm vững Luật thuế và Thông tư 200/133/99. Trọng số điểm: 3-5 năm KN kế toán thuế/tổng hợp có làm thuế=30; nắm vững luật thuế & thông tư=20; kê khai GTGT/TNCN/TNDN, báo cáo & quyết toán thuế=15; hạch toán/hóa đơn/BHXH-BHYT-BHTN=12; thành thạo phần mềm kế toán & Excel=10; tốt nghiệp CĐ/ĐH Kế toán-Kiểm toán-Tài chính=8; tỉ mỉ & làm việc với cơ quan thuế=5.'},
 {id:'sales_exec', label:'B2B Sales Executive', match:['sales executive','business development','b2b sales','bd executive','nhân viên kinh doanh','sales','kinh doanh'],
  block:'Tiêu chí BẮT BUỘC (đủ cả 2): (a) 6 tháng - 2 năm kinh nghiệm sales B2B; (b) kỹ năng tư vấn/thuyết phục và chủ động tìm kiếm khách hàng. Đây là cấp NHÂN VIÊN (executive), không phải quản lý. Trọng số điểm: 6 tháng-2 năm sales B2B=30; tư vấn/thuyết phục/lắng nghe nhu cầu=20; chủ động phát triển khách mới (inbound/outbound)=15; KN marketing/truyền thông/TMĐT/agency=12; am hiểu TikTok Shop/TikTok Ads=10; tư duy kinh doanh & chịu áp lực doanh số=13.'}
];
function khoFindRule(vitri){
  var v=(vitri==null?'':String(vitri)).toLowerCase().trim(); if(!v) return null;
  for(var i=0;i<KHO_RULES.length;i++){ var m=KHO_RULES[i].match; for(var j=0;j<m.length;j++){ if(v.indexOf(m[j])>=0) return KHO_RULES[i]; } }
  return null;
}

function khoApplyScan(d){
  if(!d) return;
  var sc=d.scan; d.scan_verdict=''; d.scan_percent=null; d.scan_skills=''; d.scan_reason=''; d.scan_pos='';
  if(!sc || !sc.matched_position) return;
  var pct=parseInt(sc.percent,10); if(isNaN(pct)) pct=0;
  var must=(sc.must_met===true||sc.must_met==='true');
  var v=(!must)?'Không đạt':(pct>=KHO_SCAN_PASS?'Pass':(pct>=40?'Cân nhắc':'Không đạt'));
  d.scan_pos=sc.matched_position; d.scan_verdict=v; d.scan_percent=pct; d.scan_skills=sc.skills_summary||''; d.scan_reason=sc.reason||'';
}
function khoScanBadge(c){
  var v=(c['Scan HR']||'').trim(); if(!v) return '';
  var pv=c['% phù hợp']; var pct=(pv!=null&&String(pv).trim()!=='')?(' '+(parseInt(pv,10)||0)+'%'):'';
  var reason=khoEsc((c['Lý do']||'').trim()); var lv=v.toLowerCase(); var bg,fg,ic,txt;
  if(lv.indexOf('pass')>=0){bg='#dcfce7';fg='#15803d';ic='ti-circle-check';txt='Scan HR Pass';}
  else if(lv.indexOf('cân nhắc')>=0||lv.indexOf('can nhac')>=0){bg='#fef3c7';fg='#b45309';ic='ti-help-circle';txt='Cân nhắc';}
  else {bg='#f1f5f9';fg='#64748b';ic='ti-circle-x';txt='Không đạt';}
  return '<span title="'+reason+'" style="font-size:9px;font-weight:600;padding:2px 8px;border-radius:20px;background:'+bg+';color:'+fg+';display:inline-flex;align-items:center;gap:3px;margin-top:3px;white-space:nowrap;"><i class="ti '+ic+'" style="font-size:11px;"></i>'+txt+pct+'</span>';
}
function khoScanPreview(d){
  if(!d||!d.scan_verdict) return '';
  var v=d.scan_verdict, pct=(d.scan_percent!=null?d.scan_percent+'%':''), lv=v.toLowerCase(), bg,fg,ic;
  if(lv.indexOf('pass')>=0){bg='#f0fdf4';fg='#15803d';ic='ti-circle-check';}
  else if(lv.indexOf('cân nhắc')>=0){bg='#fffbeb';fg='#b45309';ic='ti-help-circle';}
  else {bg='#f8fafc';fg='#64748b';ic='ti-circle-x';}
  return '<div style="margin-top:10px;padding:10px 12px;border-radius:8px;background:'+bg+';">'+
    '<div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:'+fg+';"><i class="ti '+ic+'"></i> Scan HR: '+khoEsc(v)+(pct?' · '+pct+' phù hợp':'')+'</div>'+
    (d.scan_skills?'<div style="margin-top:5px;font-size:11px;color:#475569;"><span style="color:#94a3b8;">Kỹ năng: </span>'+khoEsc(d.scan_skills)+'</div>':'')+
    (d.scan_reason?'<div style="margin-top:3px;font-size:11px;color:#475569;"><span style="color:#94a3b8;">Nhận xét: </span>'+khoEsc(d.scan_reason)+'</div>':'')+
  '</div>';
}
var khoR12=['','PASS','FAIL','KHÔNG THAM GIA'];
var khoFIN=['','TRÚNG TUYỂN','FAIL','TỪ CHỐI OFFER'];
function khoSelect(stt,field,cur,opts){
  cur=(cur==null?'':String(cur)).trim();
  if(stt==null||String(stt).trim()===''){ return '<span style="font-size:11px;color:#94a3b8;">'+(cur?khoEsc(cur):'—')+'</span>'; }
  var has=opts.indexOf(cur)>=0, list=has?opts:[cur].concat(opts);
  var svg='<select data-prev="'+khoEsc(cur)+'" onchange="khoUpdateResult(this,\''+String(stt)+'\',\''+field+'\')" style="font-size:11px;padding:3px 5px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;max-width:120px;color:#334155;">';
  for(var i=0;i<list.length;i++){ var o=list[i], lbl=(o===''?'—':o); svg+='<option value="'+khoEsc(o)+'"'+(o===cur?' selected':'')+'>'+khoEsc(lbl)+'</option>'; }
  return svg+'</select>';
}
function khoDateInput(stt,cur){
  cur=(cur==null?'':String(cur)).trim();
  if(stt==null||String(stt).trim()==='') return '<span style="font-size:11px;color:#94a3b8;">'+(cur?khoEsc(cur):'—')+'</span>';
  return '<input type="text" value="'+khoEsc(cur)+'" data-prev="'+khoEsc(cur)+'" placeholder="dd/mm/yyyy" onchange="khoUpdateResult(this,\''+String(stt)+'\',\'nhanviec\')" style="font-size:11px;padding:3px 6px;border:1px solid #e2e8f0;border-radius:6px;width:94px;color:#334155;">';
}
function khoTextInput(stt,field,cur,ph,w){
  cur=(cur==null?'':String(cur)).trim();
  if(stt==null||String(stt).trim()==='') return '<span style="font-size:11px;color:#94a3b8;">'+(cur?khoEsc(cur):'—')+'</span>';
  return '<input type="text" value="'+khoEsc(cur)+'" data-prev="'+khoEsc(cur)+'" placeholder="'+ph+'" onchange="khoUpdateResult(this,\''+String(stt)+'\',\''+field+'\')" style="font-size:11px;padding:3px 6px;border:1px solid #e2e8f0;border-radius:6px;width:'+w+'px;color:#334155;">';
}
async function khoUpdateResult(el,stt,field){
  var val=el.value, old=el.getAttribute('data-prev')||'';
  el.disabled=true; el.style.borderColor='#c4b5fd';
  var payload={action:'update',stt:String(stt)}; payload[field]=val;
  try{
    var r=await fetch(KHO_WRITE_API,{ method:'POST', body:JSON.stringify(payload) });
    var t=await r.text(); var j={}; try{ j=JSON.parse(t); }catch(_){}
    if(j&&j.ok){
      var recs=(rawData&&rawData.cvs)||[];
      for(var i=0;i<recs.length;i++){ if(String(recs[i]['3'])===String(stt)){ if(field==='r1')recs[i]['KET QUA R1']=val; else if(field==='r2')recs[i]['KET QUA R2']=val; else if(field==='final')recs[i]['FINAL']=val; else if(field==='nhanviec')recs[i]['NGÀY NHẬN VIỆC']=val; else if(field==='sdt')recs[i]['SĐT']=val; else if(field==='mail')recs[i]['MAIL']=val; break; } }
      try{ localStorage.setItem(CACHE_KEY,JSON.stringify(rawData)); }catch(_){}
      el.style.borderColor='#22c55e'; el.setAttribute('data-prev',val); el.title='Đã lưu';
    } else { el.value=old; el.style.borderColor='#ef4444'; el.title='Lỗi: '+((j&&j.error)||''); }
  }catch(e){ el.value=old; el.style.borderColor='#ef4444'; el.title='Lỗi: '+(e&&e.message); }
  el.disabled=false;
}
function khoWarnings(c){
  var w=[];
  var pv=khoParse(c['NGAY LICH PV']);
  var r1=(c['KET QUA R1']||'').trim().toUpperCase();
  var r2=(c['KET QUA R2']||'').trim().toUpperCase();
  var fin=(c['FINAL']||'').trim();
  var today=new Date(); today.setHours(0,0,0,0);
  if(pv && pv.getTime()<=today.getTime() && !r1) w.push('Đã PV, chưa tick R1');
  if(r1==='PASS' && !r2) w.push('Chờ tick R2');
  if(r2==='PASS' && !fin) w.push('Chờ chốt Final');
  if(fin==='TRÚNG TUYỂN' && !((c['NGÀY NHẬN VIỆC']||'').trim())) w.push('Thiếu ngày nhận việc');
  return w;
}
function khoWarnCell(c){
  var w=khoWarnings(c);
  if(!w.length) return '<span style="font-size:11px;color:#cbd5e1;">—</span>';
  return w.map(function(x){ return '<span style="font-size:9px;font-weight:500;padding:2px 7px;border-radius:20px;background:#fef2f2;color:#b91c1c;white-space:nowrap;display:inline-block;margin:1px;">'+khoEsc(x)+'</span>'; }).join(' ');
}
function khoSortRecent(a,b){
  var da=khoParse(a['NGAY']), db=khoParse(b['NGAY']);
  var ta=da?da.getTime():-1, tb=db?db.getTime():-1;
  if(tb!==ta) return tb-ta;
  return (parseInt(b['3'],10)||0)-(parseInt(a['3'],10)||0);
}
function khoFilteredCVs(){
  var cvs=(rawData&&rawData.cvs)||[];
  var q=(khoState.q||'').trim().toLowerCase();
  return cvs.filter(function(c){
    if(khoState.pos && (c['VI TRI']||'').trim()!==khoState.pos) return false;
    if(khoState.status){ if(khoState.status==='warn'){ if(khoWarnings(c).length===0) return false; } else if(khoState.status==='scanpass'){ if((c['Scan HR']||'').toLowerCase().indexOf('pass')<0) return false; } else if(khoDerive(c).k!==khoState.status) return false; }
    if(q){
      var hay=((c['HO VA TEN']||'')+' '+(c['MAIL']||'')+' '+(c['VI TRI']||'')).toLowerCase();
      if(hay.indexOf(q)<0) return false;
    }
    return true;
  }).sort(khoSortRecent);
}
function khoRenderRows(){
  var all=khoFilteredCVs();
  var total=all.length, size=30, pages=Math.max(1,Math.ceil(total/size));
  if(khoState.page>=pages) khoState.page=pages-1; if(khoState.page<0) khoState.page=0;
  var start=khoState.page*size, rows=all.slice(start,start+size);
  var cnt=document.getElementById('kho-count'); if(cnt) cnt.textContent=total+' hồ sơ';
  var pg=document.getElementById('kho-pager');
  if(pg){
    if(total<=size){ pg.innerHTML=''; }
    else {
      var from=total?start+1:0, to=Math.min(start+size,total);
      var prevC=(khoState.page<=0?'#cbd5e1':'#5b21b6'), nextC=(khoState.page>=pages-1?'#cbd5e1':'#5b21b6');
      pg.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 4px;flex-wrap:wrap;gap:8px;">'+
        '<span style="font-size:11px;color:#94a3b8;">Hiện '+from+'–'+to+' / '+total+' hồ sơ</span>'+
        '<div style="display:flex;align-items:center;gap:8px;">'+
          '<span onclick="khoGoPage('+(khoState.page-1)+')" style="cursor:pointer;font-size:11px;padding:5px 12px;border-radius:6px;border:1px solid #e2e8f0;color:'+prevC+';">← Trước</span>'+
          '<span style="font-size:11px;color:#334155;">Trang '+(khoState.page+1)+' / '+pages+'</span>'+
          '<span onclick="khoGoPage('+(khoState.page+1)+')" style="cursor:pointer;font-size:11px;padding:5px 12px;border-radius:6px;border:1px solid #e2e8f0;color:'+nextC+';">Sau →</span>'+
        '</div></div>';
    }
  }
  var tb=document.getElementById('kho-tbody'); if(!tb) return;
  if(!rows.length){ tb.innerHTML='<tr><td colspan="10" style="padding:22px;text-align:center;color:#94a3b8;font-size:12px;">Không có CV phù hợp</td></tr>'; return; }
  tb.innerHTML=rows.map(function(c){
    var name=khoEsc(c['HO VA TEN']||'—');
    var stt=c['3'];
    var mail=(c['MAIL']||'').trim();
    var parts=(c['HO VA TEN']||'?').trim().split(/\s+/);
    var init=parts.slice(-2).map(function(w){return (w&&w[0])?w[0]:'';}).join('').toUpperCase();
    var cvlink=(c['CV']||'').trim();
    var cvcell=/^https?:\/\//.test(cvlink)?('<a href="'+khoEsc(cvlink)+'" target="_blank" rel="noopener" style="color:#5b21b6;"><i class="ti ti-external-link" style="font-size:14px;"></i></a>'):'<span style="color:#cbd5e1;">—</span>';
    var mailcell=khoTextInput(stt,'mail',mail,'+ email','160');
    return '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;"><div style="display:flex;align-items:center;gap:8px;"><span style="width:26px;height:26px;border-radius:6px;background:#ede9fe;color:#5b21b6;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex-shrink:0;">'+khoEsc(init||'?')+'</span><div style="min-width:0;"><div style="font-size:11.5px;color:#1e293b;">'+name+'</div>'+khoScanBadge(c)+'<div style="font-size:10px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:170px;">'+mailcell+'</div></div></div></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;color:#475569;">'+khoEsc(c['VI TRI']||'—')+'</td>'+
      '<td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;">'+khoTextInput(stt,'sdt',c['SĐT'],'SĐT','104')+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;color:#64748b;white-space:nowrap;">'+khoEsc(c['NGAY']||'—')+'</td>'+
      '<td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:center;">'+khoSelect(stt,'r1',c['KET QUA R1'],khoR12)+'</td>'+
      '<td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:center;">'+khoSelect(stt,'r2',c['KET QUA R2'],khoR12)+'</td>'+
      '<td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;">'+khoSelect(stt,'final',c['FINAL'],khoFIN)+'</td>'+
      '<td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;">'+khoDateInput(stt,c['NGÀY NHẬN VIỆC'])+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;text-align:center;">'+cvcell+'</td>'+
      '<td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;">'+khoWarnCell(c)+'</td>'+
    '</tr>';
  }).join('');
}
function khoStat(lbl,val,color){
  return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:11px 14px;"><div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px;">'+lbl+'</div><div style="font-size:22px;font-weight:600;line-height:1;color:'+color+';">'+val+'</div></div>';
}
var khoExtracted=[];
var KHO_WRITE_API='https://script.google.com/macros/s/AKfycbyNSR08nM0f5pDqEB2Qgyq3VNo9wyfvzMCn3EuADDRXTI4BUVqSOoTeVCFERMWIX0S00Q/exec';
var KHO_SHEET_URL='https://docs.google.com/spreadsheets/d/1j2n6uvUcPW1RXp41RSoabS1QhKII88vrGR0njrGm7Uk/edit';
function khoToday(){ var d=new Date(); function p(n){return (n<10?'0':'')+n;} return p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear(); }
function khoParseFilename(name){
  var base=String(name||'').replace(/\.[^.]+$/,'');
  var parts=base.split(' - ');
  if(parts.length<3) return null;
  var ten=(parts[0]||'').trim();
  var vitri=(parts[1]||'').trim();
  var dpart=(parts[parts.length-1]||'').trim();
  var m=dpart.match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{2,4})$/);
  var ngay='';
  if(m){ var dd=('0'+m[1]).slice(-2), mm=('0'+m[2]).slice(-2), yy=(m[3].length===2?('20'+m[3]):m[3]); ngay=dd+'/'+mm+'/'+yy; }
  if(!ten||!vitri) return null;
  return { ho_ten:ten, vi_tri:vitri, ngay:ngay };
}
function khoNorm(x){ return String(x==null?'':x).toLowerCase().replace(/\s+/g,' ').trim(); }
function khoNormPhone(x){ return String(x==null?'':x).replace(/[^0-9]/g,'').replace(/^84/,'0'); }
function khoFindDuplicate(d){
  var cvs=(rawData&&rawData.cvs)||[];
  var em=khoNorm(d.email), ph=khoNormPhone(d.sdt), nm=khoNorm(d.ho_ten), vt=khoNorm(d.vi_tri);
  var i;
  if(em){ for(i=0;i<cvs.length;i++){ if(khoNorm(cvs[i]['MAIL'])===em) return cvs[i]; } }
  if(ph && ph.length>=8){ for(i=0;i<cvs.length;i++){ if(khoNormPhone(cvs[i]['SĐT'])===ph) return cvs[i]; } }
  if(nm && vt){ for(i=0;i<cvs.length;i++){ if(khoNorm(cvs[i]['HO VA TEN'])===nm && khoNorm(cvs[i]['VI TRI'])===vt) return cvs[i]; } }
  return null;
}
async function khoSaveToKho(i){
  var it=khoExtracted[i]; if(!it||!it.data||it.saved||it.saving) return;
  it.saving=true; it.saveErr=''; khoRenderExtractList();
  var d=it.data;
  var pct=(d.scan_verdict?(d.scan_percent!=null?d.scan_percent:''):'');
  var dup=khoFindDuplicate(d);
  try{
    if(dup){
      var up={ action:'update', stt:String(dup['3']), skills:d.scan_skills||'', scan:d.scan_verdict||'', percent:pct, reason:d.scan_reason||'' };
      if(!((dup['MAIL']||'').trim()) && d.email) up.mail=d.email;
      if(!((dup['SĐT']||'').trim()) && d.sdt) up.sdt=d.sdt;
      var ru=await fetch(KHO_WRITE_API,{ method:'POST', body:JSON.stringify(up) });
      var tu=await ru.text(); var ju={}; try{ ju=JSON.parse(tu); }catch(_){}
      if(ju && ju.ok){
        it.saving=false; it.saved=true; it.updated=true; it.stt=dup['3'];
        dup['Tóm tắt kỹ năng']=d.scan_skills||''; dup['Scan HR']=d.scan_verdict||''; dup['% phù hợp']=(d.scan_verdict&&d.scan_percent!=null?String(d.scan_percent):''); dup['Lý do']=d.scan_reason||'';
        if(up.mail) dup['MAIL']=d.email; if(up.sdt) dup['SĐT']=d.sdt;
        try{ localStorage.setItem(CACHE_KEY, JSON.stringify(rawData)); }catch(_){}
        renderKhoCV();
      } else { it.saving=false; it.saveErr='Cập nhật lỗi: '+((ju&&ju.error)||(tu||'').slice(0,80)); khoRenderExtractList(); }
      return;
    }
    var payload={ ho_ten:d.ho_ten||'', gioi_tinh:d.gioi_tinh||'', email:d.email||'', sdt:d.sdt||'', vi_tri:d.vi_tri||'', cv:d.cv||'', portfolio:d.portfolio||'', ngay:d.ngay||'', skills:d.scan_skills||'', scan:d.scan_verdict||'', percent:pct, reason:d.scan_reason||'' };
    var r=await fetch(KHO_WRITE_API,{ method:'POST', body:JSON.stringify(payload) });
    var t=await r.text(); var j={}; try{ j=JSON.parse(t); }catch(_){}
    if(j && j.ok){
      it.saving=false; it.saved=true; it.stt=j.stt;
      var rec={ '3':j.stt, 'SĐT':d.sdt||'', 'NGAY':d.ngay||khoToday(), 'VI TRI':d.vi_tri||'', 'MAIL':d.email||'', 'HO VA TEN':d.ho_ten||'', 'GIOI TINH':d.gioi_tinh||'', 'CV':d.cv||'', 'HR REVIEW CV':'', 'LINE MANAGER REVIEW':'', 'NGAY LICH PV':'', 'KET QUA R1':'', 'KET QUA R2':'', 'FINAL':'', 'NGÀY NHẬN VIỆC':'', 'Tóm tắt kỹ năng':d.scan_skills||'', 'Scan HR':d.scan_verdict||'', '% phù hợp':(d.scan_verdict&&d.scan_percent!=null?String(d.scan_percent):''), 'Lý do':d.scan_reason||'' };
      if(rawData && rawData.cvs){ rawData.cvs.push(rec); try{ localStorage.setItem(CACHE_KEY, JSON.stringify(rawData)); }catch(_){} }
      renderKhoCV();
    } else { it.saving=false; it.saveErr='Ghi lỗi: '+((j&&j.error)||(t||'').slice(0,80)); khoRenderExtractList(); }
  }catch(e){ it.saving=false; it.saveErr=(e&&e.message)||'Lỗi kết nối'; khoRenderExtractList(); }
}
function khoSaveFooter(it,i){
  if(it.saved) return '<div style="margin-top:10px;font-size:12px;color:#15803d;"><i class="ti ti-circle-check" style="vertical-align:-2px;"></i> '+(it.updated?'Đã cập nhật hồ sơ có sẵn':'Đã lưu vào kho')+(it.stt?' (STT '+it.stt+')':'')+' — đã ghi xuống Sheet</div>';
  if(it.saving) return '<div style="margin-top:10px;font-size:12px;color:#64748b;"><i class="ti ti-loader" style="vertical-align:-2px;"></i> Đang lưu...</div>';
  var err=it.saveErr?'<div style="margin-top:6px;font-size:11px;color:#b91c1c;">'+khoEsc(it.saveErr)+'</div>':'';
  return '<div style="margin-top:10px;"><span onclick="khoSaveToKho('+i+')" style="cursor:pointer;font-size:12px;padding:6px 14px;border-radius:8px;background:#5b21b6;color:#fff;"><i class="ti ti-download" style="vertical-align:-2px;"></i> Lưu vào kho</span></div>'+err;
}
function khoGetKey(){ try{ return localStorage.getItem('bigx_gemini_key')||''; }catch(_){ return ''; } }
function khoSaveKey(){ var el=document.getElementById('kho-key-input'); if(el){ var v=el.value.trim(); if(v){ try{ localStorage.setItem('bigx_gemini_key',v); }catch(_){}}} khoState._keybar=false; renderKhoCV(); }
function khoClearKey(){ try{ localStorage.removeItem('bigx_gemini_key'); }catch(_){} renderKhoCV(); }
function khoToggleKeyBar(){ khoState._keybar=!khoState._keybar; renderKhoCV(); }
function khoTriggerFile(){ var f=document.getElementById('kho-file'); if(f) f.click(); }
function khoFileToB64(file){ return new Promise(function(res,rej){ var fr=new FileReader(); fr.onload=function(){ var s=String(fr.result||''); var i=s.indexOf(','); res(i>=0?s.substring(i+1):s); }; fr.onerror=function(){ rej(new Error('Không đọc được file')); }; fr.readAsDataURL(file); }); }
async function khoCallGemini(b64,key,mime){
  var url='https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key='+encodeURIComponent(key);
  var cat='';
  for(var i=0;i<KHO_RULES.length;i++){ var R=KHO_RULES[i]; cat+=' '+(i+1)+') matched_position="'+R.label+'" — khớp khi vị trí ứng tuyển liên quan: '+R.match.join(', ')+'. '+R.block; }
  var prompt='Bạn là trợ lý HR của BigX. Đọc kỹ CV và trả về DUY NHẤT một JSON object (không markdown, không giải thích) với các khóa: ho_ten, gioi_tinh, email, sdt, vi_tri, kinh_nghiem, ngay_sinh, scan. Quy tắc trích xuất: gioi_tinh chỉ nhận "Nam" hoặc "Nữ", nếu CV không ghi rõ để "". kinh_nghiem tóm tắt ngắn 1 câu (số năm + vị trí chính). Trường nào không có để "". '
    +'scan là object {matched_position, skills_summary, must_met, percent, reason}. Hãy xác định vị trí ứng tuyển của ứng viên (dựa vào mục tiêu nghề nghiệp, vị trí gần nhất, kỹ năng chính trong CV). Nếu khớp MỘT trong các BỘ TIÊU CHÍ dưới đây thì đặt matched_position = đúng nhãn của bộ đó và chấm theo bộ đó; nếu không khớp bộ nào thì matched_position="", skills_summary="", must_met=false, percent=0, reason="". must_met=false nếu thiếu bất kỳ tiêu chí BẮT BUỘC nào của bộ khớp. percent = tổng trọng số đạt được (0-100, số nguyên). skills_summary: 1-2 câu tóm tắt kỹ năng/kinh nghiệm nổi bật. reason: 1 câu ngắn vì sao đạt hay chưa đạt. BỘ TIÊU CHÍ:'+cat;
  var body={ contents:[{ parts:[ {inline_data:{mime_type:(mime||'application/pdf'),data:b64}}, {text:prompt} ] }], generationConfig:{ temperature:0, responseMimeType:'application/json' } };
  var r=await fetch(url,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  var j=await r.json();
  if(j && j.error) throw new Error(j.error.message||('HTTP '+r.status));
  var cand=(j.candidates||[])[0]||{};
  var parts=((cand.content||{}).parts)||[];
  var txt=parts.map(function(p){return p.text||'';}).join('').trim();
  if(!txt) throw new Error('Gemini không trả nội dung');
  try{ return JSON.parse(txt); }catch(e){ var m=txt.match(/\{[\s\S]*\}/); if(m) return JSON.parse(m[0]); throw new Error('Không đọc được JSON từ AI'); }
}
async function khoHandleFiles(fileList){
  var key=khoGetKey();
  if(!key){ khoState._keybar=true; renderKhoCV(); alert('Chưa cài Gemini key. Anh dán key vào ô rồi bấm Lưu trước.'); return; }
  var files=Array.prototype.slice.call(fileList||[]).filter(function(f){ return /\.(pdf|png|jpe?g|webp|heic|heif)$/i.test(f.name)||f.type==='application/pdf'||/^image\//.test(f.type||''); });
  if(!files.length){ alert('Chỉ nhận file PDF hoặc ảnh (PNG/JPG).'); return; }
  for(var i=0;i<files.length;i++){
    var f=files[i];
    var item={name:f.name,status:'reading',data:null,err:null};
    khoExtracted.unshift(item); khoRenderExtractList();
    try{ var b64=await khoFileToB64(f); var d=await khoCallGemini(b64,key,f.type||'application/pdf'); item.status='done'; item.data=d||{}; var _fn=khoParseFilename(f.name); if(_fn){ if(_fn.ho_ten) item.data.ho_ten=_fn.ho_ten; if(_fn.vi_tri) item.data.vi_tri=_fn.vi_tri; if(_fn.ngay) item.data.ngay=_fn.ngay; item.fromFilename=true; } khoApplyScan(item.data); }
    catch(e){ item.status='error'; item.err=(e&&e.message)||'Lỗi không rõ'; }
    khoRenderExtractList();
  }
}
function khoField(lbl,val,warn){
  var v=(val==null?'':String(val)).trim();
  var body = v ? khoEsc(v) : (warn?'<span style="color:#f59e0b;">'+warn+'</span>':'<span style="color:#cbd5e1;">—</span>');
  return '<div><div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">'+lbl+'</div><div style="font-size:12px;color:#1e293b;word-break:break-word;">'+body+'</div></div>';
}
function khoCopyRow(i){
  var d=(khoExtracted[i]||{}).data||{};
  var row=[d.ho_ten||'',d.gioi_tinh||'',d.email||'',d.sdt||'',d.vi_tri||'',d.kinh_nghiem||''].join('\t');
  try{ navigator.clipboard.writeText(row); }catch(_){}
}
function khoRenderExtractList(){
  var box=document.getElementById('kho-extract-list'); if(!box) return;
  if(!khoExtracted.length){ box.innerHTML=''; return; }
  box.innerHTML=khoExtracted.map(function(it,i){
    if(it.status==='reading') return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;margin-bottom:8px;display:flex;align-items:center;gap:8px;font-size:12px;color:#64748b;"><i class="ti ti-loader" style="color:#5b21b6;"></i> AI đang đọc <b style="font-weight:600;color:#334155;">'+khoEsc(it.name)+'</b>...</div>';
    if(it.status==='error') return '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:12px;color:#b91c1c;"><i class="ti ti-alert-triangle" style="vertical-align:-2px;"></i> Lỗi đọc <b>'+khoEsc(it.name)+'</b>: '+khoEsc(it.err)+'</div>';
    var d=it.data||{};
    return '<div style="background:#fff;border:1px solid #c4b5fd;border-radius:10px;padding:12px 14px;margin-bottom:8px;">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><span style="font-size:10px;font-weight:500;padding:2px 8px;border-radius:20px;background:#f0fdf4;color:#15803d;"><i class="ti ti-sparkles" style="vertical-align:-2px;"></i> AI đã đọc</span><span style="font-size:11px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+khoEsc(it.name)+'</span><span onclick="khoCopyRow('+i+')" style="margin-left:auto;cursor:pointer;font-size:10px;padding:3px 10px;border-radius:20px;border:1px solid #e2e8f0;color:#5b21b6;"><i class="ti ti-copy" style="vertical-align:-2px;"></i> Sao chép dòng</span></div>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">'+
        khoField('Họ và tên',d.ho_ten,'thiếu')+
        khoField('Giới tính',d.gioi_tinh,'CV không ghi')+
        khoField('Email',d.email,'thiếu')+
        khoField('Số điện thoại',d.sdt,'thiếu')+
        khoField('Vị trí',d.vi_tri,'')+
        khoField('Ngày nhận CV',d.ngay,'')+
        khoField('Ngày sinh',d.ngay_sinh,'')+
      '</div>'+
      (d.kinh_nghiem?'<div style="margin-top:8px;font-size:11.5px;color:#475569;"><span style="color:#94a3b8;">Kinh nghiệm: </span>'+khoEsc(d.kinh_nghiem)+'</div>':'')+
      (it.fromFilename?'<div style="margin-top:6px;font-size:10px;color:#7e22ce;"><i class="ti ti-file-text" style="vertical-align:-2px;"></i> Tên / Vị trí / Ngày lấy từ tên file</div>':'')+
      khoScanPreview(it.data)+
      khoSaveFooter(it,i)+
    '</div>';
  }).join('');
}
function khoPanelHTML(){
  var hasKey=!!khoGetKey();
  var keyBar;
  if(khoState._keybar){
    keyBar='<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:8px;"><input id="kho-key-input" type="password" placeholder="Dán Gemini API key vào đây" style="flex:1;min-width:200px;border:1px solid #e2e8f0;border-radius:8px;padding:6px 10px;font-size:12px;font-family:inherit;"><span onclick="khoSaveKey()" style="cursor:pointer;font-size:11px;padding:6px 14px;border-radius:8px;background:#5b21b6;color:#fff;">Lưu</span><span onclick="khoToggleKeyBar()" style="cursor:pointer;font-size:11px;padding:6px 12px;border-radius:8px;border:1px solid #e2e8f0;color:#64748b;">Huỷ</span></div><div style="font-size:10px;color:#94a3b8;margin-top:5px;">Key lưu trong trình duyệt của anh, không gửi đi đâu ngoài Google.</div>';
  } else {
    keyBar='<div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:11px;">'+(hasKey?'<span style="color:#15803d;"><i class="ti ti-circle-check" style="vertical-align:-2px;"></i> Đã cài Gemini key</span><span onclick="khoToggleKeyBar()" style="cursor:pointer;color:#5b21b6;">Đổi key</span><span onclick="khoClearKey()" style="cursor:pointer;color:#94a3b8;">Xoá</span>':'<span style="color:#c2410c;"><i class="ti ti-alert-triangle" style="vertical-align:-2px;"></i> Chưa cài Gemini key</span><span onclick="khoToggleKeyBar()" style="cursor:pointer;color:#5b21b6;font-weight:500;">Nhập key</span>')+'</div>';
  }
  return '<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:14px 16px;margin-bottom:14px;">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><i class="ti ti-sparkles" style="font-size:16px;color:#7e22ce;"></i><span style="font-size:13px;font-weight:600;color:#1e293b;">Thêm CV bằng AI</span></div>'+
    '<input type="file" id="kho-file" accept="application/pdf,image/*" multiple style="display:none" onchange="khoHandleFiles(this.files)">'+
    '<div onclick="khoTriggerFile()" ondragover="event.preventDefault();this.style.borderColor=&quot;#7e22ce&quot;" ondragleave="this.style.borderColor=&quot;#c4b5fd&quot;" ondrop="event.preventDefault();this.style.borderColor=&quot;#c4b5fd&quot;;khoHandleFiles(event.dataTransfer.files)" style="cursor:pointer;border:1.5px dashed #c4b5fd;border-radius:10px;padding:16px;text-align:center;background:#fff;margin-top:8px;">'+
      '<i class="ti ti-cloud-upload" style="font-size:26px;color:#7e22ce;"></i>'+
      '<div style="font-size:13px;font-weight:500;color:#1e293b;margin-top:4px;">Kéo thả CV (PDF hoặc ảnh) vào đây hoặc bấm để chọn</div>'+
      '<div style="font-size:11px;color:#94a3b8;margin-top:2px;">Thả nhiều file cùng lúc · AI tự bóc tên, email, SĐT, vị trí, kinh nghiệm</div>'+
    '</div>'+
    keyBar+
    '<div id="kho-extract-list" style="margin-top:10px;"></div>'+
  '</div>';
}
function renderKhoCV(){
  var cvs=(rawData&&rawData.cvs)||[];
  if(!cvs.length){ document.getElementById('content').innerHTML='<div class="loading"><i class="ti ti-loader"></i>Đang tải dữ liệu...</div>'; return; }
  var total=cvs.length;
  var hired=0, waiting=0, scanPass=0;
  var warn=0;
  cvs.forEach(function(c){ var k=khoDerive(c).k; if(k==='hired') hired++; else if(k==='waiting') waiting++; if(khoWarnings(c).length>0) warn++; if((c['Scan HR']||'').toLowerCase().indexOf('pass')>=0) scanPass++; });
  var posSet={}; cvs.forEach(function(c){var v=(c['VI TRI']||'').trim(); if(v) posSet[v]=(posSet[v]||0)+1;});
  var posNames=Object.keys(posSet).sort(function(a,b){return posSet[b]-posSet[a];});
  window._khoPos=posNames;
  var posChips='<span onclick="khoSetPos(-1)" style="cursor:pointer;font-size:10px;padding:4px 11px;border-radius:20px;border:1px solid '+(khoState.pos===''?'#5b21b6':'#e2e8f0')+';background:'+(khoState.pos===''?'#ede9fe':'#fff')+';color:'+(khoState.pos===''?'#5b21b6':'#64748b')+';">Tất cả vị trí</span>';
  posNames.forEach(function(p,i){ posChips+='<span onclick="khoSetPos('+i+')" style="cursor:pointer;font-size:10px;padding:4px 11px;border-radius:20px;border:1px solid '+(khoState.pos===p?'#5b21b6':'#e2e8f0')+';background:'+(khoState.pos===p?'#ede9fe':'#fff')+';color:'+(khoState.pos===p?'#5b21b6':'#64748b')+';">'+khoEsc(p)+' ('+posSet[p]+')</span>'; });
  var stChip=function(v,lbl){ return '<span onclick="khoSetStatus(\''+v+'\')" style="cursor:pointer;font-size:10px;padding:4px 11px;border-radius:20px;border:1px solid '+(khoState.status===v?'#5b21b6':'#e2e8f0')+';background:'+(khoState.status===v?'#ede9fe':'#fff')+';color:'+(khoState.status===v?'#5b21b6':'#64748b')+';">'+lbl+'</span>'; };
  var html=''+
    khoPanelHTML()+
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:14px;">'+
      khoStat('Tổng CV', total, '#1e293b')+
      khoStat('Scan HR Pass', scanPass, '#15803d')+
      khoStat('Trúng tuyển', hired, '#16a34a')+
      khoStat('Đang đợi KQ', waiting, '#c2410c')+
      khoStat('Cần cảnh báo', warn, '#b91c1c')+
      khoStat('Số vị trí', posNames.length, '#5b21b6')+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">'+
      '<div style="flex:1;min-width:180px;display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:7px 11px;"><i class="ti ti-search" style="font-size:14px;color:#94a3b8;"></i><input id="kho-search" oninput="khoState.q=this.value;khoState.page=0;khoRenderRows()" value="'+khoEsc(khoState.q)+'" placeholder="Tìm theo tên, email, vị trí" style="border:none;outline:none;background:none;font-size:12px;color:#334155;flex:1;font-family:inherit;"></div>'+
      stChip('scanpass','✓ Scan Pass')+stChip('warn','⚠ Cảnh báo')+stChip('hired','Trúng tuyển')+stChip('waiting','Đang đợi KQ')+stChip('rejected','Trượt / Từ chối')+stChip('processing','Chưa xử lý')+
    '</div>'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">'+posChips+'</div>'+
    '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">'+
      '<div style="padding:9px 14px;border-bottom:1px solid #f1f5f9;background:#fafafa;display:flex;align-items:center;justify-content:space-between;"><span style="font-size:11px;font-weight:600;color:#334155;display:flex;align-items:center;gap:7px;"><i class="ti ti-folder" style="font-size:14px;color:#5b21b6;"></i>Kho CV</span><span style="display:flex;align-items:center;gap:12px;"><a href="'+KHO_SHEET_URL+'" target="_blank" rel="noopener" style="font-size:11px;color:#0f766e;text-decoration:none;font-weight:500;display:inline-flex;align-items:center;gap:4px;"><i class="ti ti-table" style="font-size:14px;"></i> Mở Google Sheet <i class="ti ti-external-link" style="font-size:12px;"></i></a><span id="kho-count" style="font-size:10px;padding:2px 9px;border-radius:20px;background:#ede9fe;color:#5b21b6;font-weight:500;">'+total+' hồ sơ</span></span></div>'+
      '<div style="overflow-x:auto;"><table style="width:100%;min-width:640px;border-collapse:collapse;">'+
        '<thead><tr style="background:#fff;">'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:1px solid #f1f5f9;">Ứng viên</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:1px solid #f1f5f9;">Vị trí</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:1px solid #f1f5f9;">SĐT</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:1px solid #f1f5f9;">Ngày nộp</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:center;border-bottom:1px solid #f1f5f9;">R1</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:center;border-bottom:1px solid #f1f5f9;">R2</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:1px solid #f1f5f9;">Kết quả</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:1px solid #f1f5f9;">Nhận việc</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:center;border-bottom:1px solid #f1f5f9;">CV</th>'+
          '<th style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:1px solid #f1f5f9;">Cảnh báo</th>'+
        '</tr></thead><tbody id="kho-tbody"></tbody></table></div>'+
    '</div>'+
    '<div id="kho-pager"></div>'+
    '<div style="font-size:10px;color:#94a3b8;margin-top:8px;">Kết quả tự suy: đã qua ngày PV mà chưa có kết quả = Trượt · chưa tới ngày PV = Đang đợi. R1/R2: <i class="ti ti-circle-check" style="color:#22c55e;font-size:12px;vertical-align:-2px;"></i> pass · <i class="ti ti-circle-x" style="color:#ef4444;font-size:12px;vertical-align:-2px;"></i> fail · <i class="ti ti-minus" style="color:#cbd5e1;font-size:12px;vertical-align:-2px;"></i> chưa có. Chỉ đọc — dữ liệu từ Sheet.</div>';
  document.getElementById('content').innerHTML=html;
  khoRenderRows();
  khoRenderExtractList();
}
async function loadKhoCV(){
  if(rawData){ renderKhoCV(); return; }
  try{ var c=localStorage.getItem(CACHE_KEY); if(c){ rawData=JSON.parse(c); renderKhoCV(); } }catch(_){}
  if(!rawData){ document.getElementById('content').innerHTML='<div class="loading"><i class="ti ti-loader"></i>Đang tải dữ liệu...</div>'; }
  try{ var r=await fetch(API); rawData=await r.json(); localStorage.setItem(CACHE_KEY,JSON.stringify(rawData)); if(_khoActive()) renderKhoCV(); }
  catch(e){ if(!rawData){ document.getElementById('content').innerHTML='<div class="error-msg"><i class="ti ti-wifi-off"></i>Lỗi kết nối API</div>'; } }
}


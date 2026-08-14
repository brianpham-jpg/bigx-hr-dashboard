function hsPD(s){ if(!s) return null; const p=String(s).trim().split('/'); if(p.length<3) return null; const d=new Date(+p[2],+p[1]-1,+p[0]); return isNaN(d)?null:d; }
function hsAge(s){ const d=hsPD(s); if(!d) return null; const n=new Date(); let a=n.getFullYear()-d.getFullYear(); if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate())) a--; return a; }
function hsActive(e){ return !/ngh/i.test(e.tt||''); }
function hsTenM(vao,nghi){ const a=hsPD(vao); if(!a) return null; const b=nghi?hsPD(nghi):new Date(); if(!b) return null; return (b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth()); }
function hsTenText(m){ if(m==null) return '—'; const y=Math.floor(m/12), mo=m%12; return (y?y+' năm ':'')+(mo?mo+' tháng':(y?'':'0 tháng')); }
function hsDC(pb){ const m={'GIÁM ĐỐC':['#eeedfe','#5b21b6'],'KINH DOANH':['#e6f1fb','#185fa5'],'SALE':['#e6f1fb','#185fa5'],'MARKETING':['#ede9fe','#5b21b6'],'KẾ TOÁN':['#faeeda','#854f0b'],'NHÂN SỰ':['#e1f5ee','#0f6e56'],'ACCOUNT':['#faece7','#993c1d'],'BOOKING':['#fbeaf0','#993556'],'AGENCY':['#ede9fe','#5b21b6'],'EDIT':['#e1f5ee','#0f6e56'],'CONTENT':['#eaf3de','#3b6d11'],'TSP':['#fbeaf0','#993556'],'AM':['#faeeda','#854f0b'],'CREATIVE':['#eaf3de','#3b6d11'],'ECOM':['#e6f1fb','#0c447c']}; return m[String(pb||'').toUpperCase()]||['#f1f5f9','#475569']; }
function hsInit(t){ const w=String(t||'').trim().split(/\s+/); return (((w[w.length-2]||w[0]||'?')[0]||'')+((w[w.length-1]||'')[0]||'')).toUpperCase(); }
function hsPhoto(e){ return (e&&e.anh)||(window.__PHOTOS&&window.__PHOTOS[((e&&e.ten)||'').trim()])||''; }
function hsImg(e,px){ const c=hsDC(e.pb); const _a=hsPhoto(e); if(_a) return '<img src="'+_a+'" style="width:'+px+'px;height:'+px+'px;border-radius:50%;object-fit:cover;flex:none;">'; return '<span style="width:'+px+'px;height:'+px+'px;border-radius:50%;background:'+c[0]+';color:'+c[1]+';display:flex;align-items:center;justify-content:center;font-weight:600;font-size:'+Math.round(px*0.36)+'px;flex:none;">'+hsInit(e.ten)+'</span>'; }
function hsOpen(i){ hsSel=i; hsView='detail'; renderHoSo(); }
function hsBack(){ hsView='list'; hsSel=null; renderHoSo(); }
function hsSetDept(d){ hsDept=d; renderHoSo(); }
function hsSetStatus(s){ hsStatus=s; renderHoSo(); }
function hsBarRow(lbl,val,mx,col,wl){ const w=mx>0?Math.round(val/mx*100):0; return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:6px;"><span style="width:'+wl+'px;">'+lbl+'</span><div style="flex:1;height:8px;background:#f1f5f9;border-radius:20px;"><div style="width:'+w+'%;height:8px;background:'+col+';border-radius:20px;"></div></div><span style="width:26px;text-align:right;">'+val+'</span></div>'; }

function hsTrend(){
  const now=new Date(), cols=[];
  for(let k=5;k>=0;k--){ const dt=new Date(now.getFullYear(),now.getMonth()-k,1); cols.push({y:dt.getFullYear(),m:dt.getMonth()}); }
  const inM=(s,c)=>{ const d=hsPD(s); return d&&d.getFullYear()===c.y&&d.getMonth()===c.m; };
  const mn=['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  const data=cols.map(c=>{ const hires=HS_DATA.filter(e=>inM(e.vao,c)).length; const leaves=HS_DATA.filter(e=>inM(e.nghi,c)).length; const end=new Date(c.y,c.m+1,0,23,59,59); const hc=HS_DATA.filter(e=>{ const v=hsPD(e.vao); if(!v||v>end) return false; const n=e.nghi?hsPD(e.nghi):null; return !n||n>end; }).length; return {c,hires,leaves,hc}; });
  const mx=Math.max(1,...data.map(d=>Math.max(d.hires,d.leaves)));
  return data.map(d=>'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:10px;color:#5b21b6;font-weight:600;">'+d.hc+'</div><div style="display:flex;gap:3px;align-items:flex-end;height:80px;"><div style="width:12px;height:'+Math.round(d.hires/mx*76)+'px;min-height:2px;background:#1d9e75;border-radius:3px;"></div><div style="width:12px;height:'+Math.round(d.leaves/mx*76)+'px;min-height:2px;background:#d85a30;border-radius:3px;"></div></div><div style="font-size:11px;color:#94a3b8;">'+mn[d.c.m]+'</div></div>').join('');
}
function hsAttrition(){
  const g={}; HS_DATA.forEach(e=>{ const k=e.pb||'Khác'; if(!g[k])g[k]={t:0,l:0}; g[k].t++; if(!hsActive(e))g[k].l++; });
  let arr=Object.entries(g).map(([k,v])=>({k,pct:v.t?Math.round(v.l/v.t*100):0,l:v.l})).filter(o=>o.l>0).sort((a,b)=>b.pct-a.pct).slice(0,5);
  if(!arr.length) return '<div style="font-size:12px;color:#94a3b8;">Chưa có nghỉ việc.</div>';
  const top=arr[0];
  let html=arr.map((o,i)=>'<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:7px;"><span style="width:74px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+o.k+'</span><div style="flex:1;height:8px;background:#faece7;border-radius:20px;"><div style="width:'+o.pct+'%;height:8px;background:'+(i===0?'#d85a30':'#f0997b')+';border-radius:20px;"></div></div><span style="width:36px;text-align:right;'+(i===0?'color:#993c1d;font-weight:600;':'')+'">'+o.pct+'%</span></div>').join('');
  html+='<div style="font-size:11px;color:#993c1d;margin-top:8px;"><i class="ti ti-alert-triangle"></i> Cao nhất: '+top.k+' ('+top.pct+'%) · mẫu nhỏ, tham khảo</div>';
  return html;
}

/* ===== TAB HỒ SƠ — BẢNG 46 CỘT (thay danh sách phẳng) ===== */
var hsGF={}; /* bộ lọc cột: colIndex -> Set(giá trị cho phép) */
function hsGStyle(){ if(document.getElementById('hsGridCss'))return; var s=document.createElement('style'); s.id='hsGridCss';
  s.textContent=[
  '.hsg-wrap{overflow:auto;max-height:70vh;border:0.5px solid #e2e8f0;border-radius:10px;}',
  '.hsg{border-collapse:separate;border-spacing:0;font-size:11.5px;white-space:nowrap;}',
  '.hsg th,.hsg td{border-right:0.5px solid #eef2f7;border-bottom:0.5px solid #eef2f7;padding:6px 9px;text-align:center;}',
  '.hsg td.l,.hsg th.l{text-align:left;}',
  '.hsg tr.gr th{color:#fff;font-weight:600;position:sticky;top:0;z-index:6;padding:7px 8px;}',
  '.hsg tr.ch th{position:sticky;top:30px;z-index:5;font-weight:600;background:#f8fafc;font-size:11px;}',
  '.hsg .s0{position:sticky;left:0;z-index:2;background:#f8fafc;}',
  '.hsg .s1{position:sticky;left:36px;z-index:2;background:#fff;text-align:left;font-weight:600;}',
  '.hsg tr.gr .s0,.hsg tr.gr .s1{z-index:8;background:#334155;color:#fff;}',
  '.hsg tr.ch .s0,.hsg tr.ch .s1{z-index:7;background:#e2e8f0;}',
  '.hsg .a{background:#f6f8fb;color:#64748b;font-style:italic;}',
  '.hsg .y{background:#e1f5ee;color:#0f6e56;font-weight:600;}',
  '.hsg .n{background:#faf5f5;color:#cbb5b5;}',
  '.hsg .fill{background:#fff8dd;}',
  '.hsg .gh td{background:#0f766e;color:#fff;font-weight:600;text-align:left;position:sticky;left:0;z-index:3;padding:6px 12px;font-size:12px;}',
  '.hsg .gh td .c{opacity:.8;font-weight:400;margin-left:8px;font-size:11px;}',
  '.hsg .fb{border:none;background:rgba(0,0,0,.06);color:#334155;border-radius:4px;cursor:pointer;font-size:9px;margin-left:4px;padding:1px 4px;}',
  '.hsg .fb.on{background:#facc15;color:#000;}',
  '.hsg .xm{border:0.5px solid #c4b5fd;background:#fff;color:#5b21b6;border-radius:7px;font-size:10.5px;padding:2px 8px;cursor:pointer;font-weight:600;margin-top:3px;display:inline-block;}',
  '#hsGP{position:fixed;z-index:60;background:#fff;border:0.5px solid #cbd5e1;border-radius:9px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:8px;display:none;min-width:170px;max-height:260px;overflow:auto;font-size:12px;}',
  '#hsGP label{display:flex;gap:7px;align-items:center;padding:4px 6px;border-radius:6px;cursor:pointer;}#hsGP label:hover{background:#f1f5f9;}',
  '#hsGP .r{display:flex;gap:6px;margin-top:6px;border-top:0.5px solid #e2e8f0;padding-top:7px;}#hsGP .r button{flex:1;border:0.5px solid #cbd5e1;background:#fff;border-radius:6px;padding:5px;cursor:pointer;font-size:11.5px;}#hsGP .r .ap{background:#5b21b6;color:#fff;border-color:#5b21b6;}'
  ].join(''); document.head.appendChild(s);
  if(!document.getElementById('hsGP')){ var p=document.createElement('div'); p.id='hsGP'; document.body.appendChild(p);
    document.addEventListener('click',function(e){ if(!e.target.closest('#hsGP')&&!e.target.closest('.fb')) p.style.display='none'; }); }
}
function hsGVal(e,k){ return (e[k]!=null&&String(e[k]).trim()!=='')?String(e[k]):''; }
function hsCC(e){ var ch=getContracts(e)||[],r={tv:'',h6:'',h1:'',kxd:'',n:ch.length};
  ch.forEach(function(c){ var d=c.tu?hsFmtD(c.tu):'✓';
    if(/HĐTV|thử/i.test(c.loai))r.tv=d; else if(/Không xác định|vĩnh/i.test(c.han||''))r.kxd=d;
    else if(/6 tháng/.test(c.han||''))r.h6=d; else r.h1=d; }); return r; }
/* cột: [nhóm, nhãn, hàm(e,cc)-> {h,v,c} ] ; h=html, v=giá trị lọc, c=class */
function hsCOLS(){
  var doc=function(){return {h:'<span class="n">—</span>',v:'(chưa có)',c:''};};
  var txt=function(k){return function(e){var v=hsGVal(e,k);return v?{h:v,v:v}:{h:'',v:'(trống)',c:'fill'};};};
  var ct=function(kk){return function(e,cc){var d=cc[kk];return d?{h:'✓<div style="font-size:9px;color:#15803d;">'+(d==='✓'?'':d)+'</div>',v:'Đã ký',c:'y'}:{h:'—',v:'Chưa ký',c:'n'};};};
  return [
   ['CÔNG VIỆC',[
    ['Phòng ban',txt('pb')],['Chức vụ',txt('vt')],
    ['Tình trạng',function(e){return hsActive(e)?{h:'<span style="font-size:10px;color:#0f6e56;background:#e1f5ee;padding:2px 8px;border-radius:20px;">Đang làm</span>',v:'Đang làm'}:{h:'<span style="font-size:10px;color:#993c1d;background:#faece7;padding:2px 8px;border-radius:20px;">Nghỉ việc</span>',v:'Nghỉ việc'};}],
    ['Ngày vào làm',txt('vao')],
    ['Thâm niên',function(e){return {h:hsTenText(hsTenM(e.vao,e.nghi)),v:hsTenText(hsTenM(e.vao,e.nghi)),c:'a'};}] ]],
   ['ĐỊNH DANH & CƠ BẢN',[
    ['Mã NV',txt('ma')],['Ảnh',function(e){return {h:hsImg(e,26),v:'Ảnh'};}],['Ngày sinh',txt('ns')],
    ['Giới tính',txt('gt')],['SĐT',txt('sdt')],['Email',txt('email')],['Địa chỉ tạm trú',txt('tamTru')] ]],
   ['PHÁP LÝ',[
    ['Số CCCD',txt('cccd')],['Ngày cấp',txt('ngayCap')],['Nơi cấp',txt('noiCap')],['MST cá nhân',txt('mst')],['Số sổ BHXH',txt('bhxh')] ]],
   ['HỢP ĐỒNG & C&B',[
    ['HĐ Thử việc',ct('tv')],['HĐLĐ 6 tháng',ct('h6')],['HĐLĐ 1 năm',ct('h1')],['HĐLĐ Không XĐ',ct('kxd')],
    ['Số bản đã ký',function(e,cc){return {h:'<b>'+cc.n+'</b>',v:cc.n+' bản',c:'a'};}],
    ['Loại hiện hành',function(e){return {h:hsHDBadge(hsCurrentHD(e)),v:(hsCurrentHD(e)||{}).loai||'—',c:'a'};}],
    ['Ngày hết hạn',function(e){var c=hsCurrentHD(e);var d=c&&c.den?hsFmtD(c.den):(c&&/Không xác định|vĩnh/i.test(c.han||'')?'Vô thời hạn':'—');return {h:d,v:d,c:'a'};}],
    ['Ngày còn lại',function(e){return {h:hsActive(e)?hsDaysBadgeTxt(hsCurrentHD(e)):'—',v:'',c:'a'};}],
    ['Hồ sơ HĐ',doc] ]],
   ['HỌC VẤN',[ ['Trình độ',txt('hocVan')],['Chuyên ngành',txt('nganh')],['Trường',txt('truong')] ]],
   ['NGHỈ VIỆC',[ ['Ngày nghỉ',txt('nghi')],['Lý do nghỉ',txt('lyDo')],['Ghi chú',txt('ghiChu')] ]],
   ['HỒ SƠ GIẤY TỜ',[
    ['Đơn xin việc',doc],['CV',doc],['CCCD',doc],['Sơ yếu lí lịch',doc],['Phiếu cư trú',doc],['Ảnh',doc],
    ['Bằng cấp',doc],['Giấy KSK',doc],['Biên bản cam kết',doc],['Giấy tờ khác',doc],
    ['Đã nộp',function(){return {h:'<span class="n">—</span>',v:'—',c:'a'};}],
    ['Tình trạng hồ sơ',function(){return {h:'<span class="n">—</span>',v:'—',c:'a'};}] ]]
  ];
}
var HSGC=['#059669','#2563eb','#7c3aed','#ea580c','#0891b2','#dc2626','#9333ea'];
function hsFillRows(){
  var el=document.getElementById('hs-rows'); if(!el) return; hsGStyle();
  var list=HS_DATA.map(function(e,i){return {e:e,i:i};});
  if(hsDept!=='all') list=list.filter(function(o){return o.e.pb===hsDept;});
  if(hsStatus==='active') list=list.filter(function(o){return hsActive(o.e);});
  if(hsStatus==='left') list=list.filter(function(o){return !hsActive(o.e);});
  if(hsSearch){var q=hsSearch.toLowerCase(); list=list.filter(function(o){return (o.e.ten||'').toLowerCase().indexOf(q)>=0;});}
  var groups=hsCOLS(), flat=[]; groups.forEach(function(g,gi){ g[1].forEach(function(c){ flat.push({gi:gi,lab:c[0],fn:c[1]}); }); });
  /* áp bộ lọc cột */
  list=list.filter(function(o){ var cc=hsCC(o.e); return Object.keys(hsGF).every(function(ci){ var al=hsGF[ci]; if(!al)return true; var r=flat[ci].fn(o.e,cc)||{}; return al.has(String(r.v==null?'':r.v)); }); });
  /* nhóm theo phòng ban */
  list.sort(function(a,b){ return String(a.e.pb||'').localeCompare(String(b.e.pb||''))|| String(a.e.ten||'').localeCompare(String(b.e.ten||'')); });
  var h='<div class="hsg-wrap"><table class="hsg"><thead>';
  h+='<tr class="gr"><th class="s0" rowspan="2">STT</th><th class="s1" rowspan="2">Họ tên</th>';
  groups.forEach(function(g,gi){ h+='<th colspan="'+g[1].length+'" style="background:'+HSGC[gi]+'">'+g[0]+'</th>'; });
  h+='</tr><tr class="ch">';
  flat.forEach(function(c,ci){ h+='<th>'+c.lab+'<button class="fb'+(hsGF[ci]?' on':'')+'" onclick="hsGFopen('+ci+',event)">▼</button></th>'; });
  h+='</tr></thead><tbody>';
  var ncol=flat.length+2, last=null, stt=0;
  list.forEach(function(o){
    if(o.e.pb!==last){ last=o.e.pb; var n=list.filter(function(x){return x.e.pb===o.e.pb;}).length;
      h+='<tr class="gh"><td colspan="'+ncol+'">▸ '+(o.e.pb||'—')+'<span class="c">'+n+' người</span></td></tr>'; }
    stt++; var cc=hsCC(o.e);
    h+='<tr><td class="s0">'+stt+'</td><td class="s1">'+o.e.ten+'<br><span onclick="hsOpen('+o.i+')" class="xm">👁 Xem hồ sơ</span></td>';
    flat.forEach(function(c){ var r=c.fn(o.e,cc)||{}; h+='<td class="'+(r.c||'')+'">'+(r.h==null?'':r.h)+'</td>'; });
    h+='</tr>';
  });
  h+='</tbody></table></div>';
  h+='<div style="text-align:center;font-size:12px;color:#94a3b8;padding-top:10px;">Hiển thị '+list.length+' / '+HS_DATA.length+' nhân sự · cuộn ngang xem đủ 7 nhóm · bấm ▼ để lọc</div>';
  el.innerHTML= list.length? h : '<div style="text-align:center;color:#94a3b8;font-size:12.5px;padding:20px;">Không có nhân sự phù hợp bộ lọc.</div>';
}
function hsGFopen(ci,ev){ ev.stopPropagation(); hsGStyle(); var p=document.getElementById('hsGP');
  var groups=hsCOLS(),flat=[]; groups.forEach(function(g,gi){g[1].forEach(function(c){flat.push(c);});});
  var base=HS_DATA.map(function(e){return {e:e};});
  if(hsDept!=='all')base=base.filter(function(o){return o.e.pb===hsDept;});
  if(hsStatus==='active')base=base.filter(function(o){return hsActive(o.e);});
  if(hsStatus==='left')base=base.filter(function(o){return !hsActive(o.e);});
  var set={}; base.forEach(function(o){var cc=hsCC(o.e);var r=flat[ci][1](o.e,cc)||{};set[String(r.v==null?'':r.v)]=1;});
  var vals=Object.keys(set), cur=hsGF[ci];
  var html='<div style="font-weight:600;font-size:11px;color:#64748b;margin:2px 4px 6px;">Lọc: '+flat[ci][0]+'</div>';
  vals.forEach(function(v){ var ck=(!cur||cur.has(v))?'checked':''; html+='<label><input type="checkbox" value="'+v.replace(/"/g,'')+'" '+ck+'> '+(v||'(trống)')+'</label>'; });
  html+='<div class="r"><button onclick="hsGFapply('+ci+',0)">Bỏ lọc</button><button class="ap" onclick="hsGFapply('+ci+',1)">Áp dụng</button></div>';
  p.innerHTML=html; var r=ev.target.getBoundingClientRect(); p.style.display='block'; p.style.left=Math.min(r.left,window.innerWidth-190)+'px'; p.style.top=(r.bottom+4)+'px';
}
function hsGFapply(ci,ok){ var p=document.getElementById('hsGP');
  if(!ok){ delete hsGF[ci]; } else { var ch=[].slice.call(p.querySelectorAll('input:checked')).map(function(i){return i.value;});
    var all=p.querySelectorAll('input').length; if(ch.length===all) delete hsGF[ci]; else hsGF[ci]=new Set(ch); }
  p.style.display='none'; hsFillRows();
}

function hsField(l,v,it){ return '<div style="display:flex;padding:7px 6px;border-bottom:0.5px dotted #cbd5e1;"><span style="width:170px;color:#475569;'+(it?'font-style:italic;':'')+'">'+l+'</span><span style="flex:1;">'+(v&&String(v).trim()?v:'—')+'</span></div>'; }
function hsSecBar(t){ return '<div style="background:#7c8bab;color:#fff;font-size:13.5px;font-weight:600;padding:8px 14px;border-radius:6px;margin:16px 0 8px;">'+t+'</div>'; }

/* ══ VÒNG ĐỜI HỢP ĐỒNG — nguồn tách riêng qua getContracts(), nối Google Sheet sau ══ */
/* HD_FIX: ghi tay trường hợp khác chuẩn. Mỗi người = mảng HĐ {loai,han,thang,tu}.
   thang = số tháng hiệu lực (0 = không xác định thời hạn → không đếm ngược).
   tu = 'dd/mm/yyyy' ngày ký (bỏ trống = nối tiếp HĐ trước / ngày vào làm).
   Có trong HD_FIX thì DÙNG THAY chuỗi tự suy. */
const HD_FIX={
  'Nguyễn Văn Vững':[{loai:'HĐLĐ',han:'Không xác định thời hạn',thang:0,tu:''}],
  'Nguyễn Thị Hạnh Diệu':[{loai:'HĐLĐ',han:'Không xác định thời hạn',thang:0,tu:''}],
  'Huỳnh Thị Hoàng Anh':[{loai:'HĐLĐ',han:'Không xác định thời hạn',thang:0,tu:''}]
};
function hsAddMonths(d,m){ return new Date(d.getFullYear(),d.getMonth()+m,d.getDate()); }
function hsFmtD(d){ if(!d)return ''; var z=function(n){return('0'+n).slice(-2);}; return z(d.getDate())+'/'+z(d.getMonth()+1)+'/'+d.getFullYear(); }
function hsMarkStatus(chain){ var t=new Date();t.setHours(0,0,0,0); chain.forEach(function(c){ if(c.den&&c.den<t)c.status='done'; else if(c.tu&&c.tu>t)c.status='future'; else c.status='active'; }); return chain; }
function getContracts(e){
  if(!e) return [];
  var chain=[];
  if(HD_FIX[e.ten]){
    var prev=null;
    HD_FIX[e.ten].forEach(function(c){
      var tu=c.tu?hsPD(c.tu):(prev||(e.vao?hsPD(e.vao):null));
      var den=(c.thang&&tu)?hsAddMonths(tu,c.thang):null;
      chain.push({loai:c.loai,han:c.han,tu:tu,den:den});
      prev=den;
    });
    return hsMarkStatus(chain);
  }
  var vao=e.vao?hsPD(e.vao):null;
  if(!vao) return [];
  if(/part/i.test(e.loaiHD||'')){ chain.push({loai:'Part-time',han:'',tu:vao,den:null}); return hsMarkStatus(chain); }
  var tvEnd=e.hetHan?hsPD(e.hetHan):hsAddMonths(vao,2);
  chain.push({loai:'HĐTV',han:'2 tháng',tu:vao,den:tvEnd});
  if(!/thử việc/i.test(e.loaiHD||'')){ chain.push({loai:'HĐLĐ',han:'6 tháng',tu:tvEnd,den:hsAddMonths(tvEnd,6),auto:true}); }
  return hsMarkStatus(chain);
}
function hsCurrentHD(e){ var ch=getContracts(e); if(!ch.length)return null; var a=ch.filter(function(c){return c.status==='active';}); return a.length?a[a.length-1]:ch[ch.length-1]; }
function hsDaysLeft(c){ if(!c||!c.den)return null; var t=new Date();t.setHours(0,0,0,0); return Math.round((c.den-t)/86400000); }
function hsHDColor(loai,han){ if(/HĐTV/i.test(loai))return['#f4c0d1','#4b1528']; if(/part/i.test(loai))return['#f1efe8','#2c2c2a']; if(/Không xác định|vĩnh/i.test(han||''))return['#9fe1cb','#04342c']; return['#b5d4f4','#042c53']; }
function hsHanShort(c){ if(!c||!c.han)return ''; if(/Không xác định|vĩnh/i.test(c.han))return 'vô TH'; return c.han.replace(' tháng','th').replace(' năm','n'); }
function hsHDBadge(c){ if(!c)return '<span style="font-size:10.5px;color:#94a3b8;">—</span>'; var cc=hsHDColor(c.loai,c.han); var s=hsHanShort(c); return '<span style="font-size:10.5px;font-weight:500;background:'+cc[0]+';color:'+cc[1]+';padding:2px 8px;border-radius:20px;">'+c.loai+(s?' '+s:'')+'</span>'; }
function hsDaysBadgeTxt(c){ var d=hsDaysLeft(c); if(d===null)return '<span style="font-size:11px;color:#94a3b8;">—</span>'; if(d<0)return '<span style="font-size:11px;font-weight:500;color:#791f1f;">Quá hạn '+(-d)+'d</span>'; var col=d<=7?'#a32d2d':(d<=30?'#854f0b':'#334155'); return '<span style="font-size:11.5px;font-weight:500;color:'+col+';">'+d+' ngày</span>'; }
function hsAlertHTML(){
  var t=new Date();t.setHours(0,0,0,0); var arr=[];
  HS_DATA.forEach(function(e){ if(!hsActive(e))return; var c=hsCurrentHD(e); if(!c||!c.den)return; var d=Math.round((c.den-t)/86400000); if(d<=30)arr.push({e:e,c:c,d:d}); });
  arr.sort(function(a,b){return a.c.den-b.c.den;});
  if(!arr.length) return '<div style="font-size:12.5px;color:#64748b;padding:6px 2px;"><i class="ti ti-circle-check" style="color:#1d9e75;"></i> Không có hợp đồng nào tới hạn trong 30 ngày.</div>';
  return arr.map(function(o){
    var bg=o.d<=7?'#fcebeb':(o.d<=30?'#faeeda':'#f1f5f9');
    var bb=o.d<0?'#791f1f':(o.d<=7?'#a32d2d':'#ba7517'); var bt=o.d<0?'Quá hạn '+(-o.d)+'d':'còn '+o.d+' ngày';
    return '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;background:'+bg+';margin-bottom:8px;">'
      +'<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;color:#1e293b;">'+o.e.ten+'</div><div style="font-size:11.5px;color:#64748b;">'+o.c.loai+' '+o.c.han+' · hết hạn '+hsFmtD(o.c.den)+(o.e.pb?' · '+o.e.pb:'')+'</div></div>'
      +hsHDBadge(o.c)
      +'<span style="font-size:12px;font-weight:500;background:'+bb+';color:#fff;padding:4px 10px;border-radius:20px;min-width:74px;text-align:center;">'+bt+'</span></div>';
  }).join('');
}
function hsHDDist(){
  var cats=[['HĐTV','#d4537e'],['HĐLĐ 6th','#378add'],['HĐLĐ dài hạn','#185fa5'],['Không xác định TH','#1d9e75'],['Khác','#888780']];
  var cnt={'HĐTV':0,'HĐLĐ 6th':0,'HĐLĐ dài hạn':0,'Không xác định TH':0,'Khác':0}, n=0;
  HS_DATA.forEach(function(e){ if(!hsActive(e))return; var c=hsCurrentHD(e); if(!c)return; n++;
    if(/HĐTV/i.test(c.loai))cnt['HĐTV']++;
    else if(/Không xác định|vĩnh/i.test(c.han||''))cnt['Không xác định TH']++;
    else if(/HĐLĐ/i.test(c.loai)){ if(/6 tháng/.test(c.han))cnt['HĐLĐ 6th']++; else cnt['HĐLĐ dài hạn']++; }
    else cnt['Khác']++; });
  if(!n) return '<div style="font-size:12px;color:#94a3b8;padding:8px 0;">Chưa có dữ liệu hợp đồng.</div>';
  var bar=cats.map(function(c){return cnt[c[0]]?'<div style="width:'+(cnt[c[0]]/n*100)+'%;background:'+c[1]+';"></div>':'';}).join('');
  var leg=cats.filter(function(c){return cnt[c[0]];}).map(function(c){return '<span style="color:'+c[1]+';">'+c[0]+' '+cnt[c[0]]+'</span>';}).join('');
  return '<div style="display:flex;height:12px;border-radius:20px;overflow:hidden;margin-bottom:10px;">'+bar+'</div><div style="display:flex;gap:12px;font-size:11.5px;flex-wrap:wrap;">'+leg+'</div>';
}
function hsHDSectionHTML(e){
  var ch=getContracts(e), cur=hsCurrentHD(e);
  var html='<div style="background:#0f6e56;color:#fff;font-size:13.5px;font-weight:600;padding:8px 14px;border-radius:6px;margin:16px 0 10px;"><i class="ti ti-file-certificate"></i> Vòng đời hợp đồng</div>';
  if(!ch.length) return html+'<div style="font-size:12px;color:#94a3b8;padding:4px 6px;">Chưa có dữ liệu hợp đồng (thiếu ngày vào làm).</div>';
  if(cur){ var d=hsDaysLeft(cur); var badge=d===null?'':(d<0?'<span style="font-size:12px;font-weight:500;background:#791f1f;color:#fff;padding:4px 12px;border-radius:20px;">Quá hạn '+(-d)+'d</span>':'<span style="font-size:12px;font-weight:500;background:'+(d<=7?'#a32d2d':(d<=30?'#ba7517':'#378add'))+';color:#fff;padding:4px 12px;border-radius:20px;">còn '+d+' ngày</span>');
    html+='<div style="display:flex;align-items:center;gap:10px;background:#e6f1fb;border-radius:10px;padding:11px 14px;margin-bottom:14px;"><div><div style="font-size:11px;color:#0c447c;">Hợp đồng hiện tại</div><div style="font-size:14px;font-weight:600;color:#042c53;">'+cur.loai+' '+cur.han+'</div></div><span style="margin-left:auto;">'+badge+'</span></div>'; }
  html+='<div style="position:relative;padding-left:24px;"><div style="position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:#e2e8f0;"></div>';
  ch.forEach(function(c){
    var dot=c.status==='done'?'#1d9e75':(c.status==='active'?'#378add':'#cbd5e1');
    var ring=c.status==='done'?'#e1f5ee':(c.status==='active'?'#e6f1fb':'#f1f5f9');
    var tag=c.status==='done'?'<span style="font-size:10px;font-weight:500;background:#e1f5ee;color:#04342c;padding:1px 8px;border-radius:20px;margin-left:4px;">đã xong</span>':(c.status==='active'?'<span style="font-size:10px;font-weight:500;background:#e6f1fb;color:#042c53;padding:1px 8px;border-radius:20px;margin-left:4px;">đang hiệu lực</span>':'<span style="font-size:10px;font-weight:500;background:#f1f5f9;color:#64748b;padding:1px 8px;border-radius:20px;margin-left:4px;">sắp tới</span>');
    var rng=(c.tu?hsFmtD(c.tu):'?')+' → '+(c.den?hsFmtD(c.den):'không xác định thời hạn');
    html+='<div style="position:relative;margin-bottom:14px;"><div style="position:absolute;left:-24px;top:1px;width:15px;height:15px;border-radius:50%;background:'+dot+';border:3px solid '+ring+';"></div><div style="font-size:12.5px;font-weight:600;color:#1e293b;">'+c.loai+' '+c.han+tag+'</div><div style="font-size:11.5px;color:#64748b;">'+rng+'</div></div>';
  });
  var last=ch[ch.length-1];
  if(last&&last.auto){ html+='<div style="position:relative;"><div style="position:absolute;left:-24px;top:1px;width:15px;height:15px;border-radius:50%;background:#fff;border:2px dashed #cbd5e1;"></div><div style="font-size:12.5px;font-weight:600;color:#94a3b8;">Nấc tiếp theo <span style="font-size:10px;font-weight:500;background:#f1f5f9;color:#64748b;padding:1px 8px;border-radius:20px;margin-left:4px;">tùy người · nhập sau</span></div><div style="font-size:11.5px;color:#94a3b8;">HĐLĐ 1 năm / 12th / không xác định thời hạn — sửa trong HD_FIX</div></div>'; }
  html+='</div>';
  return html;
}
function hsDetailHTML(e){
  if(!e){ hsView='list'; return ''; }
  const c=hsDC(e.pb);
  const _pa = hsPhoto(e);
  const photo = _pa
    ? '<div style="width:100%;aspect-ratio:3/4;border-radius:8px;overflow:hidden;margin-bottom:14px;"><img src="'+_pa+'" style="width:100%;height:100%;object-fit:cover;"></div>'
    : '<div style="width:100%;aspect-ratio:3/4;border-radius:8px;background:'+c[0]+';color:'+c[1]+';display:flex;align-items:center;justify-content:center;margin-bottom:14px;"><i class="ti ti-photo" style="font-size:46px;opacity:.6;"></i></div>';
  const age=hsAge(e.ns);
  const _curHD=hsCurrentHD(e); const loai = _curHD ? '<span style="color:#185fa5;font-weight:600;">'+_curHD.loai+' '+_curHD.han+'</span>' : (e.loaiHD||'—');
  const tt = hsActive(e) ? '<span style="color:#0f6e56;">✅ '+(e.tt||'Đang làm việc')+'</span>' : '<span style="color:#993c1d;">⭕️ '+(e.tt||'Nghỉ việc')+'</span>';
  const link = e.linkHD ? '<span onclick="openLink&&openLink(\''+e.linkHD+'\')" style="color:#5b21b6;cursor:pointer;"><i class="ti ti-file-text"></i> Xem hợp đồng</span>' : '<span style="color:#94a3b8;">Chưa có link</span>';
  return '<div style="max-width:900px;">'
    +'<div onclick="hsBack()" style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:#5b21b6;margin-bottom:12px;cursor:pointer;"><i class="ti ti-arrow-left"></i> Quay lại danh sách</div>'
    +'<div style="display:grid;grid-template-columns:minmax(200px,280px) 1fr;gap:18px;align-items:start;">'
    +'<div style="background:#fff;border:1px solid #9fe1cb;border-radius:12px;padding:14px;text-align:center;">'+photo
    +'<div style="font-size:18px;font-weight:600;color:#0f172a;margin-bottom:8px;">'+e.ten+'</div>'
    +'<div style="font-size:12.5px;color:#475569;line-height:1.9;">Giới tính: '+(e.gt||'—')+'<br>'+(age!=null?age+' tuổi':'— tuổi')+'<br>Phòng '+(e.pb||'—')+'<br>Vị trí '+(e.vt||'—')+'</div></div>'
    +'<div><div style="font-size:12.5px;">'+hsSecBar('Thông tin cá nhân')
    +hsField('Ngày sinh:',e.ns,1)+hsField('SĐT:',e.sdt,1)+hsField('Số CCCD:',e.cccd,1)+hsField('Ngày cấp:',e.ngayCap,1)+hsField('Địa chỉ tạm trú:',e.tamTru,1)
    +hsSecBar('Thông tin công việc')
    +hsField('Thời gian vào hợp đồng:',e.vao,1)+hsField('Thời gian kết thúc HĐ:',e.ketThuc,1)+hsField('Thâm niên:',hsTenText(hsTenM(e.vao,e.nghi)),1)+hsField('Loại HĐ:',loai,1)+hsField('Trạng thái:',tt,1)+hsField('Ngày nghỉ việc:',e.nghi,1)
    +hsHDSectionHTML(e)
    +hsSecBar('Học vấn')+hsField('Trình độ học vấn:',e.hocVan,1)
    +hsSecBar('Link hợp đồng')+'<div style="padding:7px 6px;">'+link+'</div>'
    +'</div></div></div></div>';
}

let hsLiveLoaded=false;function loadHS(){if(hsLiveLoaded)return;hsLiveLoaded=true;fetch('https://script.google.com/macros/s/AKfycby_WeDpvih5B6sq7LP_P-qKZTBXDKrG6JHhWLv33JLKRyf_K9HiTJS5BJ6ncQFh9sqc/exec').then(r=>r.json()).then(d=>{if(Array.isArray(d)&&d.length){HS_DATA.length=0;d.forEach(x=>HS_DATA.push(x));if(document.getElementById('nav-hs')?.classList.contains('active'))renderHoSo();}}).catch(e=>console.warn('loadHS',e));}function renderHoSo(){
  const C=document.getElementById('content'); if(!C) return;
  if(hsView==='detail'){ C.innerHTML=hsDetailHTML(HS_DATA[hsSel]); return; }
  const D=HS_DATA, total=D.length;
  const act=D.filter(hsActive), left=D.filter(e=>!hsActive(e));
  const turnover=total?(left.length/total*100):0;
  const ages=D.map(e=>hsAge(e.ns)).filter(a=>a!=null);
  const avgAge=ages.length?Math.round(ages.reduce((s,a)=>s+a,0)/ages.length):0;
  const tenM=act.map(e=>hsTenM(e.vao,null)).filter(m=>m!=null);
  const avgTen=tenM.length?(tenM.reduce((s,m)=>s+m,0)/tenM.length/12):0;
  const nam=D.filter(e=>String(e.gt).trim().toLowerCase()==='nam').length;
  const nu=D.filter(e=>{const g=String(e.gt).trim().toLowerCase();return g==='nữ'||g==='nu';}).length;
  const gTot=nam+nu, namP=gTot?Math.round(nam/gTot*100):0;
  const ab=[0,0,0,0]; ages.forEach(a=>{ if(a<25)ab[0]++; else if(a<=30)ab[1]++; else if(a<=35)ab[2]++; else ab[3]++; });
  const abMx=Math.max(1,...ab);
  const tb=[0,0,0,0]; act.forEach(e=>{ const m=hsTenM(e.vao,null); if(m==null)return; if(m<6)tb[0]++; else if(m<12)tb[1]++; else if(m<24)tb[2]++; else tb[3]++; });
  const tbMx=Math.max(1,...tb);
  const actN=act.length; const ct=act.filter(e=>/chính thức/i.test(e.loaiHD||'')).length, tv=act.filter(e=>/thử việc/i.test(e.loaiHD||'')).length, ctv=actN-ct-tv;
  const pass=(ct+tv)?Math.round(ct/(ct+tv)*100):0;
  const depts=[...new Set(D.map(e=>e.pb))];
  const kpi=(v,l,bg,vc,lc)=>'<div style="background:'+bg+';border-radius:12px;padding:12px;"><div style="font-size:22px;font-weight:600;color:'+vc+';">'+v+'</div><div style="font-size:11px;color:'+lc+';">'+l+'</div></div>';
  const chip=(l,active,fn)=>'<span onclick="'+fn+'" style="font-size:11.5px;font-weight:'+(active?'500':'400')+';cursor:pointer;background:'+(active?'#5b21b6':'#f1f5f9')+';color:'+(active?'#fff':'#475569')+';padding:6px 12px;border-radius:20px;">'+l+'</span>';

  C.innerHTML=`
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(115px,1fr));gap:10px;margin-bottom:14px;">
    ${kpi(total,'Tổng NV','#eeedfe','#26215c','#3c3489')}
    ${kpi(act.length,'Đang làm','#e1f5ee','#04342c','#085041')}
    ${kpi(left.length,'Đã nghỉ','#faece7','#4a1b0c','#712b13')}
    ${kpi(turnover.toFixed(1)+'%','Tỉ lệ nghỉ','#faeeda','#412402','#633806')}
    ${kpi(avgTen.toFixed(1)+'n','Thâm niên TB','#e6f1fb','#042c53','#0c447c')}
    ${kpi(avgAge,'Tuổi TB','#fbeaf0','#4b1528','#993556')}
  </div>
  <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;margin-bottom:14px;">
    <div onclick="hsAlertToggle(this)" style="display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;"><i class="ti ti-alert-triangle" style="font-size:17px;color:#993c1d;"></i><span style="font-size:13px;font-weight:600;color:#1e293b;">Hợp đồng sắp hết hạn / cần gia hạn</span><span style="font-size:11px;font-weight:600;color:#993c1d;background:#faece7;padding:1px 8px;border-radius:20px;">${hsAlertCount()}</span><span style="margin-left:auto;font-size:11px;color:#94a3b8;">ngưỡng ≤ 30 ngày</span><span class="hsAlArrow" style="font-size:13px;color:#94a3b8;margin-left:10px;transition:transform .15s;">▸</span></div>
    <div id="hsAlertBody" style="display:none;margin-top:12px;">${hsAlertHTML()}</div>
  </div>
  <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;margin-bottom:14px;">
    <div style="display:flex;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:6px;"><span style="font-size:13px;font-weight:600;color:#1e293b;">Biến động nhân sự theo tháng</span><span style="margin-left:auto;font-size:11px;"><span style="color:#1d9e75;"><i class="ti ti-circle-filled" style="font-size:8px;"></i> Tuyển mới</span> &nbsp; <span style="color:#d85a30;"><i class="ti ti-circle-filled" style="font-size:8px;"></i> Nghỉ</span> &nbsp; <span style="color:#5b21b6;"><i class="ti ti-minus"></i> Headcount</span></span></div>
    <div style="display:flex;align-items:flex-end;gap:14px;">${hsTrend()}</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-bottom:14px;">
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;">Tỉ lệ nam / nữ</div>
      ${gTot?'<div style="display:flex;height:14px;border-radius:20px;overflow:hidden;margin-bottom:10px;"><div style="width:'+namP+'%;background:#378add;"></div><div style="width:'+(100-namP)+'%;background:#d4537e;"></div></div><div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:#185fa5;">Nam · '+nam+' ('+namP+'%)</span><span style="color:#993556;">Nữ · '+nu+' ('+(100-namP)+'%)</span></div>':'<div style="font-size:12px;color:#94a3b8;padding:8px 0;">Chưa cập nhật giới tính.</div>'}
    </div>
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;">Phân bố độ tuổi</div>
      ${hsBarRow('&lt;25',ab[0],abMx,'#5b21b6',48)+hsBarRow('25–30',ab[1],abMx,'#5b21b6',48)+hsBarRow('31–35',ab[2],abMx,'#5b21b6',48)+hsBarRow('&gt;35',ab[3],abMx,'#5b21b6',48)}
    </div>
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;">Thâm niên (đang làm)</div>
      ${hsBarRow('&lt;6th',tb[0],tbMx,'#0f6e56',56)+hsBarRow('6–12th',tb[1],tbMx,'#0f6e56',56)+hsBarRow('1–2 năm',tb[2],tbMx,'#0f6e56',56)+hsBarRow('&gt;2 năm',tb[3],tbMx,'#0f6e56',56)}
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-bottom:14px;">
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;">% nghỉ việc theo phòng ban</div>${hsAttrition()}
    </div>
    <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
      <div style="font-size:13px;font-weight:600;margin-bottom:12px;">Phân bổ loại hợp đồng</div>
      ${hsHDDist()}
    </div>
  </div>
  <div style="background:#fff;border:0.5px solid #e2e8f0;border-radius:12px;padding:1rem 1.25rem;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
      <span style="font-size:14px;font-weight:600;color:#1e293b;">Danh sách nhân sự</span>
      <input oninput="hsSearch=this.value;hsFillRows()" value="${hsSearch}" placeholder="Tìm tên..." style="margin-left:auto;font-size:12.5px;border:0.5px solid #cbd5e1;border-radius:8px;padding:6px 10px;min-width:160px;outline:none;">
    </div>
    <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
      ${chip('Tất cả',hsStatus==='all',"hsSetStatus('all')")}${chip('Đang làm',hsStatus==='active',"hsSetStatus('active')")}${chip('Nghỉ việc',hsStatus==='left',"hsSetStatus('left')")}
      <span style="width:1px;background:#e2e8f0;margin:0 4px;"></span>
      ${chip('Mọi phòng',hsDept==='all',"hsSetDept('all')")}${depts.map(d=>chip(d,hsDept===d,"hsSetDept('"+d+"')")).join('')}
    </div>
    <div id="hs-rows"></div>
  </div>`;
  hsFillRows();
}

/* ══════════════════════════════════════════
   CÔNG VIỆC NHÂN SỰ — Data & Render
══════════════════════════════════════════ */






























/* =============================================================
   BigX HR — NÚT "XUẤT EXCEL" cho tab Hồ sơ nhân sự
   Xuất TOÀN BỘ nhân viên ra file .xlsx (đủ các cột đang có).
 
   CÁCH DÙNG: dán TOÀN BỘ đoạn này vào CUỐI file hoso.js rồi Commit.
   (Không cần sửa gì phía trên — chỉ thêm vào cuối.)
   ============================================================= */
function hsExportExcel(){
  try{
    var COLS = [
      ['Họ tên','ten'],['Giới tính','gt'],['Ngày sinh','ns'],['SĐT','sdt'],
      ['Phòng ban','pb'],['Chức vụ','vt'],['Ngày vào làm','vao'],['Trạng thái','__tt'],
      ['Loại hợp đồng','loaiHD'],['Ngày hết hạn HĐ','hetHan'],['Số CCCD','cccd'],
      ['Ngày cấp CCCD','ngayCap'],['Địa chỉ thường trú','tamTru'],['Trình độ','hocVan'],
      ['Ngày nghỉ việc','nghi']
    ];
    function tt(r){ return r.tt==='Nghỉ việc' ? 'Nghỉ việc' : (r.loaiHD==='Thử việc' ? 'Thử việc' : 'Đang làm việc'); }
    var aoa = [ COLS.map(function(c){ return c[0]; }) ];
    (HS_DATA||[]).forEach(function(r){
      aoa.push(COLS.map(function(c){
        if(c[1]==='__tt') return tt(r);
        var v = r[c[1]]; return (v==null)?'':String(v);
      }));
    });
    function build(){
      var ws = XLSX.utils.aoa_to_sheet(aoa);
      // ép mọi ô thành text để không mất số 0 đầu (SĐT / CCCD)
      var range = XLSX.utils.decode_range(ws['!ref']);
      for(var R=0;R<=range.e.r;R++){ for(var C=0;C<=range.e.c;C++){
        var cell = ws[XLSX.utils.encode_cell({r:R,c:C})]; if(cell){ cell.t='s'; }
      }}
      ws['!cols'] = COLS.map(function(c){ return { wch: Math.max(12, c[0].length + 2) }; });
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hồ sơ nhân sự');
      var d = new Date();
      var name = 'BigX_HoSoNhanSu_' + d.getFullYear() + ('0'+(d.getMonth()+1)).slice(-2) + ('0'+d.getDate()).slice(-2) + '.xlsx';
      XLSX.writeFile(wb, name);
    }
    if(typeof XLSX === 'undefined'){
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      s.onload = build;
      s.onerror = function(){ alert('Không tải được thư viện xuất Excel, thử lại.'); };
      document.head.appendChild(s);
    } else { build(); }
  } catch(e){ console.error('hsExportExcel', e); alert('Lỗi khi xuất Excel: ' + e.message); }
}
 
/* Chèn nút vào đầu tab Hồ sơ và tự gắn lại sau mỗi lần render */
(function(){
  function ensureBtn(){
    var sec = document.getElementById('hs-rows'); if(!sec) return;
    if(document.getElementById('hsExportBtn')) return;
    var b = document.createElement('button');
    b.id = 'hsExportBtn'; b.type = 'button'; b.innerHTML = '⬇ Xuất Excel';
    b.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin:0 0 12px 0;padding:8px 16px;background:#1F4E79;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;font-size:13px;';
    b.onmouseover = function(){ b.style.opacity = '.9'; };
    b.onmouseout  = function(){ b.style.opacity = '1'; };
    b.onclick = hsExportExcel;
    sec.insertBefore(b, sec.firstChild);
  }
  if(typeof renderHoSo === 'function'){
    var _r = renderHoSo;
    renderHoSo = function(){ var x = _r.apply(this, arguments); try{ ensureBtn(); }catch(e){} return x; };
    try{ window.renderHoSo = renderHoSo; }catch(e){}
  }
  if(document.readyState !== 'loading') ensureBtn();
  document.addEventListener('DOMContentLoaded', ensureBtn);
})();
 




/* Thu gọn mục "Hợp đồng sắp hết hạn" — mặc định gập, bấm mũi tên mới bung */
function hsAlertCount(){ var t=new Date();t.setHours(0,0,0,0); var n=0;
  (HS_DATA||[]).forEach(function(e){ if(!hsActive(e))return; var c=hsCurrentHD(e); if(!c||!c.den)return; if(Math.round((c.den-t)/86400000)<=30)n++; }); return n; }
function hsAlertToggle(el){ var b=document.getElementById('hsAlertBody'); if(!b)return; var open=b.style.display!=='none';
  b.style.display=open?'none':'block'; var a=el.querySelector('.hsAlArrow'); if(a){ a.textContent=open?'▸':'▾'; } }

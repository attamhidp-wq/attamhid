/* =====================================================================
   v289 — توحيد الخطابات والشهادات والنماذج على نموذج خطاب التعيين الرسمي:
   البسملة، والترويسة الثلاثية والخط المزدوج، والرقم والتاريخ (والمرفقات للخطابات)،
   والموضوع والعنوان، والمتن الرسمي، والتوقيع دون ختم، ورابط التحقق ورابط الدخول مكتوبين، والتذييل برابط الموقع.
   يشمل: خطاب القبول، وخطابات التوصية، وشهادات البرامج القصيرة، ونماذج التدريب الميداني ومشروع التخرج.
   يُستثنى: وثيقة التخرج. لا بيانات شخصية في الشيفرة.
   ===================================================================== */
(function(){try{
var W=window,X=W.V51;if(!X)return;
var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var dmy=function(d){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(d||''));return m?m[3]+'/'+m[2]+'/'+m[1]:String(d||'')};
var hij=function(d){try{var p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(new Date(String(d).slice(0,10)+'T12:00:00')),g=function(t){return (p.find(function(x){return x.type===t})||{}).value||''};return g('day')+'/'+g('month')+'/'+g('year')}catch(e){return ''}};
var A='font-family:Amiri,\'Traditional Arabic\',serif',E='font-family:Tinos,\'Times New Roman\',serif',NV='#14284B';
var SITE='attamhid.com';
var PORT={stu:['الخدمات الذاتية للطلاب والطالبات','student-services','برقمك الأكاديمي'],fac:['الخدمات الذاتية لأعضاء هيئة التدريس','faculty-services','برقمك العضوي'],grad:['بوابة الخريجين','graduates','برقمك الأكاديمي'],trn:['بوابة التدريب','training','ببريدك المسجل']};
var lg=function(){try{return LOGO}catch(e){return ''}};
var inst=function(){try{return (S.v51&&S.v51.inst)||{}}catch(e){return {}}};

/* ---------- أجزاء الإطار الموحّد (مطابقة لخطاب التعيين) ---------- */
function head(o){var I=inst(),L=lg();o=o||{};
 return (L&&!o.noWm?'<img src="'+L+'" alt="" style="position:absolute;top:50%;left:50%;width:430px;transform:translate(-50%,-50%);opacity:.045;pointer-events:none">':'')+
 '<div style="position:absolute;top:30px;right:0;left:0;text-align:center;'+A+';font-size:15px;color:'+NV+'">بسم الله الرحمن الرحيم</div>'+
 '<div style="position:absolute;top:56px;right:54px;left:54px;display:flex;align-items:center;justify-content:space-between">'+
  '<div style="text-align:center;'+A+';font-size:15px;line-height:1.6;color:'+NV+';min-width:230px"><b style="font-size:18px">'+esc(I.nameAr||'معهد التمهيد')+'</b><br>'+esc(o.board||'مجلس الشؤون التعليمية')+'<br>'+esc(o.unit||'')+'</div>'+
  (L?'<img src="'+L+'" alt="" style="height:64px">':'')+
  '<div dir="ltr" style="text-align:center;'+E+';font-size:13px;line-height:1.6;color:'+NV+';min-width:230px"><b style="font-size:15px">'+esc(I.nameEn||'At Tamhid Institute')+'</b><br>'+esc(o.boardEn||'Board of Educational Affairs')+'<br>'+esc(o.unitEn||'')+'</div></div>'+
 '<div style="position:absolute;top:150px;right:54px;left:54px;border-top:2.5px solid '+NV+'"></div><div style="position:absolute;top:155px;right:54px;left:54px;border-top:.8px solid '+NV+'"></div>'}
function meta(o){var hd=hij(o.date);
 var row=function(k,v){return '<div><span style="display:inline-block;width:62px">'+k+'</span>: '+v+'</div>'};
 return '<div style="position:absolute;top:166px;left:58px;'+A+';font-size:14px;line-height:1.8;color:#111;direction:rtl">'+
  row(o.noLbl||'الرقم','<bdi dir="ltr">'+esc(o.rec)+'</bdi>')+
  row('التاريخ',(hd?'<bdi dir="ltr">'+esc(hd)+'</bdi>هـ الموافق ':'')+'<bdi dir="ltr">'+esc(dmy(o.date))+'</bdi>م')+
  (o.att===false?'':row('المرفقات',o.att?esc(o.att):'بدون'))+'</div>'}
/* سطر واحد للرقم والتاريخ والمرفقات (للنماذج متعددة الصفحات) */
function metaLine(o){var hd=hij(o.date);
 return '<div style="position:absolute;top:163px;right:71px;left:71px;display:flex;justify-content:space-between;'+A+';font-size:13.5px;color:#111;direction:rtl">'+
  '<span>الرقم: <bdi dir="ltr">'+esc(o.rec)+'</bdi></span><span>التاريخ: '+(hd?'<bdi dir="ltr">'+esc(hd)+'</bdi>هـ الموافق ':'')+'<bdi dir="ltr">'+esc(dmy(o.date))+'</bdi>م</span><span>المرفقات: '+(o.att?esc(o.att):'بدون')+'</span></div>'}
function sign(s,w){s=s||{};var im='';try{im=s.src||(s.img&&X.imgOf?X.imgOf(s.img):'')}catch(e){}
 return '<div style="width:'+(w||260)+'px;text-align:center;'+A+';color:#111"><div style="font-size:16px;font-weight:700">'+esc(s.t||'رئيس المعهد')+'</div>'+
  '<div style="height:58px;margin:2px 0;display:flex;align-items:center;justify-content:center">'+(im?'<img src="'+im+'" alt="" style="height:54px;max-width:170px;object-fit:contain">':'')+'</div>'+
  '<div style="font-size:15.5px;font-weight:700">'+esc(s.n||'')+'</div></div>'}
function signers(type){var r=[];try{r=(X.resolveSigners&&X.resolveSigners(type))||[]}catch(e){}return r}
function cc(list){return list&&list.length?'<div style="'+A+';font-size:12.5px;line-height:1.7;color:#333"><b>صورة مع التحية إلى:</b>'+list.map(function(x){return '<br>- '+esc(x)+'.'}).join('')+'</div>':''}
function verify(o){var Q='';try{Q=o.qr?qr(o.qr):''}catch(e){}var P=o.login&&PORT[o.login.k];
 return '<div style="position:absolute;bottom:90px;right:54px;left:54px;display:flex;align-items:center;gap:12px;'+A+';font-size:12.5px;color:#222;line-height:1.7;border-top:1px dashed #9aa4b1;padding-top:8px">'+
  (Q?'<img src="'+Q+'" alt="" style="width:54px;height:54px">':'')+
  '<div style="flex:1"><b>'+esc(o.vl||'التحقق من الوثيقة')+':</b> امسح الرمز، أو أدخل رقمها <bdi dir="ltr">'+esc(o.rec)+'</bdi> في صفحة «التحقق من الوثائق» على موقع المعهد <b dir="ltr" style="'+E+'">'+SITE+'</b>'+
  (P?'<br><b>الدخول إلى البوابة:</b> «'+P[0]+'» <b dir="ltr" style="'+E+'">'+SITE+'/'+P[1]+'</b> '+(o.login.how||P[2])+(o.login.id?' <bdi dir="ltr">'+esc(o.login.id)+'</bdi>':'')+(o.login.tail||''):'')+'</div>'+
  (o.pg?'<div style="white-space:nowrap;font-size:12px;color:#555">'+o.pg+'</div>':'')+'</div>'}
function foot(){var I=inst(),H={};try{H=S.home||{}}catch(e){}
 return '<div style="position:absolute;bottom:50px;right:54px;left:54px;border-top:2px solid '+NV+';padding-top:6px;text-align:center;'+A+';font-size:12.5px;color:'+NV+'">'+
  (I.addrAr?esc(I.addrAr)+' &nbsp;|&nbsp; ':'')+(H.p1?'الهاتف: <bdi dir="ltr">'+esc(H.p1)+'</bdi> &nbsp;|&nbsp; ':'')+(H.em?'البريد: <bdi dir="ltr">'+esc(H.em)+'</bdi> &nbsp;|&nbsp; ':'')+'<b dir="ltr" style="'+E+'">'+SITE+'</b></div>'}
function page(inner,tag){return '<div class="tmw" data-d14="1" data-l289="'+(tag||1)+'"><div class="tmp d14 l287" style="background:#fff;position:relative;overflow:hidden">'+inner+'</div></div>'}
var P=function(t,st){return '<p style="margin:0 0 8px;font-size:16px;line-height:1.95;text-align:justify;'+(st||'')+'">'+t+'</p>'};
var TITLE=function(t){return '<div style="text-align:center;margin:0 0 12px"><span style="display:inline-block;font-size:24px;font-weight:700;color:'+NV+';border-bottom:2px solid '+NV+';padding:0 18px 2px">'+esc(t)+'</span></div>'};
var F={head:head,meta:meta,metaLine:metaLine,sign:sign,cc:cc,verify:verify,foot:foot,page:page,P:P,TITLE:TITLE,PORT:PORT};
X.f289=F;

/* ---------- خطاب القبول وخطابات التوصية: يُبنى من بيانات الخطاب الأصلي في الإطار الرسمي ---------- */
var CFG={acc:{unit:'إدارة القبول والتسجيل',unitEn:'Admission & Registration',login:'stu',vl:'التحقق من الخطاب',cc:['الطالب المعني','إدارة القبول والتسجيل','الملف الأكاديمي'],sal:1},
 rec:{unit:'إدارة شؤون الطلاب',unitEn:'Student Affairs',vl:'التحقق من الخطاب',cc:['الملف الأكاديمي']}};
function letter289(h,c){
 var K=CFG[c.type];if(!K||typeof h!=='string'||h.indexOf('data-l59="1"')<0&&h.indexOf('l59-')<0)return null;
 var d=document.createElement('div');d.innerHTML=h;
 var tt=((d.querySelector('.l59-tt .ar')||{}).textContent||'').trim()||(c.type==='acc'?'خطاب قبول':'خطاب توصية');
 var to=((d.querySelector('.l59-to .ar')||{}).textContent||'').trim()||'إلى من يهمه الأمر';
 var rows=[].slice.call(d.querySelectorAll('.l59-tb tr')).map(function(tr){var th=tr.querySelector('th.a'),td=tr.querySelector('td.a')||tr.querySelector('td.c')||tr.querySelector('td');return th&&td?[th.textContent.trim(),td.innerHTML.trim()]:null}).filter(function(r){return r&&r[1]&&r[1]!=='—'});
 var pa=d.querySelector('.l59-pa'),body=pa?pa.innerHTML:'';body=body.split(/<br>\s*<b>\s*إرشادات/)[0].replace(/(<br>\s*)+$/,'');
 var sgs=[].slice.call(d.querySelectorAll('.l59-sg')).map(function(s){var g=function(k){return ((s.querySelector('.'+k)||{}).textContent||'').trim()},im=s.querySelector('.im img');return {t:g('t'),n:g('n'),src:im?im.getAttribute('src'):''}});
 if(!sgs.length)sgs=signers(c.type).slice(0,2);
 var st={};try{st=(S.students||[]).find(function(x){return String(x.id)===String(c.sid||c.uid)})||{}}catch(e){}
 var sx=String(st.sex||st.gender||c.sex||''),w=function(m,f,b){return /^(أنثى|انثى|female|f)$/i.test(sx)?f:/^(ذكر|male|m)$/i.test(sx)?m:b};
 var nm=c.name||'',sal=K.sal?'<p style="margin:0 0 6px;font-size:16px"><b>'+w('المكرم الطالب','المكرمة الطالبة','المكرم/ـة الطالب/ـة')+': '+esc(nm)+'</b> &nbsp;&nbsp;&nbsp; '+w('المحترم','المحترمة','المحترم/ـة')+'</p>':'<p style="margin:0 0 6px;font-size:16px;font-weight:700">'+esc(to)+'</p>';
 var tb=rows.length?'<div style="margin:4px 0 12px;border:1px solid #b9c2cf;border-radius:2px">'+rows.map(function(r,i){return '<div style="display:flex;font-size:14.5px;line-height:1.6;'+(i?'border-top:1px solid #dde2ea;':'')+'"><div style="width:150px;flex:none;background:#f3f5f9;padding:3px 10px;font-weight:700;color:'+NV+';border-left:1px solid #dde2ea">'+esc(r[0])+'</div><div style="padding:3px 10px">'+r[1]+'</div></div>'}).join('')+'</div>':'';
 var subj=(c.type==='acc'?'قبول '+w('الطالب','الطالبة','الطالب/ـة')+' ':(c.tzk?'توصية '+w('للخريج','للخريجة','للخريج/ـة')+' ':'توصية '+w('للطالب','للطالبة','للطالب/ـة')+' '))+esc(nm);
 var KCC=K.cc.map(function(x){return x==='الطالب المعني'?w('الطالب المعني','الطالبة المعنية','الطالب/ـة المعني/ـة'):x});
 var sigH=sgs.slice(0,3).map(function(s){return sign(s,sgs.length>2?200:250)}).join('');
 var h2=head({unit:K.unit,unitEn:K.unitEn})+meta({rec:c.rec,date:c.date||new Date().toISOString().slice(0,10),att:c.att})+
  '<div style="position:absolute;top:262px;right:64px;left:64px;'+A+';color:#111">'+
   '<p style="margin:0 0 10px;font-size:16px"><b>الموضوع:</b> '+subj+'</p>'+TITLE(tt)+sal+
   '<p style="margin:0 0 8px;font-size:16px">السلام عليكم ورحمة الله وبركاته، وبعد:</p>'+tb+
   P(body)+
   '<p style="margin:8px 0 0;font-size:16px;text-align:center">وتقبلوا خالص التحية والتقدير،،،</p>'+
   '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:14px">'+
    '<div style="padding-top:30px">'+cc(KCC)+'</div><div style="display:flex;gap:18px">'+sigH+'</div></div>'+
  '</div>'+
  verify({rec:c.rec,qr:X.qrV64?X.qrV64(c.rec):'',vl:K.vl,login:K.login?{k:K.login,id:c.sid||c.uid,how:'بالرقم الأكاديمي'}:null})+foot();
 return page(h2,c.type)}
X.letter289=letter289;

/* ---------- شهادات البرامج القصيرة: شهادة رسمية على الإطار نفسه ---------- */
function cert289(o){
 var R=o.rows||[],TI=o.TI||['شهادة','Certificate'],get=function(k){return R.filter(function(r){return r[0]===k}).map(function(r){return r[1]})};
 var line=function(t,st){return t?'<p style="margin:0 0 10px;font-size:18px;line-height:1.9;text-align:center;'+(st||'')+'">'+esc(t)+'</p>':''};
 var lead=R.filter(function(r){return r[0]!=='n'&&r[0]!=='l'&&r[0]!=='t'&&r[0]!=='p'&&r[0]!=='r'&&r[0]!=='e'&&r[0]!=='d'}).map(function(r){return r[1]});
 var body=lead.map(function(t){return line(t)}).join('')+
  get('n').map(function(t){return '<p style="margin:2px 0 12px;font-size:28px;font-weight:700;color:'+NV+';text-align:center">'+esc(t)+'</p>'}).join('')+
  get('l').map(function(t){return line(t)}).join('')+
  get('t').map(function(t){return line('«'+t+'»',"font-weight:700")}).join('')+
  get('p').map(function(t){return '<p style="margin:0 0 12px;font-size:22px;font-weight:700;color:'+NV+';text-align:center">«'+esc(t)+'»</p>'}).join('')+
  get('r').concat(get('e')).map(function(t){return line(t)}).join('')+
  get('d').map(function(t){return line(t)}).join('')+
  '<p style="margin:14px 0 0;font-size:17px;text-align:center">والله ولي التوفيق،،،</p>';
 var sg=(o.sg||[]).slice(0,3),sgH=sg.map(function(s){return sign(s,sg.length>2?200:250)}).join('');
 var h=head({unit:'إدارة التدريب والبرامج القصيرة',unitEn:'Training & Short Programs'})+meta({rec:o.rec,date:o.date||new Date().toISOString().slice(0,10),att:false,noLbl:'رقم الشهادة'})+
  '<div style="position:absolute;top:250px;right:70px;left:70px;'+A+';color:#111">'+
   '<div style="text-align:center;margin:0 0 22px"><span style="display:inline-block;font-size:34px;font-weight:700;color:'+NV+';border-bottom:2px solid '+NV+';padding:0 26px 4px">'+esc(TI[0])+'</span></div>'+body+'</div>'+
  '<div style="position:absolute;top:740px;right:64px;left:64px;display:flex;justify-content:'+(sg.length>1?'space-between':'flex-end')+'">'+sgH+'</div>'+
  (o.revoked?'<div style="position:absolute;top:470px;left:0;right:0;text-align:center;transform:rotate(-18deg);font:700 64px Amiri,serif;color:rgba(160,20,20,.35)">ملغاة</div>':'')+
  (o.miss&&o.miss.length?'<div style="position:absolute;top:700px;right:64px;left:64px;border:2px solid #a01414;color:#a01414;padding:6px 10px;'+A+';font-size:13px;background:#fff"><b>مسودة — لا تصدر لنقص البيانات:</b> '+o.miss.map(function(m){return esc(m.ar)}).join('، ')+'</div>':'')+
  verify({rec:o.rec,qr:X.qrV64?X.qrV64(o.rec):'',vl:'التحقق من الشهادة'})+foot();
 var out=page(h,'sp');if(o.miss&&o.miss.length)out=out.replace('data-l289="sp"','data-l289="sp" data-incomplete="1"');return out}
X.cert287=cert289;X.cert289=cert289;

/* ---------- نماذج التدريب الميداني ومشروع التخرج ---------- */
var NFU={tr:['وحدة التدريب الميداني','Field Training Unit','grad'],gp:['وحدة مشاريع التخرج','Graduation Projects Unit','grad'],ex:['وحدة التدريب الميداني الخارجي','External Field Training Unit','trn']};
X.nf289={geo:{t1:198,tn:198,b:955,l:790},
 head:function(D,ref,issued){var u=NFU[D&&D.k]||NFU.tr;return '<style>.nfp .rule,.nfp .l59-band{display:none!important}</style>'+head({unit:u[0],unitEn:u[1],noWm:1})+metaLine({rec:ref,date:issued})},
 foot:function(D,ref,issued,n,N,last,url,Pr){var u=NFU[D&&D.k]||NFU.tr,h='';
  if(last){h+='<div style="position:absolute;top:800px;left:66px">'+sign({t:Pr&&Pr.t,n:Pr&&Pr.n,src:Pr&&Pr.sig})+'</div>'+
   '<div style="position:absolute;top:822px;right:71px;width:330px;'+A+';font-size:12.5px;line-height:1.7;color:#333">التوقيع المعتمد في هذا النموذج هو توقيع رئيس المعهد، وما سواه من توقيعات يُضاف بخط اليد بعد الطباعة.</div>'}
  return h+verify({rec:ref,qr:url,vl:'التحقق من النموذج',login:{k:u[2]},pg:'صفحة '+n+' من '+N})+foot()}};

/* ---------- التوجيه: القبول والتوصية إلى الإطار الجديد ---------- */
try{var _ch=certHTML;if(typeof _ch==='function'&&!_ch.__v289){certHTML=function(c){var h=_ch.apply(this,arguments);
  if(c&&(c.type==='acc'||c.type==='rec')&&c.lang!=='en'&&!c.old289){try{var n=letter289(h,c);if(n)return n}catch(e){console.error('v289 letter',e)}}return h};certHTML.__v289=1;certHTML.__v287=1;try{W.certHTML=certHTML}catch(e){}}}catch(e){console.error('v289 wrap',e)}
}catch(e){console.error('v289',e)}})();

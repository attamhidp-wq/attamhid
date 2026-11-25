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
 return '<div style="position:absolute;top:161px;right:71px;left:71px;display:flex;justify-content:space-between;'+A+';font-size:13.5px;color:#111;direction:rtl">'+
  '<span>الرقم: <bdi dir="ltr">'+esc(o.rec)+'</bdi></span><span>التاريخ: '+(hd?'<bdi dir="ltr">'+esc(hd)+'</bdi>هـ الموافق ':'')+'<bdi dir="ltr">'+esc(dmy(o.date))+'</bdi>م</span><span>المرفقات: '+(o.att?esc(o.att):'بدون')+'</span></div>'}
function sign(s,w){s=s||{};var im='';try{im=s.src||(s.img&&X.imgOf?X.imgOf(s.img):'')}catch(e){}
 return '<div style="width:'+(w||260)+'px;text-align:center;'+A+';color:#111"><div style="font-size:16px;font-weight:700">'+esc(s.t||'رئيس المعهد')+'</div>'+
  '<div style="height:'+(s.sm?40:58)+'px;margin:2px 0;display:flex;align-items:center;justify-content:center">'+(im?'<img src="'+im+'" alt="" style="height:'+(s.sm?38:54)+'px;max-width:170px;object-fit:contain">':'')+'</div>'+
  '<div style="font-size:15.5px;font-weight:700">'+esc(s.n||'')+'</div></div>'}
function signers(type){var r=[];try{r=(X.resolveSigners&&X.resolveSigners(type))||[]}catch(e){}return r}
function cc(list){return list&&list.length?'<div style="'+A+';font-size:12.5px;line-height:1.7;color:#333"><b>صورة مع التحية إلى:</b>'+list.map(function(x){return '<br>- '+esc(x)+'.'}).join('')+'</div>':''}
function verify(o){var Q='';try{Q=o.qr?qr(o.qr):''}catch(e){}var P=o.login&&PORT[o.login.k];
 return '<div style="position:absolute;bottom:90px;right:54px;left:54px;display:flex;align-items:center;gap:12px;'+A+';font-size:12.5px;color:#222;line-height:1.7;border-top:1px dashed #9aa4b1;padding-top:8px">'+
  (Q?'<img src="'+Q+'" alt="" style="width:54px;height:54px">':'')+
  '<div style="flex:1"><b>للتحقق يرجى مسح الرمز.</b>'+
  (P?'<br>الدخول إلى «'+P[0]+'»: <b dir="ltr" style="'+E+'">'+SITE+'/'+P[1]+'</b>':'')+'</div>'+
  (o.pg?'<div style="white-space:nowrap;font-size:12px;color:#555">'+o.pg+'</div>':'')+'</div>'}
function foot(){var I=inst(),H={};try{H=S.home||{}}catch(e){}
 return '<div style="position:absolute;bottom:50px;right:54px;left:54px;border-top:2px solid '+NV+';padding-top:6px;text-align:center;'+A+';font-size:12.5px;color:'+NV+'">'+
  (I.addrAr?esc(I.addrAr)+' &nbsp;|&nbsp; ':'')+(H.p1?'الهاتف: <bdi dir="ltr">'+esc(H.p1)+'</bdi> &nbsp;|&nbsp; ':'')+(H.em?'البريد: <bdi dir="ltr">'+esc(H.em)+'</bdi> &nbsp;|&nbsp; ':'')+'<b dir="ltr" style="'+E+'">'+SITE+'</b></div>'}
function page(inner,tag){return '<div class="tmw" data-d14="1" data-l289="'+(tag||1)+'"><div class="tmp d14 l287" style="background:#fff;position:relative;overflow:hidden">'+inner+'</div></div>'}
var P=function(t,st){return '<p style="margin:0 0 8px;font-size:16px;line-height:1.95;text-align:justify;'+(st||'')+'">'+t+'</p>'};
var TITLE=function(t){return '<div style="text-align:center;margin:0 0 12px"><span style="display:inline-block;font-size:24px;font-weight:700;color:'+NV+';border-bottom:2px solid '+NV+';padding:0 18px 2px">'+esc(t)+'</span></div>'};
var F={head:head,meta:meta,metaLine:metaLine,sign:sign,cc:cc,verify:verify,foot:foot,page:page,P:P,TITLE:TITLE,PORT:PORT};
X.f289=F;

/* ---------- الخطابات (القبول، التوصية، التعريف، الإفادة المالية): نص رسمي متصل على نموذج خطاب التعيين، دون جداول ---------- */
var CFG={acc:{unit:'إدارة القبول والتسجيل',unitEn:'Admission & Registration',login:'stu',vl:'التحقق من الخطاب',cc:['إدارة القبول والتسجيل','الإدارة المالية','الملف الأكاديمي']},
 rec:{unit:'إدارة شؤون الطلاب',unitEn:'Student Affairs',vl:'التحقق من الخطاب',cc:['الملف الأكاديمي']},
 intro:{unit:'إدارة شؤون الطلاب',unitEn:'Student Affairs',vl:'التحقق من الخطاب',cc:['الملف']},
 fin:{unit:'الإدارة المالية',unitEn:'Finance Department',vl:'التحقق من الإفادة',cc:['الإدارة المالية','الملف الأكاديمي']}};
var ORD=['أولاً','ثانياً','ثالثاً','رابعاً','خامساً','سادساً'];
var ITEM=function(t,k){return '<p style="margin:0 0 7px;font-size:16px;line-height:1.95;text-align:justify;padding-right:64px;text-indent:-64px"><b style="display:inline-block;width:64px;text-indent:0">'+ORD[k]+':</b>'+t+'</p>'};
function letter289(h,c){
 var K=CFG[c.type];if(!K||typeof h!=='string'||h.indexOf('l59-')<0)return null;
 var d=document.createElement('div');d.innerHTML=h;
 var tt=((d.querySelector('.l59-tt .ar')||{}).textContent||'').trim();
 var R={},RO=[];[].slice.call(d.querySelectorAll('.l59-tb tr')).forEach(function(tr){var th=tr.querySelector('th.a'),td=tr.querySelector('td.a')||tr.querySelector('td.c')||tr.querySelector('td');if(th&&td){var v=td.innerHTML.trim();if(v&&v!=='—'&&v!=='-'){var k=th.textContent.trim();if(k==='نمط الدراسة'&&/المستوى/.test(v))k='المستوى';R[k]=v;RO.push([k,v])}}});
 var DATA=RO.length?'<div style="margin:6px 0 12px;padding:0 4px">'+RO.map(function(r){var v=/^[0-9A-Za-z\-\/ ]+$/.test(r[1].replace(/<[^>]+>/g,''))?'<bdi dir="ltr">'+String(r[1]).replace(/^(\d{2})-(\d{2})-(\d{4})$/,'$1/$2/$3')+'</bdi>':r[1];return '<div style="display:flex;font-size:15.5px;line-height:1.85"><b style="width:140px;flex:none">'+esc(r[0])+'</b><span style="width:16px;flex:none">:</span><span>'+v+'</span></div>'}).join('')+'</div>':'';
 var pa=d.querySelector('.l59-pa'),txt=pa?pa.innerHTML:'';txt=txt.split(/<br>\s*<b>\s*إرشادات/)[0].replace(/(<br>\s*)+$/,'');
 var sgs=[].slice.call(d.querySelectorAll('.l59-sg')).map(function(s){var g=function(k){return ((s.querySelector('.'+k)||{}).textContent||'').trim()},im=s.querySelector('.im img');return {t:g('t'),n:g('n'),src:im?im.getAttribute('src'):''}});
 if(!sgs.length)sgs=signers(c.type).slice(0,2);
 var st={};try{st=(S.students||[]).find(function(x){return String(x.id)===String(c.sid||c.uid)})||{}}catch(e){}
 var isStu=!!(R['الرقم الأكاديمي']||st.id);
 var sx=String(st.sex||st.gender||c.sex||''),w=function(m,f,b){return /^(أنثى|انثى|female|f)$/i.test(sx)?f:/^(ذكر|male|m)$/i.test(sx)?m:b};
 var nm=c.name||R['الاسم']||'',prog=R['البرنامج']||'';
 var ids=[];if(R['الجنسية'])ids.push('الجنسية: '+R['الجنسية']);if(R['رقم الهوية'])ids.push('رقم الهوية: <bdi dir="ltr" style="white-space:nowrap">'+R['رقم الهوية']+'</bdi>');if(R['الرقم الأكاديمي']&&c.type!=='acc')ids.push('الرقم الأكاديمي: <bdi dir="ltr" style="white-space:nowrap">'+R['الرقم الأكاديمي']+'</bdi>');if(R['الرقم الوظيفي'])ids.push('الرقم الوظيفي: <bdi dir="ltr" style="white-space:nowrap">'+R['الرقم الوظيفي']+'</bdi>');
 var who=(isStu?w('الطالب','الطالبة','الطالب/ـة'):w('المكرم','المكرمة','المكرم/ـة'))+'/ <b>'+esc(nm)+'</b>'+(ids.length?' ('+ids.join('، ')+')':'');
 var unit=K.unit;if(c.type==='intro'&&!isStu)unit='إدارة الموارد البشرية';
 var body='',salute='',subj='';
 if(c.type==='acc'){
  subj='قبول '+w('الطالب','الطالبة','الطالب/ـة')+'/ '+esc(nm)+(prog?' في برنامج '+prog:'');
  salute='<p style="margin:0 0 6px;font-size:16px"><b>'+w('عزيزي الطالب','عزيزتي الطالبة','عزيزي الطالب/ عزيزتي الطالبة')+'/ '+esc(nm)+'</b></p>';
  var it=['قبول'+w('ك','كِ','ك')+' '+w('طالباً','طالبةً','طالباً/ـة')+' في '+(prog?'برنامج <b>«'+prog+'»</b>':'البرنامج المذكور أعلاه')+'، بعد استيفائ'+w('ك','كِ','ك')+' شروط القبول المعتمدة.',
   'تبدأ دراست'+w('ك','كِ','ك')+' في الفصل الدراسي والتاريخ المذكورين أعلاه، وتُستكمل إجراءات التسجيل عبر البوابة قبل ذلك.',
   (R['الرقم الأكاديمي']?'رقم'+w('ك','كِ','ك')+' الأكاديمي المذكور أعلاه هو رقم الدخول إلى البوابة ورقم جميع المعاملات في المعهد.':''),
   'الالتزام بسداد رسوم البرنامج المقررة لكل فصل دراسي، وما يتعلق بها من رسوم مقررة إن وُجدت، في مواعيدها المحددة.',
   c.adm_cond?'يكون القبول مشروطاً بما يلي: '+esc(c.adm_cond)+'.':'',
   'الالتزام بأنظمة المعهد ولوائحه وتعليماته.'].filter(Boolean);
  body='<p style="margin:0 0 8px;font-size:16px;line-height:1.95">يسرّ '+esc(inst().nameAr||'معهد التمهيد')+' أن '+w('يهنئك','يهنئكِ','يهنئك')+' ويُبلغ'+w('ك','كِ','ك')+' بما يلي:</p>'+it.map(ITEM).join('')+
   '<p style="margin:6px 0 0;font-size:16px;line-height:1.95">متمنين ل'+w('ك','كِ','ك')+' التوفيق والنجاح.</p>';
 }else{
  var t=txt;
  subj=(c.type==='rec'?(c.tzk?'توصية '+w('للخريج','للخريجة','للخريج/ـة'):'توصية '+w('للطالب','للطالبة','للطالب/ـة')):c.type==='fin'?'إفادة مالية عن '+w('الطالب','الطالبة','الطالب/ـة'):'تعريف ب'+(isStu?w('الطالب','الطالبة','الطالب/ـة'):w('المكرم','المكرمة','المكرم/ـة')))+'/ '+esc(nm);
  salute='<p style="margin:0 0 6px;font-size:16px;font-weight:700">إلى من يهمه الأمر</p>';
  body='<p style="margin:0 0 8px;font-size:16px;line-height:2;text-align:justify;text-indent:28px">'+t+'</p>';
 }
 var KCC=K.cc.map(function(x){return x==='@'?w('الطالب المعني','الطالبة المعنية','الطالب/ـة المعني/ـة'):x==='الملف'?(isStu?'الملف الأكاديمي':'الملف الوظيفي'):x});
 var sigH=sgs.slice(0,3).map(function(s){return sign(s,sgs.length>2?200:250)}).join('');
 var h2=head({unit:unit,unitEn:unit===K.unit?K.unitEn:'Human Resources'})+meta({rec:c.rec,date:c.date||new Date().toISOString().slice(0,10),att:c.att})+
  '<div style="position:absolute;top:262px;right:64px;left:64px;'+A+';color:#111">'+
   '<p style="margin:0 0 12px;font-size:16px"><b>الموضوع:</b> '+subj+'</p>'+TITLE(tt||'خطاب')+salute+
   '<p style="margin:0 0 8px;font-size:16px">السلام علي'+(c.type==='acc'?'ك':'كم')+' ورحمة الله وبركاته، وبعد:</p>'+DATA+body+
   '<p style="margin:12px 0 0;font-size:16px;text-align:center">'+(c.type==='acc'?'والله ولي التوفيق،،،':'وتقبلوا خالص التحية والتقدير،،،')+'</p></div>'+
  '<div style="position:absolute;top:836px;right:64px;left:64px;display:flex;justify-content:space-between;align-items:flex-start">'+
   '<div style="padding-top:6px">'+cc(KCC)+'</div><div style="display:flex;gap:18px">'+sigH+'</div></div>'+
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
X.cert289v=cert289;/* شهادات البرامج القصيرة تبقى على تصميمها الأفقي الأصلي */

/* ---------- نماذج التدريب الميداني ومشروع التخرج ---------- */
var NFU={tr:['وحدة التدريب الميداني','Field Training Unit','grad'],gp:['وحدة مشاريع التخرج','Graduation Projects Unit','grad'],ex:['وحدة التدريب الميداني الخارجي','External Field Training Unit','trn']};
var ORDN=['أولاً','ثانياً','ثالثاً','رابعاً','خامساً','سادساً','سابعاً','ثامناً','تاسعاً','عاشراً','حادي عشر','ثاني عشر','ثالث عشر','رابع عشر','خامس عشر'];
var dig=function(x){return +String(x).replace(/[٠-٩]/g,function(c){return '٠١٢٣٤٥٦٧٨٩'.indexOf(c)})};
X.nf289={geo:{t1:192,tn:192,b:958,l:868},
 css:'.nfp .en,.nfp .tm .e,.nfp .tt .en,.nfp .nfbd [dir="ltr"][style*="display:block"],.nfp .nfbd p[dir="ltr"]{display:none!important}'+
  '.nfp .sec{border-bottom:0!important;margin:12px 0 6px!important;padding:0!important}.nfp .sec h2{font:700 16.5px Amiri,serif!important;color:'+NV+'!important}'+
  '.nfp table.kv th,.nfp table.kv td,.nfp table.tb th,.nfp table.tb td{border:.8px solid #8a929e!important;background:#fff!important;height:26px!important;padding:2px 8px!important}'+
  '.nfp table.kv th,.nfp table.tb th{color:#111!important;font:700 14px Amiri,serif!important}.nfp table.kv td,.nfp table.tb td{font:400 14.5px Amiri,serif!important;color:#111}'+
  '.nfp table.tb tr:first-child th{background:#f2f3f5!important;text-align:center!important}'+
  '.nfp .box{border:.8px solid #8a929e!important}.nfp .boxs{background:#fff!important}.nfp p.tx{font:400 15px/1.8 Amiri,serif!important;color:#111}'+
  '.nfp .sig>div{border:0!important;border-bottom:.8px solid #8a929e!important;padding:4px 2px!important;min-height:70px!important}.nfp .sig .r{color:#111!important;font:700 14px Amiri,serif!important}'+
  '.nfp .sec h2 + *{margin-top:0}.nfp .chk i{border-color:#333!important}.nfp span[style*="flex:1"] .blank{border-bottom:1px dotted #8b94a6;height:20px}',
 blk:function(b){return String(b).replace(/<span class="en"[^>]*>[\s\S]*?<\/span>/g,'').replace(/<span class="n">\s*([٠-٩0-9]+)\.?\s*<\/span>/g,function(m,n){var k=dig(n);return '<span class="n">'+(ORDN[k-1]||n)+': </span>'})},
 title:function(D,term){return '<div style="text-align:center;margin:0 0 6px;'+A+'"><span style="display:inline-block;font-size:22px;font-weight:700;color:'+NV+';border-bottom:2px solid '+NV+';padding:0 16px 2px">'+esc(D.t[0])+'</span>'+(D.conf?' <span style="display:inline-block;border:1.2px solid #8a1c1c;color:#8a1c1c;padding:0 8px;font-size:13px;vertical-align:middle">سري</span>':'')+
  '<div style="font-size:13px;color:#333;margin-top:4px">رمز النموذج: '+esc(D.code)+(term?' &nbsp;—&nbsp; الفصل الدراسي: '+esc(term):'')+'</div></div>'},
 lines:function(h){var d=document.createElement('div');d.innerHTML=h;
  var one=function(k,v,w){return '<div style="display:flex;'+(w?'width:50%;':'flex:1;')+'"><b style="width:112px;flex:none">'+k+'</b><span style="width:14px;flex:none">:</span><span style="flex:1;padding-left:10px">'+v+'</span></div>'};
  [].slice.call(d.querySelectorAll('table.kv')).forEach(function(tb){var L=[];[].slice.call(tb.querySelectorAll('tr')).forEach(function(tr){var c=[].slice.call(tr.children),P=[];for(var i=0;i+1<c.length;i+=2)if(c[i].tagName==='TH')P.push([c[i].innerHTML,c[i+1].innerHTML]);if(P.length)L.push('<div style="display:flex;font-size:15px;line-height:1.85;'+A+'">'+P.map(function(p){return one(p[0],p[1],P.length>1)}).join('')+'</div>')});
   var w=document.createElement('div');w.innerHTML='<div style="margin:2px 0 8px;padding:0 4px">'+L.join('')+'</div>';tb.parentNode.replaceChild(w.firstChild,tb)});return d.innerHTML},
 tt2:function(D,n){return '<div style="display:flex;justify-content:space-between;margin:0 0 8px;padding-bottom:3px;border-bottom:.8px solid #8a929e;'+A+';font-size:14.5px;color:'+NV+'"><b>'+esc(D.t[0])+' (تابع)</b><span>صفحة '+n+'</span></div>'},
 head:function(D,ref,issued){var u=NFU[D&&D.k]||NFU.tr;return '<style>.nfp .rule,.nfp .l59-band{display:none!important}</style>'+head({unit:u[0],unitEn:u[1],noWm:1})+metaLine({rec:ref,date:issued})},
 foot:function(D,ref,issued,n,N,last,url,Pr){var u=NFU[D&&D.k]||NFU.tr,h='';
  if(last){h+='<div style="position:absolute;top:866px;left:66px">'+sign({t:Pr&&Pr.t,n:Pr&&Pr.n,src:Pr&&Pr.sig,sm:1})+'</div>'+
   ''}
  return h+verify({rec:ref,qr:url,vl:'التحقق من النموذج',login:{k:u[2]},pg:'صفحة '+n+' من '+N})+foot()}};

/* ---------- التوجيه: القبول والتوصية إلى الإطار الجديد ---------- */
try{var _ch=certHTML;if(typeof _ch==='function'&&!_ch.__v289){certHTML=function(c){var h=_ch.apply(this,arguments);
  if(c&&/^(acc|rec|intro|fin)$/.test(c.type)&&c.lang!=='en'&&!c.old289){try{var n=letter289(h,c);if(n)return n}catch(e){console.error('v289 letter',e)}}return h};certHTML.__v289=1;certHTML.__v287=1;try{W.certHTML=certHTML}catch(e){}}}catch(e){console.error('v289 wrap',e)}
}catch(e){console.error('v289',e)}})();

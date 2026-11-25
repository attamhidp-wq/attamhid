/* =====================================================================
   v287 — الخطابات الرسمية على الأعراف الدولية للقرارات والخطابات:
   1) خطاب التعيين قراراً رسمياً: الرقم والتاريخ والمرفقات أعلى الخطاب، والموضوع، و«قرار»، ثم «يقرر ما يلي» ببنود مرقمة،
      وتوقيع بحجمه الطبيعي وختم صغير، ورابط دخول البوابة ورابط التحقق مكتوبين.
   2) كل خطاب رسمي (نموذج l59) يحمل رابط موقع المعهد كتابة في تذييله، والختم بحجم طبيعي.
   3) الخطابات التي تحتاج دخولاً (القبول والتعيين) تحمل رابط الدخول إلى بوابتها كتابة تحت رمزه.
   لا بيانات شخصية في الشيفرة.
   ===================================================================== */
(function(){try{
var W=window,X=W.V51;if(!X)return;
var esc=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var site=function(){var b='https://attamhid.com/';try{b=X.qrBase64?X.qrBase64():b}catch(e){}return String(b).replace(/\/+$/,'')+'/'};
var bare=function(u){return String(u||'').replace(/^https?:\/\//i,'').replace(/\/+$/,'')};
var dmy=function(d){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(d||''));return m?m[3]+'/'+m[2]+'/'+m[1]:String(d||'')};
var hij=function(d){try{return X.hijri?X.hijri(String(d).slice(0,10)):''}catch(e){return ''}};
var months=function(a,b){var x=/^(\d{4})-(\d{2})-(\d{2})/.exec(a||''),y=/^(\d{4})-(\d{2})-(\d{2})/.exec(b||'');if(!x||!y)return 0;var n=(+y[1]-+x[1])*12+(+y[2]-+x[2])+((+y[3]>=+x[3]-1)?1:0);return n>0?n:0};
var ORD=['أولاً','ثانياً','ثالثاً','رابعاً','خامساً','سادساً'],ORDE=['First','Second','Third','Fourth','Fifth','Sixth'];
var TYPE={contract:['متعاقد','contract'],perm:['رسمي','permanent'],permanent:['رسمي','permanent'],part:['متعاون','part-time'],visiting:['زائر','visiting']};

/* ---------- خطاب التعيين: قرار رسمي ---------- */
function doc287(c){
 var o=(S.faculty||[]).find(function(f){return String(f.id)===String(c.uid)})||{},a=o.appt64||{},I=(S.v51&&S.v51.inst)||{},H=S.home||{};
 var fem=/^(أنثى|انثى|female|f)$/i.test(String(o.sex||o.gender||'')),w=function(m,f){return fem?f:m};
 var nm=c.name||o.name||'',ne=c.nameEn||o.nameEn||a.nameEn||'',id=String(o.id||c.uid||'');
 var dt=c.date||new Date().toISOString().slice(0,10),hd=hij(dt),tp=TYPE[a.type]||[a.type||'—',a.type||'—'],mo=months(a.start,a.end);
 var by=a.decBy||'مجلس الشؤون التعليمية',byE=a.decByEn||'Board of Educational Affairs';
 var portal=X.qrP64?X.qrP64(id):site()+'?p='+encodeURIComponent(id),ver=X.qrV64?X.qrV64(c.rec):site()+'?v='+encodeURIComponent(c.rec);
 var QP='',QV='';try{QP=qr(portal);QV=qr(ver)}catch(e){}
 var sg=[],se=[];try{sg=(X.resolveSigners&&X.resolveSigners('appt'))||[]}catch(e){}try{se=((X.resolveSeals&&X.resolveSeals('appt'))||[]).map(function(s){return X.imgOf?X.imgOf(typeof s==='string'?s:s&&s.img):''}).filter(Boolean)}catch(e){}
 var duties=String(a.duties||'').split(/\n+/).map(function(x){return x.trim()}).filter(Boolean),dutiesE=String(a.dutiesEn||'').split(/\n+|;\s*/).map(function(x){return x.trim()}).filter(Boolean);
 var lg='';try{lg=LOGO}catch(e){}
 var band=X.band59||function(){return ''};
 var A='font-family:Amiri,\'Traditional Arabic\',serif',E='font-family:Tinos,\'Times New Roman\',serif';
 var TPH={contract:'بنظام التعاقد',perm:'تعييناً رسمياً',permanent:'تعييناً رسمياً',part:'بنظام التعاون (دوام جزئي)',visiting:'أستاذاً زائراً'}[a.type]||'';
 var AB=['أ','ب','ج','د','هـ','و','ز','ح','ط','ي'];
 var items=[
  'تعيين '+w('المكرم','المكرمة')+'/ <b>'+esc(nm)+'</b>'+(o.nat?' (الجنسية: '+esc(o.nat)+')':'')+' على وظيفة <b>'+esc(a.rank||'—')+'</b> ب'+esc(a.dept||'القسم المختص')+'، ويكون '+w('رقمه','رقمها')+' العضوي ('+esc(id)+').',
  'تبدأ مدة التكليف من '+esc(dmy(a.start))+'م'+(a.end?' إلى '+esc(dmy(a.end))+'م'+(mo?' ('+mo+' شهراً)':''):'')+'، ويُعدّ التعيين نافذاً اعتباراً من تاريخ المباشرة.',
  duties.length?'يُكلَّف'+w('','')+' بالمهام الآتية:'+duties.map(function(x,k){return '<span style="display:block;padding-right:22px">'+(AB[k]||(k+1))+'- '+esc(x.replace(/[.،]+$/,''))+'.</span>'}).join(''):'',
  'يُبلَّغ هذا القرار لمن يلزم لتنفيذه، ويُعمل به من تاريخه.'].filter(Boolean);
 var itemsE=[
  'To appoint '+w('Mr.','Ms.')+' <b>'+esc(ne||nm)+'</b> as <b>'+esc(a.rankEn||a.rank||'—')+'</b>, '+esc(a.deptEn||a.dept||'')+', on a '+esc(tp[1])+' basis, faculty no. '+esc(id)+'.',
  'The term runs from '+esc(dmy(a.start))+(a.end?' to '+esc(dmy(a.end))+(mo?' ('+mo+' months)':''):'')+', effective from the date of reporting for duty.',
  dutiesE.length?'Assigned duties: '+dutiesE.map(function(x){return esc(x.replace(/[.;]+$/,''))}).join('; ')+'.':'',
  'This decision is communicated to all concerned for implementation, effective from its date.'].filter(Boolean);
 var s0=sg[0]||{},AN=function(n){return String(n)};
 var unit=a.unitAr||'إدارة شؤون أعضاء هيئة التدريس';
 var h='<div class="tmw" data-d14="1" data-l287="1"><div class="tmp d14 l287" style="background:#fff">'+
  /* ترويسة رسمية بسيطة: العربية يميناً، الشعار وسطاً، الإنجليزية يساراً */
  '<div style="position:absolute;top:44px;right:54px;left:54px;display:flex;align-items:center;justify-content:space-between">'+
   '<div style="text-align:center;'+A+';font-size:15px;line-height:1.6;color:#111;min-width:220px"><b style="font-size:17px">'+esc(I.nameAr||'معهد التمهيد')+'</b><br>'+esc(by)+'<br>'+esc(unit)+'</div>'+
   (lg?'<img src="'+lg+'" alt="" style="height:62px">':'')+
   '<div dir="ltr" style="text-align:center;'+E+';font-size:13px;line-height:1.6;color:#111;min-width:220px"><b style="font-size:14.5px">'+esc(I.nameEn||'At Tamhid Institute')+'</b><br>'+esc(byE)+'<br>Faculty Affairs</div></div>'+
  '<div style="position:absolute;top:142px;right:54px;left:54px;border-top:1.5px solid #222"></div>'+
  /* الرقم والتاريخ والمرفقات */
  '<div style="position:absolute;top:154px;left:60px;'+A+';font-size:14px;line-height:1.75;color:#111;text-align:right;direction:rtl">'+
   '<div>الرقم: <bdi dir="ltr">'+esc(c.rec)+'</bdi></div><div>التاريخ: '+(hd?'<bdi dir="ltr">'+esc(hd)+'</bdi>هـ':'<bdi dir="ltr">'+esc(dmy(dt))+'</bdi>م')+'</div><div>المرفقات: '+(a.att||c.att?esc(a.att||c.att):'بدون')+'</div></div>'+
  /* المتن */
  '<div style="position:absolute;top:252px;right:64px;left:64px;'+A+';color:#111">'+
   '<p style="margin:0 0 14px;font-size:16px"><b>الموضوع:</b> قرار تعيين '+w('المكرم','المكرمة')+'/ '+esc(nm)+' على وظيفة '+esc(a.rank||'—')+'</p>'+
   '<div style="text-align:center;font-size:24px;font-weight:700;margin:0 0 14px"><u>قرار</u></div>'+
   '<p style="margin:0 0 4px;font-size:16.5px;line-height:2">إن '+esc(by)+' بمعهد التمهيد،</p>'+
   '<p style="margin:0 0 4px;font-size:16.5px;line-height:2;text-align:justify">بناءً على الصلاحيات المخوّلة له، وبناءً على قرار التعيين رقم ('+esc(AN(a.decNo||'—'))+') وتاريخ '+esc(AN(dmy(a.decDate)))+'م، وحسب مقتضيات المصلحة،</p>'+
   '<p style="margin:10px 0 8px;font-size:17px;font-weight:700;text-align:center">يقرر ما يلي:</p>'+
   items.map(function(t,i){return '<p style="margin:0 0 8px;font-size:16.5px;line-height:2;text-align:justify;padding-right:26px;text-indent:-26px">'+AN(i+1)+'- '+t+'</p>'}).join('')+
   '<p style="margin:14px 0 0;font-size:16.5px;line-height:2;text-align:center">والله الموفق،،،</p>'+
  '</div>'+
  /* التوقيع والختم (يسار الصفحة) */
  '<div style="position:absolute;top:826px;left:70px;width:270px;text-align:center;'+A+';color:#111">'+
   '<div style="font-size:16px;font-weight:700">'+esc(s0.t||'رئيس المعهد')+'</div>'+
   '<div style="height:60px;position:relative;margin:2px 0">'+(X.imgOf&&s0.img?'<img src="'+X.imgOf(s0.img)+'" alt="" style="height:56px;max-width:170px;object-fit:contain">':'')+
    (se.length?'<img src="'+se[0]+'" alt="" style="position:absolute;right:-52px;top:-18px;width:88px;height:88px;object-fit:contain">':'')+'</div>'+
   '<div style="font-size:15.5px;font-weight:700">'+esc(s0.n||'')+'</div></div>'+
  /* التحقق والدخول: نص واضح، والرابط الكامل في الرمز */
  '<div style="position:absolute;bottom:90px;right:54px;left:54px;display:flex;align-items:center;gap:12px;'+A+';font-size:13px;color:#222;line-height:1.7;border-top:1px dashed #9aa4b1;padding-top:8px">'+
   (QV?'<img src="'+QV+'" alt="" style="width:56px;height:56px">':'')+
   '<div><b>التحقق من القرار:</b> امسح الرمز، أو أدخل رقمه <bdi dir="ltr">'+esc(c.rec)+'</bdi> في صفحة «التحقق من الوثائق» على موقع المعهد <b dir="ltr" style="'+E+'">attamhid.com</b><br>'+
   '<b>الدخول إلى البوابة:</b> «الخدمات الذاتية لأعضاء هيئة التدريس» <b dir="ltr" style="'+E+'">attamhid.com/faculty-services</b> برقمك العضوي <bdi dir="ltr">'+esc(id)+'</bdi></div></div>'+
  '<div style="position:absolute;bottom:52px;right:54px;left:54px;border-top:1px solid #444;padding-top:6px;text-align:center;'+A+';font-size:12.5px;color:#222">'+
   (I.addrAr?esc(I.addrAr)+' &nbsp;—&nbsp; ':'')+(H.p1?'الهاتف: <bdi dir="ltr">'+esc(H.p1)+'</bdi> &nbsp;—&nbsp; ':'')+(H.em?'البريد: <bdi dir="ltr">'+esc(H.em)+'</bdi> &nbsp;—&nbsp; ':'')+'<b dir="ltr" style="'+E+'">'+esc(bare(site()))+'</b></div>'+
  '</div></div>';
 return h}

/* ---------- كل الخطابات الرسمية: رابط الموقع كتابة، والختم بحجم طبيعي، ورابط الدخول تحت رمزه ---------- */
var addLinks=function(h,c){try{
 if(typeof h!=='string'||h.indexOf('data-l59="1"')<0)return h;
 var sb=bare(site());
 if(h.indexOf('class="l59-ct"')>=0&&h.indexOf('data-site287')<0)h=h.replace('<div class="l59-ct">','<div class="l59-ct" data-site287="1"><b dir="ltr">'+esc(sb)+'</b> &nbsp;|&nbsp; ');
 else if(h.indexOf('data-site287')<0)h=h.replace(/(<div class="l59-vb">)/,'<div class="l59-ct" data-site287="1" style="position:absolute;bottom:62px;right:0;left:0;text-align:center"><b dir="ltr">'+esc(sb)+'</b></div>$1');
 if(c&&c.sid&&X.qrP64&&h.indexOf('Portal Login</span>')>=0){var pu=bare(X.qrP64(c.sid));h=h.replace('Portal Login</span>','Portal Login</span><br><span dir="ltr" style="font-size:9px;font-weight:700">'+esc(pu)+'</span>')}
 if(c&&c.rec&&X.qrV64&&h.indexOf('Verify Document</span>')>=0){var vu=bare(X.qrV64(c.rec));h=h.replace('Verify Document</span>','Verify Document</span><br><span dir="ltr" style="font-size:9px;font-weight:700">'+esc(vu)+'</span>')}
 return h}catch(e){return h}};
try{var css=document.createElement('style');css.id='css287';css.textContent='.l59 .l59-seal{width:108px!important;height:108px!important;object-fit:contain!important;opacity:.88!important;transform:rotate(-8deg)}';document.head.appendChild(css)}catch(e){}
try{var _ch=certHTML;if(typeof _ch==='function'&&!_ch.__v287){certHTML=function(c){if(c&&c.type==='appt'&&!c.old287){try{return doc287(c)}catch(e){console.error('v287 appt',e)}}return addLinks(_ch.apply(this,arguments),c)};certHTML.__v287=1;try{W.certHTML=certHTML}catch(e){}}}catch(e){console.error('v287 wrap',e)}
X.doc287=doc287;X.addLinks287=addLinks;
}catch(e){console.error('v287',e)}})();

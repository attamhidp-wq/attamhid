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
 var items=[
  'تعيين '+w('المكرم','المكرمة')+'/ <b>'+esc(nm)+'</b>'+(o.nat?' ('+w('الجنسية','الجنسية')+': '+esc(o.nat)+')':'')+' على وظيفة <b>'+esc(a.rank||'—')+'</b> ب'+esc(a.dept||'القسم المختص')+'، بنوع تعيين: '+esc(tp[0])+'، و'+w('رقمه','رقمها')+' العضوي ('+esc(id)+').',
  'تبدأ مدة التكليف من '+esc(dmy(a.start))+'م'+(a.end?' إلى '+esc(dmy(a.end))+'م'+(mo?' ('+mo+' شهراً)':''):'')+'، ويُعدّ التعيين نافذاً اعتباراً من تاريخ المباشرة.',
  duties.length?'يُسند إلي'+w('ه','ها')+' ما يلي: '+duties.map(function(x){return esc(x.replace(/[.،]+$/,''))}).join('؛ ')+'.':'',
  'يُبلَّغ هذا القرار لمن يلزم لتنفيذه، ويُعمل به من تاريخه.'].filter(Boolean);
 var itemsE=[
  'To appoint '+w('Mr.','Ms.')+' <b>'+esc(ne||nm)+'</b> as <b>'+esc(a.rankEn||a.rank||'—')+'</b>, '+esc(a.deptEn||a.dept||'')+', on a '+esc(tp[1])+' basis, faculty no. '+esc(id)+'.',
  'The term runs from '+esc(dmy(a.start))+(a.end?' to '+esc(dmy(a.end))+(mo?' ('+mo+' months)':''):'')+', effective from the date of reporting for duty.',
  dutiesE.length?'Assigned duties: '+dutiesE.map(function(x){return esc(x.replace(/[.;]+$/,''))}).join('; ')+'.':'',
  'This decision is communicated to all concerned for implementation, effective from its date.'].filter(Boolean);
 var s0=sg[0]||{};
 var h='<div class="tmw" data-d14="1" data-l287="1"><div class="tmp d14 l287" style="background:#fff">'+band(1)+
  /* الترويسة */
  '<div style="position:absolute;top:96px;right:48px;left:48px;display:flex;align-items:flex-start;justify-content:space-between;'+A+'">'+
   '<div style="text-align:right;line-height:1.55;font-size:15px;font-weight:700;color:#14284B">'+esc(I.nameAr||'معهد التمهيد')+'<br><span style="font-weight:400">'+esc(by)+'</span></div>'+
   '<div style="text-align:center">'+(lg?'<img src="'+lg+'" alt="" style="height:58px;display:block;margin:0 auto">':'')+'</div>'+
   '<div style="font-size:13px;line-height:1.75;color:#16202E;min-width:190px">'+
    '<div>الرقم: <b dir="ltr">'+esc(c.rec)+'</b></div><div>التاريخ: '+(hd?'<bdi dir="ltr">'+esc(hd)+'</bdi> هـ — ':'')+'<bdi dir="ltr">'+esc(dmy(dt))+'</bdi> م</div><div>المرفقات: لا يوجد</div>'+
    '<div dir="ltr" style="'+E+';font-size:11.5px;line-height:1.5;text-align:left;margin-top:2px">Ref: '+esc(c.rec)+'<br>Date: '+esc(dmy(dt))+'</div></div></div>'+
  '<div style="position:absolute;top:202px;right:48px;left:48px;border-top:2px solid #14284B"></div>'+
  /* الموضوع والعنوان والمتن */
  '<div style="position:absolute;top:212px;right:56px;left:56px;'+A+';color:#16202E">'+
   '<p style="margin:0 0 4px;font-size:15px"><b>الموضوع:</b> قرار تعيين '+w('المكرم','المكرمة')+'/ '+esc(nm)+' على وظيفة '+esc(a.rank||'—')+' ب'+esc(a.dept||'')+'</p>'+
   '<p dir="ltr" style="margin:0 0 10px;'+E+';font-size:12px;text-align:left"><b>Subject:</b> Appointment of '+esc(ne||nm)+' as '+esc(a.rankEn||a.rank||'')+'</p>'+
   '<div style="text-align:center;font-size:26px;font-weight:700;color:#14284B;text-decoration:underline;text-underline-offset:6px;margin:4px 0 8px">قرار <span dir="ltr" style="'+E+';font-size:15px;text-decoration:none">— Decision</span></div>'+
   '<p style="margin:0 0 6px;font-size:15.5px;line-height:1.9;text-align:justify">إن '+esc(by)+' بمعهد التمهيد، بناءً على الصلاحيات المخوّلة له، وبناءً على قرار التعيين رقم ('+esc(a.decNo||'—')+') وتاريخ '+esc(dmy(a.decDate))+'م، وحسب مقتضيات المصلحة،</p>'+
   '<p style="margin:0 0 4px;font-size:16px;font-weight:700;text-align:center">يقرر ما يلي:</p>'+
   items.map(function(t,i){return '<p style="margin:0 0 5px;font-size:15px;line-height:1.85;text-align:justify"><b>'+ORD[i]+':</b> '+t+'</p>'}).join('')+
   '<div dir="ltr" style="'+E+';font-size:11.5px;line-height:1.55;text-align:justify;color:#333;border-top:1px solid #d5dce4;margin-top:8px;padding-top:6px">The '+esc(byE)+' of At Tamhid Institute, by virtue of the powers vested in it and pursuant to appointment decision no. '+esc(a.decNo||'—')+' dated '+esc(dmy(a.decDate))+', hereby decides: '+itemsE.map(function(t,i){return '<b>'+ORDE[i]+':</b> '+t}).join(' ')+'</div>'+
   /* الدخول إلى البوابة */
   '<div style="display:flex;gap:12px;align-items:center;border:1px solid #c9d3df;border-radius:6px;padding:7px 10px;margin-top:9px;background:#f7f9fb">'+
    (QP?'<img src="'+QP+'" alt="" style="width:62px;height:62px">':'')+
    '<div style="font-size:13px;line-height:1.6;flex:1"><b>الدخول إلى «الخدمات الذاتية لأعضاء هيئة التدريس»:</b> <span dir="ltr" style="'+E+';font-weight:700">'+esc(bare(portal))+'</span><br>اسم المستخدم: '+w('رقمك','رقمك')+' العضوي <b dir="ltr">'+esc(id)+'</b>، وكلمة المرور الأولى تصل'+w('ك','ك')+' بالبريد الإلكتروني ويُطلب تغييرها عند أول دخول.'+
    '<div dir="ltr" style="'+E+';font-size:11px;text-align:left;color:#333">Faculty Self-Service sign-in: <b>'+esc(bare(portal))+'</b> — username: faculty no. '+esc(id)+'; the initial password is sent by email and must be changed at first sign-in.</div></div></div>'+
  '</div>'+
  /* التوقيع والختم */
  '<div style="position:absolute;top:880px;left:70px;width:300px;text-align:center;'+A+';color:#14284B">'+
   '<div style="font-size:15px;font-weight:700">'+esc(s0.t||'')+'</div>'+(s0.te?'<div dir="ltr" style="'+E+';font-size:11.5px">'+esc(s0.te)+'</div>':'')+
   '<div style="height:54px;position:relative">'+(X.imgOf&&s0.img?'<img src="'+X.imgOf(s0.img)+'" alt="" style="height:52px;max-width:180px;object-fit:contain">':'')+
    (se.length?'<img src="'+se[0]+'" alt="" style="position:absolute;right:-6px;top:-14px;width:84px;height:84px;object-fit:contain;opacity:.88;transform:rotate(-8deg)">':'')+'</div>'+
   '<div style="font-size:14.5px;font-weight:700">'+esc(s0.n||'')+'</div>'+(s0.ne?'<div dir="ltr" style="'+E+';font-size:11.5px">'+esc(s0.ne)+'</div>':'')+'</div>'+
  /* التحقق */
  '<div style="position:absolute;top:900px;right:56px;width:300px;display:flex;gap:8px;align-items:center;'+A+'">'+(QV?'<img src="'+QV+'" alt="" style="width:62px;height:62px">':'')+
   '<div style="font-size:12px;line-height:1.55">للتحقق من صحة هذا القرار:<br><span dir="ltr" style="'+E+';font-weight:700;font-size:11.5px">'+esc(bare(ver))+'</span><br><span dir="ltr" style="'+E+';font-size:10.5px">Verify this decision online</span></div></div>'+
  /* التذييل */
  '<div style="position:absolute;bottom:58px;right:48px;left:48px;border-top:1px solid #8A97A8;padding-top:6px;text-align:center;font-size:12px;color:#33415a;'+A+'">'+
   '<b dir="ltr" style="'+E+'">'+esc(bare(site()))+'</b>'+(H.em?' &nbsp;|&nbsp; <bdi dir="ltr">'+esc(H.em)+'</bdi>':'')+(H.p1?' &nbsp;|&nbsp; <bdi dir="ltr">'+esc(H.p1)+'</bdi>':'')+(I.addrAr?' &nbsp;|&nbsp; '+esc(I.addrAr):'')+'</div>'+
  band(0)+'</div></div>';
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

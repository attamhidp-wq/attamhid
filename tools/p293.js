/* =====================================================================
   v293 — أرشيف مشاريع التخرج العام، ومواعيد التقويم، وعبء الإشراف، ومتابعة الخريجين، وإشعارات الجوال.
   لا بيانات شخصية في الشيفرة.
   ===================================================================== */
(function(){try{
var W=window,X=W.V51;if(!X)return;var H=X.h||(X.h={}),FT=X.ft225||{};
var Lx=function(a,e){try{return L(a,e)}catch(x){return a}};
var e9=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var rpc=async function(n,a){if(typeof sb==='undefined'||!sb)throw new Error('offline');var r=await sb.rpc(n,a||{});if(r.error)throw r.error;return r.data};
var redraw=function(){try{var a=document.getElementById('app');if(a&&V[(location.hash.replace(/^#\/?/,'').split('/')[0])])a.innerHTML=V[location.hash.replace(/^#\/?/,'').split('/')[0]]()}catch(e){}};
var G=X.g293||(X.g293={});

/* ---------- 1) أرشيف مشاريع التخرج (عام) ---------- */
V.projects=function(){
 if(G.arch===undefined){G.arch=null;rpc('ft_gp_archive').then(function(d){G.arch=d||[];redraw()}).catch(function(){G.arch=[];G.archErr=1;redraw()})}
 var q=String(G.q||'').trim().toLowerCase(),L0=(G.arch||[]).filter(function(p){return !q||[p.title,p.titleEn,p.abstract,p.type,p.year].join(' ').toLowerCase().indexOf(q)>=0});
 return '<h2>'+Lx('أرشيف مشاريع التخرج','Graduation Projects Archive')+'</h2><p class="mu">'+Lx('عناوين مشاريع التخرج المعتمدة في المعهد وملخصاتها، مرجعاً للطلاب والباحثين. لا تُنشر أسماء الطلاب ولا النسخ الكاملة.','Titles and abstracts of approved graduation projects, as a reference for students and researchers. Student names and full texts are not published.')+'</p>'+
  '<div class="box"><input id="pq293" placeholder="'+e9(Lx('ابحث بالعنوان أو الموضوع أو السنة…','Search by title, topic or year…'))+'" value="'+e9(G.q||'')+'" oninput="V51.h.pq293(this.value)" style="width:100%"></div>'+
  (G.arch===null?'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>':G.archErr?'<div class="msg er">'+Lx('تعذّر تحميل الأرشيف، حاول لاحقاً.','Could not load the archive; try later.')+'</div>':!L0.length?'<p class="mu">'+(q?Lx('لا نتائج مطابقة.','No matching results.'):Lx('لا توجد مشاريع مؤرشفة بعد.','No archived projects yet.'))+'</p>':
   '<p class="mu">'+Lx('العدد: ','Count: ')+L0.length+'</p>'+L0.map(function(p){return '<div class="box"><h3 style="margin:0 0 4px">'+e9(p.title)+'</h3>'+(p.titleEn?'<div dir="ltr" class="mu" style="text-align:left">'+e9(p.titleEn)+'</div>':'')+'<div class="mu" style="margin:4px 0">'+[p.type,p.year].filter(Boolean).map(e9).join(' · ')+'</div>'+(p.abstract?'<details><summary>'+Lx('الملخص','Abstract')+'</summary><p style="white-space:pre-wrap">'+e9(p.abstract)+'</p></details>':'')+'</div>'}).join(''));
};
H.pq293=function(v){G.q=v;var a=document.getElementById('app');if(!a)return;a.innerHTML=V.projects();var i=document.getElementById('pq293');if(i){i.focus();try{i.setSelectionRange(v.length,v.length)}catch(e){}}};

/* ---------- 2) استبيان متابعة الخريجين (رابط شخصي) ---------- */
V['alumni-survey']=function(){
 var tok=decodeURIComponent((location.hash.split('/')[2]||'').trim());
 if(G.alTok!==tok){G.alTok=tok;G.al=null;G.alDone=0;rpc('v293_alumni_get',{p_tok:tok}).then(function(d){G.al=d||{ok:false};redraw()}).catch(function(){G.al={ok:false,error:'net'};redraw()})}
 var h='<h2>'+Lx('استبيان متابعة الخريجين','Alumni follow-up survey')+'</h2>';
 if(!G.al)return h+'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>';
 if(G.alDone)return h+'<div class="msg ok">'+Lx('شكراً لكم، وصلت إجاباتكم. نتمنى لكم دوام التوفيق.','Thank you; your answers were received. We wish you every success.')+'</div>';
 if(!G.al.ok)return h+'<div class="msg er">'+(G.al.error==='done'?Lx('سبق إرسال هذا الاستبيان. شكراً لكم.','This survey was already submitted. Thank you.'):G.al.error==='net'?Lx('تعذّر الاتصال، حاول لاحقاً.','Connection failed; try later.'):Lx('الرابط غير صالح.','Invalid link.'))+'</div>';
 var R=function(n,opts){return opts.map(function(o){return '<label style="display:block;margin:3px 0"><input type="radio" name="'+n+'" value="'+o[0]+'" required> '+o[1]+'</label>'}).join('')};
 return h+(G.al.sample?'<div class="msg">'+Lx('هذه معاينة للنموذج؛ لن تُحفظ الإجابات.','This is a preview; answers will not be saved.')+'</div>':'')+'<p>'+Lx('أهلاً ','Welcome ')+e9(G.al.name||'')+'، '+Lx('يسعدنا أن نعرف مسيرتكم بعد التخرج (دقيقة واحدة).','we would like to know how you are doing after graduation (one minute).')+'</p>'+
  '<form class="box" onsubmit="return V51.h.al293(this)">'+
  '<b>'+Lx('وضعكم الحالي','Current status')+'</b>'+R('status',[['work',Lx('أعمل','Working')],['study',Lx('أواصل الدراسة','Studying')],['both',Lx('أعمل وأدرس','Both')],['seek',Lx('أبحث عن عمل','Seeking work')],['other',Lx('غير ذلك','Other')]])+
  '<b>'+Lx('مجال العمل أو الدراسة','Field')+'</b><select name="field"><option value="">—</option><option value="teach">'+Lx('التعليم','Teaching')+'</option><option value="translate">'+Lx('الترجمة','Translation')+'</option><option value="religious">'+Lx('العمل الديني والدعوي','Religious work')+'</option><option value="media">'+Lx('الإعلام والكتابة','Media & writing')+'</option><option value="business">'+Lx('الأعمال','Business')+'</option><option value="other">'+Lx('غير ذلك','Other')+'</option></select>'+
  '<b style="display:block;margin-top:8px">'+Lx('هل لعملكم أو دراستكم صلة بما درستموه في المعهد؟','Is your work or study related to what you studied?')+'</b>'+R('related',[['yes',Lx('نعم','Yes')],['partly',Lx('إلى حدٍّ ما','Partly')],['no',Lx('لا','No')]])+
  '<b>'+Lx('رضاكم عن إعداد المعهد لكم (1 إلى 5)','Satisfaction with your preparation (1–5)')+'</b><select name="sat" required><option value=""></option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select>'+
  '<b style="display:block;margin-top:8px">'+Lx('ملاحظة أو اقتراح (اختياري)','Comment (optional)')+'</b><textarea name="note" maxlength="600" rows="3" style="width:100%"></textarea>'+
  '<div style="margin-top:8px"><button class="btn">'+Lx('إرسال','Submit')+'</button></div></form>';
};
H.al293=function(f){var v={};new FormData(f).forEach(function(x,k){v[k]=x});rpc('v293_alumni_save',{p_tok:G.alTok,p:v}).then(function(d){if(d&&d.ok){G.alDone=1;redraw()}else{G.al={ok:false,error:d&&d.error};redraw()}}).catch(function(){try{toast(Lx('تعذّر الإرسال، حاول مرة أخرى.','Could not submit; try again.'))}catch(e){}});return false};

/* ---------- 3) مواعيد التقويم (.ics) ---------- */
var pad=function(n){return (n<10?'0':'')+n};
var icsDT=function(d,t){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(d||''));if(!m)return null;var tm=/^(\d{1,2}):(\d{2})/.exec(String(t||''));if(!tm)return {all:1,s:m[1]+m[2]+m[3]};return {s:m[1]+m[2]+m[3]+'T'+pad(+tm[1])+tm[2]+'00'}};
var icsEsc=function(s){return String(s||'').replace(/[\\;,]/g,function(c){return '\\'+c}).replace(/\n/g,'\\n')};
var evOf=function(r){var d=(r&&r.data)||{},E=[],C=(FT.cfg||{}).dead||{};
 if(r.kind==='gp'){var m=d.m7||{};if(m.date)E.push({t:Lx('مناقشة مشروع التخرج','Graduation project defence'),d:m.date,h:m.time,p:m.place,dur:90});
  ['plan','ch','draft','final'].forEach(function(k){if(C[k])E.push({t:Lx('موعد تسليم: ','Deadline: ')+({plan:Lx('خطة المشروع','Project plan'),ch:Lx('الفصول','Chapters'),draft:Lx('المسودة','Draft'),final:Lx('النسخة النهائية','Final version')})[k],d:C[k]})})}
 if(r.kind==='tr'){var p=d.pres||{};if(p.date)E.push({t:Lx('عرض ملف التدريب الميداني','Field-training presentation'),d:p.date,h:p.time,p:p.place,dur:60});var a=d.app||{};if(a.from)E.push({t:Lx('بداية التدريب الميداني','Field training starts'),d:a.from});if(a.to)E.push({t:Lx('نهاية التدريب الميداني','Field training ends'),d:a.to})}
 return E.filter(function(e){return icsDT(e.d)})};
var icsOf=function(E,uid){var now=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//At Tamhid Institute//attamhid.com//AR','CALSCALE:GREGORIAN'].concat(E.map(function(e,i){var s=icsDT(e.d,e.h),L0=['BEGIN:VEVENT','UID:'+uid+'-'+i+'@attamhid.com','DTSTAMP:'+now];
  if(s.all){L0.push('DTSTART;VALUE=DATE:'+s.s)}else{L0.push('DTSTART;TZID=Asia/Dhaka:'+s.s);var dt=new Date(e.d+'T'+(e.h||'00:00'));dt.setMinutes(dt.getMinutes()+(e.dur||60));L0.push('DTEND;TZID=Asia/Dhaka:'+dt.getFullYear()+pad(dt.getMonth()+1)+pad(dt.getDate())+'T'+pad(dt.getHours())+pad(dt.getMinutes())+'00')}
  L0.push('SUMMARY:'+icsEsc(e.t+' — معهد التمهيد'));if(e.p)L0.push('LOCATION:'+icsEsc(e.p));L0.push('DESCRIPTION:'+icsEsc('https://attamhid.com/#/graduates'));L0.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEsc(e.t),'TRIGGER:-P1D','END:VALARM','END:VEVENT');return L0.join('\r\n')})).concat(['END:VCALENDAR']).join('\r\n')};
H.ics293=function(id,i){var r=(FT.recs||[]).find(function(x){return x.id===id});if(!r)return;var E=evOf(r);if(i!=null&&i!=='')E=[E[+i]];var b=new Blob([icsOf(E,id)],{type:'text/calendar;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='attamhid-'+(i!=null&&i!==''?'event':'dates')+'.ics';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)};
var calBox=function(r){var E=evOf(r);if(!E.length)return '';return '<div class="box" data-cal293="1"><b>'+Lx('المواعيد','Dates')+'</b><ul style="margin:6px 0">'+E.map(function(e,i){return '<li>'+e9(e.t)+' — <bdi dir="ltr">'+e9(e.d)+(e.h?' '+e9(e.h):'')+'</bdi>'+(e.p?' — '+e9(e.p):'')+' <a href="javascript:void 0" onclick="V51.h.ics293(\''+e9(r.id)+'\','+i+')">'+Lx('أضف إلى التقويم','Add to calendar')+'</a></li>'}).join('')+'</ul>'+(E.length>1?'<button class="btn s" onclick="V51.h.ics293(\''+e9(r.id)+'\',\'\')">'+Lx('إضافة كل المواعيد إلى التقويم','Add all dates to calendar')+'</button>':'')+'</div>'};

/* ---------- 4) إشعارات الجوال ---------- */
var b64u=function(s){var p='='.repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/')),o=new Uint8Array(b.length);for(var i=0;i<b.length;i++)o[i]=b.charCodeAt(i);return o};
var pushOK=function(){return 'serviceWorker' in navigator&&'PushManager' in W&&'Notification' in W};
G.pushOn=null;
var pushState=async function(){try{if(!pushOK())return false;var rg=await navigator.serviceWorker.getRegistration();var s=rg&&await rg.pushManager.getSubscription();return !!s}catch(e){return false}};
H.push293=async function(on){try{if(!pushOK()){toast(Lx('متصفحك لا يدعم إشعارات الجوال. على آيفون: أضف الموقع إلى الشاشة الرئيسية أولاً.','Your browser does not support push notifications. On iPhone, add the site to the Home Screen first.'));return}
 var rg=await navigator.serviceWorker.ready;
 if(on){var perm=await Notification.requestPermission();if(perm!=='granted'){toast(Lx('لم يُسمح بالإشعارات من المتصفح.','Notifications were not allowed.'));return}
  var pub=await rpc('v293_vapid_pub');if(!pub){toast(Lx('الخدمة قيد التهيئة؛ حاول بعد دقائق.','The service is being set up; try again in a few minutes.'));return}
  var s=await rg.pushManager.getSubscription()||await rg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(pub)});
  await rpc('v293_push_save',{p_sub:s.toJSON(),p_on:true});G.pushOn=true;toast(Lx('فُعّلت إشعارات الجوال على هذا الجهاز.','Push notifications enabled on this device.'))}
 else{var s2=await rg.pushManager.getSubscription();if(s2){try{await rpc('v293_push_save',{p_sub:s2.toJSON(),p_on:false})}catch(e){}await s2.unsubscribe()}G.pushOn=false;toast(Lx('أُوقفت إشعارات الجوال على هذا الجهاز.','Push notifications turned off on this device.'))}
 go()}catch(e){console.error('push293',e);try{toast(Lx('تعذّر ضبط الإشعارات.','Could not set notifications.'))}catch(x){}}};
var pushBtn=function(){if(!pushOK())return '';if(G.pushOn===null){G.pushOn=false;pushState().then(function(v){if(v!==G.pushOn){G.pushOn=v;try{go()}catch(e){}}})}
 return G.pushOn?'<button class="btn s" onclick="V51.h.push293(false)">'+Lx('إيقاف إشعارات الجوال','Turn off phone notifications')+'</button>':'<button class="btn s" onclick="V51.h.push293(true)">'+Lx('تفعيل إشعارات الجوال','Turn on phone notifications')+'</button>'};

/* ---------- حقن في بوابة الخريجين ---------- */
try{var vg=V.graduates;if(typeof vg==='function'&&!vg.__v293){V.graduates=function(){var h=vg.apply(this,arguments);try{if(typeof h!=='string'||typeof me==='undefined'||!me)return h;var p=location.hash.replace(/^#\/?/,'').split('/');
  var bar='<div class="box" data-bar293="1" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><a class="btn s" href="#/projects">'+Lx('أرشيف مشاريع التخرج','Graduation projects archive')+'</a>'+pushBtn()+'</div>';
  if(p[1]==='r'&&p[2]&&FT.ld){var r=(FT.recs||[]).find(function(x){return x.id===decodeURIComponent(p[2])});var cb=r?calBox(r):'';if(cb&&h.indexOf('data-cal293')<0){var i=h.indexOf('</nav>');h=i>0?h.slice(0,i+6)+cb+h.slice(i+6):h+cb}}
  else if(!p[1]&&h.indexOf('data-bar293')<0){var j=h.indexOf('</nav>');h=j>0?h.slice(0,j+6)+bar+h.slice(j+6):h+bar}
 }catch(e){console.error('v293 grad',e)}return h};V.graduates.__v293=1}}catch(e){}

/* ---------- لوحة الإدارة: عبء الإشراف ومتابعة الخريجين ---------- */
var loadView=function(){var P=FT.ppl&&FT.ppl.fac;if(!P){FT.rpc('ft_people').then(function(d){FT.ppl=d;go()}).catch(function(){});return '<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>'}
 var cap=((FT.cfg||{}).cap)||{},L0=P.filter(function(f){return f.active!==false}).sort(function(a,b){return (b.load||0)-(a.load||0)}),mx=Math.max(1,Math.max.apply(null,L0.map(function(f){return f.load||0})));
 var avg=L0.length?Math.round(L0.reduce(function(s,f){return s+(f.load||0)},0)/L0.length*10)/10:0;
 return '<p class="mu">'+Lx('عدد الملفات الجارية عند كل مشرف (التدريب الميداني ومشاريع التخرج). عند الإسناد يقترح النظام الأقل عبئاً. المتوسط: ','Active files per supervisor (field training and graduation projects). On assignment the system suggests the least loaded. Average: ')+avg+'</p>'+
  '<div class="box">'+(L0.length?'<table><tr><th>'+Lx('المشرف','Supervisor')+'</th><th>'+Lx('تدريب','Training')+'</th><th>'+Lx('مشاريع','Projects')+'</th><th>'+Lx('المجموع','Total')+'</th><th>'+Lx('الطاقة','Capacity')+'</th><th></th></tr>'+L0.map(function(f){var c=cap[f.id],over=c&&f.load>=c;return '<tr><td>'+e9(Lx(f.ar,f.en||f.ar))+'</td><td>'+(f.loadTr||0)+'</td><td>'+(f.loadGp||0)+'</td><td><b>'+(f.load||0)+'</b></td><td>'+(c||'—')+'</td><td style="min-width:120px"><div style="height:8px;background:#e8ecf2;border-radius:4px"><div style="height:8px;width:'+Math.round((f.load||0)/mx*100)+'%;background:'+(over?'#a01414':'#2f5fb3')+';border-radius:4px"></div></div></td></tr>'}).join('')+'</table>':'<p class="mu">'+Lx('لا مشرفين بعد.','No supervisors yet.')+'</p>')+'</div>'};
var alumniView=function(){if(G.ast===undefined){G.ast=null;FT.rpc('v293_alumni_stats').then(function(d){G.ast=d||{};go()}).catch(function(){G.ast={};go()})}
 var on=((FT.cfg||{}).alumni293||{}).ok===true,s=G.ast||{},SL={work:Lx('يعمل','Working'),study:Lx('يدرس','Studying'),both:Lx('يعمل ويدرس','Both'),seek:Lx('يبحث عن عمل','Seeking'),other:Lx('غير ذلك','Other')},RL={yes:Lx('نعم','Yes'),partly:Lx('جزئياً','Partly'),no:Lx('لا','No'),'-':'—'};
 var kv=function(o,M){var k=Object.keys(o||{});return k.length?k.map(function(x){return (M[x]||x)+': '+o[x]}).join(' · '):'—'};
 return '<p class="mu">'+Lx('يُرسل النظام آلياً استبياناً قصيراً لكل خريج بعد ستة أشهر من تخرجه، وتظهر النتائج هنا وفي التقارير أعداداً مجمّعة فقط. أُرسلت معاينة الرسالة إلى بريد المعهد؛ لا يُرسل لأي خريج قبل اعتمادكم.','The system automatically emails a short survey to each graduate six months after graduation; results appear here and in reports as aggregates only. A preview was sent to the Institute email; nothing is sent to graduates before you approve.')+'</p>'+
  '<div class="box"><b>'+Lx('الحالة: ','Status: ')+'</b>'+(on?'<span class="tag ok">'+Lx('مفعّل','Enabled')+'</span> '+btn0(Lx('إيقاف','Disable'),'V51.h.al293on(false)'):'<span class="tag">'+Lx('بانتظار الاعتماد','Awaiting approval')+'</span> '+btn0(Lx('اعتماد الرسالة وتفعيل الإرسال','Approve and enable'),'V51.h.al293on(true)'))+' <a class="btn s" href="#/alumni-survey/SAMPLE" target="_blank">'+Lx('معاينة الاستبيان','Preview survey')+'</a></div>'+
  (G.ast===null?'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>':'<div class="box"><table><tr><td>'+Lx('أُرسل','Sent')+'</td><td>'+(s.sent||0)+'</td></tr><tr><td>'+Lx('أجاب','Answered')+'</td><td>'+(s.answered||0)+'</td></tr><tr><td>'+Lx('الوضع الحالي','Status')+'</td><td>'+kv(s.status,SL)+'</td></tr><tr><td>'+Lx('صلة العمل بالدراسة','Related to studies')+'</td><td>'+kv(s.related,RL)+'</td></tr><tr><td>'+Lx('متوسط الرضا (من 5)','Average satisfaction (of 5)')+'</td><td>'+(s.sat==null?'—':s.sat)+'</td></tr></table></div>')};
var btn0=function(t,on){return '<button class="btn s" onclick="'+on+'">'+e9(t)+'</button>'};
H.al293on=function(v){if(v&&!confirm(Lx('اعتماد رسالة الاستبيان وتفعيل إرسالها آلياً للخريجين بعد ستة أشهر من التخرج؟','Approve the survey email and enable automatic sending to graduates six months after graduation?')))return;FT.rpc('v293_alumni_approve',{p_on:!!v}).then(function(){FT.cfg=FT.cfg||{};FT.cfg.alumni293={ok:!!v};toast(v?Lx('فُعّل الإرسال.','Enabled.'):Lx('أُوقف الإرسال.','Disabled.'));go()}).catch(function(e){toast(String(e&&e.message||e))})};
X.ft293={loadView:loadView,alumniView:alumniView,calBox:calBox,evOf:evOf,icsOf:icsOf};
}catch(e){console.error('v293',e)}})();

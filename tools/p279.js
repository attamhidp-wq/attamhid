/* =====================================================================
   v279 — بوابة الخريجين (التدريب الميداني ومشروع التخرج) — المرحلة الأولى
   1) الاستحقاق: شروط الدخول لكل برنامج من الإعدادات، تُحسب آلياً على الخادم من السجل الأكاديمي الرسمي
      (ft_elig_core)، ويرى الطالب ما استوفاه وما بقي عليه. الاستثناء بقرار من الإدارة المركزية مع السبب.
   2) قسم «التدريب الميداني ومشروع التخرج» في «أقسام اللوحة» (لا يظهر في القائمة العامة):
      الملخص و«يحتاج إجراء الآن»، والاستحقاق والاستثناءات، وإعدادات الشروط، وروابط لوحات البوابة.
   البيانات تصل مع ft_boot في الطلب الواحد نفسه. لا بيانات شخصية في الشيفرة.
   ===================================================================== */
(function(){try{
var W=window,X=W.V51||W.V5;if(!X||!X.h||!X.ft225)return;var H=X.h,FT=X.ft225;
var e9=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var Lx=function(a,b){try{return L(a,b)}catch(e){return a}};
var T=function(m){try{toast(m)}catch(e){alert(m)}};
var MD=function(t,h){try{modal(t,h)}catch(e){try{mdl(t,h)}catch(x){alert(t)}}};
var msgOf=function(e){var m=String((e&&(e.message||e.details||e.hint))||e||'');return m.replace(/^.*?:\s*/,'').replace(/\s*\(P0001\)$/,'')||Lx('تعذّرت العملية.','The operation failed.')};
var today=function(){return new Date().toISOString().slice(0,10)};
var who=function(){return FT.who||{}};
var isAdm=function(){return typeof me!=='undefined'&&me&&me.r==='admin'};
var central=function(){return !!(isAdm()&&!me.unit&&!X.imp64)};
var canSee=function(){return central()||(isAdm()&&FT.ld&&((who().roles||[]).length>0))};
var btn=function(t,on,c){return '<button type="button" class="btn'+(c?' '+c:'')+'" onclick="'+on+'">'+t+'</button>'};
var tbl=function(h,r){return '<div class="tw"><table><tr>'+h.map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr>'+(r.length?r.join(''):'<tr><td colspan="'+h.length+'" class="mu">'+Lx('لا شيء','None')+'</td></tr>')+'</table></div>'};
var link=function(p){return '#/graduates'+(p?'/'+p:'')};
var ST=function(){return FT.ST||{}};
var chip=function(r){try{return FT.chip(r)}catch(e){return '<span class="tag">'+e9(r.st)+'</span>'}};
var nmOf=function(r){var s=(r&&r.data&&r.data.s)||{};return Lx(s.ar||'',s.en||s.ar||'')||(r&&r.sid)||''};

/* ---------- الشروط ---------- */
var KS=['course','pre','lvls','prof','hifz','hrs','gpa','dues'];
var KN={course:['التسجيل في 4401','Registered in 4401'],pre:['اجتياز 3102','Passed 3102'],lvls:['المستويات','Levels'],prof:['الكفاية','Proficiency'],hifz:['جزء عمّ','Juz’ Amma'],hrs:['الساعات','Hours'],gpa:['المعدل','GPA'],dues:['المستحقات المالية','Fees'],'*':['كل الشروط','All conditions']};
var kn=function(k){var x=KN[k]||[k,k];return Lx(x[0],x[1])};
var det=function(it){var o='';
 if(it.k==='lvls'&&it.miss&&it.miss.length)o=Lx('المقررات غير المجتازة بعد: ','Courses not yet passed: ')+'<span dir="ltr">'+e9(it.miss.join('، '))+'</span>';
 else if(it.k==='prof')o=it.got!=null?Lx('المتوسط المسجَّل ','Recorded average ')+e9(it.got)+Lx(' — المطلوب ',' — required ')+e9(it.need):Lx('لم تُسجَّل نتيجته بعد','Not recorded yet');
 else if(it.k==='hifz')o=Lx('المستوى الأول: ','Level One: ')+(it.p1?Lx('مجتاز','passed'):Lx('لم يُرصد','not recorded'))+Lx('، المستوى الثاني: ','; Level Two: ')+(it.p2?Lx('مجتاز','passed'):Lx('لم يُرصد','not recorded'));
 else if(it.k==='hrs')o=Lx('المجتاز ','Passed ')+e9(it.got||0)+Lx(' ساعة — المطلوب ',' hours — required ')+e9(it.need);
 else if(it.k==='gpa')o=Lx('المعدل ','GPA ')+e9(it.got==null?'—':it.got)+Lx(' — المطلوب ',' — required ')+e9(it.need);
 else if(it.k==='dues'){if(it.due_n)o=Lx('مطالبات غير مسددة: ','Unpaid claims: ')+e9(it.due_n)+' ('+e9(it.due_amt)+')';else if(it.claimed_n)o=Lx('دفعة بانتظار تأكيد الإدارة','A payment awaiting confirmation')}
 if(it.exc)o+=(o?' — ':'')+'<b>'+Lx('مستثنى بقرار الإدارة المركزية: ','Exempted by central administration: ')+'</b>'+e9(it.exc.reason||'');
 return o};
var mark=function(it){if(it.exc&&!it.ok)return '<span class="tag">'+Lx('مستثنى','Exempted')+'</span>';if(it.ok)return '<span class="tag ok">✔</span>';return it.on?'<span class="tag er">✖</span>':'<span class="tag">✖</span>'};

/* قائمة شروط طالب: للطالب نفسه وللإدارة */
var eligList=function(d){if(!d||!d.items)return '';var req=d.items.filter(function(x){return x.on}),inf=d.items.filter(function(x){return !x.on});
 var row=function(it){var t=det(it);return '<li style="margin:6px 0">'+mark(it)+' '+e9(Lx(it.ar,it.en||it.ar))+(t?'<br><small class="mu">'+t+'</small>':'')+'</li>'};
 return '<ul style="list-style:none;padding:0;margin:0">'+req.map(row).join('')+'</ul>'+(inf.length?'<details><summary class="mu">'+Lx('شروط أخرى تُعرض للعلم ولا تُشترط حالياً','Other conditions shown for information, not currently required')+' ('+inf.length+')</summary><ul style="list-style:none;padding:0;margin:0">'+inf.map(row).join('')+'</ul></details>':'')};
var leftN=function(d){return ((d&&d.items)||[]).filter(function(x){return x.on&&!x.ok&&!x.exc}).length};

/* ---------- الطالب: ما استوفاه وما بقي عليه ---------- */
var stuBox=function(){var d=who().eld;if(!d||!d.items)return '';var n=leftN(d);
 return '<details class="box ft279s"'+(d.ok?'':' open')+'><summary><b>'+Lx('الاستحقاق','Eligibility')+'</b> — '+(d.ok?'<span class="tag ok">'+Lx('مستحق','Eligible')+'</span>':'<span class="tag er">'+Lx('غير مستحق بعد','Not yet eligible')+'</span> '+Lx('بقي عليك ','Remaining: ')+n+Lx(' من الشروط',' condition(s)'))+'</summary>'+
  '<p class="mu">'+Lx('يُحسب آلياً من سجلك الأكاديمي الرسمي (الدرجات المنشورة) ومن السجل المالي. لأي استفسار راجع وحدة التدريب والمشاريع.','Calculated automatically from your official academic record (published grades) and the finance ledger. For questions, contact the Training & Projects Unit.')+'</p>'+eligList(d)+'</details>'};
try{var vg=V.graduates;if(typeof vg==='function'&&!vg.__v279){V.graduates=function(){var h=vg.apply(this,arguments);try{if(typeof me!=='undefined'&&me&&me.r==='student'&&FT.ld&&typeof h==='string'&&h.indexOf('ft279s')<0){var p=location.hash.replace(/^#\/?/,'').split('/');if(!p[1]||p[1]==='elig'){var i=h.indexOf('</nav>');var b=stuBox();if(b&&i>0)h=h.slice(0,i+6)+b+h.slice(i+6)}}}catch(e){console.error('v279 stu',e)}return h};V.graduates.__v279=1}}catch(e){}

/* ---------- الإدارة: قسم «التدريب الميداني ومشروع التخرج» ---------- */
var G={v:'sum',f:'all',req:0,err:''};
H.ft279v=function(v){G.v=v;go()};
H.ft279f=function(v){G.f=v;go()};
var reload=function(){FT.elig=null;FT.exc=null;G.req=0;return FT.load(1).then(function(){window.__force71=1;go()})};
var ensure=function(){if(FT.elig!=null||G.req)return;G.req=1;Promise.all([FT.rpc('ft_elig_list'),FT.rpc('ft_exc_list')]).then(function(a){FT.elig=a[0]||[];FT.exc=a[1]||[];G.err='';go()}).catch(function(e){G.err=msgOf(e);G.req=0;go()})};

var lateTr=function(){var gd=+((FT.cfg||{}).gapDays)||5;return FT.recs.filter(function(r){if(r.kind!=='tr'||['started','running'].indexOf(r.st)<0)return false;var l=((r.data&&r.data.log)||[]).map(function(x){return x.date}).sort().pop()||(r.data&&r.data.start&&r.data.start.date)||'';return !l||(Date.now()-new Date(l+'T12:00:00Z'))/864e5>gd})};
var lateGp=function(){var dl=(FT.cfg||{}).dead||{};return FT.recs.filter(function(r){return r.kind==='gp'&&['assigned','plan_ok','inprogress','draft_final'].indexOf(r.st)>=0&&Object.keys(dl).some(function(k){return dl[k]&&dl[k]<today()&&!((r.data&&r.data.subs)||[]).some(function(x){return x.stage===k})})})};
var NEED=[['tr','submitted',['مراجعة طلب التدريب واعتماده أو رفضه','Review the training application']],['tr','done',['تقييم التدريب المكتمل','Evaluate the completed training']],['gp','proposed',['مراجعة مقترح المشروع','Review the project proposal']],['gp','draft_final',['الإذن بالمناقشة','Approve for defence']],['gp','discussed',['اعتماد نتيجة المناقشة','Finalise the defence result']],['app','applied',['البت في طلب فرصة داخلية','Decide on an internal-opportunity application']],['rec','new',['اعتماد التوصية بالتعاون','Approve the cooperation recommendation']]];
var card=function(n,t,c){return '<div class="box" style="text-align:center;margin:0"><div style="font-size:26px;font-weight:700"'+(c?' class="'+c+'"':'')+'>'+n+'</div><div class="mu">'+t+'</div></div>'};

function sumView(){var E=FT.elig||[],R=FT.recs||[],tr=R.filter(function(r){return r.kind==='tr'}),gp=R.filter(function(r){return r.kind==='gp'});
 var run=tr.filter(function(r){return ['approved','letter','accepted','started','running'].indexOf(r.st)>=0}),lt=lateTr(),lg=lateGp(),ev=tr.filter(function(r){return r.st==='done'});
 var o='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:8px 0">'+
  card(E.filter(function(x){return x.ok}).length+' / '+E.length,Lx('المستحقون من المرشحين','Eligible / candidates'))+card(run.length,Lx('متدربون جارون','Trainings in progress'))+
  card(gp.filter(function(r){return ['rejected','archived'].indexOf(r.st)<0}).length,Lx('مشاريع قائمة','Active projects'))+card(lt.length+lg.length,Lx('متأخرون','Behind schedule'),lt.length+lg.length?'er':'')+card(ev.length,Lx('تقييمات ناقصة','Evaluations pending'),ev.length?'er':'')+'</div>';
 var GS=ST().gp||{},cnt={};gp.forEach(function(r){cnt[r.st]=(cnt[r.st]||0)+1});
 o+='<h4>'+Lx('المشاريع بحسب المرحلة','Projects by stage')+'</h4>'+tbl([Lx('المرحلة','Stage'),Lx('العدد','Count')],Object.keys(GS).filter(function(k){return cnt[k]}).map(function(k){return '<tr><td>'+e9(Lx(GS[k][0],GS[k][1]))+'</td><td>'+cnt[k]+'</td></tr>'}));
 var A=[];NEED.forEach(function(n){R.filter(function(r){return r.kind===n[0]&&r.st===n[1]}).forEach(function(r){A.push([r,Lx(n[2][0],n[2][1])])})});
 lt.forEach(function(r){A.push([r,Lx('متابعة متدرب متأخر في تدوين السجل','Follow up a trainee behind on the log')])});lg.forEach(function(r){A.push([r,Lx('متابعة مشروع تجاوز موعد مرحلة','Follow up a project past a stage deadline')])});
 (FT.elig||[]).filter(function(x){return !x.ok&&x.items&&x.items.some(function(i){return i.k==='course'&&i.ok})}).forEach(function(x){A.push([{id:'',sid:x.sid,data:{s:{ar:x.ar,en:x.en}},st:''},Lx('مسجَّل في 4401 ولم يستوفِ شروط الاستحقاق','Registered in 4401 but not eligible'),x.sid])});
 o+='<h4>'+Lx('يحتاج إجراء الآن','Needs action now')+' ('+A.length+')</h4>'+tbl([Lx('الطالب','Student'),Lx('الإجراء','Action'),Lx('الحالة','Status'),''],A.map(function(a){var r=a[0];return '<tr><td>'+e9(nmOf(r))+'</td><td>'+e9(a[1])+'</td><td>'+(r.st?chip(r):'—')+'</td><td>'+(r.id?'<a class="btn s" href="'+link('r/'+encodeURIComponent(r.id))+'">'+Lx('فتح','Open')+'</a>':btn(Lx('الشروط','Conditions'),'V51.h.ft279d(\''+e9(a[2])+'\')','s'))+'</td></tr>'}));
 return o}

function eligView(){var E=FT.elig||[],F=G.f,L0=E.filter(function(x){return F==='ok'?x.ok:F==='no'?!x.ok:true});
 var o='<p class="mu">'+Lx('يُحسب آلياً على الخادم من السجل الأكاديمي الرسمي (الدرجات المنشورة) والسجل المالي. الشروط المفعّلة في «الإعدادات» تمنع، والبقية تُعرض للعلم.','Computed on the server from the official academic record (published grades) and the finance ledger. Conditions enabled in “Settings” are required; the rest are shown for information.')+'</p>'+
  '<p>'+[['all',Lx('الكل','All')],['ok',Lx('المستحقون','Eligible')],['no',Lx('غير المستحقين','Not eligible')]].map(function(x){return btn(x[1]+' ('+(x[0]==='all'?E.length:E.filter(function(y){return x[0]==='ok'?y.ok:!y.ok}).length)+')','V51.h.ft279f(\''+x[0]+'\')',G.f===x[0]?'':'s')}).join(' ')+'</p>';
 o+=tbl([Lx('الطالب','Student'),Lx('النتيجة','Result')].concat(KS.map(kn)).concat(['']),L0.map(function(x){var I={};(x.items||[]).forEach(function(i){I[i.k]=i});
  return '<tr><td>'+e9(x.sid+' — '+Lx(x.ar,x.en||x.ar))+'</td><td>'+(x.ok?'<span class="tag ok">'+Lx('مستحق','Eligible')+'</span>':'<span class="tag er">'+Lx('غير مستحق','Not eligible')+'</span>')+'</td>'+KS.map(function(k){var i=I[k];return '<td>'+(i?mark(i)+(i.on?'':' <small class="mu">'+Lx('للعلم','info')+'</small>'):'—')+'</td>'}).join('')+'<td>'+btn(Lx('التفاصيل','Details'),'V51.h.ft279d(\''+e9(x.sid)+'\')','s')+'</td></tr>'}));
 var X0=(FT.exc||[]);o+='<h4>'+Lx('الاستثناءات','Exceptions')+'</h4>'+tbl([Lx('الطالب','Student'),Lx('الشرط','Condition'),Lx('السبب','Reason'),Lx('بواسطة','By'),Lx('التاريخ','Date'),Lx('الحالة','Status'),''],X0.map(function(z){return '<tr><td dir="ltr">'+e9(z.sid)+'</td><td>'+e9(kn(z.k))+'</td><td>'+e9(z.reason)+'</td><td dir="ltr">'+e9(z.by_ref||'')+'</td><td dir="ltr">'+e9(String(z.at||'').slice(0,10))+'</td><td>'+(z.revoked_at?'<span class="tag er">'+Lx('مسحوب','Revoked')+'</span> <small>'+e9(z.revoke_reason||'')+'</small>':'<span class="tag ok">'+Lx('ساري','Active')+'</span>')+'</td><td>'+(!z.revoked_at&&central()?btn(Lx('سحب','Revoke'),'V51.h.ft279xr('+(+z.id)+')','s'):'')+'</td></tr>'}));
 return o}

H.ft279d=function(sid){var x=(FT.elig||[]).find(function(y){return String(y.sid)===String(sid)});
 var show=function(d,nm){MD(Lx('شروط الاستحقاق — ','Eligibility conditions — ')+e9(sid+(nm?' — '+nm:'')),'<p>'+(d.ok?'<span class="tag ok">'+Lx('مستحق','Eligible')+'</span>':'<span class="tag er">'+Lx('غير مستحق','Not eligible')+'</span>')+'</p>'+eligList(d)+
  (central()?'<h4>'+Lx('استثناء بقرار من الإدارة المركزية','Exception by central administration decision')+'</h4><form class="v51g" onsubmit="V51.h.ft279x(this);return false"><input type="hidden" name="sid" value="'+e9(sid)+'"><label>'+Lx('الشرط','Condition')+'<select name="k">'+(d.items||[]).filter(function(i){return !i.ok}).map(function(i){return '<option value="'+e9(i.k)+'">'+e9(kn(i.k))+'</option>'}).join('')+'<option value="*">'+e9(kn('*'))+'</option></select></label><label>'+Lx('السبب (إلزامي)','Reason (required)')+'<input name="reason" required minlength="5" maxlength="500"></label><div><button class="btn">'+Lx('اعتماد الاستثناء','Grant the exception')+'</button></div></form>':''))};
 if(x)return show(x,Lx(x.ar,x.en||x.ar));FT.rpc('ft_elig_detail',{p_sid:String(sid)}).then(function(d){show(d,'')}).catch(function(e){T(msgOf(e))})};
H.ft279x=async function(f){if(!central())return;var v=fv(f);if(String(v.reason||'').trim().length<5){T(Lx('السبب إلزامي.','A reason is required.'));return}
 if(!confirm(Lx('اعتماد الاستثناء؟ يُسجَّل في سجل التدقيق باسمك.','Grant this exception? It is recorded in the audit log under your name.')))return;
 try{await FT.rpc('ft_exc_set',{p_sid:String(v.sid),p_k:String(v.k),p_reason:String(v.reason)});try{closeMdl()}catch(e){}T(Lx('اعتُمد الاستثناء.','Exception granted.'));await reload()}catch(e){T(msgOf(e))}};
H.ft279xr=async function(id){if(!central())return;var r=prompt(Lx('سبب سحب الاستثناء (إلزامي):','Reason for revoking (required):'));if(r===null)return;if(String(r).trim().length<5){T(Lx('السبب إلزامي.','A reason is required.'));return}
 try{await FT.rpc('ft_exc_revoke',{p_id:+id,p_reason:String(r)});T(Lx('سُحب الاستثناء.','Exception revoked.'));await reload()}catch(e){T(msgOf(e))}};

function cfgView(){var c=((FT.cfg||{}).elig||{})['1000']||{},D={course:{on:1},pre:{on:1},lvls:{on:0,n:3},prof:{on:0,lvl:3},hifz:{on:0},hrs:{on:0,min:63},gpa:{on:0,min:0},dues:{on:0}},ed=central();
 var g=function(k,p){var x=c[k]||{};return x[p]!=null?x[p]:D[k][p]};
 var ck=function(k){return '<label class="v51ck"><input type="checkbox" name="'+k+'_on"'+(g(k,'on')?' checked':'')+(ed?'':' disabled')+'> '+e9(kn(k))+'</label>'};
 var lv=function(nm,v){return '<select name="'+nm+'"'+(ed?'':' disabled')+'>'+[1,2,3,4].map(function(i){return '<option value="'+i+'"'+(+v===i?' selected':'')+'>'+Lx(['','الأول','الثاني','الثالث','الرابع'][i],['','One','Two','Three','Four'][i])+'</option>'}).join('')+'</select>'};
 return '<p class="mu">'+Lx('برنامج الدبلوم العام في اللغة العربية لغير الناطقين بها. الشرط المفعّل يمنع الدخول إلى خدمات التدريب والمشروع حتى يُستوفى أو يُستثنى الطالب منه. كل تغيير يُسجَّل في سجل التدقيق.','Diploma in Arabic for Non-Native Speakers. An enabled condition blocks the training and project services until it is met or the student is exempted. Every change is recorded in the audit log.')+'</p>'+
  '<form class="v51g" onsubmit="V51.h.ft279c(this);return false">'+ck('course')+ck('pre')+ck('lvls')+'<label>'+Lx('اجتياز المستويات حتى','Levels passed up to')+lv('lvls_n',g('lvls','n'))+'</label>'+ck('prof')+'<label>'+Lx('اختبار الكفاية للمستوى','Proficiency test of level')+lv('prof_lvl',g('prof','lvl'))+'</label>'+ck('hifz')+ck('hrs')+'<label>'+Lx('الحد الأدنى من الساعات','Minimum hours')+'<input name="hrs_min" type="number" min="0" max="200" value="'+e9(g('hrs','min'))+'"'+(ed?'':' disabled')+'></label>'+ck('gpa')+'<label>'+Lx('الحد الأدنى من المعدل','Minimum GPA')+'<input name="gpa_min" type="number" min="0" max="5" step="0.01" value="'+e9(g('gpa','min'))+'"'+(ed?'':' disabled')+'></label>'+ck('dues')+
  (ed?'<div><button class="btn">'+Lx('حفظ الشروط','Save conditions')+'</button></div>':'<p class="mu">'+Lx('التعديل للإدارة المركزية فقط.','Editing is for central administration only.')+'</p>')+'</form>'}
H.ft279c=async function(f){if(!central())return;var v=fv(f),p={};KS.forEach(function(k){p[k]={on:!!(f.querySelector('[name='+k+'_on]')||{}).checked}});p.lvls.n=+v.lvls_n||3;p.prof.lvl=+v.prof_lvl||3;p.hrs.min=+v.hrs_min||0;p.gpa.min=+v.gpa_min||0;
 if(!confirm(Lx('حفظ شروط الاستحقاق؟ يُعاد حساب استحقاق كل الطلاب فوراً.','Save the eligibility conditions? Eligibility is recalculated for all students immediately.')))return;
 try{await FT.rpc('ft_elig_cfg_set',{p_prog:'1000',p:p});T(Lx('حُفظت الشروط.','Conditions saved.'));await reload()}catch(e){T(msgOf(e))}};

function linksView(){var A=[['',Lx('الصفحة الرئيسة للبوابة','Portal home')],['tcd',Lx('لوحة منسق التدريب','Training coordinator')],['orgs',Lx('جهات التدريب','Training organizations')],['opps',Lx('الفرص الداخلية','Internal opportunities')],['pcd',Lx('لوحة منسق المشاريع','Projects coordinator')],['grades',Lx('درجات 4401','4401 grades')],['forms',Lx('مراجعة النماذج واعتمادها','Review & approve forms')],['cfg',Lx('إعدادات البوابة والصلاحيات','Settings & permissions')],['audit',Lx('سجل التدقيق','Audit log')]];
 return '<p>'+A.map(function(x){return '<a class="btn s" href="'+link(x[0])+'">'+x[1]+'</a>'}).join(' ')+' <a class="btn s" href="#/ext-training/admin">'+Lx('التدريب الخارجي','External training')+'</a></p>'}

function tab(){if(!isAdm())return '';if(!FT.ld){if(!FT.err)FT.load().then(function(){window.__force71=1;go()});return FT.err?'<div class="msg er">'+Lx('تعذّر التحميل.','Could not load.')+'</div>'+btn(Lx('إعادة المحاولة','Try again'),'V51.h.ft231retry()'):'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>'}
 if(!canSee())return '<div class="msg er">'+Lx('هذا القسم للإدارة المركزية والجهات المخوّلة منها.','This section is for central administration and the bodies it authorizes.')+'</div>';
 ensure();var V0=[['sum',Lx('الملخص','Summary')],['elig',Lx('الاستحقاق','Eligibility')],['tr',Lx('متابعة التدريب','Training follow-up')],['cfg',Lx('الإعدادات','Settings')],['links',Lx('لوحات البوابة','Portal boards')]];
 var h='<h3>'+Lx('التدريب الميداني ومشروع التخرج','Field Training & Graduation Project')+'</h3><nav style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px">'+V0.map(function(x){return btn(x[1],'V51.h.ft279v(\''+x[0]+'\')',G.v===x[0]?'':'s')}).join('')+btn(Lx('تحديث','Refresh'),'V51.h.ft279r()','s')+'</nav>';
 if(G.err)h+='<div class="msg er">'+e9(G.err)+'</div>';
 if(FT.elig==null&&G.v!=='links'&&G.v!=='cfg')return h+'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>';
 try{return h+(G.v==='elig'?eligView():G.v==='tr'?trView():G.v==='cfg'?cfgView():G.v==='links'?linksView():sumView())}catch(e){console.error('v279 tab',e);return h+'<div class="msg er">'+e9(e.message)+'</div>'}}
H.ft279r=function(){reload()};
try{var TB=X.TABS51||W.V51TABS,TL=X.TABLBL51||{};if(TB&&!TB.some(function(x){return x[0]==='ft279'})){TB.push(['ft279','التدريب الميداني ومشروع التخرج','Field Training & Graduation Project',tab]);TL['التدريب الميداني ومشروع التخرج']='ft279';TL['Field Training & Graduation Project']='ft279'}}catch(e){}

/* =====================================================================
   المرحلة الثانية — التدريب الميداني: إيقاف/استئناف/عدم اجتياز بسبب إلزامي، وتقييم المتدرب للجهة،
   وتقرير منتصف التدريب، و«متابعة التدريب» في لوحة الإدارة (الخطة، الحضور، الزيارات، التقارير، التقييمات)
   ===================================================================== */
try{var S0=FT.ST&&FT.ST.tr;if(S0){S0.suspended=S0.suspended||['موقوف','Suspended'];S0.failed=S0.failed||['غير مجتاز','Not passed']}}catch(e){}
var hasR=function(k){return central()||(who().roles||[]).indexOf(k)>=0};
var REC=function(id){return (FT.recs||[]).find(function(r){return r.id===id})};
var TRH=function(r){var L0=(r.data&&r.data.log)||[],ok=L0.filter(function(x){return String(x.ok)==='1'||x.ok===true});return {n:L0.length,h:L0.reduce(function(a,x){return a+(+x.h||0)},0),okh:ok.reduce(function(a,x){return a+(+x.h||0)},0),pend:L0.filter(function(x){return !x.ok&&!x.rej}).length}};
var needH=function(r){return +((r.data&&r.data.hours)||(FT.cfg||{}).hours||60)};
var subOf=function(r,k){return ((r.data&&r.data.subs)||[]).filter(function(x){return x.stage===k}).pop()};
var yes=function(b,t){return b?'<span class="tag ok">✔'+(t?' '+t:'')+'</span>':'<span class="tag">—</span>'};
var RATE=[['ملاءمة بيئة التدريب','Suitability of the training environment'],['تعاون المشرف الميداني','Cooperation of the field supervisor'],['وضوح المهام','Clarity of tasks'],['الفائدة المهنية','Professional benefit'],['التوصية بالجهة لغيري','Would recommend the organization']];
H.ft279st=function(id,act){var r=REC(id);if(!r)return;var q={tr_suspend:Lx('سبب إيقاف التدريب (إلزامي):','Reason for suspending (required):'),tr_resume:Lx('سبب الاستئناف (إلزامي):','Reason for resuming (required):'),tr_fail:Lx('سبب عدم الاجتياز (إلزامي):','Reason for “not passed” (required):')}[act];
 var w=prompt(q);if(w===null)return;if(String(w).trim().length<5){T(Lx('السبب إلزامي (5 أحرف على الأقل).','A reason is required (at least 5 characters).'));return}
 if(act==='tr_fail'&&!confirm(Lx('تأكيد قرار «غير مجتاز»؟ يُسجَّل باسمك مع السبب.','Confirm “not passed”? It is recorded under your name with the reason.')))return;
 FT.act(id,act,{why:String(w).trim()})};
H.ft279rate=function(f,id){var v=fv(f),c=RATE.map(function(_,i){return v['c'+i]});if(c.some(function(x){return !/^[1-4]$/.test(String(x))})){T(Lx('اختر تقديراً لكل معيار.','Choose a rating for every criterion.'));return}
 FT.act(id,'ent_rate',{c:c,cmt:String(v.cmt||'').slice(0,800)},Lx('شكراً لك، سُجّل تقييمك.','Thank you; your rating is recorded.'))};
var rateForm=function(r){var o=['','ضعيف','مقبول','جيد','ممتاز'],oe=['','Poor','Fair','Good','Excellent'];
 return '<form class="v51g" onsubmit="V51.h.ft279rate(this,\''+e9(r.id)+'\');return false">'+RATE.map(function(x,i){return '<label>'+e9(Lx(x[0],x[1]))+'<select name="c'+i+'" required><option value="">—</option>'+[4,3,2,1].map(function(n){return '<option value="'+n+'">'+Lx(o[n],oe[n])+'</option>'}).join('')+'</select></label>'}).join('')+'<label>'+Lx('ملاحظات (اختياري)','Comments (optional)')+'<input name="cmt" maxlength="800"></label><div><button class="btn">'+Lx('إرسال التقييم','Submit rating')+'</button></div></form>'};
var trBox=function(r){if(!r||r.kind!=='tr')return '';var d=r.data||{},o='';
 var mine=typeof me!=='undefined'&&me&&me.r==='student';
 if(mine&&['done','evaluated'].indexOf(r.st)>=0)o+=d.rate?'<p>'+Lx('سجّلتَ تقييمك لجهة التدريب.','You have rated the training organization.')+'</p>':'<p class="mu">'+Lx('قيّم جهة التدريب ليستفيد منها المعهد في اختيار الجهات.','Rate the training organization to help the Institute choose organizations.')+'</p>'+rateForm(r);
 if(!mine&&hasR('tc')){var B=[];if(['approved','letter','accepted','started','running'].indexOf(r.st)>=0)B.push(btn(Lx('إيقاف مؤقت','Suspend'),'V51.h.ft279st(\''+e9(r.id)+'\',\'tr_suspend\')','s'));
  if(r.st==='suspended')B.push(btn(Lx('استئناف','Resume'),'V51.h.ft279st(\''+e9(r.id)+'\',\'tr_resume\')','s'));
  if(['started','running','done','evaluated','suspended'].indexOf(r.st)>=0)B.push(btn(Lx('غير مجتاز','Not passed'),'V51.h.ft279st(\''+e9(r.id)+'\',\'tr_fail\')','s'));
  if(B.length)o+='<p>'+B.join(' ')+'</p>';
  if(d.rate)o+='<p class="mu">'+Lx('تقييم المتدرب للجهة: ','Trainee rating of the organization: ')+(d.rate.c||[]).reduce(function(a,x){return a+(+x||0)},0)+' / 20'+(d.rate.cmt?' — '+e9(d.rate.cmt):'')+'</p>'}
 if(d.susp&&r.st==='suspended')o+='<div class="msg er">'+Lx('موقوف: ','Suspended: ')+e9(d.susp.why||'')+'</div>';
 if(d.fail&&r.st==='failed')o+='<div class="msg er">'+Lx('غير مجتاز: ','Not passed: ')+e9(d.fail.why||'')+'</div>';
 return o?'<div class="box ft279tr"><b>'+Lx('حالة التدريب','Training status')+'</b>'+o+'</div>':''};
try{var vg2=V.graduates;if(typeof vg2==='function'&&!vg2.__v279b){V.graduates=function(){var h=vg2.apply(this,arguments);try{var p=location.hash.replace(/^#\/?/,'').split('/');if(p[1]==='r'&&p[2]&&FT.ld&&typeof h==='string'&&h.indexOf('ft279tr')<0){var r=REC(decodeURIComponent(p[2])),b=trBox(r);if(b){var i=h.indexOf('</nav>');h=i>0?h.slice(0,i+6)+b+h.slice(i+6):h+b}}}catch(e){console.error('v279 tr',e)}return h};V.graduates.__v279b=1}}catch(e){}

/* متابعة التدريب في لوحة الإدارة */
G.tf='act';H.ft279tf=function(v){G.tf=v;go()};
var GRP={act:['approved','letter','accepted','started','running','suspended'],req:['draft','submitted','returned'],end:['done','evaluated','closed','failed','rejected','withdrawn']};
function trView(){var A=(FT.recs||[]).filter(function(r){return r.kind==='tr'}),L0=A.filter(function(r){return G.tf==='all'||(GRP[G.tf]||[]).indexOf(r.st)>=0});
 var o='<p>'+[['act',Lx('الجارية','Active')],['req',Lx('الطلبات','Applications')],['end',Lx('المنتهية','Finished')],['all',Lx('الكل','All')]].map(function(x){return btn(x[1]+' ('+(x[0]==='all'?A.length:A.filter(function(r){return (GRP[x[0]]||[]).indexOf(r.st)>=0}).length)+')','V51.h.ft279tf(\''+x[0]+'\')',G.tf===x[0]?'':'s')}).join(' ')+'</p>';
 return o+tbl([Lx('المتدرب','Trainee'),Lx('الجهة','Organization'),Lx('الحالة','Status'),Lx('الخطة','Plan'),Lx('الحضور (معتمد / المطلوب)','Attendance (approved / required)'),Lx('الزيارات','Visits'),Lx('منتصف التدريب','Mid report'),Lx('التقرير الختامي','Final report'),Lx('التقييمات','Evaluations'),''],L0.map(function(r){var d=r.data||{},h=TRH(r),pl=d.plan,m=subOf(r,'mid'),f=subOf(r,'report');
  return '<tr><td>'+e9(nmOf(r))+'</td><td>'+e9(((d.app||{}).ent)||'—')+'</td><td>'+chip(r)+'</td><td>'+(pl?(pl.ok?yes(1,Lx('معتمدة','approved')):'<span class="tag">'+Lx('بانتظار الاعتماد','awaiting approval')+'</span>'):yes(0))+'</td><td>'+h.okh+' / '+needH(r)+(h.pend?' <small class="mu">('+h.pend+Lx(' يوم بانتظار الاعتماد',' day(s) pending')+')</small>':'')+'</td><td>'+(((d.visits||[]).length)||'—')+'</td><td>'+yes(!!m,m&&m.ack?Lx('مستلم','received'):'')+'</td><td>'+yes(!!f,f&&f.ack?Lx('مستلم','received'):'')+'</td><td>'+[['e8',Lx('الجهة','Org')],['e9',Lx('ذاتي','Self')],['e11',Lx('الملف','File')]].map(function(x){return d[x[0]]?'<span class="tag ok">'+x[1]+'</span>':'<span class="tag">'+x[1]+'</span>'}).join(' ')+'</td><td><a class="btn s" href="'+link('r/'+encodeURIComponent(r.id))+'">'+Lx('فتح','Open')+'</a></td></tr>'}))}
X.ft279tr={trView:trView,trBox:trBox};

/* =====================================================================
   v281 — مركز خدمات الطالب في بوابة الخريجين: مسار التخرج، و«خطوتك التالية»،
   وكل خدمات التدريب الميداني ومشروع التخرج والخدمات العامة في بطاقات بحالتها وزرّها المباشر.
   ===================================================================== */
var myRef=function(){return String(who().ref||(typeof me!=='undefined'&&me&&me.id)||'')};
var mineK=function(k){var m=myRef();return (FT.recs||[]).filter(function(r){return r.kind===k&&(String(r.sid)===m||((r.data&&r.data.mem)||[]).indexOf(m)>=0)})};
var liveR=function(r){return ['closed','withdrawn','rejected','archived','failed'].indexOf(r.st)<0};
var stOf=function(r){var t=((FT.ST||{})[r.kind]||{})[r.st]||[r.st,r.st];return Lx(t[0],t[1])};
var IN=function(r,a){return !!r&&a.indexOf(r.st)>=0};
var q=function(x){return '\''+e9(String(x))+'\''};
var B=function(t,on,c){return btn(t,on,c||'s')};
var GO=function(t,href){return '<a class="btn s" href="'+href+'">'+t+'</a>'};
var tag=function(t,k){return '<span class="tag'+(k?' '+k:'')+'">'+t+'</span>'};
var CSS279='<style id="css279">.h279{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:8px 0 18px}.c279{background:var(--sf,#fff);border:1px solid var(--bd,#dde3ea);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:150px}.c279 h4{margin:0;font-size:16px;display:flex;gap:8px;align-items:center}.c279 .cd{font-size:12px;color:var(--mu,#667);font-weight:400}.c279 .ft{margin-top:auto;display:flex;flex-wrap:wrap;gap:6px}.c279.lk{opacity:.72}.c279.nx{border:2px solid var(--pr,#1b3a6b)}.st279{display:flex;gap:0;margin:10px 0 16px;overflow-x:auto}.st279 div{flex:1;min-width:92px;text-align:center;position:relative;padding-top:34px;font-size:13px}.st279 div:before{content:attr(data-n);position:absolute;top:0;left:50%;transform:translateX(-50%);width:28px;height:28px;border-radius:50%;line-height:28px;background:#e5e9ef;color:#445;font-weight:700}.st279 div.ok:before{content:"✔";background:#2e7d32;color:#fff}.st279 div.cur:before{background:var(--pr,#1b3a6b);color:#fff}.st279 div:after{content:"";position:absolute;top:14px;height:2px;background:#d5dbe3;width:100%;right:50%;z-index:-1}.st279 div:first-child:after{display:none}.nx279{background:var(--pr,#1b3a6b);color:#fff;border-radius:12px;padding:14px 16px;margin:10px 0}.nx279 .btn{background:#fff;color:var(--pr,#1b3a6b)}.sec279{display:flex;align-items:center;gap:8px;margin:22px 0 4px;font-size:19px}</style>';
var cardH=function(o){return '<div class="c279'+(o.lk?' lk':'')+(o.nx?' nx':'')+'"><h4>'+(o.i||'')+' <span>'+o.t+(o.c?' <span class="cd">('+o.c+')</span>':'')+'</span></h4><div>'+(o.s||'')+'</div>'+(o.d?'<small class="mu">'+o.d+'</small>':'')+'<div class="ft">'+(o.b||'')+'</div></div>'};
var LOCK=function(){return B(Lx('لماذا لا تتاح؟','Why unavailable?'),'V51.h.ft231na(\'stu\')')};

function hubStudent(){var w=who(),el=!!w.elig,d=w.eld||{},tr=mineK('tr').filter(liveR)[0]||null,gp=mineK('gp').filter(function(r){return r.st!=='rejected'})[0]||null,ap=mineK('app'),rc=mineK('rec');
 var td=tr&&tr.data||{},gd=gp&&gp.data||{},H0=tr?TRH(tr):{n:0,h:0,okh:0,pend:0},NH=tr?needH(tr):+((FT.cfg||{}).hours||60);
 var trOk=IN(tr,['evaluated','closed']),gpOk=IN(gp,['final_ok','archived']),notes=(FT.notes||[]).filter(function(n){return !n.seen});
 /* مسار التخرج */
 var steps=[[Lx('الاستحقاق','Eligibility'),el],[Lx('التدريب الميداني','Field training'),trOk],[Lx('مشروع التخرج','Graduation project'),gpOk],[Lx('رصد الدرجة ونشرها','Grade posted & published'),false],[Lx('التخرج','Graduation'),false]],cur=steps.findIndex(function(x){return !x[1]});
 var pct=Math.round(steps.filter(function(x){return x[1]}).length/steps.length*100);
 var o=CSS279+'<div class="box" style="margin:6px 0"><b>'+Lx('مسار تخرّجك','Your path to graduation')+'</b> — '+pct+'%<div class="st279">'+steps.map(function(x,i){return '<div data-n="'+(i+1)+'" class="'+(x[1]?'ok':i===cur?'cur':'')+'">'+e9(x[0])+'</div>'}).join('')+'</div></div>';
 /* خطوتك التالية */
 var nx=null;
 if(!el)nx=[Lx('استكمل شروط الاستحقاق','Complete the eligibility conditions'),Lx('بقي عليك ','Remaining: ')+leftN(d)+Lx(' من الشروط — التفاصيل في بطاقة «الاستحقاق».',' condition(s) — see the “Eligibility” card.'),''];
 else if(!tr)nx=[Lx('ابدأ تدريبك الميداني','Start your field training'),Lx('أنشئ ملف التدريب وقدّم طلب الالتحاق (ت-1)، أو تقدّم إلى فرصة داخلية.','Create your training file and submit the application (T-1), or apply for an internal opportunity.'),B(Lx('طلب التحاق بالتدريب','Apply for training'),'V51.h.ft225newTr()','')];
 else if(IN(tr,['draft','returned']))nx=[Lx('أكمل طلب الالتحاق وأرسله','Complete and submit your application'),tr.st==='returned'?Lx('أُعيد طلبك للتعديل؛ عدّله ثم أرسله.','Your application was returned; edit and resubmit it.'):Lx('طلبك مسودة لم تُرسل بعد.','Your application is a draft.'),B(Lx('تعبئة الطلب (ت-1)','Fill in the application (T-1)'),'V51.h.ft225trApp('+q(tr.id)+')','')];
 else if(IN(tr,['submitted','approved','letter']))nx=[Lx('طلبك قيد الإجراء','Your application is in progress'),stOf(tr)+Lx(' — سيصلك إشعار عند كل خطوة.',' — you will be notified at each step.'),GO(Lx('فتح الملف','Open file'),link('r/'+encodeURIComponent(tr.id)))];
 else if(IN(tr,['accepted']))nx=[Lx('باشر تدريبك','Start your training'),Lx('أرسل إشعار المباشرة (ت-4) ثم أعدّ خطة التدريب (ت-5).','Send the start notice (T-4), then prepare the training plan (T-5).'),B(Lx('إشعار المباشرة','Start notice'),'V51.h.ft225start('+q(tr.id)+')','')];
 else if(IN(tr,['started','running'])&&!(td.plan&&td.plan.weeks))nx=[Lx('أعدّ خطة التدريب','Prepare your training plan'),Lx('الأهداف والمهام الأسبوعية، ويعتمدها مشرفاك.','Goals and weekly tasks, approved by both supervisors.'),B(Lx('خطة التدريب (ت-5)','Training plan (T-5)'),'V51.h.ft225plan('+q(tr.id)+')','')];
 else if(IN(tr,['started','running']))nx=[Lx('دوّن يومك في السجل اليومي','Record today in your daily log'),Lx('المعتمد: ','Approved: ')+H0.okh+' / '+NH+Lx(' ساعة',' hours'),B(Lx('إضافة يوم','Add a day'),'V51.h.ft225day('+q(tr.id)+')','')];
 else if(!gp)nx=[Lx('سجّل مشروع تخرجك','Register your graduation project'),Lx('العنوان والمشكلة والأهداف والمنهج والخطة الزمنية.','Title, problem, objectives, method and timeline.'),B(Lx('تسجيل المشروع (م-1)','Register project (G-1)'),'V51.h.ft225gpForm()','')];
 else if(!gpOk)nx=[Lx('تابع مشروع تخرجك','Continue your graduation project'),stOf(gp),GO(Lx('فتح المشروع','Open project'),link('r/'+encodeURIComponent(gp.id)))];
 else nx=[Lx('أتممتَ التدريب والمشروع','Training and project completed'),Lx('تُرصد الدرجة وتظهر بعد نشر نتائج الفصل وتأكيد الرسوم.','The grade is posted and appears after the semester results are published and fees confirmed.'),''];
 o+='<div class="nx279"><b>'+Lx('خطوتك التالية: ','Your next step: ')+e9(nx[0])+'</b><p style="margin:6px 0">'+nx[1]+'</p>'+(nx[2]||'')+'</div>';
 /* الاستحقاق */
 o+='<h3 class="sec279">🎓 '+Lx('الاستحقاق','Eligibility')+'</h3><div class="box">'+(el?tag(Lx('مستحق','Eligible'),'ok'):tag(Lx('غير مستحق بعد','Not yet eligible'),'er'))+' <small class="mu">'+Lx('يُحسب آلياً من سجلك الأكاديمي الرسمي والسجل المالي.','Calculated automatically from your official record and the finance ledger.')+'</small><details'+(el?'':' open')+'><summary>'+Lx('عرض الشروط','Show the conditions')+'</summary>'+eligList(d)+'</details></div>';
 /* التدريب الميداني */
 var T0=tr?q(tr.id):'',tl=!el,C=[],F=tr?link('r/'+encodeURIComponent(tr.id)):'';
 var mid=tr&&subOf(tr,'mid'),fin=tr&&subOf(tr,'report');
 C.push({i:'📝',t:Lx('طلب الالتحاق بالتدريب','Training application'),c:'ت-1',s:tr?chip(tr):tag(Lx('لم يُقدَّم','Not submitted')),d:tr&&td.app&&td.app.ent?e9(td.app.ent):Lx('اختر فرصة أو اقترح جهة تدريب.','Choose an opportunity or propose an organization.'),
  b:tl?LOCK():!tr?B(Lx('تقديم الطلب','Apply'),'V51.h.ft225newTr()',''):IN(tr,['draft','returned'])?B(Lx('تعبئة الطلب','Fill in'),'V51.h.ft225trApp('+T0+')','')+GO(Lx('الملف','File'),F):GO(Lx('فتح الملف','Open file'),F),nx:el&&(!tr||IN(tr,['draft','returned']))});
 C.push({i:'🏢',t:Lx('الفرص الداخلية','Internal opportunities'),c:'ت-15',s:(FT.recs||[]).filter(function(r){return r.kind==='opp'&&r.st==='pub'}).length+Lx(' فرصة منشورة',' published'),d:ap.length?ap.map(function(a){return stOf(a)}).join('، '):'',b:tl?LOCK():GO(Lx('عرض الفرص والتقدّم','View & apply'),link('opp'))});
 C.push({i:'➕',t:Lx('اقتراح جهة تدريب','Propose an organization'),s:Lx('جهة من خارج المعهد تعرفها','An outside organization you know'),d:Lx('تراجعها وحدة التدريب وتعتمدها.','Reviewed and approved by the Training Unit.'),b:tl?LOCK():B(Lx('اقتراح جهة','Propose'),'V51.h.ft225propose()')});
 C.push({i:'🚀',t:Lx('إشعار مباشرة التدريب','Training start notice'),c:'ت-4',s:td.start?tag(Lx('أُرسل','Sent'),'ok')+(tr.st==='running'?' '+tag(Lx('أكّدته الجهة','Confirmed'),'ok'):''):tag('—'),b:IN(tr,['accepted'])?B(Lx('إرسال الإشعار','Send notice'),'V51.h.ft225start('+T0+')',''):'',lk:!IN(tr,['accepted','started','running','done','evaluated','closed'])});
 C.push({i:'🗓️',t:Lx('خطة التدريب','Training plan'),c:'ت-5',s:td.plan?(td.plan.ok?tag(Lx('معتمدة','Approved'),'ok'):tag(Lx('بانتظار الاعتماد','Awaiting approval'))):tag(Lx('لم تُعدّ','Not prepared')),d:Lx('أهداف ومهام أسبوعية يعتمدها المشرفان.','Weekly goals and tasks approved by both supervisors.'),b:IN(tr,['accepted','started','running'])?B(td.plan?Lx('تعديل الخطة','Edit plan'):Lx('إعداد الخطة','Prepare plan'),'V51.h.ft225plan('+T0+')',''):'',lk:!IN(tr,['accepted','started','running','done','evaluated','closed'])});
 C.push({i:'⏱️',t:Lx('السجل اليومي والحضور','Daily log & attendance'),c:'ت-6',s:'<b>'+H0.okh+'</b> / '+NH+Lx(' ساعة معتمدة',' approved hours')+'<div style="background:#e5e9ef;border-radius:6px;height:8px;margin-top:6px"><div style="width:'+Math.min(100,Math.round(H0.okh/NH*100))+'%;background:#2e7d32;height:8px;border-radius:6px"></div></div>',d:H0.n+Lx(' يوماً مدوَّناً',' day(s) logged')+(H0.pend?' — '+H0.pend+Lx(' بانتظار اعتماد المشرف الميداني',' awaiting the field supervisor'):''),b:IN(tr,['started','running'])?B(Lx('إضافة يوم','Add a day'),'V51.h.ft225day('+T0+')','')+GO(Lx('السجل','Log'),F):'',lk:!IN(tr,['started','running','done','evaluated','closed'])});
 C.push({i:'✅',t:Lx('المهام','Tasks'),s:((td.tasks||[]).length)+Lx(' مهمة',' task(s)')+' — '+((td.tasks||[]).filter(function(x){return x.done}).length)+Lx(' منجزة',' done'),b:tr?GO(Lx('عرض المهام','View tasks'),F):'',lk:!IN(tr,['started','running','done'])});
 C.push({i:'📄',t:Lx('تقرير منتصف التدريب','Mid-training report'),s:mid?tag(mid.ack?Lx('مستلم','Received'):Lx('مُسلَّم','Submitted'),'ok'):tag(Lx('لم يُسلَّم','Not submitted')),b:tr?GO(Lx('التسليم','Submit'),F):'',lk:!IN(tr,['running','done','evaluated','closed'])});
 C.push({i:'📘',t:Lx('التقرير الختامي','Final report'),c:'ت-10',s:fin?tag(fin.ack?Lx('مستلم','Received'):Lx('مُسلَّم','Submitted'),'ok'):tag(Lx('لم يُسلَّم','Not submitted')),b:tr?GO(Lx('التسليم','Submit'),F):'',lk:!IN(tr,['running','done','evaluated','closed'])});
 C.push({i:'🪞',t:Lx('التقويم الذاتي','Self-evaluation'),c:'ت-9',s:td.e9?tag(Lx('مُرسل','Sent'),'ok'):tag('—'),b:IN(tr,['running','done'])?B(td.e9?Lx('تعديل','Edit'):Lx('تعبئة','Fill in'),'V51.h.ft225e9('+T0+')',''):'',lk:!IN(tr,['running','done','evaluated','closed'])});
 C.push({i:'⭐',t:Lx('تقييم جهة التدريب','Rate the organization'),s:td.rate?tag(Lx('مُرسل','Sent'),'ok'):tag('—'),b:IN(tr,['done','evaluated'])&&!td.rate?GO(Lx('تقييم الجهة','Rate'),F):'',lk:!IN(tr,['done','evaluated','closed'])});
 C.push({i:'🔁',t:Lx('تمديد أو انسحاب أو تغيير جهة','Extension / withdrawal / change'),c:'ت-12',s:((td.reqs||[]).length)+Lx(' طلب',' request(s)'),b:IN(tr,['approved','letter','accepted','started','running','suspended'])?B(Lx('تقديم طلب','Request'),'V51.h.ft225req('+T0+')'):'',lk:!IN(tr,['approved','letter','accepted','started','running','suspended'])});
 C.push({i:'📜',t:Lx('وثائق التدريب','Training documents'),s:Lx('خطاب التوجيه، إفادة تدريب جارٍ، شهادة الإتمام','Referral letter, ongoing-training statement, completion certificate'),d:Lx('برقم ورمز QR للتحقق.','Numbered with a QR code.'),b:tr?GO(Lx('عرض الوثائق','Documents'),link('doc/'+encodeURIComponent(tr.id))):'',lk:!tr});
 o+='<h3 class="sec279">🏫 '+Lx('التدريب الميداني','Field training')+(tr?' '+chip(tr):'')+'</h3><div class="h279">'+C.map(cardH).join('')+'</div>';
 /* مشروع التخرج */
 var G0=gp?q(gp.id):'',GF=gp?link('r/'+encodeURIComponent(gp.id)):'',P=[],SG=[['plan',Lx('الخطة','Plan')],['ch',Lx('الفصول','Chapters')],['draft',Lx('المسودة','Draft')],['final',Lx('النهائية','Final')]];
 P.push({i:'💡',t:Lx('مقترح المشروع','Project proposal'),c:'م-1',s:gp?chip(gp):tag(Lx('لم يُسجَّل','Not registered')),d:gp&&gd.reg?e9(gd.reg.title||''):Lx('فردي أو جماعي، بالعربية والإنجليزية.','Individual or group, in Arabic and English.'),b:tl?LOCK():!gp?B(Lx('تسجيل المشروع','Register'),'V51.h.ft225gpForm()',''):IN(gp,['proposed','returned'])?B(Lx('تعديل المقترح','Edit'),'V51.h.ft225gpForm('+G0+')','')+GO(Lx('الملف','File'),GF):GO(Lx('فتح المشروع','Open project'),GF),nx:el&&!!tr&&!gp});
 P.push({i:'🤝',t:Lx('إقرار الأمانة العلمية','Academic integrity declaration'),c:'م-2',s:gd.m2?tag(Lx('موقَّع','Signed'),'ok'):tag('—'),b:gp&&!gd.m2?B(Lx('توقيع الإقرار','Sign'),'V51.h.ft225m2('+G0+')'):'',lk:!gp});
 P.push({i:'👨‍🏫',t:Lx('المشرف واللقاءات','Supervisor & meetings'),c:'م-4',s:gd.gsup?e9((gd.nm&&gd.nm[gd.gsup])||gd.gsup):tag(Lx('لم يُسند بعد','Not assigned yet')),d:((gd.meets||[]).length)+Lx(' لقاء إشرافي',' meeting(s)'),b:gp?GO(Lx('عرض','View'),GF):'',lk:!gp||!gd.gsup});
 P.push({i:'📚',t:Lx('المراحل والتسليمات','Stages & submissions'),s:SG.map(function(x){var y=gp&&subOf(gp,x[0]);return y?tag('✔ '+x[1],'ok'):tag(x[1])}).join(' '),d:(function(){var dl=(FT.cfg||{}).dead||{},n=SG.filter(function(x){return dl[x[0]]&&dl[x[0]]>=today()&&!(gp&&subOf(gp,x[0]))})[0];return n?Lx('الموعد القادم: ','Next deadline: ')+n[1]+' '+e9(dl[n[0]]):''})(),b:gp?GO(Lx('التسليم','Submit'),GF):'',lk:!IN(gp,['assigned','plan_ok','inprogress','draft_final','approved_def','discussed','revisions'])});
 P.push({i:'✏️',t:Lx('تغيير المشرف أو العنوان','Change supervisor or title'),c:'م-5',s:'',b:IN(gp,['assigned','plan_ok','inprogress'])?B(Lx('تقديم طلب','Request'),'V51.h.ft225m5('+G0+')'):'',lk:!IN(gp,['assigned','plan_ok','inprogress'])});
 P.push({i:'🎤',t:Lx('الإذن بالمناقشة والمناقشة','Defence approval & defence'),c:'م-6 / م-7',s:gd.m7?e9((gd.m7.date||'')+' '+(gd.m7.time||'')+' — '+(gd.m7.place||'')):IN(gp,['approved_def'])?tag(Lx('مُجاز للمناقشة','Approved for defence'),'ok'):tag('—'),b:gp?GO(Lx('عرض','View'),GF):'',lk:!IN(gp,['draft_final','approved_def','discussed','revisions','final_ok','archived'])});
 P.push({i:'🏁',t:Lx('النتيجة والتعديلات','Result & revisions'),c:'م-9',s:IN(gp,['revisions'])?tag(Lx('تعديلات مطلوبة','Revisions required'),'er'):IN(gp,['discussed'])?tag(Lx('نوقش','Defended')):gpOk?tag(Lx('معتمد نهائياً','Finally approved'),'ok'):tag('—'),b:IN(gp,['revisions'])?GO(Lx('تسليم المعدّلة','Submit revised'),GF):'',lk:!IN(gp,['discussed','revisions','final_ok','archived'])});
 P.push({i:'🏅',t:Lx('وثائق المشروع','Project documents'),c:'م-10',s:Lx('إفادة إنجاز مشروع التخرج وغيرها','Project completion statement and more'),b:gp?GO(Lx('عرض الوثائق','Documents'),link('doc/'+encodeURIComponent(gp.id))):'',lk:!gp});
 o+='<h3 class="sec279">🎯 '+Lx('مشروع التخرج','Graduation project')+(gp?' '+chip(gp):'')+'</h3><div class="h279">'+P.map(cardH).join('')+'</div>';
 /* خدمات عامة */
 var U=[];
 U.push({i:'🔔',t:Lx('الإشعارات','Notifications'),s:(FT.notes||[]).length?((FT.notes||[]).length+Lx(' إشعار',' notification(s)')):Lx('لا إشعارات','No notifications'),d:(FT.notes||[]).slice(0,3).map(function(n){return '• '+e9(Lx(n.ar,n.en||n.ar))}).join('<br>'),b:B(Lx('عرض الكل','View all'),'V51.h.ft281notes()')});
 U.push({i:'📊',t:Lx('درجاتي','My grades'),s:Lx('درجة التدريب والمشروع تظهر بعد نشر نتائج الفصل وتأكيد الرسوم.','Training and project grades appear after results are published and fees confirmed.'),b:GO(Lx('سجلي الأكاديمي','My record'),'#/student')});
 U.push({i:'🔎',t:Lx('التحقق من وثيقة','Verify a document'),s:Lx('برقم الوثيقة أو رمز QR','By number or QR code'),b:'<form onsubmit="location.hash=\'#/ft-verify/\'+encodeURIComponent(this.r.value.trim());return false" style="display:flex;gap:6px;width:100%"><input name="r" required placeholder="'+Lx('رقم الوثيقة','Document no.')+'" dir="ltr" style="flex:1;min-width:0"><button class="btn s">'+Lx('تحقق','Verify')+'</button></form>'});
 U.push({i:'📖',t:Lx('دليل الطالب','Student guide'),s:Lx('خطوات التدريب والمشروع من البداية إلى التخرج','Training and project steps from start to graduation'),b:B(Lx('عرض الدليل','Open guide'),'V51.h.ft281guide()')});
 if(rc.length)U.push({i:'🤝',t:Lx('التوصية بالتعاون','Cooperation recommendation'),c:'ت-18',s:rc.map(chip).join(' '),b:GO(Lx('فتح','Open'),link('r/'+encodeURIComponent(rc[0].id)))});
 o+='<h3 class="sec279">🧭 '+Lx('خدمات عامة','General services')+'</h3><div class="h279">'+U.map(cardH).join('')+'</div>';
 var old=mineK('tr').concat(mineK('gp')).filter(function(r){return !liveR(r)&&r!==tr&&r!==gp});
 if(old.length)o+='<details class="box"><summary>'+Lx('ملفات سابقة','Previous files')+' ('+old.length+')</summary>'+old.map(function(r){return '<p>'+chip(r)+' '+GO(Lx('فتح','Open'),link('r/'+encodeURIComponent(r.id)))+'</p>'}).join('')+'</details>';
 return o}
H.ft281notes=function(){var n=FT.notes||[];MD(Lx('الإشعارات','Notifications'),n.length?'<ul>'+n.map(function(x){return '<li><small class="mu" dir="ltr">'+e9(String(x.at||'').slice(0,16).replace('T',' '))+'</small> '+e9(Lx(x.ar,x.en||x.ar))+(x.rec_id&&REC(x.rec_id)?' — <a href="'+link('r/'+encodeURIComponent(x.rec_id))+'" onclick="closeMdl()">'+Lx('فتح','Open')+'</a>':'')+'</li>'}).join('')+'</ul>':'<p class="mu">'+Lx('لا إشعارات.','No notifications.')+'</p>')};
var GUIDE=[['الاستحقاق','Eligibility','تحقق من بطاقة «الاستحقاق»: الشروط المستوفاة والباقية.','Check the “Eligibility” card: met and remaining conditions.'],['طلب التدريب','Training application','قدّم طلب الالتحاق (ت-1) باختيار فرصة داخلية أو جهة خارجية، وانتظر قرار وحدة التدريب.','Submit the application (T-1) choosing an internal opportunity or an outside organization, then await the Training Unit’s decision.'],['خطاب التوجيه والقبول','Referral & acceptance','يصدر خطاب التوجيه (ت-2) وتؤكد الجهة قبولك.','The referral letter (T-2) is issued and the organization confirms your acceptance.'],['المباشرة والخطة','Start & plan','أرسل إشعار المباشرة (ت-4) وأعدّ خطة التدريب (ت-5).','Send the start notice (T-4) and prepare the plan (T-5).'],['السجل اليومي','Daily log','دوّن كل يوم في يومه (ت-6)، ويعتمده المشرف الميداني.','Log each day (T-6); the field supervisor approves it.'],['التقارير والتقييم','Reports & evaluation','سلّم تقرير منتصف التدريب والتقرير الختامي (ت-10)، واملأ التقويم الذاتي (ت-9)، وقيّم الجهة.','Submit the mid and final reports (T-10), fill in the self-evaluation (T-9) and rate the organization.'],['مشروع التخرج','Graduation project','سجّل المقترح (م-1) ووقّع الإقرار (م-2)، ثم سلّم المراحل في مواعيدها حتى الإذن بالمناقشة.','Register the proposal (G-1), sign the declaration (G-2), then submit each stage on time until the defence is approved.'],['المناقشة والنتيجة','Defence & result','تُشكَّل اللجنة ويُحدَّد الموعد (م-7)، ثم تُعتمد النتيجة والتعديلات.','The committee and date are set (G-7), then the result and revisions are finalised.'],['الدرجة والتخرج','Grade & graduation','تُرصد الدرجة آلياً وتظهر بعد نشر نتائج الفصل وتأكيد الرسوم، ثم يُعتمد تخرجك.','The grade is posted automatically and appears after results are published and fees confirmed; then your graduation is approved.']];
H.ft281guide=function(){MD(Lx('دليل الطالب في بوابة الخريجين','Student guide to the Graduates Portal'),'<ol>'+GUIDE.map(function(g){return '<li><b>'+e9(Lx(g[0],g[1]))+':</b> '+e9(Lx(g[2],g[3]))+'</li>'}).join('')+'</ol>')};
try{var vg3=V.graduates;if(typeof vg3==='function'&&!vg3.__v281){V.graduates=function(){var h=vg3.apply(this,arguments);try{var p=location.hash.replace(/^#\/?/,'').split('/');if(typeof me!=='undefined'&&me&&me.r==='student'&&FT.ld&&(!p[1]||p[1]==='elig')&&typeof h==='string'){var i=h.indexOf('</nav>');if(i>0)h=h.slice(0,i+6)+hubStudent()}}catch(e){console.error('v281 hub',e)}return h};V.graduates.__v281=1}}catch(e){}
X.ft281={hubStudent:hubStudent};
/* =====================================================================
   v282 — مركز خدمات المشرفين في بوابة الخريجين (المشرف الأكاديمي، مشرف المشروع، لجنة المناقشة،
   المشرف الميداني من داخل المعهد، والمنسقون): «بانتظار قرارك» مرتباً، وبطاقة لكل متدرب ومشروع ومناقشة.
   ===================================================================== */
var rolesOn=function(r,m){var d=r.data||{},a=[];if(d.isup===m)a.push('isup');if(d.usup===m)a.push('usup');if(d.gsup===m)a.push('gsup');if((d.cmt||[]).indexOf(m)>=0)a.push('cmt');return a};
var RN={isup:['المشرف الأكاديمي','Academic supervisor'],usup:['المشرف الميداني','Field supervisor'],gsup:['مشرف المشروع','Project supervisor'],cmt:['عضو لجنة المناقشة','Defence committee member']};
var daysSince=function(d){return d?Math.floor((Date.now()-new Date(String(d).slice(0,10)+'T12:00:00Z'))/864e5):9999};
function pendingFor(r,m){var d=r.data||{},R=rolesOn(r,m),I=q(r.id),P=[],F=link('r/'+encodeURIComponent(r.id)),c=FT.cfg||{};
 var add=function(t,b,u){P.push({r:r,t:t,b:b,u:u||0})};
 var subsOpen=(d.subs||[]).filter(function(x){return !x.ack});
 if(r.kind==='tr'){
  if(R.indexOf('isup')>=0){
   if(r.st==='submitted'&&!d.isupRec)add(Lx('توصيتك في طلب التدريب (ت-1)','Your recommendation on the application (T-1)'),B(Lx('التوصية','Recommend'),'V51.h.ft225rec1('+I+')',''),2);
   if(d.plan&&!d.plan.ok&&IN(r,['accepted','started','running']))add(Lx('اعتماد خطة التدريب (ت-5)','Approve the training plan (T-5)'),B(Lx('اعتماد الخطة','Approve plan'),'V51.h.ft225act('+I+',\'tr_plan_ok\',{ok:1})',''),2);
   var lv=((d.visits||[]).map(function(v){return v.date}).sort().pop());if(IN(r,['started','running'])&&daysSince(lv||(d.start&&d.start.date))>(+c.revDays||14))add(Lx('زيارة إشرافية مستحقة (ت-7)','Supervision visit due (T-7)'),B(Lx('تسجيل زيارة','Record visit'),'V51.h.ft225visit('+I+')',''),1);
   if(IN(r,['done','running'])&&!d.e11&&r.st==='done')add(Lx('تقويم ملف التدريب وعرضه (ت-11)','Evaluate the training file (T-11)'),B(Lx('التقويم','Evaluate'),'V51.h.ft225e11('+I+')',''),2);
   if(subsOpen.length)add(Lx('استلام تقرير مُسلَّم','Receive a submitted report'),GO(Lx('فتح','Open'),F),1);
   if((d.reqs||[]).some(function(x){return !x.op&&!x.dec}))add(Lx('رأيك في طلب الطالب (ت-12)','Your opinion on the student request (T-12)'),GO(Lx('فتح','Open'),F),1)}
  if(R.indexOf('usup')>=0){
   if(r.st==='started')add(Lx('تأكيد مباشرة المتدرب','Confirm the trainee start'),GO(Lx('فتح','Open'),F),2);
   var pl=(d.log||[]).filter(function(x){return !x.ok&&!x.rej}).length;if(pl)add(Lx('اعتماد أيام الحضور: ','Approve attendance days: ')+pl,GO(Lx('اعتماد','Approve'),F),2);
   if(IN(r,['running','done'])&&!d.e8)add(Lx('تقويم مشرف الجهة (ت-8)','Organization supervisor evaluation (T-8)'),B(Lx('التقويم','Evaluate'),'V51.h.ft225e8('+I+')',''),r.st==='done'?2:0)}}
 if(r.kind==='gp'){
  if(R.indexOf('gsup')>=0){
   if(r.st==='assigned')add(Lx('اعتماد خطة المشروع','Approve the project plan'),B(Lx('اعتماد','Approve'),'V51.h.ft225act('+I+',\'gp_plan_ok\',{})',''),2);
   var lm=((d.meets||[]).map(function(x){return x.date}).sort().pop());if(IN(r,['assigned','plan_ok','inprogress','draft_final'])&&daysSince(lm||String(r.updated_at||'').slice(0,10))>(+c.meetDays||21))add(Lx('لقاء إشرافي مستحق (م-4)','Supervision meeting due (G-4)'),B(Lx('تسجيل لقاء','Record meeting'),'V51.h.ft225m4('+I+')',''),1);
   if(subsOpen.length)add(Lx('مراجعة تسليم: ','Review a submission: ')+subsOpen.map(function(x){var t=STG[x.stage];return t?t:x.stage}).join('، '),GO(Lx('مراجعة','Review'),F),2);
   if(r.st==='draft_final'&&!d.m6)add(Lx('طلب الإذن بالمناقشة (م-6)','Request defence approval (G-6)'),B(Lx('الطلب','Request'),'V51.h.ft225m6('+I+')',''),2);
   if(IN(r,['discussed','revisions']))add(Lx('الاعتماد النهائي بعد المناقشة','Final approval after the defence'),GO(Lx('فتح','Open'),F),2);
   if(!d.gr&&IN(r,['inprogress','draft_final','approved_def','discussed']))add(Lx('رصد درجتي الخطة والمتابعة','Enter plan & follow-up grades'),B(Lx('الدرجات','Grades'),'V51.h.ft225gpGr('+I+')',''),0);
   if((d.reqs||[]).some(function(x){return !x.op&&!x.dec}))add(Lx('رأيك في طلب الطالب (م-5)','Your opinion on the student request (G-5)'),GO(Lx('فتح','Open'),F),1)}
  if(R.indexOf('cmt')>=0&&r.st==='approved_def'&&!((d.m8||[]).some(function(x){return x.id===m&&x.c})))add(Lx('تقويم المناقشة (م-8)','Defence evaluation (G-8)'),B(Lx('التقويم','Evaluate'),'V51.h.ft225m8('+I+')',''),2)}
 return P}
var STG={plan:Lx('الخطة','Plan'),ch:Lx('الفصول','Chapters'),draft:Lx('المسودة','Draft'),final:Lx('النهائية','Final'),rev:Lx('المعدّلة','Revised'),mid:Lx('منتصف التدريب','Mid report'),report:Lx('التقرير الختامي','Final report')};
function hubStaff(){var m=myRef(),w=who(),A=(FT.recs||[]).filter(function(r){return r.sid!==m&&rolesOn(r,m).length&&liveR(r)}),TR=A.filter(function(r){return r.kind==='tr'}),GP=A.filter(function(r){return r.kind==='gp'&&rolesOn(r,m).indexOf('gsup')>=0}),CM=A.filter(function(r){return r.kind==='gp'&&rolesOn(r,m).indexOf('cmt')>=0});
 var PN=[];A.forEach(function(r){PN=PN.concat(pendingFor(r,m))});PN.sort(function(a,b){return b.u-a.u});
 var o=CSS279+'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:8px 0">'+card(TR.length,Lx('متدربون أشرف عليهم','My trainees'))+card(GP.length,Lx('مشاريع أشرف عليها','My projects'))+card(CM.length,Lx('مناقشات في لجنتها','My defence committees'))+card(PN.length,Lx('بانتظار قراري','Awaiting my action'),PN.length?'er':'')+'</div>';
 var rl=(w.roles||[]).filter(function(x){return ['tc','pc','head'].indexOf(x)>=0});
 if(rl.length)o+='<div class="box"><b>'+Lx('لوحات التنسيق','Coordination boards')+'</b> '+(rl.indexOf('tc')>=0?GO(Lx('منسق التدريب','Training coordinator'),link('tcd'))+GO(Lx('جهات التدريب','Organizations'),link('orgs'))+GO(Lx('الفرص','Opportunities'),link('opps')):'')+(rl.indexOf('pc')>=0?GO(Lx('منسق المشاريع','Projects coordinator'),link('pcd')):'')+(rl.indexOf('head')>=0?GO(Lx('سجل المرشحين','Candidates'),link('cand')):'')+(rl.indexOf('tc')>=0||rl.indexOf('pc')>=0?GO(Lx('درجات 4401','4401 grades'),link('grades')):'')+'</div>';
 o+='<h3 class="sec279">⏳ '+Lx('بانتظار قرارك','Awaiting your action')+' ('+PN.length+')</h3>'+(PN.length?'<div class="h279">'+PN.map(function(x){return cardH({i:x.u>=2?'🔴':x.u?'🟠':'🟢',t:e9(x.t),s:'<b>'+e9(nmOf(x.r))+'</b> '+chip(x.r),d:e9(x.r.kind==='gp'?((x.r.data.reg||{}).title||''):((x.r.data.app||{}).ent||'')),b:x.b,nx:x.u>=2})}).join('')+'</div>':'<div class="msg ok">'+Lx('لا شيء ينتظر قرارك الآن.','Nothing awaits your action now.')+'</div>');
 o+='<h3 class="sec279">🏫 '+Lx('متدربيّ','My trainees')+' ('+TR.length+')</h3>'+(TR.length?'<div class="h279">'+TR.map(function(r){var d=r.data||{},h=TRH(r),N=needH(r),ll=(d.log||[]).map(function(x){return x.date}).sort().pop();return cardH({i:'👤',t:e9(nmOf(r)),c:rolesOn(r,m).map(function(k){return Lx(RN[k][0],RN[k][1])}).join('، '),s:chip(r)+' <small>'+e9((d.app||{}).ent||'')+'</small><div style="margin-top:6px">'+h.okh+' / '+N+Lx(' ساعة معتمدة',' approved hours')+'</div><div style="background:#e5e9ef;border-radius:6px;height:8px;margin-top:4px"><div style="width:'+Math.min(100,Math.round(h.okh/N*100))+'%;background:#2e7d32;height:8px;border-radius:6px"></div></div>',d:(ll?Lx('آخر يوم مدوَّن: ','Last logged day: ')+e9(ll):Lx('لم يدوّن بعد','Nothing logged yet'))+' — '+Lx('الزيارات: ','Visits: ')+((d.visits||[]).length),b:GO(Lx('فتح الملف','Open file'),link('r/'+encodeURIComponent(r.id)))+(rolesOn(r,m).indexOf('isup')>=0&&IN(r,['started','running','done'])?B(Lx('زيارة','Visit'),'V51.h.ft225visit('+q(r.id)+')'):'')})}).join('')+'</div>':'<p class="mu">'+Lx('لا متدربين مسندين إليك.','No trainees assigned to you.')+'</p>');
 o+='<h3 class="sec279">🎯 '+Lx('مشاريعي','My projects')+' ('+GP.length+')</h3>'+(GP.length?'<div class="h279">'+GP.map(function(r){var d=r.data||{},sg=['plan','ch','draft','final'];return cardH({i:'📘',t:e9((d.reg||{}).title||nmOf(r)),c:e9(nmOf(r)),s:chip(r)+'<div style="margin-top:6px">'+sg.map(function(k){var y=subOf(r,k);return y?tag('✔ '+STG[k],y.ack?'ok':''):tag(STG[k])}).join(' ')+'</div>',d:Lx('اللقاءات: ','Meetings: ')+((d.meets||[]).length),b:GO(Lx('فتح المشروع','Open project'),link('r/'+encodeURIComponent(r.id)))+(IN(r,['assigned','plan_ok','inprogress','draft_final'])?B(Lx('لقاء','Meeting'),'V51.h.ft225m4('+q(r.id)+')'):'')})}).join('')+'</div>':'<p class="mu">'+Lx('لا مشاريع مسندة إليك.','No projects assigned to you.')+'</p>');
 if(CM.length)o+='<h3 class="sec279">🎤 '+Lx('لجان المناقشة','Defence committees')+' ('+CM.length+')</h3><div class="h279">'+CM.map(function(r){var d=r.data||{},me8=(d.m8||[]).some(function(x){return x.id===m&&x.c});return cardH({i:'🎓',t:e9((d.reg||{}).title||nmOf(r)),c:e9(nmOf(r)),s:d.m7?e9((d.m7.date||'')+' '+(d.m7.time||'')+' — '+(d.m7.place||'')):chip(r),d:me8?Lx('سجّلتَ تقويمك.','You have submitted your evaluation.'):'',b:(r.st==='approved_def'&&!me8?B(Lx('تقويم المناقشة','Evaluate defence'),'V51.h.ft225m8('+q(r.id)+')',''):'')+GO(Lx('فتح','Open'),link('r/'+encodeURIComponent(r.id)))})}).join('')+'</div>';
 o+='<h3 class="sec279">🧭 '+Lx('أدوات','Tools')+'</h3><div class="h279">'+[{i:'🔔',t:Lx('الإشعارات','Notifications'),s:(FT.notes||[]).length+Lx(' إشعار',' notification(s)'),b:B(Lx('عرض الكل','View all'),'V51.h.ft281notes()')},{i:'🔎',t:Lx('التحقق من وثيقة','Verify a document'),s:Lx('برقم الوثيقة أو رمز QR','By number or QR code'),b:'<form onsubmit="location.hash=\'#/ft-verify/\'+encodeURIComponent(this.r.value.trim());return false" style="display:flex;gap:6px;width:100%"><input name="r" required placeholder="'+Lx('رقم الوثيقة','Document no.')+'" dir="ltr" style="flex:1;min-width:0"><button class="btn s">'+Lx('تحقق','Verify')+'</button></form>'},{i:'📖',t:Lx('دليل المشرف','Supervisor guide'),s:Lx('مهامك في كل مرحلة','Your tasks at each stage'),b:B(Lx('عرض الدليل','Open guide'),'V51.h.ft282guide()')}].map(cardH).join('')+'</div>';
 return o}
var SGUIDE=[['المشرف الأكاديمي (التدريب)','Academic supervisor (training)','يوصي في طلب الالتحاق، ويعتمد خطة التدريب، ويزور المتدرب ويسجّل الزيارة (ت-7)، ويستلم التقارير، ويقوّم الملف والعرض (ت-11).','Recommends on the application, approves the plan, visits and records the visit (T-7), receives reports and evaluates the file (T-11).'],['المشرف الميداني','Field supervisor','يؤكد المباشرة، ويعتمد أيام الحضور، ويوزع المهام، ويقوّم المتدرب (ت-8). المشرف من خارج المعهد يعمل برابط مخصص محدود المدة.','Confirms the start, approves attendance days, assigns tasks and evaluates the trainee (T-8). Outside supervisors use a time-limited personal link.'],['مشرف المشروع','Project supervisor','يعتمد الخطة، ويسجّل اللقاءات (م-4)، ويراجع التسليمات ويعيدها بملاحظات، ويطلب الإذن بالمناقشة (م-6)، ويرصد درجتي الخطة والمتابعة، ويعتمد النسخة النهائية.','Approves the plan, records meetings (G-4), reviews or returns submissions, requests defence approval (G-6), enters plan & follow-up grades and approves the final version.'],['لجنة المناقشة','Defence committee','يقوّم كل عضو المناقشة (م-8)، وتُحسب المتوسطات آلياً في المحضر (م-9).','Each member evaluates the defence (G-8); averages are computed automatically in the minutes (G-9).']];
H.ft282guide=function(){MD(Lx('دليل المشرف في بوابة الخريجين','Supervisor guide to the Graduates Portal'),'<ul>'+SGUIDE.map(function(g){return '<li><b>'+e9(Lx(g[0],g[1]))+':</b> '+e9(Lx(g[2],g[3]))+'</li>'}).join('')+'</ul>')};
try{var vg4=V.graduates;if(typeof vg4==='function'&&!vg4.__v282){V.graduates=function(){var h=vg4.apply(this,arguments);try{var p=location.hash.replace(/^#\/?/,'').split('/');if(typeof me!=='undefined'&&me&&me.r==='faculty'&&FT.ld&&!p[1]&&typeof h==='string'){var w=who();if((w.roles||[]).length||w.sup||(FT.recs||[]).some(function(r){return rolesOn(r,myRef()).length})){var i=h.indexOf('</nav>');if(i>0)h=h.slice(0,i+6)+hubStaff()}}}catch(e){console.error('v282 hub',e)}return h};V.graduates.__v282=1}}catch(e){}
X.ft282={hubStaff:hubStaff,pendingFor:pendingFor};

X.ft279={tab:tab,stuBox:stuBox,eligList:eligList};
}catch(e){console.error('v279',e)}})();

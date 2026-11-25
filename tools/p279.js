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
X.ft279={tab:tab,stuBox:stuBox,eligList:eligList};
}catch(e){console.error('v279',e)}})();

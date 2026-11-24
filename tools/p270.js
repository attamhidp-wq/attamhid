/* v270 — اعتماد ونشر نتائج الفصل (زر واحد لكل فصل)
   الدرجات تُرصد آلياً بعد كل اختبار، ويعدّلها أستاذ المقرر أو يضيف أو يخصم بسبب، ولا تظهر لأي طالب قبل النشر
   (يمنع الخادم ذلك: الطالب يقرأ سجله عبر students_me ولا تُرسل إليه إلا الدرجات المنشورة).
   بعد اكتمال الرصد: زر واحد من الإدارة المركزية يحتسب المعدل الفصلي وينشر الدرجات لطلاب الفصل وأساتذته؛
   من أُكِّدت رسومه أو أُعفي يُنشر فوراً، ومن لم تُؤكَّد رسومه تُنشر درجاته تلقائياً لحظة تأكيدها. */
(function(){
var W=window,V5=W.V51||{};W.PUB270=1;
var L=function(a,e){try{return V5.L?V5.L(a,e):a}catch(x){return a}};
var e0=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var bt=function(t,on,c,dis){return '<button type="button" class="btn'+(c?' '+c:'')+'" onclick="'+on+'"'+(dis?' disabled':'')+'>'+t+'</button>'};
var central=function(){return typeof me!=='undefined'&&me&&me.r==='admin'&&!me.unit&&!V5.imp64};
var P={term:'',pub:null,pend:null,busy:0,mail:1,ld:0};W.PUB270S=P;
function progOf(id){return (S.programs||[]).find(function(p){return p.id==id})}
function crsOf(s,cid){var P0=progOf(s.prog)||progOf(typeof DIP!=='undefined'?DIP:1000)||{};var c=(P0.courses||[]).find(function(x){return x.id==cid});if(!c){(S.programs||[]).some(function(p){c=(p.courses||[]).find(function(x){return x.id==cid});return !!c})}return c||null}
function termOf(s,cid){try{var P0=progOf(s.prog)||{};var c=(P0.courses||[]).find(function(x){return x.id==cid});if(!c)return null;var t=W.semOf48&&W.semOf48(s,+c.term||1);return t&&t.id?t.id:null}catch(e){return null}}
function tName(id){try{var t=V5.termById61(id);if(t){var n=V5.termNames61(t);return L(n.ar,n.en)}}catch(e){}return id||'—'}
function terms(){var o=[];try{var c=V5.curTerm61&&V5.curTerm61(),all=(V5.allTerms61&&V5.allTerms61())||[];all.forEach(function(t){if(t&&String(t.end||'')>='2026-11-24')o.push(t)});if(c&&o.indexOf(c)<0)o.unshift(c)}catch(e){}return o.slice(0,4)}
function feeOk(s,term){var R=(W.F263&&F263.rows)||null;if(!R)return null;var r=R.find(function(x){return x.kind==='sem'&&x.ref===String(s.id)&&x.term===term});if(r)return r.status==='confirmed'||r.status==='waived'?1:0;var P0=progOf(s.prog)||{};var F0=P0.pay71||{};return +F0.amount>0?0:1}
/* جمع حالة الفصل: لكل طالب مقرراته في الفصل، المرصود والناقص، والرسوم */
function scan(term){var cur=(V5.curTerm61&&V5.curTerm61()||{}).id;var rows=[],courses={},miss=0,ready=0,unpub=0,pubd=0,held=0,feeBad=0,adj=0;
 /* حالة الخادم هي المرجع (الحارس يُبقي غير المنشور غير منشور) */(P.srv&&P.srv.length?P.srv:(S.students||[])).forEach(function(s){if(!s||s.deleted||s.test240)return;var G=s.gr||{},cids=[],mis=[],pubN=0;
  var all={};Object.keys(G).forEach(function(k){all[k]=1});(s.reg||[]).forEach(function(k){all[k]=1});
  Object.keys(all).forEach(function(cid){var t=termOf(s,cid);if(t==null&&term===cur&&G[cid]&&G[cid].fin&&!G[cid].rel)t=term;if(t!==term)return;var g=G[cid],c=crsOf(s,cid)||{id:cid,name:cid};courses[cid]=courses[cid]||{c:c,n:0,fin:0,rel:0,adj:0};courses[cid].n++;
   if(g&&g.fin){courses[cid].fin++;if(g.rel){courses[cid].rel++;pubN++}else cids.push(cid);if(g.bonus||g.ded){courses[cid].adj++;adj++}}else mis.push(cid)});
  if(!cids.length&&!mis.length&&!pubN)return;var fo=feeOk(s,term);rows.push({s:s,cids:cids,mis:mis,pub:pubN,fee:fo});
  miss+=mis.length;unpub+=cids.length;pubd+=pubN;if(cids.length){if(fo===1)ready++;else{held++;}}if(fo===0)feeBad++});
 return {rows:rows,courses:courses,miss:miss,unpub:unpub,pubd:pubd,ready:ready,held:held,feeBad:feeBad,adj:adj}}
async function load(){if(P.busy||typeof sb==='undefined'||!sb)return;P.busy=1;try{var a=await Promise.all([sb.from('pub270').select('*'),sb.from('pub270_pend').select('sid,term,cids'),sb.from('students').select('id,data')]);P.srv=(a[2]&&a[2].data||[]).map(function(x){return x.data}).filter(Boolean);P.pub={};(a[0].data||[]).forEach(function(r){P.pub[r.term]=r});P.pend=a[1].data||[];if(W.fin263load&&!(W.F263&&F263.rows))await W.fin263load()}catch(e){}P.ld=Date.now();P.busy=0;W.__force71=1;try{go()}catch(e){}}
function view(){if(!central())return '<div class="msg er">'+L('نشر نتائج الفصل للإدارة المركزية فقط.','Publishing semester results is for the central administration only.')+'</div>';
 if(!P.ld){load();return '<p class="mu">'+L('جارٍ التحميل…','Loading…')+'</p>'}
 var T=terms();if(!P.term||!T.some(function(t){return t.id===P.term}))P.term=(T[0]||{}).id||'';
 var d=scan(P.term),pb=P.pub&&P.pub[P.term],pend=(P.pend||[]).filter(function(x){return x.term===P.term});
 var h='<section class="pub270"><h2>'+L('اعتماد نتائج الفصل ونشرها','Approve and publish semester results')+'</h2><p class="mu">'+L('تُرصد الدرجات آلياً بعد كل اختبار، ولأستاذ المقرر تعديلها أو إضافة درجة فوقها أو خصم درجات مع ذكر السبب. لا تظهر الدرجات لأي طالب قبل النشر؛ تراها الإدارة المركزية وأساتذة المقررات فقط. وبعد اكتمال الرصد يحتسب زرٌّ واحدٌ المعدلَ الفصلي وينشر الدرجات لجميع طلاب الفصل وأساتذتهم دون العموم.','Grades are recorded automatically after each exam; the course instructor may change them, add marks on top, or deduct marks with a reason. No student sees any grade before publication; only the central administration and the course instructors see them. Once recording is complete, one button calculates the semester GPA and publishes the grades to all the semester’s students and their instructors — not to the public.')+'</p>';
 h+='<div class="fin263bar"><label>'+L('الفصل الدراسي','Semester')+' <select onchange="V51.h.pub270t(this.value)">'+T.map(function(t){return '<option value="'+e0(t.id)+'"'+(t.id===P.term?' selected':'')+'>'+e0(tName(t.id))+'</option>'}).join('')+'</select></label>'+bt(L('تحديث','Refresh'),'V51.h.pub270re()','s')+'</div>';
 var k=function(a,b,v,cl){return '<div class="fin263k'+(cl?' '+cl:'')+'"><small>'+L(a,b)+'</small><b dir="ltr">'+e0(v)+'</b></div>'};
 h+='<div class="fin263g">'+k('درجات مرصودة لم تُنشر','Recorded, not yet published',d.unpub,d.unpub?'wa':'')+k('درجات لم تُرصد بعد','Not yet recorded',d.miss,d.miss?'er':'ok')+k('درجات عُدّلت بإضافة أو خصم','Adjusted by addition or deduction',d.adj)+k('طلاب جاهزون للنشر','Students ready to publish',d.ready,'ok')+k('طلاب رسومهم لم تُؤكَّد','Students with unconfirmed fees',d.held,d.held?'wa':'')+k('درجات منشورة','Published grades',d.pubd)+'</div>';
 var C=Object.keys(d.courses).map(function(id){return d.courses[id]}).sort(function(a,b){return String(a.c.code||a.c.name).localeCompare(String(b.c.code||b.c.name))});
 h+='<h4>'+L('حالة الرصد في مقررات الفصل','Recording status of the semester’s courses')+'</h4>'+(C.length?'<div class="tw"><table class="fin263t"><thead><tr><th>'+L('المقرر','Course')+'</th><th>'+L('الطلاب','Students')+'</th><th>'+L('مرصودة','Recorded')+'</th><th>'+L('معدّلة','Adjusted')+'</th><th>'+L('منشورة','Published')+'</th><th>'+L('الحالة','Status')+'</th></tr></thead><tbody>'+C.map(function(x){var ok=x.fin>=x.n;return '<tr><td data-l="'+e0(L('المقرر','Course'))+'">'+e0((x.c.code?x.c.code+' — ':'')+(x.c.name||''))+'</td><td data-l="'+e0(L('الطلاب','Students'))+'">'+x.n+'</td><td data-l="'+e0(L('مرصودة','Recorded'))+'">'+x.fin+'</td><td data-l="'+e0(L('معدّلة','Adjusted'))+'">'+x.adj+'</td><td data-l="'+e0(L('منشورة','Published'))+'">'+x.rel+'</td><td data-l="'+e0(L('الحالة','Status'))+'">'+(x.rel>=x.n?'<span class="tag ok">'+L('منشور','Published')+'</span>':ok?'<span class="tag ok">'+L('مكتمل الرصد','Fully recorded')+'</span>':'<span class="tag er">'+L('ناقص '+(x.n-x.fin),(x.n-x.fin)+' missing')+'</span>')+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="mu">'+L('لا توجد درجات أو تسجيلات في هذا الفصل بعد.','No grades or registrations in this semester yet.')+'</p>');
 var can=d.unpub>0&&d.miss===0;
 h+='<div class="box pub270b"><h3>'+L('احتساب المعدل الفصلي ونشر الدرجات','Calculate the semester GPA and publish grades')+'</h3>';
 if(pb)h+='<p class="mu">'+L('آخر نشر: ','Last published: ')+'<span dir="ltr">'+e0(String(pb.at).slice(0,16).replace('T',' '))+'</span> — '+e0(pb.by||'')+' · '+L('المنشور: ','Published: ')+pb.n_pub+(pend.length?' · '+L('معلّق حتى تأكيد الرسوم: ','Held until fees are confirmed: ')+pend.length:'')+'</p>';
 h+='<ul class="pub270c"><li>'+(d.miss===0?'✔ ':'✖ ')+L('اكتمل رصد جميع الدرجات (الآلية واليدوية)','All grades (automatic and manual) are recorded')+(d.miss?' — '+L('ناقص ','missing ')+d.miss:'')+'</li><li>'+(d.held===0?'✔ ':'⚠ ')+L('تأكيد دفع الرسوم المقررة أو تطبيق المنح','Fees confirmed or scholarships applied')+(d.held?' — '+L(d.held+' طالب لم تُؤكَّد رسومه: تُحجب درجاته وتُنشر تلقائياً لحظة التأكيد',d.held+' students without confirmed fees: their grades stay hidden and are published automatically once confirmed'):'')+'</li></ul>';
 h+='<label class="v51ck"><input type="checkbox" id="pub270mail"'+(P.mail?' checked':'')+' onchange="V51.PUB270S.mail=this.checked?1:0"> '+L('إشعار الطلاب بالبريد بنشر النتائج','Email students that results are published')+'</label>';
 h+='<p>'+bt(pb?L('نشر الدرجات الجديدة في هذا الفصل','Publish the new grades of this semester'):L('احتساب المعدل الفصلي ونشر الدرجات','Calculate the semester GPA and publish'),'V51.h.pub270go()','',!can)+'</p>';
 if(!can)h+='<p class="mu">'+(d.unpub===0?L('لا توجد درجات جديدة للنشر في هذا الفصل.','There are no new grades to publish in this semester.'):L('يتاح الزر بعد اكتمال رصد جميع الدرجات.','The button becomes available once all grades are recorded.'))+'</p>';
 return h+'</div></section>'}
/* v272: ملخص نتيجة الطالب في الفصل لرسالة البريد الواحدة (المقررات والدرجات والمعدل الفصلي والتراكمي) */
var GR0=function(g){return g>=4.5?['ممتاز','Excellent']:g>=3.75?['جيد جداً','Very good']:g>=2.75?['جيد','Good']:g>=2?['مقبول','Acceptable']:['راسب','Fail']};
var glEn0={'أ+':'A+','أ':'A','ب+':'B+','ب':'B','ج+':'C+','ج':'C','د+':'D+','د':'D','هـ':'F','ممتاز':'Excellent','جيد جداً':'Very good','جيد جدا':'Very good','جيد':'Good','مقبول':'Acceptable','راسب':'Fail'};
function sum272(s,term,cids){try{var c2=JSON.parse(JSON.stringify(s));var G=c2.gr||{};(cids||[]).forEach(function(c){if(G[c])G[c].rel=1});
 var rows=[],H=0,Q=0;Object.keys(G).forEach(function(cid){var g=G[cid];if(!g||!g.fin||!g.rel)return;var t=termOf(s,cid);if(t==null&&(cids||[]).indexOf(cid)>=0)t=term;if(t!==term)return;var c=crsOf(s,cid)||{};var h=+c.hrs||0;var pt=W.ptsOf37?W.ptsOf37(g):+g.pts||0;H+=h;Q+=pt*h;
  rows.push({id:cid,code:c.code||'',name:c.name||cid,nameEn:c.nameEn||c.name||cid,hrs:h||'',score:g.score!=null?Math.round(+g.score*100)/100:'',gl:g.gl||'',glEn:glEn0[g.gl]||g.gl||''})});
 rows.sort(function(a,b){return String(a.code).localeCompare(String(b.code))});
 var hs=W.hold263;W.hold263=function(){return false};var k=null;try{k=W.gpa5?W.gpa5(c2,0,1):null}catch(e){}W.hold263=hs;
 var o={rows:rows,tg:H?(Q/H).toFixed(2):'',th:H||''};if(k&&k.gpa!=null&&isFinite(+k.gpa)){o.cg=(+k.gpa).toFixed(2);o.ch=k.E||k.H||'';var r=GR0(+k.gpa);o.cgl=r[0];o.cglEn=r[1]}return o}catch(e){return {rows:[]}}}
W.sum272=sum272;
var H=V5.h||{};
H.pub270t=function(t){P.term=t;W.__force71=1;go()};
H.pub270re=function(){P.ld=0;if(W.F263)F263.rows=null;load()};
H.pub270go=async function(){var d=scan(P.term);if(d.miss>0||d.unpub===0)return;
 if(!confirm(L('نشر نتائج ','Publish the results of ')+tName(P.term)+L('؟ تُنشر '+d.unpub+' درجة لطلاب الفصل ('+d.ready+' طالباً فوراً'+(d.held?' و'+d.held+' عند تأكيد رسومهم':'')+')، ويُحتسب معدلهم الفصلي والتراكمي.','? '+d.unpub+' grades will be published ('+d.ready+' students now'+(d.held?', '+d.held+' once their fees are confirmed':'')+') and their semester and cumulative GPA calculated.')))return;
 var items=d.rows.filter(function(r){return r.cids.length}).map(function(r){var tt=null;try{tt=V5.termNames61(V5.termById61(P.term))}catch(e){}return {sid:String(r.s.id),cids:r.cids,ok:r.fee===1,termName:tt&&tt.ar||tName(P.term),termNameEn:tt&&tt.en||'',sum:sum272(r.s,P.term,r.cids)}});
 var res=null;try{res=await sb.rpc('pub_term',{p_term:P.term,items:items,p_mail:!!P.mail})}catch(e){res={error:e}}var x=res&&res.data;
 if(x&&x.ok){toast(L('نُشرت ','Published ')+x.grades+L(' درجة لـ ',' grades for ')+x.students+L(' طالباً',' students')+(x.held?L(' · معلّق حتى تأكيد الرسوم: ',' · held until fees are confirmed: ')+x.held:''));
  /* تحديث النسخة المحلية دون انتظار */try{items.forEach(function(it){if(!it.ok)return;var s=(S.students||[]).find(function(y){return String(y.id)===it.sid});if(!s)return;it.cids.forEach(function(c){var g=s.gr&&s.gr[c];if(g){g.rel=1;g.pub270=1;g.relDate=new Date().toISOString().slice(0,10)}})});save0&&save0()}catch(e){}
  P.ld=0;load()}else toast(L('تعذّر النشر: ','Could not publish: ')+String((x&&x.error)||(res&&res.error&&res.error.message)||''))};
try{var C=V5.core;if(C&&C.V51TABS&&!C.V51TABS.some(function(x){return x[0]==='v270r'})){C.V51TABS.push(['v270r','نشر نتائج الفصل','Publish Semester Results',function(){return view()}]);C.TABLBL['نشر نتائج الفصل']='v270r';C.TABLBL['Publish Semester Results']='v270r';C.SVC_ADMIN.push(['v270r','نشر نتائج الفصل','Publish Semester Results'])}}catch(e){}
try{var _can=V5.can;if(_can&&!_can.__p270){V5.can=function(s){if(s==='v270r')return central();return _can.apply(this,arguments)};V5.can.__p270=1;V5.can.__f263=_can.__f263;try{V5.core.can=V5.can}catch(e){}}}catch(e){}
})();

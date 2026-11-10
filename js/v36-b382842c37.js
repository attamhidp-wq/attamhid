
/* v36: نتائج فورية · تعديل إداري يعيد الاحتساب · ربط التقويم · محرك المزامنة الرباعي */
(()=>{try{
const SEMN={1:'الفصل الدراسي الأول',2:'الفصل الدراسي الثاني'};
const HF=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{year:'numeric',timeZone:'UTC'});
const hyOf=iso=>{try{const p=HF.formatToParts(new Date(iso+'T12:00:00Z')).find(x=>x.type=='year');const n=p&&parseInt(p.value);return n>1300?n:null}catch(e){return null}};
const AC=()=>{const D=P(DIP);return D&&D.acal&&D.acal.years&&Object.keys(D.acal.years).length?D.acal:null};
const ids=a=>Object.keys(a.years).sort();
const evf=(y,s,k)=>((y.events||[]).find(e=>e.sem==s&&e.kind==k&&e.from)||{}).from||'';
const bump=(s,n)=>String(s||'').replace(/\b(14\d\d|20\d\d)\b/g,m=>+m+n);
const f2=x=>x==null?'—':(+x).toFixed(2);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ===== (3) التقويم الأكاديمي ← مسميات الفصول والأعوام ===== */
function termInfo(l){const a=AC();if(!a)return null;const I=ids(a),i=I.indexOf(a.active),y0=a.years[a.active]||a.years[I[0]];
 const nx=l<3?0:1,y=l<3?y0:(a.years[I[i+1]]||null),sem=l%2?1:2,src=y||y0;if(!src)return null;
 const st=evf(src,sem,'start');if(!st)return null;const add=y?0:nx;
 const gy=+st.slice(0,4)+add,hy=(hyOf(st)||parseInt(String(src.hy).match(/\d{4}/)||[0])||0)+add;if(!hy)return null;
 return{sem,gy,hy,name:`${SEMN[sem]} ${hy}هـ / ${gy}م`,year:y?`${y.hy} (${y.gy})`:`${bump(y0.hy,add)} (${bump(y0.gy,add)})`,from:y?st:'',to:y?(sem==1?evf(y,1,'vac'):evf(y,2,'end')):''}}
function curLevel(){const a=AC();if(!a)return 1;const I=ids(a),y=a.years[a.active],t=new Date().toISOString().slice(0,10),
 e=(y&&evf(y,2,'end'))||'',n=a.years[I[I.indexOf(a.active)+1]];
 if(e&&t>e&&n)return 3;const s2=y&&evf(y,2,'start');return s2&&t>=s2?2:1}
window.termInfo36=termInfo;window.curTerm=()=>{const t=termInfo(curLevel());return t?t.name:''};
function syncCal(){const D=P(DIP);if(!D||!AC())return false;let ch=false;D.cal=D.cal||{};D.rcfg=D.rcfg||{};D.rcfg.sem=D.rcfg.sem||{};
 [1,2,3,4].forEach(l=>{const t=termInfo(l);if(!t)return;const c=D.cal[l]||(D.cal[l]={}),nv={name:t.name,year:t.year};
  if(t.from&&t.to){nv.from=t.from;nv.to=t.to;if(typeof calWk=='function')nv.weeks=Math.max(16,calWk(t.from,t.to)||16)}
  Object.keys(nv).forEach(k=>{if(c[k]!==nv[k]){c[k]=nv[k];ch=true}});
  if(D.rcfg.sem[l]!==t.name){D.rcfg.sem[l]=t.name;ch=true}});return ch}
/* ===== (1) تصحيح فوري + نشر فوري ===== */
const GS=()=>window.GSC5||[];
const gpaGrade=g=>{const r=GS().find(x=>g>=+x[2]-1e-9);return r?r[1]:''};
function finalizeSubs(){let n=0;(S.subs||[]).forEach(b=>{const e=exFind(b.eid);if(!e)return;
 if(b.st=='في انتظار اعتماد الإدارة'||b.st=='تم الاعتماد والنشر'){if(e.courseId&&b.st=='في انتظار اعتماد الإدارة'){b.st='مُقيَّم آلياً';n++}return}
 if(b.st!='بانتظار التقييم'||!e.courseId)return;
 b.wr=b.wr||{};e.q.forEach((q,i)=>{if(q.ty=='wr')b.wr[i]=String((b.ans||{})[i]||'').trim().length>=25?1:0});
 if(b.auto==null){let sc=0;e.q.forEach((q,i)=>{if(q.ty!='wr'&&(b.ans||{})[i]===q.c)sc++});b.auto=sc}
 b.total=+(b.auto+Object.values(b.wr).reduce((a,x)=>a+x,0)).toFixed(2);b.st='مُقيَّم آلياً';
 try{window.autoGrade5(b,true)}catch(x){console.error(x)}n++});return n+reconcileSubs()}
/* v41: مطابقة كل تسليم مع الدرجة المرصودة — تعالج التسليمات المقيَّمة شكلياً دون أثر في السجل (مثل المستوى الثالث) */
function reconcileSubs(){let n=0;const last={},OK=['مُقيَّم آلياً','مُقيَّم','تم الاعتماد والنشر','في انتظار اعتماد الإدارة','بانتظار التقييم'];
 (S.subs||[]).forEach(b=>{const e=exFind(b.eid);if(!e||!e.courseId||e.pl||e.placement||!OK.includes(b.st))return;last[b.sid+'|'+e.courseId]=b});
 Object.values(last).forEach(b=>{const e=exFind(b.eid),s=(S.students||[]).find(x=>x.id==b.sid);if(!e||!s||!(e.q||[]).length)return;
  const g=(s.gr||{})[e.courseId];if(g&&(g.man||g.fin))return;
  b.wr=b.wr||{};e.q.forEach((q,i)=>{if(q.ty=='wr'&&b.wr[i]==null)b.wr[i]=String((b.ans||{})[i]||'').trim().length>=25?1:0});
  if(b.auto==null||isNaN(+b.auto)){let sc=0;e.q.forEach((q,i)=>{if(q.ty!='wr'&&(b.ans||{})[i]===q.c)sc++});b.auto=sc}
  if(b.total==null||isNaN(+b.total))b.total=+(numOr0(b.auto)+Object.values(b.wr).reduce((a,x)=>a+x,0)).toFixed(2);
  if(b.st=='بانتظار التقييم'||b.st=='في انتظار اعتماد الإدارة')b.st='مُقيَّم آلياً';
  try{window.autoGrade5(b,true)}catch(x){console.error(x)}
  const g2=(s.gr||{})[e.courseId];if(g2&&g2.fin){if(!g2.man&&!g2.rel){g2.rel=1;g2.relDate=today()}n++}});return n}
function releaseAll(){let n=0;const d=new Date().toISOString().slice(0,10);(S.students||[]).forEach(s=>Object.values(s.gr||{}).forEach(g=>{
 if(g&&g.fin&&!g.rel){g.rel=1;g.relDate=d;n++}
 if(g&&g.fin&&g.score!=null&&!g.man){const x=GS().find(r=>g.score>=r[0]);if(x&&(g.gl!==x[1]||g.pts!==x[2])){g.gl=x[1];g.pts=x[2];n++}}}));return n}
/* ملخص أكاديمي حيّ للطالب */
function sumOf(s,vis){const rows=[1,2,3,4].map(l=>{let n=0,tot=0,H=0,W=0;crs().filter(c=>c.term==l&&window.tmCount(s,c)).forEach(c=>{const g=(s.gr||{})[c.id];
  if(g&&g.fin&&(g.score!=null||g.gl)&&(!vis||g.rel)){const sc=scoreOf37(g);n++;tot+=sc;const h=+c.hrs||0;H+=h;W+=sc*h}});
  const k=calc(s,l,vis),t=(window.semOf48?semOf48(s,l):termInfo(l));return{l,name:t?t.name:'الفصل '+l,n,tot,pct:H?W/H:null,gpa:k.gpa,H}});
 const all=rows.reduce((a,r)=>({n:a.n+r.n,tot:a.tot+r.tot,H:a.H+r.H,W:a.W+(r.pct==null?0:r.pct*r.H)}),{n:0,tot:0,H:0,W:0});
 return{rows,n:all.n,tot:all.tot,pct:all.H?all.W/all.H:null,cum:calc(s,0,vis).gpa}}
window.sumOf36=sumOf;
/* ===== (4) المحرك الرباعي: مقرر ◄ بنك/اختبار ◄ تقويم ◄ سجل ووثائق ===== */
/* رمز المقرر المعياري = المعرّف الرئيسي (يُهمل الاسم واللواحق مثل -1 والمسافات والأرقام الهندية) */
const NMd=k=>String(k==null?'':k).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const ck=x=>{const m=NMd(x).match(/\d{3,}/);return m?m[0]:''};
const ckT=x=>{const m=NMd(x).match(/\((\d{3,})(?:\s*-\s*\d+)?\)/);return m?m[1]:''};
const codeOfCourse=c=>ck(c&&(c.code||c.id));
const isPl=e=>/تحديد المستوى|placement/i.test((e.title||'')+' '+(e.subj||''))||e.pl||e.placement;
function canon(){const by={},dup=[];crs().filter(c=>!c.legacy).forEach(c=>{const k=codeOfCourse(c);if(!k)return;if(by[k])dup.push(k);else by[k]=c});return{by,dup}}
function bind(){let fx=0;const {by}=canon(),byId={},ALL=(window.V51&&V51.allCourses65)?V51.allCourses65():crs(),PL=c=>(c&&c.plan)||'2023',byP={};ALL.forEach(c=>byId[c.id]=c);
 const canonP=p=>byP[p]||(byP[p]=(()=>{const o={};ALL.filter(c=>!c.legacy&&!c.deleted&&PL(c)===p).forEach(c=>{const k=codeOfCourse(c);if(k&&!o[k])o[k]=c});return o})());
 /* اختبار ◄ مقرر (بالرمز فقط) */
 (S.exams||[]).forEach(e=>{if(isPl(e)&&!e.courseId)return;if(e.bank65&&e.bank65.p73)return;const own=byId[e.courseId],k=ck(e.code)||(own?codeOfCourse(own):'')||ck(e.courseId)||ckT(e.title);
  const c=k&&(own?canonP(PL(own)):by)[k];if(!c)return;if(e.courseId!==c.id){e.courseId=c.id;fx++}if(e.code!==k){e.code=k;fx++}
  if(!(e.q||[]).length&&window.QBANK36&&QBANK36[k]&&!(S.subs||[]).some(x=>x.eid==e.id)){const B=QBANK36[k];e.q=[...B.mc,...B.tf].map(q=>({...q}));e.pub=true;e.min=e.min&&e.min<=90?e.min:30;fx++}});
 /* سجل ◄ مقرر: ترحيل الدرجات والتسجيلات إلى المقرر المعياري بالرمز */
 (S.students||[]).forEach(s=>{const bS=canonP((window.V51&&V51.planOf65)?V51.planOf65(s):'2023'),mv=id=>{if(/^P73-/.test(String(id)))return null;const c0=byId[id];if(c0&&PL(c0)!==((window.V51&&V51.planOf65)?V51.planOf65(s):PL(c0)))return null;const k=c0?codeOfCourse(c0):ck(id),c=k&&bS[k];return c&&c.id!==id?c.id:null};
  s.reg=s.reg||[];const nr=[];let chg=0;s.reg.forEach(id=>{const to=mv(id)||id;if(to!==id)chg++;if(!nr.includes(to))nr.push(to)});if(chg){s.reg=nr;fx++}
  Object.keys(s.gr||{}).forEach(id=>{const to=mv(id);if(!to)return;const a=s.gr[id],b=s.gr[to];if(!b||(a.man&&!b.man)||(!!a.man==!!b.man&&String(a.date||'')>String(b.date||'')))s.gr[to]=a;delete s.gr[id];fx++;if(!s.reg.includes(to))s.reg.push(to)})});
 return fx}
function rows(){const C=((window.V51&&V51.allCourses65)?V51.allCourses65():crs()).filter(c=>!c.legacy&&!c.deleted);return C.map(c=>{const k=codeOfCourse(c),E=(S.exams||[]).filter(e=>e.courseId==c.id),q=E.reduce((a,e)=>a+(e.q||[]).length,0),t=(window.V51&&V51.lvlTerm65)?V51.lvlTerm65(c):termInfo(c.term||1),g=(S.students||[]).filter(s=>(s.gr||{})[c.id]).length;
  return{k,c,ex:E.length,q,t,g,ok:!!k&&E.length>0&&q>0&&!!t}})}
function check(fix){const I=[];let fx=0;if(fix){fx+=bind();fx+=syncCal()?1:0;fx+=finalizeSubs();fx+=releaseAll();fx+=syncCerts()}
 const {by,dup}=canon(),R=rows();
 dup.forEach(k=>I.push(['مقرر ◄ اختبار','رمز المقرر '+k+' مكرر في الخطة']));
 R.forEach(r=>{if(!r.k)I.push(['مقرر ◄ اختبار','مقرر «'+r.c.name+'» بلا رمز رقمي معياري']);else{
  if(!r.ex)I.push(['مقرر ◄ اختبار','المقرر '+r.k+' بلا اختبار مرتبط برمزه']);else if(!r.q)I.push(['اختبار ◄ مقرر','بنك أسئلة المقرر '+r.k+' فارغ']);
  if(!r.t)I.push(['تقويم','المقرر '+r.k+': لا يوجد تاريخ بداية دراسة في التقويم لمستواه'])}});
 /* v112: مقررات كل البرامج (لا الدبلوم وحده) — اختبارات البرامج الأخرى مرتبطة بمقرراتها لا «غير مرتبطة» */
 const allC=((window.V51&&V51.allCourses65)?V51.allCourses65():crs()).concat(((window.V51&&V51.engProgs)?V51.engProgs(1):[]).filter(p=>p.id!=1000).reduce((a,p)=>a.concat(p.coursesAll||p.courses||[]),[]));
 const ids=new Set(allC.map(c=>c.id));
 (S.exams||[]).forEach(e=>{if(isPl(e)&&!e.courseId)return;if(e.retired65)return;const oc=allC.find(c=>c.id==e.courseId);if(!e.courseId||!ids.has(e.courseId)||!oc||ck(oc.code)!==(ck(e.code)||ck(oc.code)))I.push(['اختبار ◄ مقرر','اختبار غير مرتبط برمز مقرر معياري ('+(e.code||ck(e.title)||e.id)+')'])});
 (S.students||[]).forEach(s=>Object.keys(s.gr||{}).forEach(k=>{if(!ids.has(k))I.push(['سجل ◄ مقرر','درجة طالب '+s.id+' بمعرّف مقرر غير موجود ('+k+')'])}));
 return{issues:I,fixed:fx}}
function syncCerts(){let n=0;(S.certs||[]).forEach(c=>{if(!c||c.revoked||c.type!=='dgrad'||!c.sid||!window.gradData)return;const s=S.students.find(x=>x.id==c.sid);if(!s)return;
 try{const d=window.gradData(s);['gpa','gterm','gyear'].forEach(k=>{if(d[k]!=null&&c[k]!==d[k]){c[k]=d[k];n++}})}catch(e){}});return n}
const lastSig={v:null};
const sig=()=>{try{return JSON.stringify([(S.students||[]).map(s=>[s.id,s.lvl,s.reg,Object.entries(s.gr||{}).map(([k,g])=>[k,g.score,g.pts,g.rel,g.fin,g.man])]),(S.subs||[]).map(b=>[b.id,b.st,b.total]),(P(DIP)||{}).acal,crs().map(c=>[c.id,c.hrs,c.term])])}catch(e){return ''}};
let busy=0,lastRec=null;
function typing(){const a=document.activeElement;return a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)&&a.form}
function tick(force){if(busy)return;busy=1;try{if(!(typeof S!=='undefined'&&S&&S.students))return;
 const r=check(true);if(r.fixed)save();
 const s=sig();if(force||(lastSig.v!==null&&s!==lastSig.v)){
  const m=document.getElementById('mod');if(m&&m.style.display==='block'&&lastRec&&typeof curN==='string'&&curN==='record-'+lastRec&&typeof window.seeRec=='function'&&(S.students||[]).some(x=>x.id==lastRec)){try{window.seeRec(lastRec)}catch(e){}}
  else if(!typing()&&!(typeof taking!=='undefined'&&taking)&&typeof go=='function'&&(r.fixed||force||lastSig.v!==null)){window.softGo37?softGo37():go()}}
 lastSig.v=s}finally{busy=0}}
window.CK36=ck;window.QL36={check,rows,bind,run:()=>{tick(true);return check(false)}};
/* ===== التفاف دوال التسليم والتعديل ===== */
const wrap=(n,after)=>{try{const f=window[n]||(typeof eval(n)==='function'?eval(n):null);if(typeof f!=='function')return;
 const w=function(){const r=f.apply(this,arguments);const done=()=>{try{after&&after.apply(this,arguments)}catch(e){console.error(e)}};
  if(r&&typeof r.then=='function')return r.then(v=>{done();return v});done();return r};window[n]=w;try{eval(n+'=w')}catch(e){}}catch(e){}};
const afterSubmit=()=>{const n=S.subs.length;finalizeSubs();releaseAll();save();
 try{const b=S.subs.filter(x=>me&&x.sid==me.id).slice(-1)[0],e=b&&exFind(b.eid),st=e&&S.students.find(x=>x.id==me.id),g=st&&st.gr&&st.gr[e.courseId];
  if(g&&g.fin)toast('نتيجتك: '+g.score+'٪ — '+g.gl+' — '+(g.ok?'ناجح':'غير مجتاز')+' · وقد ظهرت فوراً في بوابتك وسجلك الأكاديمي')}catch(e){}tick(true)};
wrap('exSub',afterSubmit);const _gs0=window.grSave;window.grSave=function(f){const s=S.students.find(x=>x.id==(cf&&cf.id)),had=s?Object.keys(s.gr||{}).filter(k=>s.gr[k].man):[];const r=_gs0.apply(this,arguments);try{if(s)had.forEach(k=>{if(!(s.gr||{})[k]){const e=(S.exams||[]).filter(x=>x.courseId==k).map(x=>[x,(S.subs||[]).filter(b=>b.eid==x.id&&b.sid==s.id).slice(-1)[0]]).filter(x=>x[1])[0];if(e&&window.autoGrade5)window.autoGrade5(e[1],true)}})}catch(x){console.error(x)}tick(true);return r};wrap('tExGrade',()=>tick(true));wrap('exGrade',()=>tick(true));wrap('autoEval',()=>tick(true));
if(typeof window.admRel=='function')window.admRel=()=>tick(true);
window.admRelAll=()=>tick(true);window.relExam=()=>{tick(true);toast('النتائج تُنشر آلياً لحظة التسليم؛ أُعيد احتساب المعدلات الآن')};
window.relStu=id=>{tick(true);toast('أُعيد احتساب المعدل الفصلي والتراكمي والنسب والتقديرات')};
window.recalcAll=()=>{tick(true);toast('أُعيدت مزامنة المقررات والاختبارات والتقويم والسجلات')};
window.apvAdmin=()=>`<p class="mu">لا توجد خطوة اعتماد: تُصحَّح الاختبارات وتُرصد النتائج وتظهر للطالب لحظة التسليم، وتُحتسب المعدلات تلقائياً. للإدارة تعديل أي درجة يدوياً من «إدارة الدرجات»، فيُعاد احتساب المعدلين الفصلي والتراكمي والتقديرات فوراً.</p>`+panel();
/* السجل: تذكّر الطالب المفتوح + ملخص المجموع والنسبة */
const _sr=window.seeRec;window.seeRec=function(id){lastRec=id;const r=_sr.apply(this,arguments);try{addSum(id)}catch(e){}return r};
function addSum(id){const s=S.students.find(x=>x.id==id);if(!s)return;const V=me&&me.r=='student',m=sumOf(s,V),mb=document.getElementById('mb'),host=(mb&&mb.parentElement)||document.getElementById('mod');if(!host)return;
 const old=document.getElementById('v36sum');if(old)old.remove();const d=document.createElement('div');d.id='v36sum';d.className='box';
 d.innerHTML=`<h3>الملخص الأكاديمي الفوري</h3><table><tr><th>الفصل</th><th>المقررات المرصودة</th><th>مجموع الدرجات</th><th>النسبة المئوية</th><th>المعدل الفصلي / 5.00</th></tr>${m.rows.filter(r=>r.n).map(r=>`<tr><td>${esc(r.name)}</td><td>${r.n}</td><td>${r.tot}</td><td>${r.pct==null?'—':r.pct.toFixed(1)+'٪'}</td><td>${f2(r.gpa)}</td></tr>`).join('')||'<tr><td colspan="5">لا درجات مرصودة بعد</td></tr>'}<tr><th>الإجمالي</th><th>${m.n}</th><th>${m.tot}</th><th>${m.pct==null?'—':m.pct.toFixed(1)+'٪'}</th><th>التراكمي ${f2(m.cum)}${m.cum!=null?' — '+esc(gpaGrade(m.cum)):''}</th></tr></table>`;
 mb?host.insertBefore(d,mb):host.appendChild(d)}
/* ===== الوثائق: ربط الفصل والعام والمعدل بالتقويم وبالسجل الحي ===== */
const _ch=certHTML;certHTML=function(c){try{if(c&&c.type!=='blank'){syncCal();const c2=Object.assign({},c),cl=curLevel(),t=termInfo(cl);
  if(t){if(c.type=='acc'){c2.adm_term=t.name+' — العام الدراسي '+t.year;if(t.from)c2.from=t.from}
   else if(c.type!=='dgrad'&&(c.term||c.type=='rec'))c2.term=t.name+' — '+t.year}
  const s=c.sid&&(S.students||[]).find(x=>x.id==c.sid);
  if(s&&/^(dgrad|grad|rec)$/.test(c.type)){const k=calc(s,0,1);if(k.gpa!=null){c2.gpa=f2(k.gpa);if(c.type!=='acc')c2.grade=gpaGrade(k.gpa)||c.grade}
   if(c.type=='dgrad'&&window.gradData){const d=window.gradData(s);c2.gterm=d.gterm;c2.gyear=d.gyear}}
  return _ch.call(this,c2)}}catch(e){console.error(e)}return _ch.apply(this,arguments)};
window.addEventListener('beforeprint',()=>{try{check(true);save()}catch(e){}});
/* ===== لوحة المزامنة الرباعية في تبويب الاختبارات ===== */
function panel(){const r=check(false),by={},R=rows(),ok=R.filter(x=>x.ok).length;r.issues.forEach(i=>by[i[0]]=(by[i[0]]||0)+1);const ks=['مقرر ◄ اختبار','اختبار ◄ مقرر','تقويم','سجل ◄ مقرر'];
 return `<div class="box"><h3>المزامنة الرباعية بالرمز المعياري للمقرر: المقرر ◄ الاختبار ◄ التقويم ◄ السجل والوثائق</h3><p><span class="tag ${ok==R.length&&R.length?'ok':'er'}">مقررات مرتبطة بالكامل: ${ok} / ${R.length}</span> ${ks.map(k=>`<span class="tag ${by[k]?'er':'ok'}">${k}: ${by[k]||0}</span>`).join(' ')} <button class="btn s" onclick="recalcAll()">فحص وإعادة مزامنة الآن</button></p>${r.issues.length?`<ul>${r.issues.slice(0,30).map(i=>`<li>${esc(i[1])}</li>`).join('')}</ul>`:'<p class="mu">كل المقررات مرتبطة ببنوكها وتقويمها وسجلاتها بالرمز الموحد، ولا اختبار غير مرتبط.</p>'}<details><summary>جدول الربط بحسب الرمز</summary><div class="tw"><table><tr><th>الرمز</th><th>المقرر</th><th>الاختبارات</th><th>الأسئلة</th><th>الفصل في التقويم</th><th>درجات السجل</th></tr>${R.map(x=>`<tr><td>${esc(x.k)}</td><td>${esc(x.c.name)}</td><td>${x.ex}</td><td>${x.q}</td><td>${x.t?esc(x.t.name):'—'}</td><td>${x.g}</td></tr>`).join('')}</table></div></details></div>`}
if(typeof exAdmin=='function'){const _ea=exAdmin;exAdmin=function(){return _ea.apply(this,arguments)+panel()}}
tick(false);setInterval(()=>{if(document.hidden||(window.userBusy37&&userBusy37()))return;tick(false)},3000);
}catch(e){console.error('v36',e)}})();


/* ===== v48: التقويمات التاريخية · التسجيل والرصد اليدوي · الدفعة الأولى · تنسيق السجل ===== */
(function(){try{
/* ترجمة واجهات v48 (إنجليزي) */
try{Object.assign(EN,{
'تسجيل طالب جديد يدوياً':'Register New Student Manually','+ تسجيل طالب جديد يدوياً':'+ Register New Student Manually','تسجيل الطالب':'Register Student',
'📚 تسجيل مقررات المستويات يدوياً':'📚 Register Level Courses Manually','تسجيل مقررات المستويات يدوياً':'Register Level Courses Manually','✍ رصد الدرجات يدوياً':'✍ Enter Grades Manually',
'الاسم بالإنجليزي (كما في الجواز)':'Name in English (as in passport)','تاريخ الميلاد':'Date of Birth','مكان الميلاد':'Place of Birth','جواز سفر':'Passport','هوية وطنية':'National ID','إقامة':'Residence Permit',
'الفصل الذي قُبل فيه رسمياً':'Term of official admission','تلقائي (الفصل المعلن حالياً)':'Automatic (currently announced term)','حالة القيد':'Enrollment Status','الملخص الأكاديمي الفوري':'Instant Academic Summary','المقررات المرصودة':'Recorded Courses','النسبة المئوية':'Percentage','المعدل الفصلي / 5.00':'Term GPA / 5.00','لا درجات مرصودة بعد':'No grades recorded yet','الإجمالي':'Total','مجموع الدرجات':'Total Marks','بدون':'None','1446 / 1447 هـ — معتمد':'1446 / 1447 AH — Approved','1447 / 1448 هـ — معتمد':'1447 / 1448 AH — Approved','1448 / 1449 هـ — معتمد':'1448 / 1449 AH — Approved',
'تسجيل إداري مباشر دون طلب إلكتروني، ويمكن اختيار مستوى كامل أو مقررات منفردة. الرصد اليدوي لا يخضع للاختبار الآلي، والمعدلات تُحتسب فوراً.':'Direct administrative registration without an electronic request; choose a full level or individual courses. Manual grading is not subject to the automated exam, and GPAs are calculated immediately.',
'المستوى الأول كاملاً':'Level One (full)','المستوى الثاني كاملاً':'Level Two (full)','المستوى الثالث كاملاً':'Level Three (full)','المستوى الرابع كاملاً':'Level Four (full)',
'رصد درجة نهائية موحَّدة للمقررات المحدَّدة (0–100) — اختياري':'Uniform final grade for the selected courses (0–100) — optional','اتركه فارغاً للتسجيل فقط':'Leave empty to register only','حفظ التسجيل':'Save Registration',
'إصدار وثائق التخرج للدفعة':'Issue Graduation Certificates for the Batch','يُصدر الوثائق للطلاب المؤهَّلين المحدَّدين دفعة واحدة بنفس رقم القرار والجلسة. لا تُنشأ أرقام القرارات تلقائياً.':'Issues certificates for the selected eligible students in one batch with the same decision and session numbers. Decision numbers are never generated automatically.',
'اعتماد وإصدار وثائق التخرج للمحدَّدين':'Approve & Issue Graduation Certificates for Selected'
})}catch(e){}
const SEMN={1:'الفصل الدراسي الأول',2:'الفصل الدراسي الثاني'};
const HF=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn',{day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'});
const hs=iso=>HF.formatToParts(new Date(iso+'T12:00:00Z')).reduce((a,x)=>(a[x.type]=x.value,a),{});
const hTxt=(a,b)=>{const x=hs(a);if(!b||b==a)return `${x.day} ${x.month} ${x.year} هـ`;const y=hs(b);if(x.year==y.year)return x.month==y.month?`${x.day} - ${y.day} ${x.month} ${x.year} هـ`:`${x.day} ${x.month} - ${y.day} ${y.month} ${x.year} هـ`;return `${x.day} ${x.month} ${x.year} - ${y.day} ${y.month} ${y.year} هـ`};
const addDays=(iso,n)=>new Date(Date.parse(iso+'T12:00:00Z')+n*864e5).toISOString().slice(0,10);
const dow=iso=>new Date(iso+'T12:00:00').getDay();
const mvBack=iso=>{const p=hs(iso),t=addDays(iso,-354);for(let k=-4;k<=4;k++){const c=addDays(t,k),q=hs(c);if(+q.year==+p.year-1&&q.month==p.month&&q.day==p.day)return c}return t};
const nudge=iso=>{const d=dow(iso);return d==5?addDays(iso,2):d==6?addDays(iso,1):iso};
const bumpTxt=(s,n)=>String(s||'').replace(/\b(14\d\d|20\d\d)\b/g,m=>+m+n);
const rid=()=>'e'+Math.random().toString(36).slice(2,8);
const dip=()=>P(DIP);
const years=()=>{const A=dip().acal;return A&&A.years?A.years:null};
const yids=()=>Object.keys(years()||{}).sort();

/* ---------- 1) التقويمات التاريخية: 2024 و2025 (فصلان لكل عام) ---------- */
function shifted(src,n){ /* n = عدد السنوات الهجرية للخلف */
 const ev=src.events.map(e=>{const o={...e,id:rid()};
  if(e.from){let f=e.from,t=e.to||'';for(let i=0;i<n;i++){f=mvBack(f);if(t)t=mvBack(t)}
   if(['start','exam','end'].includes(e.kind))f=nudge(f);
   o.from=f;o.to=t;o.h=hTxt(f,t);o.g='';
   if(/^نهاية الدوام/.test(e.note||''))o.note=`نهاية الدوام ${hTxt(f)}، والعودة ${hTxt(t||f)}`}
  else{o.h=bumpTxt(e.h,-n);o.g=bumpTxt(e.g,-n);o.note=bumpTxt(e.note,-n)}
  return o});
 const hy=bumpTxt(src.hy,-n),gy=bumpTxt(src.gy,-n);
 return{id:hy.replace(/\s*هـ\s*$/,'').split('/').map(x=>x.trim()).join('-'),hy,gy,status:'معتمد',gen:false,events:ev}}
function ensureCalendars(){
 try{if(typeof acalPublic==='function')acalPublic()}catch(e){}
 const Y=years();if(!Y)return false;let ch=false;
 const src=Y['1448-1449']||Y[yids()[yids().length-1]];if(!src)return false;
 [[1,'1447-1448'],[2,'1446-1447']].forEach(([n,id])=>{if(!Y[id]){const y=shifted(src,n);y.id=id;Y[id]=y;ch=true}});
 return ch}

/* ---------- 2) محرك الفصول بحسب الفصل الذي قُبل فيه الطالب ---------- */
const evOf=(y,sem,kind)=>(y.events.find(e=>e.sem==sem&&e.kind==kind)||{}).from||'';
function stTerm(s,l){
 const Y=years();if(!Y||!s||!s.adm||!s.adm.y)return null;
 const I=yids(),i=I.indexOf(s.adm.y);if(i<0)return null;
 const off=(+s.adm.sem-1)+(l-(s.lvl||1));if(off<0)return null;
 const y=Y[I[i+Math.floor(off/2)]];if(!y)return null;const sem=off%2+1;
 const st=evOf(y,sem,'start');if(!st)return null;
 const to=sem==1?evOf(y,1,'vac'):evOf(y,2,'end');
 return{sem,name:`${SEMN[sem]} ${hs(st).year}هـ / ${st.slice(0,4)}م`,year:`${y.hy} (${y.gy})`,from:st,to,weeks:to?Math.round((Date.parse(to)-Date.parse(st))/6048e5):''}}
window.semOf48=(s,l)=>{try{const t=stTerm(s,l);if(t)return t}catch(e){}return window.semOf(l)};
window.adm48opts=()=>{const Y=years();if(!Y)return[['','تلقائي (الفصل المعلن حالياً)']];const o=[['','تلقائي (الفصل المعلن حالياً)']];
 yids().forEach(id=>{const y=Y[id];[1,2].forEach(sem=>{const st=evOf(y,sem,'start');{const lb=`${SEMN[sem]} ${st?st.slice(0,4)+'م':''} — ${y.hy}`;try{EN[lb]=(sem==1?'First Term ':'Second Term ')+(st?st.slice(0,4):'')+' — '+y.hy.replace('هـ','AH')}catch(e){}o.push([id+'|'+sem,lb])}})});return o};
window.adm48sel=o=>o&&o.adm&&o.adm.y?o.adm.y+'|'+o.adm.sem:'';
window.adm48parse=v=>{if(!v)return undefined;const p=String(v).split('|');return p.length==2&&p[0]?{y:p[0],sem:+p[1]||1}:undefined};
window.adm48def=()=>{const A=dip().acal;return A&&A.active?{y:A.active,sem:1}:undefined};
window.adm48log=(a,id,d)=>{try{audit4(a,id,d)}catch(e){}};

/* ---------- 3) التسجيل اليدوي للمقررات (كامل المستوى أو مجزّأ) + رصد موحّد اختياري ---------- */
const gradeObj=(score,dt)=>{const b=(window.gradeOf39||gradeOf)(score);return{rel:1,relDate:dt,score,gl:b[1],pts:b[2],ok:b[2]>=2,fin:1,man:1,src:'manual',by:(typeof S!=='undefined'&&S.adminUser)||'admin',date:dt}};
const enMHtml=()=>{const L=S.students.filter(s=>+s.prog===DIP),C=crs().filter(c=>!c.legacy),LV={1:'المستوى الأول',2:'المستوى الثاني',3:'المستوى الثالث',4:'المستوى الرابع'};
 return `<form onsubmit="return enSave48(this)"><p class="mu">تسجيل إداري مباشر دون طلب إلكتروني، ويمكن اختيار مستوى كامل أو مقررات منفردة. الرصد اليدوي لا يخضع للاختبار الآلي، والمعدلات تُحتسب فوراً.</p>
 <label>الطالب<select name="sid" required><option value="">— اختر الطالب —</option>${L.map(s=>`<option value="${esc(s.id)}">${esc(s.name)} (${esc(s.id)})</option>`).join('')}</select></label>
 ${[1,2,3,4].map(l=>`<fieldset style="margin:8px 0;border:1px solid #cfd8e6;border-radius:8px;padding:8px"><legend><label style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" style="width:auto" onchange="this.closest('fieldset').querySelectorAll('input[name=c]').forEach(i=>i.checked=this.checked)"> <b>${LV[l]} كاملاً</b></label></legend>${C.filter(c=>c.term==l).map(c=>`<label style="display:block"><input type="checkbox" style="width:auto" name="c" value="${esc(c.id)}"> ${esc(c.code)} — ${esc(c.name)} <small>(${LG=='en'?esc(c.hrs)+' h':esc(c.hrs)+' س'})</small></label>`).join('')}</fieldset>`).join('')}
 <label>رصد درجة نهائية موحَّدة للمقررات المحدَّدة (0–100) — اختياري<input name="score" type="number" min="0" max="100" step="0.01" placeholder="اتركه فارغاً للتسجيل فقط"></label>
 <button class="btn">حفظ التسجيل</button></form>`};
const _cf48=cfForm;cfForm=function(){if(cf&&cf.t=='enM')return xo('تسجيل مقررات المستويات يدوياً',enMHtml());return _cf48.apply(this,arguments)};
window.enSave48=function(f){const s=S.students.find(x=>x.id==f.sid.value);if(!s){toast('اختر الطالب');return false}
 const ids=[...f.querySelectorAll('input[name=c]:checked')].map(i=>i.value);if(!ids.length){toast('حدِّد مقرراً واحداً على الأقل');return false}
 s.reg=[...new Set([...(s.reg||[]),...ids])];let n=0;const sc=f.score.value;
 if(sc!==''){const v=Math.min(100,Math.max(0,+sc));s.gr=s.gr||{};ids.forEach(id=>{const c=crs().find(x=>x.id==id),t=c&&stTerm(s,c.term);s.gr[id]=gradeObj(v,(t&&t.to)||today());n++})}
 cf=null;save();adm48log('تسجيل مقررات يدوياً',s.id,ids.length+' مقرر'+(n?' مع رصد '+n+' درجة':''));
 flash=`سُجِّل للطالب ${esc(s.name)} ${ids.length} مقرراً${n?' ورُصدت درجاتها، المعدل التراكمي: '+calc(s).gpa.toFixed(2)+' / 5.00':''}.`;go();return false};

/* ---------- 4) إصدار وثائق التخرج للدفعة دفعة واحدة (يُدخل رقم القرار والجلسة مرة واحدة) ---------- */
const _gb48=window.gradBox;
window.gradBox=function(){let h=_gb48.apply(this,arguments);
 try{const ok=S.students.filter(s=>+s.prog===DIP&&gradElig(s).ok);
  if(ok.length)h+=`<div class="box" style="margin-bottom:16px"><h3>إصدار وثائق التخرج للدفعة</h3><p class="mu">يُصدر الوثائق للطلاب المؤهَّلين المحدَّدين دفعة واحدة بنفس رقم القرار والجلسة. لا تُنشأ أرقام القرارات تلقائياً.</p><form onsubmit="return issueGradBatch48(this)">${ok.map(s=>`<label style="display:block"><input type="checkbox" style="width:auto" name="sid" value="${esc(s.id)}" checked> ${esc(s.name)} (${esc(s.id)})</label>`).join('')}<label>رقم قرار مجلس المعهد<input name="boardNo" required></label><label>رقم جلسة إدارة المعهد<input name="sessNo" required></label><button class="btn">اعتماد وإصدار وثائق التخرج للمحدَّدين</button></form></div>`}catch(e){}
 return h};
window.issueGradBatch48=function(f){const ids=[...f.querySelectorAll('input[name=sid]:checked')].map(i=>i.value),b=f.boardNo.value.trim(),q=f.sessNo.value.trim();
 if(!ids.length){toast('حدِّد طالباً واحداً على الأقل');return false}if(!b||!q){toast('أدخل رقم القرار ورقم الجلسة');return false}
 let n=0;ids.forEach(id=>{const s=S.students.find(x=>x.id==id),r=gradElig(s);if(!r.ok)return;const d=window.gradData(s),rec=v51Serial(0,'dgrad');
  S.certs.push({type:'dgrad',lang:'ar',rec,sid:s.id,name:s.name,nat:s.nat||'',pid:s.pid||'',prog:DIP,gpa:d.gpa,gterm:d.gterm,gyear:d.gyear,gdate:d.gdate,boardNo:b,sessNo:q,date:today()});n++});
 save();adm48log('إصدار وثائق تخرج للدفعة','—',n+' وثيقة — قرار '+b+' / جلسة '+q);flash=`صدرت ${n} وثيقة تخرج.`;go();return false};

/* ---------- 5) الدفعة الأولى التاريخية (2024–2025): ترحيل مرة واحدة غير مُتلِف ---------- */
const COH=[
 {id:'ST-2024-001',name:'محمد سماع بالله',nameEn:'MD SAMAUN BILLAH',dob:'2007-10-06',pob:'KISHOREGANJ',sex:'ذكر',pid:'A09734810'},
 {id:'ST-2024-002',name:'عبد الله السعد',nameEn:'ABDULLAH AL SAAD',dob:'2004-08-26',pob:'DHAKA',sex:'ذكر',pid:'A15869838'},
 {id:'ST-2024-003',name:'محمد ريحان',nameEn:'MD RAYHAN',dob:'2002-07-04',pob:'TANGAIL',sex:'ذكر',pid:'A22298335'},
 {id:'ST-2024-004',name:'السيدة محفظة البويشاخي',nameEn:'MST MAHAFIJATUL BOISHAKHI',dob:'2007-02-06',pob:'SIRAJGANJ',sex:'أنثى',pid:'A23628381'},
 {id:'ST-2024-005',name:'السيدة إسرة جهان بيندو',nameEn:'MST. ISRAT JAHAN BINDU',dob:'',pob:'',sex:'أنثى',pid:''}];
function seedCohort(){
 const C=crs().filter(c=>!c.legacy);if(!C.length)return false;let ch=false;
 COH.forEach(o=>{const _a=(window.V51&&V51.alias61)?V51.alias61(o.id):o.id;let s=S.students.find(x=>x.id==o.id||x.id==_a);
  if(!s){s={id:o.id,name:o.name,nameEn:o.nameEn,email:'',phone:'',sex:o.sex,nat:'بنغلاديش',natEn:'Bangladeshi',dob:o.dob,pob:o.pob,docType:'جواز سفر',pid:o.pid,prog:DIP,reg:[],sp:[],status:'متخرج',pass:pw(),exlang:'',adm:{y:'1446-1447',sem:1},cohort:'2024'};S.students.push(s);ch=true}
  s.reg=[...new Set([...(s.reg||[]),...C.map(c=>c.id)])];s.gr=s.gr||{};
  C.forEach(c=>{if(!s.gr[c.id]){const t=stTerm(s,c.term);s.gr[c.id]=gradeObj(100,(t&&t.to)||today());ch=true}});
  const t4=stTerm(s,4);if(t4&&t4.to&&s.gradDate!==t4.to){s.gradDate=t4.to;ch=true}
  if(s.status!=='متخرج'){s.status='متخرج';ch=true}});
 return ch}
function mig48(){if(typeof S==='undefined'||!S||!S.students||typeof crs!=='function')return;
 S.cfg=S.cfg||{};let ch=false;
 try{if(ensureCalendars())ch=true}catch(e){console.error('v48 cal',e)}
 if(!S.cfg.m48&&yids().includes('1446-1447')&&yids().includes('1447-1448')){try{if(seedCohort())ch=true;S.cfg.m48=1;ch=true}catch(e){console.error('v48 seed',e)}}
 if(ch){try{audit4('ترحيل v48','—','تقويمات 2024/2025 + الدفعة الأولى')}catch(e){}save()}}
window.mig48=mig48;
const _go48=window.go;window.go=function(){try{mig48()}catch(e){console.error('v48',e)}return _go48.apply(this,arguments)};
try{mig48();window.go()}catch(e){console.error('v48 init',e)}
}catch(e){console.error('v48',e)}})();

/* ---------- 6) معالجة اتجاه الأقواس والأرقام (RTL/LTR) في السجلات والوثائق ---------- */
(function(){
 const NUM=/\d{1,4}(?:\s*[\/\-–]\s*\d{1,4})+/g;
 function bidiFix(h){
  if(typeof h!=='string'||h.indexOf('<')<0)return h;
  const t=document.createElement('template');t.innerHTML=h;
  const w=document.createTreeWalker(t.content,NodeFilter.SHOW_TEXT),list=[];let n;
  while(n=w.nextNode()){const p=n.parentNode;if(p&&/^(STYLE|SCRIPT|TEXTAREA|TITLE)$/.test(p.nodeName))continue;if(/[()]|\d\s*[\/\-–]\s*\d/.test(n.nodeValue))list.push(n)}
  list.forEach(n=>{const frag=document.createDocumentFragment();
   n.nodeValue.split(/(\([^()]*\))/).forEach(part=>{if(!part)return;
    const isP=/^\(.*\)$/.test(part),host=isP?document.createElement('span'):frag;
    if(isP){host.setAttribute('dir','auto');host.style.unicodeBidi='isolate'}
    let last=0,m;NUM.lastIndex=0;
    while((m=NUM.exec(part))){host.append(document.createTextNode(part.slice(last,m.index)));const sp=document.createElement('span');sp.setAttribute('dir','ltr');sp.style.unicodeBidi='isolate';sp.textContent=m[0];host.append(sp);last=m.index+m[0].length}
    host.append(document.createTextNode(part.slice(last)));
    if(isP)frag.append(host)});
   n.parentNode.replaceChild(frag,n)});
  return t.innerHTML}
 window.bidiFix48=bidiFix;
 const prev=certHTML;
 certHTML=function(c){return bidiFix(prev.apply(this,arguments))};
})();


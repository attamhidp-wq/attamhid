
(()=>{try{
const AR=x=>String(x).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]),LA=x=>String(x).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const LVA={1:'المستوى الأول',2:'المستوى الثاني',3:'المستوى الثالث',4:'المستوى الرابع'};
const SEMT={1:'الفصل الدراسي الأول (العام الأول)',2:'الفصل الدراسي الثاني (العام الأول)',3:'الفصل الدراسي الأول (العام الثاني)',4:'الفصل الدراسي الثاني (العام الثاني)'};
const PL=[[1,[['0101','القرآن الكريم',2],['0102','لغويات أساسية (القراءة) ١',4],['0103','لغويات أساسية (الكتابة) ١',2],['0104','لغويات أساسية (استماع ومحادثة) ١',4],['0107','قواعد اللغة ١',4],['0108','لغويات أساسية (التراكيب)',4]]],[2,[['0110','العلوم الشرعية',2],['0111','القراءة',1],['0112','قواعد اللغة ٢',4],['0114','لغويات أساسية (الكتابة) ٢',5],['0115','التواصل اللغوي (استماع ومحادثة)',4],['0216','التعبير الكتابي',2],['0217','القراءة',2]]],[3,[['0218','الحضارة والثقافة السعودية',3],['0219','دروس من القرآن الكريم',3],['0220','العلوم الشرعية',5],['0221','دروس من القرآن الكريم',4],['0222','تاريخ المملكة العربية السعودية',1],['0223','العلوم الشرعية',2],['0224','القراءة',2]]],[4,[['0225','التحرير اللغوي ١',4],['0226','النصوص الأدبية ١',5],['0227','التواصل اللغوي (استماع ومحادثة)',3],['0228','تطبيقات تعلم إلكتروني ١ لغة عربية',5],['0229','دروس من القرآن الكريم',3]]]];
const blk=l=>{try{const _D=P(DIP);if(_D&&!_D.plan6&&fixPlan())save()}catch(e){}return crs().filter(c=>c.term==l&&!c.legacy).sort((a,b)=>String(a.code).localeCompare(String(b.code)))};
const hrs=L=>L.reduce((a,c)=>a+(+c.hrs||0),0);
/* ---- تصحيح الخطة إلى الحزم الأربع الصحيحة (80 ساعة = 4 × 20) ---- */
const NORM=k=>AR(LA(String(k||'')));
function fixPlan(){const D=P(DIP);if(!D)return 0;D.courses=D.courses||[];let c0=0;
const ref=new Set();S.students.forEach(s=>Object.keys(s.gr||{}).forEach(i=>ref.add(i)));(S.exams||[]).forEach(e=>e.courseId&&ref.add(e.courseId));
const canon=new Map();PL.forEach(([l,L])=>L.forEach(([k,n,h])=>canon.set(NORM(k),{l,k,n,h})));
const seen=new Set(),keep=[],gone=new Set();
D.courses.forEach(c=>{const key=NORM(c.code),m=canon.get(key);
if(m&&!seen.has(key)){seen.add(key);c.term=m.l;c.hrs=m.h;c.name=m.n;c.code=AR(m.k);delete c.legacy;keep.push(c)}
else if(ref.has(c.id)){c.legacy=1;keep.push(c)}
else gone.add(c.id)});
canon.forEach((m,key)=>{if(seen.has(key))return;let id='D'+m.k;if(keep.some(c=>c.id==id))id='N'+m.k;keep.push({id,code:AR(m.k),name:m.n,term:m.l,hrs:m.h,day:0,from:'',to:'',room:''})});
if(gone.size){S.students.forEach(s=>{if(s.reg)s.reg=s.reg.filter(i=>!gone.has(i))});S.faculty.forEach(f=>{if(f.teach)f.teach=f.teach.filter(i=>!gone.has(i))});S.docReqs.forEach(r=>{if(r.courses)r.courses=r.courses.filter(i=>!gone.has(i))})}
D.courses=keep;D.hours=80;D.plan6=1;D.plan5=1;return 1}
let ch=0;if(P(DIP)&&!P(DIP).plan6){try{ch=fixPlan()}catch(e){console.error(e)}}
if(ch)save();
window.PLAN_HOURS=()=>[1,2,3,4].map(l=>hrs(blk(l)));
/* ---- أهلية تسجيل الحزمة ---- */
const elig=(s,l)=>{const B=blk(l),reg=s.reg||[],g=s.gr||{};
if(s.status!='منتظم')return{ok:0,msg:'التسجيل متاح للطلاب المنتظمين فقط'};
if(!B.length)return{ok:0,msg:'لا مقررات في هذه الحزمة'};
if(l<(s.lvl||1))return{ok:0,msg:'خارج خطتك (مستوى أدنى من مستوى القبول)'};
if(B.every(c=>reg.includes(c.id)))return{ok:0,msg:'الحزمة مسجَّلة'};
if(S.docReqs.some(r=>r.type=='enroll'&&r.uid==s.id&&r.status=='قيد المراجعة'))return{ok:0,msg:'لديك طلب تسجيل قيد المراجعة'};
const run=[1,2,3,4].find(m=>m!=l&&blk(m).some(c=>reg.includes(c.id)&&!(g[c.id]&&g[c.id].fin)));
if(run)return{ok:0,msg:'لديك حزمة «'+LVA[run]+'» قيد الدراسة؛ لا تُسجَّل حزمتان في فصل واحد'};
for(let m=(s.lvl||1);m<l;m++){const P0=blk(m);if(P0.length&&!P0.every(c=>g[c.id]&&g[c.id].fin&&g[c.id].ok))return{ok:0,msg:'يلزم إكمال حزمة «'+LVA[m]+'» أولاً'}}
return{ok:1}};
const lvHtml=l=>{const B=blk(l);return `<div class="box"><h4>${LVA[l]} — ${SEMT[l]} · ${hrs(B)} ساعة معتمدة</h4><div class="tw"><table><tr><th>الرمز</th><th>المقرر</th><th>الساعات</th></tr>${B.map(c=>`<tr><td>${esc(c.code||'—')}</td><td>${esc(c.name)}</td><td>${c.hrs}</td></tr>`).join('')||'<tr><td colspan="3" class="mu">لا مقررات</td></tr>'}</table></div><p class="mu">تُسجَّل الحزمة كاملة في الفصل الدراسي، ولا يُسمح بتسجيل مقرر منفرد.</p></div>`};
window.lvShow=(l,el)=>{const b=el&&el.closest('.pc,.box'),p=b&&b.querySelector('.lvp');if(!p)return;if(p.dataset.l==l){p.innerHTML='';p.dataset.l='';return}p.dataset.l=l;p.innerHTML=lvHtml(l)};
window.lvBtns=()=>`<div class="lv">${[1,2,3,4].map(l=>`<button type="button" class="btn s" onclick="lvShow(${l},this)">${LVA[l]}</button>`).join('')}</div><div class="lvp"></div>`;
window.blkBox=s=>{const reg=s.reg||[],g=s.gr||{};const rows=[1,2,3,4].map(l=>{const B=blk(l),e=elig(s,l),all=B.length&&B.every(c=>reg.includes(c.id)),pass=B.length&&B.every(c=>g[c.id]&&g[c.id].fin&&g[c.id].ok),pend=S.docReqs.some(r=>r.type=='enroll'&&r.uid==s.id&&r.status=='قيد المراجعة'&&r.level==l);
const st=pass?'<span class="tag ok">مجتاز</span>':all?'<span class="tag ok">مسجَّل — قيد الدراسة</span>':pend?'<span class="tag">قيد المراجعة</span>':'';
return `<tr><td><b>${LVA[l]}</b><br><small class="mu">${SEMT[l]}</small></td><td>${B.length}</td><td>${hrs(B)}</td><td>${st}</td><td><button type="button" class="btn s" onclick="lvShow(${l},this)">عرض المقررات</button> ${e.ok?`<button type="button" class="btn" onclick="enrBundle(${l})">طلب تسجيل الحزمة كاملة</button>`:(st?'':`<small class="mu">${e.msg}</small>`)}</td></tr>`});
return `<h4 style="margin:10px 0 4px">الحزم الأكاديمية — التسجيل بالحزمة الكاملة فقط</h4>${tbl(['الحزمة','المقررات','الساعات','الحالة',''],rows)}<div class="lvp"></div>`};
window.enrBundle=function(l){const s=S.students.find(x=>x.id==(me&&me.id));if(!s)return;const e=elig(s,l);if(!e.ok){toast(e.msg);return}const B=blk(l),h=hrs(B);
if(!confirm('إرسال طلب تسجيل «'+LVA[l]+'» كاملاً ('+B.length+' مقررات — '+h+' ساعة) إلى الإدارة؟'))return;
S.docReqs.push({id:'ENR-'+Date.now().toString(36).toUpperCase(),role:'student',uid:s.id,type:'enroll',level:l,courses:B.map(c=>c.id),bundle:1,block:1,note:'تسجيل الحزمة كاملة — '+LVA[l]+' ('+B.length+' مقررات — '+h+' ساعة)',date:new Date().toISOString().slice(0,10),status:'قيد المراجعة'});save();toast('أُرسل طلب تسجيل الحزمة كاملة إلى الإدارة');go()};
window.enrSend=function(){toast('التسجيل الفردي للمقررات غير متاح؛ سجّل الحزمة كاملة');return false};
/* ---- تسجيل الإدارة بالحزم فقط ---- */
const _cf=cfForm;cfForm=function(){if(cf&&cf.t=='crA'&&cf.k=='s'){const o=S.students.find(x=>x.id==cf.id);if(!o){cf=null;return ''}const reg=o.reg||[];
return xo('تسجيل حزم الطالب '+esc(o.name),`<form onsubmit="return saveCrA(this)" style="display:block"><p class="mu">التسجيل بالحزمة كاملة فقط؛ لا يجوز تسجيل مقرر منفرد.</p>${[1,2,3,4].map(l=>{const B=blk(l);return `<label style="display:flex;flex-direction:row;gap:8px;align-items:center;color:var(--tx)"><input type="checkbox" value="${l}" style="width:auto" ${B.length&&B.every(c=>reg.includes(c.id))?'checked':''}> ${LVA[l]} — ${SEMT[l]} (${B.length} مقررات · ${hrs(B)} ساعة)</label>`}).join('')}<button class="btn">حفظ</button></form>`)}return _cf()};
const _sv=window.saveCrA;window.saveCrA=function(f){if(!(cf&&cf.k=='s'))return _sv.apply(this,arguments);const o=S.students.find(x=>x.id==cf.id),lv=[...f.querySelectorAll('input:checked')].map(x=>+x.value);
const lg=(o.reg||[]).filter(id=>{const c=crs().find(x=>x.id==id);return c&&c.legacy});o.reg=[...new Set([...lg,...lv.flatMap(l=>blk(l).map(c=>c.id))])];cf=null;save();flash='حُفظ تسجيل الحزم.';go();return false};
/* ---- تفعيل زر الاختبار تلقائياً عند حلول الموعد ---- */
const nowS=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16);let sig='';
setInterval(()=>{try{if(!me||me.r!='student'||(typeof taking!='undefined'&&taking))return;const n=nowS(),g=S.exams.map(e=>(e.date&&e.date<=n?1:0)+''+(e.end&&e.end<=n?1:0)).join('');if(sig&&g!==sig)go();sig=g}catch(e){}},20000);
const st=document.createElement('style');st.textContent='.lv{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.lvp .box{margin-top:8px}';document.head.appendChild(st);
if(ch)go();
}catch(e){console.error('blk',e)}})();

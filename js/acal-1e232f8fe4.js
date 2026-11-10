
(()=>{try{
const WK='الدوام الرسمي 5 أيام أسبوعياً من الأحد إلى الخميس، والإجازة الأسبوعية يوما الجمعة والسبت.';
const KINDS={reg:'التسجيل',start:'بداية الدراسة',exam:'الاختبارات',vac:'إجازة',end:'نهاية العام'};
const uid=()=>'e'+Math.random().toString(36).slice(2,8);
const E=(sem,kind,title,from,to,h,g,note)=>({id:uid(),sem,kind,title,from:from||'',to:to||'',h:h||'',g:g||'',note:note||''});
const seed=()=>({id:'1448-1449',hy:'1448 / 1449 هـ',gy:'2026 / 2027 م',status:'معتمد',events:[
E(1,'reg','فتح باب القبول والتسجيل','','','ذو الحجة 1447 هـ','مايو / يونيو 2026 م'),
E(1,'reg','انتهاء التسجيل وإعداد الجداول','2026-07-19','','05 صفر 1448 هـ','19 يوليو 2026 م'),
E(1,'start','بداية الدراسة','2026-08-23','','10 ربيع الأول 1448 هـ','23 أغسطس 2026 م'),
E(1,'exam','بداية الاختبارات النهائية','2026-12-27','','18 رجب 1448 هـ','27 ديسمبر 2026 م'),
E(1,'vac','إجازة منتصف العام الدراسي','2027-01-07','','29 رجب 1448 هـ','07 يناير 2027 م','بعد نهاية الدوام في هذا اليوم'),
E(2,'start','بداية الدراسة','2027-01-17','','09 شعبان 1448 هـ','17 يناير 2027 م'),
E(2,'vac','إجازة يوم التأسيس','2027-02-21','2027-02-22','14 - 15 رمضان 1448 هـ','21 - 22 فبراير 2027 م'),
E(2,'vac','إجازة عيد الفطر المبارك','2027-02-25','2027-03-14','18 رمضان - 06 شوال 1448 هـ','25 فبراير - 14 مارس 2027 م','نهاية الدوام 18 رمضان 1448 هـ، والعودة 06 شوال 1448 هـ'),
E(2,'vac','إجازة عيد الأضحى المبارك','2027-05-06','2027-05-23','29 ذو القعدة - 17 ذو الحجة 1448 هـ','06 - 23 مايو 2027 م','نهاية الدوام 29 ذو القعدة 1448 هـ، والعودة 17 ذو الحجة 1448 هـ'),
E(2,'exam','بداية الاختبارات النهائية','2027-06-06','','01 محرم 1449 هـ','06 يونيو 2027 م'),
E(2,'end','نهاية العام الدراسي والإجازة الصيفية','2027-06-17','','12 محرم 1449 هـ','17 يونيو 2027 م','بعد نهاية الدوام في هذا اليوم')]});
const ac=()=>{const D=P(DIP);if(!D.acal||!D.acal.years){D.acal={active:'1448-1449',years:{'1448-1449':seed()}};save()}return D.acal};
const ids=A=>Object.keys(A.years).sort();
let sel=null;const cur=()=>{const A=ac();if(!sel||!A.years[sel])sel=A.active&&A.years[A.active]?A.active:ids(A)[0];return A.years[sel]};
const bump=(s,n)=>String(s||'').replace(/\b(14\d\d|20\d\d)\b/g,m=>+m+(n||1));
const addDays=(iso,n)=>new Date(Date.parse(iso+'T12:00:00Z')+n*864e5).toISOString().slice(0,10);
const gOne=iso=>{try{return new Intl.DateTimeFormat('ar-u-nu-latn',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(iso+'T12:00:00'))+' م'}catch(e){return iso}};
const dtxt=e=>({h:e.h||'—',g:e.g||(e.from?(e.to&&e.to!=e.from?gOne(e.from)+' - '+gOne(e.to):gOne(e.from)):'—')});
const HF=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn',{day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'});
const hs=iso=>HF.formatToParts(new Date(iso+'T12:00:00Z')).reduce((a,x)=>(a[x.type]=x.value,a),{});
const hTxt=(a,b)=>{const x=hs(a);if(!b||b==a)return `${x.day} ${x.month} ${x.year} هـ`;const y=hs(b);if(x.year==y.year)return x.month==y.month?`${x.day} - ${y.day} ${x.month} ${x.year} هـ`:`${x.day} ${x.month} - ${y.day} ${y.month} ${x.year} هـ`;return `${x.day} ${x.month} ${x.year} - ${y.day} ${y.month} ${y.year} هـ`};
const hchk=e=>{if(!e.from||!e.h)return '';const x=hs(e.from);return(e.h.includes(x.day)&&e.h.includes(x.month)&&e.h.includes(x.year))?'':hTxt(e.from,'')};
const mv=iso=>{const p=hs(iso),t=addDays(iso,354);for(let k=-4;k<=4;k++){const c=addDays(t,k),q=hs(c);if(+q.year==+p.year+1&&q.month==p.month&&q.day==p.day)return c}return t};
const dow=iso=>new Date(iso+'T12:00:00').getDay();
const wkend=iso=>{const d=dow(iso);return d==5||d==6};
const semTbl=(y,s)=>{const L=y.events.filter(e=>e.sem==s);return tbl(['المناسبة / الإجراء','التاريخ الهجري','التاريخ الميلادي','ملاحظة'],L.map(e=>{const t=dtxt(e);return `<tr><td>${esc(e.title)}</td><td>${esc(t.h)}</td><td>${esc(t.g)}</td><td>${esc(e.note||'')}</td></tr>`}))};
const SEMN={1:'الفصل الدراسي الأول',2:'الفصل الدراسي الثاني'};
window.acalPublic=()=>{try{const A=ac(),y=A.years[A.active];if(!y)return '';return `<h3>التقويم الأكاديمي المعتمد للعام ${esc(y.hy)} (${esc(y.gy)})</h3><p class="mu">${WK} نظام الدراسة فصلان دراسيان في كل عام.</p>`+[1,2].map(s=>`<h3>${SEMN[s]}</h3><div class="box">${semTbl(y,s)}</div>`).join('')}catch(e){return ''}};
window.acalText=()=>{try{const A=ac(),y=A.years[A.active];if(!y)return '';return 'التقويم الأكاديمي '+y.hy+' ('+y.gy+') — فصلان دراسيان، والدوام من الأحد إلى الخميس:\n'+[1,2].map(s=>SEMN[s]+':\n'+y.events.filter(e=>e.sem==s).map(e=>{const t=dtxt(e);return '• '+e.title+': '+t.h+' ('+t.g+')'}).join('\n')).join('\n')}catch(e){return ''}};
const rowH=e=>`<tr data-id="${e.id}"><td><select class="as">${[1,2].map(s=>`<option value="${s}" ${e.sem==s?'selected':''}>${SEMN[s]}</option>`).join('')}</select></td><td><select class="ak">${Object.keys(KINDS).map(k=>`<option value="${k}" ${e.kind==k?'selected':''}>${KINDS[k]}</option>`).join('')}</select></td><td><input class="at" value="${esc(e.title)}"></td><td><input class="af" type="date" value="${esc(e.from)}"></td><td><input class="ae" type="date" value="${esc(e.to)}"></td><td><input class="ah" value="${esc(e.h)}"></td><td><input class="ag" value="${esc(e.g)}"></td><td><input class="an" value="${esc(e.note)}"></td><td><button type="button" class="btn d" onclick="this.closest('tr').remove()">حذف</button></td></tr>`;
window.acalAdd=()=>{const t=document.querySelector('#acT table');if(t)(t.tBodies[0]||t).insertAdjacentHTML('beforeend',rowH(E(1,'vac','','','','','','')))};
window.acalPick=v=>{sel=v;go()};
window.acalCheck=fix=>{const out=[];document.querySelectorAll('#acT tr[data-id]').forEach(r=>{const f=r.querySelector('.af').value,hi=r.querySelector('.ah'),c=hchk({from:f,h:hi.value});hi.style.outline=c?'2px solid #c0392b':'';if(!c)return;out.push('«'+r.querySelector('.at').value+'»: المكتوب «'+hi.value+'»، والمطابق لتقويم أم القرى «'+c+'»');if(fix){hi.value=hTxt(f,r.querySelector('.ae').value);r.querySelector('.ag').value=''}});
document.getElementById('acChk').innerHTML=out.length?'<div class="msg">'+(fix?'عُدِّل الهجري تلقائياً (اضغط حفظ التقويم):':'اختلافات مع تقويم أم القرى:')+'<br>'+out.map(esc).join('<br>')+'</div>':'<div class="msg">كل التواريخ الهجرية مطابقة لتقويم أم القرى.</div>'};
window.acalSave=f=>{const A=ac(),y=cur(),ev=[];let warn='';
for(const r of f.querySelectorAll('#acT tr[data-id]')){const q=c=>r.querySelector('.'+c).value.trim(),t=q('at'),from=q('af'),to=q('ae');
if(!t){toast('أدخل اسم المناسبة في كل صف');return false}
if(from&&to&&to<from){toast('«'+t+'»: تاريخ النهاية قبل البداية');return false}
const o={id:r.dataset.id,sem:+q('as'),kind:q('ak'),title:t,from,to,h:q('ah'),g:q('ag'),note:q('an')};
if(from&&['start','exam','end'].includes(o.kind)&&wkend(from))warn+=' ⚠ «'+t+'» يوافق إجازة أسبوعية (جمعة/سبت).';
if(hchk(o))warn+=' ⚠ «'+t+'»: الهجري لا يطابق الميلادي في تقويم أم القرى.';ev.push(o)}
ev.sort((a,b)=>a.sem-b.sem||(a.from||'').localeCompare(b.from||''));
y.events=ev;y.hy=f.elements.hy.value.trim()||y.hy;y.gy=f.elements.gy.value.trim()||y.gy;
y.gen=false;save();flash='حُفظ التقويم الأكاديمي.'+warn;go();return false};
const sync=(A)=>{const D=P(DIP);D.cal=D.cal||{};const I=ids(A),i=I.indexOf(A.active);
[[A.active,1],[I[i+1],3]].forEach(([id,base])=>{const y=A.years[id];if(!y)return;
const f=(s,k)=>(y.events.find(e=>e.sem==s&&e.kind==k&&e.from)||{}).from||'';
const p=[[base,f(1,'start'),f(1,'vac')],[base+1,f(2,'start'),f(2,'end')]];
p.forEach(([l,a,b])=>{if(!a||!b)return;const c=D.cal[l]||{};D.cal[l]={year:c.year||('السنة الدراسية '+(l<3?'الأولى':'الثانية')),name:c.name||DEFR.sem[l],from:a,to:b,weeks:Math.max(16,calWk(a,b)||16)}})})};
window.acalActivate=()=>{const A=ac(),y=cur();if(!confirm('اعتماد تقويم '+y.hy+' كتقويم معلن للطلاب والأساتذة ومزامنة مواعيد المستويات معه؟'))return;
y.status='معتمد';y.gen=false;A.active=y.id;try{sync(A)}catch(e){}save();flash='اعتُمد تقويم '+y.hy+' وظهر في بوابات الطلاب والأساتذة والسجلات.';go()};
window.acalNext=()=>{const A=ac(),I=ids(A),src=A.years[I[I.length-1]],nid=src.id.split('-').map(x=>+x+1).join('-');
if(A.years[nid]){sel=nid;toast('تقويم '+nid+' موجود مسبقاً');go();return}
if(!confirm('إنشاء تقويم العام التالي ('+bump(src.hy)+') من هيكل تقويم '+src.hy+'؟ سيُنشأ كمسودة قابلة للتعديل.'))return;
const ny={id:nid,hy:bump(src.hy),gy:bump(src.gy),status:'مسودة',gen:true,events:src.events.map(e=>{const n={...e,id:uid(),h:bump(e.h),note:bump(e.note)};
if(e.from){n.from=mv(e.from);n.to=e.to?mv(e.to):'';n.h=hTxt(n.from,n.to);n.g=''}else n.g=bump(e.g);return n})};
A.years[nid]=ny;sel=nid;save();flash='أُنشئ تقويم '+ny.hy+' كمسودة بنفس الهيكل: عدّل التواريخ وفق التقويم الصادر ثم اضغط «اعتماد».';go()};
window.acalDel=()=>{const A=ac(),y=cur();if(ids(A).length<2){toast('لا يمكن حذف التقويم الوحيد');return}
if(y.id==A.active){toast('لا يمكن حذف التقويم المعتمد المعلن؛ اعتمد تقويماً آخر أولاً');return}
if(!confirm('حذف تقويم '+y.hy+' نهائياً؟'))return;delete A.years[y.id];sel=null;save();flash='حُذف التقويم.';go()};
const _old=window.calAdmin;
window.calAdmin=function(){const A=ac(),y=cur(),I=ids(A);
const rows=y.events.map(rowH);
return `<h3>التقويم الأكاديمي الرسمي — فصلان دراسيان حصراً</h3><p class="mu">${WK}</p><div class="box"><label>العام الدراسي <select onchange="acalPick(this.value)">${I.map(i=>`<option value="${i}" ${i==y.id?'selected':''}>${esc(A.years[i].hy)} — ${A.years[i].status||'مسودة'}${i==A.active?' (المعلن)':''}</option>`).join('')}</select></label> <button type="button" class="btn" onclick="acalNext()">➕ إضافة تقويم سنة قادمة</button> <button type="button" class="btn s" onclick="acalActivate()">اعتماد وإعلان هذا التقويم</button> <button type="button" class="btn d" onclick="acalDel()">حذف هذا التقويم</button></div>${y.gen?'<div class="msg">هذا التقويم مولَّد تلقائياً من العام السابق (مسودة): التواريخ الهجرية محفوظة والميلادية محسوبة من تقويم أم القرى، وقد تختلف يوماً عن الإعلان الرسمي؛ راجعها وعدّلها وفق التقويم الصادر ثم اعتمده.</div>':''}<form onsubmit="return acalSave(this)" style="display:block"><label>العام (هجري)<input name="hy" value="${esc(y.hy)}"></label><label>العام (ميلادي)<input name="gy" value="${esc(y.gy)}"></label><div id="acChk"></div><div id="acT">${tbl(['الفصل','النوع','المناسبة / الإجراء','من (ميلادي)','إلى (ميلادي)','التاريخ الهجري','التاريخ الميلادي (نص)','ملاحظة',''],rows)}</div><p class="mu">أضف أو عدّل أو احذف أي مناسبة أو إجازة؛ التاريخ بصيغة التقويم يُدخل كنص حرّ، وحقلا «من/إلى» للترتيب والتنبيه ومزامنة الفصول.</p><button type="button" class="btn s" onclick="acalAdd()">+ إضافة مناسبة / إجراء / إجازة</button> <button type="button" class="btn s" onclick="acalCheck(0)">مطابقة التواريخ بتقويم أم القرى</button> <button type="button" class="btn s" onclick="acalCheck(1)">تصحيح الهجري تلقائياً حسب الميلادي</button> <button class="btn">حفظ التقويم</button></form><details><summary>مستويات الفصول وربطها بالسجلات (تُزامَن عند الاعتماد)</summary>${_old?_old():''}</details>`};
/* ترحيل أسماء قديمة: لا فصل ثالث أو رابع */
const D=P(DIP);let ch=0;const fix=v=>/الثالث|الرابع/.test(v||'');
if(D.rcfg&&D.rcfg.sem)[3,4].forEach(l=>{if(fix(D.rcfg.sem[l])){D.rcfg.sem[l]=DEFR.sem[l];ch=1}});
if(D.cal)[3,4].forEach(l=>{if(D.cal[l]&&fix(D.cal[l].name)){D.cal[l].name=DEFR.sem[l];ch=1}});
const A0=ac();if(!A0.fix2){const y0=A0.years['1448-1449'];const FX=[[1,'فتح باب القبول والتسجيل',{g:'يونيو / يوليو 2026 م'},{g:'مايو / يونيو 2026 م'}],[1,'بداية الدراسة',{h:'10 صفر 1448 هـ'},{h:'10 ربيع الأول 1448 هـ'}],[1,'بداية الاختبارات النهائية',{h:'18 جمادى الآخرة 1448 هـ'},{h:'18 رجب 1448 هـ'}],[1,'إجازة منتصف العام الدراسي',{h:'29 جمادى الآخرة 1448 هـ'},{h:'29 رجب 1448 هـ'}],[2,'بداية الدراسة',{h:'09 رجب 1448 هـ'},{h:'09 شعبان 1448 هـ'}],[2,'إجازة يوم التأسيس',{h:'14 - 15 شعبان 1448 هـ'},{h:'14 - 15 رمضان 1448 هـ'}],[2,'إجازة عيد الفطر المبارك',{from:'2027-03-25',to:'2027-04-14'},{from:'2027-02-25',to:'2027-03-14',g:'25 فبراير - 14 مارس 2027 م'}]];
if(y0)FX.forEach(([sm,tt,o,nw])=>{const e=y0.events.find(x=>x.sem==sm&&x.title==tt&&Object.keys(o).every(k=>x[k]==o[k]));if(e)Object.assign(e,nw)});
Object.keys(A0.years).forEach(k=>{if(A0.years[k].gen)delete A0.years[k]});A0.fix2=1;ch=1}
try{Object.keys(S).forEach(k=>{const a=S[k];if(Array.isArray(a))a.forEach(o=>{if(o&&typeof o=='object')['term','gterm','adm_term'].forEach(f=>{if(typeof o[f]=='string'){const n=FXT(o[f]);if(n!==o[f]){o[f]=n;ch=1}}})})})}catch(e){}
if(ch){save();go()}
}catch(e){console.error('acal',e)}})();

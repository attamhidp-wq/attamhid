
(()=>{try{
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const OPEN=['قيد المراجعة','قائمة الانتظار','اعتذار لعدم توفر مقاعد'];
const pl=r=>r&&r.pl&&r.pl.score!=null&&r.pl.score!==''?r.pl:(r&&r.placementScore!=null&&r.placementScore!==''?{score:+r.placementScore,ts:0,date:r.placementDate||''}:null);
const cfg=()=>{const D=P(DIP);D.adm=D.adm||{seats:'',rest:'قائمة الانتظار'};return D.adm};
const fmt=ts=>{if(!ts)return '—';const d=new Date(ts-new Date().getTimezoneOffset()*6e4);return d.toISOString().slice(0,16).replace('T',' ')};
const rank=()=>S.requests.filter(r=>OPEN.includes(r.status)&&pl(r)).sort((a,b)=>{const x=pl(a),y=pl(b);return (+y.score)-(+x.score)||((x.ts||1e15)-(y.ts||1e15))||String(a.id).localeCompare(String(b.id))});
window.admSeats=v=>{const c=cfg();c.seats=v===''?'':Math.max(0,parseInt(v)||0);save()};
window.admRest=v=>{cfg().rest=v;save()};
window.admPanel=()=>{const c=cfg(),R=rank(),n=+c.seats||0,noT=S.requests.filter(r=>OPEN.includes(r.status)&&!pl(r)).length;
const rows=R.map((r,i)=>{const p=pl(r),w=i<n;return `<tr><td>${i+1}</td><td>${E(r.name)}<br><small class="mu">${E(r.id)}</small></td><td><b>${E(p.score)}</b> / 100</td><td dir="ltr">${E(fmt(p.ts))}</td><td>${n?(w?'<span class="tag ok">مقبول نهائياً</span>':'<span class="tag">'+E(c.rest)+'</span>'):'—'}</td></tr>`}).join('')||'<tr><td colspan="5" class="mu">لا متقدمون أدّوا الاختبار بعد.</td></tr>';
return `<div class="box"><h3>المفاضلة والقبول الآلي</h3><p class="mu">يعتمد الترتيب على درجة اختبار تحديد المستوى (الأعلى أولاً)، وعند التساوي تُقدَّم الأسبقية في وقت تسليم الاختبار. يشمل الترتيب الطلبات قيد المراجعة والمدرجة في قائمة الانتظار.</p>
<label>عدد المقاعد المتاحة<input type="number" min="0" value="${c.seats}" onchange="admSeats(this.value);go()" style="max-width:160px"></label>
<label>حالة بقية المتقدمين<select onchange="admRest(this.value);go()"><option ${c.rest=='قائمة الانتظار'?'selected':''}>قائمة الانتظار</option><option ${c.rest!='قائمة الانتظار'?'selected':''}>اعتذار لعدم توفر مقاعد</option></select></label>
<p><button class="btn" onclick="admRun()">تشغيل المفاضلة وإعلان نتائج القبول</button></p>
${noT?`<p class="mu">${noT} متقدم لم يؤدِّ الاختبار بعد ولن يدخل المفاضلة.</p>`:''}${c.last?`<p class="mu">آخر تشغيل: ${E(c.last)}</p>`:''}
<div class="tw"><table><tr><th>الترتيب</th><th>المتقدم</th><th>الدرجة</th><th>وقت تسليم الاختبار</th><th>النتيجة المتوقعة</th></tr>${rows}</table></div></div>`};
window.admRun=()=>{const c=cfg(),n=+c.seats||0;if(!n){toast('حدّد عدد المقاعد المتاحة أولاً');return}const R=rank();if(!R.length){toast('لا يوجد متقدمون مؤهلون للمفاضلة');return}
if(!confirm('سيُقبل أعلى '+Math.min(n,R.length)+' متقدماً درجةً ويُنشأ لهم حساب طالب، وتُحوَّل البقية إلى «'+c.rest+'». المتابعة؟'))return;
const goBak=typeof go=='function'?go:null;let cred=[];
try{if(goBak)go=()=>{};
R.forEach((r,i)=>{r.rank=i+1;if(i<n){try{decide(r.id,1)}catch(e){console.error(e)}
r.status='مقبول';r.admRes='مقبول نهائياً';r.admNote='تهانينا، قُبلتَ بحسب ترتيبك في المفاضلة.';const s=S.students.find(x=>x.id==r.sid);if(s)cred.push([r.name,s.id,r.pid,s.pass]);
}else{r.status=c.rest;r.admRes=c.rest;r.admNote=c.rest=='قائمة الانتظار'?'أنت في قائمة الانتظار برقم '+(i+1-n)+' وسيُنظر في طلبك عند توفر مقعد.':'نعتذر لعدم توفر مقاعد كافية.';r.waitPos=i+1-n}
try{if(window.notify4&&r.email)notify4(r.email,'نتيجة المفاضلة — معهد التمهيد',['السلام عليكم '+r.name,'درجتك في اختبار تحديد المستوى: '+pl(r).score+' / 100 — ترتيبك: '+(i+1),'نتيجة الطلب: '+r.admRes],null,r.id)}catch(e){}});
}finally{if(goBak)go=goBak}
c.last=fmt(Date.now())+' — مقاعد: '+n+' · مقبولون: '+Math.min(n,R.length)+' · '+c.rest+': '+Math.max(0,R.length-n);save();
flash='أُعلنت نتائج المفاضلة. '+cred.length+' مقبول. بيانات الدخول (الاسم · الرقم الأكاديمي · اسم المستخدم = رقم الجواز · كلمة المرور):<br>'+cred.map(x=>E(x[0])+' · '+E(x[1])+' · '+E(x[2])+' · <b dir="ltr">'+E(x[3])+'</b>').join('<br>');
go()};
}catch(e){console.error('adm',e)}})();


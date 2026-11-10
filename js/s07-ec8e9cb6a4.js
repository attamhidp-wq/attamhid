
/* ===== الدورات والورش والبرامج القصيرة: تسجيل مبسّط وشهادات مشاركة (منفصل عن الدبلوم) ===== */
(()=>{
const A=x=>esc(x==null?'':x),today=()=>new Date().toISOString().slice(0,10),rid=()=>'SR-'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase();
const nn=s=>nz(String(s||'').replace(/\s+/g,' ').trim());
const isShort=p=>!!p&&p.id!=DIP&&p.kind!='diploma';
S.shortReg=S.shortReg||[];
const reg=(pid,name,sid)=>{const k=nn(name);if(!k)return false;if(S.shortReg.some(r=>r.prog==pid&&nn(r.name)==k))return true;
 const st=sid&&S.students.find(x=>x.id==sid);return !!(st&&(st.sp||[]).includes(pid))};
window.shRegistered=reg;
const NOREG='لا يمكن إصدار شهادة مشاركة: الاسم غير مسجَّل في قائمة هذا البرنامج.';
/* حارس الإصدار: شهادة المشاركة في برنامج قصير لا تصدر إلا لمسجَّل */
const _issue=issue;issue=function(f){const v=fv(f);if(v.type=='part'&&isShort(S.programs.find(p=>p.id==+v.prog))){const st=S.students.find(x=>x.id==v.sid),nm=v.name||(st&&st.name)||'';if(!reg(+v.prog,nm,v.sid)){toast(NOREG);return false}}return _issue.apply(this,arguments)};
const _ib=issueBatch;issueBatch=function(f){const v=fv(f);if(v.type=='part'&&isShort(S.programs.find(p=>p.id==+v.prog))){const bad=[];
 [...f.querySelectorAll('.bsel:checked')].forEach(x=>{const s=S.students.find(y=>y.id==x.value);s&&!reg(+v.prog,s.name,s.id)&&bad.push(s.name)});
 String(v.names||'').split('\n').map(x=>x.split('|')[0].trim()).filter(Boolean).forEach(n=>{!reg(+v.prog,n)&&bad.push(n)});
 if(bad.length){toast(NOREG+' ('+bad.slice(0,3).join('، ')+(bad.length>3?'…':'')+')');return false}}return _ib.apply(this,arguments)};
/* ---------- الواجهة العامة ---------- */
V.programs=()=>`<h2>البرامج والدورات</h2>${tbar('prog','ابحث باسم البرنامج أو المشرف أو الوصف…',['قادم','جارٍ','منتهٍ','ملغى'])}<div class="grid">${S.programs.map(p=>{const st=pst(p),btn=p.cancelled?'':p.kind=='diploma'||p.id==DIP?'<a href="#/register" class="btn" style="display:inline-block;text-decoration:none">سجّل في الدبلوم</a>':st=='منتهٍ'?'':`<button class="btn" onclick="shOpen(${p.id})">سجّل في البرنامج</button>`;
return `<div class="box" data-k="${esc([p.name,p.desc,p.teacher,p.plan,p.fee].join(' '))}" data-f="${st}">${btn?`<p style="margin:0 0 8px">${btn}</p>`:''}<h3>${esc(p.name)}</h3><span class="tag">${st}</span><p>${esc(p.desc)}</p><div class="mu">${p.id==DIP||p.kind=='diploma'?'سنتان · 4 فصول · '+esc(p.hours)+' ساعة معتمدة':esc(p.from)+' ← '+esc(p.to)+' · '+esc(p.hours)+' ساعة · '+esc(p.fee)}</div>${(p.kind=='diploma'||p.id==DIP)&&window.lvBtns?window.lvBtns():''}<p class="mu">المشرف: ${esc(p.teacher)}<br>الخطة: ${esc(p.plan)}</p>${p.cancelled?'<p class="mu">أُلغي هذا البرنامج أو أُوقف التسجيل فيه.</p>':''}</div>`}).join('')||'<p>لا توجد برامج بعد.</p>'}</div>`;
window.shOpen=pid=>{const p=S.programs.find(x=>x.id==pid);if(!isShort(p))return;mdl('التسجيل في: '+A(p.name),`<form onsubmit="return shSelf(this,${pid})"><label>الاسم كما يُراد طباعته في الشهادة<input name="n" required minlength="3" autocomplete="off" autofocus></label><button class="btn">تسجيل</button></form>`)};
window.shSelf=(f,pid)=>{const p=S.programs.find(x=>x.id==pid),name=String(fv(f).n||'').replace(/\s+/g,' ').trim();if(!isShort(p)||name.length<3)return false;
 if(reg(pid,name)){mo('<div class="msg">هذا الاسم مسجَّل مسبقاً في البرنامج.</div>');return false}
 const r={id:rid(),prog:pid,name,date:today(),by:'self'};S.shortReg.push(r);save();
 if(sb)sb.rpc('short_register',{r}).then(({error})=>error&&console.error(error.message));
 mo(`<div class="msg">تم تسجيلك في «${A(p.name)}». سيُطبع الاسم في الشهادة كما كتبته: <b>${A(name)}</b></div>`);f.reset();return false};
/* ---------- لوحة الإدارة ---------- */
let shP=null;
const shSync=async()=>{if(!sb||!sbAdmin)return;try{const {data}=await sb.from('short_regs').select('id,data');(data||[]).forEach(x=>{const o=x.data||x,i=S.shortReg.findIndex(y=>y.id==o.id);i<0?S.shortReg.push(o):S.shortReg[i]=o})}catch(e){console.error(e)}};
const shPush=r=>{save();sb&&sbAdmin&&sb.from('short_regs').upsert({id:r.id,data:r}).then(({error})=>error&&toast('تعذّر الحفظ على الخادم.'))};
const certOf=r=>S.certs.find(c=>c.shreg==r.id&&!c.revoked);
const shAdmin=()=>{const L=S.programs.filter(isShort);if(!L.some(p=>p.id==shP))shP=L[0]&&L[0].id;const p=L.find(x=>x.id==shP);
 if(!p)return '<p class="mu">لا توجد برامج قصيرة. أضف برنامجاً من تبويب «البرامج».</p>';
 const R=S.shortReg.filter(r=>r.prog==p.id);
 return `<p class="mu">آلية مستقلة عن الدبلوم: لا تصدر شهادة مشاركة إلا لاسم مسجَّل في قائمة البرنامج.</p><label>الدورة / الورشة / البرنامج القصير<select onchange="shPick(this.value)">${L.map(x=>`<option value="${x.id}"${x.id==p.id?' selected':''}>${A(x.name)}</option>`).join('')}</select></label>
<div class="grid"><div class="box"><h3>تسجيل فردي</h3><form onsubmit="return shAdd(this)"><label>الاسم كما يُطبع في الشهادة<input name="n" required></label><button class="btn">تسجيل</button></form></div><div class="box"><h3>تسجيل جماعي (دفعة واحدة)</h3><form onsubmit="return shBulk(this)"><label>الأسماء — اسم في كل سطر<textarea name="t" rows="6" required></textarea></label><button class="btn">تسجيل الدفعة</button></form></div></div>
<h3>المسجَّلون (${R.length})</h3><p><button class="btn" onclick="shIssueAll()">إصدار شهادات المشاركة لمن لم تصدر لهم</button></p>`+tbl(['الاسم','تاريخ التسجيل','المصدر','الشهادة',''],R.map(r=>{const c=certOf(r);return `<tr><td>${A(r.name)}</td><td>${A(r.date)}</td><td>${r.by=='self'?'ذاتي':'الإدارة'}</td><td>${c?A(c.rec):'—'}</td><td>${c?`<button class="btn s" onclick="shView('${A(r.id)}')">عرض الشهادة</button>`:`<button class="btn" onclick="shIssue('${A(r.id)}')">إصدار شهادة مشاركة</button> <button class="btn d" onclick="shDel('${A(r.id)}')">حذف</button>`}</td></tr>`}))};
const shDraw=()=>{const t=document.querySelector('#app .tabs');if(!t||tab!='sh')return;const b=t.nextElementSibling;b&&b.classList.contains('box')&&(b.innerHTML=shAdmin())};
window.shPick=v=>{shP=+v;shDraw()};
const addNames=(L)=>{let n=0,dup=0;L.forEach(x=>{const name=String(x||'').replace(/\s+/g,' ').trim();if(name.length<2)return;if(reg(shP,name)){dup++;return}const r={id:rid(),prog:shP,name,date:today(),by:'admin'};S.shortReg.push(r);shPush(r);n++});return {n,dup}};
window.shAdd=f=>{const r=addNames([fv(f).n]);toast(r.n?'تم التسجيل.':'الاسم مسجَّل مسبقاً.');shDraw();return false};
window.shBulk=f=>{const r=addNames(String(fv(f).t||'').split('\n'));toast('سُجّل '+r.n+' اسماً'+(r.dup?' · تُجوهل '+r.dup+' مكرراً':''));shDraw();return false};
window.shDel=id=>{const i=S.shortReg.findIndex(r=>r.id==id);if(i<0||certOf(S.shortReg[i]))return;S.shortReg.splice(i,1);save();sb&&sbAdmin&&sb.from('short_regs').delete().eq('id',id).then(()=>{});shDraw()};
window.shIssue=id=>{const r=S.shortReg.find(x=>x.id==id),p=r&&S.programs.find(x=>x.id==r.prog);if(!r||!isShort(p)||!reg(r.prog,r.name)){toast(NOREG);return null}
 let c=certOf(r);if(c)return c;const rec=v51Serial(0,'part');c={type:'part',rec,sid:'',name:r.name,prog:p.id,hours:p.hours,from:p.from,to:p.to,grade:'',shreg:r.id,date:today()};S.certs.push(c);save();toast('صدرت الشهادة برقم '+rec);shDraw();return c};
window.shIssueAll=()=>{let n=0;S.shortReg.filter(r=>r.prog==shP&&!certOf(r)).forEach(r=>{const p=S.programs.find(x=>x.id==r.prog);if(isShort(p)&&reg(r.prog,r.name)){const rec=v51Serial(0,'part');S.certs.push({type:'part',rec,sid:'',name:r.name,prog:p.id,hours:p.hours,from:p.from,to:p.to,grade:'',shreg:r.id,date:today()});n++}});save();toast('صدرت '+n+' شهادة');shDraw()};
window.shView=id=>{const r=S.shortReg.find(x=>x.id==id),c=r&&certOf(r);if(!c)return;if(!reg(r.prog,r.name)){toast(NOREG);return}show(certHTML(c),c.rec)};
GOH.post.push(()=>{if(!me||me.r!='admin')return;const t=document.querySelector('#app .tabs');if(!t)return;
 if(!t.querySelector('[data-sh]')){const b=document.createElement('button');b.dataset.sh=1;b.className='btn '+(tab=='sh'?'':'s');b.textContent='الدورات والورش';b.onclick=async()=>{tab='sh';flash='';await shSync();go()};t.appendChild(b)}
 if(tab=='sh'){t.querySelectorAll('.btn').forEach(x=>{if(!x.dataset.sh&&x.className.indexOf('s')<0)x.className='btn s'});shDraw()}});
go();
})();

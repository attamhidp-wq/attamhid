
/* ===== v5: وثيقة التخرج · السجل الأكاديمي المقيَّد · الوضع الداكن/الفاتح ===== */
(function(){try{
const E=x=>esc(x==null?'':x),AR='معهد التمهيد';
const f2s=x=>x==null||isNaN(x)?'—':(+x).toFixed(2);
const semOf=l=>{try{return calGet(l)}catch(e){return{name:(rcfg().sem||{})[l]||('الفصل الدراسي '+(l%2?'الأول':'الثاني')),year:'السنة الدراسية '+(l<3?'الأولى':'الثانية')}}};
const ratingOf=gl=>gl?String(gl).replace(/\s*مرتفع$/,''):'—';

/* ---------- الوضع الداكن / الفاتح ---------- */
const curTheme=()=>document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
window.themeBtn=function(){const d=curTheme()==='dark',en=LG==='en',
 lab=d?(en?'Switch to light mode':'التبديل إلى الوضع الفاتح'):(en?'Switch to dark mode':'التبديل إلى الوضع الداكن'),
 ic=d?'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>'
  :'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" fill="currentColor"/></svg>';
 return `<a role="button" tabindex="0" class="thm" data-noi18n="1" onclick="toggleTheme()" onkeydown="if(event.key=='Enter'||event.key==' '){event.preventDefault();toggleTheme()}" aria-label="${lab}" title="${lab}" aria-pressed="${d}">${ic}<span class="thmt">${d?(en?'Light':'فاتح'):(en?'Dark':'داكن')}</span></a>`};
window.toggleTheme=function(){const n=curTheme()==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('tth',n)}catch(e){}
 const o=document.querySelector('#nav .thm');if(o)o.outerHTML=themeBtn();
 try{const m=document.querySelector('meta[name=theme-color]');if(m)m.content=n=='dark'?'#0d1526':'#12306b'}catch(e){}};
try{matchMedia('(prefers-color-scheme:dark)').addEventListener('change',e=>{let s=null;try{s=localStorage.getItem('tth')}catch(x){}if(s!='dark'&&s!='light'){document.documentElement.setAttribute('data-theme',e.matches?'dark':'light');const o=document.querySelector('#nav .thm');if(o)o.outerHTML=themeBtn()}})}catch(e){}

/* ---------- السجل الأكاديمي: الحقول المحددة حصراً ---------- */
window.tmTranscript=function(o){
 const s=o.s,lv=(o.levels||[]).filter(v=>!v.skip&&v.rows&&v.rows.length);
 let cH=0,cQ=0,last=null;
 const blocks=lv.map(v=>{const rows=v.rows.map(c=>({...c,fin:!!c.fin}));
  rows.filter(c=>c.fin&&c.pts!=null).forEach(c=>{cH+=c.hrs;cQ+=c.pts*c.hrs});
  const ev=rows.filter(c=>c.fin&&c.pts!=null),eh=ev.reduce((a,c)=>a+c.hrs,0),eq=ev.reduce((a,c)=>a+c.pts*c.hrs,0);
  const b={v,rows,gpa:v.gpa!=null?v.gpa:(eh?eq/eh:null),cum:cH?cQ/cH:null};last=b;return b});
 if(last&&o.k&&o.k.gpa!=null)last.cum=o.k.gpa;
 const info=`<table class="inf"><tr><td><b>الاسم :</b> ${E(s.name)}</td><td><b>الرقم الأكاديمي :</b> ${E(s.id)}</td></tr><tr><td><b>الجنسية :</b> ${E(s.nat||'—')}</td><td><b>رقم الهوية / الجواز :</b> ${E(s.pid||'—')}</td></tr><tr><td colspan="2"><b>البرنامج :</b> ${E((P(DIP)||{}).name||'')}</td></tr></table>`;
 let h=`<div class="bis">بسم الله الرحمن الرحيم</div>`+info;
 if(!blocks.length)h+='<p class="note">لا توجد مقررات مسجَّلة بعد.</p>';
 blocks.forEach(b=>{const sm=(window.semOf48?semOf48(s,b.v.l):semOf(b.v.l));
  const th='<tr><th style="width:10%">رمز المقرر</th><th style="width:30%">اسم المقرر</th><th style="width:8%">الدرجة</th><th style="width:11%">الساعة المعتمدة</th><th style="width:8%">الوحدة</th><th style="width:10%">المعدل من 5</th><th style="width:11%">التقدير</th><th style="width:12%">الحالة</th></tr>';
  const tr=b.rows.map(c=>`<tr><td>${E(c.code||'—')}</td><td class="n">${E(c.name)}</td><td>${c.fin&&c.score!=null?E(c.score):'—'}</td><td>${c.hrs}</td><td>${c.hrs}</td><td>${c.fin&&c.pts!=null?f2s(c.pts):'—'}</td><td>${c.fin?E(ratingOf(c.gl)):'—'}</td><td>${c.fin?(c.pass?'مجتاز':'غير مجتاز'):'—'}</td></tr>`).join('');
  h+=`<h3 class="sem">الفصل الدراسي: ${E(sm.name)} — العام: ${E(sm.year)}</h3><table class="trn">${th}${tr}</table>`;
  h+=`<table class="trn sm"><tr><th>المعدل الفصلي</th><th>المعدل التراكمي</th></tr><tr><td>${f2s(b.gpa)}</td><td>${f2s(b.cum)}</td></tr></table>`});
 h+='<div class="end">نهاية السجل الأكاديمي</div>';
 return window.frame4(trNo67(o.id),(o.R&&o.R.title)||'السجل الأكاديمي','',h,new Date().toISOString().slice(0,10),'record')};

/* تحديث السجل المفتوح فور اعتماد/نشر النتائج */
let recOpen=null;
const snap=id=>{const s=S.students.find(x=>x.id==id);return s?JSON.stringify(Object.entries(s.gr||{}).map(([k,g])=>[k,g.rel,g.score,g.pts,g.ok,g.fin])):''};
const _seeRec=window.seeRec;
window.seeRec=function(id){recOpen={id,snap:snap(id)};return _seeRec.apply(this,arguments)};
const modOpen=()=>{const m=document.getElementById('mod');return m&&m.style.display==='block'};
const refreshRec=()=>{if(!recOpen)return;if(!modOpen()){recOpen=null;return}const n=snap(recOpen.id);if(n!==recOpen.snap){const id=recOpen.id;_seeRec(id);recOpen={id,snap:n}}};
const _save=window.save;
try{const sv=save;save=function(){const r=sv.apply(this,arguments);try{refreshRec()}catch(e){}return r}}catch(e){}
setInterval(async()=>{try{if(!recOpen||!modOpen())return;if(typeof sb!=='undefined'&&sb&&me&&me.r=='student'&&typeof sbUserPull=='function'){const keep=me;await sbUserPull('student',me.id);me=keep}refreshRec()}catch(e){}},15000);

/* ---------- وثيقة التخرج: الدبلوم العام (عربية فقط) ---------- */
CT.dgrad=['وثيقة تخرج','Graduation Certificate'];ACC.dgrad='#7a1f3d';
const GRAD_DUR='مدة البرنامج: 80 ساعة معتمدة - 4 فصول دراسية';
window.gradElig=function(s){
 if(!s)return{ok:0,why:'الطالب غير موجود'};
 if(+s.prog!==DIP)return{ok:0,why:'غير مسجَّل رسمياً في برنامج الدبلوم العام'};
 if(s.status!=='متخرج')return{ok:0,why:'لم تُعتمد حالة التخرج رسمياً من لوحة الإدارة'};
 const l0=s.lvl||1,miss=crs().filter(c=>c.term>=l0).filter(c=>{if(!(s.reg||[]).includes(c.id))return true;const g=(s.gr||{})[c.id];return!(g&&g.fin&&g.ok&&g.rel)});
 if(miss.length)return{ok:0,why:'لم تُستكمل متطلبات البرنامج الأكاديمية ('+miss.length+' مقرراً غير مجتاز أو غير منشور)'};
 if(S.certs.some(c=>c.type==='dgrad'&&c.sid==s.id&&!c.revoked))return{ok:0,why:'صدرت له وثيقة تخرج سارية'};
 return{ok:1}};
const gradData=s=>{const l=Math.max(...crs().filter(c=>(s.reg||[]).includes(c.id)).map(c=>c.term),s.lvl||1),sm=(window.semOf48?semOf48(s,l):semOf(l)),k=calc(s,0,1);
 const ds=Object.values(s.gr||{}).map(g=>g.relDate||g.date||'').filter(Boolean).sort();
 return{gpa:f2s(k.gpa),gterm:sm.name,gyear:sm.year,gdate:s.gradDate||ds[ds.length-1]||today()}};
window.gradBox=function(){
 const L=S.students.filter(s=>+s.prog===DIP),ok=[],no=[];L.forEach(s=>{const r=gradElig(s);(r.ok?ok:no).push([s,r])});
 return `<div class="box" style="margin-bottom:16px"><h3>إصدار وثيقة التخرج — الدبلوم العام</h3><p class="mu">وثيقة مستقلة تصدر بالعربية فقط، ولا تصدر إلا لطالب مسجَّل رسمياً في الدبلوم العام أكمل متطلبات البرنامج واعتُمدت حالة تخرجه (متخرج). تُسحب بيانات الطالب والمعدل التراكمي والفصل والعام وتاريخ التخرج آلياً من سجله، ويُدخل الحقلان أدناه يدوياً فقط.</p>
 <form onsubmit="return issueGrad(this)"><label>الطالب (المؤهَّلون للتخرج فقط)<select name="sid" required><option value="">— اختر الطالب —</option>${ok.map(([s])=>`<option value="${E(s.id)}">${E(s.name)} (${E(s.id)})</option>`).join('')}</select></label>
 <label>رقم قرار مجلس المعهد<input name="boardNo" required></label><label>رقم جلسة إدارة المعهد<input name="sessNo" required></label>
 <button class="btn">اعتماد وإصدار وثيقة التخرج</button></form>
 ${no.length?`<details style="margin-top:10px"><summary>طلاب الدبلوم غير المؤهَّلين حالياً (${no.length})</summary>${no.map(([s,r])=>`<div class="mu" style="padding:3px 0"><bdi>${E(LG==='en'&&s.nameEn?s.nameEn:s.name)}</bdi> (${E(s.id)}) — <span>${E(r.why)}</span></div>`).join('')}</details>`:''}</div>`};
window.issueGrad=function(f){const v=fv(f),s=S.students.find(x=>x.id==v.sid),r=gradElig(s);
 if(!r.ok){toast('لا يمكن إصدار وثيقة التخرج: '+r.why);return false}
 if(!String(v.boardNo||'').trim()||!String(v.sessNo||'').trim()){toast('أدخل رقم قرار مجلس المعهد ورقم جلسة إدارة المعهد');return false}
 const d=gradData(s),rec=v51Serial(0,'dgrad');
 S.certs.push({type:'dgrad',lang:'ar',rec,sid:s.id,name:s.name,nat:s.nat||'',pid:s.pid||'',prog:DIP,gpa:d.gpa,gterm:d.gterm,gyear:d.gyear,gdate:d.gdate,boardNo:String(v.boardNo).trim(),sessNo:String(v.sessNo).trim(),date:today()});
 save();flash=`صدرت وثيقة التخرج برقم السجل <b>${rec}</b>`;go();return false};
const gradHTML=c=>{const st=S.students.find(x=>x.id==c.sid)||{},gv=String(st.gender||st.sex||c.gender||''),F=/أنثى|انثى|female|^f$/i.test(gv),M=/ذكر|male|^m$/i.test(gv),w=(m,f,n)=>F?f:M?m:n,bd=x=>`<bdi dir="ltr">${E(x)}</bdi>`;
 const inner=`<div class="bis">بسم الله الرحمن الرحيم</div><p class="hl">يشهد ${AR} بأن ${w('الطالب','الطالبة','الطالب/ة')}:</p><div class="nm4">${E(c.name)}</div>`+
 `<table class="kv"><tr><th>الجنسية</th><td>${E(c.nat||'—')}</td></tr><tr><th>رقم الهوية / الجواز</th><td>${bd(c.pid||'—')}</td></tr><tr><th>رقم السجل الأكاديمي</th><td>${bd(c.sid||'—')}</td></tr><tr><th>البرنامج</th><td>${E((P(c.prog)||P(DIP)||{}).name||'')}</td></tr><tr><th>المعدل التراكمي</th><td>${bd(c.gpa)} من ${bd('5.00')}</td></tr><tr><th>الفصل المتخرج به</th><td>${E(c.gterm)}</td></tr><tr><th>العام المتخرج به</th><td>${E(c.gyear)}</td></tr><tr><th>تاريخ التخرج</th><td>${bd(c.gdate)}</td></tr></table>`+
 `<p>${w('قد أتمّ','قد أتمّت','قد أتمّ/ت')} جميع متطلبات البرنامج الأكاديمية ${w('وتخرّج','وتخرّجت','وتخرّج/ت')} فيه، وذلك بعد اعتماد حالة التخرج رسمياً من إدارة المعهد.</p>`+
 `<p><b>${GRAD_DUR}</b></p>`+
 `<p>صدرت هذه الوثيقة بموجب قرار مجلس المعهد رقم ${bd(c.boardNo)}، وجلسة إدارة المعهد رقم ${bd(c.sessNo)}.</p>`+
 `<p>نسأل الله ل${w('ه','ها','ه/ا')} التوفيق والسداد، وتفضلوا بقبول فائق التحية والتقدير،،،</p>`;
 let h=window.frame4(c.rec,'وثيقة تخرج','',inner,c.date,'dgrad');
 if(c.revoked)h=h.replace(/<div class="tmp bl">/g,'<div class="tmp bl"><div class="rvk">ملغاة</div>').replace(/>سارية</g,'>ملغاة<');
 return h};
window.gradData=gradData;window.gradHTML=gradHTML;window.semOf=semOf;const _chG=certHTML;certHTML=function(c){if(c&&c.type==='dgrad')return gradHTML(c);return _chG.apply(this,arguments)};
/* حظر إصدار "grad" القديم أو "dgrad" من أي مسار عام */
const blockG=v=>v&&(v.type==='grad'||v.type==='dgrad');
const _is=issue;issue=function(f){const v=fv(f);if(blockG(v)){toast('تُصدر وثيقة التخرج من نموذج «إصدار وثيقة التخرج» فقط');return false}return _is.apply(this,arguments)};
const _ib=issueBatch;issueBatch=function(f){const v=fv(f);if(blockG(v)){toast('تُصدر وثيقة التخرج من نموذج «إصدار وثيقة التخرج» فقط');return false}return _ib.apply(this,arguments)};
}catch(e){console.error('v5',e)}
try{if(LG=='en')window.trn(document.body)}catch(e){}
go();
})();

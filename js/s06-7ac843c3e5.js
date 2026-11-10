
/* ===== وحدة البوابات: دخول موحد · تسجيل جديد · استعلام الطلب · خدمات الطالب · الشراكات ===== */
(()=>{
const A=x=>esc(x==null?'':x),today=()=>new Date().toISOString().slice(0,10),code=n=>Array.from({length:n},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('');
const head=t=>`<img src="${LOGO}" style="height:72px" alt="معهد التمهيد"><h2>${t}</h2>`;
const mdl=(t,b)=>{closeMdl();const d=document.createElement('div');d.id='mdl';d.className='xov';d.onclick=e=>{if(e.target==d)closeMdl()};d.innerHTML=`<div class="xpn"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3 style="margin:0">${t}</h3><button class="btn s" type="button" onclick="closeMdl()">✕ إغلاق</button></div><hr>${b}<div id="mout"></div></div>`;document.body.appendChild(d)};
window.closeMdl=()=>{const d=document.getElementById('mdl');d&&d.remove()};
const mo=h=>{const o=document.getElementById('mout');o&&(o.innerHTML=h)};window.mdl=mdl;window.mo=mo;

/* ---------- 1) الدخول الموحد ---------- */
V.login=()=>head('تسجيل الدخول')+`<div class="box narrow"><form onsubmit="return loginAny(this)"><label>اسم المستخدم / رقم السجل<input name="u" required autocomplete="username" dir="ltr"></label><label>كلمة المرور<input name="p" type="password" required autocomplete="current-password"></label><button class="btn">دخول</button></form><div id="out"></div><p class="mu"><a href="#/recover">نسيت اسم المستخدم أو كلمة المرور؟</a></p></div>`;
V.instructor=()=>me&&me.r=='faculty'?(location.hash='#/fp',V.fp()):V.login();
delete V.manage;
const bad=()=>out('<div class="msg er">بيانات الدخول غير صحيحة أو الحساب معطّل.</div>');
async function sbLoginAny(v){try{let em=v.u.includes('@')?v.u:null;if(!em){const {data}=await sb.rpc('login_email',{ident:v.u});em=data}if(!em){bad();return}
 const {data:au,error}=await sb.auth.signInWithPassword({email:em,password:v.p});if(error){bad();return}
 const {data:pf}=await sb.from('profiles').select('role,ref_id').eq('id',au.user.id).maybeSingle();if(!pf){await sb.auth.signOut();bad();return}
 if(pf.role=='admin'){await sbAdminLogin({u:em,p:v.p});return}
 await sbUserLogin({u:v.u,p:v.p,r:pf.role})}catch(e){console.error(e);bad()}}
window.loginAny=f=>{const v=fv(f);v.u=String(v.u||'').trim();if(sb){sbLoginAny(v);return false}
 const st=S.students.find(x=>(x.id==v.u||x.user==v.u||x.pid==v.u)&&x.pass==v.p);if(st){me={r:'student',id:st.id};location.hash='#/student';return false}
 const fa=S.faculty.find(x=>(x.id==v.u||x.user==v.u)&&x.pass==v.p&&x.active);if(fa){me={r:'faculty',id:fa.id};location.hash='#/fp';return false}
 bad();return false};

/* ---------- استرجاع اسم المستخدم / إعادة تعيين كلمة المرور ---------- */
V.recover=()=>head('استرجاع بيانات الدخول')+`<div class="box narrow"><p class="mu">أدخل الرقم الأكاديمي أو رقم الجواز والبريد المسجَّل لدى المعهد.</p><form onsubmit="return false"><label>الرقم الأكاديمي / رقم الجواز<input name="u" required dir="ltr"></label><label>البريد<input name="e" type="email" required dir="ltr"></label><button class="btn" type="button" onclick="recGo(this.form,'user')">استرجاع اسم المستخدم</button> <button class="btn s" type="button" onclick="recGo(this.form,'pass')">إعادة تعيين كلمة المرور</button></form><div id="out"></div><p class="mu"><a href="#/login">العودة إلى تسجيل الدخول</a></p></div>`;
window.recGo=async(f,mode)=>{const v=fv(f),u=String(v.u||'').trim(),e=String(v.e||'').trim().toLowerCase();if(!u||!e){out('<div class="msg er">أكمل الحقلين.</div>');return}
 const no='<div class="msg er">لا يوجد حساب مطابق للبيانات المدخلة.</div>';
 if(sb){try{const {data:em}=await sb.rpc('login_email',{ident:u});if(!em||String(em).toLowerCase()!=e){out(no);return}
  if(mode=='user'){out('<div class="msg">اسم المستخدم هو الرقم الأكاديمي أو رقم الجواز المسجَّل لدى المعهد، ويمكنك الدخول به.</div>');return}
  const {error}=await sb.auth.resetPasswordForEmail(em,{redirectTo:(window.V51&&V51.qrBase64?V51.qrBase64():SITE_URL)});out(error?'<div class="msg er">تعذّر إرسال رابط إعادة التعيين، تواصل مع الإدارة.</div>':'<div class="msg">أُرسل رابط إعادة تعيين كلمة المرور إلى بريدك.</div>')}catch(x){console.error(x);out(no)}return}
 const o=[...S.students,...S.faculty].find(x=>(x.id==u||x.pid==u||x.user==u)&&String(x.email||'').toLowerCase()==e);if(!o){out(no);return}
 if(mode=='user'){out(`<div class="msg">الرقم الأكاديمي / رقم السجل: <b dir="ltr">${A(o.id)}</b>${o.user?'<br>اسم المستخدم: <b dir="ltr">'+A(o.user)+'</b>':''}${o.pid?'<br>رقم الجواز: <b dir="ltr">'+A(o.pid)+'</b>':''}</div>`);return}
 const p=pw();o.pass=p;save();try{typeof notify=='function'&&notify(o.email,'إعادة تعيين كلمة المرور',['السلام عليكم '+o.name,'كلمة المرور المؤقتة الجديدة: '+p])}catch(x){}
 out(`<div class="msg">كلمة المرور المؤقتة الجديدة: <b dir="ltr">${p}</b><br>غيّرها من بوابتك بعد الدخول.</div>`)};

/* ---------- 2) تسجيل طالب جديد ---------- */
V.register=()=>head('تسجيل طالب جديد')+`<div class="box"><p class="mu">التسجيل متاح في برنامج «${A(DIPN)}» (سنتان · 4 فصول دراسية · 80 ساعة معتمدة). بعد إرسال النموذج يظهر لك رقم الطلب والرمز السري، ثم ترسل المستندات المطلوبة إلى بريد المعهد، ويصلك بريد رسمي عند كل تحديث في حالة طلبك.</p><form onsubmit="return reg(this)"><input type="hidden" name="secret" value="${code(6)}"><input type="hidden" name="exlang" value="ar"><input type="hidden" name="prog" value="${DIP}">
<label>الاسم الكامل<input name="name" required></label><label>الاسم بالإنجليزية<input name="nameEn" dir="ltr"></label><label>البريد<input name="email" type="email" required></label><label>رقم الجوال (واتساب)<input name="phone" required dir="ltr"></label>
<label>الجنس<select name="sex"><option>ذكر</option><option>أنثى</option></select></label><label>تاريخ الميلاد<input name="birth" type="date" required></label><label>الجنسية<input name="nat" required></label><label>بلد الإقامة<input name="country" required></label>
<label>رقم الهوية أو الجواز<input name="pid" required dir="ltr"></label><label>اللغة الأم<input name="mother" required></label><label>المؤهل الدراسي<select name="edu"><option>ثانوية فما دون</option><option>دبلوم</option><option>بكالوريوس</option><option>دراسات عليا</option></select></label>
<label>البرنامج<input value="${A(DIPN)}" readonly aria-readonly="true"></label>
<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" required style="width:auto">${B('أوافق على ','I agree to the ')}<a href="#/privacy">${B('سياسة الخصوصية','Privacy Policy')}</a>${B(' و',' and ')}<a href="#/terms">${B('الشروط والأحكام','Terms of Use')}</a></label><button class="btn">إرسال الطلب</button></form><div id="out"></div></div>`;
const _vp=V.placement;V.placement=()=>{let h=_vp();const r=plReq();if(r&&plFresh==r.id&&r.secret)h=`<div class="msg"><b>احتفظ بالرمز السري لمراجعة طلبك:</b> <span dir="ltr" style="font:700 1.2rem monospace">${A(r.secret)}</span><br>تراجع حالة طلبك ونتيجتك لاحقاً من «مراجعة الطلب واستعلام الحالة» برقم الطلب <b dir="ltr">${A(r.id)}</b> وهذا الرمز.</div>`+h;return h};

/* ---------- 3) مراجعة الطلب واستعلام الحالة ---------- */
V.review=()=>head('مراجعة الطلب واستعلام الحالة')+`<div class="box narrow"><form onsubmit="return revGo(this)"><label>رقم الطلب / السجل<input name="n" required dir="ltr" placeholder="REQ-XXXXXXXX" autocomplete="off"></label><label>الرمز السري<input name="s" required dir="ltr" autocomplete="off"></label><button class="btn">استعلام</button></form><div id="out"></div></div>`;
V.track=V.review;
const revView=r=>{const p=typeof plOf=='function'?plOf(r):null,L=r.sid?S.certs.filter(c=>c.type=='acc'&&c.sid==r.sid&&!c.revoked):[];
 const lv=p&&p.score!=null?`${p.score} / 100${p.lv&&typeof PLN!='undefined'?' — المستوى المقترح: '+A(PLN[p.lv]||p.lv):''}`:'لم يؤدِّ الاختبار بعد';
 return `<div class="msg"><b>بيانات الطالب</b><br>الاسم: ${A(r.name)}<br>رقم الطلب: <b dir="ltr">${A(r.id)}</b><br>البريد: <span dir="ltr">${A(r.email)}</span> · الجوال: <span dir="ltr">${A(r.phone)}</span><br>الجنسية: ${A(r.nat)}<br>البرنامج: ${A(DIPN)}</div>
<div class="msg"><b>حالة القبول:</b> <span class="tag ${r.status=='مقبول'?'ok':r.status=='مرفوض'?'er':''}">${A(r.admRes||r.status)}</span>${r.rank?'<br>ترتيبك في المفاضلة: <b>'+A(r.rank)+'</b>':''}${r.admNote?'<br>'+A(r.admNote):''}${r.sid?'<br>الرقم الأكاديمي: <b dir="ltr">'+A(r.sid)+'</b> (بيانات الدخول أُرسلت إليك من الإدارة)':''}</div>
<div class="msg"><b>نتيجة اختبار تحديد المستوى:</b> ${lv}</div>
<div class="msg"><b>خطاب القبول:</b> ${L.length?L.map(c=>`<button class="btn" type="button" onclick="revLetter('${A(c.rec)}')">عرض خطاب القبول ${A(c.rec)}</button>`).join(' '):(r.status=='مقبول'?'قيد الإصدار من الإدارة':'يصدر بعد قبول الطلب')}</div>`};
window.revLetter=rec=>{const c=S.certs.find(x=>x.rec==rec);c&&show(certHTML(c),'letter-'+rec)};
window.revGo=f=>{const v=fv(f),n=String(v.n||'').trim().toUpperCase(),s=String(v.s||'').trim().toUpperCase();
 const r=S.requests.find(x=>String(x.id).toUpperCase()==n);
 if(r){if(String(r.secret||'').toUpperCase()==s)out(revView(r));else out('<div class="msg er">الرمز السري غير صحيح.</div>');return false}
 if(sb){(async()=>{try{let d=null;const a=await sb.rpc('track_request_secure',{rid:n,sec:s});if(!a.error&&a.data)d=a.data;
  if(d&&d.status){out(revView({...d,id:n,name:d.name||'',email:d.email||'',phone:d.phone||'',nat:d.nat||''}));return}
  const b=await sb.rpc('track_request',{rid:n});if(b.data&&b.data.status)out(`<div class="msg">حالة الطلب: <b>${A(b.data.status)}</b>${b.data.sid?'<br>الرقم الأكاديمي: <b dir="ltr">'+A(b.data.sid)+'</b>':''}</div>`);else out('<div class="msg er">لا يوجد طلب بهذه البيانات.</div>')}catch(e){console.error(e);out('<div class="msg er">تعذّر الاستعلام.</div>')}})();return false}
 out('<div class="msg er">لا يوجد طلب بهذه البيانات.</div>');return false};

/* ---------- خدمات الطالب الذاتية ---------- */
const _vs=V.student;V.student=()=>{const h=_vs();if(!me||me.r!='student')return h;return h.replace(/(<button class="btn s" onclick="seeRec\('[^']*'\)">[^<]*<\/button>)/,`$1 <button class="btn s" onclick="stProfile()">تعديل الملف الشخصي</button> <button class="btn s" onclick="stPass()">تغيير كلمة المرور</button>`)};
window.stProfile=()=>{const s=S.students.find(x=>x.id==me.id);if(!s)return;mdl('تعديل الملف الشخصي',`<form onsubmit="return stProfSave(this)"><label>البريد<input name="email" type="email" value="${A(s.email)}" required dir="ltr"></label><label>رقم الجوال<input name="phone" value="${A(s.phone)}" required dir="ltr"></label><label>الجنسية<input name="nat" value="${A(s.nat)}" required></label><button class="btn">حفظ</button></form>`)};
window.stProfSave=f=>{const s=S.students.find(x=>x.id==me.id),v=fv(f);if(!s)return false;s.email=v.email;s.phone=v.phone;s.nat=v.nat;save();closeMdl();toast('حُفظ الملف الشخصي.');go();return false};
window.stPass=()=>mdl('تغيير كلمة المرور',`<form onsubmit="return stPassSave(this)"><label>كلمة المرور الحالية<input name="o" type="password" required autocomplete="current-password"></label><label>كلمة المرور الجديدة (6 أحرف فأكثر)<input name="n" type="password" minlength="6" required autocomplete="new-password"></label><button class="btn">تغيير</button></form>`);
window.stPassSave=f=>{const v=fv(f);if(sb&&sbUser){(async()=>{try{const {data:{session}}=await sb.auth.getSession(),em=session&&session.user&&session.user.email;const a=await sb.auth.signInWithPassword({email:em,password:v.o});if(a.error){mo('<div class="msg er">كلمة المرور الحالية غير صحيحة.</div>');return}const b=await sb.auth.updateUser({password:v.n});mo(b.error?'<div class="msg er">تعذّر التغيير.</div>':'<div class="msg">تم تغيير كلمة المرور.</div>')}catch(e){console.error(e);mo('<div class="msg er">تعذّر التغيير.</div>')}})();return false}
 const s=S.students.find(x=>x.id==me.id);if(!s||s.pass!=v.o){mo('<div class="msg er">كلمة المرور الحالية غير صحيحة.</div>');return false}s.pass=v.n;save();mo('<div class="msg">تم تغيير كلمة المرور.</div>');return false};

/* ---------- 4) الاتفاقيات والمعاهدات والشراكات ---------- */
const PST=['جديد','قيد الدراسة','قيد التفاوض','معتمدة','موقّعة','مرفوضة'],PKD=['جامعة','معهد / مدرسة','مؤسسة خيرية / وقف','جهة حكومية','شركة / مؤسسة','أخرى'];
S.partners=S.partners||[];
const thread=p=>(p.thread||[]).map(m=>`<div class="bub ${m.f=='admin'?'ad':'og'}"><small>${m.f=='admin'?'إدارة المعهد':'الجهة'} · ${A(m.d)}</small><div>${A(m.t).replace(/\n/g,'<br>')}</div></div>`).join('')||'<p class="mu">لا توجد رسائل بعد.</p>';
V.partners=()=>head('الاتفاقيات والمعاهدات والشراكات')+`<div class="box"><p class="mu">تستقبل إدارة المعهد طلبات الجهات الراغبة في التعاون الأكاديمي والعلمي. عبّئ النموذج وستصلك رقم متابعة ورمز سري لمتابعة الطلب والحوار مع الإدارة.</p><form onsubmit="return ptSubmit(this)"><label>اسم الجهة<input name="org" required></label><label>نوع الجهة<select name="kind">${PKD.map(x=>`<option>${x}</option>`).join('')}</select></label><label>الشخص المسؤول<input name="person" required></label><label>البريد<input name="email" type="email" required dir="ltr"></label><label>الجوال<input name="phone" required dir="ltr"></label><label>الدولة<input name="country" required></label><label>موضوع الطلب<input name="subject" required></label><label style="grid-column:1/-1">تفاصيل العرض أو المقترح<textarea name="offer" rows="5" required></textarea></label><button class="btn">إرسال الطلب</button></form><div id="out"></div></div>
<h3>متابعة طلب قائم</h3><div class="box narrow"><form onsubmit="return ptTrack(this)"><label>رقم المتابعة<input name="n" required dir="ltr" placeholder="PRT-XXXXXX"></label><label>الرمز السري<input name="s" required dir="ltr"></label><button class="btn">متابعة</button></form><div id="ptv"></div></div>`;
const ptSave=()=>{try{save()}catch(e){}};
window.ptSubmit=f=>{const v=fv(f),p={id:'PRT-'+code(6),secret:code(6),...v,status:'جديد',date:today(),thread:[{f:'org',t:v.offer,d:today()}]};
 const done=()=>out(`<div class="msg">تم استلام طلبك. رقم المتابعة: <b dir="ltr">${p.id}</b> · الرمز السري: <b dir="ltr">${p.secret}</b><br>احتفظ بهما لمتابعة الطلب والرد على الإدارة.</div>`);
 if(sb){sb.rpc('partner_submit',{p}).then(({error})=>{if(error){console.error(error.message);S.partners.push(p);ptSave();toast('حُفظ الطلب محلياً لتعذّر إرساله إلى الخادم.')}done()});f.reset();return false}
 S.partners.push(p);ptSave();done();f.reset();return false};
const ptShow=p=>`<div class="msg"><b>${A(p.subject)}</b> — ${A(p.org)}<br>الحالة: <span class="tag ${p.status=='معتمدة'||p.status=='موقّعة'?'ok':p.status=='مرفوضة'?'er':''}">${A(p.status)}</span></div><div id="thr">${thread(p)}</div><form onsubmit="return ptReply(this,'${A(p.id)}','${A(p.secret)}')"><label>ردّك<textarea name="t" rows="3" required></textarea></label><button class="btn">إرسال</button></form>`;
window.ptTrack=f=>{const v=fv(f),n=String(v.n||'').trim().toUpperCase(),s=String(v.s||'').trim().toUpperCase(),o=h=>{const e=document.getElementById('ptv');e&&(e.innerHTML=h)};
 const p=S.partners.find(x=>x.id==n&&String(x.secret).toUpperCase()==s);if(p){o(ptShow(p));return false}
 if(sb){sb.rpc('partner_track',{pid:n,sec:s}).then(({data,error})=>{data&&!error?o(ptShow(data)):o('<div class="msg er">لا يوجد طلب بهذه البيانات.</div>')});return false}
 o('<div class="msg er">لا يوجد طلب بهذه البيانات.</div>');return false};
window.ptReply=(f,id,sec)=>{const t=String(fv(f).t||'').trim();if(!t)return false;const p=S.partners.find(x=>x.id==id);
 const upd=m=>{const e=document.getElementById('thr');e&&e.insertAdjacentHTML('beforeend',thread({thread:[m]}));f.reset()};
 const m={f:'org',t,d:today()};
 if(p){p.thread=(p.thread||[]).concat(m);ptSave();upd(m);return false}
 if(sb){sb.rpc('partner_reply',{pid:id,sec,msg:m}).then(({error})=>{error?toast('تعذّر إرسال الرد.'):upd(m)})}return false};
/* لوحة الإدارة: تبويب الشراكات (يُحقن بعد رسم لوحة الإدارة) */
let ptSel=null;
const ptSync=async()=>{if(!sb||!sbAdmin)return;try{const {data}=await sb.from('partners').select('id,data');if(data){data.forEach(r=>{const o=r.data||r,i=S.partners.findIndex(x=>x.id==o.id);i<0?S.partners.push(o):S.partners[i]=o});}}catch(e){console.error(e)}};
const ptAdmin=()=>{const p=S.partners.find(x=>x.id==ptSel);
 if(p)return `<p><button class="btn s" onclick="ptOpen(null)">← القائمة</button></p><h3>${A(p.subject)} — ${A(p.org)}</h3><p class="mu">${A(p.id)} · ${A(p.kind)} · ${A(p.person)} · <span dir="ltr">${A(p.email)}</span> · <span dir="ltr">${A(p.phone)}</span> · ${A(p.country)} · ${A(p.date)}</p><label>حالة الشراكة<select onchange="ptStat('${A(p.id)}',this.value)">${PST.map(x=>`<option${x==p.status?' selected':''}>${x}</option>`).join('')}</select></label><div id="thr">${thread(p)}</div><form onsubmit="return ptAdminReply(this,'${A(p.id)}')"><label>رد الإدارة<textarea name="t" rows="3" required></textarea></label><button class="btn">إرسال الرد</button></form>`;
 return `<h3>طلبات الاتفاقيات والشراكات</h3>`+tbl(['الرقم','الجهة','النوع','الموضوع','الحالة','التاريخ',''],[...S.partners].reverse().map(p=>`<tr><td>${A(p.id)}</td><td>${A(p.org)}</td><td>${A(p.kind)}</td><td>${A(p.subject)}</td><td><span class="tag ${p.status=='معتمدة'||p.status=='موقّعة'?'ok':p.status=='مرفوضة'?'er':''}">${A(p.status)}</span></td><td>${A(p.date)}</td><td><button class="btn" onclick="ptOpen('${A(p.id)}')">فتح</button></td></tr>`))};
const ptDraw=()=>{const t=document.querySelector('#app .tabs');if(!t||tab!='pt')return;const b=t.nextElementSibling;b&&b.classList.contains('box')&&(b.innerHTML=ptAdmin())};
window.ptOpen=id=>{ptSel=id;ptDraw()};
const ptPush=p=>{ptSave();if(sb&&sbAdmin)sb.from('partners').upsert({id:p.id,data:p}).then(({error})=>error&&toast('تعذّر حفظ التحديث على الخادم.'))};
window.ptStat=(id,v)=>{const p=S.partners.find(x=>x.id==id);if(p){p.status=v;ptPush(p);toast('حُدّثت حالة الشراكة.')}};
window.ptAdminReply=(f,id)=>{const p=S.partners.find(x=>x.id==id),t=String(fv(f).t||'').trim();if(!p||!t)return false;p.thread=(p.thread||[]).concat({f:'admin',t,d:today()});if(p.status=='جديد')p.status='قيد الدراسة';ptPush(p);ptDraw();return false};
GOH.post.push(()=>{if(!me||me.r!='admin')return;const t=document.querySelector('#app .tabs');if(!t)return;
 if(!t.querySelector('[data-pt]')){const b=document.createElement('button');b.dataset.pt=1;b.className='btn '+(tab=='pt'?'':'s');b.textContent='الشراكات'+(S.partners.some(p=>p.status=='جديد')?' ●':'');b.onclick=async()=>{tab='pt';ptSel=null;flash='';await ptSync();go()};t.appendChild(b)}
 if(tab=='pt'){t.querySelectorAll('.btn').forEach(x=>{if(!x.dataset.pt&&x.className.indexOf('s')<0)x.className='btn s'});ptDraw()}});
go();
})();

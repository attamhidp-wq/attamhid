
/* ===== محرك الخطابات (مطابق للنموذج المعتمد) ===== */
(()=>{
const d2=n=>String(n).padStart(2,'0'),ds=iso=>{const d=iso&&/^\d{4}-\d{2}-\d{2}/.test(iso)?new Date(iso+'T12:00:00'):new Date();return d.getFullYear()+'-'+d2(d.getMonth()+1)+'-'+d2(d.getDate())};
const mbox=()=>{const m=document.createElement('div');m.className='tmw';m.style.cssText='position:fixed;left:-3000px;top:0';m.innerHTML='<div class="bl"><div class="bd" style="position:static;width:678px"></div></div>';document.body.appendChild(m);const b=m.querySelector('.bd');return{meas:h=>{b.innerHTML=h;return b.offsetHeight},done:()=>m.remove()}};
const TPAL={tisa:['#0d4468','#102a43','#8a6a2f'],blue:['#13306b','#0c1f4a','#b8923a'],green:['#0f6b5a','#06352c','#b8923a'],maroon:['#7a1f3d','#3d0f1f','#c9a24b'],gray:['#3f4756','#1b2028','#c2a566'],royal:['#1b2a4e','#0e1730','#b8923a'],teal:['#0e6b78','#07343b','#b8923a']},TFNT={amiri:'Amiri',naskh:'Noto Naskh Arabic',cairo:'Cairo',ruqaa:'Aref Ruqaa',taj:'Tajawal',sch:'Scheherazade New',kufi:'Reem Kufi',plex:'IBM Plex Sans Arabic',almarai:'Almarai',markazi:'Markazi Text'};
const thm=c=>{c=c||{};const p=TPAL[c.color],f=TFNT[c.font];let st='';if(p)st+=`--ac:${p[0]};--ac2:${p[1]};--gd:${p[2]};`;if(f){st+=`--fa:'${f}',Amiri,serif;--fh:'${f}',Amiri,serif;`;try{document.fonts.load('700 24px "'+f+'"','ابجد')}catch(e){}}return st?` style="${st}"`:''};
window.tmTheme=(h,c)=>h.replace(/^(\s*<div class="tmw")(?: style="[^"]*")?/,'$1'+thm(c));
let HDR=IMG108('hdr-v121a.jpg'),FTR=IMG108('ftr-4dcf5aa4.jpg');IMGH108('hdr-v121a.jpg',function(v){HDR=v});IMGH108('ftr-4dcf5aa4.jpg',function(v){FTR=v});
const CKX={public:[758,60],external:[755,83],internal:[757,106],secret:[757,106]};
function tmDoc(c,U){const cls=CKX[c.cls]?c.cls:'external',ref=c.rec,Cn=830,Cl=685,pages=[[]];let h0=0;
U.forEach(it=>{if(it.brk&&pages[pages.length-1].length){pages.push([]);h0=0}if(h0+it.ht>Cn&&pages[pages.length-1].length){pages.push([]);h0=0}pages[pages.length-1].push(it);h0+=it.ht});
for(let g=0;g<50;g++){const L=pages[pages.length-1],sh=L.reduce((a,x)=>a+x.ht,0);if(sh<=Cl)break;if(L.length>1){pages.push([L.pop()]);continue}pages.push([]);break}
const n=pages.length,k=CKX[cls],tl=esc(sgv('signerTitle')||'رئيس المعهد'),tt=/^رئيس المعهد$/.test(tl)?'رئيس معهد التمهيد':tl;
return `<div class="tmw"${thm(c)}>`+pages.map((p,i)=>`<div class="tmp bl">`+(c.revoked?'<div class="rvk">ملغاة</div>':'')+`<img class="tmwm" src="${window.LOGOM||LOGO}" alt=""><img class="x-hd" src="${HDR}" alt=""><i class="x-rl x-rr"></i><i class="x-rl x-rf"></i>
<svg class="x-ck" style="left:${k[0]}px;top:${k[1]-7}px" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.5L5.5 11L12 3" fill="none" stroke="#0d4468" stroke-width="2"/></svg>
<div class="x-m1"><div dir="ltr" style="text-align:right">${esc(ref)}</div><div>${esc(c.ver||'1.0')}</div></div>
<div class="x-m2"><div><bdi dir="ltr">${esc(ds(c.date))}</bdi> م</div><div>${c.revoked?'ملغاة':'سارية'}</div></div>
<div class="bd">${p.map(x=>x.h).join('')}</div>`+(i==n-1?`<div class="x-sg"><span class="lb">التوقيع</span><img src="${SIG}" alt=""><div class="ln"></div><div>${esc(sgv('signer'))}</div><div>${tt}</div></div><img class="x-sl2" src="${SEAL}" alt="">`:'')+
`<img class="x-ft" src="${FTR}" alt=""><div class="x-nt">أي كشط أو تعديل يلغي الوثيقة</div>${n>1?`<div class="x-pn">صفحة ${i+1} من ${n}</div>`:''}<div class="x-qr"><img src="${qr(vlink(ref))}" alt=""></div></div>`).join('')+`</div>`}
function splitText(t,cx,meas){const mk=x=>`<div class="u${cx}">${esc(x)}</div>`,out=[];let h=mk(t),ht=meas(h);if(ht<=830){out.push({h,ht});return out}
const w=t.split(/\s+/);while(w.length){let lo=1,hi=w.length;while(lo<hi){const k=Math.ceil((lo+hi)/2);meas(mk(w.slice(0,k).join(' ')))<=830?lo=k:hi=k-1}const part=mk(w.splice(0,lo).join(' '));out.push({h:part,ht:meas(part)})}return out}
window.tmBlank=function(c){const mb=mbox(),U=[],push=(h)=>U.push({h,ht:mb.meas(h)});
try{if(c.title)push(`<div class="u"><h2>${esc(c.title)}</h2></div>`);if(c.titleEn&&c.lang=='bi')push(`<div class="u en" style="text-align:center">${esc(c.titleEn)}</div>`);if(c.nmShown&&c.name)push(`<div class="u nn">${esc(c.name)}</div>`);
String(c.text||'').split(/\n+/).filter(x=>x.trim()).forEach(x=>splitText(x,'',mb.meas).forEach(i=>U.push(i)));
if(c.lang=='bi'&&c.textEn)String(c.textEn).split(/\n+/).filter(x=>x.trim()).forEach(x=>splitText(x,' en',mb.meas).forEach(i=>U.push(i)))}finally{mb.done()}
return tmDoc(c,U)};
const kv=r=>`<table class="kv">${r.filter(x=>x[1]).map(x=>`<tr><th>${x[0]}</th><td>${x[1]}</td></tr>`).join('')}</table>`,bd=x=>x?`<bdi dir="ltr">${esc(x)}</bdi>`:'';
window.tmLetter=function(c){const t=c.type,st=S.students.find(x=>x.id==c.sid)||{},gv=String(c.gender||st.gender||st.sex||''),F=/أنثى|انثى|female|^f$/i.test(gv),M=/ذكر|male|^m$/i.test(gv),w=(m,f,n)=>F?f:M?m:n,
std=w('الطالب','الطالبة','الطالب/ة'),dsc=w('المبيّن بياناته','المبيّنة بياناتها','المبيّن/ة بياناته/ا'),h=w('ه','ها','ه/ا'),
n=esc(c.name),ne=esc(c.nameEn||c.name),pn=esc(P(c.prog).name),pe=esc(c.progEn||P(c.prog).name),AR='معهد التمهيد',
bi=c.lang=='bi'||(!c.lang&&t=='rec'&&!!c.nameEn),to=c.rec_to?`إلى: <b>${esc(c.rec_to)}</b>`:'إلى من يهمه الأمر،',toE=c.rec_to?`To: <b>${esc(c.rec_to)}</b>`:'To Whom It May Concern,',
hello='<p class="hl">السلام عليكم ورحمة الله وبركاته،</p>',tx=c.text?`<p>${esc(c.text)}</p>`:'',txE=c.textEn?`<p>${esc(c.textEn)}</p>`:'',A=[],E=[];
if(t=='acc'){A.push(`<p class="to">${to}</p>`,hello,`<p>تتشرف إدارة ${AR} بإفادتكم بأنه قد تم <b>قبول</b> ${std} ${dsc} أدناه في برنامج «<b>${pn}</b>»، وذلك بعد استيفاء ما يلزم من شروط القبول والتسجيل المعتمدة لدى المعهد:</p>`,`<div class="nm4">${n}</div>`,
kv([['الرقم الأكاديمي',esc(c.sid)],['البرنامج المقبول فيه',pn],['نمط الدراسة',esc(c.adm_mode)],['الدفعة / الفصل الدراسي',esc(c.adm_term)],['تاريخ بدء الدراسة',bd(c.from)],['رقم قرار القبول',esc(c.adm_no)],['الجنسية',esc(c.nat||st.nat)],['رقم الهوية / الجواز',esc(c.pid||st.pid)]]));
if(c.adm_cond)A.push(`<p><b>شروط القبول:</b> ${esc(c.adm_cond)}</p>`);A.push(tx,`<p>ويُعدّ هذا الخطاب إثباتاً لقبول${h} وقيد${h} في المعهد، وقد مُنح ل${h} بناءً على طلب${h} دون أدنى مسؤولية على المعهد تجاه أي جهة أخرى.</p>`,`<p>نسأل الله ل${h} التوفيق والسداد، وتفضلوا بقبول فائق التحية والتقدير،،،</p>`);
E.push(`<p>${toE}</p>`,`<p>At Tamhid Institute is pleased to confirm that the student named below has been admitted to the program “<b>${pe}</b>”, having met the admission and registration requirements approved by the Institute:</p>`,`<div class="nm4">${ne}</div>`,kv([['Student ID',esc(c.sid)],['Program',pe],['Study mode',esc(c.adm_mode)],['Intake / Term',esc(c.adm_term)],['Start date',bd(c.from)],['Decision No.',esc(c.adm_no)]]),txE,`<p>This letter constitutes official proof of admission and enrolment and is issued at the student’s request, without any liability on the Institute.</p>`,`<p>Yours sincerely,</p>`)}
else{const k=c.rec_kind||'علمية وسلوكية',sc=/علمية/.test(k),bh=/سلوكية/.test(k);
A.push(`<p class="to">${to}</p>`,hello,`<p>يشهد ${AR} بأن ${std} ${dsc} أدناه قد ${w('انتسب','انتسبت','انتسب/ت')} إلى المعهد في برنامج «<b>${pn}</b>»، وفق المسجَّل في سجلاته الأكاديمية:</p>`,`<div class="nm4">${n}</div>`,
kv([['الرقم الأكاديمي',esc(c.sid)],['البرنامج',pn],['مدة الانتساب',c.from||c.to?'من '+(bd(c.from)||'—')+' إلى '+(bd(c.to)||'—'):''],['المؤهل السابق',esc(c.prev)],['التقدير',esc(c.grade)]]));
if(sc)A.push(`<p>ويرى المعهد أنّ ${std} أهلٌ لمواصلة الدراسة أو التقديم لدى الجهات الأكاديمية، ويوصي ب${h} توصيةً علميةً بحسب ما ثبت في سجلاته.</p>`);
if(bh)A.push(`<p>كما عُرف عن${h} حسن السيرة والسلوك والتزام الأنظمة طوال فترة انتساب${h} إلى المعهد.</p>`);
A.push(tx,`<p>وقد أُعطيت هذه التوصية (${esc(k)}) بناءً على طلب${h}، دون أدنى مسؤولية على المعهد، ونسأل الله ل${h} التوفيق والسداد.</p>`,`<p>وتفضلوا بقبول فائق التحية والتقدير،،،</p>`);
E.push(`<p>${toE}</p>`,`<p>At Tamhid Institute hereby certifies that the student named below has been enrolled at the Institute in the program “<b>${pe}</b>”, as recorded in its academic transcripts:</p>`,`<div class="nm4">${ne}</div>`,kv([['Student ID',esc(c.sid)],['Program',pe],['Period',c.from||c.to?esc(c.from||'—')+' – '+esc(c.to||'—'):''],['Previous qualification',esc(c.prev)],['Grade',esc(c.grade)]]));
if(sc)E.push(`<p>The Institute considers the student suitable to pursue further study or to apply to academic institutions, in line with the academic transcripts.</p>`);
if(bh)E.push(`<p>The student is also known for good character and compliance with the Institute’s regulations throughout the period of enrolment.</p>`);
E.push(txE,`<p>This recommendation is issued at the student’s request, without any liability on the Institute. We wish the student every success.</p>`,`<p>Yours sincerely,</p>`)}
const mb=mbox(),U=[],push=x=>U.push({h:x,ht:mb.meas(x)});
try{push(`<div class="u"><h2>${CT[t][0]}</h2></div>`);if(bi)push(`<div class="lt en" style="text-align:center;color:#8a6a24;margin-top:-6px">${CT[t][1]}</div>`);
A.filter(Boolean).forEach(x=>push(`<div class="lt">${x}</div>`));
if(bi){push(`<div class="u"><h2 style="direction:ltr;font-family:'Cormorant Garamond',Georgia,serif">${CT[t][1]}</h2></div>`);U[U.length-1].brk=1;E.filter(Boolean).forEach(x=>push(`<div class="lt en">${x}</div>`))}}finally{mb.done()}
return tmDoc(c,U)};
function pushTable(tb,pre,push,mb){const rows=[...tb.querySelectorAll('tr')],hd=rows[0]&&[...rows[0].children].every(x=>x.tagName=='TH')&&rows[0].children.length>1?rows.shift():null,mk=(r,p)=>`<div class="lt">${p||''}<table class="${tb.className||''}">${hd?hd.outerHTML:''}${r.map(x=>x.outerHTML).join('')}</table></div>`;let cur=[],first=1;
const flush=()=>{if(!cur.length)return;push(mk(cur,first?pre:''));first=0;cur=[]};
rows.forEach(r=>{cur.push(r);if(mb.meas(mk(cur,first?pre:''))>560&&cur.length>1){cur.pop();flush();cur=[r]}});flush()}
function tmFromInner(c,t,en,inner){const mb=mbox(),U=[],push=x=>U.push({h:x,ht:mb.meas(x)});
try{if(t)push(`<div class="u"><h2>${t}</h2></div>`);if(en)push(`<div class="lt en" style="text-align:center;color:var(--gd)">${en}</div>`);
const w=document.createElement('div');w.innerHTML=inner;const kids=[...w.children];
kids.forEach((ch,i)=>{const tg=ch.tagName;if(tg=='H3'&&kids[i+1]&&kids[i+1].tagName=='TABLE'){ch._pre=ch.outerHTML;return}
if(tg=='TABLE'){pushTable(ch,(kids[i-1]&&kids[i-1]._pre)||'',push,mb);return}
if(ch.classList.contains('enb')){[...ch.children].forEach(e=>push(`<div class="lt en">${e.outerHTML}</div>`));return}
if(ch.classList.contains('orn4')){push('<div class="sepo"><i></i><b></b><i></i></div>');return}
push(`<div class="lt">${ch.outerHTML}</div>`)})}finally{mb.done()}
return tmDoc(c,U)}
window.frame4=function(rn,t,en,inner,d,type){return tmFromInner({rec:rn,date:d,cls:'external'},t,en,inner)};
const _at9=applyTheme;applyTheme=function(h,c){if(/^\s*<div class="tmw"/.test(h||''))return window.tmTheme(h,c);return _at9(h,c)};
const SYM={'ممتاز مرتفع':'أ+','ممتاز':'أ','جيد جداً مرتفع':'ب+','جيد جداً':'ب','جيد مرتفع':'ج+','جيد':'ج','مقبول مرتفع':'د+','مقبول':'د','راسب':'هـ'},f2t=x=>x==null?'—':(+x).toFixed(2),
LEG=[['أ+','95–100','ممتاز مرتفع'],['أ','90–94','ممتاز'],['ب+','85–89','جيد جداً مرتفع'],['ب','80–84','جيد جداً'],['ج+','75–79','جيد مرتفع'],['ج','70–74','جيد'],['د+','65–69','مقبول مرتفع'],['د','60–64','مقبول'],['هـ','أقل من 60','راسب']];
window.tmTranscript=function(o){const s=o.s,mb=mbox(),U=[],push=x=>U.push({h:x,ht:mb.meas(x)}),by=s.birth||s.by||'',l0=s.lvl||1,AR='معهد التمهيد';
let cR=0,cP=0,cPts=0,cEv=0,last=-1;const blocks=[];o.levels.forEach((v,i)=>{if(v.rows.length&&!v.skip)last=i});
o.levels.forEach((v,i)=>{const rows=v.rows.map(c=>({...c,pass:c.fin&&(c.pass!==undefined?c.pass:c.pts>0)})),R=rows.reduce((a,c)=>a+c.hrs,0),Pp=rows.filter(c=>c.pass).reduce((a,c)=>a+c.hrs,0),ev=rows.filter(c=>c.fin),pt=ev.reduce((a,c)=>a+c.pts*c.hrs,0),eh=ev.reduce((a,c)=>a+c.hrs,0);cR+=R;cP+=Pp;cPts+=pt;cEv+=eh;blocks.push({v,rows,R,P:Pp,gpa:v.gpa!=null?v.gpa:(eh?pt/eh:null),cum:{R:cR,P:cP,gpa:i==last&&o.k?o.k.gpa:(cEv?cPts/cEv:null)}})});
try{push('<div class="lt"><div class="bis">بسم الله الرحمن الرحيم</div></div>');push(`<div class="u"><h2>${esc((o.R&&o.R.title)||'سجل الطالب الأكاديمي')}</h2></div>`);
push(`<div class="lt"><table class="inf"><tr><td><b>الاسم :</b> ${esc(s.name)}</td><td><b>الرقم الأكاديمي :</b> ${esc(s.id)}</td></tr><tr><td><b>الجنسية :</b> ${esc(s.nat||'—')}</td><td>${by?`<b>سنة الميلاد :</b> ${esc(by)}م`:`<b>الحالة الدراسية :</b> ${esc(s.status||'منتظم')}`}</td></tr><tr><td><b>المعهد :</b> ${AR}</td><td><b>الدرجة :</b> دبلوم عام</td></tr><tr><td><b>التخصص :</b> اللغة العربية</td><td><b>البرنامج :</b> ${esc((P(DIP)||{}).name||'')}</td></tr></table></div>`);
if(l0>1||s.pl)push(`<div class="lt"><p style="border:1px solid #b8923a;padding:6px 12px;font-size:14px;line-height:1.7"><b>اختبار تحديد المستوى:</b> ${s.pl&&s.pl.score!=null?s.pl.score+' / 100':'—'} — <b>سبب التسكين:</b> ${esc((s.pl&&s.pl.reason)||'—')}</p></div>`);
blocks.forEach(b=>{const v=b.v,hd=`<div class="sem">- ${esc(v.hd)} - انتظام كامل - ${esc(v.lvn)} -</div>`;
if(v.skip||!b.rows.length){push(`<div class="lt">${hd}<p class="note">${v.skip?'معفى من هذا المستوى بموجب نتيجة اختبار تحديد المستوى.':'لا توجد مقررات مسجَّلة في هذا المستوى بعد.'}</p></div>`);return}
const th='<tr><th style="width:16%">رمز المقرر</th><th>اسم المقرر</th><th style="width:12%">الوحدات</th><th style="width:16%">التقدير</th></tr>',mk=(r,p)=>`<div class="lt">${p||''}<table class="trn">${th}${r.join('')}</table></div>`,tr=b.rows.map(c=>`<tr><td>${esc(c.code||'—')}</td><td class="n">${esc(c.name)}</td><td>${c.hrs}</td><td>${c.fin?(SYM[c.gl]||esc(c.gl)):'—'}</td></tr>`);
let cur=[],first=1;const flush=()=>{if(!cur.length)return;push(mk(cur,first?hd:''));first=0;cur=[]};
tr.forEach(r=>{cur.push(r);if(mb.meas(mk(cur,first?hd:''))>560&&cur.length>1){cur.pop();flush();cur=[r]}});flush();
push(`<div class="lt"><table class="trn sm"><tr><th style="width:18%">الوحدات</th><th>المسجلة</th><th>المجتازة</th><th>المكتسبة</th><th>المعدل</th></tr><tr><td>الفصلي</td><td>${b.R}</td><td>${b.P}</td><td>${b.P}</td><td>${f2t(b.gpa)}</td></tr><tr><td>التراكمي</td><td>${b.cum.R}</td><td>${b.cum.P}</td><td>${b.cum.P}</td><td>${f2t(b.cum.gpa)}</td></tr></table></div>`)});
push('<div class="lt"><div class="end">نهاية السجل الأكاديمي</div></div>');
push(`<div class="lt"><table class="trn sm lg"><tr><th>الرمز</th>${LEG.map(g=>`<th>${g[0]}</th>`).join('')}</tr><tr><td>النسبة</td>${LEG.map(g=>`<td>${g[1]}</td>`).join('')}</tr><tr><td>التقدير</td>${LEG.map(g=>`<td>${g[2]}</td>`).join('')}</tr></table><p class="note">* المعدل الفصلي والتراكمي على مقياس 5.00 وفق سلّم درجات جامعات المملكة العربية السعودية، ولا تُحتسب في المعدل المقررات غير المقيَّمة بعد.<br>* لا تُعدّ هذه الوثيقة معتمدة إلا بالختم والتوقيع المعتمدين.</p></div>`)}finally{mb.done()}
return tmDoc({rec:trNo67(o.id),date:new Date().toISOString().slice(0,10),cls:'external'},U)};
const _cl=certHTML;certHTML=function(c){if(c&&(c.type=='acc'||c.type=='rec')){try{const h=window.tmLetter(c);if(h)return h}catch(e){console.error(e)}}return _cl.apply(this,arguments)};
})();

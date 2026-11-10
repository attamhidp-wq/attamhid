
/* ===== قوالب رسمية: السجل الأكاديمي + شهادة التعريف (A4) ===== */
(()=>{
const AR='معهد التمهيد',EN='At Tamhid Institute for Islamic &amp; Language Studies';
const d2=n=>String(n).padStart(2,'0');
const dts=iso=>{const d=iso&&/^\d{4}-\d{2}-\d{2}/.test(iso)?new Date(iso+'T12:00:00'):new Date();
 let h='';try{const p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(d);const g=t=>(p.find(x=>x.type==t)||{}).value;h=`${d2(g('day'))}-${d2(g('month'))}-${g('year').replace(/\D/g,'')}`}catch(e){}
 return{g:`${d.getFullYear()}-${d2(d.getMonth()+1)}-${d2(d.getDate())}`,h}};
const hdr=(r,l,mini,gray)=>`<div class="hd${mini?' mini':''}${gray?' g':''}"><div class="r">${r}</div><div class="c"><img src="${LOGO}" alt=""></div>${l}</div>`;
const sigBlk=rn=>`<div class="sig"><div>التوقيع<img src="${SIG}" alt=""><div class="ln"></div>${esc(sgv('signer'))}<br><small>${esc(sgv('signerTitle'))}</small></div><div>الختم الرسمي<img src="${SEAL}" alt="" style="height:96px"></div><div class="qc"><img src="${qr(vlink(rn))}" alt=""><small>امسح الرمز للتحقق</small></div></div>`;

/* ---------- السجل الأكاديمي ---------- */
const gl5=g=>{if(g==null)return '';const r=(window.GSC5||[]).find(x=>g>=+x[2]-1e-9);return r?'<br><small>'+esc(r[3]||r[1])+'</small>':''};
window.tmTranscript=function(o){
 const s=o.s,f2=o.f2||(x=>x==null?'—':(+x).toFixed(2)),dt=dts(),by=s.birth||s.by||'';
 let cR=0,cP=0,cPts=0,cEv=0;const segs=[];let lastData=-1;
 o.levels.forEach((v,i)=>{if(v.rows.length&&!v.skip)lastData=i});
 const blocks=[];
 o.levels.forEach((v,i)=>{
  const rows=v.rows.map(c=>{const pass=c.fin&&(c.pass!==undefined?c.pass:c.pts>0);return{...c,pass,tp:c.fin?c.pts*c.hrs:null}});
  const R=rows.reduce((a,c)=>a+c.hrs,0),P=rows.filter(c=>c.pass).reduce((a,c)=>a+c.hrs,0),
   ev=rows.filter(c=>c.fin),pts=ev.reduce((a,c)=>a+c.tp,0),eh=ev.reduce((a,c)=>a+c.hrs,0);
  cR+=R;cP+=P;cPts+=pts;cEv+=eh;
  blocks.push({v,rows,R,P,pts,gpa:v.gpa!=null?v.gpa:(eh?pts/eh:null),cum:{R:cR,P:cP,pts:cPts,gpa:i==lastData&&o.k?o.k.gpa:(cEv?cPts/cEv:null)}});
 });
 const pages=[{h:'',u:0}],cap=()=>pages.length==1?600:820;
 const nxt=()=>pages.push({h:'',u:0});
 const th='<tr><th style="width:15%">رمز المقرر</th><th>اسم المقرر</th><th style="width:12%">الوحدات</th><th style="width:13%">النقاط</th><th style="width:14%">التقدير</th></tr>';
 blocks.forEach(b=>{
  const v=b.v,hd=`<div class="sem"><span>- ${esc(v.hd)} — ${esc(v.lvn)} -</span><small>${b.rows.length?`المعدل الفصلي: ${f2(b.gpa)} / 5.00`:''}</small></div>`;
  if(v.skip||!b.rows.length){if(pages[pages.length-1].u+80>cap())nxt();const p=pages[pages.length-1];p.h+=hd+`<p style="font-size:14px;color:#556;margin:2px 0">${v.skip?'معفى من هذا الفصل بموجب نتيجة اختبار تحديد المستوى.':'لا توجد مقررات مسجَّلة في هذا الفصل بعد.'}</p>`;p.u+=80;return}
  if(pages[pages.length-1].u+40+36+34>cap())nxt();
  let p=pages[pages.length-1],first=1,buf='';
  const flush=()=>{p.h+=(first?hd:'')+`<table>${th}${buf}</table>`;first=0;buf=''};
  p.u+=40+36;
  b.rows.forEach(c=>{if(p.u+34>cap()){flush();nxt();p=pages[pages.length-1];p.u+=36}
   buf+=`<tr><td>${esc(c.code||'—')}</td><td class="n">${esc(c.name)}</td><td>${c.hrs}</td><td>${c.fin?(c.tp).toFixed(2):'—'}</td><td>${c.fin?esc(c.gl):'—'}</td></tr>`;p.u+=34});
  flush();
  if(p.u+116>cap()){nxt();p=pages[pages.length-1]}
  p.h+=`<table class="sum"><tr><th style="width:16%">الوحدات</th><th>المسجلة</th><th>المجتازة</th><th>المكتسبة</th><th>النقاط</th><th>المعدل</th></tr>
  <tr><td>الفصلي</td><td>${b.R}</td><td>${b.P}</td><td>${b.P}</td><td>${b.pts.toFixed(2)}</td><td>${f2(b.gpa)}${gl5(b.gpa)}</td></tr>
  <tr><td>التراكمي</td><td>${b.cum.R}</td><td>${b.cum.P}</td><td>${b.cum.P}</td><td>${b.cum.pts.toFixed(2)}</td><td>${f2(b.cum.gpa)}${gl5(b.cum.gpa)}</td></tr></table>`;p.u+=116});
 if(pages[pages.length-1].u+270>cap())nxt();
 const last=pages[pages.length-1];last.h+=`<div class="end">نهاية السجل الأكاديمي</div>`;last.sig=1;
 const n=pages.length;
 const first=`<div class="bis">بسم الله الرحمن الرحيم</div>`+hdr(`${AR}<br>إدارة القبول والتسجيل`,`<div class="l ar">الرقم الجامعي: ${esc(s.id)}${by?`<br>سنة الميلاد: ${esc(by)}م`:''}</div>`)+
  `<h1>${esc(o.R.title||'السجل الأكاديمي')}</h1><table class="info"><tr><td><b>الاسم:</b> ${esc(s.name)}</td><td><b>الدرجة:</b> دبلوم عام</td></tr><tr><td colspan="2"><b>الكلية / المعهد:</b> ${AR}</td></tr><tr><td><b>التخصص:</b> اللغة العربية</td><td><b>الجنسية:</b> ${esc(s.nat||'—')}</td></tr></table>`;
 const mini=hdr(`${AR}`,`<div class="l ar">${esc(s.name)} — ${esc(s.id)}</div>`,1);
 return `<div class="tmw">`+pages.map((p,i)=>`<div class="tmp">${i?mini:first}${p.h}${p.sig?sigBlk(trNo67(o.id)):''}<div class="ft"><span>التاريخ: ${dt.h?dt.h+' هـ — ':''}${dt.g} م</span><span class="note">* المعدل التراكمي على مقياس 5.00.</span><span>صفحة ${i+1} من ${n}</span></div></div>`).join('')+`</div>`};

/* ---------- شهادة التعريف (الطلاب) ---------- */
window.tmIntro=function(c){
 const s=S.students.find(x=>x.id==c.sid)||{},dt=dts(c.date),rn=c.rec,LV=['الأول','الثاني','الثالث','الرابع'],
  term=c.term||`المستوى ${LV[(s.lvl||1)-1]} — الفصل الدراسي ${(s.lvl||1)%2?'الأول':'الثاني'} (العام ${(s.lvl||1)<3?'الأول':'الثاني'}) ${(c.date||dt.g).slice(0,4)}`,
  F=[['اسم الطالب',c.name],['السجل المدني / الإقامة',s.pid||c.pid],['الرقم الجامعي / الطلب',c.sid],['الجنسية',s.nat||c.nat],['الكلية / المعهد',AR],['المرحلة الدراسية','دبلوم عام'],['نوع الدراسة',(s.status||'منتظم')+''],['الفصل الدراسي',term]];
 return `<div class="tmw"><div class="tmp ci">`+(c.revoked?'<div class="rvk">ملغاة</div>':'')+
 hdr(`${AR}<br>إدارة القبول والتسجيل`,`<div class="l">${EN}<br>Admission &amp; Registration</div>`,0,1)+
 `<div class="dt">التاريخ: ${dt.g} م<br>${dt.h?dt.h+' هـ':''}</div><div class="ttl"><span>شهادة تعريف</span></div>
 <dl class="fl">${F.map(x=>`<div><dt>${x[0]}</dt><dd>${esc(x[1]||'—')}</dd></div>`).join('')}</dl>
 <p class="txt">تفيد إدارة ${AR} بأن الطالب/ة الموضحة بياناته/ا أعلاه لا يزال/ما زالت على رأس الدراسة حتى تاريخه، وبناءً على طلبه/ا تم منحه/ا هذه الوثيقة لتقديمها ( إلى من يهمه الأمر ).${c.text?'<br>'+esc(c.text):''}</p>
 <p class="fin">والله ولي التوفيق .</p>${sigBlk(rn)}
 <div class="disc">** هذه الشهادة لا يترتب عليها أي التزام تجاه المعهد</div>
 <div class="vf"><div class="ref">Ref No: ${esc(rn)}</div><div class="url"><span>يمكنك التحقق من صحة هذه الشهادة بالدخول على:</span><span dir="ltr">${esc(vlink(rn).replace(/^https?:\/\//,''))}</span></div></div>
 </div></div>`};
/* ---------- الصفحة الفارغة العمودية (خطاب رسمي) ---------- */
window.tmBlank=function(c){
 const dt=dts(c.date),H=S.home||{},cls=c.cls||'public',Cn=700,Cl=500;
 const U=[];
 if(c.title)U.push({h:`<h2>${esc(c.title)}</h2>`});
 if(c.titleEn&&c.lang=='bi')U.push({h:`<div class="u en" style="text-align:center">${esc(c.titleEn)}</div>`,raw:1});
 if(c.nmShown&&c.name)U.push({h:`<div class="u nn">${esc(c.name)}</div>`,raw:1});
 String(c.text||'').split(/\n+/).filter(x=>x.trim()).forEach(x=>U.push({t:x,c:''}));
 if(c.lang=='bi'&&c.textEn)String(c.textEn).split(/\n+/).filter(x=>x.trim()).forEach(x=>U.push({t:x,c:' en'}));
 const m=document.createElement('div');m.className='tmw';m.style.cssText='position:fixed;left:-3000px;top:0';m.innerHTML='<div class="bl"><div class="bd" style="position:static;width:678px"></div></div>';document.body.appendChild(m);const mb=m.querySelector('.bd');
 const meas=h=>{mb.innerHTML=h;return mb.offsetHeight};
 const mk=(t,cx)=>`<div class="u${cx}">${esc(t)}</div>`;
 const items=[];
 try{U.forEach(u=>{
  if(u.h){const h=u.raw?u.h:`<div class="u">${u.h}</div>`;items.push({h:h,ht:meas(h)});return}
  let h=mk(u.t,u.c),ht=meas(h);
  if(ht<=Cn){items.push({h,ht});return}
  const w=u.t.split(/\s+/);while(w.length){let lo=1,hi=w.length;while(lo<hi){const k=Math.ceil((lo+hi)/2);meas(mk(w.slice(0,k).join(' '),u.c))<=Cn?lo=k:hi=k-1}
   const part=mk(w.splice(0,lo).join(' '),u.c);items.push({h:part,ht:meas(part)})}
 })}finally{m.remove()}
 const pages=[[]];let h0=0;
 items.forEach(it=>{if(h0+it.ht>Cn&&pages[pages.length-1].length){pages.push([]);h0=0}pages[pages.length-1].push(it);h0+=it.ht});
 for(let g=0;g<50;g++){const L=pages[pages.length-1],sh=L.reduce((a,x)=>a+x.ht,0);if(sh<=Cl)break;if(L.length>1){pages.push([L.pop()]);continue}pages.push([]);break}
 const n=pages.length,ref=c.rec,
  chk=(k,l)=>`<div><span class="cb${cls==k?' on':''}"></span>${l}</div>`,
  bar=i=>`<div class="bar"><span><i>@</i>${esc(H.em||'')}</span>${n>1?`<span class="pn">صفحة ${i+1} من ${n}</span>`:''}<span>${esc(H.p1||'')}${H.p2?' , '+esc(H.p2):''}<i>+</i></span></div>`;
 return `<div class="tmw">`+pages.map((p,i)=>`<div class="tmp bl">`+(c.revoked?'<div class="rvk">ملغاة</div>':'')+
 `<div class="tp"></div><img class="tmwm" src="${window.LOGOM||LOGO}" alt="">
 <div class="bh"><div class="cls"><b>تصنيف الوثيقة:</b>${chk('public','عامة / خارجية')}${chk('internal','داخلية')}${chk('secret','سرية')}</div>
 <div class="nm"><div class="e">${EN}</div><div class="a">${AR}</div><div class="s">التعليم • التأصيل • التميز</div></div>
 <div class="lg"><img src="${LOGO}" alt=""></div></div>
 <div class="orn"><i></i><b></b><i></i></div>
 <div class="mt"><div><b>رقم الوثيقة :</b><span dir="ltr">${esc(ref)}</span></div><div><b>تاريخ الإصدار :</b><span>${dt.g} م</span></div><div><b>رقم الإصدار :</b><span>${esc(c.ver||'1.0')}</span></div><div><b>حالة الوثيقة :</b><span>${c.revoked?'ملغاة':'سارية'}</span></div></div>
 <div class="bd">${p.map(x=>x.h).join('')}</div>`+(i==n-1?sigBlk(ref).replace('<div class="sig">','<div class="sig">').replace('<div>الختم الرسمي<img','<div class="sl">الختم الرسمي<img'):'')+bar(i)+`</div>`).join('')+`</div>`};
const _ch=certHTML;certHTML=function(c){if(c&&c.type=='blank')return window.tmBlank(c);if(c&&c.type=='intro'&&!/^TF/.test(c.uid||''))return window.tmIntro(c);return _ch.apply(this,arguments)};

/* ---------- تنزيل متعدد الصفحات ---------- */
const _dl=dl;dl=async function(f){
 if(!/^\s*<div class="tmw"/.test(cur))return _dl.apply(this,arguments);
 const w=document.createElement('div');w.style.cssText='position:fixed;left:-3000px;top:0';w.innerHTML=cur;document.body.appendChild(w);
 try{await document.fonts.ready;const ps=[...w.querySelectorAll('.tmp')],cvs=[];
  for(const p of ps)cvs.push(await html2canvas(p,{scale:2.5,backgroundColor:'#fff',useCORS:true}));
  if(f=='pdf'){const{jsPDF}=window.jspdf,d=new jsPDF({unit:'mm',format:'a4',compress:true});cvs.forEach((cv,i)=>{if(i)d.addPage('a4','p');d.addImage(cv.toDataURL('image/jpeg',.95),'JPEG',0,0,210,297)});await fsave(curN+'.pdf',d.output('blob'))}
  else if(f=='svg'){toast('صيغة SVG غير متاحة لهذا القالب، استخدم PDF أو PNG');}
  else{const mt=f=='jpg'?'image/jpeg':'image/png',bl=await Promise.all(cvs.map(cv=>new Promise(r=>cv.toBlob(r,mt,.95))));
   if(bl.length==1)await fsave(curN+'.'+f,bl[0]);else{const z=new JSZip();bl.forEach((b,i)=>z.file(`${curN}-${i+1}.${f}`,b));await fsave(curN+'.zip',await z.generateAsync({type:'blob'}))}}
 }catch(e){if(!e||e.code!='declined')toast('تعذر التنزيل: '+((e&&e.message)||e))}finally{w.remove()}};
})();

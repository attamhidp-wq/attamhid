
/* ====== لوحة التحليلات الإدارية المتقدمة (Admin Analytics Dashboard) ======
   - رسوم SVG برمجية خفيفة (بلا مكتبات خارجية) تتبع ألوان البوابة والوضع الداكن.
   - تقرأ مباشرة من الحالة S المحفوظة في LocalStorage، وتتحدّث فوراً مع كل save().
   - للقراءة فقط: لا تعدّل أي بيانات أكاديمية؛ تضيف فقط توقيت تحديث رابط المحاضرة (linkAt). */
(()=>{
'use strict';
const AN='an',KEY=(typeof K!=='undefined'?K:'tisa_proto_v1'),DAY=864e5;
const C4=['#1d8fe0','#117a45','#a8812f','#8a1c3c'],PAL=['#1d8fe0','#117a45','#a8812f','#8a1c3c','#6b4fbb','#0e8a8a','#c2410c','#4b5563'];
const LVN=['','المستوى الأول','المستوى الثاني','المستوى الثالث','المستوى الرابع'];
const ST3=[['قيد المراجعة','#a8812f'],['مقبول','#117a45'],['مرفوض','#b3261e']];
const FACT=['تحديث رابط محاضرة','إرسال درجات الأستاذ للاعتماد','تقييم أستاذ لتسليم اختبار'];
const E=x=>esc(x),n0=x=>x==null?'—':String(x);
const f2=x=>x==null?'—':(Math.round(x*100)/100).toFixed(2);
const pc=(a,b)=>b?Math.round(a/b*100):null;
const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
const D=s=>{if(!s)return null;const d=new Date(s);return isNaN(d)?null:d};
const dd=(a,b)=>Math.round((a-b)/DAY);
const ymd=d=>d?d.toISOString().slice(0,10):'—';
const cfg=()=>{S.cfg=S.cfg||{};const c=S.cfg.an=S.cfg.an||{};if(!(+c.grace>=0))c.grace=14;if(!(+c.fresh>0))c.fresh=14;return c};
const reqDate=r=>{const d=D(r.date);if(d)return d;const m=/^REQ-([0-9A-Za-z]+)$/.exec(r.id||'');if(m){const t=parseInt(m[1],36);if(t>1.5e12&&t<4e12)return new Date(t)}return null};
const calOf=l=>{try{return calGet(l)||{}}catch(e){return{}}};
const coh=s=>s.cohort||((/^ST-(\d{4})-/.exec(s.id||''))||[])[1]||'غير محدد';

/* ---------- حساب المؤشرات ---------- */
function compute(){
 const R=S.requests||[],ST=S.students||[],FA=(S.faculty||[]).filter(f=>f.active!==false),AU=S.audit||[],C=cfg(),now=new Date(),M={C,now};
 const courses=crs();
 /* 1) الطلبات */
 const sc={};ST3.forEach(([k])=>sc[k]=0);R.forEach(r=>{sc[r.status]=(sc[r.status]||0)+1});
 const taken=R.filter(r=>plOf(r)).length,months={};
 R.forEach(r=>{const d=reqDate(r);if(!d)return;const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');const o=months[k]=months[k]||{n:0,acc:0};o.n++;if(r.status=='مقبول')o.acc++});
 M.req={total:R.length,sc,taken,months:Object.keys(months).sort().slice(-12).map(k=>({k,...months[k]})),undated:R.filter(r=>!reqDate(r)).length};
 /* 2) التسكين في المستويات الأربعة */
 const lv=[0,0,0,0,0],lvScore=[[],[],[],[],[]];let waiting=0,official=0,suggested=0,adj=0;
 ST.forEach(s=>{
  const rq=R.find(r=>r.sid==s.id),p=(s.pl&&s.pl.score!=null&&s.pl.score!=='')?s.pl:(rq?plOf(rq):null),sug=p?(p.lv||plLvN(+p.score)):null;
  let L=+s.lvl||0;
  if(L){official++;if(sug&&sug!=L)adj++}else if(sug){L=sug;suggested++}else{waiting++;return}
  lv[L]++;if(p&&p.score!=null&&p.score!=='')lvScore[L].push(+p.score);
 });
 M.pl={lv,avgScore:lvScore.map(a=>avg(a)),waiting,official,suggested,adj,total:ST.length};
 /* 3) المعدلات لكل دفعة (المعتمدة فقط) */
 const cs={};
 ST.forEach(s=>{const k=coh(s),o=cs[k]=cs[k]||{k,n:0,cum:[],sem:[[],[],[],[]],H:0,Ec:0};o.n++;
  const t=calc(s,0,1);if(t.gpa!=null){o.cum.push(t.gpa);o.H+=t.H;o.Ec+=t.E}
  for(let l=1;l<=4;l++){const x=calc(s,l,1);if(x.gpa!=null)o.sem[l-1].push(x.gpa)}});
 M.coh=Object.values(cs).sort((a,b)=>String(a.k).localeCompare(String(b.k))).map(o=>({k:o.k,n:o.n,withG:o.cum.length,cum:avg(o.cum),sem:o.sem.map(avg),pass:pc(o.Ec,o.H)}));
 const allG=[];ST.forEach(s=>{const t=calc(s,0,1);if(t.gpa!=null)allG.push(t.gpa)});M.gpa=avg(allG);M.gpaN=allG.length;
 M.pend=(typeof pendQ=='function')?pendQ().length:0;
 let rel=0;ST.forEach(s=>Object.values(s.gr||{}).forEach(g=>{if(g.rel)rel++}));M.rel=rel;
 /* 4) أداء الهيئة */
 M.fac=FA.map(f=>{
  const L=courses.filter(c=>(f.teach||[]).some(x=>x==c.id)),grace=+C.grace,fresh=+C.fresh;
  let sub=0,on=0,late=0,delay=0,miss=0,upc=0,pendA=0,regN=0,gradedN=0;const stu=new Set(),rows=[];
  L.forEach(c=>{
   const dl=D(calOf(c.term).to),lim=dl?new Date(dl.getTime()+grace*DAY):null;let reg=0,gr=0,ov=0,lt=0;
   ST.forEach(s=>{if(!(s.reg||[]).includes(c.id))return;reg++;stu.add(s.id);
    const g=(s.gr||{})[c.id];if(g&&g.fin)gr++;
    if(g&&g.tch==f.id){sub++;if(!g.rel&&g.fin)pendA++;const sd=D(g.sentAt||g.sent||g.date);
     if(lim&&sd){if(sd<=lim)on++;else{late++;lt++;delay+=dd(sd,lim)}}}
    else if(!(g&&g.fin)&&!(g&&g.prov)&&lim){if(now>lim){miss++;ov++}else upc++}});
   regN+=reg;gradedN+=gr;
   /* رابط المحاضرة */
   const la=AU.filter(a=>a.action=='تحديث رابط محاضرة'&&a.target==f.id&&a.detail==c.name).map(a=>D(a.t)).filter(Boolean).sort((a,b)=>b-a)[0];
   const at=D(c.linkAt)||la||null,age=at?dd(now,at):null;
   const st=!c.link?'none':at==null?'undated':age<=fresh?'fresh':'stale';
   rows.push({c,dl,lim,reg,gr,ov,lt,st,age,at});
  });
  const punctN=on+late+miss,punct=pc(on,punctN),cover=pc(gradedN,regN),link=L.length?pc(rows.filter(r=>r.st=='fresh').length,L.length):null;
  const mine=AU.filter(a=>a.target==f.id&&FACT.includes(a.action)),last=mine.map(a=>D(a.t)).filter(Boolean).sort((a,b)=>b-a)[0]||null,m30=mine.filter(a=>{const d=D(a.t);return d&&dd(now,d)<=30}).length;
  const parts=[[punct,.4],[link,.3],[cover,.3]].filter(p=>p[0]!=null),w=parts.reduce((s,p)=>s+p[1],0),score=L.length&&parts.length?Math.round(parts.reduce((s,p)=>s+p[0]*p[1],0)/w):null;
  return{f,L,rows,stu:stu.size,sub,on,late,miss,upc,pendA,punct,punctN,delay:late?Math.round(delay/late):0,cover,link,last,m30,tot:mine.length,links:mine.filter(a=>a.action=='تحديث رابط محاضرة').length,evals:mine.filter(a=>a.action=='تقييم أستاذ لتسليم اختبار').length,score};
 });
 const sc2=M.fac.map(x=>x.score).filter(x=>x!=null);M.facAvg=sc2.length?Math.round(avg(sc2)):null;
 return M;
}
const rate=s=>s==null?['—','#6b7280']:s>=85?['ممتاز','#117a45']:s>=70?['جيد','#a8812f']:['يحتاج متابعة','#b3261e'];
const LK={fresh:['محدَّث','#117a45'],stale:['قديم','#b3261e'],none:['لا يوجد رابط','#b3261e'],undated:['بلا تاريخ','#a8812f']};

/* ---------- رسوم SVG ---------- */
function donut(items,center,sub){
 const tot=items.reduce((s,i)=>s+i.v,0),r=56,Cc=2*Math.PI*r;let off=0;
 if(!tot)return `<p class="mu">لا توجد بيانات بعد.</p>`;
 const seg=items.filter(i=>i.v>0).map(i=>{const len=i.v/tot*Cc,s=`<circle cx="90" cy="90" r="${r}" fill="none" stroke="${i.c}" stroke-width="26" stroke-dasharray="${len.toFixed(2)} ${(Cc-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 90 90)"><title>${E(i.l)}: ${i.v} (${Math.round(i.v/tot*100)}٪)</title></circle>`;off+=len;return s}).join('');
 return `<svg viewBox="0 0 180 180" width="190" role="img" aria-label="${E(sub||'')}"><circle cx="90" cy="90" r="${r}" fill="none" stroke="var(--bd)" stroke-width="26"/>${seg}<text x="90" y="92" text-anchor="middle" font-size="26" font-weight="700">${center}</text><text x="90" y="112" text-anchor="middle" font-size="11" class="mu2">${E(sub||'')}</text></svg>`;
}
function legend(items,tot){return `<div class="lg">${items.map(i=>`<span><i style="background:${i.c}"></i>${E(i.l)}: <b>${i.v}</b>${tot?` (${pc(i.v,tot)}٪)`:''}</span>`).join('')}</div>`}
function gbars(cats,series,max,h){
 const W=560,H=h||250,l=34,t=14,b=34,pw=W-l-8,ph=H-t-b,n=series.length||1,gw=pw/cats.length,bw=Math.min(30,(gw-14)/n);let g='';
 for(let i=0;i<=max;i++){const y=t+ph-i/max*ph;g+=`<line x1="${l}" x2="${W-8}" y1="${y}" y2="${y}" stroke="var(--bd)" stroke-width="1"/><text x="${l-6}" y="${y+4}" text-anchor="end" font-size="10" class="mu2">${i}</text>`}
 cats.forEach((c,ci)=>{const cx=l+gw*ci+gw/2;g+=`<text x="${cx}" y="${H-12}" text-anchor="middle" font-size="11">${E(c)}</text>`;
  series.forEach((s,si)=>{const v=s.v[ci];if(v==null)return;const hh=v/max*ph,x=cx-(n*bw)/2+si*bw;g+=`<rect x="${x.toFixed(1)}" y="${(t+ph-hh).toFixed(1)}" width="${(bw-2).toFixed(1)}" height="${hh.toFixed(1)}" rx="2" fill="${s.c}"><title>${E(s.l)} — ${E(c)}: ${f2(v)} / 5.00</title></rect><text x="${(x+bw/2-1).toFixed(1)}" y="${(t+ph-hh-3).toFixed(1)}" text-anchor="middle" font-size="9">${f2(v)}</text>`})});
 return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="متوسط المعدلات لكل دفعة">${g}</svg>`;
}
function vbars(data){
 if(!data.length)return `<p class="mu">لا توجد طلبات مؤرَّخة بعد.</p>`;
 const W=560,H=200,l=30,t=16,b=30,pw=W-l-8,ph=H-t-b,mx=Math.max(...data.map(d=>d.n),1),gw=pw/data.length,bw=Math.min(34,gw-10);let g='';
 for(let i=0;i<=4;i++){const v=Math.round(mx*i/4),y=t+ph-v/mx*ph;g+=`<line x1="${l}" x2="${W-8}" y1="${y}" y2="${y}" stroke="var(--bd)"/><text x="${l-5}" y="${y+4}" text-anchor="end" font-size="10" class="mu2">${v}</text>`}
 data.forEach((d,i)=>{const x=l+gw*i+(gw-bw)/2,h1=d.n/mx*ph,h2=d.acc/mx*ph,[y,m]=d.k.split('-');
  g+=`<rect x="${x}" y="${t+ph-h1}" width="${bw}" height="${h1}" rx="2" fill="#1d8fe0"><title>${d.k}: ${d.n} طلب</title></rect><rect x="${x}" y="${t+ph-h2}" width="${bw}" height="${h2}" rx="2" fill="#117a45"><title>${d.k}: ${d.acc} مقبول</title></rect><text x="${x+bw/2}" y="${H-12}" text-anchor="middle" font-size="10">${m}/${y.slice(2)}</text>`});
 return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="الطلبات شهرياً">${g}</svg>`;
}
const hbar=(v,c)=>`<div class="bar" title="${n0(v)}٪"><i style="width:${v==null?0:Math.max(2,v)}%;background:${c}"></i></div>`;
const tb=(h,rows,empty)=>`<div class="wrap"><table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${rows.join('')||`<tr><td colspan="${h.length}" class="mu">${empty||'لا توجد بيانات'}</td></tr>`}</table></div>`;
const kp=(v,l,c)=>`<div><b${c?` style="color:${c}"`:''}>${v}</b><span>${l}</span></div>`;
const pill=(t,c)=>`<span class="pill" style="--c:${c}">${t}</span>`;

/* ---------- بناء الواجهة ---------- */
function body(M){
 const q=M.req,p=M.pl,items3=ST3.map(([k,c])=>({l:k,v:q.sc[k]||0,c})),lvI=[1,2,3,4].map(i=>({l:LVN[i],v:p.lv[i],c:C4[i-1]})),placed=p.lv[1]+p.lv[2]+p.lv[3]+p.lv[4];
 const kpi=`<div class="kp">${kp(q.total,'إجمالي الطلبات')}${kp(q.sc['قيد المراجعة']||0,'قيد المراجعة','#a8812f')}${kp(q.sc['مقبول']||0,'مقبولون','#117a45')}${kp(placed+' / '+p.total,'طلاب مسكَّنون')}${kp(f2(M.gpa),'المعدل التراكمي العام (معتمد)')}${kp(M.pend,'نتائج بانتظار الاعتماد',M.pend?'#b3261e':'')}${kp(M.facAvg==null?'—':M.facAvg+'٪','متوسط مؤشر أداء الهيئة')}</div>`;
 const funnel=[['إجمالي الطلبات',q.total,'#1d8fe0'],['أدّوا اختبار تحديد المستوى',q.taken,'#6b4fbb'],['مقبولون',q.sc['مقبول']||0,'#117a45'],['مسكَّنون في مستوى',placed,'#a8812f']].map(([l,v,c])=>`<div class="fn"><span>${l}</span><b>${v}</b>${hbar(pc(v,q.total||1),c)}</div>`).join('');
 const sec1=`<div class="box"><h3>١) المتقدمون وحالة الطلبات</h3>${kpi}<div class="cg" style="margin-top:14px"><div><h4>حالة الطلبات</h4><div class="ctr">${donut(items3,q.total,'طلب')}</div>${legend(items3,q.total)}</div><div><h4>الطلبات شهرياً <small class="mu">(الأزرق: الكل · الأخضر: المقبول)</small></h4><div class="ch">${vbars(q.months)}</div>${q.undated?`<p class="mu">${q.undated} طلب بلا تاريخ لا يظهر في الرسم.</p>`:''}</div><div><h4>مسار المتقدم</h4>${funnel}</div></div></div>`;
 const rowsL=[1,2,3,4].map(i=>`<tr><td><i class="sw" style="background:${C4[i-1]}"></i>${LVN[i]}</td><td class="num">${p.lv[i]}</td><td class="num">${pc(p.lv[i],placed)==null?'—':pc(p.lv[i],placed)+'٪'}</td><td class="num">${p.avgScore[i]==null?'—':f2(p.avgScore[i])}</td></tr>`);
 const sec2=`<div class="box"><h3>٢) تسكين الطلاب في المستويات الأربعة <small class="mu">(نتائج اختبار تحديد المستوى)</small></h3><div class="cg"><div><div class="ctr">${donut(lvI,placed,'مسكَّن')}</div>${legend(lvI,placed)}</div><div>${tb(['المستوى','الطلاب','النسبة','متوسط درجة الاختبار'],rowsL)}<p class="mu">الحدود المعتمدة: ≤70 ← الأول · 71–80 ← الثاني · 81–90 ← الثالث · >90 ← الرابع.<br>مسكَّن رسمياً: <b>${p.official}</b> · مستوى مقترح من الاختبار فقط: <b>${p.suggested}</b> · بانتظار التسكين: <b>${p.waiting}</b> · تعديلات إدارية على المقترح: <b>${p.adj}</b></p></div></div></div>`;
 const cats=['الفصل 1','الفصل 2','الفصل 3','الفصل 4','التراكمي'],ser=M.coh.map((o,i)=>({l:'دفعة '+o.k,c:PAL[i%PAL.length],v:[...o.sem,o.cum]})),has=M.coh.some(o=>o.withG);
 const rowsC=M.coh.map((o,i)=>`<tr><td><i class="sw" style="background:${PAL[i%PAL.length]}"></i>دفعة ${E(o.k)}</td><td class="num">${o.n}</td><td class="num">${o.withG}</td>${o.sem.map(x=>`<td class="num">${f2(x)}</td>`).join('')}<td class="num"><b>${f2(o.cum)}</b></td><td class="num">${o.pass==null?'—':o.pass+'٪'}</td></tr>`);
 const sec3=`<div class="box"><h3>٣) متوسطات المعدلات الفصلية والتراكمية لكل دفعة <small class="mu">(بعد الاعتماد الإداري فقط)</small></h3>${has?`<div class="ch">${gbars(cats,ser,5)}</div><div class="lg">${ser.map(s=>`<span><i style="background:${s.c}"></i>${E(s.l)}</span>`).join('')}</div>`:`<p class="mu">لا توجد درجات معتمدة بعد؛ تظهر المعدلات هنا فور اعتماد الإدارة للنتائج.</p>`}${tb(['الدفعة','الطلاب','لديهم درجات معتمدة','ف1','ف2','ف3','ف4','التراكمي','نسبة الاجتياز (بالساعات)'],rowsC,'لا يوجد طلاب بعد')}<p class="mu">المعدل من 5.00 وفق دالة الاحتساب المعتمدة في السجل الأكاديمي؛ الدفعة مأخوذة من حقل الدفعة أو من سنة الرقم الأكاديمي. نتائج منشورة: ${M.rel} · بانتظار الاعتماد: ${M.pend}.</p></div>`;
 const C=M.C,fr=M.fac.map(x=>{const[rl,rc]=rate(x.score);return `<tr><td>${E(x.f.name)}<br><small class="mu">${x.f.id}</small></td><td class="num">${x.L.length}</td><td class="num">${x.stu}</td><td class="num">${x.sub}${x.pendA?` <small class="mu">(${x.pendA} معلّقة)</small>`:''}</td><td class="num">${x.punct==null?'—':x.punct+'٪'}<br><small class="mu">${x.on} في الموعد · ${x.late} متأخرة · ${x.miss} لم تُرفع</small>${hbar(x.punct,'#1d8fe0')}</td><td class="num">${x.cover==null?'—':x.cover+'٪'}${hbar(x.cover,'#6b4fbb')}</td><td class="num">${x.link==null?'—':x.link+'٪'}<br><small class="mu">${x.rows.filter(r=>r.st=='fresh').length} من ${x.L.length} مقرر</small>${hbar(x.link,'#117a45')}</td><td class="num">${x.m30}<br><small class="mu">الإجمالي ${x.tot} · آخر نشاط ${ymd(x.last)}</small></td><td class="num"><b style="font-size:1.2rem">${x.score==null?'—':x.score}</b><br>${pill(rl,rc)}</td></tr>`});
 const det=M.fac.filter(x=>x.L.length).map(x=>`<details><summary>${E(x.f.name)} — تفاصيل المقررات (${x.L.length})</summary>${tb(['المقرر','المستوى','موعد الرصد (+مهلة)','المسجَّلون','المرصودون','متأخر/لم يُرفع','رابط المحاضرة','آخر تحديث'],x.rows.map(r=>`<tr><td>${E(r.c.name)}</td><td class="num">${r.c.term}</td><td class="num">${r.lim?ymd(r.lim):'<span class="mu">لا موعد في التقويم</span>'}</td><td class="num">${r.reg}</td><td class="num">${r.gr}</td><td class="num">${r.lt+r.ov}</td><td class="num">${pill(LK[r.st][0],LK[r.st][1])}</td><td class="num">${r.at?ymd(r.at)+' <small class="mu">('+r.age+' يوم)</small>':'—'}</td></tr>`))}<p class="mu">الأنشطة المسجَّلة: ${x.links} تحديث رابط · ${x.evals} تقييم اختبار.</p></details>`).join('');
 const sec4=`<div class="box"><h3>٤) تقارير أداء أعضاء هيئة التدريس</h3><form class="an-set" onsubmit="return false"><label>مهلة رصد الدرجات بعد نهاية الفصل (أيام)<input type="number" min="0" max="90" value="${C.grace}" onchange="anCfg('grace',this.value)"></label><label>اعتبار رابط المحاضرة «محدَّثاً» إن حُدِّث خلال (أيام)<input type="number" min="1" max="90" value="${C.fresh}" onchange="anCfg('fresh',this.value)"></label></form>${M.fac.length?tb(['عضو الهيئة','المقررات','الطلاب','درجات مرفوعة','الالتزام بالمهل','اكتمال الرصد','مؤشر روابط المحاضرات','النشاط (٣٠ يوماً)','مؤشر الأداء'],fr):'<p class="mu">لا يوجد أعضاء هيئة مفعَّلون.</p>'}<p class="mu">مؤشر الأداء = الالتزام بالمهل ٤٠٪ + روابط المحاضرات المحدَّثة ٣٠٪ + اكتمال الرصد ٣٠٪ (تُعاد موازنة الأوزان إن غاب مكوّن لعدم توفر بياناته، كغياب موعد الفصل في التقويم الأكاديمي). التقييم: ≥٨٥ ممتاز · ≥٧٠ جيد · أقل من ذلك يحتاج متابعة.</p>${det}</div>`;
 return sec1+sec2+sec3+sec4;
}
function shell(){return `<div id="an"><div class="an-h"><div><h2 style="margin:0">لوحة التحليلات الإدارية</h2><span class="an-live"><b></b><span id="an-t"></span></span></div><div><button class="btn s" onclick="anExport()">تصدير Excel (.xlsx)</button> <button class="btn s" onclick="anRefresh()">تحديث الآن</button></div></div><div id="an-data"></div></div>`}
function refresh(){
 const host=document.getElementById('an-data');if(!host)return;
 try{const M=compute();host.innerHTML=body(M);const t=document.getElementById('an-t');if(t)t.textContent='تحديث فوري مع كل تسجيل أو تسكين أو اعتماد · آخر تحديث '+new Date().toLocaleTimeString(LG=='en'?'en-GB':'ar')}
 catch(e){console.error(e);host.innerHTML='<div class="msg er">تعذّر حساب المؤشرات: '+E(e.message)+'</div>'}
}
let tm=0;
const sched=()=>{if(tab!==AN||!me||me.r!=='admin')return;clearTimeout(tm);tm=setTimeout(refresh,200)};

/* ---------- الربط بالواجهة ---------- */
function style(){if(document.getElementById('an-css'))return;const s=document.createElement('style');s.id='an-css';s.textContent=`
#an{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;min-width:0}#an #an-data>*,#an .cg>*{min-width:0}#an .ch{max-width:680px;margin-inline:auto}#an .an-h{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}
#an .an-live{font-size:.8rem;color:var(--mu)}#an .an-live b{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ok);margin-inline-end:6px}
#an #an-data{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}#an .box h3{margin:0 0 10px}#an h4{margin:0 0 8px;font-size:.98rem}
#an .kp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}#an .kp>div{background:var(--bg);border:1px solid var(--bd);border-radius:6px;padding:10px 12px}
#an .kp b{display:block;font-size:1.5rem;line-height:1.25;color:var(--pr)}#an .kp span{font-size:.8rem;color:var(--mu)}
#an .cg{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:18px}#an .ctr{display:flex;justify-content:center}
#an .lg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.82rem;margin-top:8px}#an .lg i,#an .sw{display:inline-block;width:10px;height:10px;border-radius:2px;margin-inline-end:6px}
#an svg{max-width:100%;height:auto;direction:ltr}#an svg text{fill:var(--tx);font-family:inherit}#an svg .mu2{fill:var(--mu)}
#an .wrap{overflow-x:auto}#an table{min-width:100%}#an td.num,#an th{text-align:center}#an td.num small{display:block}
#an .bar{height:7px;border-radius:4px;background:var(--bd);overflow:hidden;margin-top:4px;min-width:70px}#an .bar i{display:block;height:100%}
#an .fn{margin:0 0 12px}#an .fn span{font-size:.88rem}#an .fn b{float:left}
#an .pill{display:inline-block;padding:1px 10px;border-radius:99px;font-size:.76rem;color:#fff;background:var(--c)}
#an details{margin-top:10px;border:1px solid var(--bd);border-radius:6px;padding:8px 12px}#an summary{cursor:pointer;font-weight:600}
#an .an-set{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;margin-bottom:12px}#an .an-set input{max-width:140px}`;document.head.appendChild(s)}
function mount(){
 if(!me||me.r!=='admin')return;const tabs=document.querySelector('#app .tabs');if(!tabs)return;style();
 if(!tabs.querySelector('[data-an]')){const b=document.createElement('button');b.dataset.an=1;b.className='btn '+(tab==AN?'':'s');b.textContent='التحليلات وأداء الهيئة'+(M0().pend?' ●':'');b.onclick=()=>{tab=AN;flash='';go()};tabs.appendChild(b)}
 if(tab===AN){let box=tabs.nextElementSibling;while(box&&!(box.classList&&box.classList.contains('box')))box=box.nextElementSibling;if(box&&box.classList.contains('box')&&!box.querySelector('#an')){box.innerHTML=shell();refresh()}
  tabs.querySelectorAll('.btn').forEach(x=>{if(!x.dataset.an&&x.className.indexOf('s')<0)x.className='btn s'})}
}
const M0=()=>({pend:(typeof pendQ=='function')?pendQ().length:0});
window.anCfg=(k,v)=>{const c=cfg();c[k]=Math.max(k=='fresh'?1:0,Math.min(90,Math.round(+v)||0));try{save();if(window.audit4)audit4('تعديل إعداد لوحة التحليلات','',k+'='+c[k])}catch(e){}refresh()};
window.anRefresh=refresh;
window.anExport=()=>{
 const M=compute(),p=M.pl,q=M.req,pad=x=>x==null?'':x;
 const sh={
  'الطلبات':[['الحالة','العدد'],...ST3.map(([k])=>[k,q.sc[k]||0]),['إجمالي الطلبات',q.total],['أدّوا اختبار تحديد المستوى',q.taken],[],['الشهر','الطلبات','المقبولون'],...q.months.map(m=>[m.k,m.n,m.acc])],
  'التسكين':[['المستوى','الطلاب','متوسط درجة الاختبار'],...[1,2,3,4].map(i=>[LVN[i],p.lv[i],pad(p.avgScore[i]==null?null:+f2(p.avgScore[i]))]),['بانتظار التسكين',p.waiting],['تعديلات إدارية على المقترح',p.adj]],
  'المعدلات':[['الدفعة','الطلاب','لديهم درجات معتمدة','ف1','ف2','ف3','ف4','التراكمي','نسبة الاجتياز ٪'],...M.coh.map(o=>[o.k,o.n,o.withG,...o.sem.map(x=>pad(x==null?null:+f2(x))),pad(o.cum==null?null:+f2(o.cum)),pad(o.pass)])],
  'أداء الهيئة':[['الرقم','الاسم','المقررات','الطلاب','درجات مرفوعة','معلّقة للاعتماد','في الموعد','متأخرة','لم تُرفع','الالتزام بالمهل ٪','اكتمال الرصد ٪','روابط محدَّثة ٪','نشاط ٣٠ يوماً','آخر نشاط','المؤشر'],...M.fac.map(x=>[x.f.id,x.f.name,x.L.length,x.stu,x.sub,x.pendA,x.on,x.late,x.miss,pad(x.punct),pad(x.cover),pad(x.link),x.m30,ymd(x.last),pad(x.score)])]
 },day=new Date().toISOString().slice(0,10);
 if(typeof XLSX!=='undefined'){const wb=XLSX.utils.book_new();Object.keys(sh).forEach(k=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(sh[k]),k));wb.Workbook={Views:[{RTL:true}]};XLSX.writeFile(wb,'analytics-'+day+'.xlsx')}
 else{const qt=x=>'"'+String(x??'').replace(/"/g,'""')+'"',csv='\ufeff'+Object.keys(sh).map(k=>k+'\n'+sh[k].map(r=>r.map(qt).join(',')).join('\n')).join('\n\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='analytics-'+day+'.csv';a.click()}
 if(window.audit4)audit4('تصدير تقارير لوحة التحليلات','','xlsx');
};

/* توقيت آخر تحديث لرابط المحاضرة (يغذّي مؤشر الروابط دون المساس بمنطق الأستاذ) */
if(typeof window.tLink=='function'){const _t=window.tLink;window.tLink=function(cid){const last=a=>a.length?a[a.length-1].id:'',b=last(S.audit||[]);const r=_t.apply(this,arguments);try{const c=crs().find(x=>x.id==cid);if(c&&last(S.audit||[])!==b){c.linkAt=new Date().toISOString();save()}}catch(e){}return r}}
/* تحديث فوري: أي حفظ في LocalStorage يعيد رسم اللوحة */
const _si=Storage.prototype.setItem;Storage.prototype.setItem=function(k){const r=_si.apply(this,arguments);if(k===KEY)try{sched()}catch(e){}return r};
const _go=window.go;window.go=function(){const r=_go.apply(this,arguments);try{mount()}catch(e){console.error(e)}return r};
try{mount()}catch(e){console.error(e)}
})();


(()=>{try{
const GSC=window.GSC5,gradeOf=x=>window.gradeOf39(x);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LVR={1:['الأول','0101','0108'],2:['الثاني','0110','0217'],3:['الثالث','0218','0224'],4:['الرابع','0225','0229']};
const code=c=>(window.CK36?CK36(c.code||c.id):'')||String(c.code||'—');
const f2=x=>x==null?'—':(+x).toFixed(2);
const st={sid:null};
const stu=()=>{const A=S.students||[];return A.find(x=>x.id==st.sid)||A[0]||null};
const need=id=>crs().find(c=>c.id==id);
const exOf=c=>(S.exams||[]).filter(e=>e.courseId==c.id);
const exSt=c=>{const E=exOf(c);if(E.some(e=>e.pub))return['مفعل','ok'];if(E.length)return['غير مفعل',''];return window.QBANK36&&QBANK36[code(c)]?['بنك الأسئلة','']:['غير مفعل','']};
const gl=g=>{const r=GSC.find(x=>g>=x[2]-1e-9);return r?r[1]:''};
const sum=s=>{if(!s)return'';const k=calc(s);return `<div class="us" id="us37">${[1,2,3,4].map(l=>`<div>معدل المستوى ${LVR[l][0]}<b>${f2(calc(s,l).gpa)}</b></div>`).join('')}<div>المعدل التراكمي CGPA / 5.00<b>${f2(k.gpa)}</b>${k.gpa!=null?gl(k.gpa):''}</div><div>الساعات المجتازة<b>${k.E} / ${k.R}</b></div></div>`};
const row=(c,s)=>{const g=s&&(s.gr||{})[c.id],sc=g&&g.score!=null?g.score:'',[t,cl]=exSt(c),d=s?'':'disabled',id=E(c.id);
return `<form class="ur" data-c="${id}" onsubmit="UB37.sv('${id}');return false"><b class="uc">${E(code(c))}</b><span class="un">${E(c.name)}</span><span class="uh">${+c.hrs||0} س</span><span class="tag ${cl}">${t}</span><input class="ui" type="number" min="0" max="100" step="0.5" inputmode="decimal" placeholder="0–100" value="${E(sc)}" aria-label="الدرجة" ${d}><span class="ug">${g&&g.fin?E(g.gl)+' · '+f2(g.pts):'—'}</span>
<span class="ub"><button type="button" class="btn s" onclick="UB37.ex('${id}',0)">تعديل الاختبار</button><button type="button" class="btn s" onclick="UB37.ex('${id}',1)">إضافة/تعديل أسئلة</button><button type="button" class="btn s" ${d} onclick="UB37.auto('${id}')">رصد وتهيئة آلية</button><button class="btn" ${d}>حفظ وتحديث الدرجة</button><button type="button" class="btn d" ${d} onclick="UB37.del('${id}')">حذف</button></span></form>`};
function board(mode){const s0=stu();return (window.V51&&V51.withStu65&&s0)?V51.withStu65(s0,()=>board0(mode)):board0(mode)}
function board0(mode){const A=S.students||[],s=stu();if(s)st.sid=s.id;const C=crs().filter(c=>!c.legacy);
 return `<div id="ub37" class="ub37"><h3>${mode=='ex'?'لوحة الاختبارات والتقييم والدرجات':'المقررات والاختبارات والدرجات'} — عرض موحّد بالمستويات الأربعة</h3>
<label class="us0">الطالب المرصودة له الدرجات <select onchange="UB37.sel(this.value)">${A.map(x=>`<option value="${E(x.id)}" ${s&&x.id==s.id?'selected':''}>${E(x.id)} — ${E(x.name)}</option>`).join('')||'<option>لا يوجد طلاب</option>'}</select></label><div id="usw">${sum(s)}</div>`+
 [1,2,3,4].map(l=>{const L=C.filter(c=>(+c.term||1)==l).sort((a,b)=>code(a).localeCompare(code(b))),R=[LVR[l][0],L.length?code(L[0]):'—',L.length?code(L[L.length-1]):'—'];return `<section class="ul"><h4>المستوى ${R[0]} <small>(المقررات من ${R[1]} إلى ${R[2]}) · ${L.length} مقررات · ${L.reduce((a,c)=>a+(+c.hrs||0),0)} ساعة</small></h4>${L.map(c=>row(c,s)).join('')||'<p class="mu">لا مقررات</p>'}</section>`}).join('')+`</div>`}
const ensureEx=c=>{let e=exOf(c)[0];if(!e){e={id:Date.now(),title:'اختبار '+c.name,titleEn:'',lang:'ar',subj:c.name,min:30,pub:false,q:[],courseId:c.id,code:code(c)};S.exams.push(e);save()}return e};
const live=cid=>{const s=stu(),c=need(cid),w=document.getElementById('usw');if(w)w.innerHTML=sum(s);const r=document.querySelector(`.ub37 .ur[data-c="${cid}"]`);if(r&&c&&s){const g=(s.gr||{})[cid];r.querySelector('.ug').textContent=g&&g.fin?g.gl+' · '+f2(g.pts):'—';r.querySelector('.ui').value=g&&g.score!=null?g.score:'';r.classList.remove('flash');void r.offsetWidth;r.classList.add('flash')}};
const sync=()=>{try{QL36.run()}catch(e){console.error(e)}};
window.UB37={
 sel(id){st.sid=id;softBoard()},
 ex(cid,q){const c=need(cid);if(!c)return;const e=ensureEx(c);xe=e.id;xq=null;tab='ex';go();if(q)setTimeout(()=>{const f=document.querySelector('form[onsubmit^="return exQ("]');if(f){f.scrollIntoView({block:'center'});const t=f.querySelector('textarea');t&&t.focus()}},80)},
 sv(cid){const s=stu(),c=need(cid),i=document.querySelector(`.ub37 .ur[data-c="${cid}"] .ui`);if(!s||!c||!i)return;const v=i.value.trim();if(v===''||isNaN(+v)){toast('أدخل درجة من 0 إلى 100');return}const n=+v;if(n<0||n>100){toast('الدرجة يجب أن تكون بين 0 و100');return}
  const b=gradeOf(n);s.gr=s.gr||{};s.gr[cid]={rel:1,relDate:today(),score:n,gl:b[1],pts:b[2],ok:b[2]>=2,fin:1,man:1,src:'manual',by:S.adminUser||'admin',date:today()};if(!(s.reg||[]).includes(cid))s.reg=[...(s.reg||[]),cid];
  save();try{audit4('تعديل درجة (سطر موحد)',s.id,code(c)+' — '+n+' — المعدل التراكمي '+f2(calc(s).gpa))}catch(e){}
  live(cid);sync();toast('حُفظت الدرجة: '+b[1]+' — المعدل التراكمي '+f2(calc(s).gpa)+' / 5.00')},
 auto(cid){const s=stu(),c=need(cid);if(!s||!c)return;const ids=new Set(exOf(c).map(e=>e.id)),B=(S.subs||[]).filter(b=>b.sid==s.id&&ids.has(b.eid));
  if(!B.length){toast('لا يوجد تسليم اختبار لهذا المقرر من الطالب المحدد');return}
  const o=(s.gr||{})[cid];if(o&&o.man){if(!confirm('توجد درجة مرصودة يدوياً. استبدالها بنتيجة الاختبار الآلي؟'))return;delete s.gr[cid]}
  if(!(s.reg||[]).includes(cid))s.reg=[...(s.reg||[]),cid];
  try{sync();window.autoGrade5(B[B.length-1],true)}catch(e){console.error(e)}
  save();live(cid);sync();const g=(s.gr||{})[cid];toast(g&&g.fin?'رُصدت آلياً: '+g.score+'٪ — '+g.gl:'تعذّر الرصد الآلي (التسليم غير مقيَّم بعد)')},
 del(cid){const s=stu(),c=need(cid);if(!s||!c)return;if(!(s.gr||{})[cid]){toast('لا توجد درجة مرصودة لهذا المقرر');return}
  if(!confirm('حذف درجة الطالب في المقرر '+code(c)+'؟ (لا يُحذف المقرر نفسه)'))return;delete s.gr[cid];save();try{audit4('حذف درجة (سطر موحد)',s.id,code(c))}catch(e){}live(cid);sync();toast('حُذفت الدرجة وأُعيد احتساب المعدلين')}};
/* v65: كل عمليات السطر الموحد في سياق إصدار خطة الطالب المحدد */
Object.keys(window.UB37).forEach(k=>{const f=window.UB37[k];if(typeof f!=='function')return;window.UB37[k]=function(){const s0=stu();return (window.V51&&V51.withStu65&&s0)?V51.withStu65(s0,()=>f.apply(this,arguments)):f.apply(this,arguments)}});
/* ربط الصفحات: المقررات + الاختبارات والتقييم */
const _va=V.admin;V.admin=function(){const h=_va.apply(this,arguments);if(!me||me.r!='admin'||typeof h!='string')return h;
 if((tab=='cr'&&!crE)||(tab=='ex'&&!xe)){const T='</div><div class="box">',t=h.indexOf('<div class="tabs">'),j=h.indexOf(T,t);if(t<0||j<0)return h;
  return h.slice(0,j)+T+board(tab)+'<details class="ud37"><summary>'+(tab=='cr'?'إعدادات المقررات والجداول الأسبوعية والتسجيل':'إدارة الاختبارات التفصيلية والتسليمات')+'</summary>'+h.slice(j+T.length,h.lastIndexOf('</div>'))+'</details></div>'}
 return h};
/* ===== v38: استقرار التمرير والـDOM ===== */
let lastAct=0;['scroll','wheel','touchmove','keydown','pointerdown'].forEach(ev=>addEventListener(ev,()=>{lastAct=Date.now()},{passive:true,capture:true}));
window.userBusy37=()=>{const a=document.activeElement;return Date.now()-lastAct<1500||!!(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)&&a.closest&&a.closest('#app'))};
const rk=()=>location.hash+'|'+(typeof tab!='undefined'?tab:'')+'|'+(typeof xe!='undefined'?xe:'');
const _go=go;go=function(){const y=window.scrollY,k=rk(),same=window.__rk37===k;const r=_go.apply(this,arguments);window.__rk37=rk();window.scrollTo(0,same?y:0);return r};
function softBoard(){const s0=stu();return (window.V51&&V51.withStu65&&s0)?V51.withStu65(s0,()=>softBoard0()):softBoard0()}
function softBoard0(){const s=stu(),w=document.getElementById('usw');if(w)w.innerHTML=sum(s);
 document.querySelectorAll('.ub37 .ur').forEach(r=>{const c=need(r.dataset.c);if(!c)return;const g=s&&(s.gr||{})[c.id],i=r.querySelector('.ui'),ug=r.querySelector('.ug'),tg=r.querySelector('.tag'),[t,cl]=exSt(c);
  const gt=g&&g.fin?g.gl+' · '+f2(g.pts):'—';if(ug.textContent!==gt)ug.textContent=gt;
  if(i!==document.activeElement){const v=g&&g.score!=null?String(g.score):'';if(i.value!==v)i.value=v}i.disabled=!s;
  if(tg&&tg.textContent!==t){tg.textContent=t;tg.className='tag '+cl}})}
let pend=0;
window.softGo37=function(){if(document.getElementById('ub37')){softBoard();return}
 if(window.userBusy37()){if(!pend){pend=1;const w=()=>{if(window.userBusy37())return setTimeout(w,1200);pend=0;go()};setTimeout(w,1200)}return}go()};
/* ===== حارس التذييل: يمنع تداخل الختم، وإلا يزيله نظيفاً ===== */
function guard(root){try{const noSt=!!(S.home&&S.home.noStamp);(root||document).querySelectorAll('.tmw .tmp').forEach(p=>{const sg=p.querySelector('.sig');if(!sg)return;p.classList.remove('nostamp37');if(noSt){p.classList.add('nostamp37');return}
  const top=sg.getBoundingClientRect().top;let mx=0;p.querySelectorAll('.bd *,.txt,.fin,.fl,.end,.sum,.lt').forEach(e=>{if(sg.contains(e))return;const r=e.getBoundingClientRect();if(r.height&&r.bottom>mx)mx=r.bottom});
  if(mx>top-4)p.classList.add('nostamp37')})}catch(e){console.error(e)}}
window.guard37=guard;
new MutationObserver(()=>{clearTimeout(guard.t);guard.t=setTimeout(()=>guard(),120)}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('beforeprint',()=>guard());

/* ===== v40: حارس البيانات + التقييم الآلي الفوري ===== */
const IDBN='tisa_guard39';
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open(IDBN,1);r.onupgradeneeded=()=>r.result.createObjectStore('b');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const bkPut=async v=>{const d=await idb();return new Promise((res,rej)=>{const x=d.transaction('b','readwrite');x.objectStore('b').put(v,'S');x.oncomplete=()=>{d.close();res()};x.onerror=()=>rej(x.error)})};
const bkGet=async()=>{const d=await idb();return new Promise((res,rej)=>{const q=d.transaction('b').objectStore('b').get('S');q.onsuccess=()=>{d.close();res(q.result)};q.onerror=()=>rej(q.error)})};
const pristine=x=>!x||((x.students||[]).length<=1&&!(x.subs||[]).length&&!(x.requests||[]).length&&(x.certs||[]).length<=1&&!(x.students||[]).some(s=>Object.keys(s.gr||{}).length));
const DEMO=()=>({id:'ST-2026-001',name:'طالب تجريبي',email:'demo@example.com',phone:'0500000000',nat:'سعودي',pid:'0000000000',prog:DIP,status:'منتظم',pass:'1234',reg:[],sp:[],gr:{}});
function health(){let ch=0;try{
 if(typeof S=='undefined'||!S||typeof S!='object')return 0;
 ['programs','students','faculty','requests','certs','docReqs','exams','subs','news','lib'].forEach(k=>{if(!Array.isArray(S[k])){S[k]=[];ch=1}});
 S.dr=S.dr||{};S.img=S.img||{};S.home=S.home||{};S.cfg=S.cfg||{};S.n=S.n||{};['req','st','tf','rec'].forEach((k,i)=>{if(!S.n[k])S.n[k]=[1,2,2,2][i]});
 let D=S.programs.find(p=>p.id==DIP);const real=()=>{const D0=P(DIP)||{};const A=Array.isArray(D0.coursesAll)?D0.coursesAll:(D0.courses||[]);return A.filter(c=>c&&!c.legacy&&!c.deleted).length};
 if(!D||real()<25||!D.plan6){const hadNone=!D||real()<25;ensureDip();D=P(DIP);D.plan6=0;D.plan5=0;try{window.PLAN_HOURS()}catch(e){console.error(e)}if(hadNone)ch=1}
 if(S.exams.filter(e=>e.bank||e.bank65).length<25&&window.seedExams39){try{if(window.seedExams39())ch=1}catch(e){console.error(e)}}
 try{const byK={};crs().forEach(c=>{if(!c.legacy){const k=+(window.CK36?CK36(c.code):c.code);if(k)byK[k]=c}});S.exams.forEach(e=>{if(e.bank&&e.id>7000000&&e.id<7001000){const c=byK[e.id-7000000];if(c&&e.courseId!=c.id){e.courseId=c.id;ch=1}}})}catch(e){}
 const own=typeof me!='undefined'&&me&&me.r&&me.r!='admin';/* v71: بوابات الطالب والأستاذ ترى بياناتها فقط؛ لا تُزرع بيانات تجريبية فيها (كان يسبب إعادة رسم متكررة) */
 if(!own&&!S.students.length&&pristine(S)){S.students.push(DEMO());ch=1}
 if(!own&&!S.faculty.length&&pristine(S)){S.faculty.push({id:'TF-2026-001',name:'أ. المفتي منير الإسلام بن معيذ الدين',role:'رئيس المعهد',spec:'الدراسات الإسلامية واللغوية',courses:[1,2],pass:'tf1234',active:true,teach:[]});ch=1}
 }catch(e){console.error('health39',e)}return ch}
let hb=0;
function guard39(why){const lsGone=localStorage.getItem(K)===null,fixed=health();
 if(lsGone||fixed){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){try{window.__lsFail81&&window.__lsFail81(e)}catch(x){}}}
 if(fixed||lsGone){if(fixed){toast('أُعيد بناء بيانات المقررات والاختبارات تلقائياً');try{go()}catch(e){}}}
 return fixed}
let ready=0,lastBk='';
async function startup(){let r=0;try{
  if(typeof sbUser!='undefined'&&sbUser){ready=1;return}
  if(pristine(S)){const b=await bkGet();if(b&&typeof b=='string'){const o=JSON.parse(b);if(o&&!pristine(o)){S=o;health();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){try{window.__lsFail81&&window.__lsFail81(e)}catch(x){}}r=1;toast('أُعيدت البيانات من النسخة الاحتياطية المحلية');try{go()}catch(e){}}}}
 }catch(e){console.error('restore39',e)}ready=1}
async function backup(){if(!ready||document.hidden||pristine(S)&&lastBk)return;try{const j=JSON.stringify(S);if(j===lastBk)return;await bkPut(j);lastBk=j}catch(e){}}
const fixed0=guard39('start');startup();
setInterval(()=>guard39('tick'),3000);setInterval(backup,4000);
addEventListener('storage',e=>{if(e.key===K||e.key===null)guard39('storage')});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)guard39('vis')});
addEventListener('pagehide',()=>{try{if(!pristine(S))localStorage.setItem(K,JSON.stringify(S))}catch(e){}});
/* ===== التقييم الآلي الفوري عند تسليم الاختبار ===== */
function zt(b){const e=exFind(b.eid),s=(S.students||[]).find(x=>x.id==b.sid);if(!e||!s||!e.courseId||!need(e.courseId))return;
 if(!(s.reg||[]).includes(e.courseId))s.reg=[...(s.reg||[]),e.courseId];
 if(b.st=='بانتظار التقييم'){b.wr=b.wr||{};e.q.forEach((q,i)=>{if(q.ty=='wr')b.wr[i]=String((b.ans||{})[i]||'').trim().length>=25?1:0});
  if(b.auto==null){let sc=0;e.q.forEach((q,i)=>{if(q.ty!='wr'&&(b.ans||{})[i]===q.c)sc++});b.auto=sc}
  b.total=+(numOr0(b.auto)+Object.values(b.wr).reduce((a,x)=>a+x,0)).toFixed(2);b.st='مُقيَّم آلياً'}
 window.autoGrade5(b,true);
 const g=(s.gr||{})[e.courseId];if(g&&g.fin&&!g.man){g.rel=1;g.relDate=today()}
 save();
 if(g&&g.fin)toast('رُصدت درجتك: '+g.score+' / 100 — '+g.gl+' — المعدل التراكمي '+f2(calc(s).gpa)+' / 5.00');
 sync();go()}
const _xz=exSub;exSub=function(){const n=S.subs.length,r=_xz.apply(this,arguments),post=()=>{try{const b=S.subs[S.subs.length-1];if(S.subs.length>n&&b)zt(b)}catch(e){console.error(e)}};if(r&&typeof r.then=='function')r.then(post);else post();return r};
window.zt39=zt;window.health39=health;window.guard39=guard39;
}catch(e){console.error('v37',e)}})();

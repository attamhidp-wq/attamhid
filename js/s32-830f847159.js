
/* v124 — البرامج القصيرة والدورات وورش العمل (النظام الجديد) تظهر للزوار في الصفحة الرئيسية وصفحة البرامج، مع رابط التسجيل */
(function(){
var e0=function(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var V5=window.V51,L=function(a,b){try{return V5.L?V5.L(a,b):a}catch(e){return a}};var K0=[{id:'lec',ar:'محاضرة',en:'Lecture'},{id:'ws',ar:'ورشة عمل',en:'Workshop'},{id:'crs',ar:'دورة تدريبية',en:'Training course'},{id:'sem',ar:'ندوة',en:'Seminar'},{id:'frm',ar:'ملتقى',en:'Forum'},{id:'prg',ar:'برنامج',en:'Programme'}];
function X(){var v=S.v51=S.v51||{};v.sp=v.sp||[];return v}
function kind(P){var ks=(X().spCfg&&X().spCfg.kinds)||K0,k=ks.find(function(x){return x.id===P.kind})||K0.find(function(x){return x.id===P.kind})||K0[5];var en=String(k.en||'');return L(k.ar,en.charAt(0).toUpperCase()+en.slice(1))}
function regOpen(P){if(+P.selfReg===0)return false;var n=Date.now(),off=(P.tzOff==null?-180:+P.tzOff)*60000,t=function(x){return x?Date.parse(x+':00Z')+off:null},a=t(P.regFrom),b=t(P.regTo)||t(P.end||P.start);return (!a||n>=a)&&(!b||n<=b)}
function list(){return X().sp.filter(function(P){return P&&!P.deleted&&P.nameAr&&+P.hidden!==1}).map(function(P){return {d:String(P.start||''),n:L(P.nameAr,P.nameEn||P.nameAr),k:kind(P),h:P.hours,href:'#/sp/'+encodeURIComponent(P.id),open:regOpen(P),P:P}})}
V5.spPub123=list;
/* v125: البرامج القصيرة القديمة وُحّدت ضمن النظام الجديد؛ سجلاتها القديمة تُحفظ جانباً لعرض شهاداتها الصادرة فقط ولا تظهر في القوائم */
function ens(){try{var P=S.programs;if(!Array.isArray(P))return;var v=X();v.old60=v.old60||[];var leg={};v.sp.forEach(function(p){if(p&&p.legacy!=null)leg[String(p.legacy)]=1});
 var mv=P.filter(function(p){return p&&(p.sp60||leg[String(p.id)])});
 if(mv.length){mv.forEach(function(p){var i=v.old60.findIndex(function(o){return String(o.id)===String(p.id)});if(i<0)v.old60.push(p);else v.old60[i]=p});S.programs=P=P.filter(function(p){return mv.indexOf(p)<0})}
 if(!Object.prototype.hasOwnProperty.call(P,'find'))Object.defineProperty(P,'find',{value:function(f,t){var r=Array.prototype.find.call(this,f,t);return r!==undefined?r:Array.prototype.find.call((S.v51&&S.v51.old60)||[],f,t)},enumerable:false,configurable:true,writable:true})}catch(e){console.warn('v125 ens',e)}}
V5.ens125=ens;ens();try{GOH.pre.push(ens)}catch(e){}
var done=0;async function pull(){if(done||typeof sb==='undefined'||!sb)return;done=1;try{var r=await sb.from('v60_short_programs').select('id,data');if(r.error||!r.data)return;var v=X(),ch=0;
 r.data.forEach(function(row){var d=row.data||{};if(!d.id)d.id=row.id;var l=v.sp.find(function(o){return String(o.id)===String(row.id)});if(!l){v.sp.push(d);ch++}else if((d.u||'')>(l.u||l.at||'')&&!(typeof me!=='undefined'&&me&&me.r==='admin')){Object.keys(l).forEach(function(k){delete l[k]});Object.assign(l,d);ch++}});
 ens();if(ch){try{save0()}catch(e){}var k=location.hash.replace(/^#\/?/,'').split('/')[0];if(k===''||k==='programs')go()}}catch(e){console.warn('sp pub',e)}}
try{GOH.post.push(function(){var k=location.hash.replace(/^#\/?/,'').split('/')[0];if(k===''||k==='programs'||k==='student')pull()})}catch(e){}
setTimeout(pull,1500);
/* صفحة البرامج: قسم للبرامج القصيرة الجديدة */
try{var _vp=V.programs;V.programs=function(){var h=_vp.apply(this,arguments),a=list().sort(function(a,b){return b.d.localeCompare(a.d)});if(!a.length)return h;
 return h+'<h2 style="margin-top:28px">'+L('البرامج القصيرة والدورات وورش العمل','Short programmes, courses and workshops')+'</h2><div class="grid">'+a.map(function(p){var P=p.P;return '<div class="box"><h3>'+e0(p.n)+'</h3><span class="tag">'+e0(p.k)+'</span><p class="mu"><bdi dir="ltr">'+e0(String(P.start||'').replace('T',' '))+'</bdi>'+(P.hours?' · <bdi dir="ltr">'+e0(P.hours)+'</bdi> '+L('ساعات','hours'):'')+((P.trainerAr||P.trainerEn)?' · '+e0(L(P.trainerAr||P.trainerEn,P.trainerEn||P.trainerAr)):'')+'</p><a class="btn" style="display:inline-block;text-decoration:none" href="'+p.href+'">'+(p.open?L('سجّل الآن','Register now'):L('التفاصيل','Details'))+'</a></div>'}).join('')+'</div>'}}catch(e){console.warn('v124 programs',e)}
})();

/* v126 — زر «منحة» لكل طالب: نوع المنحة (كاملة/جزئية/مدفوعة) ونسبتها ومبلغ الإعفاء، من المنح المعلنة أو يدوياً؛ يتحدث المستحق فوراً في الإدارة وبوابة الطالب وإفادة المستحق المالي */
(function(){
var esc=function(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var V5=window.V51,L=function(a,b){try{return V5.L?V5.L(a,b):a}catch(e){return a}};
function stu(id){return (S.students||[]).find(function(x){return String(x.id)===String(id)})}
function progOf(s){return (S.programs||[]).find(function(p){return String(p.id)===String(s&&s.prog)})}
function act(s){return (Array.isArray(s&&s.sch72)?s.sch72:[]).filter(function(x){return x.st!=='void'&&x.scope==='program'&&(!x.prog||x.prog==s.prog)}).slice(-1)[0]}
function due(s){try{return V5.due72(s,progOf(s),'')}catch(e){return {base:0,pct:0,due:0,cur:''}}}
function fm(n,c){try{return V5.fmt72(n,c)}catch(e){return n+' '+c}}
function info(s){var d=due(s),a=act(s),pct=+d.pct||0;return {d:d,a:a,pct:pct,off:Math.round((d.base-d.due)*100)/100,kind:pct>=100?'full':pct>0?'part':'paid'}}
var KN={full:['منحة كاملة','Full scholarship'],part:['منحة جزئية','Partial scholarship'],paid:['مدفوعة (بدون منحة)','Fee-paying (no scholarship)']};
V5.schInfo126=info;
function offered(s){return (V5.live?V5.live((S.v51&&S.v51.sch)||[]):((S.v51&&S.v51.sch)||[])).filter(function(x){return x&&x.active!==0&&(!x.pid||String(x.pid)===String(s.prog))})}
function pctOf(o,base){return o.type==='full'?100:o.type==='pct'?Math.max(0,Math.min(100,Math.round(+o.value||0))):o.type==='amount'&&base>0?Math.max(0,Math.min(100,Math.round((+o.value||0)/base*100))):0}
function close(){var m=document.getElementById('sch126');if(m)m.remove()}
function open(id){var s=stu(id);if(!s)return;close();var I=info(s),O=offered(s),cur=I.a&&I.a.schId||'';
 var h='<div id="sch126" style="position:fixed;inset:0;z-index:9000;background:rgba(10,20,40,.55);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 12px" onclick="if(event.target===this)V51.h.sch126x()"><div class="box" style="max-width:560px;width:100%;margin:0;background:var(--sf,#fff)" role="dialog" aria-modal="true">'+
  '<h3 style="margin-top:0">'+L('منحة الطالب','Student scholarship')+'</h3><p><b>'+esc(L(s.name,s.nameEn||s.name))+'</b> · <bdi dir="ltr">'+esc(s.id)+'</bdi></p>'+
  '<form class="v51g" onsubmit="return V51.h.sch126save(this)" oninput="V51.h.sch126calc(this)"><input type="hidden" name="sid" value="'+esc(s.id)+'"><input type="hidden" name="base" value="'+esc(I.d.base)+'"><input type="hidden" name="cur" value="'+esc(I.d.cur)+'">'+
  '<label style="grid-column:1/-1">'+L('المنحة المعلنة','Announced scholarship')+'<select name="schId" onchange="V51.h.sch126pick(this)"><option value="">'+L('— منحة خاصة (يدوياً) —','— Custom (manual) —')+'</option>'+O.map(function(o){return '<option value="'+esc(o.id)+'" data-pct="'+pctOf(o,I.d.base)+'"'+(String(o.id)===String(cur)?' selected':'')+'>'+esc(L(o.nameAr,o.nameEn||o.nameAr))+' ('+pctOf(o,I.d.base)+'%)</option>'}).join('')+'</select>'+(O.length?'':'<small class="mu">'+L('لا توجد منح معلنة لهذا البرنامج حالياً؛ تُضاف من إدارة البرنامج ← المنح.','No scholarships are announced for this programme; add them from the programme’s Scholarships section.')+'</small>')+'</label>'+
  '<label>'+L('نوع المنحة','Scholarship type')+'<select name="kind" onchange="V51.h.sch126kind(this)">'+['full','part','paid'].map(function(k){return '<option value="'+k+'"'+(I.kind===k?' selected':'')+'>'+L(KN[k][0],KN[k][1])+'</option>'}).join('')+'</select></label>'+
  '<label>'+L('نسبة المنحة (%)','Scholarship (%)')+'<input name="pct" type="number" min="0" max="100" step="1" dir="ltr" value="'+I.pct+'"></label>'+
  '<label>'+L('الرسم المقرر للفصل','Set fee per semester')+'<input disabled dir="ltr" value="'+esc(fm(I.d.base,I.d.cur))+'"></label>'+
  '<label>'+L('مبلغ الإعفاء','Waived amount')+'<input name="off" disabled dir="ltr" value="'+esc(fm(I.off,I.d.cur))+'"></label>'+
  '<label style="grid-column:1/-1">'+L('المبلغ المستحق على الطالب','Amount due from the student')+'<input name="due" disabled dir="ltr" style="font-weight:700" value="'+esc(fm(I.d.due,I.d.cur))+'"></label>'+
  '<label style="grid-column:1/-1">'+L('الأساس أو الملاحظة (اختياري)','Basis or note (optional)')+'<input name="note" maxlength="200" value="'+esc(I.a&&I.a.note||'')+'"></label>'+
  '<div style="grid-column:1/-1;display:flex;gap:8px;flex-wrap:wrap"><button class="btn">'+L('حفظ وتطبيق','Save and apply')+'</button><button type="button" class="btn sec" onclick="V51.h.sch126x()">'+L('إلغاء','Cancel')+'</button></div></form></div></div>';
 document.body.insertAdjacentHTML('beforeend',h)}
var H=V5.h;
H.sch126=open;H.sch126x=close;
H.sch126calc=function(f){var b=+f.base.value||0,p=Math.max(0,Math.min(100,Math.round(+f.pct.value||0))),o=Math.round(b*p)/100;f.off.value=fm(o,f.cur.value);f.due.value=fm(Math.round((b-o)*100)/100,f.cur.value)};
H.sch126kind=function(el){var f=el.form;if(el.value==='full')f.pct.value=100;else if(el.value==='paid')f.pct.value=0;else if(!(+f.pct.value>0&&+f.pct.value<100))f.pct.value=50;if(el.value!=='part'||true)H.sch126calc(f)};
H.sch126pick=function(el){var f=el.form,o=el.options[el.selectedIndex],p=o&&o.dataset.pct;if(el.value&&p!=null){f.pct.value=p;f.kind.value=+p>=100?'full':+p>0?'part':'paid';H.sch126calc(f)}};
H.sch126save=function(f){try{if(typeof me==='undefined'||!me||me.r!=='admin'){toast(L('تطبيق المنح من الإدارة المركزية فقط.','Scholarships are applied by the central administration only.'));return false}
 var s=stu(f.sid.value);if(!s)return false;var kind=f.kind.value,pct=Math.max(0,Math.min(100,Math.round(+f.pct.value||0)));
 if(kind==='full')pct=100;if(kind==='paid')pct=0;if(kind==='part'&&!(pct>=1&&pct<=99)){toast(L('نسبة المنحة الجزئية من 1 إلى 99.','A partial scholarship must be 1–99%.'));return false}
 var now=new Date().toISOString(),sch=f.schId.value?((S.v51&&S.v51.sch)||[]).find(function(x){return String(x.id)===f.schId.value}):null;
 s.sch72=(Array.isArray(s.sch72)?s.sch72:[]).slice();s.sch72.forEach(function(x){if(x.st!=='void'&&x.scope==='program'&&(!x.prog||x.prog==s.prog)){x.st='void';x.voidAt=now;x.voidBy='admin'}});
 if(pct>0){var x=V5.grant72(s,'program','',pct,String(f.note.value||'').trim());x.kind=kind;if(sch){x.schId=sch.id;x.nameAr=sch.nameAr||'';x.nameEn=sch.nameEn||''}s.sch51=sch?{schId:sch.id,res:'approved',from:now.slice(0,10)}:null}
 else{s.sch51=null;try{V5.aud(L('إلغاء منحة دراسية','Scholarship cancelled'),s.id,L('مدفوعة','fee-paying'))}catch(e){}}
 try{V5.recalc72(s)}catch(e){}try{V5.touch(s)}catch(e){s.u=now}save();close();toast(L('حُفظت المنحة وتحدّث المستحق في كل المواضع.','Scholarship saved; the amount due was updated everywhere.'));go()}catch(e){console.error('sch126',e);toast(L('تعذّر الحفظ','Could not save'))}return false};
/* الزر في صف كل طالب + بطاقة المنحة في بوابة الطالب */
function post(){try{if(typeof me==='undefined'||!me)return;
 if(me.r==='admin'&&/^#\/admin/.test(location.hash)){[].slice.call(document.querySelectorAll('#app .act69')).forEach(function(d){if(d.dataset.s126)return;var b=d.querySelector('button[onclick^="seeRec(\'"]');if(!b)return;var m=/seeRec\('([^']+)'\)/.exec(b.getAttribute('onclick'));if(!m)return;var s=stu(m[1]);if(!s)return;d.dataset.s126=1;var I=info(s);
   var n=document.createElement('button');n.className='btn s';n.type='button';n.setAttribute('onclick',"V51.h.sch126('"+m[1].replace(/[^0-9A-Za-z_-]/g,'')+"')");n.textContent=L('منحة','Scholarship')+(I.pct>0?' '+I.pct+'%':'');if(I.pct>0)n.style.cssText='border-color:#1a7f4b;color:#1a7f4b';b.insertAdjacentElement('afterend',n)})}
 if(me.r==='student'&&/^#\/student/.test(location.hash)){var box=document.querySelector('#app .box');if(!box||document.getElementById('sc126'))return;var s=stu(me.id);if(!s||!progOf(s))return;var I=info(s);if(!(I.pct>0))return;
  box.insertAdjacentHTML('afterend','<div class="box" id="sc126"><h3 style="margin-top:0">'+L('المنحة الدراسية','Scholarship')+'</h3><p><span class="tag ok">'+L(KN[I.kind][0],KN[I.kind][1])+' — <bdi dir="ltr">'+I.pct+'%</bdi></span>'+(I.a&&I.a.nameAr?' · '+esc(L(I.a.nameAr,I.a.nameEn||I.a.nameAr)):'')+'</p><p>'+L('الرسم المقرر للفصل: ','Set fee per semester: ')+'<b dir="ltr">'+esc(fm(I.d.base,I.d.cur))+'</b> · '+L('مبلغ الإعفاء: ','Waived amount: ')+'<b dir="ltr">'+esc(fm(I.off,I.d.cur))+'</b> · '+L('المستحق: ','Amount due: ')+'<b dir="ltr">'+esc(fm(I.d.due,I.d.cur))+'</b></p></div>')}
 }catch(e){console.warn('sch126 post',e)}}
try{GOH.post.push(post)}catch(e){}
})();

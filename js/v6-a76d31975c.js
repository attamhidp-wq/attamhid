
(function(){try{
const EN=()=>typeof LG!='undefined'&&LG=='en',B=(a,e)=>EN()?e:a;
const dip=()=>{try{return DIP}catch(e){return 1000}};
const DUMMY=()=>{let sm={name:'الفصل الدراسي الثاني (العام الثاني)',year:'السنة الدراسية الثانية'};try{sm=window.semOf(4)||sm}catch(e){}
 return{type:'dgrad',lang:'ar',rec:'TISA-PREVIEW',sid:'ST-2026-0000',name:'أحمد محمد التجريبي',nat:'—',pid:'0000000000',prog:dip(),gpa:'4.50',gterm:sm.name,gyear:sm.year,gdate:new Date().toISOString().slice(0,10),boardNo:'—',sessNo:'—',date:new Date().toISOString().slice(0,10)}};
function build(){
 const f=document.querySelector('form[onsubmit*="issueGrad"]');let c=DUMMY(),real=false;
 if(f){const sid=f.elements.sid&&f.elements.sid.value,bn=f.elements.boardNo&&f.elements.boardNo.value.trim(),sn=f.elements.sessNo&&f.elements.sessNo.value.trim();
  const s=sid&&S.students.find(x=>x.id==sid);
  if(s){try{const d=window.gradData(s);c=Object.assign(c,{rec:'TISA-PREVIEW',sid:s.id,name:s.name,nat:s.nat||'',pid:s.pid||'',gpa:d.gpa,gterm:d.gterm,gyear:d.gyear,gdate:d.gdate});real=true}catch(e){}}
  if(bn)c.boardNo=bn;if(sn)c.sessNo=sn}
 return{html:window.gradHTML(c),real}}
function fit(w){const k=w.querySelector('.lpv'),t=k&&k.firstElementChild;if(!t)return;k.style.setProperty('--z',1);const z=Math.min(1,(w.clientWidth-2)/t.offsetWidth);k.style.setProperty('--z',z)}
function render(){const w=document.getElementById('gpvb');if(!w)return;
 const r=build();w.innerHTML='<div class="lpv">'+r.html+'</div>';w.setAttribute('data-wm',B('معاينة — غير معتمدة','PREVIEW — NOT ISSUED'));
 const tg=document.getElementById('gpvt');if(tg)tg.textContent=r.real?B('بيانات الطالب المختار','Selected student data'):B('بيانات طالب تجريبي','Dummy student data');
 fit(w);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fit(w))}
const _gb=window.gradBox;
window.gradBox=function(){let h=_gb.apply(this,arguments);
 const p=`<div class="gpv" data-v6="1"><div class="gpvh"><b>${B('المعاينة الحية لوثيقة التخرج','Live graduation certificate preview')}</b><span class="gpvtag" id="gpvt"></span><button type="button" class="btn s" onclick="gpvOpen()">${B('عرض بحجم أكبر','Open larger view')}</button></div><p class="mu" style="margin:0 0 8px">${B('تُحدَّث المعاينة فور اختيار الطالب أو إدخال رقمي القرار والجلسة، وهي للمراجعة فقط ولا تُصدر الوثيقة.','The preview updates as you select a student or enter the decision and session numbers. It is for review only and does not issue the certificate.')}</p><div class="gpvw" id="gpvb" data-noi18n="1"></div></div>`;
 const i=h.indexOf('</form>');return i<0?h+p:h.slice(0,i+7)+p+h.slice(i+7)};
window.gpvOpen=function(){const r=build();show(r.html,'preview');const mb=document.getElementById('mb');if(mb)mb.innerHTML=`<button class="btn s" onclick="document.getElementById('mod').style.display='none'">${B('إغلاق','Close')}</button>`};
try{GOH.post.push(()=>{const w=document.getElementById('gpvb');if(w&&!w.firstChild){try{render()}catch(e){console.error('v6 preview',e)}}})}catch(e){console.error('v6 hook',e)}
['input','change'].forEach(ev=>document.addEventListener(ev,e=>{if(e.target&&e.target.closest&&e.target.closest('form[onsubmit*="issueGrad"]')){try{render()}catch(x){console.error(x)}}}));
window.addEventListener('resize',()=>{const w=document.getElementById('gpvb');if(w)fit(w)});
}catch(e){console.error('v6',e)}})();

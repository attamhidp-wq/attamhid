
/* v98 — بعد صدور شهادة التخرج: تتحدث شهادة التعريف، وتصدر «شهادة تزكية» في بوابة الطالب، وتُرسل رسالة التهنئة بالتخرج مع شهادة التخرج والسجل الأكاديمي وشهادة التزكية */
(function(){var V5=window.V51;if(!V5)return;var L=function(a,b){try{return V5.L?V5.L(a,b):a}catch(e){return a}};
function N(t){try{return t&&V5.termNames61?V5.termNames61(t):{ar:'',en:''}}catch(e){return {ar:'',en:''}}}
V5.grad98=function(st){try{if(!st||!st.id)return null;
 var c=(S.certs||[]).filter(function(x){return x&&!x.revoked&&/^(dgrad|ggrad|grad)$/.test(x.type||'')&&String(x.sid)===String(st.id)}).slice(-1)[0];
 if(!c&&!/متخرج|تخرج|خريج|graduat/i.test(String(st.status||'')))return null;
 var g=(c&&c.g52)||{},gd=String(g.gd||(c&&c.gdate)||st.gradDate||(c&&c.date)||'').slice(0,10),gt=null,at=null;
 try{gt=V5.gradTerm61&&V5.gradTerm61(st)}catch(e){}try{at=V5.admTerm61&&V5.admTerm61(st)}catch(e){}
 var GT=N(gt),AT=N(at);if(!GT.ar&&c&&c.gterm)GT={ar:c.gterm,en:''};
 return {c:c||null,gd:gd,gtAr:GT.ar||'',gtEn:GT.en||'',atAr:AT.ar||'',atEn:AT.en||'',gpa:(c&&c.gpa)||'',grAr:g.grAr||'',grEn:g.grEn||'',hAr:g.hAr||'',hEn:g.hEn||''}}catch(e){return null}};
function today(){try{return TODAY()}catch(e){return new Date().toISOString().slice(0,10)}}
V5.tzk98=function(st,G){G=G||V5.grad98(st);if(!G||!G.c)return null;
 var ex=(S.certs||[]).filter(function(x){return x.type==='rec'&&x.tzk&&String(x.sid)===String(st.id)&&!x.revoked}).slice(-1)[0];if(ex)return ex;
 var rec;try{rec=V5.newRec67?V5.newRec67(19):v51Serial(0,19)}catch(e){rec=v51Serial(0,19)}
 var c={type:'rec',tzk:1,rec:rec,sid:st.id,uid:st.id,name:st.name||'',nameEn:st.nameEn||'',prog:st.prog||G.c.prog,date:today(),at:new Date().toISOString(),lang:'bi',auto:1,by:'auto',grad:G.c.rec,rec_kind:'تزكية تخرج'};
 try{c.v51=V5.snapNow&&V5.snapNow('rec')}catch(e){}S.certs.push(c);try{aud(L('إصدار شهادة تزكية للخريج','Graduate testimonial issued'),c.rec,st.id+' · '+(st.name||''))}catch(e){}return c};
function central(){try{return typeof me!=='undefined'&&me&&me.r==='admin'&&!me.unit}catch(e){return false}}
function tick(){try{if(!central()||!S||!S.v51)return;var X=S.v51,ch=0;if(!X.grad98){X.grad98={base:new Date().toISOString()};ch=1}
 var base=String(X.grad98.base).slice(0,10);
 (S.students||[]).forEach(function(st){if(!st||st.deleted)return;var G=V5.grad98(st);if(!G||!G.c)return;
  if(!(S.certs||[]).some(function(x){return x.type==='rec'&&x.tzk&&String(x.sid)===String(st.id)&&!x.revoked})){V5.tzk98(st,G);ch=1}
  var iss=String(G.c.at||G.c.date||'').slice(0,10);
  if(!st.gradMail98&&st.email&&iss>=base&&V5.autoMail64){st.gradMail98={q:new Date().toISOString()};try{touch(st)}catch(e){}ch=1;V5.autoMail64(String(st.id),'grad')}});
 if(ch){try{save()}catch(e){}}}catch(e){console.warn('v98',e)}}
setTimeout(tick,4000);setInterval(tick,30000);
(function(){function wrap(f){if(!f||f.__m103)return f;var g=function(el,o){o=Object.assign({},o||{});if(window.__mailQ&&!(o.scale<=1.6))o.scale=1.6;return f.call(this,el,o)};g.__m103=1;return g}
 var cur=wrap(window.html2canvas);try{Object.defineProperty(window,'html2canvas',{configurable:true,enumerable:true,get:function(){return cur},set:function(v){cur=wrap(v)}})}catch(e){}})();
/* إرسال رسالة التهنئة بالتخرج بضغطة واحدة (مع شهادة التخرج والسجل الأكاديمي وشهادة التزكية) */
function grads(){return (S.students||[]).filter(function(st){return st&&!st.deleted&&V5.grad98(st)&&V5.grad98(st).c})}
var H9=V5.h=V5.h||{},busy9=0;
H9.grad98send=async function(ids,label){if(busy9)return;if(!central()){toast(L('الإرسال للإدارة المركزية فقط.','Central administration only.'));return}
 var L9=ids.map(function(id){return (S.students||[]).find(function(x){return String(x.id)===String(id)})}).filter(function(st){return st&&st.email});
 if(!L9.length){toast(L('لا يوجد خريج له بريد مسجَّل.','No graduate with a registered email.'));return}
 if(!confirm(L('إرسال رسالة التهنئة بالتخرج (مع شهادة التخرج والسجل الأكاديمي وشهادة التزكية) إلى ','Send the graduation email (with certificate, transcript and testimonial) to ')+L9.length+L(' خريج؟',' graduate(s)?')))return;
 busy9=1;var ok=0,bad=[];try{for(var i=0;i<L9.length;i++){var st=L9[i];V5.g98p=(i+1)+' / '+L9.length+' — '+st.name;try{go()}catch(e){}
  try{if(V5.tzk98)V5.tzk98(st)}catch(e){}var r=await V5.send64(String(st.id),'grad');if(r&&r.ok)ok++;else bad.push(st.name+' ('+((r&&r.error)||'?')+')')}}
 finally{busy9=0;V5.g98p='';V5.mlog64=null}
 try{save()}catch(e){}toast(L('أُرسلت: ','Sent: ')+ok+(bad.length?L(' · تعذّر: ',' · Failed: ')+bad.join('، '):''));try{go()}catch(e){}};
H9.grad98all=function(all){var ids=grads().filter(function(st){return st.email&&(all||!(st.gradMail98&&st.gradMail98.at))}).map(function(st){return String(st.id)});
 if(!ids.length){toast(L('وصلت الرسالة إلى كل الخريجين. لإعادة الإرسال استخدم «إعادة الإرسال للجميع».','All graduates already received it. Use “Resend to all” to send again.'));return}H9.grad98send(ids)};
function esc9(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function syncLog9(){if(V5.g98log&&Date.now()-V5.g98log<60000)return;V5.g98log=Date.now();try{V5.fn63({action:'mail_log',limit:300}).then(function(r){if(!r||!r.ok)return;var ch=0;(r.items||[]).forEach(function(it){if(it.type!=='grad'||it.status!=='sent')return;var st=(S.students||[]).find(function(x){return String(x.id)===String(it.ref_id)});if(st&&!(st.gradMail98&&st.gradMail98.at)){st.gradMail98={at:it.sent_at||it.at,to:it.to};try{touch(st)}catch(e){}ch=1}});if(ch){try{save()}catch(e){}if(!busy9)try{go()}catch(e){}}})}catch(e){}}
function box9(){syncLog9();var G=grads(),pend=G.filter(function(st){return st.email&&!(st.gradMail98&&st.gradMail98.at)}).length;
 return '<div class="box g98" style="margin-bottom:14px"><h3 style="margin-top:0">'+L('رسالة التهنئة بالتخرج','Graduation email')+'</h3><p class="mu">'+L('تُرسل تلقائياً لكل من تصدر له شهادة التخرج، ومعها شهادة التخرج والسجل الأكاديمي وشهادة التزكية. وللخريجين السابقين أرسلها هنا بضغطة واحدة.','Sent automatically to every new graduate with the graduation certificate, transcript and testimonial attached. For earlier graduates, send it here with one click.')+'</p>'+
  (V5.g98p?'<p class="msg">'+L('… جارٍ الإرسال: ','… Sending: ')+esc9(V5.g98p)+'<br><small id="g98s"></small></p>':'')+
  '<p><button class="btn" onclick="V51.h.grad98all(0)"'+(pend&&!busy9?'':' disabled')+'>'+L('إرسال لكل الخريجين الذين لم تصلهم','Send to all graduates not yet emailed')+' ('+pend+')</button> <button class="btn s" onclick="V51.h.grad98all(1)"'+(busy9?' disabled':'')+'>'+L('إعادة الإرسال للجميع','Resend to all')+'</button></p>'+
  '<div class="tw"><table class="v51t"><tr><th>'+L('الرقم','No.')+'</th><th>'+L('الخريج','Graduate')+'</th><th>'+L('البريد','Email')+'</th><th>'+L('تاريخ التخرج','Graduation date')+'</th><th>'+L('الرسالة','Email')+'</th><th></th></tr>'+
  (G.length?G.map(function(st){var g=V5.grad98(st),m=st.gradMail98&&st.gradMail98.at;return '<tr><td dir="ltr">'+esc9(st.id)+'</td><td>'+esc9(st.name)+'</td><td dir="ltr">'+(st.email?esc9(st.email):'<span class="tag er">'+L('لا يوجد بريد','No email')+'</span>')+'</td><td dir="ltr">'+esc9(g.gd)+'</td><td>'+(m?'<span class="tag ok">'+L('أُرسلت ','Sent ')+esc9(String(m).slice(0,10))+'</span>':'<span class="tag">'+L('لم تُرسل','Not sent')+'</span>')+'</td><td>'+(st.email?'<button class="btn s"'+(busy9?' disabled':'')+' onclick="V51.h.grad98send([\''+esc9(st.id)+'\'])">'+L(m?'إعادة الإرسال':'إرسال',m?'Resend':'Send')+'</button>':'')+'</td></tr>'}).join(''):'<tr><td colspan="6" class="mu">'+L('لا يوجد خريجون بعد.','No graduates yet.')+'</td></tr>')+'</table></div></div>'}
V5.gradBox98=box9;
try{GOH.post.push(function(){try{if(!central()||typeof tab==='undefined'||(tab!=='v64m'&&tab!=='v98g'))return;var anc=[].slice.call(document.querySelectorAll('#app p.mu')).find(function(p){return /^(رسائل رسمية ثنائية اللغة|Official bilingual messages)/.test(p.textContent.trim())});if(!anc)return;
 var old=document.querySelector('.g98');if(old)old.remove();var d=document.createElement('div');d.innerHTML=box9();anc.parentElement.insertBefore(d.firstElementChild,anc)}catch(e){console.warn('g98',e)}})}catch(e){}
try{GOH.post.push(function(){setTimeout(tick,300)})}catch(e){}
})();

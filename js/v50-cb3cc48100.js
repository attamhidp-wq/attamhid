
/* ===== v50: سجل أكاديمي ثنائي اللغة كلياً · عزل لغوي ديناميكي · جاهزية Supabase (ترحيل الدفعة الأولى + مزامنة لحظية + تشخيص) ===== */
(function(){try{
 var lg=function(){return typeof LG!=='undefined'?LG:'ar'};

 /* 1) أسماء المقررات بالإنجليزية تُحفظ مع المقرر نفسه (فتُرحَّل إلى Supabase ضمن بيانات البرنامج) */
 function seedEn(){if(typeof S==='undefined'||!window.TMX||typeof P!=='function'||typeof DIP==='undefined')return;
  var D=P(DIP);if(!D||!D.courses)return;var ch=false;
  D.courses.forEach(function(c){if(c&&!c.nameEn){var en=TMX.courseEn(c.code,c.name);if(en){c.nameEn=en;ch=true}}});
  if(ch&&typeof save==='function')save()}
 try{seedEn()}catch(e){console.error('v50 seedEn',e)}
 var _g=window.go;if(typeof _g==='function')window.go=function(){try{seedEn()}catch(e){}return _g.apply(this,arguments)};

 /* 2) اتجاه الأقواس والأرقام في السجل الأكاديمي (RTL/LTR) */
 var _t=window.tmTranscript;
 if(typeof _t==='function'&&typeof window.bidiFix48==='function')window.tmTranscript=function(){var h=_t.apply(this,arguments);try{return window.bidiFix48(h)}catch(e){return h}};

 /* 3) عزل لغوي ديناميكي لواجهات الإدارة والطالب والأستاذ: «عربي / English» و«عربي (English)» */
 var SKIPQ='.cert,.cert2,.tmw,#pvw,#lpv,[data-noi18n],script,style,textarea,input,code,pre';
 var FILE=/^(PDF|CSV|PNG|JPG|JPEG|SVG|ZIP|JSON|QR|XLSX|URL|Excel)$/i;
 var R1=/^([\u0600-\u06FF][^A-Za-z]*?)\s*\/\s*([A-Za-z][A-Za-z0-9 .,'\-()\/]*)$/;
 var R2=/^([\u0600-\u06FF][^A-Za-z(]*?)\s*\(([A-Za-z][A-Za-z0-9 .\-\/]*)\)$/;
 function fx(n){var v=n.nodeValue;if(!v||v.length>160)return;var t=v.trim();if(!t)return;var p=n.parentNode;
  if(!p||!p.closest||p.closest(SKIPQ))return;if(p.nodeName==='OPTION'&&!p.hasAttribute('value'))return;
  var L=lg(),m,out=null;
  if(L==='ar'){if(m=t.match(R1))out=m[1];else if((m=t.match(R2))&&!FILE.test(m[2].trim()))out=m[1]}
  else if(L==='en'){if(m=t.match(R1))out=m[2]}
  if(out!==null&&out!==t)n.nodeValue=v.replace(t,out)}
 function pass(r){if(!r)return;if(r.nodeType===3){fx(r);return}if(r.nodeType!==1)return;
  var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT),n,L=[];while(n=w.nextNode())L.push(n);L.forEach(fx)}
 new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='characterData'){pass(m.target);return}m.addedNodes.forEach(pass)})}).observe(document.body,{childList:true,subtree:true,characterData:true});
 pass(document.body);

 /* 4) ترحيل الدفعة الأولى (2024–2025) وتأكيده في قاعدة البيانات الحية — مرة واحدة، ثم يُحترم أي حذف لاحق */
 var CO=['ST-2024-001','ST-2024-002','ST-2024-003','ST-2024-004','ST-2024-005'];
 async function ensureCohort(){
  if(typeof sb==='undefined'||!sb||typeof sbAdmin==='undefined'||!sbAdmin)return;
  try{
   var mk=await sb.from('settings').select('key,data').eq('key','cohort2425').maybeSingle();
   if(mk&&mk.data&&mk.data.data&&mk.data.data.done)return;
   if(CO.some(function(id){var a=(window.V51&&V51.alias61)?V51.alias61(id):id;return!(S.students||[]).some(function(s){return s.id===id||s.id===a})})){S.cfg=S.cfg||{};delete S.cfg.m48;if(typeof window.mig48==='function')window.mig48()}
   save0();await sbPush();
   var CO2=CO.map(function(id){return (window.V51&&V51.alias61)?V51.alias61(id):id});var chk=await sb.from('students').select('id').in('id',CO2);
   var ids=(chk.data||[]).map(function(r){return r.id});
   if(CO2.every(function(id){return ids.indexOf(id)>-1})){
    var up=await sb.from('settings').upsert([{key:'cohort2425',data:{done:true,ids:CO,at:new Date().toISOString()}}]);
    if(!up.error)toast('تم ترحيل الدفعة الأولى (2024–2025) وتأكيدها في قاعدة البيانات.')}
   else toast('تعذر تأكيد ترحيل الدفعة الأولى في Supabase؛ سيُعاد المحاولة عند الدخول التالي.')
  }catch(e){console.error('v50 cohort',e)}}
 if(typeof sbPull==='function'){var _p=sbPull;sbPull=async function(){var r=await _p.apply(this,arguments);await ensureCohort();return r}}

 /* 5) مزامنة لحظية (Realtime) للإدارة مع بقاء الاستطلاع الدوري احتياطياً */
 var chan=null,tm=0;
 function rt(){if(typeof sb==='undefined'||!sb||chan)return;
  try{chan=sb.channel('tamhid-live');
   ['requests','submissions','doc_requests'].forEach(function(t){chan.on('postgres_changes',{event:'*',schema:'public',table:t},function(){clearTimeout(tm);tm=setTimeout(function(){try{sbRefresh()}catch(e){}},400)})});
   chan.subscribe()}catch(e){console.error('v50 rt',e);chan=null}}
 setInterval(function(){if(typeof sbAdmin!=='undefined'&&sbAdmin)rt();else if(chan){try{sb.removeChannel(chan)}catch(e){}chan=null}},4000);

 /* 6) تشخيص الجاهزية: يُشغَّل من وحدة التحكم  sbDiag()  أثناء دخول الإدارة */
 window.sbDiag=async function(){
  if(typeof sb==='undefined'||!sb){toast('تعذر الاتصال بـ Supabase');return}
  var T=['programs','news','library','students','faculty','requests','certs','doc_requests','submissions','exams','exam_questions','settings','profiles'],R=[];
  for(var i=0;i<T.length;i++){var q=await sb.from(T[i]).select('*',{count:'exact',head:true});R.push({table:T[i],ok:!q.error,rows:q.count,err:q.error?q.error.message:''})}
  var F=[['verify_cert',{q:'X'}],['verify_person',{q:'X'}],['login_email',{ident:'x'}],['exam_paper',{eid:'0'}]];
  for(var j=0;j<F.length;j++){var r=await sb.rpc(F[j][0],F[j][1]);R.push({table:'rpc:'+F[j][0],ok:!(r.error&&/PGRST202|404|not exist|not find/i.test(r.error.message+(r.error.code||''))),rows:'',err:r.error?r.error.message:''})}
  var c=await sb.from('students').select('id').in('id',CO);R.push({table:'cohort 2024-2025',ok:(c.data||[]).length===5,rows:(c.data||[]).length,err:''});
  console.table(R);var bad=R.filter(function(x){return!x.ok}).length;toast(bad?('تشخيص Supabase: '+bad+' عنصر يحتاج مراجعة (انظر وحدة التحكم)'):'تم تشخيص Supabase: كل الجداول والدوال والدفعة الأولى سليمة.');return R};
}catch(e){console.error('v50',e)}})();

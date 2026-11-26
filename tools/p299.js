/* =====================================================================
   v299 — إصدار شهادات التخرج للدفعة بضغطة واحدة
   يُدخَل رقم قرار مجلس الشؤون التعليمية ورقم الجلسة وتاريخ القرار مرة واحدة للدفعة،
   فتصدر شهادات جميع المستحقين دفعة واحدة. من ينقصه بيان يُستثنى ويُذكر ما ينقصه
   ولا يوقف الدفعة. خيار: اعتماد حالة «متخرج» لمن أكمل المتطلبات ولم تُعتمد حالته بعد.
   لا تُنشأ أرقام القرارات تلقائياً. كل إصدار يُسجَّل في سجل التدقيق. لا بيانات شخصية.
   ===================================================================== */
(function(){try{
var W=window,V5=W.V51||{};
var L=function(a,e){try{return (V5.L||W.L)(a,e)}catch(x){return a}};
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var DIPID=function(){try{return DIP}catch(e){return 1000}};
var TD=function(){return new Date().toISOString().slice(0,10)};
var hasGrad=function(s){return (S.certs||[]).some(function(c){return c.type==='dgrad'&&c.sid==s.id&&!c.revoked})};
var mkDoc=function(s,v){var d=(W.gradData?W.gradData(s):{})||{};
 return {type:'dgrad',lang:'ar',sid:s.id,uid:s.id,name:s.name,nameEn:s.nameEn||'',sex:s.sex||s.gender||'',nat:s.nat||'',natEn:s.natEn||'',pid:s.pid||'',prog:DIPID(),
  gpa:d.gpa,gterm:d.gterm,gyear:d.gyear,gdate:d.gdate,boardNo:v.boardNo,sessNo:v.sessNo,decDate:v.decDate,date:TD()}};
var missOf=function(c){try{var m=V5.miss55?V5.miss55(Object.assign({rec:'CHECK299'},c)):[];return m.map(function(x){return L(x.ar,x.en)})}catch(e){return []}};
/* تصنيف طلاب الدبلوم */
var scan=function(v){var R={ready:[],status:[],miss:[],no:[]};
 (S.students||[]).forEach(function(s){if(!s||s.deleted||+s.prog!==DIPID()||hasGrad(s))return;
  var r=W.gradElig?W.gradElig(s):{ok:0,why:'—'},needSt=false;
  if(!r.ok&&s.status!=='متخرج'){var r2=W.gradElig(Object.assign({},s,{status:'متخرج'}));if(r2.ok){r=r2;needSt=true}}
  if(!r.ok){if(s.status==='متخرج'||/مستوى|level/i.test(String(s.lvl||''))||+s.lvl>=4)R.no.push([s,r.why]);return}
  var m=missOf(mkDoc(s,v||{boardNo:'x',sessNo:'x',decDate:TD()})).filter(function(x){return !/قرار|جلسة|Decision|Session/i.test(x)});
  if(m.length)R.miss.push([s,m]);else (needSt?R.status:R.ready).push(s)});
 return R};
var last=function(){try{return (S.v51&&S.v51.batch299&&S.v51.batch299.last)||{}}catch(e){return {}}};
W.gradBatch299=function(){var R=scan(),lv=last(),n=R.ready.length+R.status.length;
 var row=function(s,tag){return '<label style="display:flex;gap:.5em;align-items:center;margin:.15em 0"><input type="checkbox" style="width:auto" name="b299" value="'+E(s.id)+'" checked> <span>'+E(s.name)+' <small class="mu" dir="ltr">('+E(s.id)+')</small>'+(tag||'')+'</span></label>'};
 var h='<div class="box" id="b299" style="margin-bottom:16px;border-inline-start:4px solid #1F7A4A"><h3>'+L('إصدار شهادات التخرج للدفعة','Issue graduation certificates for the cohort')+'</h3>'+
  '<p class="mu">'+L('أدخل رقم القرار ورقم الجلسة وتاريخ القرار مرة واحدة، ثم اضغط زراً واحداً: تصدر شهادات جميع المستحقين المحدَّدين أدناه بالقرار نفسه. من ينقصه بيان لا تصدر شهادته ويُذكر ما ينقصه، ولا يوقف ذلك بقية الدفعة.','Enter the decision number, session number and decision date once, then press one button: certificates are issued to all eligible students selected below under the same decision. Anyone with missing data is skipped and the missing items are listed, without stopping the rest of the cohort.')+'</p>';
 if(!n&&!R.miss.length){h+='<p>'+L('لا يوجد حالياً طلاب مستحقون لم تصدر لهم شهادة تخرج.','There are currently no eligible students without a graduation certificate.')+'</p>'}
 h+='<form onsubmit="return gradBatch299Go(this)">'+
  '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.6em">'+
  '<label>'+L('رقم قرار مجلس الشؤون التعليمية','Board of Educational Affairs decision No.')+'<input name="boardNo" required dir="ltr" value="'+E(lv.boardNo||'')+'"></label>'+
  '<label>'+L('رقم الجلسة','Session No.')+'<input name="sessNo" required dir="ltr" value="'+E(lv.sessNo||'')+'"></label>'+
  '<label>'+L('تاريخ القرار','Decision date')+'<input name="decDate" type="date" required value="'+E(lv.decDate||'')+'"></label></div>';
 if(R.ready.length)h+='<h4>'+L('المستحقون','Eligible')+' ('+R.ready.length+')</h4>'+R.ready.map(function(s){return row(s)}).join('');
 if(R.status.length)h+='<h4>'+L('أكملوا المتطلبات ولم تُعتمد حالة تخرجهم بعد','Completed the requirements; graduation status not yet approved')+' ('+R.status.length+')</h4>'+
  '<p class="mu" style="margin:.2em 0">'+L('عند الإصدار تُعتمد حالتهم «متخرج» تلقائياً.','On issue, their status is set to “Graduated” automatically.')+'</p>'+R.status.map(function(s){return row(s,' <span class="tag">'+L('تُعتمد حالته','status to approve')+'</span>')}).join('');
 if(n)h+='<p style="margin-top:.8em"><button class="btn">'+L('إصدار شهادات جميع المحدَّدين','Issue certificates for all selected')+' ('+n+')</button> <label style="display:inline-flex;gap:.3em;align-items:center"><input type="checkbox" style="width:auto" onclick="var v=this.checked;document.querySelectorAll(\'#b299 input[name=b299]\').forEach(function(c){c.checked=v})" checked> '+L('تحديد الكل','Select all')+'</label></p>';
 h+='</form>';
 if(R.miss.length)h+='<details open><summary><b>'+L('مستحقون ينقصهم بيان (لا تصدر شهاداتهم حتى يُستكمل)','Eligible but with missing data (not issued until completed)')+' ('+R.miss.length+')</b></summary><ul>'+R.miss.map(function(x){return '<li>'+E(x[0].name)+' <small class="mu" dir="ltr">('+E(x[0].id)+')</small>: '+E(x[1].join('، '))+'</li>'}).join('')+'</ul></details>';
 var B=(S.v51&&S.v51.batch299&&S.v51.batch299.log)||[];
 if(B.length)h+='<details><summary>'+L('الدفعات السابقة','Previous batches')+' ('+B.length+')</summary><table class="tbl"><tr><th>'+L('رقم القرار','Decision No.')+'</th><th>'+L('رقم الجلسة','Session No.')+'</th><th>'+L('تاريخ القرار','Decision date')+'</th><th>'+L('عدد الشهادات','Certificates')+'</th><th>'+L('تاريخ الإصدار','Issued on')+'</th></tr>'+
  B.slice().reverse().map(function(b){return '<tr><td dir="ltr">'+E(b.boardNo)+'</td><td dir="ltr">'+E(b.sessNo)+'</td><td dir="ltr">'+E(b.decDate)+'</td><td>'+E(b.n)+'</td><td dir="ltr">'+E(String(b.at||'').slice(0,10))+'</td></tr>'}).join('')+'</table></details>';
 return h+'</div>'};
W.gradBatch299Go=function(f){try{
 var v={boardNo:String(f.boardNo.value||'').trim(),sessNo:String(f.sessNo.value||'').trim(),decDate:String(f.decDate.value||'').trim()};
 if(!v.boardNo||!v.sessNo||!/^\d{4}-\d{2}-\d{2}$/.test(v.decDate)){toast(L('أدخل رقم القرار ورقم الجلسة وتاريخ القرار.','Enter the decision number, session number and decision date.'));return false}
 var ids=[].slice.call(f.querySelectorAll('input[name=b299]:checked')).map(function(i){return i.value});
 if(!ids.length){toast(L('حدِّد طالباً واحداً على الأقل.','Select at least one student.'));return false}
 if(!confirm(L('إصدار ','Issue ')+ids.length+L(' شهادة تخرج بالقرار رقم ',' graduation certificate(s) under decision No. ')+v.boardNo+L(' والجلسة رقم ',' and session No. ')+v.sessNo+L('؟ لا يمكن التراجع إلا بإلغاء كل شهادة على حدة.','? This can only be undone by revoking each certificate individually.')))return false;
 var R=scan(v),ok={},st={};R.ready.forEach(function(s){ok[s.id]=1});R.status.forEach(function(s){ok[s.id]=1;st[s.id]=1});
 var done=[],skip=[];
 ids.forEach(function(id){var s=(S.students||[]).find(function(x){return x.id==id});if(!s||!ok[s.id]||hasGrad(s)){skip.push(id);return}
  if(st[s.id]){s.status='متخرج';if(!s.gradDate)s.gradDate=((W.gradData&&W.gradData(Object.assign({},s,{status:'متخرج'})))||{}).gdate||TD()}
  var c=mkDoc(s,v),m=missOf(c);if(m.length){skip.push(id);return}
  c.rec=W.v51Serial(0,'dgrad');c.batch299=v.boardNo+'/'+v.sessNo;
  try{if(V5.snapNow)c.v51=V5.snapNow('dgrad',c.prog);if(V5.freeze52)V5.freeze52(c)}catch(e){}
  S.certs.push(c);done.push(c.rec)});
 S.v51=S.v51||{};var b=S.v51.batch299||(S.v51.batch299={log:[]});b.last=v;b.log=(b.log||[]).concat([{boardNo:v.boardNo,sessNo:v.sessNo,decDate:v.decDate,n:done.length,at:new Date().toISOString(),by:(V5.who?V5.who():'admin')}]).slice(-50);
 try{(V5.aud||W.audit4)(L('إصدار شهادات تخرج للدفعة','Cohort graduation certificates issued'),'—',done.length+L(' شهادة — القرار ',' certificate(s) — decision ')+v.boardNo+L(' / الجلسة ',' / session ')+v.sessNo+L(' بتاريخ ',' dated ')+v.decDate)}catch(e){}
 save();toast(L('صدرت ','Issued ')+done.length+L(' شهادة تخرج.',' graduation certificate(s).')+(skip.length?L(' لم تصدر ',' Not issued: ')+skip.length+L(' لنقص البيانات أو لعدم الاستحقاق.',' (missing data or not eligible).'):''));
 try{go()}catch(e){}
}catch(e){console.error('v299',e);toast(L('تعذّر الإصدار: ','Issue failed: ')+e.message)}return false};
/* يحل محل صندوق الدفعة القديم في تبويب الوثائق */
var _gb=W.gradBox;if(typeof _gb==='function'&&!_gb.__v299){W.gradBox=function(){var h=_gb.apply(this,arguments);
 try{h=String(h).replace(/<div class="box" style="margin-bottom:16px"><h3>إصدار وثائق التخرج للدفعة<\/h3>[\s\S]*?<\/form><\/div>/,'');return W.gradBatch299()+h}catch(e){return h}};W.gradBox.__v299=1}
V5.batch299={scan:scan};
}catch(e){console.error('v299',e)}})();

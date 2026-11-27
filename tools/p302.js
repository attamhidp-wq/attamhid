/* =====================================================================
   v302 — نشر نتائج الخريجين السابقين (دفعات انتهت فصولها)
   زر نشر الفصل لا يعرض إلا الفصول الحالية، فتبقى نتائج دفعة سابقة غير منشورة ولا يؤهَّل طلابها للتخرج.
   هنا تُعرض قائمة من اعتُمدت حالتهم «متخرج» ولهم درجات مرصودة غير منشورة، وبزر واحد تُنشر عبر الخادم
   (grad_pub_old: للإدارة فقط، بلا بريد للطلاب، ويُسجَّل في سجل التدقيق). لا بيانات شخصية في الشيفرة.
   ===================================================================== */
(function(){try{
var W=window,V5=W.V51||{};
var L=function(a,e){try{return (V5.L||W.L)(a,e)}catch(x){return a}};
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var ST={rows:null};
W.gradPub302Load=function(){try{
 var el=document.getElementById('gp302');if(!el||typeof sb==='undefined'||!sb||!sb.rpc)return;
 sb.rpc('grad_pub_scan').then(function(r){var d=(r&&r.data)||[];ST.rows=d;draw()},function(){})}catch(e){}};
function nameOf(id){var s=(S.students||[]).find(function(x){return x.id==id});return s?s.name:id}
function draw(){var el=document.getElementById('gp302');if(!el)return;var d=ST.rows||[];
 if(!d.length){el.innerHTML='';el.style.display='none';return}
 el.style.display='';
 el.innerHTML='<h3>'+L('نشر نتائج الخريجين السابقين','Publish results of previous graduates')+'</h3>'+
  '<p class="mu">'+L('هؤلاء الخريجون درجاتهم مرصودة لكنها غير منشورة، ولذلك لا يُحتسبون مؤهَّلين لوثيقة التخرج. زر نشر الفصل لا يعرض الدفعات السابقة، فانشر نتائجهم من هنا. لا يُرسَل بريد للطلاب.','These graduates have recorded but unpublished grades, so they do not count as eligible for the graduation certificate. The semester publish button does not list previous cohorts, so publish them here. No email is sent.')+'</p>'+
  d.map(function(x){return '<label style="display:flex;gap:.5em;align-items:center;margin:.15em 0"><input type="checkbox" style="width:auto" name="gp302" value="'+E(x.sid)+'" checked> <span>'+E(nameOf(x.sid))+' <small class="mu" dir="ltr">('+E(x.sid)+')</small> — '+E(x.n)+' '+L('مقرراً','course(s)')+'</span></label>'}).join('')+
  '<p style="margin-top:.6em"><button type="button" class="btn" onclick="gradPub302Go()">'+L('نشر نتائج المحدَّدين','Publish selected results')+'</button></p>'}
W.gradPub302Go=function(){try{
 var ids=[].slice.call(document.querySelectorAll('#gp302 input[name=gp302]:checked')).map(function(i){return i.value});
 if(!ids.length){toast(L('حدِّد طالباً واحداً على الأقل.','Select at least one student.'));return}
 if(!confirm(L('نشر نتائج ','Publish the results of ')+ids.length+L(' خريج؟ ستظهر الدرجات في حساب الطالب، ولا يُرسَل بريد.',' graduate(s)? Grades will be visible to the student; no email is sent.')))return;
 sb.rpc('grad_pub_old',{p_sids:ids}).then(function(r){
  if(r&&r.error){toast(L('تعذَّر النشر: ','Publishing failed: ')+(r.error.message||''));return}
  var today=new Date().toISOString().slice(0,10);
  ids.forEach(function(id){var s=(S.students||[]).find(function(x){return x.id==id});if(!s)return;
   Object.keys(s.gr||{}).forEach(function(k){var g=s.gr[k];if(g&&g.fin&&!g.rel){g.rel=1;g.relDate=today;g.pub270=1}})});
  toast(L('نُشرت النتائج: ','Results published: ')+((r.data&&r.data.n)||0)+L(' مقرراً',' course(s)'));
  ST.rows=null;
  try{if(typeof render==='function')render()}catch(e){}
  setTimeout(W.gradPub302Load,300)},function(e){toast(String(e&&e.message||e))})}catch(e){console.error('gp302',e)}};
var _gb=W.gradBox;
if(typeof _gb==='function'&&!_gb.__v302){W.gradBox=function(){var h=_gb.apply(this,arguments);
 try{setTimeout(W.gradPub302Load,60)}catch(e){}
 return '<div class="box" id="gp302" style="margin-bottom:16px;border-inline-start:4px solid #B7791F;display:none"></div>'+h};W.gradBox.__v302=1}
}catch(e){console.error('v302',e)}})();

/* =====================================================================
   v297 — فرص العمل للخريجين (صفحة عامة + إدارة + إشعار الخريجين في المجال)،
   ولوحة مؤشرات مجلس الشؤون التعليمية (قراءة فقط). لا بيانات شخصية في الشيفرة.
   ===================================================================== */
(function(){try{
var W=window,X=W.V51;if(!X)return;var H=X.h||(X.h={}),FT=X.ft225||{};
var Lx=function(a,e){try{return L(a,e)}catch(x){return a}};
var e9=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var rpc=async function(n,a){if(typeof sb==='undefined'||!sb)throw new Error('offline');var r=await sb.rpc(n,a||{});if(r.error)throw r.error;return r.data};
var T=function(m){try{toast(m)}catch(e){}};
var G=X.g297||(X.g297={});
var FIELDS=[['teach','التعليم','Teaching'],['translate','الترجمة','Translation'],['religious','العمل الديني والدعوي','Religious work'],['media','الإعلام والكتابة','Media & writing'],['business','الأعمال','Business'],['study','الدراسات العليا','Graduate studies'],['other','غير ذلك','Other']];
var fName=function(k){var f=FIELDS.find(function(x){return x[0]===k});return f?Lx(f[1],f[2]):''};
var KINDS=[['full','دوام كامل','Full-time'],['part','دوام جزئي','Part-time'],['remote','عن بُعد','Remote'],['contract','عقد مؤقت','Contract'],['volunteer','تطوعي','Volunteer']];
var kName=function(k){var f=KINDS.find(function(x){return x[0]===k});return f?Lx(f[1],f[2]):''};
var safeUrl=function(u){u=String(u||'').trim();if(/^https:\/\//i.test(u))return '<a href="'+e9(u)+'" target="_blank" rel="noopener nofollow">'+Lx('التقديم','Apply')+'</a>';if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(u))return '<a href="mailto:'+e9(u)+'">'+e9(u)+'</a>';return e9(u)};
var dmy=function(d){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(d||''));return m?m[3]+'/'+m[2]+'/'+m[1]:''};

/* ---------- صفحة فرص العمل العامة ---------- */
V.jobs=function(){if(G.jobs===undefined){G.jobs=null;rpc('v297_jobs').then(function(d){G.jobs=d||[];var a=document.getElementById('app');if(a&&/^#\/jobs\b/.test(location.hash))a.innerHTML=V.jobs()}).catch(function(){G.jobs=[];G.jErr=1})}
 var q=String(G.jq||'').trim().toLowerCase(),f=G.jf||'',L0=(G.jobs||[]).filter(function(j){return (!f||j.field===f)&&(!q||[j.title,j.org,j.city,j.descr].join(' ').toLowerCase().indexOf(q)>=0)});
 return '<h2>'+Lx('فرص العمل للخريجين','Jobs for graduates')+'</h2><p class="mu">'+Lx('إعلانات وظائف ينشرها المعهد وجهاته الشريكة لخريجيه. يصل الخريجين المنضمين إلى دليل الخريجين إشعار بالفرص المناسبة لمجالهم.','Job announcements published by the Institute and its partners. Graduates in the alumni directory are notified of jobs in their field.')+' <a href="#/alumni">'+Lx('دليل الخريجين','Alumni directory')+'</a></p>'+
  '<div class="box" style="display:flex;flex-wrap:wrap;gap:8px"><input id="jq297" style="flex:1;min-width:200px" placeholder="'+e9(Lx('ابحث بالمسمى أو الجهة أو المدينة…','Search by title, organization or city…'))+'" value="'+e9(G.jq||'')+'" oninput="V51.h.jq297(this.value)"><select onchange="V51.h.jf297(this.value)"><option value="">'+Lx('كل المجالات','All fields')+'</option>'+FIELDS.map(function(x){return '<option value="'+x[0]+'"'+(f===x[0]?' selected':'')+'>'+Lx(x[1],x[2])+'</option>'}).join('')+'</select></div>'+
  (G.jobs===null?'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>':!L0.length?'<p class="mu">'+Lx('لا توجد فرص منشورة حالياً.','No jobs are published at the moment.')+'</p>':L0.map(function(j){return '<div class="box"><h3 style="margin:0 0 4px">'+e9(j.title)+'</h3><div class="mu">'+[j.org,j.city,fName(j.field),kName(j.kind),j.deadline?Lx('آخر موعد: ','Deadline: ')+dmy(j.deadline):''].filter(Boolean).map(e9).join(' · ')+'</div>'+(j.descr?'<p style="white-space:pre-wrap">'+e9(j.descr)+'</p>':'')+(j.apply?'<div>'+Lx('طريقة التقديم: ','How to apply: ')+safeUrl(j.apply)+'</div>':'')+'</div>'}).join(''))};
H.jq297=function(v){G.jq=v;var a=document.getElementById('app');if(!a)return;a.innerHTML=V.jobs();var i=document.getElementById('jq297');if(i){i.focus();try{i.setSelectionRange(v.length,v.length)}catch(e){}}};
H.jf297=function(v){G.jf=v;var a=document.getElementById('app');if(a)a.innerHTML=V.jobs()};

/* ---------- إدارة الفرص (تبويب في لوحة الإدارة) ---------- */
var jobsView=function(){if(G.ja===undefined){G.ja=null;FT.rpc('v297_jobs_admin').then(function(d){G.ja=d||[];go()}).catch(function(){G.ja=[];go()})}
 var e=G.je||{};
 var form='<form class="box" onsubmit="return V51.h.js297(this)"><b>'+(e.id?Lx('تعديل فرصة','Edit job'):Lx('نشر فرصة عمل جديدة','Publish a new job'))+'</b><input type="hidden" name="id" value="'+e9(e.id||'')+'">'+
  '<label>'+Lx('المسمى الوظيفي','Job title')+' *<input name="title" required maxlength="160" value="'+e9(e.title||'')+'"></label><label>'+Lx('الجهة','Organization')+'<input name="org" maxlength="160" value="'+e9(e.org||'')+'"></label>'+
  '<label>'+Lx('المجال','Field')+'<select name="field"><option value="">'+Lx('كل المجالات','All fields')+'</option>'+FIELDS.map(function(x){return '<option value="'+x[0]+'"'+(e.field===x[0]?' selected':'')+'>'+Lx(x[1],x[2])+'</option>'}).join('')+'</select></label>'+
  '<label>'+Lx('نوع العمل','Type')+'<select name="kind"><option value=""></option>'+KINDS.map(function(x){return '<option value="'+x[0]+'"'+(e.kind===x[0]?' selected':'')+'>'+Lx(x[1],x[2])+'</option>'}).join('')+'</select></label>'+
  '<label>'+Lx('المدينة والدولة','City and country')+'<input name="city" maxlength="80" value="'+e9(e.city||'')+'"></label><label>'+Lx('آخر موعد للتقديم','Deadline')+'<input type="date" name="deadline" value="'+e9(e.deadline||'')+'"></label>'+
  '<label>'+Lx('الوصف والشروط','Description and requirements')+'<textarea name="descr" rows="4" maxlength="3000">'+e9(e.descr||'')+'</textarea></label><label>'+Lx('طريقة التقديم (رابط https أو بريد)','How to apply (https link or email)')+'<input name="apply" dir="ltr" maxlength="300" value="'+e9(e.apply||'')+'"></label>'+
  (e.id?'<label><input type="checkbox" name="active" value="true"'+(e.active!==false?' checked':'')+'> '+Lx('منشورة','Published')+'</label>':'<p class="mu">'+Lx('عند النشر يصل إشعار للخريجين المنضمين إلى الدليل في هذا المجال.','On publishing, graduates in the directory in this field are notified.')+'</p>')+
  '<button class="btn">'+(e.id?Lx('حفظ','Save'):Lx('نشر','Publish'))+'</button>'+(e.id?' <button type="button" class="btn s" onclick="V51.h.je297(null)">'+Lx('إلغاء','Cancel')+'</button>':'')+'</form>';
 var list=G.ja===null?'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>':!G.ja.length?'<p class="mu">'+Lx('لا فرص بعد.','No jobs yet.')+'</p>':'<div class="box"><table><tr><th>'+Lx('المسمى','Title')+'</th><th>'+Lx('الجهة','Organization')+'</th><th>'+Lx('آخر موعد','Deadline')+'</th><th>'+Lx('الحالة','Status')+'</th><th></th></tr>'+G.ja.map(function(j){var live=j.active&&(!j.deadline||j.deadline>=new Date().toISOString().slice(0,10));return '<tr><td>'+e9(j.title)+'</td><td>'+e9(j.org||'')+'</td><td>'+dmy(j.deadline)+'</td><td>'+(live?'<span class="tag ok">'+Lx('منشورة','Live')+'</span>':'<span class="tag">'+Lx('غير منشورة','Hidden')+'</span>')+'</td><td><a href="javascript:void 0" onclick="V51.h.je297('+j.id+')">'+Lx('تعديل','Edit')+'</a></td></tr>'}).join('')+'</table></div>';
 return '<p class="mu">'+Lx('الفرص المنشورة تظهر في صفحة «فرص العمل للخريجين» العامة.','Published jobs appear on the public “Jobs for graduates” page.')+' <a href="#/jobs" target="_blank">'+Lx('عرض الصفحة','View page')+'</a></p>'+form+list};
H.je297=function(id){G.je=id?(G.ja||[]).find(function(j){return j.id===id})||null:null;go()};
H.js297=function(f){var v={};new FormData(f).forEach(function(x,k){v[k]=x});if(G.je&&G.je.id)v.active=v.active==='true';FT.rpc('v297_job_save',{p:v}).then(function(d){if(d&&d.ok){T(Lx('حُفظ.','Saved.'));G.je=null;G.ja=undefined;G.jobs=undefined;go()}else T(Lx('أكمل المسمى الوظيفي.','Enter the job title.'))}).catch(function(e){T(String(e&&e.message||e))});return false};

/* ---------- لوحة مؤشرات المجلس (قراءة فقط) ---------- */
var STL={draft:'مسودة',submitted:'مُسلَّم',approved:'معتمد',running:'جارٍ',started:'باشر',closed:'منتهٍ',failed:'غير مجتاز',proposed:'مقترح',assigned:'مُسند',inprogress:'قيد الإنجاز',final_ok:'معتمد نهائياً',archived:'مؤرشف',rejected:'مرفوض',pub:'منشور'};
V.board=function(){if(typeof me==='undefined'||!me)return '<h2>'+Lx('لوحة مؤشرات المجلس','Board dashboard')+'</h2><div class="msg">'+Lx('سجّل الدخول من بوابة الموظفين أولاً.','Sign in from the staff portal first.')+' <a href="#/login/staff">'+Lx('الدخول','Sign in')+'</a></div>';
 if(G.bd===undefined){G.bd=null;rpc('v297_board',{p_from:G.bf||null,p_to:G.bt||null}).then(function(d){G.bd=d||{};var a=document.getElementById('app');if(a&&/^#\/board\b/.test(location.hash))a.innerHTML=V.board()}).catch(function(){G.bd={err:1};var a=document.getElementById('app');if(a&&/^#\/board\b/.test(location.hash))a.innerHTML=V.board()})}
 var d=G.bd;var h='<h2>'+Lx('لوحة مؤشرات مجلس الشؤون التعليمية','Board of Educational Affairs dashboard')+'</h2>';
 if(d===null)return h+'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>';
 if(d.err)return h+'<div class="msg er">'+Lx('هذه اللوحة للإدارة المركزية وأعضاء مجلس الشؤون التعليمية.','This dashboard is for the central administration and members of the Board of Educational Affairs.')+'</div>';
 var K=function(t,v,s){return '<div class="box" style="text-align:center;min-width:140px;flex:1"><div style="font-size:28px;font-weight:700;color:#14284B">'+e9(v==null?'—':v)+'</div><div>'+t+'</div>'+(s?'<div class="mu" style="font-size:12px">'+s+'</div>':'')+'</div>'};
 var o=function(m){var k=Object.keys(m||{});return k.length?k.map(function(x){return (STL[x]||x)+': '+m[x]}).join(' · '):'—'},A=d.alumni||{};
 return h+'<p class="mu">'+Lx('أرقام محدّثة لحظياً من سجلات النظام، للقراءة فقط ودون بيانات شخصية. المدة: ','Live figures from the system records, read-only and without personal data. Period: ')+'<bdi dir="ltr">'+e9(dmy(d.from))+' — '+e9(dmy(d.to))+'</bdi></p>'+
  '<div class="box" style="display:flex;flex-wrap:wrap;gap:8px;align-items:end"><label>'+Lx('من','From')+'<input type="date" id="bf297" value="'+e9(d.from||'')+'"></label><label>'+Lx('إلى','To')+'<input type="date" id="bt297" value="'+e9(d.to||'')+'"></label><button class="btn s" onclick="V51.h.bd297()">'+Lx('تحديث','Refresh')+'</button></div>'+
  '<h3>'+Lx('القبول والطلاب','Admissions & students')+'</h3><div style="display:flex;flex-wrap:wrap;gap:8px">'+K(Lx('طلبات التسجيل','Applications'),d.apps)+K(Lx('المقبولة','Accepted'),d.apps_ok)+K(Lx('قيد النظر الآن','Open now'),d.apps_open)+K(Lx('طلاب منتظمون','Current students'),d.students_total)+K(Lx('خريجون في المدة','Graduates in period'),d.grads,Lx('الإجمالي: ','Total: ')+d.grads_total)+'</div>'+
  '<div class="box">'+Lx('أكثر الجنسيات: ','Top nationalities: ')+e9(Object.keys(d.by_nat||{}).map(function(k){return k+' '+d.by_nat[k]}).join('، ')||'—')+'</div>'+
  '<h3>'+Lx('التدريب الميداني ومشروع التخرج','Field training & graduation project')+'</h3><div style="display:flex;flex-wrap:wrap;gap:8px">'+K(Lx('مؤهلون للتدريب الآن','Eligible for training now'),d.elig)+K(Lx('فرص عمل منشورة','Published jobs'),d.jobs)+K(Lx('خريجون في الدليل','Graduates in directory'),d.dir)+'</div>'+
  '<div class="box">'+Lx('ملفات التدريب: ','Training files: ')+e9(o(d.tr))+'<br>'+Lx('مشاريع التخرج: ','Graduation projects: ')+e9(o(d.gp))+'</div>'+
  '<h3>'+Lx('الجودة والمتابعة','Quality & follow-up')+'</h3><div style="display:flex;flex-wrap:wrap;gap:8px">'+K(Lx('تقييمات المشرفين','Supervisor evaluations'),d.evals,Lx('متوسط الرضا: ','Avg. satisfaction: ')+(d.eval_avg==null?'—':d.eval_avg+' / 5'))+K(Lx('استبيانات الخريجين','Alumni surveys'),(A.answered||0)+' / '+(A.sent||0),Lx('أجاب / أُرسل','Answered / sent'))+K(Lx('رضا الخريجين','Alumni satisfaction'),A.sat==null?'—':A.sat+' / 5')+K(Lx('وثائق صادرة في المدة','Documents issued'),d.certs)+'</div>'};
H.bd297=function(){G.bf=(document.getElementById('bf297')||{}).value||null;G.bt=(document.getElementById('bt297')||{}).value||null;G.bd=undefined;var a=document.getElementById('app');if(a)a.innerHTML=V.board()};

/* ---------- روابط داخل بوابة الخريجين ---------- */
try{var vg=V.graduates;if(typeof vg==='function'&&!vg.__v297){V.graduates=function(){var h=vg.apply(this,arguments);try{if(typeof h!=='string'||typeof me==='undefined'||!me)return h;var p=location.hash.replace(/^#\/?/,'').split('/');if(p[1])return h;
  var ins='<a class="btn s" href="#/jobs">'+Lx('فرص العمل','Jobs')+'</a> <a class="btn s" href="#/alumni">'+Lx('دليل الخريجين','Alumni directory')+'</a>'+(me.r!=='student'?' <a class="btn s" href="#/board">'+Lx('لوحة مؤشرات المجلس','Board dashboard')+'</a>':'');
  var k=h.indexOf('data-bar293="1"');if(k>0){var e=h.indexOf('</div>',k);if(e>0)h=h.slice(0,e)+ins+h.slice(e)}
 }catch(e){console.error('v297 grad',e)}return h};V.graduates.__v297=1}}catch(e){}
X.ft297={jobsView:jobsView};
}catch(e){console.error('v297',e)}})();

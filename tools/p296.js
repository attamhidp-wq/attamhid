/* =====================================================================
   v296 — تقرير المشرف لنفسه، ودليل الخريجين (بموافقة صريحة)، والتقرير السنوي الرسمي (PDF).
   لا بيانات شخصية في الشيفرة.
   ===================================================================== */
(function(){try{
var W=window,X=W.V51;if(!X)return;var H=X.h||(X.h={}),FT=X.ft225||{};
var Lx=function(a,e){try{return L(a,e)}catch(x){return a}};
var e9=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var rpc=async function(n,a){if(typeof sb==='undefined'||!sb)throw new Error('offline');var r=await sb.rpc(n,a||{});if(r.error)throw r.error;return r.data};
var T=function(m){try{toast(m)}catch(e){}};
var G=X.g296||(X.g296={});
var QS=[['q1','وضوح التوجيه والإرشاد','Clarity of guidance'],['q2','سرعة الرد على الاستفسارات','Responsiveness to questions'],['q3','الالتزام بمواعيد اللقاءات','Keeping meeting times'],['q4','عدالة التقويم وموضوعيته','Fairness of assessment'],['q5','الإفادة العلمية والعملية','Academic and practical benefit'],['q6','الرضا العام عن الإشراف','Overall satisfaction']];

/* ---------- 1) تقرير المشرف لنفسه ---------- */
var myEval=function(){if(G.me===undefined){G.me=null;rpc('v296_my_eval').then(function(d){G.me=d||{n:0};try{go()}catch(e){}}).catch(function(){G.me={n:-1}});return ''}
 var d=G.me;if(!d||d.n<=0)return '';
 return '<div class="box" data-me296="1"><b>'+Lx('تقييم طلابي لإشرافي','How my students evaluate my supervision')+'</b> <span class="mu">('+Lx('عدد التقييمات: ','Evaluations: ')+d.n+')</span>'+
  (d.avg?'<table style="margin-top:6px">'+QS.map(function(q){return '<tr><td>'+Lx(q[1],q[2])+'</td><td><b>'+d.avg[q[0]]+'</b> / 5</td></tr>'}).join('')+'</table>'+((d.notes||[]).length?'<details><summary>'+Lx('ملاحظات الطلاب','Student comments')+' ('+d.notes.length+')</summary><ul>'+d.notes.map(function(n){return '<li>'+e9(n)+'</li>'}).join('')+'</ul></details>':''):'<p class="mu">'+Lx('تظهر المتوسطات والملاحظات بعد 3 تقييمات، حفاظاً على عدم معرفة المقيِّم.','Averages and comments appear after 3 evaluations, to protect evaluators’ anonymity.')+'</p>')+'</div>'};

/* ---------- 2) دليل الخريجين ---------- */
var FIELDS=[['teach','التعليم','Teaching'],['translate','الترجمة','Translation'],['religious','العمل الديني والدعوي','Religious work'],['media','الإعلام والكتابة','Media & writing'],['business','الأعمال','Business'],['study','الدراسات العليا','Graduate studies'],['other','غير ذلك','Other']];
var fName=function(k){var f=FIELDS.find(function(x){return x[0]===k});return f?Lx(f[1],f[2]):''};
V.alumni=function(){if(G.dir===undefined){G.dir=null;rpc('v296_dir_list').then(function(d){G.dir=d||[];var a=document.getElementById('app');if(a&&/^#\/alumni\b/.test(location.hash))a.innerHTML=V.alumni()}).catch(function(){G.dir=[];G.dirErr=1})}
 var q=String(G.dq||'').trim().toLowerCase(),L0=(G.dir||[]).filter(function(p){return !q||[p.name,p.nameEn,p.job,p.org,p.city,fName(p.field),p.year].join(' ').toLowerCase().indexOf(q)>=0});
 return '<h2>'+Lx('دليل خريجي المعهد','Alumni Directory')+'</h2><p class="mu">'+Lx('شبكة تواصل بين خريجي المعهد وجهات العمل. لا يظهر هنا إلا من وافق صراحة على الظهور، ويستطيع الخريج الإخفاء متى شاء من بوابته.','A network between our graduates and employers. Only graduates who explicitly agreed appear here, and they can hide themselves at any time from their portal.')+'</p>'+
  '<div class="box"><input id="dq296" placeholder="'+e9(Lx('ابحث بالاسم أو المجال أو الجهة أو المدينة…','Search by name, field, organization or city…'))+'" value="'+e9(G.dq||'')+'" oninput="V51.h.dq296(this.value)" style="width:100%"></div>'+
  (G.dir===null?'<p class="mu">'+Lx('جارٍ التحميل…','Loading…')+'</p>':!L0.length?'<p class="mu">'+(q?Lx('لا نتائج مطابقة.','No matching results.'):Lx('لم ينضم أحد إلى الدليل بعد.','No one has joined the directory yet.'))+'</p>':
   '<div class="grid">'+L0.map(function(p){return '<div class="box"><b>'+e9(Lx(p.name,p.nameEn||p.name))+'</b><div class="mu">'+[p.year?Lx('خريج ','Class of ')+e9(p.year):'',fName(p.field)].filter(Boolean).join(' · ')+'</div>'+(p.job||p.org?'<div>'+e9([p.job,p.org].filter(Boolean).join(' — '))+'</div>':'')+(p.city?'<div class="mu">'+e9(p.city)+'</div>':'')+(p.link?'<a href="'+e9(p.link)+'" target="_blank" rel="noopener nofollow">'+Lx('الملف المهني','Profile')+'</a>':'')+'</div>'}).join('')+'</div>')};
H.dq296=function(v){G.dq=v;var a=document.getElementById('app');if(!a)return;a.innerHTML=V.alumni();var i=document.getElementById('dq296');if(i){i.focus();try{i.setSelectionRange(v.length,v.length)}catch(e){}}};
var dirBox=function(){if(typeof me==='undefined'||!me||me.r!=='student')return '';if(G.dm===undefined){G.dm=null;rpc('v296_dir_mine').then(function(d){G.dm=d||{};try{go()}catch(e){}}).catch(function(){G.dm={}});return ''}
 var d=G.dm;if(!d||!d.grad)return '';var r=d.row||{},on=!!d.row;
 return '<div class="box" data-dir296="1"><b>'+Lx('دليل الخريجين','Alumni directory')+'</b> '+(on?'<span class="tag ok">'+Lx('تظهر في الدليل','You are listed')+'</span>':'<span class="tag">'+Lx('لا تظهر في الدليل','Not listed')+'</span>')+' <a href="#/alumni">'+Lx('عرض الدليل','View directory')+'</a>'+
  '<form onsubmit="return V51.h.dir296(this,true)" style="margin-top:6px"><label>'+Lx('المجال','Field')+'<select name="field"><option value=""></option>'+FIELDS.map(function(f){return '<option value="'+f[0]+'"'+(r.field===f[0]?' selected':'')+'>'+Lx(f[1],f[2])+'</option>'}).join('')+'</select></label>'+
  '<label>'+Lx('العمل الحالي','Current role')+'<input name="job" maxlength="120" value="'+e9(r.job||'')+'"></label><label>'+Lx('جهة العمل أو الدراسة','Organization')+'<input name="org" maxlength="160" value="'+e9(r.org||'')+'"></label><label>'+Lx('المدينة والدولة','City and country')+'<input name="city" maxlength="80" value="'+e9(r.city||'')+'"></label><label>'+Lx('رابط ملفك المهني (اختياري: لينكدإن أو غيره)','Profile link (optional: LinkedIn etc.)')+'<input name="link" dir="ltr" maxlength="200" value="'+e9(r.link||'')+'" placeholder="https://www.linkedin.com/in/..."></label>'+
  '<label style="display:block;margin:6px 0"><input type="checkbox" name="ok" required'+(on?' checked':'')+'> '+Lx('أوافق على ظهور اسمي وسنة تخرجي وهذه البيانات في دليل الخريجين العام.','I agree that my name, graduation year and these details appear in the public alumni directory.')+'</label>'+
  '<button class="btn s">'+(on?Lx('حفظ التعديل','Save'):Lx('الانضمام إلى الدليل','Join the directory'))+'</button>'+(on?' <button type="button" class="btn s" onclick="V51.h.dir296(null,false)">'+Lx('إخفائي من الدليل','Hide me')+'</button>':'')+'</form></div>'};
H.dir296=function(f,on){var v={};if(f)new FormData(f).forEach(function(x,k){v[k]=x});rpc('v296_dir_save',{p:v,p_on:!!on}).then(function(){G.dm=undefined;G.dir=undefined;T(on?Lx('حُفظ، وتظهر الآن في الدليل.','Saved; you are now listed.'):Lx('أُخفيت من الدليل.','You were removed from the directory.'));go()}).catch(function(){T(Lx('تعذّر الحفظ.','Could not save.'))});return false};

/* ---------- 3) التقرير السنوي ---------- */
var STL={draft:['مسودة','Draft'],submitted:['مُسلَّم','Submitted'],approved:['معتمد','Approved'],running:['جارٍ','Running'],started:['باشر','Started'],closed:['منتهٍ','Closed'],failed:['غير مجتاز','Not passed'],proposed:['مقترح','Proposed'],assigned:['مُسند','Assigned'],inprogress:['قيد الإنجاز','In progress'],final_ok:['معتمد نهائياً','Final approved'],archived:['مؤرشف','Archived'],rejected:['مرفوض','Rejected']};
var stl=function(o){var k=Object.keys(o||{});return k.length?k.map(function(s){return ((STL[s]||[s])[0])+': '+o[s]}).join(' · '):'—'};
var annualHTML=function(d,from,to){var F=X.f289;if(!F)return '';var n=function(x){return x==null?'—':String(x)},A=d.alumni||{};
 var R=function(k,v){return '<div style="display:flex;font-size:14px;line-height:1.55;border-bottom:1px dotted #c9ced6"><span style="flex:1">'+k+'</span><b style="min-width:120px;text-align:left"><bdi dir="rtl">'+v+'</bdi></b></div>'};
 var S=function(t){return '<p style="font-size:16px;font-weight:700;color:#14284B;margin:7px 0 2px">'+t+'</p>'};
 var body='<div style="position:absolute;top:236px;right:64px;left:64px;font-family:Amiri,serif;color:#111">'+
  '<div style="text-align:center;margin:0 0 8px"><span style="display:inline-block;font-size:24px;font-weight:700;color:#14284B;border-bottom:2px solid #14284B;padding:0 18px 2px">التقرير السنوي</span></div>'+
  '<p style="font-size:15px;line-height:1.85;text-align:justify;margin:0 0 6px">يعرض هذا التقرير أعداد أعمال المعهد للمدة من <bdi dir="ltr">'+e9(from)+'</bdi>م إلى <bdi dir="ltr">'+e9(to)+'</bdi>م، مستخرجةً آلياً من سجلات النظام، دون أي بيانات شخصية.</p>'+
  S('أولاً: القبول والطلاب')+R('طلبات التسجيل',n(d.apps))+R('الطلبات المقبولة',n(d.apps_ok))+R('طلاب جدد',n(d.students_new))+R('إجمالي الطلاب',n(d.students_total))+R('الخريجون في المدة',n(d.grads))+R('أكثر الجنسيات',e9(Object.keys(d.by_nat||{}).slice(0,5).map(function(k){return k+' '+d.by_nat[k]}).join('، ')||'—'))+
  S('ثانياً: التدريب الميداني ومشروع التخرج')+R('ملفات التدريب',e9(stl(d.tr)))+R('مشاريع التخرج',e9(stl(d.gp)))+R('المشاريع المؤرشفة',n(d.archived))+R('نماذج صادرة',n(d.ft_docs))+R('مواعيد إشرافية محجوزة',n(d.slots))+
  S('ثالثاً: الجودة والمتابعة')+R('تقييمات المشرفين',n(d.evals))+R('متوسط الرضا العام عن الإشراف (من 5)',n(d.eval_avg))+R('استبيانات الخريجين المرسلة',n(A.sent))+R('استبيانات الخريجين المجاب عنها',n(A.answered))+R('متوسط رضا الخريجين (من 5)',n(A.sat))+
  S('رابعاً: الوثائق والتواصل')+R('وثائق وشهادات صادرة',n(d.certs))+R('رسائل بريد أُرسلت',n(d.mail))+'</div>';
 var sg=[];try{sg=(X.resolveSigners&&X.resolveSigners('appt'))||[]}catch(e){}var s0=sg[0]||{};
 return F.page(F.head({unit:'الإدارة المركزية',unitEn:'Central Administration'})+F.meta({rec:'AR-'+String(to).slice(0,4),date:new Date().toISOString().slice(0,10),att:false})+body+
  '<div style="position:absolute;top:868px;left:66px;background:#fff">'+F.sign({t:s0.t||'رئيس المعهد',n:s0.n||'',img:s0.img,sm:1})+'</div>'+F.verify({rec:'AR-'+String(to).slice(0,4),qr:'https://attamhid.com/',vl:'التقرير'})+F.foot(),'annual')};
var annualView=function(){var y=new Date().getFullYear();G.af=G.af||(y+'-01-01');G.at=G.at||(y+'-12-31');
 return '<p class="mu">'+Lx('تقرير رسمي بأعداد المعهد للمدة المختارة، مستخرج آلياً من السجلات دون بيانات شخصية، جاهز لمجلس الشؤون التعليمية.','An official report of the Institute’s figures for the selected period, generated from records without personal data, ready for the Board.')+'</p>'+
  '<div class="box" style="display:flex;flex-wrap:wrap;gap:8px;align-items:end"><label>'+Lx('من','From')+'<input type="date" id="af296" value="'+G.af+'"></label><label>'+Lx('إلى','To')+'<input type="date" id="at296" value="'+G.at+'"></label><button class="btn" onclick="V51.h.an296()">'+Lx('إعداد التقرير وتنزيله (PDF)','Generate and download (PDF)')+'</button></div>'};
H.an296=async function(){try{var f=(document.getElementById('af296')||{}).value,t=(document.getElementById('at296')||{}).value;if(!f||!t){T(Lx('اختر المدة.','Choose the period.'));return}G.af=f;G.at=t;T(Lx('جارٍ إعداد التقرير…','Preparing the report…'));
 var d=await FT.rpc('v296_annual',{p_from:f,p_to:t});var h=annualHTML(d||{},f,t);if(!W.jspdf){await new Promise(function(ok,no){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
 var b=await mkBlob(h,'pdf'),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='annual-report-'+f+'_'+t+'.pdf';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},800);
 try{typeof aud==='function'&&aud(Lx('إعداد التقرير السنوي','Annual report generated'),f+' → '+t,'')}catch(e){}}catch(e){console.error('an296',e);T(Lx('تعذّر إعداد التقرير.','Could not prepare the report.'))}};

/* ---------- الحقن في بوابة الخريجين ---------- */
try{var vg=V.graduates;if(typeof vg==='function'&&!vg.__v296){V.graduates=function(){var h=vg.apply(this,arguments);try{if(typeof h!=='string'||typeof me==='undefined'||!me)return h;var p=location.hash.replace(/^#\/?/,'').split('/');if(p[1])return h;
  var put=function(x){var i=h.indexOf('</nav>');h=i>0?h.slice(0,i+6)+x+h.slice(i+6):h+x};
  if(me.r!=='student'&&h.indexOf('data-me296')<0){var m=myEval();if(m)put(m)}
  if(me.r==='student'&&h.indexOf('data-dir296')<0){var b=dirBox();if(b)put(b)}
 }catch(e){console.error('v296 grad',e)}return h};V.graduates.__v296=1}}catch(e){}
X.ft296={annualView:annualView,annualHTML:annualHTML,myEval:myEval};
}catch(e){console.error('v296',e)}})();

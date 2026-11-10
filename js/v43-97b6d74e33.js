
/* v43: مطابقة البنوك للبيانات المعتمدة + خلط الخيارات عشوائياً + حماية المقررات والاختبارات والبنوك من الحذف */
(()=>{try{
const V='v43',cl=a=>JSON.parse(JSON.stringify(a));
const ck=x=>{const m=String(x==null?'':x).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).match(/\d{3,}/);return m?m[0]:''};
/* (1) أسئلة انحرفت في v42 عن البيانات المعتمدة: [فهرس السؤال، بصمة النص القديم، السؤال المعتمد] */
const FIX={
 '0103':[[11,'الفصل بين الجمل',{ty:'mc',t:'الفصل بين الجمل المرتبطة معنوياً يتم بـ:',o:['الفاصلة (،)','الفاصلة المنقوطة (؛)','النقطة','الشرطة'],c:1}]],
 '0107':[[1,'الفعل الماضي',{ty:'tf',t:'الفعل الماضي مبني دائماً على الفتح.',c:0}]],
 '0110':[[3,'الصلاة عماد الدين',{ty:'tf',t:'الصلاة عماد الدين وهي ركن أساسي من أركان الإسلام.',c:1}],
         [6,'صيام',{ty:'tf',t:'صيام شهر رمضان المبارك ركن من أركان الإسلام العظام.',c:1}]]
};
function fixBanks(){
 if(typeof S==='undefined'||!S||!Array.isArray(S.exams))return;let ch=0;
 S.exams.forEach(e=>{const k=ck(e.code),F=FIX[k];
  if(!F||!e.bank||e.qv43===V||!Array.isArray(e.q)||!e.q.length)return;
  F.forEach(([i,sig,q])=>{const o=e.q[i];if(o&&String(o.t||'').includes(sig))e.q[i]=cl(q)});
  e.qv43=V;ch=1;
  if(window.QBANK36)window.QBANK36[k]={mc:e.q.filter(q=>q.ty=='mc').map(cl),tf:e.q.filter(q=>q.ty=='tf').map(cl)}});
 if(ch)try{save()}catch(x){}}
/* حقن مستمر: يعيد ملء أي بنك يفرغ (مثلاً بعد مزامنة الخادم) ثم يطبّق التصحيحات */
const run=()=>{try{if(typeof window.injectBank42==='function')window.injectBank42();fixBanks()}catch(e){console.error('v43',e)}};
run();setInterval(run,3000);

/* (2) خلط عشوائي لترتيب خيارات الاختيار من متعدد؛ يُحفظ الترتيب في مسودة الطالب فلا يتغير عند إعادة الفتح.
   تُخزَّن الإجابة بفهرس الخيار الأصلي فيبقى التصحيح والاحتساب دون تغيير. يعمل في الوضعين (محلي / Supabase). */
const rnd=n=>{try{const r=new Uint32Array(1);crypto.getRandomValues(r);return r[0]%n}catch(e){return Math.floor(Math.random()*n)}};
const shuf=n=>{const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const _t=window.exTake;
if(typeof _t==='function')window.exTake=function(s){const h=_t.apply(this,arguments);
 try{const d=S.dr&&S.dr[s.id+'_'+taking];if(!d)return h;d.p=d.p||{};
  const tp=document.createElement('template');tp.innerHTML=h;let ch=0;const g={};
  tp.content.querySelectorAll('input[type=radio][name^="q"]').forEach(x=>{(g[x.name]=g[x.name]||[]).push(x)});
  Object.keys(g).forEach(nm=>{const rs=g[nm],n=rs.length;if(n<3)return;/* صح/خطأ خياران فقط فلا يُخلطان */
   const i=nm.slice(1),by={},ls=rs.map(x=>x.closest('label'));
   rs.forEach((x,t)=>{const m=(x.getAttribute('onchange')||'').match(/exAns\(\d+,\s*(\d+)\)/);if(m&&ls[t])by[m[1]]=ls[t]});
   if(Object.keys(by).length!==n)return;
   if(!Array.isArray(d.p[i])||d.p[i].length!==n){d.p[i]=shuf(n);ch=1}
   const par=ls[n-1].parentNode,ref=ls[n-1].nextSibling;
   d.p[i].forEach(j=>par.insertBefore(by[j],ref))});
  if(ch)(typeof save0=='function'?save0:save)();
  return tp.innerHTML}catch(x){console.error('v43 shuffle',x);return h}};

/* (3) حماية المقررات الـ25 وخطة الدبلوم وبنوك الأسئلة والاختبارات المرتبطة بها */
const MSG='محمي: لا يُحذف أي مقرر أو اختبار أو بنك أسئلة؛ ويقتصر حذف الطالب على سجلاته فقط.';
const g2=(n,f)=>{const o=window[n];if(typeof o==='function')window[n]=f(o)};
const stdEx=e=>!!e&&!!(e.bank||e.courseId);
g2('exDel',o=>function(id){if(stdEx(S.exams.find(e=>e.id==id))){toast(MSG);return}return o.apply(this,arguments)});
g2('fxDel',o=>function(id){if(stdEx(S.exams.find(e=>e.id==id))){toast(MSG);return}return o.apply(this,arguments)});
g2('delCr',o=>function(id){const D=P(DIP),c=D&&D.courses.find(x=>x.id==id);
 if(c&&!c.legacy&&window.QBANK36&&QBANK36[ck(c.code||c.id)]){toast(MSG);return}return o.apply(this,arguments)});
g2('exDemo',()=>function(){toast('معطّل: بنوك المقررات محمية بحد أقصى 40 سؤالاً ولا تُملأ بأسئلة تجريبية')});
/* عزل حذف الطالب: لقطة للاختبارات والبرامج (المقررات والمستويات والخطة) تُستعاد إن تغيّرت لأي سبب */
['delStu','addStu'].forEach(n=>g2(n,o=>function(){const a=JSON.stringify([S.exams,S.programs]);const r=o.apply(this,arguments);
 try{if(JSON.stringify([S.exams,S.programs])!==a){const b=JSON.parse(a);S.exams=b[0];S.programs=b[1];save()}}catch(x){console.error('v43 guard',x)}return r}));
window.V43=1;
}catch(e){console.error('v43',e)}})();

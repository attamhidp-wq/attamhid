
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

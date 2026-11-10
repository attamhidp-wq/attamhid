
/* =====================================================================
   v116 — التخزين المحلي لا يمتلئ: حين تقترب النسخة المحلية من حد المتصفح (≈5 ملايين حرف)
   تُنقل أكبر أجزائها تلقائياً إلى قاعدة المتصفح الكبيرة (IndexedDB) وتبقى في الذاكرة كما هي للكود كله،
   ثم يُعاد الحفظ بصمت. لا تتأثر بيانات الخادم؛ هذه النسخة المحلية للسرعة فقط.
   ===================================================================== */
(function(){
var W=window,LS='off116',DBN='tamhid116',STN='kv',BUDGET=3200000,cache={},sigs={},lastS=null,busy=0;
var OFF=[];try{OFF=JSON.parse(localStorage.getItem(LS)||'[]')||[]}catch(e){OFF=[]}
var SKIP={v51:1,bank65:1,bank73:1};
function db(){return new Promise(function(res,rej){try{var r=indexedDB.open(DBN,1);r.onupgradeneeded=function(){r.result.createObjectStore(STN)};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}}catch(e){rej(e)}})}
function put(k,v){return db().then(function(d){return new Promise(function(res,rej){var t=d.transaction(STN,'readwrite');t.objectStore(STN).put(v,k);t.oncomplete=function(){res(1)};t.onerror=function(){rej(t.error)}})})}
function get(k){return db().then(function(d){return new Promise(function(res,rej){var t=d.transaction(STN,'readonly'),r=t.objectStore(STN).get(k);r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})})}
/* المسار: «exams» أو «v51.imgs» */
function at(p){if(typeof S==='undefined'||!S)return null;var i=p.indexOf('.');if(i<0)return [S,p];var o=S[p.slice(0,i)];return o&&typeof o==='object'?[o,p.slice(i+1)]:null}
function hide(){OFF.forEach(function(p){var h=at(p);if(!h)return;var o=h[0],k=h[1],d=Object.getOwnPropertyDescriptor(o,k);
 if(d&&d.enumerable){var v=o[k];delete o[k];Object.defineProperty(o,k,{value:v,writable:true,configurable:true,enumerable:false});cache[p]=v}
 else if(!d&&cache[p]!==undefined){Object.defineProperty(o,k,{value:cache[p],writable:true,configurable:true,enumerable:false})}
 else if(d)cache[p]=o[k]});lastS=S}
function fp(v){try{var s=JSON.stringify(v)||'',h=0;for(var i=0;i<s.length;i+=97)h=(h*31+s.charCodeAt(i))|0;return s.length+':'+h}catch(e){return ''}}
function persist(){OFF.forEach(function(p){var v=cache[p];if(v===undefined)return;var f=fp(v);if(sigs[p]===f)return;put(p,v).then(function(){sigs[p]=f}).catch(function(e){console.warn('v116 idb',e)})})}
function anyVisible(){return OFF.some(function(p){var h=at(p);if(!h)return false;var d=Object.getOwnPropertyDescriptor(h[0],h[1]);return d&&d.enumerable})}
/* اختيار ما يُنقل: الأكبر أولاً حتى تنزل النسخة المحلية تحت الميزانية */
function plan(){if(typeof S==='undefined'||!S)return [];var C=[];
 Object.keys(S).forEach(function(k){if(SKIP[k])return;try{C.push([k,(JSON.stringify(S[k])||'').length])}catch(e){}});
 if(S.v51&&typeof S.v51==='object')Object.keys(S.v51).forEach(function(k){try{C.push(['v51.'+k,(JSON.stringify(S.v51[k])||'').length])}catch(e){}});
 var total=0;try{total=JSON.stringify(S).length}catch(e){}C.sort(function(a,b){return b[1]-a[1]});var add=[];
 for(var i=0;i<C.length&&total>BUDGET;i++){if(C[i][1]<50000)break;if(OFF.indexOf(C[i][0])<0){add.push(C[i][0]);total-=C[i][1]}}return add}
function lighten(){var add=plan();if(!add.length)return false;OFF=OFF.concat(add);try{localStorage.setItem(LS,JSON.stringify(OFF))}catch(e){}hide();persist();console.info('v116 offloaded',add);return true}
W.V51&&(W.V51.off116={list:function(){return OFF.slice()},lighten:lighten,hide:hide});
/* عند فشل الحفظ: تخفيف صامت ثم إعادة الحفظ؛ لا تظهر الرسالة إلا إن بقي الفشل */
var _fail=W.__lsFail81;
W.__lsFail81=function(e){if(!busy){busy=1;try{if(lighten()){var ok=1;try{localStorage.setItem('tisa_proto_v1',JSON.stringify(S))}catch(x){ok=0}busy=0;if(ok)return}}catch(x){}busy=0}
 if(typeof _fail==='function')return _fail(e)};
/* الإقلاع: تحميل الأجزاء المنقولة من قاعدة المتصفح، ثم تخفيف وقائي إن كانت النسخة كبيرة */
hide();
if(OFF.length)Promise.all(OFF.map(function(p){return get(p).catch(function(){return undefined})})).then(function(vals){OFF.forEach(function(p,i){var v=vals[i];if(v===undefined)return;var h=at(p);if(!h)return;var o=h[0],k=h[1],cur=o[k];
  var empty=cur==null||(Array.isArray(cur)?!cur.length:(typeof cur==='object'&&!Object.keys(cur).length));
  if(empty){try{delete o[k]}catch(e){}Object.defineProperty(o,k,{value:v,writable:true,configurable:true,enumerable:false});cache[p]=v}
  else if(Array.isArray(cur)&&Array.isArray(v)){var ids={};cur.forEach(function(x){if(x&&x.id!=null)ids[String(x.id)]=1});v.forEach(function(x){if(x&&x.id!=null&&!ids[String(x.id)])cur.push(x)})}
  else if(cur&&typeof cur==='object'&&v&&typeof v==='object'&&!Array.isArray(v)){Object.keys(v).forEach(function(c){if(!(c in cur))cur[c]=v[c]})}
  sigs[p]='';});hide();try{W.go&&W.go()}catch(e){}});
setTimeout(function(){try{if(JSON.stringify(S).length>BUDGET+600000)lighten()}catch(e){}},4000);
var _s=W.save;if(typeof _s==='function'){W.save=function(){if(S!==lastS||anyVisible())hide();var r=_s.apply(this,arguments);return r};try{save=W.save}catch(e){}}
setInterval(function(){try{if(S!==lastS||anyVisible())hide();persist()}catch(e){}},5000);
})();

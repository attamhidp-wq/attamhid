
/* ===== حارس نسب الشعارات والعلامات المائية (v46) =====
   السبب الجذري: html2canvas 1.4.1 لا يدعم object-fit، فيرسم الصورة ممطوطة
   على كامل صندوقها. هذا الحارس يعمل على النسخة المستنسخة فقط (onclone) فيحسب
   المقاس المتوازن (contain) ويثبّته بأبعاد صريحة + حشو (padding) يحافظ على
   حجم الصندوق الأصلي وموضع الصورة، فلا يتغير التخطيط ولا يتأثر ما يراه المستخدم. */
(function(){
'use strict';
var SEL='.lg,.mlg,.tmwm,.g-wm,.d-wm,.hd img,.hd4>img,.tp>img,.g-hd img,.d-hd img,.sb img.lg';
function n(v){return parseFloat(v)||0}
function box(img){
  var r=img.getBoundingClientRect(),w=img.offsetWidth,h=img.offsetHeight;
  if(Math.abs(r.width-w)<1&&Math.abs(r.height-h)<1)return{w:r.width,h:r.height};
  return{w:w,h:h};
}
function fixImg(img){
  var win=img.ownerDocument.defaultView,cs=win.getComputedStyle(img),
      nw=img.naturalWidth,nh=img.naturalHeight;
  if(!nw||!nh)return 0;
  var b=box(img);if(!b.w||!b.h)return 0;
  var pl=n(cs.paddingLeft),pr=n(cs.paddingRight),pt=n(cs.paddingTop),pb=n(cs.paddingBottom),
      bl=n(cs.borderLeftWidth),br=n(cs.borderRightWidth),bt=n(cs.borderTopWidth),bb=n(cs.borderBottomWidth),
      cw=b.w-pl-pr-bl-br,ch=b.h-pt-pb-bt-bb;
  if(cw<=0||ch<=0)return 0;
  var r=nw/nh;
  if(Math.abs(cw/ch-r)/r<0.01)return 0;               /* النسبة سليمة أصلاً */
  var contain=cs.objectFit==='contain';
  if(!contain&&!img.matches(SEL))return 0;             /* لا نلمس الصور الأخرى (cover/QR) */
  var w,h;if(cw/ch>r){h=ch;w=ch*r}else{w=cw;h=cw/r}
  var dx=(cw-w)/2,dy=(ch-h)/2,s=img.style,P='important';
  s.setProperty('box-sizing','content-box',P);
  s.setProperty('width',w+'px',P);s.setProperty('height',h+'px',P);
  s.setProperty('min-width','0',P);s.setProperty('min-height','0',P);
  s.setProperty('max-width','none',P);s.setProperty('max-height','none',P);
  s.setProperty('flex','none',P);
  s.setProperty('padding-left',(pl+dx)+'px',P);s.setProperty('padding-right',(pr+dx)+'px',P);
  s.setProperty('padding-top',(pt+dy)+'px',P);s.setProperty('padding-bottom',(pb+dy)+'px',P);
  s.setProperty('object-fit','fill',P);
  return 1;
}
function prepare(d,root){
  root=root||d.body;
  var imgs=[].slice.call(root.querySelectorAll('img'));
  return Promise.all(imgs.map(function(i){
    if(i.complete)return 0;
    return new Promise(function(ok){i.addEventListener('load',ok,{once:true});i.addEventListener('error',ok,{once:true});setTimeout(ok,4000)});
  })).then(function(){imgs.forEach(function(i){try{fixImg(i)}catch(e){}})});
}
function wrap(){
  var orig=window.html2canvas;
  if(typeof orig!=='function'||orig.__logoGuard)return false;
  var g=function(el,opts){
    opts=Object.assign({},opts||{});var prev=opts.onclone;
    opts.onclone=function(d,e){
      return prepare(d,e).then(function(){return typeof prev==='function'?prev(d,e):undefined});
    };
    return orig.call(this,el,opts);
  };
  for(var k in orig){try{g[k]=orig[k]}catch(e){}}
  g.__logoGuard=1;window.html2canvas=g;return true;
}
window.__logoGuard={fixImg:fixImg,prepare:prepare,wrap:wrap};
if(!wrap())window.addEventListener('load',wrap);
})();


(()=>{try{
PAL.red={n:'أحمر',a:'#b3261e',d:'#6b1410',m:'#d9534f',g:'#b8923a'};
/* 1) السجل الأكاديمي: 3 ألوان و3 خطوط فقط */
const RC=[['blue','أزرق'],['green','أخضر'],['red','أحمر']],RF=[['amiri','أندلسي'],['kufi','كوفي'],['naskh','نسخ']],op=a=>a.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('');
const fix=()=>{let ch=0;[['rcol',RC],['rfnt',RF]].forEach(([id,a])=>document.querySelectorAll('#'+id).forEach(s=>{if(s.options.length!=3||s.options[0].value!=a[0][0]){s.innerHTML=op(a);ch=1}}));if(ch)try{recTheme()}catch(e){}};
const _s=show;show=function(h,n){const r=_s.apply(this,arguments);if(/^record-/.test(n||''))[0,300,900].forEach(t=>setTimeout(fix,t));return r};
/* 2) القبول: ربط التسكين بمستوى الطالب */
const _d=decide;decide=function(id,yes){const n0=S.students.length,res=_d.apply(this,arguments);if(yes&&S.students.length>n0){const s=S.students[S.students.length-1];s.lvl=s.suggestedLevel||s.lvl||1;save();go()}return res};
/* 3) خطاب القبول المباشر */
window.accMake=id=>{const r=S.requests.find(x=>x.id==id);if(!r||r.status!='مقبول')return null;
let c=S.certs.find(x=>x.type=='acc'&&x.rid==id&&!x.revoked);if(c)return c;
const s=S.students.find(x=>x.id==r.sid)||{},L=s.lvl||s.suggestedLevel||1,R=rcfg(),D=P(DIP),y=+String(D.from||'').slice(0,4)||new Date().getFullYear();
c={type:'acc',rec:v51Serial(0,'acc'),rid:id,name:r.name,nameEn:r.nameEn||'',sid:r.sid,uid:r.sid,prog:DIP,nat:r.nat,pid:r.pid,from:D.from||'',date:new Date().toISOString().slice(0,10),adm_mode:R.lvl[L]+(L>1?' (تسكين متقدم — إعفاء من المستويات السابقة)':' (الخطة الكاملة — 4 مستويات)'),adm_term:R.sem[L]+' — العام الدراسي '+y+'–'+(y+1),lang:'ar',text:''};
S.certs.push(c);save();return c};
window.accDl=async(id,f)=>{const c=accMake(id);if(!c){toast('الخطاب متاح للطلب المقبول فقط');return}if(f=='view'){show(certHTML(c),c.rec);return}await dlRec(c.rec,f)};
const _c=certHTML;certHTML=function(c){let h=_c.apply(this,arguments);if(c&&c.type=='acc'&&c.rid)h=h.split('نمط الدراسة').join('المستوى المحدد / التسكين').split('الدفعة / الفصل الدراسي').join('الفصل الدراسي / العام الدراسي').split('Study mode').join('Placement level').split('Intake / Term').join('Term / Academic year');return h};
GOH.post.push(()=>{if(!me||me.r!='admin')return;document.querySelectorAll('button[onclick^="reviewReq("]').forEach(b=>{const m=/reviewReq\('([^']+)'\)/.exec(b.getAttribute('onclick')),r=m&&S.requests.find(x=>x.id==m[1]);if(!r||r.status!='مقبول'||b.parentNode.querySelector('[data-acc="'+r.id+'"]'))return;
const w=document.createElement('span');w.dataset.acc=r.id;w.innerHTML=`<button class="btn" onclick="accDl('${r.id}','view')">خطاب القبول</button> `+['pdf','jpg','png'].map(f=>`<button class="btn s" onclick="accDl('${r.id}','${f}')">${f.toUpperCase()}</button>`).join(' ')+' ';b.parentNode.insertBefore(w,b)})});
}catch(e){console.error('v7 patch',e)}})();

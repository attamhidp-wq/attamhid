// اختبار وحدة لشيفرة p279 في بيئة معزولة (بلا متصفح ولا خادم)
const vm=require('vm'),fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');
const items=[{k:'course',on:true,ok:true,ar:'التسجيل',en:'Reg'},{k:'pre',on:true,ok:false,ar:'3102',en:'3102'},{k:'lvls',on:false,ok:false,miss:['1101'],ar:'مستويات',en:'Levels'},{k:'dues',on:true,ok:false,due_n:1,due_amt:500,ar:'مستحقات',en:'Fees',exc:{reason:'قرار 1'}}];
const FT={ld:1,cfg:{gapDays:5,dead:{}},recs:[],ST:{gp:{proposed:['مقترح','Proposed']}},chip:r=>'<chip>'+r.st+'</chip>',load:()=>Promise.resolve(),rpc:()=>Promise.resolve([])};
const ctx={console,Promise,Date,Math,JSON,String,Number,Object,Array,RegExp,encodeURIComponent,
 location:{hash:'#/graduates'},LG:'ar',L:(a,b)=>a,go:()=>{},toast:()=>{},fv:()=>({}),confirm:()=>true,prompt:()=>null,alert:()=>{},
 V:{graduates:()=>'<h2>x</h2><nav class="ft-nav"></nav><div>home</div>'},me:null};
ctx.window=ctx;ctx.V51={h:{},ft225:FT,TABS51:[],TABLBL51:{}};
vm.createContext(ctx);vm.runInContext(code,ctx);
const out={};const R=(s)=>vm.runInContext(s,ctx);
FT.who={role:'student',roles:[],eld:{ok:false,items}};R("me={r:'student',id:'S1'}");
let h=ctx.V.graduates();out.stuBox=/sec279/.test(h)&&h.indexOf('sec279')>h.indexOf('</nav>');out.left1=/بقي عليك 1 من الشروط/.test(h);out.excShown=/قرار 1/.test(h);
ctx.location.hash='#/graduates/r/X';out.notOnDetail=!/ft279s/.test(ctx.V.graduates());ctx.location.hash='#/graduates';
R("me={r:'faculty',id:'F1'}");out.noBoxFaculty=!/ft279s/.test(ctx.V.graduates());
const T=ctx.V51.TABS51.find(x=>x[0]==='ft279');out.tab=!!T;
R("me={r:'admin'}");FT.who={roles:['staff','admin']};
FT.recs=[{id:'R1',kind:'tr',st:'submitted',data:{s:{ar:'أ'}}},{id:'R2',kind:'gp',st:'proposed',data:{s:{ar:'ب'}}},{id:'R3',kind:'tr',st:'running',data:{log:[{date:'2026-01-01'}],s:{ar:'ج'}}}];
FT.elig=[{sid:'S1',ar:'أ',ok:false,items}];FT.exc=[{id:1,sid:'S1',k:'dues',reason:'قرار 1',at:'2026-11-25'}];
let s=T[3]();out.need=(s.match(/يحتاج إجراء الآن \((\d+)\)/)||[])[1];out.late=/متابعة متدرب متأخر/.test(s);
ctx.V51.h.ft279v('elig');s=T[3]();out.eligTable=/S1 — أ/.test(s)&&/مستثنى/.test(s)&&/ft279xr\(1\)/.test(s);
ctx.V51.h.ft279v('cfg');s=T[3]();out.cfgEditable=/ft279c/.test(s)&&!/ disabled/.test(s);
R("me={r:'admin',unit:'u1'}");FT.who={roles:['staff']};ctx.V51.h.ft279v('elig');s=T[3]();out.unitNoRevoke=!/ft279xr/.test(s);ctx.V51.h.ft279v('cfg');out.unitCfgReadonly=/ disabled/.test(T[3]());
FT.who={roles:[]};out.unitDenied=/للإدارة المركزية والجهات المخوّلة/.test(T[3]());
R("me={r:'student',id:'S1'}");out.studentTabEmpty=T[3]()==='';
// XSS: الاسم يُهرَّب
R("me={r:'admin'}");FT.who={roles:['admin']};FT.elig=[{sid:'S2',ar:'<img src=x onerror=1>',ok:true,items:[]}];ctx.V51.h.ft279v('elig');out.escaped=!/<img src=x/.test(T[3]());
// المرحلة الثانية: متابعة التدريب وأزرار الحالة وتقييم الجهة
FT.act=(id,act,p)=>{out.lastAct=act+':'+(p&&p.why?'why':'')+(p&&p.c?'c'+p.c.length:'');return Promise.resolve()};
FT.ST.tr={running:['جارٍ','Running']};vm.runInContext(code.replace(/^[\s\S]*?\(function\(\)\{try\{/,'(function(){try{').slice(0,0),ctx);
R("me={r:'admin'}");FT.who={roles:['admin','tc']};FT.cfg.hours=60;
FT.recs=[{id:'T1',kind:'tr',st:'running',data:{s:{ar:'م'},app:{ent:'جهة'},plan:{ok:1},log:[{h:5,ok:'1'},{h:4}],visits:[{}],subs:[{stage:'mid',ack:1}],e8:{}}},{id:'T2',kind:'tr',st:'submitted',data:{}},{id:'T3',kind:'tr',st:'done',data:{rate:{c:[4,4,3,3,2],cmt:'جيد'}}}];
ctx.V51.h.ft279v('tr');s=T[3]();out.trTable=/5 \/ 60/.test(s)&&/جهة/.test(s)&&/يوم بانتظار الاعتماد/.test(s);out.trFilter=/الجارية \(1\)/.test(s)&&/الطلبات \(1\)/.test(s);
ctx.location.hash='#/graduates/r/T1';h=ctx.V.graduates();out.trButtons=/tr_suspend/.test(h)&&/tr_fail/.test(h)&&!/tr_resume/.test(h);
ctx.location.hash='#/graduates/r/T3';h=ctx.V.graduates();out.rateShown=/16 \/ 20/.test(h);
R("me={r:'student',id:'S1'}");FT.who={role:'student',roles:[],eld:{ok:true,items:[]}};FT.recs[2].data={};h=ctx.V.graduates();out.rateForm=/ft279rate/.test(h)&&!/tr_fail/.test(h);
ctx.fv=()=>({c0:'4',c1:'3',c2:'4',c3:'2',c4:'1',cmt:''});ctx.V51.h.ft279rate({}, 'T3');out.rateAct=out.lastAct==='ent_rate:c5';
ctx.prompt=()=>'سبب كافٍ للإيقاف';R("me={r:'admin'}");FT.who={roles:['tc']};ctx.V51.h.ft279st('T1','tr_suspend');out.suspAct=out.lastAct==='tr_suspend:why';
ctx.prompt=()=>'قصير';out.lastAct='';ctx.V51.h.ft279st('T1','tr_suspend');out.shortBlocked=out.lastAct==='';
// v281: مركز خدمات الطالب
ctx.location.hash='#/graduates';R("me={r:'student',id:'S1'}");FT.notes=[{ar:'إشعار',at:'2026-11-25'}];
FT.who={role:'student',ref:'S1',elig:true,roles:[],eld:{ok:true,items:[]}};FT.recs=[{id:'O1',kind:'opp',st:'pub',data:{}}];
h=ctx.V.graduates();out.hubEmpty=/خطوتك التالية: ابدأ تدريبك الميداني/.test(h)&&/ft225newTr/.test(h)&&(h.match(/class="c279/g)||[]).length>=20&&/1 فرصة منشورة/.test(h);
FT.recs=[{id:'T9',kind:'tr',sid:'S1',st:'running',data:{plan:{weeks:[1],ok:1},log:[{h:6,ok:'1'}],app:{ent:'مكتبة'}}},{id:'G9',kind:'gp',sid:'S1',st:'assigned',data:{reg:{title:'عنوان'},gsup:'F1',nm:{F1:'د. أحمد'}}}];
h=ctx.V.graduates();out.hubRunning=/دوّن يومك/.test(h)&&/ft225day\('T9'\)/.test(h)&&/6<\/b> \/ 60/.test(h)&&/د. أحمد/.test(h)&&/ft225m2\('G9'\)/.test(h);
FT.who={role:'student',ref:'S1',elig:false,roles:[],eld:{ok:false,items:[{k:'pre',on:true,ok:false,ar:'3102',en:'3102'}]}};FT.recs=[];
h=ctx.V.graduates();out.hubLocked=/استكمل شروط الاستحقاق/.test(h)&&/ft231na/.test(h)&&!/ft225newTr\(\)/.test(h);
ctx.location.hash='#/graduates/opp';h=ctx.V.graduates();out.hubOnlyHome=!/c279/.test(h);
// v282: مركز المشرفين
ctx.location.hash='#/graduates';R("me={r:'faculty',id:'F1'}");FT.who={role:'faculty',ref:'F1',sup:true,roles:[]};FT.cfg={hours:60,revDays:14,meetDays:21,dead:{}};
FT.recs=[{id:'A1',kind:'tr',sid:'S1',st:'running',data:{isup:'F1',s:{ar:'سعيد'},plan:{weeks:[1]},log:[{h:5,ok:'1',date:'2026-11-20'}],start:{date:'2026-10-01'},app:{ent:'مكتبة'}}},
 {id:'A2',kind:'gp',sid:'S2',st:'draft_final',data:{gsup:'F1',s:{ar:'خالد'},reg:{title:'عنوان المشروع'},subs:[{stage:'draft'}],meets:[{date:'2026-11-24'}]}},
 {id:'A3',kind:'gp',sid:'S3',st:'approved_def',data:{cmt:['F1','F2'],s:{ar:'عمر'},reg:{title:'مشروع ثالث'},m7:{date:'2026-12-01',place:'القاعة 1'}}},
 {id:'A4',kind:'tr',sid:'S9',st:'running',data:{isup:'F7'}}];
h=ctx.V.graduates();
out.staffHub=/بانتظار قرارك/.test(h)&&/سعيد/.test(h)&&/عنوان المشروع/.test(h)&&/القاعة 1/.test(h)&&!/A4/.test(h);
out.staffPending=/tr_plan_ok/.test(h)&&/ft225visit\('A1'\)/.test(h)&&/ft225m6\('A2'\)/.test(h)&&/ft225m8\('A3'\)/.test(h)&&/مراجعة تسليم/.test(h);
R("me={r:'faculty',id:'F9'}");FT.who={role:'faculty',ref:'F9',roles:[]};h=ctx.V.graduates();out.staffNoHubIfNone=!/بانتظار قرارك/.test(h);
console.log(JSON.stringify(out));
const bad=Object.entries(out).filter(([k,v])=>v===false||v===undefined);process.exit(bad.length?1:0);

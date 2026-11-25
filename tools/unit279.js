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
// v283: المشاريع ولجان المناقشة وقرار الإعادة
R("me={r:'admin'}");FT.who={roles:['admin','pc']};FT.cfg={dead:{plan:'2020-01-01',final:'2099-01-01'}};
FT.recs=[{id:'P1',kind:'gp',sid:'S1',st:'inprogress',data:{s:{ar:'هند'},reg:{title:'عنوان أ',titleEn:'Title A',timeline:'خطة'},sim:['عنوان قديم'],gsup:'F1',nm:{F1:'د. سالم'},meets:[{}]}},
 {id:'P2',kind:'gp',sid:'S2',st:'approved_def',data:{s:{ar:'ليلى'},reg:{title:'عنوان ب'},m7:{date:'2099-02-01',place:'القاعة 2'},cmt:['F1','F2','F3'],m8:[{id:'F1',c:[1]}]}},
 {id:'P3',kind:'gp',sid:'S3',st:'discussed',data:{s:{ar:'منى'},reg:{title:'ج'}}},{id:'P4',kind:'gp',sid:'S4',st:'approved_def',data:{s:{ar:'سعاد'},reg:{title:'د'}}}];
ctx.location.hash='#/graduates';ctx.V51.h.ft279v('gp');s=T[3]();out.gpTable=/عنوان أ/.test(s)&&/Title A/.test(s)&&/⚠ الخطة/.test(s)&&/مشابه/.test(s)&&/د. سالم/.test(s);
ctx.V51.h.ft283gf('late');s=T[3]();out.gpLate=/المتأخرة \(1\)/.test(s)&&/عنوان أ/.test(s)&&!/>ج</.test(s);
ctx.V51.h.ft279v('cmt');s=T[3]();out.cmtView=/القاعة 2/.test(s)&&/1 \/ 3/.test(s)&&/بلا لجنة أو موعد: 1/.test(s);
ctx.location.hash='#/graduates/r/P3';h=ctx.V.graduates();out.redoBtn=/ft283redo\('P3'\)/.test(h);
ctx.location.hash='#/graduates/r/P1';h=ctx.V.graduates();out.gpBoxInfo=/Title A/.test(h)&&/الخطة الزمنية/.test(h)&&/عناوين سابقة مشابهة/.test(h);
ctx.prompt=()=>'لم تتحقق الأهداف';out.lastAct='';ctx.V51.h.ft283redo('P3');out.redoAct=out.lastAct==='gp_redo:why';
// v285: الدرجات والتخرج والوثائق والتقارير والرسائل
R("me={r:'admin'}");FT.who={roles:['admin','tc','pc']};FT.cfg={course:'P23-4401',mail279:{ok:false}};FT.recs=[];FT.elig=[];
ctx.S={students:[{id:'S1',name:'أ',prog:1000,lvl:4,status:'منتظم',gr:{'P23-4401':{score:88,fin:1,rel:1}}},{id:'S2',name:'ب',prog:1000,lvl:4,status:'منتظم',gr:{}},{id:'S3',name:'ج',prog:1000,lvl:2,status:'منتظم'}]};
ctx.V51.gradReq223=function(s){return s.id==='S1'?[{ok:true,ar:'x',en:'x'}]:[{ok:false,ar:'ناقص',en:'missing'}]};ctx.DIP=1000;ctx.save=()=>{out.saved=1};
const calls=[];FT.rpc=(n,a)=>{calls.push(n);if(n==='ft_grad_check')return Promise.resolve({S1:{dues:0,unpub:0,c4401:'pub'},S2:{dues:1,unpub:2,c4401:'none'}});if(n==='ft_docs_all')return Promise.resolve([{ref:'FT-1',form:'ت-14',tar:'شهادة',st:'valid',issued:'2026-11-01',rec:'T1'}]);if(n==='ft_report')return Promise.resolve({from:'2026-11-01',to:'2026-11-25',acts:{tr_submit:3,grade_auto:1},hours:12,tr_new:2,gp_new:1,tr_st:{running:1},gp_st:{},defences:0,docs:1,docs_cancelled:0});return Promise.resolve({ok:true})};
ctx.location.hash='#/graduates';ctx.V51.h.ft279v('grad');s=T[3]();
setTimeout(()=>{s=T[3]();out.gradCand=/المرشحون للتخرج \(1\)/.test(s)&&/value="S1"/.test(s)&&/مستحقات غير مسددة: 1/.test(s)&&!/S3/.test(s);
 ctx.V51.h.ft279v('grades');s=T[3]();out.gradesView=/منشورة/.test(s)&&/1 غير مسددة/.test(s)&&/v270r/.test(s);
 ctx.V51.h.ft279v('docs');T[3]();setTimeout(()=>{s=T[3]();out.docsView=/FT-1/.test(s)&&/ft285dc\('FT-1'\)/.test(s);
  ctx.V51.h.ft279v('rep');T[3]();setTimeout(()=>{s=T[3]();out.repView=/طلبات تدريب مقدّمة/.test(s)&&/درجات رُصدت آلياً/.test(s)&&/ft285csv/.test(s);
   ctx.V51.h.ft279v('mail');s=T[3]();out.mailView=/بانتظار الاعتماد/.test(s)&&/ft285mail\(true\)/.test(s);
   ctx.confirm=()=>true;ctx.fv=()=>({no:'12/1448',date:'2026-11-25'});const form={querySelectorAll:()=>[{value:'S1'}]};
   ctx.V51.h.ft285grad(form).then(()=>{out.gradDone=ctx.S.students[0].status==='متخرج'&&ctx.S.students[0].paper61.no==='12/1448'&&out.saved===1&&calls.indexOf('ft_grad_log')>=0;
    console.log(JSON.stringify(out));const bad=Object.entries(out).filter(([k,v])=>v===false||v===undefined);process.exit(bad.length?1:0)})},20)},20)},20);
/*console.log(JSON.stringify(out));
*/

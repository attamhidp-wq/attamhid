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
let h=ctx.V.graduates();out.stuBox=/ft279s/.test(h)&&h.indexOf('ft279s')>h.indexOf('</nav>');out.left1=/بقي عليك 1 من الشروط/.test(h);out.excShown=/قرار 1/.test(h);
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
console.log(JSON.stringify(out));
const bad=Object.entries(out).filter(([k,v])=>v===false||v===undefined);process.exit(bad.length?1:0);

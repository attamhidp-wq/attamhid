
/* ===== v14: الهوية الرسمية الموحَّدة (مطابقة لوثيقة التخرج) للسجل الأكاديمي وخطابي القبول والتوصية + المعاينة الحية =====
   - لا تمسّ وثيقة التخرج (gradHTML / dgrad) إطلاقاً.
   - السجل الأكاديمي: الحقول المعتمدة حصراً (بلا نقاط).
   - خطابا القبول والتوصية: النصوص والبيانات كما هي، بتصميم وثيقة التخرج. */
(()=>{try{
const AR='معهد التمهيد',EN='AT TAMHID INSTITUTE';
const E=x=>esc(x==null?'':x);
const Bz=(a,e)=>(typeof LG!='undefined'&&LG=='en')?e:a;
if(!document.getElementById('gd13fonts')){const l=document.createElement('link');l.id='gd13fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Scheherazade+New:wght@400;700&family=EB+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap';document.head.appendChild(l)}

/* ---------- التنسيق ---------- */
const css=document.createElement('style');css.id='d14css';
css.textContent=`.tmw[data-d14]{--b:#003366;--b2:#0c1a30;width:794px;direction:rtl;font-family:Amiri,'Scheherazade New','Traditional Arabic',serif;color:var(--b2)}
.tmw[data-d14] *{box-sizing:border-box}
.tmw[data-d14] .tmp.d14{width:794px;height:1122px;position:relative;overflow:hidden;margin:0 0 12px;padding:0;background:#eef2f6}
.tmw[data-d14] .tmp.d14:before{display:none}
.tmw[data-d14] .d-svg{position:absolute;left:0;top:0;width:794px;height:1122px}
.tmw[data-d14] .d-wm{position:absolute;left:157px;top:331px;width:480px;height:480px;object-fit:contain;opacity:.12}
.tmw[data-d14] .d-mt{position:absolute;left:30px;right:30px;top:1082px;height:8px;overflow:hidden;white-space:nowrap;font:600 5.5px/8px Arial,sans-serif;color:var(--b);opacity:.45;text-align:center;direction:rtl}
.tmw[data-d14] .d-bs{position:absolute;top:24px;left:0;right:0;text-align:center;font:700 27px/40px 'Aref Ruqaa','Scheherazade New',Amiri,serif;color:var(--b)}
.tmw[data-d14] .d-hd{position:absolute;top:66px;right:34px;left:34px;height:80px;display:grid;grid-template-columns:1fr 112px 1fr;align-items:center;gap:6px}
.tmw[data-d14] .d-ar{text-align:right;color:var(--b2)}
.tmw[data-d14] .d-ar b{display:block;font:700 17px/1.5 Amiri,'Traditional Arabic',serif;color:var(--b)}
.tmw[data-d14] .d-ar span{display:block;font:700 14px/1.55 Amiri,'Traditional Arabic',serif}
.tmw[data-d14] .d-en{direction:ltr;text-align:left;color:var(--b2);font-family:'EB Garamond',Garamond,'Times New Roman',serif}
.tmw[data-d14] .d-en b{display:block;font-size:12.5px;line-height:1.3;font-weight:700;color:var(--b)}
.tmw[data-d14] .d-en span{display:block;font-size:12.5px;line-height:1.45;font-weight:600}
.tmw[data-d14] .d-hd img{height:74px;max-width:112px;object-fit:contain;display:block;margin:0 auto}
.tmw[data-d14] .d-dv{position:absolute;top:150px;left:60px;right:60px;height:10px}
.tmw[data-d14] .d-ti{position:absolute;top:160px;left:0;right:0;text-align:center}
.tmw[data-d14] .d-ti b{display:block;height:50px;font:700 31px/50px 'Aref Ruqaa','Scheherazade New',Amiri,serif;color:var(--b);overflow:visible}
.tmw[data-d14] .d-ti span{display:block;font:600 13.5px/18px 'Playfair Display','Times New Roman',serif;letter-spacing:3.5px;text-transform:uppercase;color:var(--b);height:18px;margin-top:4px;direction:ltr}
.tmw[data-d14] .d-ti.c{top:164px}.tmw[data-d14] .d-ti.c b{height:30px;font-size:20px;line-height:30px}.tmw[data-d14] .d-ti.c span{font-size:10.5px;letter-spacing:2.5px;margin-top:0;height:14px;line-height:14px}
.tmw[data-d14] .d-bd{position:absolute;top:250px;right:52px;left:52px;font-family:Amiri,'Traditional Arabic',serif;color:var(--b2)}
.tmw[data-d14] .d-bd.c{top:218px}
.tmw[data-d14] .d-ft{position:absolute;left:34px;right:34px;top:896px;height:150px;display:grid;grid-template-columns:minmax(0,1fr) 300px minmax(0,1fr);gap:8px;align-items:start}
.tmw[data-d14] .d-inf{justify-self:end;width:216px;text-align:right;font:700 13px/1.5 Amiri,serif;color:var(--b2)}
.tmw[data-d14] .d-inf div{margin-bottom:4px}
.tmw[data-d14] .d-inf .en{direction:ltr;text-align:right;white-space:nowrap;font:600 11px/1.4 'EB Garamond','Times New Roman',serif}
.tmw[data-d14] .d-inf .au{margin:0 0 8px;text-align:center;width:150px;margin-left:auto}
.tmw[data-d14] .d-inf .au span{display:block;text-align:right;font:700 12.5px/1.4 Amiri,serif}
.tmw[data-d14] .d-inf .au b{display:block;font:700 16px/1.5 Amiri,serif;color:var(--b)}
.tmw[data-d14] .d-inf .au i{display:block;height:1px;background:var(--b);margin:0 0 2px}
.tmw[data-d14] .d-dn{width:300px;justify-self:center;text-align:center;line-height:1.3;display:flex;flex-direction:column;align-items:center;position:relative}
.tmw[data-d14] .d-dn .t{font:700 13.5px/1.4 Amiri,serif;color:var(--b)}
.tmw[data-d14] .d-dn .te{font:700 12.5px/1.3 'EB Garamond','Times New Roman',serif;direction:ltr;color:var(--b)}
.tmw[data-d14] .d-dn .im{height:42px;width:190px;display:flex;justify-content:center;align-items:center;direction:ltr;margin-top:2px}
.tmw[data-d14] .d-dn .im img{height:40px;max-width:170px;object-fit:contain}
.tmw[data-d14] .d-dn i.ln{display:block;height:1px;width:260px;background:linear-gradient(90deg,transparent,var(--b),transparent);margin:0 0 3px}
.tmw[data-d14] .d-dn .nmz{font:700 16px/1.4 Amiri,serif;color:var(--b2)}
.tmw[data-d14] .d-dn .nme{font:600 14.5px/1.3 'EB Garamond','Times New Roman',serif;direction:ltr;color:var(--b2)}
.tmw[data-d14] .d-dn .sl{position:absolute;left:-18px;top:34px;width:84px;height:84px;object-fit:contain;opacity:.9;transform:rotate(-8deg)}
.tmw[data-d14] .d-dn .cn{margin-top:46px;font:700 12px/1.6 Amiri,serif;color:var(--b);opacity:.7}
.tmw[data-d14] .d-qrw{display:flex;flex-direction:column;align-items:center;gap:3px;justify-self:end;margin-right:0}
.tmw[data-d14] .d-qr{width:80px;height:80px;padding:4px;background:#fff;border:1.5px solid #003366;outline:1px solid rgba(0,51,102,.4);outline-offset:2px}
.tmw[data-d14] .d-qr img{width:100%;height:100%;display:block}
.tmw[data-d14] .d-idn{font:700 10.5px/1.3 'EB Garamond','Times New Roman',serif;direction:ltr;color:var(--b2);text-align:center;white-space:nowrap}
.tmw[data-d14] .d-nt{position:absolute;left:34px;right:34px;top:1056px;display:flex;justify-content:space-between;font-size:10.5px;line-height:1.4;color:var(--b2)}
.tmw[data-d14] .d-nt .en{direction:ltr;font-family:'EB Garamond','Times New Roman',serif;font-weight:700}.tmw[data-d14] .d-nt .ar{font-weight:700}
.tmw[data-d14] .d-pn{position:absolute;left:0;right:0;top:1092px;text-align:center;font:700 10.5px/14px Amiri,serif;color:var(--b);opacity:.8}
.tmw[data-d14] .rvk{position:absolute;z-index:5;top:420px;left:150px;transform:rotate(-20deg);font:700 120px/1.2 Amiri,serif;color:rgba(179,38,30,.35);border:9px solid rgba(179,38,30,.35);padding:0 28px;border-radius:14px}
/* --- السجل الأكاديمي --- */
.tmw[data-d14] .d-bd .ib{display:grid;grid-template-columns:1fr 1fr;border:1.5px solid var(--b);background:rgba(255,255,255,.62);margin:0 0 12px}
.tmw[data-d14] .d-bd .ir{display:grid;grid-template-columns:112px 1fr;align-items:center;min-height:36px;border-top:1px solid rgba(0,51,102,.22)}
.tmw[data-d14] .d-bd .ir:nth-child(-n+2){border-top:0}
.tmw[data-d14] .d-bd .ir:nth-child(even){border-inline-start:1px solid rgba(0,51,102,.22)}
.tmw[data-d14] .d-bd .ir.f{grid-column:1/-1;border-inline-start:0}
.tmw[data-d14] .d-bd .il{padding:3px 10px;background:linear-gradient(270deg,#cfdcec,#e6eef7);align-self:stretch;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;border-inline-end:1px solid rgba(0,51,102,.22)}
.tmw[data-d14] .d-bd .il b{font:700 13px/1.3 Amiri,serif;color:var(--b)}
.tmw[data-d14] .d-bd .il i{font:600 9.5px/1.2 'EB Garamond',serif;font-style:normal;color:var(--b2);direction:ltr;text-align:center}
.tmw[data-d14] .d-bd .iv{padding:3px 10px;font:700 14.5px/1.35 Amiri,serif;color:var(--b2);text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}
.tmw[data-d14] .d-bd .iv span{display:block;font:600 12.5px/1.3 'EB Garamond',serif;direction:ltr;text-align:center;color:var(--b)}
.tmw[data-d14] .d-bd .iv bdi{direction:ltr;unicode-bidi:isolate}
.tmw[data-d14] .d-bd .sm{margin:0 0 12px}
.tmw[data-d14] .d-bd .sh{display:flex;justify-content:space-between;align-items:center;margin:0 0 4px;padding:3px 12px;border-inline-start:4px solid var(--b);background:linear-gradient(90deg,transparent,rgba(255,255,255,.75) 14%,rgba(255,255,255,.75));height:30px}
.tmw[data-d14] .d-bd .sh b{font:700 15.5px/1.3 Amiri,serif;color:var(--b)}
.tmw[data-d14] .d-bd .sh span{font:600 11px/1.3 'EB Garamond',serif;direction:ltr;color:var(--b2)}
.tmw[data-d14] .d-bd table.d-tb{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;border:1.5px solid var(--b);background:rgba(255,255,255,.62);margin:0}
.tmw[data-d14] .d-bd table.d-tb th{height:38px;padding:3px 4px;text-align:center;white-space:normal;background:linear-gradient(180deg,#cfdcec,#e6eef7);color:var(--b);font:700 12.5px/1.2 Amiri,serif;border:0;border-bottom:1.5px solid var(--b);border-inline-start:1px solid rgba(0,51,102,.25);overflow:hidden}
.tmw[data-d14] .d-bd table.d-tb th small{display:block;font:600 9px/1.2 'EB Garamond',serif;direction:ltr;color:var(--b2)}
.tmw[data-d14] .d-bd table.d-tb td{height:26px;padding:1px 6px;text-align:center;white-space:normal;background:transparent;color:var(--b2);font:700 13.5px/1.3 Amiri,serif;border:0;border-top:1px solid rgba(0,51,102,.16);border-inline-start:1px solid rgba(0,51,102,.16);overflow:hidden}
.tmw[data-d14] .d-bd table.d-tb tr:first-child td{border-top:0}
.tmw[data-d14] .d-bd table.d-tb tr:nth-child(even) td{background:rgba(255,255,255,.55)}
.tmw[data-d14] .d-bd table.d-tb td.n{text-align:center;padding:1px 6px}
.tmw[data-d14] .d-bd table.d-tb td.c{font:700 12.5px/1.3 'EB Garamond',serif;direction:ltr}
.tmw[data-d14] .d-bd table.d-tb td small{display:inline-block;margin-inline-start:5px;font:600 9.5px/1.1 'EB Garamond',serif;direction:ltr;color:var(--b)}
.tmw[data-d14] .d-bd .ss{display:grid;grid-template-columns:repeat(3,1fr);border:1.5px solid var(--b);border-top:0;background:rgba(255,255,255,.7)}
.tmw[data-d14] .d-bd .ss>div{padding:3px 8px;text-align:center;border-inline-start:1px solid rgba(0,51,102,.22);min-height:44px}
.tmw[data-d14] .d-bd .ss>div:first-child{border-inline-start:0}
.tmw[data-d14] .d-bd .ss b{display:block;font:700 12px/1.3 Amiri,serif;color:var(--b)}
.tmw[data-d14] .d-bd .ss i{display:block;font:600 9px/1.1 'EB Garamond',serif;font-style:normal;direction:ltr;color:var(--b2)}
.tmw[data-d14] .d-bd .ss em{display:block;font:700 16px/1.4 'EB Garamond','Times New Roman',serif;font-style:normal;direction:ltr;color:var(--b2)}
.tmw[data-d14] .d-bd .tt{margin:4px 0 8px;border:2px solid var(--b);outline:1px solid rgba(0,51,102,.4);outline-offset:3px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85) 8%,rgba(255,255,255,.85) 92%,transparent)}
.tmw[data-d14] .d-bd .tt .ss{border:0;background:none}
.tmw[data-d14] .d-bd .tt .ss em{font-size:20px;color:var(--b)}
.tmw[data-d14] .d-bd .tt .ss>div{min-height:56px}
.tmw[data-d14] .d-bd .end{display:flex;align-items:center;gap:12px;justify-content:center;font:700 17px/1.5 Amiri,serif;color:var(--b);margin:8px 0 0;border:0;padding:0}
.tmw[data-d14] .d-bd .end:before,.tmw[data-d14] .d-bd .end:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--b),transparent);border:0}
.tmw[data-d14] .d-bd .end small{font:600 11px 'EB Garamond',serif;direction:ltr;margin-inline-start:6px}
.tmw[data-d14] .d-bd .lt{font:700 17px/1.95 Amiri,'Traditional Arabic',serif;color:var(--b2);text-align:justify}
.tmw[data-d14] .d-bd .lt p{margin:0 0 4px}
.tmw[data-d14] .d-bd .lt.en{direction:ltr;text-align:left;font:600 16.5px/1.7 'EB Garamond',Garamond,'Times New Roman',serif}
.tmw[data-d14] .d-bd .lt .hl,.tmw[data-d14] .d-bd .lt .to{font-weight:700;color:var(--b)}
.tmw[data-d14] .d-bd .lt b{color:var(--b)}
.tmw[data-d14] .d-bd .lt .nm4{font:700 25px/1.5 Amiri,serif;text-align:center;color:var(--b);margin:4px 0 8px;min-height:40px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75) 10%,rgba(255,255,255,.75) 90%,transparent)}
.tmw[data-d14] .d-bd .lt.en .nm4{font:700 22px/1.4 'Playfair Display','Times New Roman',serif;letter-spacing:.6px;text-transform:uppercase}
.tmw[data-d14] .d-bd .lt table{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;border:1.5px solid var(--b);background:rgba(255,255,255,.62);margin:2px 0 8px;font-size:15px}
.tmw[data-d14] .d-bd .lt table th{width:34%;padding:4px 10px;white-space:normal;background:linear-gradient(270deg,#cfdcec,#e6eef7);color:var(--b);text-align:start;font:700 14.5px/1.5 Amiri,serif;border:0;border-top:1px solid rgba(0,51,102,.2);border-inline-end:1px solid rgba(0,51,102,.25);height:auto}
.tmw[data-d14] .d-bd .lt table td{padding:4px 10px;white-space:normal;overflow:visible;background:transparent;color:var(--b2);text-align:start;font:700 14.5px/1.5 Amiri,serif;border:0;border-top:1px solid rgba(0,51,102,.2);height:auto}
.tmw[data-d14] .d-bd .lt table tr:first-child th,.tmw[data-d14] .d-bd .lt table tr:first-child td{border-top:0}
.tmw[data-d14] .d-bd .lt.en table th,.tmw[data-d14] .d-bd .lt.en table td{font:600 14.5px/1.45 'EB Garamond',serif}
.tmw[data-d14] .d-bd .lt.en table th{text-align:left;background:linear-gradient(90deg,#cfdcec,#e6eef7)}
@media print{
 .tmw[data-d14]{page:pgP}
 .tmw[data-d14] .tmp.d14{width:794px!important;height:1120px!important;margin:0!important;overflow:hidden;break-after:page;page-break-after:always;break-inside:avoid;page-break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
 .tmw[data-d14] .tmp.d14:last-child{break-after:auto;page-break-after:auto}
}
/* --- v50: ثنائية اللغة الكاملة + توسيط + عزل الاتجاه --- */
.tmw[data-d14] .d-bd table.d-tb td small.ce{display:block;margin:0;text-align:center;font:600 10.5px/1.25 'EB Garamond',serif;direction:ltr;unicode-bidi:isolate;color:var(--b)}
.tmw[data-d14] .d-bd table.d-tb td.c .ca{display:block;font:700 13px/1.25 Amiri,serif;direction:ltr;unicode-bidi:isolate;text-align:center}
.tmw[data-d14] .d-bd table.d-tb td{vertical-align:middle}
.tmw[data-d14] .d-bd .sh{display:block;height:auto;min-height:30px;padding:3px 12px;text-align:center}
.tmw[data-d14] .d-bd .sh b{display:block;text-align:center}
.tmw[data-d14] .d-bd .sh>span{display:block;text-align:center;direction:ltr;unicode-bidi:isolate}
.tmw[data-d14] .d-bd .sh .sy{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;margin-top:2px;padding-top:2px;border-top:1px dashed rgba(0,51,102,.25)}
.tmw[data-d14] .d-bd .sh .sy span{display:block;width:auto;min-width:0;white-space:normal;font:600 11.5px/1.4 Amiri,serif;color:var(--b2);unicode-bidi:isolate}
.tmw[data-d14] .d-bd .sh .sy span.e{font:600 11px/1.4 'EB Garamond',serif;direction:ltr;text-align:left}
.tmw[data-d14] .d-bd .sh .sy span.a{direction:rtl;text-align:right}
.tmw[data-d14] .d-bd .iv bdi{white-space:nowrap}
.tmw[data-d14] span[dir][style*="isolate"]{display:inline !important;font:inherit !important;color:inherit !important;text-align:inherit !important;margin:0 !important;padding:0 !important}
.tmw[data-d14] .d-pn{display:flex;justify-content:space-between;padding:0 34px;box-sizing:border-box}
.tmw[data-d14] .d-pn .en{direction:ltr;font-family:'EB Garamond','Times New Roman',serif;unicode-bidi:isolate}
.tmw[data-d14] .d-pn .ar{direction:rtl;unicode-bidi:isolate}
.tmw[data-d14] .d-inf .au em{display:block;text-align:center;font:600 10.5px/1.3 'EB Garamond',serif;font-style:normal;direction:ltr;color:var(--b2)}
.tmw[data-d14] .d-idn.a{font-family:Amiri,serif;direction:rtl}
/* --- المعاينة الحية للسجل الأكاديمي --- */
.tl14{margin-top:14px;border:1px solid var(--bd);border-radius:12px;background:var(--bg2);padding:10px;position:relative}
.tl14 .th{display:flex;flex-wrap:wrap;align-items:center;gap:8px;justify-content:space-between;margin-bottom:8px}
.tl14 .th b{font-size:1rem}
.tl14 .tg{font-size:.78rem;padding:2px 10px;border-radius:999px;background:#e3f1ea;color:#0b5a3a;border:1px solid #9fd1b8}
.tl14 .tg.dr{background:#fff3cd;color:#6b4e00;border-color:#e6c766}
.tl14 label.sl{display:flex;flex-direction:row;align-items:center;gap:8px;margin:0 0 8px;color:var(--tx)}
.tl14 label.sl select{width:auto;max-width:100%}
.tl14b{overflow:hidden;border-radius:8px;border:1px solid var(--bd);background:#fff;min-height:80px}
.tl14b>.tmw{zoom:var(--z,1)}
.tl14b .tl14e{padding:18px;text-align:center;color:#556}
`;
document.head.appendChild(css);

/* ---------- أدوات ---------- */
const NAT={'بنغلاديش':'Bangladeshi','بنغلاديشية':'Bangladeshi','سعودي':'Saudi','سعودية':'Saudi','بنغلاديشي':'Bangladeshi','بنجلاديشي':'Bangladeshi','البنغلاديشية':'Bangladeshi','البنجلاديشية':'Bangladeshi','هندي':'Indian','الهندية':'Indian','باكستاني':'Pakistani','الباكستانية':'Pakistani','مصري':'Egyptian','يمني':'Yemeni','إندونيسي':'Indonesian','اندونيسي':'Indonesian','نيجيري':'Nigerian','تركي':'Turkish','صومالي':'Somali','سوداني':'Sudanese','أفغاني':'Afghan','نيبالي':'Nepali','سريلانكي':'Sri Lankan'};
const GEN={'ممتاز':'Excellent','جيد جداً':'Very Good','جيد جدا':'Very Good','جيد':'Good','مقبول':'Acceptable','راسب':'Fail'};
const ratingOf=gl=>gl?String(gl).replace(/\s*مرتفع$/,''):'—';
const f2s=x=>x==null||isNaN(x)?'—':(+x).toFixed(2);
const dIso=d=>{const x=String(d||'').slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(x)?x:new Date().toISOString().slice(0,10)};
const Dm=d=>{const[y,m,x]=dIso(d).split('-');return `${x}/${m}/${y}`};
const hj=d=>{try{const p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(new Date(dIso(d)+'T12:00:00')),g=t=>(p.find(x=>x.type==t)||{}).value;return `${g('day')}-${g('month')}-${g('year')}`}catch(e){return ''}};
const bd=x=>`<bdi dir="ltr">${E(x)}</bdi>`;
const num=x=>{const n=+(+x).toFixed(2);return String(n)};

/* ---------- الخلفية الزخرفية (مطابقة لوثيقة التخرج، بمقاس A4 عمودي) ---------- */
const BGW=794,BGH=1122;
const bgSVG=first=>{const lines=[];for(let i=0;i<13;i++){const y=300+i*46,en=i%2;lines.push(`<text direction="ltr" x="${en?-110:-30}" y="${y}" font-family="${en?"'EB Garamond','Times New Roman',serif":'Amiri,serif'}" font-size="${en?24:28}" font-weight="700" fill="#6f86a3">${(en?EN+'   ':AR+'   ').repeat(3)}</text>`)}
const orn=(x,y)=>`<g transform="translate(${x} ${y}) scale(.5)"><rect x="-20" y="-20" width="40" height="40" fill="#fff" stroke="#003366" stroke-width="2.4"/><rect x="-14" y="-14" width="28" height="28" fill="none" stroke="#1A365D" stroke-width="1"/><rect x="-9" y="-9" width="18" height="18" fill="none" stroke="#003366" stroke-width="1.6" transform="rotate(45)"/><rect x="-9" y="-9" width="18" height="18" fill="none" stroke="#003366" stroke-width="1.6"/><rect x="-3.5" y="-3.5" width="7" height="7" fill="#003366" transform="rotate(45)"/></g>`;
const star=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#003366" stroke-width="1.3"/><rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#003366" stroke-width="1.3" transform="rotate(45)"/><rect x="-2" y="-2" width="4" height="4" fill="#003366" transform="rotate(45)"/></g>`;
return `<svg class="d-svg" viewBox="0 0 ${BGW} ${BGH}" xmlns="http://www.w3.org/2000/svg"><defs>
<linearGradient id="d14b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f9fc"/><stop offset=".22" stop-color="#d4e1f0"/><stop offset=".5" stop-color="#f1f3f5"/><stop offset=".78" stop-color="#d0deee"/><stop offset="1" stop-color="#e4e7ea"/></linearGradient>
<linearGradient id="d14h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b4cbe6" stop-opacity=".75"/><stop offset=".12" stop-color="#dbe6f3" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity=".35"/><stop offset=".7" stop-color="#fff" stop-opacity=".35"/><stop offset=".88" stop-color="#dbe6f3" stop-opacity=".5"/><stop offset="1" stop-color="#b4cbe6" stop-opacity=".75"/></linearGradient>
<linearGradient id="d14t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd0e6"/><stop offset="1" stop-color="#bcd0e6" stop-opacity="0"/></linearGradient>
<linearGradient id="d14u" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d6e6" stop-opacity="0"/><stop offset="1" stop-color="#c9d6e6"/></linearGradient>
<pattern id="d14p" width="64" height="64" patternUnits="userSpaceOnUse"><g fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".55"><rect x="14" y="14" width="36" height="36"/><rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)"/></g><g fill="none" stroke="#6f8fb5" stroke-width=".6" stroke-opacity=".25"><rect x="15" y="15" width="36" height="36"/><rect x="15" y="15" width="36" height="36" transform="rotate(45 33 33)"/></g></pattern>
<pattern id="d14a" width="76" height="120" patternUnits="userSpaceOnUse" x="12"><path d="M6 118V62C6 34 24 14 38 4C52 14 70 34 70 62V118Z" fill="#fff" fill-opacity=".30" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/><path d="M16 118V64C16 42 28 26 38 18C48 26 60 42 60 64V118Z" fill="none" stroke="#9db4d0" stroke-opacity=".5" stroke-width="1"/></pattern>
<linearGradient id="d14c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".11" stop-color="#fff"/><stop offset=".19" stop-color="#000"/></linearGradient>
<linearGradient id="d14e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".6" stop-color="#fff"/></linearGradient>
<mask id="d14q"><rect width="${BGW}" height="${BGH}" fill="url(#d14c)"/></mask>
<mask id="d14r"><rect y="1000" width="${BGW}" height="110" fill="url(#d14e)"/></mask>
<linearGradient id="d14m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".2" stop-color="#fff"/><stop offset=".32" stop-color="#000"/><stop offset=".68" stop-color="#000"/><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="d14w"><rect width="${BGW}" height="${BGH}" fill="url(#d14m)"/></mask></defs>
<rect width="${BGW}" height="${BGH}" fill="#fff"/><rect width="${BGW}" height="${BGH}" fill="url(#d14b)"/><rect width="${BGW}" height="${BGH}" fill="url(#d14h)"/>
<rect width="${BGW}" height="80" fill="url(#d14t)"/><rect y="1040" width="${BGW}" height="82" fill="url(#d14u)"/>
<rect width="${BGW}" height="${BGH}" fill="url(#d14p)" opacity=".9"/>
<rect y="28" width="${BGW}" height="190" fill="url(#d14a)" mask="url(#d14q)"/>
<rect y="1000" width="${BGW}" height="110" fill="url(#d14a)" opacity=".35" mask="url(#d14r)"/>
<g mask="url(#d14w)" opacity=".20">${lines.join('')}</g>
<rect x="0" y="238" width="${BGW}" height="650" fill="#fff" fill-opacity=".34"/>
<rect x="9" y="9" width="${BGW-18}" height="${BGH-18}" fill="none" stroke="#003366" stroke-width="1.6"/><rect x="15" y="15" width="${BGW-30}" height="${BGH-30}" fill="none" stroke="#003366" stroke-width=".7" stroke-opacity=".7"/>
${orn(14,14)}${orn(BGW-14,14)}${orn(14,BGH-14)}${orn(BGW-14,BGH-14)}${first?star(262,186)+star(532,186):''}</svg>`};
const DVS=`<svg class="d-dv" viewBox="0 0 674 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="d14d" x1="0" x2="1"><stop offset="0" stop-color="#003366" stop-opacity="0"/><stop offset=".2" stop-color="#003366" stop-opacity=".65"/><stop offset=".8" stop-color="#003366" stop-opacity=".65"/><stop offset="1" stop-color="#003366" stop-opacity="0"/></linearGradient></defs><rect x="0" y="4.5" width="674" height="1" fill="url(#d14d)"/><path d="M337 0l6 5-6 5-6-5z" fill="#003366"/></svg>`;
const MT=AR+' · '+EN+' · ';

/* ---------- القياس والتصفيح ---------- */
const CAP0=596,CAPN=640; /* v45: سعة آمنة لا تلامس منطقة التذييل */
function mbox(){const m=document.createElement('div');m.className='tmw';m.setAttribute('data-d14','1');m.style.cssText='position:fixed;left:-3000px;top:0';m.innerHTML='<div class="tmp d14"><div class="d-bd" style="position:static;width:690px;height:auto"></div></div>';document.body.appendChild(m);const b=m.querySelector('.d-bd');return{meas:h=>{b.innerHTML=h;return b.offsetHeight},done:()=>m.remove()}}
function paginate(U){const pages=[[]];let used=0,cap=CAP0;
 U.forEach(it=>{const cur=pages[pages.length-1];if(it.brk&&cur.length){pages.push([]);used=0;cap=CAPN}
  if(used+it.ht>cap&&pages[pages.length-1].length){pages.push([]);used=0;cap=CAPN}
  pages[pages.length-1].push(it);used+=it.ht});
 /* لا يُترك عنوان فصل أو فاصل معلّقاً في آخر صفحة */
 for(let g=0;g<20;g++){let moved=false;for(let i=0;i<pages.length-1;i++){const p=pages[i],l=p[p.length-1];if(l&&l.kn&&p.length>1){p.pop();pages[i+1].unshift(l);moved=true}}if(!moved)break}
 return pages.filter(p=>p.length)}

/* ---------- بناء الصفحات ---------- */
function build14(o){
 const LG=window.__LG13||LOGO,SL=window.__SL13||SEAL,rec=o.rec,date=dIso(o.date),hi=hj(date),pages=paginate(o.items),n=pages.length;
 let vu='';try{vu=vlink(rec)}catch(e){}
 return `<div class="tmw" data-d14="1">`+pages.map((p,i)=>{const first=i==0||!!p[0].brk,last=i==n-1||!!pages[i+1][0].brk;
 return `<div class="tmp d14">${o.revoked?'<div class="rvk">ملغاة</div>':''}${bgSVG(first)}<img class="d-wm" src="${window.LOGOM||LG}" alt=""><div class="d-mt">${MT.repeat(10)}</div>
<div class="d-bs">بسم الله الرحمن الرحيم</div>
<div class="d-hd"><div class="d-ar"><b>${AR}</b><span>مجلس الشؤون التعليمية</span><span>قسم القبول والتسجيل</span></div><img src="${LG}" alt=""><div class="d-en"><b>At Tamhid Institute</b><span>Board of Educational Affairs</span><span>Admission &amp; Registration Department</span></div></div>
${DVS}
<div class="d-ti${first?'':' c'}"><b>${E(o.title)}${first?'':' — تابع'}</b><span>${E(o.titleEn)}${first?'':' (continued)'}</span></div>
<div class="d-bd${first?'':' c'}">${p.map(x=>x.h).join('')}</div>
<div class="d-ft"><div class="d-inf"><div class="au"><span>المدقق :</span><b>تدقيق إلكتروني</b><em>Verifier: Electronic Verification</em><i></i></div><div>حُرّرت في ${bd(hi)} هـ الموافق ${bd(Dm(date))} م</div><div class="en">Issue Date: ${E(Dm(date))} AD (${E(hi)} AH)</div></div>
<div class="d-dn">${last?`<div class="t">رئيس معهد التمهيد</div><div class="te">Chairman of At Tamhid Institute</div><div class="im"><img src="${SIG}" alt=""></div><i class="ln"></i><div class="nmz">أ. المفتي منير الإسلام بن معيذ الدين</div><div class="nme">Mufti Munirul Islam Ibn Moiez Uddin</div><img class="sl" src="${SL}" alt="">`:`<div class="cn">يتبع في الصفحة التالية ←</div>`}</div>
<div class="d-qrw"><div class="d-qr"><img src="${qr(vu||rec)}" alt=""></div><div class="d-idn a">رقم السجل</div><div class="d-idn">Record No.: ${E(rec)}</div></div></div>
<div class="d-nt"><span class="en">ANY ADDITION, ALTERATION OR ERASURE VOIDS THIS DOCUMENT.</span><span class="ar">أي كشط أو تعديل يلغي هذه الوثيقة</span></div>
<div class="d-pn"><span class="ar">صفحة ${bd(i+1)} من ${bd(n)}</span><span class="en">Page ${i+1} of ${n}</span></div></div>`}).join('')+`</div>`}

/* ---------- السجل الأكاديمي: الحقول المعتمدة حصراً ---------- */

/* ---------- v50: القاموس الأكاديمي الثنائي ومساعدات السجل ---------- */
const NX=x=>String(x==null?'':x).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const NA=x=>String(x==null?'':x).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const CEN={'0101':'The Holy Quran','0102':'Basic Linguistics (Reading) 1','0103':'Basic Linguistics (Writing) 1','0104':'Basic Linguistics (Listening and Speaking) 1','0107':'Arabic Grammar 1','0108':'Basic Linguistics (Structures)',
'0110':'Islamic Sciences','0111':'Reading','0112':'Arabic Grammar 2','0114':'Basic Linguistics (Writing) 2','0115':'Linguistic Communication (Listening and Speaking)','0216':'Written Expression','0217':'Reading',
'0218':'Saudi Civilization and Culture','0219':'Lessons from the Holy Quran','0220':'Islamic Sciences','0221':'Lessons from the Holy Quran','0222':'History of the Kingdom of Saudi Arabia','0223':'Islamic Sciences','0224':'Reading',
'0225':'Linguistic Editing 1','0226':'Literary Texts 1','0227':'Linguistic Communication (Listening and Speaking)','0228':'E-Learning Applications 1 (Arabic Language)','0229':'Lessons from the Holy Quran'};
const NEN={'القرآن الكريم':'The Holy Quran','القراءة':'Reading','العلوم الشرعية':'Islamic Sciences','دروس من القرآن الكريم':'Lessons from the Holy Quran','التعبير الكتابي':'Written Expression','قواعد اللغة':'Arabic Grammar','لغويات أساسية (القراءة)':'Basic Linguistics (Reading)','لغويات أساسية (الكتابة)':'Basic Linguistics (Writing)','لغويات أساسية (استماع ومحادثة)':'Basic Linguistics (Listening and Speaking)','لغويات أساسية (التراكيب)':'Basic Linguistics (Structures)','التواصل اللغوي (استماع ومحادثة)':'Linguistic Communication (Listening and Speaking)','الحضارة والثقافة السعودية':'Saudi Civilization and Culture','تاريخ المملكة العربية السعودية':'History of the Kingdom of Saudi Arabia','التحرير اللغوي':'Linguistic Editing','النصوص الأدبية':'Literary Texts','تطبيقات تعلم إلكتروني':'E-Learning Applications'};
const POB={'KISHOREGANJ':'كيشوريغانج','DHAKA':'دكا','TANGAIL':'تانغيل','SIRAJGANJ':'سيراجغانج'};
const STEN={'متخرج':'Graduated','منتظم':'Enrolled','موقوف':'Suspended','منسحب':'Withdrawn','مؤجل':'Deferred','مفصول':'Dismissed'};
function courseEn(code,name){
 try{const L=(typeof crs=='function'?crs():[]),k=NX(code),c=L.find(x=>x&&((code&&NX(x.code)==k)||(!code&&x.name==name)));if(c&&c.nameEn&&!/[\u0600-\u06FF]/.test(c.nameEn))return c.nameEn}catch(e){}
 /* v65: مصدر واحد — قائمة المقررات المعتمدة فقط */
 try{const A=(window.V51&&V51.allCourses65)?V51.allCourses65():[],k=NX(code),c=A.find(x=>x&&((code&&NX(x.code)==k)||(!code&&x.name==name)));if(c&&c.nameEn)return c.nameEn}catch(e){}
 return ''}
const tmEn=c=>{const en=courseEn(c.code,c.name);return en?`<small class="ce">${E(en)}</small>`:''};
const tmCode=code=>{if(!code)return '—';return `<span class="ca">${E(NA(NX(code)))}</span><small class="ce">${E(NX(code))}</small>`};
const nb=x=>E(x).replace(/(\d[\d\s\/\-–]*\d|\d)/g,'<bdi dir="ltr">$1</bdi>');
const ORDN=['','One','Two','Three','Four'];
function semEn(sm,v){
 const nm=String(sm&&sm.name||''),m=nm.match(/(\d{4})\s*هـ\s*\/\s*(\d{4})\s*م/),ord=ORDN[v.l]||v.l;
 const sem=/الثاني/.test(nm)?'Second':/الأول/.test(nm)?'First':(v.l%2?'First':'Second');
 return `Level ${ord} — ${sem} Semester${m?` ${m[1]} AH / ${m[2]} AD`:''}`}
function yearEn(sm){const m=String(sm&&sm.year||'').match(/(\d{4})\s*\/\s*(\d{4})\s*هـ\s*\(\s*(\d{4})\s*\/\s*(\d{4})\s*م\s*\)/);return m?`Academic Year ${m[1]} / ${m[2]} AH (${m[3]} / ${m[4]} AD)`:''}
function semHead(sm,v){
 const ar=nb((v.lvn?v.lvn+' — ':'')+(sm.name||('الفصل الدراسي '+(v.l%2?'الأول':'الثاني')))),en=semEn(sm,v),ye=yearEn(sm);
 return `<b>${ar}</b><span>${E(en)}</span>${sm.year?`<div class="sy"><span class="a">العام الدراسي: ${nb(sm.year)}</span>${ye?`<span class="e">${E(ye)}</span>`:''}</div>`:''}`}
window.TMX={courseEn,CEN,NEN,POB,STEN,NX,NA};

window.tmTranscript=function(o){
 const s=o.s||{},st=S.students.find(x=>x.id==s.id)||s,rq=S.requests.find(r=>r.sid==s.id)||{},nEn=st.nameEn||rq.nameEn||'',nat=s.nat||st.nat||'',natEn=NAT[nat]||st.natEn||rq.natEn||'',
  prog=(P(DIP)||{}).name||'',progEn=(P(DIP)||{}).nameEn||'Diploma of General Arabic Language for Non-Native Speakers',
  R=o.R||{},title=R.title||'السجل الأكاديمي',titleEn=R.titleEn||'Academic Transcript',
  lv=(o.levels||[]).filter(v=>!v.skip&&v.rows&&v.rows.length),mb=mbox(),U=[],push=(h,x)=>U.push(Object.assign({h,ht:mb.meas(h)},x||{}));
 try{
  const ir=(a,e,v,ve,f)=>`<div class="ir${f?' f':''}"><div class="il"><b>${a}</b><i>${e}</i></div><div class="iv">${v}${ve?`<span>${ve}</span>`:''}</div></div>`;
  push(`<div class="ib">${ir('الاسم','Name',E(s.name),E(nEn))}${ir('الرقم الأكاديمي','Student ID',bd(s.id||'—'))}${ir('الجنسية','Nationality',E(nat||'—'),E(natEn))}${ir('رقم الهوية / الجواز','ID / Passport No.',bd(s.pid||st.pid||'—'))}${(()=>{const gx=String(st.sex||st.gender||''),F=/أنثى|انثى|female/i.test(gx),M=/ذكر|male/i.test(gx),sa=String(st.status||s.status||'');return ir('الجنس','Gender',F?'أنثى':M?'ذكر':'—',F?'Female':M?'Male':'')+ir('الحالة الأكاديمية','Academic Status',E(sa||'—'),E(STEN[sa]||''))})()}${(st.dob||st.pob)?ir('تاريخ الميلاد','Date of Birth',st.dob?bd(Dm(st.dob)):'—')+ir('مكان الميلاد','Place of Birth',E(POB[String(st.pob||'').toUpperCase()]||st.pob||'—'),E(POB[String(st.pob||'').toUpperCase()]?st.pob:'')):''}${ir('البرنامج','Program',E(prog),E(progEn),1)}</div>`);
  let tS=0,tM=0;
  lv.forEach(v=>{const rows=v.rows,ev=rows.filter(c=>c.fin&&c.score!=null),sum=ev.reduce((a,c)=>a+numOr0(c.score),0),max=ev.length*100,pct=max?sum/max*100:null;tS+=sum;tM+=max;
   let sm={name:'',year:''};try{sm=(window.semOf48?semOf48(s,v.l):window.semOf(v.l))||sm}catch(e){}
   const th=`<tr><th style="width:12%">رمز المقرر<small>Code</small></th><th style="width:33%">اسم المقرر<small>Course Name</small></th><th style="width:23%">الدرجة النهائية (من 100)<small>Final Mark /100</small></th><th style="width:15%">الساعات المعتمدة<small>Credit Hours</small></th><th>التقدير اللفظي<small>Grade</small></th></tr>`;
   const tr=rows.map(c=>{const g=c.fin?ratingOf(c.gl):'—',ge=c.fin?(GEN[g]||''):'';return `<tr><td class="c">${tmCode(c.code)}</td><td class="n">${E(c.name)}${tmEn(c)}</td><td class="c">${c.fin&&c.score!=null?num(c.score):'—'}</td><td class="c">${E(c.hrs)}</td><td>${E(g)}${ge?`<small class="ce">${ge}</small>`:''}</td></tr>`}).join('');
   push(`<div class="sm"><div class="sh">${semHead(sm,v)}</div><table class="d-tb">${th}${tr}</table><div class="ss"><div><b>مجموع الدرجات</b><i>Total Marks</i><em>${ev.length?num(sum)+' / '+max:'—'}</em></div><div><b>النسبة المئوية (%)</b><i>Percentage</i><em>${pct==null?'—':pct.toFixed(2)+'%'}</em></div><div><b>المعدل الفصلي</b><i>Semester GPA (out of 5.00)</i><em>${v.gpa==null?'—':f2s(v.gpa)+' / 5.00'}</em></div></div></div>`,{kn:0});
  });
  if(!lv.length)push(`<div class="lt"><p style="text-align:center">لا توجد مقررات مسجَّلة بعد.</p></div>`);
  const cg=o.k&&o.k.gpa!=null?o.k.gpa:null,tp=tM?tS/tM*100:null;
  push(`<div class="tt"><div class="ss"><div><b>مجموع الدرجات الإجمالي</b><i>Overall Total Marks</i><em>${tM?num(tS)+' / '+tM:'—'}</em></div><div><b>النسبة المئوية العامة (%)</b><i>Overall Percentage</i><em>${tp==null?'—':tp.toFixed(2)+'%'}</em></div><div><b>المعدل التراكمي</b><i>Cumulative GPA (out of 5.00)</i><em>${cg==null?'—':f2s(cg)+' / 5.00'}</em></div></div></div>`);
  push(`<div class="end">نهاية السجل الأكاديمي<small>End of Academic Transcript</small></div>`);
 }finally{mb.done()}
 return build14({rec:trNo67(o.id),date:new Date().toISOString().slice(0,10),title,titleEn,items:U})};

/* ---------- خطابا القبول والتوصية: إعادة إخراج بهوية وثيقة التخرج (النصوص والبيانات كما هي) ---------- */
function restyleLetter(h,c){
 const w=document.createElement('div');w.innerHTML=h;const raw=[];let brk=false;
 w.querySelectorAll('.tmp .bd').forEach(bdn=>[...bdn.children].forEach(ch=>{
  const h2=ch.querySelector&&ch.querySelector('h2');
  if(h2){if(/direction\s*:\s*ltr/i.test(h2.getAttribute('style')||''))brk=true;return}
  if(ch.classList.contains('lt')&&ch.classList.contains('en')&&/text-align\s*:\s*center/i.test(ch.getAttribute('style')||'')&&!ch.querySelector('p,table'))return;
  raw.push({h:ch.outerHTML,brk});brk=false}));
 const mb=mbox(),U=[];try{raw.forEach(r=>U.push({h:r.h,ht:mb.meas(r.h),brk:r.brk}))}finally{mb.done()}
 const t=(typeof CT!='undefined'&&CT[c.type])||['',''];
 return build14({rec:c.rec,date:c.date,title:t[0],titleEn:t[1],items:U,revoked:!!c.revoked})}
const _c14=certHTML;
certHTML=function(c){const h=_c14.apply(this,arguments);
 if(c&&(c.type=='acc'||c.type=='rec')&&/^\s*<div class="tmw"/.test(h||'')&&!/data-d14/.test(h)){try{return restyleLetter(h,c)}catch(e){console.error('d14 letter',e)}}
 return h};

/* ---------- تنزيل PDF متعدد الصفحات (A4 دقيق) للدُفعات ---------- */
async function tmwPdf(h){const w=document.createElement('div');w.style.cssText='position:fixed;left:-3000px;top:0';w.innerHTML=h;document.body.appendChild(w);
 try{await document.fonts.ready;const ps=[...w.querySelectorAll('.tmp')],{jsPDF}=window.jspdf,d=new jsPDF({unit:'mm',format:'a4',compress:true});
  for(let i=0;i<ps.length;i++){const cv=await html2canvas(ps[i],{scale:2.5,backgroundColor:'#ffffff',useCORS:true});if(i)d.addPage('a4','p');d.addImage(cv.toDataURL('image/jpeg',.95),'JPEG',0,0,210,297)}
  return d.output('blob')}finally{w.remove()}}
const _mk14=mkBlob;mkBlob=async function(h,f,sc){if(f=='pdf'&&/^\s*<div class="tmw"[^>]*data-d14/.test(h||''))return tmwPdf(h);return _mk14.apply(this,arguments)};

/* ---------- المعاينة الحية للسجل الأكاديمي ---------- */
window.trHTML=function(id,draft){const A=S.students,i=A.findIndex(x=>x.id==id);if(i<0)return '';const orig=A[i],_s=show;let out='';
 show=function(h){out=h};
 try{if(draft)A[i]=draft;window.seeRec(id)}finally{A[i]=orig;show=_s}
 return out};
const liveBox=(sid,mode,sel)=>`<div class="tl14" data-sid="${E(sid||'')}" data-mode="${mode}" data-noi18n="1"><div class="th"><b>${Bz('المعاينة الحية للسجل الأكاديمي','Live academic transcript preview')}</b><span class="tg" data-t>${Bz('تتحدّث تلقائياً','Updates automatically')}</span><button type="button" class="btn s" onclick="trLiveOpen(this)">${Bz('عرض بملء الشاشة · طباعة · تصدير','Full view · print · export')}</button></div>${sel?`<label class="sl">${Bz('الطالب','Student')}<select onchange="trLiveSel(this)">${S.students.map(x=>`<option value="${E(x.id)}" ${x.id==sid?'selected':''}>${E(x.name)} — ${E(x.id)}</option>`).join('')}</select></label>`:''}<div class="tl14b"></div></div>`;
function fitLive(el){const b=el.querySelector('.tl14b');if(!b)return;b.style.setProperty('--z',1);const t=b.firstElementChild;if(!t||!t.offsetWidth)return;b.style.setProperty('--z',Math.min(1,(b.clientWidth-4)/t.offsetWidth))}
function renderLive(el,force){const b=el.querySelector('.tl14b'),id=el.dataset.sid;if(!b)return;
 if(!id){b.innerHTML=`<div class="tl14e">${Bz('اختر طالباً لعرض سجله الأكاديمي.','Select a student to preview the academic transcript.')}</div>`;return}
 let h='';try{h=window.trHTML(id,el._draft)}catch(e){console.error('d14 live',e)}
 if(!h){b.innerHTML=`<div class="tl14e">${Bz('تعذّر عرض السجل.','Unable to render the record.')}</div>`;return}
 if(!force&&el._h===h)return;el._h=h;b.innerHTML=h;fitLive(el);
 const tg=el.querySelector('[data-t]');if(tg){tg.classList.toggle('dr',!!el._draft);tg.textContent=el._draft?Bz('مسودة — قبل الحفظ','Draft — not saved yet'):Bz('محدَّثة '+new Date().toLocaleTimeString('en-GB'),'Updated '+new Date().toLocaleTimeString('en-GB'))}
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fitLive(el))}
const refreshAll=force=>{document.querySelectorAll('.tl14').forEach(el=>{try{renderLive(el,force)}catch(e){console.error(e)}})};
window.trLiveSel=sel=>{const el=sel.closest('.tl14');el.dataset.sid=sel.value;window.__tl14sel=sel.value;el._draft=null;renderLive(el,true)};
window.trLiveOpen=btn=>{const el=btn.closest('.tl14'),id=el.dataset.sid;if(id)window.seeRec(id)};
function draftOf(f,sid){const s=S.students.find(x=>x.id==sid);if(!s)return null;const d=JSON.parse(JSON.stringify(s)),v=fv(f),GS=window.GSC5||[];d.gr=d.gr||{};
 d.reg=d.reg||[];crs().filter(c=>!c.legacy).forEach(c=>{const sc=v['s_'+c.id],gl=v['g_'+c.id],stt=v['o_'+c.id],old=d.gr[c.id];if(sc===undefined)return;
  if(sc===''&&!gl&&!stt){if(old&&old.man)delete d.gr[c.id];return}
  const nm=sc===''?null:Math.min(100,Math.max(0,+sc)),base=gl?GS.find(x=>x[1]==gl):(nm!=null?GS.find(x=>nm>=x[0]):null);if(!base)return;
  d.gr[c.id]={rel:1,score:nm,gl:base[1],pts:base[2],ok:stt?stt=='اجتاز':base[2]>=2,fin:1,man:1};if(!d.reg.includes(c.id))d.reg.push(c.id)});
 return d}
let dt;document.addEventListener('input',e=>{const f=e.target&&e.target.form;if(!f||!/return grSave\(/.test(f.getAttribute('onsubmit')||''))return;const el=f.querySelector('.tl14');if(!el)return;clearTimeout(dt);dt=setTimeout(()=>{el._draft=draftOf(f,el.dataset.sid);renderLive(el,true)},250)});
document.addEventListener('change',e=>{const f=e.target&&e.target.form;if(!f||!/return grSave\(/.test(f.getAttribute('onsubmit')||''))return;const el=f.querySelector('.tl14');if(!el)return;el._draft=draftOf(f,el.dataset.sid);renderLive(el,true)});
function inject(){if(typeof me=='undefined'||!me)return;
 if(me.r=='student'){if(document.querySelector('#app .tl14'))return;
  const h3=[...document.querySelectorAll('#app h3')].find(x=>/درجاتي في مقررات الدبلوم/.test(x.textContent)),host=h3&&h3.nextElementSibling;
  if(host){host.insertAdjacentHTML('afterend',liveBox(me.id,'student',false));renderLive(document.querySelector('#app .tl14'),true)}}
 else if(me.r=='admin'){
  const f=document.querySelector('form[onsubmit^="return grSave("]');
  if(f&&!f.querySelector('.tl14')&&typeof cf!='undefined'&&cf&&cf.id){const b=f.querySelector('button.btn:not([type=button])');const d=document.createElement('div');d.innerHTML=liveBox(cf.id,'admin-draft',false);const bx=d.firstElementChild;b?b.before(bx):f.append(bx);renderLive(bx,true)}
  const acx=document.getElementById('acx');
  if(acx&&!acx.querySelector('.tl14')){const sid=window.__tl14sel||(S.students[0]||{}).id||'';acx.insertAdjacentHTML('beforeend',liveBox(sid,'admin',true));renderLive(acx.querySelector('.tl14'),true)}}}
try{GOH.post.push(()=>{try{inject();document.querySelectorAll('.tl14').forEach(el=>{el._k=snapOf(el.dataset.sid)})}catch(e){console.error('d14 inject',e)}})}catch(e){console.error(e)}
/* رصد فوري لأي تغيّر في الدرجات/التسجيل (save ثابت لا يمكن تغليفه، لذا نقارن لقطة خفيفة كل ثانية ونصف) */
const snapOf=id=>{const s=S.students.find(x=>x.id==id);if(!s)return '';try{return JSON.stringify([s.lvl,s.reg,s.name,s.nat,s.pid,Object.entries(s.gr||{}).map(([k,g])=>[k,g.rel,g.score,g.gl,g.fin,g.ok])])}catch(e){return ''}};
setInterval(()=>{try{document.querySelectorAll('.tl14').forEach(el=>{if(el.dataset.mode=='admin-draft'&&el._draft)return;const k=snapOf(el.dataset.sid);if(el._k!==k){el._k=k;if(el.dataset.mode!='admin-draft')el._draft=null;renderLive(el)}})}catch(e){}},1500);
setInterval(async()=>{try{if(document.hidden||!document.querySelector('.tl14'))return;
 if(typeof sb!=='undefined'&&sb&&me&&me.r=='student'&&typeof sbUserPull=='function'){const keep=me;await sbUserPull('student',me.id);me=keep}
 document.querySelectorAll('.tl14').forEach(el=>{if(el.dataset.mode!='admin-draft')renderLive(el)})}catch(e){}},8000);
window.addEventListener('resize',()=>document.querySelectorAll('.tl14').forEach(fitLive));
window.d14={build:build14,restyleLetter,refresh:refreshAll};
}catch(e){console.error('d14',e)}})();


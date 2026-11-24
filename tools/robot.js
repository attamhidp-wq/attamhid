// v135 — المنفّذ الآلي: يعمل على GitHub Actions كل 5 دقائق.
// يحصل على جلسة إدارية مؤقتة بإثبات هوية GitHub (OIDC)، ثم يفتح الموقع نفسه ويشغّل V51.robot134():
// ترقية قوائم الانتظار، إصدار الشهادات عند انتهاء البرامج، وإرسالها بالبريد مرفقةً PDF مع شهادة الشكر للمدرب.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const SB = 'https://ttuelhswxyjbjdnydmns.supabase.co', SITE = process.env.SITE || 'https://attamhid.com/';
(async () => {
  // v231: المفتاح العام (anon) من ملفات الموقع المبنية؛ المصدر لم يعد في المستودع العام
  const R = path.join(__dirname, '..'), cur = JSON.parse(fs.readFileSync(path.join(R, 'js', 'manifest.json'), 'utf8')).cur || [];
  let key = '';
  for (const f of ['app.html', ...cur]) { const p = path.join(R, f); if (!fs.existsSync(p)) continue;
    for (const t of fs.readFileSync(p, 'utf8').match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) || []) {
      try { const pl = JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString()); if (pl.role === 'anon' && pl.ref === 'ttuelhswxyjbjdnydmns') { key = t; break; } } catch (e) { } }
    if (key) break; }
  const u = process.env.ACTIONS_ID_TOKEN_REQUEST_URL, t = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!u || !t || !key) throw new Error('OIDC/key unavailable');
  const oidc = (await (await fetch(u + '&audience=attamhid-robot', { headers: { Authorization: 'Bearer ' + t } })).json()).value;
  const r = await fetch(SB + '/functions/v1/v134-robot', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + key }, body: JSON.stringify({ oidc }) });
  const cred = await r.json();
  if (!cred.ok) throw new Error('robot session: ' + JSON.stringify(cred));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1300, height: 900 }, serviceWorkers: 'block', locale: 'ar' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && /v51|core|is not|undefined|TypeError|ReferenceError/i.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
  p.on('dialog', (d) => d.accept().catch(() => {}));
  // صفحة التجربة تحمل إصداراً أحدث من version.json المنشور؛ نمرر _b حتى لا يعيد الموقع تحميلها أثناء الفحص
  let liveV = ''; try { liveV = (await (await fetch(new URL('/version.json?t=' + Date.now(), SITE))).json()).v || ''; } catch (e) {}
  await p.goto(SITE + '?robot=1' + (liveV ? '&_b=' + liveV : ''), { waitUntil: 'load', timeout: 90000 });
  try { await p.waitForFunction(() => typeof sbAdminLogin === 'function' && window.V51 && V51.robot134, null, { timeout: 90000 }); }
  catch (e) { const st = await p.evaluate(() => ({ url: location.href, sbAdminLogin: typeof sbAdminLogin, V51: !!window.V51, core: !!(window.V51 && V51.core), robot134: !!(window.V51 && V51.robot134), scripts: document.scripts.length, ready: window.__ready173, build: window.__BUILD__ })).catch((x) => String(x)); console.log('BOOT-FAIL', JSON.stringify(st), 'errors:', errs.slice(0, 8).join(' | ')); throw e; }
  await p.evaluate((c) => sbAdminLogin({ u: c.email, p: c.password }), cred);
  await p.waitForFunction(() => typeof me !== 'undefined' && me && me.r === 'admin' && /^#\/admin/.test(location.hash), null, { timeout: 120000 });
  await p.waitForTimeout(12000);
  const res = await p.evaluate(() => V51.robot134());
  console.log('result', JSON.stringify(res));
  await p.waitForTimeout(15000);
  // فحص عند التشغيل اليدوي فقط: بوابة الخريجين تُفتح للإدارة المركزية ولا تبقى على «جارٍ التحميل»
  if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch') {
    console.log('CHECK admin-links', await p.evaluate(() => { location.hash = '#/admin'; return new Promise((r) => setTimeout(() => r(document.querySelector('.ft231adm') ? 'OK' : 'FAIL'), 6000)); }));
    await p.evaluate(() => { location.hash = '#/graduates'; });
    await p.waitForTimeout(15000);
    const t = await p.evaluate(() => ((document.querySelector('#app') || {}).innerText || '').slice(0, 120).replace(/\s+/g, ' '));
    await p.evaluate(() => { location.hash = '#/graduates/forms'; }); await p.waitForTimeout(6000);
    const fr = await p.evaluate(async () => { const codes = [...document.querySelectorAll('#app table tr td:first-child b')].map((b) => b.textContent.trim()).filter((c) => /^[تمخ]-\d+$/.test(c)); const bad = [], pages = {};
      for (const c of codes) { try { await V51.h.ft231pv(c); } catch (e) { bad.push(c + ':' + e.message); continue; } await new Promise((r) => setTimeout(r, 400)); const d = document.querySelector('.g9-doc[data-nf]'); if (!d || d.innerText.length < 200) bad.push(c + ':empty'); else pages[c] = d.querySelectorAll('.g9p').length; try { closeM && closeM(); } catch (e) {} }
      const real = {}; try { const N = window.__nf232, r = N.rec('TR-261122-68259'); if (r) for (const c of N.NFO.filter((c) => N.NF[c].k === r.kind)) { try { const h = await N.build(c, r, 'TEST', new Date().toISOString()); real[c] = (h.match(/class="g9p/g) || []).length + 'p' + (N.NF[c].when(r) ? '' : '(not-yet)'); } catch (e) { real[c] = 'ERR ' + e.message; } } else real.none = 1; } catch (e) { real.err = e.message; }
      return { n: codes.length, bad, pages, real }; });
    console.log('CHECK forms-review', fr.n >= 14 && !fr.bad.length ? 'OK' : 'FAIL', JSON.stringify(fr));
    // v233: فحص التعبئة الآلية للنماذج التسعة بملف تجريبي كامل في الذاكرة (لا يُحفظ) مع إعدادات البوابة الحقيقية
    const af = await p.evaluate(async () => { const N = window.__nf232, FD = N.FD, out = {};
      const set = (o, path, v) => { const pp = path.split('.'); let c = o; for (let i = 0; i < pp.length; i++) { let k = pp[i]; const last = i === pp.length - 1; if (k === '-1') { if (!Array.isArray(c)) return; if (!c.length) c.push({}); k = c.length - 1; } const nk = pp[i + 1]; if (last) { if (c[k] === undefined || c[k] === '' || c[k] === null) c[k] = v; } else { if (c[k] == null || typeof c[k] !== 'object') c[k] = (/^-?\d+$/.test(nk) ? [] : {}); c = c[k]; } } };
      const val = (k, lab, src) => { if (/\.(c|s)\.\d+$|items\.\d+\.v$|weeks\.\d+\.h$|\.hrsWeek$|dailyHrs$|^m9\.(w|o)$/.test(src)) return '4'; if (/\.checks\.\d+$/.test(src)) return true; if (/(date|from|to|end|At|at|planDue)$/.test(src)) return '2026-12-01'; return 'TEST-' + k; };
      for (const kind of ['tr', 'gp']) { const r = N.sample(kind); r.id = 'TEST-' + kind; r.sid = 'TEST'; r.st = kind === 'tr' ? 'closed' : 'final_ok'; r.data.s = { ar: 'طالب الاختبار', en: 'Test Student', id: 'TEST', nat: 'TEST', ph: 'TEST' };
        for (let pass = 0; pass < 3; pass++) for (const c of Object.keys(FD)) { const D = FD[c]; if (D.k !== kind) continue; let L = []; try { L = D.f(r, D.subs ? ((D.subs(r) || [])[0] || [''])[0] : '') || []; } catch (e) { continue; } for (const x of L) { const src = x[4] || ''; if (!src || /^stu\./.test(src) || src === 'hrsNeed') continue; set(r.data, src, val(x[0], x[1], src)); } }
        const d = r.data, S1 = '12026001'; d.isup = S1; d.gsup = S1; d.usup = S1; r.sup = [S1]; d.dec = { to: 'approved', at: '2026-12-01' }; d.isupRec = { rec: 'yes', at: '2026-12-01' };
        (function walk(o, dep) { if (!o || typeof o !== 'object' || dep > 6) return; if (!Array.isArray(o) && o.at === undefined) o.at = '2026-12-01'; Object.keys(o).forEach((k) => { if (o[k] && typeof o[k] === 'object') walk(o[k], dep + 1); }); })(d, 0);
        d.app.entType = 'TEST'; d.app.city = 'TEST'; d.app.contact = 'TEST'; d.app.contactTitle = 'TEST'; d.m6 = d.m6 || {}; d.m6.m1 = S1; d.m6.m2 = S1; d.m7 = d.m7 || {}; d.m7.m1 = S1; d.m7.m2 = S1; d.cmt = [S1, S1]; d.reqs = []; d.final = { at: '2026-12-01' }; d.finalOk = { at: '2026-12-01' };
        for (const c of N.NFO.filter((c) => N.NF[c].k === kind)) { let m = [], h = '', err = ''; try { m = N.missing(c, r).map((x) => x[0]); } catch (e) { m = ['ERR ' + e.message]; } try { h = await N.build(c, r, (kind === 'tr' ? '20' : '21') + '202600000', new Date().toISOString()); } catch (e) { err = e.message; }
          out[c] = { miss: m, pages: (h.match(/class="g9p/g) || []).length, vals: (h.match(/TEST-/g) || []).length, sig: /l59-sgs/.test(h) && /<img[^>]+l59-seal|l59-seal/.test(h), qr: (h.match(/l59-qr/g) || []).length, term: /الفصل الدراسي: الفصل/.test(h), err }; } }
      return out; });
    console.log('CHECK autofill', Object.values(af).every((x) => !x.err && x.pages > 0 && x.sig && x.qr >= x.pages) ? 'OK' : 'FAIL', JSON.stringify(af));
    // v234: بوابة التدريب الميداني الخارجي — الصفحة العامة وصفحة الإدارة
    await p.evaluate(() => { location.hash = '#/ext-training'; }); await p.waitForTimeout(5000);
    const ex1 = await p.evaluate(() => ({ form: !!document.querySelector('#exform'), conds: (document.querySelector('#app') || {}).innerText.indexOf('الشروط والمتطلبات') >= 0 }));
    await p.evaluate(() => { location.hash = '#/ext-training/admin'; }); await p.waitForTimeout(6000);
    const ex2 = await p.evaluate(() => ((document.querySelector('#app') || {}).innerText || '').slice(0, 80).replace(/\s+/g, ' '));
    console.log('CHECK ext-portal', ex1.form && ex1.conds && /إدارة بوابة التدريب الميداني الخارجي/.test(ex2) ? 'OK' : 'FAIL', JSON.stringify({ ex1, ex2 }));
    // v235: الهوية الموحدة — صفحة الإدارة، ونموذج التسجيل وتحديد المستوى
    await p.evaluate(() => { location.hash = '#/idn-admin'; }); await p.waitForTimeout(5000);
    const idn = await p.evaluate(() => { const P = V51.idn235.people(); const miss = P.filter((x) => V51.idn235.missing(x.kind, x.o).length); const byKind = {}; miss.forEach((x) => { byKind[x.kind] = (byKind[x.kind] || 0) + 1; });
      const top = {}; miss.forEach((x) => V51.idn235.missing(x.kind, x.o).forEach((f) => { top[f[0]] = (top[f[0]] || 0) + 1; }));
      return { total: P.length, missing: miss.length, byKind, noEmail: miss.filter((x) => !x.o.email).length, top, page: !!document.querySelector('#app table') }; });
    await p.evaluate(() => { location.hash = '#/register'; }); await p.waitForTimeout(4000);
    const rg = await p.evaluate(() => { const f = document.querySelector('#app form[onsubmit="return reg(this)"]'); if (!f) return 'noform'; return ['country', 'countryEn', 'mother', 'motherEn', 'address', 'addressEn', 'pobEn', 'q64_issuerEn', 'q64_major', 'q64_majorEn', 'q64_countryEn'].filter((k) => !f.elements[k]).join(',') || 'all'; });
    await p.evaluate(() => { location.hash = '#/plt'; }); await p.waitForTimeout(4000);
    const pl = await p.evaluate(() => { const f = document.querySelector('#app form[onsubmit*="plt210reg"]'); return f ? { q64: !!f.querySelector('fieldset.q64'), req: ['dob', 'nat', 'idno', 'idType', 'tongue', 'country'].filter((k) => f.elements[k] && f.elements[k].required).length } : 'noform'; });
    console.log('CHECK idn', idn.page && rg === 'all' && pl.q64 === false && pl.req === 6 ? 'OK' : 'FAIL', JSON.stringify({ idn, rg, pl }));
    // v249: بصمة الواجهات العامة (مفاتيح window وV وH وV51) لمقارنة ما قبل التقسيم وما بعده
    const keys = await p.evaluate(async () => { const k = (o) => Object.keys(o || {}).sort(); const all = { win: k(window).filter((x) => !/^(__|webkit|on)/.test(x)), V: k(window.V), H: k(window.V51 && V51.h), V51: k(window.V51) };
      const s = JSON.stringify(all); const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return { n: { win: all.win.length, V: all.V.length, H: all.H.length, V51: all.V51.length }, sha: [...new Uint8Array(d)].slice(0, 8).map((x) => x.toString(16).padStart(2, '0')).join(''), V: all.V.join(','), H: all.H.length > 0 ? all.H.join(',').slice(0, 4000) : '' }; });
    console.log('CHECK keys OK', JSON.stringify({ n: keys.n, sha: keys.sha }));
    console.log('KEYS-V', keys.V); console.log('KEYS-H', keys.H);
    // v246: صفحة التحقق العامة: النموذج ومكان النتيجة
    await p.evaluate(() => { location.hash = '#/verify'; }); await p.waitForTimeout(4000);
    const vf = await p.evaluate(() => { const a = document.querySelector('#app'); const f = a && a.querySelector('form'); return { out: !!document.getElementById('out'), outs: document.querySelectorAll('#out').length, form: f ? f.getAttribute('onsubmit') : null, html: a ? a.innerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 900) : '' }; });
    console.log('CHECK verify', vf.out ? 'OK' : 'FAIL', JSON.stringify(vf));
    // v241: بطاقة «يومي» للطالب وعضو هيئة التدريس (تُرسم من بيانات حقيقية في الذاكرة دون دخول بحساب أحد)
    const td = await p.evaluate(() => { try { const s = (S.students || [])[0], f = (S.faculty || [])[0]; const a = s ? V51.td241(s, 'student') : '', b = f ? V51.td241(f, 'faculty') : '';
      return { s: /td241/.test(a) && a.indexOf('undefined') < 0 && a.indexOf('NaN') < 0, f: /td241/.test(b) && b.indexOf('undefined') < 0 && b.indexOf('NaN') < 0, len: a.length, ev: (a.match(/<li>/g) || []).length }; } catch (e) { return { err: String(e) }; } });
    console.log('CHECK today', td.s && td.f ? 'OK' : 'FAIL', JSON.stringify(td));
    try { await p.evaluate(() => { location.hash = '#/admin'; }); await p.waitForTimeout(5000);
      const ad = await p.evaluate(() => { const a = document.getElementById('app'); const s = a && a.querySelector('.adm255'); const bx = [...document.querySelectorAll('#app .ft231adm,#app .idn235adm')]; return { sec: !!s, inSec: bx.filter((b) => s && s.contains(b)).length, boxes: bx.length, last: !!(s && a.lastElementChild === s) }; });
      console.log('CHECK adm255', ad.sec && ad.inSec === ad.boxes ? 'OK' : 'FAIL', JSON.stringify(ad)); } catch (e) { console.log('CHECK adm255 FAIL', String(e).slice(0, 150)); }
    // v255: الوضع البنغالي — نصوص بقيت بالإنجليزية في الصفحات العامة (لا بيانات شخصية: صفحات عامة فقط)
    try {
      const bc = await b.newContext({ viewport: { width: 412, height: 880 }, serviceWorkers: 'block' });
      await bc.addInitScript(() => { try { localStorage.setItem('tl3', 'bn'); localStorage.setItem('tl', 'en'); } catch (e) {} });
      const bp = await bc.newPage(); const left = {}; let pages = 0;
      for (const r of ['#/', '#/programs', '#/admission', '#/verify', '#/register', '#/review', '#/plt', '#/training', '#/graduates', '#/ext-training', '#/news', '#/login/student']) {
        await bp.goto(SITE.replace(/app\.html.*$/, '') + 'app.html' + (liveV ? '?_b=' + liveV : '') + r, { waitUntil: 'load', timeout: 90000 }).catch(() => {}); await bp.waitForTimeout(6000);
        const t = await bp.evaluate(() => { const o = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const p = n.parentElement; if (!p || p.closest('script,style,[data-noi18n],.l3,code,svg') || !p.offsetParent) continue; const v = n.nodeValue.replace(/\s+/g, ' ').trim(); if (v.length > 2 && /[A-Za-z]{3,}/.test(v) && !/[\u0980-\u09FF]/.test(v) && !/@|https?:|^[A-Z0-9 .:\/()+\-–—#]+$/.test(v)) o.push(v.slice(0, 400)); } return o; });
        pages++; t.forEach((x) => { left[x] = (left[x] || 0) + 1; });
      }
      const k = Object.keys(left);
      console.log('CHECK bn', k.length <= 25 ? 'OK' : 'WARN', JSON.stringify({ pages, untranslated: k.length, sample: k.slice(0, 60) }));
      await bc.close();
    } catch (e) { console.log('CHECK bn', 'FAIL', String(e).slice(0, 200)); }

    await p.evaluate(() => { location.hash = '#/graduates'; }); await p.waitForTimeout(8000);
    console.log('CHECK graduates', /بوابة الخريجين/.test(t) && !/جارٍ التحميل/.test(t) ? 'OK' : 'FAIL', t);
    // v263: السجل المالي — يفتح للإدارة المركزية، والإجمالي التراكمي من التأكيدات فقط
    try { await p.evaluate(() => { location.hash = '#/fin'; }); await p.waitForFunction(() => /السجل المالي/.test((document.querySelector('#app') || {}).innerText || '') && document.querySelector('#app .fin263g'), null, { timeout: 45000 });
      const fz = await p.evaluate(() => { const a = document.querySelector('#app'); const k = [...a.querySelectorAll('.fin263k')].map((x) => x.innerText.replace(/\s+/g, ' ')); return { cards: k.length, cum: k[0] || '', rows: a.querySelectorAll('.fin263t tbody tr').length, adm: !!a }; });
      console.log('CHECK fin-admin', fz.cards >= 6 && /BDT/.test(fz.cum) ? 'OK' : 'FAIL', JSON.stringify(fz)); } catch (e) { console.log('CHECK fin-admin FAIL', String(e).slice(0, 200)); }
    try { await p.evaluate(() => { location.hash = '#/admin'; }); await p.waitForTimeout(6000); const fa = await p.evaluate(() => { const b = document.querySelector('#app .fin263adm'); return { box: !!b, inSec: !!(b && b.closest('.adm255')), t: b ? b.innerText.replace(/\s+/g, ' ').slice(0, 120) : '' }; }); console.log('CHECK fin-adm-box', fa.box && fa.inSec ? 'OK' : 'FAIL', JSON.stringify(fa)); } catch (e) { console.log('CHECK fin-adm-box FAIL', String(e).slice(0, 150)); }
  }
  // v247: فحص شامل بحسابين تجريبيين (يعملان فقط ما دام السجلان التجريبيان موجودين؛ يُحذفان بعد الفحص)
  try {
    const TST = [['202699901', 'student', '#/student'], ['12099901', 'faculty', '#/fp']];
    const has = await p.evaluate(() => !!(S.students || []).find((x) => String(x.id) === '202699901') && !!(S.faculty || []).find((x) => String(x.id) === '12099901'));
    if (has) for (const [ref, role, route] of TST) {
      const pw = await p.evaluate(async (ref) => { try { await V51.fn63({ action: 'ensure', items: [{ ref_id: ref }] }); const r = await V51.fn63({ action: 'reveal', ref_id: ref }); return (r && r.password) || ''; } catch (e) { return ''; } }, ref);
      if (!pw) { console.log('CHECK e2e-' + role, 'FAIL', 'no initial password'); continue; }
      const c2 = await b.newContext({ viewport: { width: 412, height: 860 }, serviceWorkers: 'block', locale: 'ar' }); const q = await c2.newPage(); const e2 = [];
      q.on('pageerror', (e) => e2.push(e.message)); q.on('console', (m) => { if (m.type() === 'error') e2.push('console: ' + m.text().slice(0, 250)); }); q.on('dialog', (d) => d.accept().catch(() => {}));
      await q.goto(SITE + '?e2e=1' + (liveV ? '&_b=' + liveV : '') + '#/login/' + role, { waitUntil: 'load', timeout: 90000 });
      await q.waitForFunction(() => typeof loginAny === 'function' && document.querySelector('#app input[name=u]'), null, { timeout: 90000 });
      await q.fill('#app input[name=u]', ref); await q.fill('#app input[name=p]', pw); await q.click('#app button.go').catch(async (e) => { console.log('E2E-DIAG', JSON.stringify(await q.evaluate(() => ({ hash: location.hash, btn: [...document.querySelectorAll('#app button')].map((x) => x.className + ':' + x.textContent.trim().slice(0, 20)).slice(0, 10), forms: document.querySelectorAll('#app form').length, html: ((document.querySelector('#app') || {}).innerHTML || '').slice(0, 600) }))), 'errs', e2.slice(0, 5).join(' | ')); throw e; });
      await q.waitForFunction(() => /^#\/(pwchange|student|fp|idn)/.test(location.hash), null, { timeout: 60000 }).catch(() => {});
      const np = 'Tst' + Math.random().toString(36).slice(2, 10) + '9a';
      for (let t = 0; t < 3 && /pwchange/.test(await q.evaluate(() => location.hash)); t++) { await q.waitForTimeout(4000); try { await q.fill('#app input[name=a]', np); await q.fill('#app input[name=b]', np); await q.click('#app form button.btn'); } catch (e) {} await q.waitForFunction(() => !/pwchange/.test(location.hash), null, { timeout: 25000 }).catch(() => {}); await q.waitForTimeout(3000); if (/pwchange/.test(await q.evaluate(() => location.hash))) console.log('E2E-PW try ' + t, JSON.stringify(await q.evaluate(() => ({ out: ((document.getElementById('out') || {}).innerText || '').slice(0, 200) })))); }
      await q.waitForTimeout(4000);
      const at = await q.evaluate(() => location.hash);
      if (/#\/idn/.test(at)) { await q.evaluate((r) => { location.hash = r; }, route); await q.waitForTimeout(5000); }
      const st = await q.evaluate(() => { const a = document.querySelector('#app'); const t = (a && a.innerText) || ''; return { hash: location.hash, me: typeof me !== 'undefined' && me ? me.r : null, today: !!document.querySelector('.td241'), bell: !!document.getElementById('nb248'), bellItems: (window.V51 && V51.nb248 ? V51.nb248().length : -1),
        h: [...document.querySelectorAll('#app h2,#app h3')].map((x) => x.textContent.trim()).filter(Boolean).slice(0, 14), len: t.length, bad: /undefined|NaN|\[object Object\]/.test(t), err: [...document.querySelectorAll('#app .msg.er')].map((x) => x.textContent.trim().slice(0, 80)).slice(0, 3) }; });
      // الانتقال بين أقسام البوابة: كل رابط داخلي في القائمة يُفتح ويُفحص
      // v253: بوابة الخريجين من حساب الطالب/العضو: يجب ألا تبقى على «جارٍ التحميل»
      try { await q.evaluate(() => { location.hash = '#/graduates'; }); await q.waitForTimeout(20000);
        const gr = await q.evaluate(() => { const a = document.querySelector('#app'); const t = ((a && a.innerText) || '').replace(/\s+/g, ' ').trim(); return { loading: /جارٍ التحميل|Loading/.test(t.slice(0, 200)) && t.length < 400, len: t.length, h: [...document.querySelectorAll('#app h2,#app h3')].map((x) => x.textContent.trim()).slice(0, 4), ft: typeof FT !== 'undefined' ? { ld: !!FT.ld, err: FT.err || '', busy: !!FT.busy } : 'no-FT' }; });
        console.log('CHECK e2e-graduates-' + role, gr.loading ? 'FAIL' : 'OK', JSON.stringify(gr), 'errs', e2.slice(0, 6).join(' | ').slice(0, 600));
        // فتح مباشر للرابط بعد إعادة تحميل الصفحة (كما يفعل المستخدم من الجوال)
        await q.goto(SITE.replace(/app\.html.*$/, '') + '?gd=1' + (liveV ? '&_b=' + liveV : '') + '#/graduates', { waitUntil: 'load', timeout: 90000 }); await q.waitForTimeout(25000);
        const gd = await q.evaluate(() => { const a = document.querySelector('#app'); const t = ((a && a.innerText) || '').replace(/\s+/g, ' ').trim(); return { url: location.pathname + location.hash, loading: /جارٍ التحميل|Loading/.test(t.slice(0, 200)) && t.length < 400, len: t.length, h: [...document.querySelectorAll('#app h2,#app h3')].map((x) => x.textContent.trim()).slice(0, 3), me: typeof me !== 'undefined' && me ? me.r : null }; });
        console.log('CHECK e2e-graduates-direct-' + role, gd.loading || !gd.len ? 'FAIL' : 'OK', JSON.stringify(gd), 'errs', e2.slice(0, 8).join(' | ').slice(0, 900));
        // v260: تبويب جديد / إعادة فتح التطبيق: الجلسة تبقى، وزر الخروج ظاهر على الجوال، والبوابة تُفتح
        try { const q2 = await c2.newPage(); await q2.goto(SITE.replace(/app\.html.*$/, '') + '?nt=1' + (liveV ? '&_b=' + liveV : '') + '#/graduates', { waitUntil: 'load', timeout: 90000 }); await q2.waitForTimeout(20000);
          const nt = await q2.evaluate(() => { const a = document.querySelector('#app'); const t = ((a && a.innerText) || '').replace(/\s+/g, ' ').trim(); const o = document.querySelector('.h69-out'); return { me: typeof me !== 'undefined' && me ? me.r : null, loading: /جارٍ التحميل|Loading/.test(t.slice(0, 200)) && t.length < 400, portal: /بوابة الخريجين/.test(t) && !/كلمة المرور/.test(t.slice(0, 300)), out: !!(o && o.offsetWidth > 0) }; });
          console.log('CHECK e2e-newtab-' + role, nt.me === role && !nt.loading && nt.portal && nt.out ? 'OK' : 'FAIL', JSON.stringify(nt));
          await q2.close();
        } catch (e) { console.log('CHECK e2e-newtab-' + role, 'FAIL', String(e).slice(0, 200)); }
        await q.evaluate((r) => { location.hash = r; }, route); await q.waitForTimeout(3000);
      } catch (e) { console.log('CHECK e2e-graduates-' + role, 'FAIL', String(e).slice(0, 200)); }
      const links = await q.evaluate(() => [...new Set([...document.querySelectorAll('#app a[href^="#/"], nav a[href^="#/"]')].map((a) => a.getAttribute('href')).filter((h) => /^#\/(student|fp|idn|studyplan|exams|calendar|me)/.test(h)))].slice(0, 12));
      const pages = {};
      for (const L of links) { await q.evaluate((h) => { location.hash = h; }, L); await q.waitForTimeout(2500); pages[L] = await q.evaluate(() => { const t = (document.querySelector('#app') || {}).innerText || ''; return t.length + (/undefined|NaN|\[object Object\]/.test(t) ? ' BAD' : ''); }); }
      console.log('CHECK e2e-' + role, st.me === role && st.len > 200 && !st.bad && !e2.length ? 'OK' : 'FAIL', JSON.stringify({ first: at, st, pages, errs: e2.slice(0, 5) }));
      // v263: دورة الرسوم كاملة للطالب التجريبي: إصدار ← يدخل الطالب بيانات الدفع ← رفض ← إعادة ← تأكيد ← الحالة عند الطالب
      if (role === 'student' && process.env.GITHUB_EVENT_NAME === 'workflow_dispatch') { try {
        const term = await p.evaluate(() => { try { return V51.curTerm61().id; } catch (e) { return ''; } });
        const g1 = await p.evaluate(async (a) => { const r = await sb.rpc('fin_admin', { act: 'sem', p_id: null, p: { items: [{ ref: a.ref, name: 'TEST', term: a.term, base: 6000, pct: 25, cur: 'BDT' }] } }); return r.data || r.error; }, { ref, term });
        const fid = await p.evaluate(async (a) => { const r = await sb.from('fin263').select('id,due,status').eq('ref', a.ref).eq('term', a.term).maybeSingle(); return r.data; }, { ref, term });
        if (fid && fid.status !== 'due') { await p.evaluate(async (id) => { await sb.rpc('fin_admin', { act: 'reject', p_id: id, p: { note: 'test reset' } }); await sb.rpc('fin_admin', { act: 'void', p_id: id, p: { note: 'test reset' } }); await sb.rpc('fin_admin', { act: 'restore', p_id: id, p: {} }); }, fid.id); }
        await q.evaluate(() => { location.hash = '#/fin'; }); await q.waitForSelector('#app .fin263s form', { timeout: 30000 });
        const sv = await q.evaluate(() => (document.querySelector('#app .fin263s') || {}).innerText.replace(/\s+/g, ' ').slice(0, 200));
        const trx = 'T' + Date.now().toString(36).toUpperCase();
        await q.fill('#app .fin263s input[name=trx]', trx); await q.fill('#app .fin263s input[name=from]', '01700000000'); await q.click('#app .fin263s form button');
        await q.waitForFunction(() => /بانتظار التأكيد/.test((document.querySelector('#app .fin263s') || {}).innerText || ''), null, { timeout: 30000 });
        const rj = await p.evaluate(async (id) => (await sb.rpc('fin_admin', { act: 'reject', p_id: id, p: { note: 'test' } })).data, fid.id);
        const cl2 = await q.evaluate(async (a) => (await sb.rpc('fin_claim', { p_id: a.id, trx: a.trx + 'B', sender: '01700000000' })).data, { id: fid.id, trx });
        const cf = await p.evaluate(async (id) => (await sb.rpc('fin_admin', { act: 'confirm', p_id: id, p: {} })).data, fid.id);
        await q.evaluate(() => { F263S.ld = 0; location.hash = '#/student'; }); await q.waitForTimeout(2500); await q.evaluate(() => { location.hash = '#/fin'; }); await q.waitForTimeout(5000);
        const sv2 = await q.evaluate(() => (document.querySelector('#app .fin263s') || {}).innerText.replace(/\s+/g, ' ').slice(0, 200));
        // تنظيف: المبلغ التجريبي لا يبقى في الحسابات (إبطال ثم إلغاء)
        const cl = await p.evaluate(async (id) => { const a = (await sb.rpc('fin_admin', { act: 'void', p_id: id, p: { note: 'robot test cleanup' } })).data; const b = (await sb.rpc('fin_admin', { act: 'cancel', p_id: id, p: { note: 'robot test cleanup' } })).data; return [a, b]; }, fid.id);
        const ok = fid && +fid.due === 4500 && /4,500/.test(sv) && rj && rj.ok && cl2 && cl2.ok && cf && cf.ok && /مؤكَّدة/.test(sv2) && cl[0] && cl[0].ok && cl[1] && cl[1].ok;
        console.log('CHECK fin-cycle', ok ? 'OK' : 'FAIL', JSON.stringify({ g1, fid, sv: sv.slice(0, 120), rj, cl2, cf, sv2: sv2.slice(0, 120), cl }));
      } catch (e) { console.log('CHECK fin-cycle FAIL', String(e).slice(0, 300)); } }
      // v261: الدخول من نموذج بوابة الخريجين نفسه (كما يفعل المستخدم)، بمتصفح جوال في وضع «سطح المكتب»، مع ضغطتين متتاليتين
      try { const c4 = await b.newContext({ viewport: { width: 412, height: 915 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', serviceWorkers: 'allow', locale: 'ar' }); const q4 = await c4.newPage(); const e4 = [];
        q4.on('pageerror', (e) => e4.push(e.message)); q4.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') e4.push(m.type() + ': ' + m.text().slice(0, 200)); });
        await q4.goto(SITE.replace(/app\.html.*$/, '') + (liveV ? '?_b=' + liveV : '') + '#/graduates', { waitUntil: 'load', timeout: 90000 });
        await q4.waitForFunction(() => document.querySelector('#app input[name=p]'), null, { timeout: 60000 });
        if (role === 'faculty') { await q4.click('#app .lg238r button[data-r=faculty]').catch(() => {}); await q4.waitForTimeout(500); }
        await q4.fill('#app input[name=u]', ref); await q4.fill('#app input[name=p]', np);
        await q4.evaluate(() => { const f = document.querySelector('#app input[name=p]').form; f.requestSubmit(); setTimeout(() => { try { f.requestSubmit(); } catch (e) {} }, 300); });
        const snap = async () => q4.evaluate(() => { const a = document.querySelector('#app'); const t = ((a && a.innerText) || '').replace(/\s+/g, ' ').trim(); const F = (window.V51 && V51.FT225) || {}; return { t: t.slice(0, 90), apps: document.querySelectorAll('#app').length, hash: location.hash, me: typeof me !== 'undefined' && me ? me.r : null, ld: !!F.ld, busy: !!F.busy, err: F.err || '', wd: !!F.wd, wdn: F.wdn || 0, B: window.__BUILD__ }; });
        const tl = []; for (const w of [3, 6, 10, 20, 35]) { await q4.waitForTimeout(w === 3 ? 3000 : (w - [3, 6, 10, 20, 35][[3, 6, 10, 20, 35].indexOf(w) - 1]) * 1000); tl.push(w + ':' + JSON.stringify(await snap())); }
        const last = await snap(); console.log('FTTRACE-' + role, JSON.stringify(await q4.evaluate(() => window.__ft261 || [])).slice(0, 3000)); console.log('CHECK e2e-gradlogin-' + role, /جارٍ التحميل/.test(last.t) || !/بوابة الخريجين/.test(last.t) || last.me !== role ? 'FAIL' : 'OK', tl.join(' || '), 'errs', e4.slice(0, 10).join(' | ').slice(0, 1500));
        await c4.close(); } catch (e) { console.log('CHECK e2e-gradlogin-' + role, 'FAIL', String(e).slice(0, 300)); }
      try { await q.evaluate(() => { localStorage.setItem('act260', String(Date.now() - 31 * 60000)); });
        const q3 = await c2.newPage(); await q3.goto(SITE.replace(/app\.html.*$/, '') + '?nt=2' + (liveV ? '&_b=' + liveV : '') + '#/student', { waitUntil: 'load', timeout: 90000 }); await q3.waitForTimeout(12000);
        const id3 = await q3.evaluate(() => ({ me: typeof me !== 'undefined' && me ? me.r : null })); console.log('CHECK e2e-idle-' + role, id3.me ? 'FAIL' : 'OK', JSON.stringify(id3)); } catch (e) { console.log('CHECK e2e-idle-' + role, 'FAIL', String(e).slice(0, 150)); }
      await c2.close();
      const rm = await p.evaluate(async (ref) => { try { const r = await V51.fn63({ action: 'remove', ref_id: ref }); return r && (r.ok || r.removed || r.items) ? 'removed' : JSON.stringify(r).slice(0, 120); } catch (e) { return String(e).slice(0, 120); } }, ref);
      console.log('CHECK e2e-cleanup-' + role, /removed/.test(rm) ? 'OK' : 'FAIL', rm);
    }
  } catch (e) { console.log('CHECK e2e', 'FAIL', String(e).slice(0, 300)); }
  await p.evaluate(() => { try { save(); } catch (e) {} });
  await p.waitForTimeout(8000);
  await p.evaluate(() => { try { sbOut(); } catch (e) {} });
  if (errs.length) console.log('page errors:', errs.slice(0, 5).join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });

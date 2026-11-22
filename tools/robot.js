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
  p.on('dialog', (d) => d.accept().catch(() => {}));
  await p.goto(SITE + '?robot=1', { waitUntil: 'load', timeout: 90000 });
  await p.waitForFunction(() => typeof sbAdminLogin === 'function' && window.V51 && V51.robot134, null, { timeout: 90000 });
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
    await p.evaluate(() => { location.hash = '#/graduates'; }); await p.waitForTimeout(8000);
    console.log('CHECK graduates', /بوابة الخريجين/.test(t) && !/جارٍ التحميل/.test(t) ? 'OK' : 'FAIL', t);
  }
  await p.evaluate(() => { try { save(); } catch (e) {} });
  await p.waitForTimeout(8000);
  await p.evaluate(() => { try { sbOut(); } catch (e) {} });
  if (errs.length) console.log('page errors:', errs.slice(0, 5).join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });

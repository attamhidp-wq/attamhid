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
    const fr = await p.evaluate(async () => { const codes = [...document.querySelectorAll('#app table tr td:first-child b')].map((b) => b.textContent.trim()).filter((c) => /^[تم]-\d+$/.test(c)); const bad = [], pages = {};
      for (const c of codes) { try { await V51.h.ft231pv(c); } catch (e) { bad.push(c + ':' + e.message); continue; } await new Promise((r) => setTimeout(r, 400)); const d = document.querySelector('.g9-doc[data-nf]'); if (!d || d.innerText.length < 200) bad.push(c + ':empty'); else pages[c] = d.querySelectorAll('.g9p').length; try { closeM && closeM(); } catch (e) {} }
      const real = {}; try { const N = window.__nf232, r = N.rec('TR-261122-68259'); if (r) for (const c of N.NFO.filter((c) => N.NF[c].k === r.kind)) { try { const h = await N.build(c, r, 'TEST', new Date().toISOString()); real[c] = (h.match(/class="g9p/g) || []).length + 'p' + (N.NF[c].when(r) ? '' : '(not-yet)'); } catch (e) { real[c] = 'ERR ' + e.message; } } else real.none = 1; } catch (e) { real.err = e.message; }
      return { n: codes.length, bad, pages, real }; });
    console.log('CHECK forms-review', fr.n === 9 && !fr.bad.length ? 'OK' : 'FAIL', JSON.stringify(fr));
    await p.evaluate(() => { location.hash = '#/graduates'; }); await p.waitForTimeout(8000);
    console.log('CHECK graduates', /بوابة الخريجين/.test(t) && !/جارٍ التحميل/.test(t) ? 'OK' : 'FAIL', t);
  }
  await p.evaluate(() => { try { save(); } catch (e) {} });
  await p.waitForTimeout(8000);
  await p.evaluate(() => { try { sbOut(); } catch (e) {} });
  if (errs.length) console.log('page errors:', errs.slice(0, 5).join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });

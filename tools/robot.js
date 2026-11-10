// v135 — المنفّذ الآلي: يعمل على GitHub Actions كل 5 دقائق.
// يحصل على جلسة إدارية مؤقتة بإثبات هوية GitHub (OIDC)، ثم يفتح الموقع نفسه ويشغّل V51.robot134():
// ترقية قوائم الانتظار، إصدار الشهادات عند انتهاء البرامج، وإرسالها بالبريد مرفقةً PDF مع شهادة الشكر للمدرب.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const SB = 'https://ttuelhswxyjbjdnydmns.supabase.co', SITE = process.env.SITE || 'https://attamhid.com/';
(async () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
  const key = (src.match(/SB_KEY='([^']+)'/) || [])[1];
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
  await p.evaluate(() => { try { save(); } catch (e) {} });
  await p.waitForTimeout(8000);
  await p.evaluate(() => { try { sbOut(); } catch (e) {} });
  if (errs.length) console.log('page errors:', errs.slice(0, 5).join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });

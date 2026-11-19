// v228 — فحص الجودة على الموقع الحي (بلا حسابات ولا بيانات شخصية): الصفحات العامة بثلاث لغات على الحاسوب والجوال،
// وأخطاء المتصفح، والأسماء القديمة، والتمدد الأفقي، وزمن التحميل، واختبار حمل خفيف، وترويسات الأمان.
const { chromium } = require('playwright');
const SITE = process.env.SITE || 'https://attamhid.com';
const OLD = ['بوابة المشاركين', 'بوابة الطالب', 'بوابة الطلاب', 'بوابة عضو هيئة التدريس', 'بوابة هيئة التدريس', 'بوابة التدريب الميداني', 'Participant portal', 'Student portal', 'Faculty portal', 'Field Training Portal', 'انتظام كامل', 'Full-time'];
const HASH = ['', '#/programs', '#/news', '#/verify', '#/register', '#/student', '#/fp', '#/training', '#/graduates', '#/student-services', '#/faculty-services', '#/no-such-page-404'];
const STATIC = ['/programs/', '/programs/diploma.html', '/news/', '/student-services/', '/faculty-services/', '/training/', '/graduates/', '/en/student-services/', '/en/graduates/', '/bn/training/', '/sitemap.xml', '/robots.txt', '/no-such-file-404.html'];
(async () => {
  const b = await chromium.launch(); const R = { pages: [], static: [], load: {}, headers: {} };
  for (const lang of ['ar', 'en', 'bn']) for (const vp of [[1366, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: vp[0], height: vp[1] }, serviceWorkers: 'block' });
    await ctx.addInitScript((l) => { try { localStorage.setItem('tl', l) } catch (e) {} }, lang);
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push('E:' + e.message.slice(0, 160)));
    p.on('console', (m) => { if (m.type() === 'error' && !/favicon|ERR_BLOCKED|net::/.test(m.text())) errs.push('C:' + m.text().slice(0, 160)) });
    const t0 = Date.now(); await p.goto(SITE + '/', { waitUntil: 'load', timeout: 90000 }); await p.waitForTimeout(4000); const first = Date.now() - t0;
    for (const h of HASH) {
      const n0 = errs.length; await p.evaluate((x) => { location.hash = x }, h); await p.waitForTimeout(1800);
      const o = await p.evaluate((OLD) => { const t = document.body.innerText; return { h: location.hash, len: t.length, old: OLD.filter((k) => t.includes(k)), ovf: document.documentElement.scrollWidth - innerWidth, title: document.title.slice(0, 60), dir: document.documentElement.dir } }, OLD);
      R.pages.push(Object.assign({ lang, w: vp[0], go: h || '/', errs: errs.slice(n0) }, o));
    }
    R.pages.push({ lang, w: vp[0], go: 'first-load-ms', ms: first });
    await ctx.close();
  }
  for (const u of STATIC) { const t0 = Date.now(); const r = await fetch(SITE + u); R.static.push([u, r.status, Date.now() - t0, (await r.text()).length]); }
  // اختبار حمل خفيف: 300 طلب بتوازي 30 للصفحة الرئيسية، و300 لصفحة الدبلوم
  for (const u of ['/', '/programs/diploma.html']) {
    const T = []; let fail = 0; const one = async () => { const t0 = Date.now(); try { const r = await fetch(SITE + u + '?qa=' + Math.random(), { cache: 'no-store' }); await r.arrayBuffer(); if (!r.ok) fail++ } catch (e) { fail++ } T.push(Date.now() - t0) };
    const t0 = Date.now(); for (let i = 0; i < 10; i++) await Promise.all(Array.from({ length: 30 }, one));
    T.sort((a, b) => a - b); R.load[u] = { n: T.length, fail, p50: T[T.length >> 1], p95: T[Math.floor(T.length * .95)], max: T[T.length - 1], totalMs: Date.now() - t0 };
  }
  const hr = await fetch(SITE + '/'); for (const k of ['strict-transport-security', 'content-security-policy', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy', 'server', 'cache-control']) R.headers[k] = hr.headers.get(k);
  await b.close();
  const bad = R.pages.filter((x) => (x.errs && x.errs.length) || (x.old && x.old.length) || x.ovf > 2);
  console.log('QA_SUMMARY ' + JSON.stringify({ pages: R.pages.length, bad: bad.length, static: R.static, load: R.load, headers: R.headers }));
  console.log('QA_BAD ' + JSON.stringify(bad));
  console.log('QA_FIRST ' + JSON.stringify(R.pages.filter((x) => x.go === 'first-load-ms')));
})().catch((e) => { console.error(e); process.exit(1) });

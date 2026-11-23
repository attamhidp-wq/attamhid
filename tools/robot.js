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
    await p.evaluate(() => { location.hash = '#/graduates'; }); await p.waitForTimeout(8000);
    console.log('CHECK graduates', /بوابة الخريجين/.test(t) && !/جارٍ التحميل/.test(t) ? 'OK' : 'FAIL', t);
  }
  // v247: فحص شامل بحسابين تجريبيين (يعملان فقط ما دام السجلان التجريبيان موجودين؛ يُحذفان بعد الفحص)
  try {
    const TST = [['202699901', 'student', '#/student'], ['12099901', 'faculty', '#/fp']];
    const has = await p.evaluate(() => !!(S.students || []).find((x) => String(x.id) === '202699901') && !!(S.faculty || []).find((x) => String(x.id) === '12099901'));
    if (has) for (const [ref, role, route] of TST) {
      const pw = await p.evaluate(async (ref) => { try { await V51.fn63({ action: 'ensure', items: [{ ref_id: ref }] }); const r = await V51.fn63({ action: 'reveal', ref_id: ref }); return (r && r.password) || ''; } catch (e) { return ''; } }, ref);
      if (!pw) { console.log('CHECK e2e-' + role, 'FAIL', 'no initial password'); continue; }
      const c2 = await b.newContext({ viewport: { width: 412, height: 860 }, serviceWorkers: 'block', locale: 'ar' }); const q = await c2.newPage(); const e2 = [];
      q.on('pageerror', (e) => e2.push(e.message)); q.on('dialog', (d) => d.accept().catch(() => {}));
      await q.goto(SITE + '?e2e=1' + (liveV ? '&_b=' + liveV : '') + '#/login/' + role, { waitUntil: 'load', timeout: 90000 });
      await q.waitForFunction(() => typeof loginAny === 'function' && document.querySelector('#app input[name=u]'), null, { timeout: 90000 });
      await q.fill('#app input[name=u]', ref); await q.fill('#app input[name=p]', pw); await q.click('#app button.go').catch(async (e) => { console.log('E2E-DIAG', JSON.stringify(await q.evaluate(() => ({ hash: location.hash, btn: [...document.querySelectorAll('#app button')].map((x) => x.className + ':' + x.textContent.trim().slice(0, 20)).slice(0, 10), forms: document.querySelectorAll('#app form').length, html: ((document.querySelector('#app') || {}).innerHTML || '').slice(0, 600) }))), 'errs', e2.slice(0, 5).join(' | ')); throw e; });
      await q.waitForFunction(() => /^#\/(pwchange|student|fp|idn)/.test(location.hash), null, { timeout: 60000 }).catch(() => {});
      const np = 'Tst' + Math.random().toString(36).slice(2, 10) + '9a';
      if (/pwchange/.test(await q.evaluate(() => location.hash))) { await q.fill('#app input[name=a]', np); await q.fill('#app input[name=b]', np); await q.click('#app form button.btn'); await q.waitForTimeout(6000); }
      await q.waitForTimeout(4000);
      const at = await q.evaluate(() => location.hash);
      if (/#\/idn/.test(at)) { await q.evaluate((r) => { location.hash = r; }, route); await q.waitForTimeout(5000); }
      const st = await q.evaluate(() => { const a = document.querySelector('#app'); const t = (a && a.innerText) || ''; return { hash: location.hash, me: typeof me !== 'undefined' && me ? me.r : null, today: !!document.querySelector('.td241'), bell: !!document.getElementById('nb248'), bellItems: (window.V51 && V51.nb248 ? V51.nb248().length : -1),
        h: [...document.querySelectorAll('#app h2,#app h3')].map((x) => x.textContent.trim()).filter(Boolean).slice(0, 14), len: t.length, bad: /undefined|NaN|\[object Object\]/.test(t), err: [...document.querySelectorAll('#app .msg.er')].map((x) => x.textContent.trim().slice(0, 80)).slice(0, 3) }; });
      // الانتقال بين أقسام البوابة: كل رابط داخلي في القائمة يُفتح ويُفحص
      const links = await q.evaluate(() => [...new Set([...document.querySelectorAll('#app a[href^="#/"], nav a[href^="#/"]')].map((a) => a.getAttribute('href')).filter((h) => /^#\/(student|fp|idn|studyplan|exams|calendar|me)/.test(h)))].slice(0, 12));
      const pages = {};
      for (const L of links) { await q.evaluate((h) => { location.hash = h; }, L); await q.waitForTimeout(2500); pages[L] = await q.evaluate(() => { const t = (document.querySelector('#app') || {}).innerText || ''; return t.length + (/undefined|NaN|\[object Object\]/.test(t) ? ' BAD' : ''); }); }
      console.log('CHECK e2e-' + role, st.me === role && st.len > 200 && !st.bad && !e2.length ? 'OK' : 'FAIL', JSON.stringify({ first: at, st, pages, errs: e2.slice(0, 5) }));
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

// v252 — مقارنة التحقق السريع (الصفحة الخفيفة) بالتطبيق الكامل لروابط رمز QR، دون طباعة أي بيانات شخصية أو أرقام وثائق:
// يجد السكربت أرقاماً حقيقية بنفسه عبر دالة التحقق العامة، ويطبع لكل وثيقة نوعها ونتيجة المطابقة والزمن فقط.
const { chromium } = require('playwright');
const LIGHT = process.env.LIGHT || 'https://attamhid.com/';
const FULL = 'https://attamhid.com/';
const SB = 'https://ttuelhswxyjbjdnydmns.supabase.co/rest/v1/rpc/verify_cert';
const norm = (t) => String(t || '').replace(/[‎‏⁦-⁩]/g, '').replace(/\s+/g, ' ').trim();
(async () => {
  const html = await fetch(LIGHT.replace(/\?.*$/, '') + '?t=' + Date.now()).then((x) => x.text());
  const key = (html.match(/apikey: ?'([^']+)'/) || [])[1];
  if (!key) throw new Error('no public key in light page');
  const pre = ['10', '12', '13', '14', '15', '16', '19'], seen = {}, picks = [];
  for (const p of pre) for (let i = 1; i <= (p === '15' || p === '19' ? 90 : 12) && picks.length < 60; i++) {
    const q = p + '2026' + String(i).padStart(5, '0');
    const r = await fetch(SB, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + key }, body: JSON.stringify({ q }) }).then((x) => x.json()).catch(() => []);
    const t = Array.isArray(r) && r[0] && r[0].type; if (!t) continue;
    seen[t] = (seen[t] || 0) + 1; if (seen[t] <= 2) picks.push([q, t]);
  }
  picks.push(['00000000000', 'none']);
  const b = await chromium.launch();
  const grab = async (url, light) => {
    const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, serviceWorkers: 'block', locale: 'ar' });
    const p = await ctx.newPage(); const t0 = Date.now(); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
    let txt = '', ms = 0, mode = '';
    try {
      await p.waitForFunction(() => document.querySelector('#o252 .msg, #out .msg') || (document.querySelector('#out') && document.querySelector('#out').innerText.trim().length > 8), null, { timeout: 45000 });
      ms = Date.now() - t0;
      await p.waitForTimeout(1500);
      const r = await p.evaluate(() => { const L = document.querySelectorAll('#o252 .msg'); const F = document.querySelectorAll('#out .msg'); const n = L.length ? L : F; return { mode: L.length ? 'light' : 'full', t: [...n].map((x) => x.innerText).join('\n') || (document.querySelector('#out') || {}).innerText || '' }; });
      txt = norm(r.t); mode = r.mode;
    } catch (e) { mode = await p.evaluate(() => (document.querySelector('[data-v252]') ? 'light-pending' : 'other')).catch(() => 'err'); }
    await ctx.close();
    return { txt, ms, mode, errs: errs.length };
  };
  for (const [q, t] of picks) {
    const F = await grab(FULL + '?v=' + q), L = await grab(LIGHT + '?v=' + q, 1);
    const same = F.txt && F.txt === L.txt;
    console.log('LCHK', t, L.mode, same ? 'SAME' : (L.mode === 'light' ? 'DIFF' : 'FALLBACK'), 'full:' + F.ms + 'ms', 'light:' + L.ms + 'ms', 'len:' + F.txt.length + '/' + L.txt.length, 'errs:' + F.errs + '/' + L.errs);
    if (!same && L.mode === 'light') { const a = F.txt, c = L.txt; let i = 0; while (i < a.length && a[i] === c[i]) i++; console.log('  first-diff-at', i, 'labels-full:', (a.match(/[^\s:]{2,20}(?=:)/g) || []).join('|'), 'labels-light:', (c.match(/[^\s:]{2,20}(?=:)/g) || []).join('|')); }
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });

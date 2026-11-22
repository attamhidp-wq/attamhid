// v231 — يولّد index.html الخفيفة من التطبيق الكامل app.html (يعمل على GitHub Actions، يحتاج playwright)
// 1) يفتح التطبيق كزائر عام (بلا جلسة ولا تفضيلات) ويصيّر الصفحة الرئيسية من بيانات الموقع العامة الحية.
// 2) يأخذ الترويسة والمحتوى والتذييل كما صُيِّرت، ويحذف كل الشيفرة.
// 3) يُبقي من الأنماط ما تطابقه عناصر الصفحة فقط (فاتحاً وداكناً)، مضمَّناً في الصفحة.
// 4) يضيف المحمِّل tools/shell-loader.js الذي يستدعي التطبيق الكامل عند الحاجة فقط.
// ثم يختبر الصفحة الناتجة؛ وإن فشل أي فحص لا يُكتب شيء ويبقى index.html السابق.
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('playwright');
const R = path.join(__dirname, '..');
// انتظار يتحمّل استبدال المستند (document.open) أثناء الانتظار
async function until(page, fn, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await page.evaluate(fn)) return true; } catch (e) { } await page.waitForTimeout(500); } return false; }
const PORT = 8731, BASE = 'http://127.0.0.1:' + PORT;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
function serve(rootFile) {
  return http.createServer((q, s) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    if (p === '/' || p === '/index.html') p = '/' + rootFile;
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(R, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
    if (!f.startsWith(R) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end('nf'); }
    s.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(f).pipe(s);
  }).listen(PORT, '127.0.0.1');
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

async function capture(browser, scheme) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: 'ar', colorScheme: scheme, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + '/', { waitUntil: 'load', timeout: 120000 });
  await p.waitForFunction(() => typeof go === 'function' && document.querySelector('#app') && document.querySelector('#app').innerText.trim().length > 200 && document.querySelector('#ft') && document.querySelector('#ft').innerText.trim().length > 20, null, { timeout: 120000 });
  await p.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(6000);
  const out = await p.evaluate(() => {
    const DYN = /:(?:hover|focus-visible|focus-within|focus|active|visited|target|checked|disabled|enabled|placeholder-shown|invalid|valid|indeterminate|read-only|read-write|required|optional|empty|default|autofill|-webkit-autofill|user-invalid|open|modal)\b(?:\([^)]*\))?/g;
    const PE = /::?(?:before|after|placeholder|selection|marker|first-letter|first-line|backdrop|file-selector-button|-webkit-[a-z-]+|-moz-[a-z-]+)(?:\([^)]*\))?/g;
    const used = (sel) => sel.split(',').some((s) => {
      let t = s.replace(PE, '').replace(DYN, '').replace(/:(?:not|is|where|has)\(\s*\)/g, '').trim().replace(/[>+~]\s*$/, '').trim();
      if (!t) return true;
      try { return !!document.querySelector(t); } catch (e) { return true; }
    });
    const fix = (txt, base) => txt.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
      if (/^(data:|https?:|#)/.test(u)) return m;
      try { return 'url("' + new URL(u, base).pathname + '")'; } catch (e) { return m; }
    });
    const walk = (rules, base, sep) => {
      let o = '';
      for (const r of rules) {
        if (r instanceof CSSStyleRule) { if (used(r.selectorText)) o += fix(r.cssText, base) + sep; }
        else if (r instanceof CSSMediaRule) { const i = walk(r.cssRules, base, ' '); if (i) o += '@media ' + r.conditionText + '{' + i + '}' + sep; }
        else if (r instanceof CSSSupportsRule) { const i = walk(r.cssRules, base, ' '); if (i) o += '@supports ' + r.conditionText + '{' + i + '}' + sep; }
        else if (r instanceof CSSImportRule) { /* تُحمَّل خارجياً */ }
        else o += fix(r.cssText, base).replace(/\n/g, ' ') + sep; // @font-face و@keyframes و@property وغيرها
      }
      return o;
    };
    const blocks = []; const ext = [];
    for (const sh of document.styleSheets) {
      let rules = null;
      try { rules = sh.cssRules; } catch (e) { rules = null; }
      const mt = sh.media && sh.media.mediaText;
      if (!rules) { if (sh.href) ext.push(sh.href); continue; }
      if (sh.href && !sh.href.startsWith(location.origin)) { ext.push(sh.href); continue; }
      const base = sh.href || location.href;
      const inner = walk(rules, base, '\u0001');
      if (!inner) continue;
      if (mt === 'print') continue;
      blocks.push((mt && mt !== 'all') ? '@media ' + mt + '{' + inner.replace(/\u0001/g, ' ') + '}' : inner);
    }
    const de = document.documentElement;
    return { blocks: blocks.join('\u0001').split('\u0001').filter(Boolean), ext, theme: de.getAttribute('data-theme') || '', cls: de.className, lang: de.lang, dir: de.dir };
  });
  let body = null, head = null;
  if (scheme === 'light') {
    ({ body, head } = await p.evaluate(() => {
      const b = document.body.cloneNode(true);
      b.querySelectorAll('script,noscript[data-x],template,#mod,iframe,[aria-live]:empty').forEach((e) => e.remove());
      b.querySelectorAll('*').forEach((e) => { for (const a of [...e.attributes]) { if (/^on/i.test(a.name)) e.removeAttribute(a.name); } });
      b.querySelectorAll('[style*="display: none"],[hidden]').forEach((e) => { if (!e.closest('#nav,#app,#ft')) e.remove(); });
      const keep = [];
      document.head.querySelectorAll('meta,title,link[rel=manifest],link[rel=canonical],link[rel=alternate],link[rel=icon],link[rel=apple-touch-icon],script[type="application/ld+json"]').forEach((e) => keep.push(e.outerHTML));
      return { body: b.innerHTML, head: keep.join('\n') };
    }));
  }
  await ctx.close();
  return { ...out, body, head, errs };
}

async function check(browser) {
  // اختبار الصفحة الناتجة: ثابتة بلا أخطاء، والتطبيق يُستدعى عند الحاجة
  const res = [];
  const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, locale: 'ar', serviceWorkers: 'block' });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  const reqs = []; p.on('request', (r) => reqs.push(r.url()));
  await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(3000);
  fs.mkdirSync(path.join(R, 'tools/tmp'), { recursive: true });
  await p.screenshot({ path: path.join(R, 'tools/tmp/shell-mobile.png'), fullPage: true });
  const st = await p.evaluate(() => ({ app: typeof go === 'function', text: document.body.innerText.length, nav: !!document.querySelector('#nav'), ft: !!document.querySelector('#ft') }));
  res.push(['static home renders without the app', !st.app && st.text > 300 && st.nav && st.ft && !errs.length]);
  res.push(['no admin/portal code requested', !reqs.some((u) => /\/js\/(v51|adm|s35|s04|doc14)-/.test(u) || /supabase/.test(u))]);
  await p.evaluate(() => { location.hash = '#/login'; });
  await p.waitForFunction(() => typeof go === 'function' && /#\/login/.test(location.hash), null, { timeout: 90000 }).catch(() => {});
  res.push(['app boots on in-app route, URL kept', await p.evaluate(() => typeof go === 'function' && location.pathname === '/' && /#\/login/.test(location.hash))]);
  await ctx.close();
  const c0 = await browser.newContext({ viewport: { width: 412, height: 860 }, locale: 'ar', serviceWorkers: 'block' }); const p0 = await c0.newPage();
  await p0.goto(BASE + '/app.html', { waitUntil: 'load' }); await p0.waitForFunction(() => typeof go === 'function' && document.querySelector('#app') && document.querySelector('#app').innerText.length > 200, null, { timeout: 90000 }).catch(() => {});
  await p0.waitForTimeout(5000); await p0.screenshot({ path: path.join(R, 'tools/tmp/app-mobile.png'), fullPage: true }); await c0.close();
  const c2 = await browser.newContext({ locale: 'ar', serviceWorkers: 'block' }); const p2 = await c2.newPage();
  await p2.goto(BASE + '/#/verify', { waitUntil: 'load' });
  res.push(['deep link boots app', await p2.waitForFunction(() => typeof go === 'function', null, { timeout: 90000 }).then(() => true).catch(() => false)]);
  await c2.close();
  const c3 = await browser.newContext({ locale: 'ar', serviceWorkers: 'block' }); const p3 = await c3.newPage();
  await p3.goto(BASE + '/', { waitUntil: 'load' });
  const link = await p3.$('#nav a[href^="#/"]:visible, #app a[href^="#/"]:visible, #nav a[href^="/#/"]:visible, #app a[href^="/#/"]:visible');
  if (link) { const href = await link.getAttribute('href'); await link.click(); const ok = await until(p3, () => typeof go === 'function' && location.pathname === '/', 90000); console.log('clicked', href, '→', await p3.evaluate(() => location.hash).catch(() => '?')); res.push(['click on in-app link boots app', ok]); }
  else res.push(['in-app link present in shell', false]);
  await c3.close();
  const c4 = await browser.newContext({ locale: 'ar', serviceWorkers: 'block' }); const p4 = await c4.newPage();
  await p4.addInitScript(() => { try { localStorage.setItem('tl', 'en'); } catch (e) {} });
  await p4.goto(BASE + '/', { waitUntil: 'load' });
  res.push(['saved English preference boots app', await p4.waitForFunction(() => typeof go === 'function', null, { timeout: 90000 }).then(() => true).catch(() => false)]);
  await c4.close();
  return res;
}

(async () => {
  const app = fs.readFileSync(path.join(R, 'app.html'), 'utf8');
  const srv = serve('app.html');
  const browser = await chromium.launch();
  const L = await capture(browser, 'light');
  const Dk = await capture(browser, 'dark');
  srv.close();
  if (L.errs.length) console.log('page errors while rendering:', L.errs.slice(0, 5).join(' | '));
  if (!L.body || L.body.length < 2000 || !/معهد التمهيد/.test(L.body)) throw new Error('render too small or missing institution name');
  const cssSet = new Set(); const parts = [];
  // الأنماط الفاتحة بترتيبها الأصلي كما هي، ثم ما لا يطابق إلا في الوضع الداكن
  for (const blk of L.blocks) { const k = blk.trim(); if (k) { cssSet.add(k); parts.push(k); } }
  for (const blk of Dk.blocks) { const k = blk.trim(); if (k && !cssSet.has(k)) { cssSet.add(k); parts.push(k); } }
  const css = parts.join('\n');
  const loader = fs.readFileSync(path.join(__dirname, 'shell-loader.js'), 'utf8').replace(/^\/\*[\s\S]*?\*\/\s*/, '');
  const fonts = [...new Set([...L.ext, ...Dk.ext])].filter((u) => /fonts\.googleapis\.com/.test(u));
  const theme = "(function(){var d=document.documentElement;try{var t=localStorage.getItem('tth');if(t==='dark'||t==='light')d.setAttribute('data-theme',t);else if(matchMedia('(prefers-color-scheme:dark)').matches)d.setAttribute('data-theme','dark')}catch(e){}})();";
  const fb = '<style id="afc">html{display:none!important}</style><noscript><style>html{display:block!important}</style></noscript>\n' +
    "<script>if(self===top){var afc=document.getElementById('afc');if(afc)afc.parentNode.removeChild(afc)}else{try{top.location.replace(self.location.href)}catch(e){}}</script>";
  if (!/http-equiv="Content-Security-Policy"/.test(L.head)) throw new Error('CSP meta missing in app head');
  const html = '<!DOCTYPE html>\n<html lang="' + (L.lang || 'ar') + '" dir="' + (L.dir || 'rtl') + '" data-ati-shell="v231">\n<head>\n' +
    L.head.replace(/(<meta name="referrer"[^>]*>)/, '$1\n' + fb) + '\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    fonts.map((u) => '<link rel="stylesheet" href="' + esc(u) + '" media="print" onload="this.media=\'all\'">').join('\n') + '\n' +
    '<script>' + theme + '</script>\n' +
    '<style>' + css + '\nhtml.ati-hide body{visibility:hidden}html.ati-booting body{cursor:progress}html.ati-booting body:before{content:"";position:fixed;top:0;inset-inline:0;height:3px;background:#2f6fd0;z-index:99999;animation:atib 1.2s ease-in-out infinite}@keyframes atib{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}</style>\n' +
    '<script>' + loader + '</script>\n</head>\n<body>\n' + L.body + '\n</body>\n</html>\n';
  const tmp = path.join(R, 'index.prerender.html');
  fs.writeFileSync(tmp, html);
  const srv2 = serve('index.prerender.html');
  const res = await check(browser);
  srv2.close(); await browser.close();
  res.forEach(([k, ok]) => console.log((ok ? 'PASS ' : 'FAIL ') + k));
  console.log('shell bytes', Buffer.byteLength(html), 'css bytes', Buffer.byteLength(css), 'app bytes', Buffer.byteLength(app));
  if (res.some(([, ok]) => !ok)) { fs.unlinkSync(tmp); throw new Error('shell checks failed; index.html unchanged'); }
  fs.renameSync(tmp, path.join(R, 'index.html'));
  console.log('index.html written');
})().catch((e) => { console.error(e); process.exit(1); });

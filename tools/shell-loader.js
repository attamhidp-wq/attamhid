/* v231 — محمِّل الصفحة الرئيسية الخفيفة (يُضمَّن في index.html بواسطة tools/prerender.js؛ لا يُعدَّل index.html يدوياً)
   الزائر العام يرى نسخة ثابتة مُصيَّرة مسبقاً من الصفحة الرئيسية بلا أي شيفرة للإدارة أو البوابات.
   يُحمَّل التطبيق الكامل (app.html) في الصفحة نفسها ودون تغيير الرابط فقط عند الحاجة:
   مسار داخل التطبيق (#/...)، أو معامل في الرابط، أو جلسة دخول قائمة، أو تفضيل لغة/مظهر محفوظ، أو أي نقرة تتطلب التطبيق. */
(function () {
  var W = window, D = document, booted = 0, appP = null;
  var APP = '/app.html';
  function routeNeedsApp() {
    var h = (location.hash || '').replace(/^#\/?/, '').split(/[/?]/)[0];
    return !!(h && h !== 'home');
  }
  function stateNeedsApp() {
    if (location.search && location.search !== '?') return true;
    try {
      var tl = localStorage.getItem('tl'); if (tl && tl !== 'ar') return true;
      if (localStorage.getItem('tl3')) return true;
      for (var i = 0; i < localStorage.length; i++) { if (/^sb-.+-auth-token$/.test(localStorage.key(i) || '')) return true; }
      if (sessionStorage.getItem('tm') || sessionStorage.getItem('pa') || sessionStorage.getItem('paem') || sessionStorage.getItem('p217tok') || sessionStorage.getItem('p210em')) return true;
    } catch (e) { }
    return false;
  }
  function fetchApp() {
    if (!appP) appP = fetch(APP, { credentials: 'same-origin', cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('app ' + r.status); return r.text(); });
    return appP;
  }
  function preload(t) {
    // التحميل المسبق للمكتبات الخارجية حتى لا تُحجب عند الكتابة في شبكات بطيئة جداً
    var re = /<script[^>]*\ssrc="(https:\/\/[^"]+)"/g, m, L = [];
    while ((m = re.exec(t))) L.push(m[1]);
    if (!L.length) return Promise.resolve();
    return Promise.race([
      Promise.all(L.map(function (u) { return new Promise(function (res) { var l = D.createElement('link'); l.rel = 'preload'; l.as = 'script'; l.href = u; l.onload = l.onerror = res; D.head.appendChild(l); }); })),
      new Promise(function (res) { setTimeout(res, 2500); })
    ]);
  }
  var REPLAY = '<script>(function(){try{var r=JSON.parse(sessionStorage.getItem("ati_rp")||"null");sessionStorage.removeItem("ati_rp");if(!r)return;var n=0,iv=setInterval(function(){n++;var c=[].slice.call(document.querySelectorAll(r.t)).filter(function(e){return (e.textContent||"").replace(/\\s+/g," ").trim().slice(0,80)===r.x});var el=c[r.i]||c[0];if(el){clearInterval(iv);el.click()}else if(n>80)clearInterval(iv)},150)}catch(e){}})()<\/script>';
  function boot() {
    if (booted) return; booted = 1;
    try { W.removeEventListener('hashchange', boot); } catch (e) { }
    D.documentElement.classList.add('ati-booting');
    fetchApp().then(function (t) {
      return preload(t).then(function () {
        try { if (sessionStorage.getItem('ati_rp')) t = t.replace(/<\/body>(?![\s\S]*<\/body>)/, REPLAY + '</body>'); } catch (e) { }
        D.open(); D.write(t); D.close();
      });
    }).catch(function () { location.replace(APP + location.search + location.hash); });
  }
  W.__atiBoot = boot;
  if (routeNeedsApp() || stateNeedsApp()) { D.documentElement.classList.add('ati-hide'); boot(); return; }
  W.addEventListener('hashchange', boot);
  var warm = function () { fetchApp().catch(function () { appP = null; }); };
  D.addEventListener('pointerover', function f(e) { if (e.target && e.target.closest && e.target.closest('a,button,[onclick],[role=button],input')) { D.removeEventListener('pointerover', f, true); warm(); } }, true);
  D.addEventListener('touchstart', warm, { capture: true, passive: true, once: true });
  D.addEventListener('submit', function (e) { e.preventDefault(); e.stopPropagation(); boot(); }, true);
  D.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var el = e.target && e.target.closest && e.target.closest('a[href],button,[onclick],[role=button],label,input,select,textarea,[tabindex]');
    if (!el) return;
    if (el.tagName === 'A') {
      var h = el.getAttribute('href') || '', u;
      if (!/^(javascript:|#$)/i.test(h)) {
        try { u = new URL(h, location.href); } catch (x) { return; }
        if (u.origin !== location.origin || el.target === '_blank' || el.hasAttribute('download')) return;
        if (!/^\/(index\.html)?$/.test(u.pathname)) return; // الصفحات الثابتة الأخرى تُفتح كالمعتاد
        var r = (u.hash || '').replace(/^#\/?/, '').split(/[/?]/)[0];
        e.preventDefault(); e.stopPropagation();
        if ((!r || r === 'home') && !u.search) { W.scrollTo(0, 0); return; }
        history.pushState(null, '', u.pathname + u.search + u.hash); boot(); return;
      }
    }
    e.preventDefault(); e.stopPropagation();
    try {
      var tag = el.tagName.toLowerCase(), x = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      var same = [].slice.call(D.querySelectorAll(tag)).filter(function (z) { return (z.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) === x; });
      sessionStorage.setItem('ati_rp', JSON.stringify({ t: tag, x: x, i: Math.max(0, same.indexOf(el)) }));
    } catch (y) { }
    boot();
  }, true);
})();

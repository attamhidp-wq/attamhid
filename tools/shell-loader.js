/* v231 — محمِّل الصفحة الرئيسية الخفيفة (يُضمَّن في index.html بواسطة tools/prerender.js؛ لا يُعدَّل index.html يدوياً)
   الزائر العام يرى نسخة ثابتة مُصيَّرة مسبقاً من الصفحة الرئيسية بلا أي شيفرة للإدارة أو البوابات.
   يُحمَّل التطبيق الكامل (app.html) في الصفحة نفسها ودون تغيير الرابط فقط عند الحاجة:
   مسار داخل التطبيق (#/...)، أو معامل في الرابط، أو جلسة دخول قائمة، أو تفضيل لغة/مظهر محفوظ، أو أي نقرة تتطلب التطبيق.
   v252: رابط رمز QR (‎/?v=الرقم) يُجاب في هذه الصفحة الخفيفة لأنواع الوثائق المتحقَّق من تطابق نصها مع التطبيق (tools/lightcheck.js). */
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
  // v252 — التحقق السريع لرابط رمز QR (‎/?v=الرقم): يُعرض الجواب من الخادم في الصفحة الخفيفة دون تنزيل التطبيق كله.
  // يعمل فقط للزائر بالعربية بلا جلسة، ولوثيقة وجدها الخادم من نوع معروف؛ وفي أي حالة أخرى (غير موجودة، خطأ، اختبار)
  // يُحمَّل التطبيق الكامل كما كان تماماً. نص النتيجة مطابق لما يعرضه التطبيق.
  var V252 = (function () {
    try {
      var sp = new URLSearchParams(location.search), q = (sp.get('v') || '').trim();
      if (!q || q.length > 80 || String(location.search).split('&').length !== 1) return null;
      if (location.hash && !/^#\/?(home)?$/.test(location.hash)) return null;
      var tl = localStorage.getItem('tl'); if ((tl && tl !== 'ar') || localStorage.getItem('tl3')) return null;
      for (var i = 0; i < localStorage.length; i++) { if (/^sb-.+-auth-token$/.test(localStorage.key(i) || '')) return null; }
      if (sessionStorage.getItem('tm') || sessionStorage.getItem('pa') || sessionStorage.getItem('paem') || sessionStorage.getItem('p217tok') || sessionStorage.getItem('p210em')) return null;
      if (!W.fetch) return null;
      return q;
    } catch (e) { return null; }
  })();
  if (V252) {
    try { var hs252 = D.createElement('style'); hs252.textContent = '#app>*:not(.v252){display:none!important}'; (D.head || D.documentElement).appendChild(hs252); } catch (e) { }
    var CT252 = { part: 'شهادة مشاركة', rec: 'خطاب توصية', thanks: 'شهادة شكر وتقدير', exp: 'شهادة خبرة', appt: 'خطاب تعيين', intro: 'شهادة تعريف', fin: 'إفادة مستحق مالي', acc: 'خطاب قبول', spa: 'شهادة حضور', spp: 'شهادة مشاركة (برنامج قصير)', skill77: 'السجل المهاري' };
    var e252 = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var card252 = function (c) {
      var fr = c.type === 'free' || c.type === 'blank';
      return '<div class="msg' + (c.revoked ? ' er' : '') + '"><b>' + (c.revoked ? '✖ وثيقة ملغاة' + (c.reason ? ' — ' + e252(c.reason) : '') + (c.rdate ? ' (' + e252(c.rdate) + ')' : '') : '✔ وثيقة معتمدة') + '</b><br>نوع الوثيقة: ' + e252(CT252[c.type || 'part']) +
        (c.title ? '<br>عنوان الوثيقة: ' + e252(c.title) : '') + ((fr && c.title && c.name == c.title) ? '' : '<br>الاسم: ' + e252(c.name)) + (c.prog ? '<br>البرنامج: ' + e252(c.prog) : '') +
        ((c.hours || c.grade) ? '<br>' + (c.hours ? 'الساعات: ' + e252(c.hours) : '') + ((c.hours && c.grade) ? ' · ' : '') + (c.grade ? 'التقدير: ' + e252(c.grade) : '') : '') +
        '<br>تاريخ الإصدار: ' + e252(c.date) + '<br>رقم السجل: ' + e252(c.rec) + '</div>';
    };
    var full252 = function () { D.documentElement.classList.add('ati-hide'); boot(); };
    var mk252 = function () {
      var m = D.getElementById('app'), st = D.createElement('style');
      st.textContent = '.v252{max-width:1180px;margin:0 auto;padding:18px 16px 40px}.v252 .ph{background:linear-gradient(135deg,#0b1f3a,#1d3a66);color:#fff;border-radius:12px;padding:30px 28px;margin-bottom:26px}.v252 .bc{font-size:13px;opacity:.85;margin-bottom:10px}.v252 .bc a{color:#fff}.v252 h2{margin:0 0 10px;font-size:clamp(24px,4vw,34px);color:#fff}.v252 .ph p{margin:0;opacity:.9}.v252 .box{background:var(--card,#fff);border:1px solid #dfe3ea;border-inline-start:4px solid #0b1f3a;border-radius:10px;padding:16px}.v252 form{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end}.v252 label{flex:1 1 260px;font-weight:600}.v252 input{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:11px 14px;font:inherit;border:1px solid #cfd6e0;border-radius:6px;direction:ltr;text-align:right}.v252 button,.v252 .btn{flex:1 1 200px;padding:12px 18px;border:0;border-radius:6px;background:#0b1f3a;color:#fff;font:inherit;font-weight:700;cursor:pointer}.v252 .msg{margin-top:14px;padding:14px 16px;border-radius:8px;background:#e8f5ec;border-inline-start:4px solid #1e7a3c;line-height:1.9}.v252 .msg.er{background:#fdecec;border-color:#b42318}.v252 .more{margin-top:14px;text-align:center}.v252 .more .btn{display:inline-block;flex:none;background:#fff;color:#0b1f3a;border:1px solid #0b1f3a;text-decoration:none}';
      D.head.appendChild(st);
      m.innerHTML = '<div class="v252" data-v252="1"><div class="ph"><div class="bc"><a href="/">الرئيسية</a> / <span>التحقق من الشهادات والوثائق</span></div><h2>التحقق من الشهادات والوثائق</h2><p>تحقّق من صحة أي وثيقة أو شهادة صادرة عن المعهد برقمها أو بمسح رمز التحقق.</p></div>' +
        '<div class="box"><form id="f252"><label>رقم السجل أو رقم الهوية/الجواز<input name="n" required value="' + e252(V252) + '"></label><button type="submit">تحقق</button></form><div id="o252" aria-live="polite"><p style="margin:14px 0 0;opacity:.75">جارٍ التحقق…</p></div></div></div>';
      try { W.scrollTo(0, 0); } catch (e) { }
      D.getElementById('f252').addEventListener('submit', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var n = (this.n.value || '').trim(); if (!n) return;
        try { history.replaceState(null, '', '/?v=' + encodeURIComponent(n)); } catch (x) { }
        full252();
      }, true);
    };
    var ui252 = function () { try { if (!D.getElementById('app')) throw 0; mk252(); return 1; } catch (e) { full252(); return 0; } }, ready252 = new Promise(function (res) { if (D.readyState !== 'loading') res(ui252()); else D.addEventListener('DOMContentLoaded', function () { res(ui252()); }); });
    var t252 = setTimeout(full252, 12000);
    fetch('https://ttuelhswxyjbjdnydmns.supabase.co/rest/v1/rpc/verify_cert', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dWVsaHN3eHlqYmpkbnlkbW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDk3MDYsImV4cCI6MjEwNzUyNTcwNn0.tkO2kZLHpKbgPx_II4cepqCVftjjG46oseR6aGGCbPA', Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dWVsaHN3eHlqYmpkbnlkbW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDk3MDYsImV4cCI6MjEwNzUyNTcwNn0.tkO2kZLHpKbgPx_II4cepqCVftjjG46oseR6aGGCbPA' }, body: JSON.stringify({ q: V252 }) })
      .then(function (r) { if (!r.ok) throw new Error('rpc ' + r.status); return r.json(); })
      .then(function (rows) {
        return ready252.then(function (u) { if (booted || !u) return;
        var ok = Array.isArray(rows) && rows.length && rows.every(function (c) { return c && c.rec && c.type !== 'exam' && c.type !== 'plt' && c.type && CT252[c.type]; });
        if (!ok) throw new Error('fallback');
        clearTimeout(t252);
        D.getElementById('o252').innerHTML = rows.map(card252).join('') + '<div class="more"><a class="btn" id="m252" href="/#/verify/' + encodeURIComponent(V252) + '">مشاركة الشهادة وخيارات أخرى</a></div>';
        D.getElementById('m252').addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); full252(); }, true);
        try { D.title = 'التحقق من الشهادات والوثائق — معهد التمهيد'; } catch (x) { }
        });
      })
      .catch(function () { clearTimeout(t252); if (!booted) full252(); });
  }
  if (!V252 && (routeNeedsApp() || stateNeedsApp())) { D.documentElement.classList.add('ati-hide'); boot(); return; }
  W.addEventListener('hashchange', boot);
  var warm = function () { fetchApp().catch(function () { appP = null; }); };
  D.addEventListener('pointerover', function f(e) { if (e.target && e.target.closest && e.target.closest('a,button,[onclick],[role=button],input')) { D.removeEventListener('pointerover', f, true); warm(); } }, true);
  D.addEventListener('touchstart', warm, { capture: true, passive: true, once: true });
  var in252 = function (e) { try { return !!(e.target && e.target.closest && e.target.closest('[data-v252]')); } catch (x) { return false; } };
  D.addEventListener('submit', function (e) { if (in252(e)) return; e.preventDefault(); e.stopPropagation(); boot(); }, true);
  D.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || in252(e)) return;
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

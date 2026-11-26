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
  // v284: نماذج وثائق بوابة الخريجين (النماذج الـ28 PDF بملف تجريبي) إلى بريد المعهد وحده — مرة واحدة تلقائياً، أو بالمهمة ft-samples
  try { const fc = await p.evaluate(async () => { const r = await sb.rpc('ft_cfg_get'); return (r && r.data) || {}; });
    if (process.env.TASK === 'ft-samples' || !fc.pdf279) {
      const rs = await p.evaluate(async () => { const V = window.V51, N = window.__nf232, out = { sent: 0, bad: [] }; const to = String((S.home || {}).em || '').trim(); if (!/@/.test(to) || !N) return { err: !N ? 'no_nf' : 'no_inst_email' };
        const set = (o, path, v) => { const pp = path.split('.'); let c = o; for (let i = 0; i < pp.length; i++) { let k = pp[i]; const last = i === pp.length - 1; if (k === '-1') { if (!Array.isArray(c)) return; if (!c.length) c.push({}); k = c.length - 1; } const nk = pp[i + 1]; if (last) { if (c[k] === undefined || c[k] === '' || c[k] === null) c[k] = v; } else { if (c[k] == null || typeof c[k] !== 'object') c[k] = (/^-?\d+$/.test(nk) ? [] : {}); c = c[k]; } } };
        const val = (k, lab, src) => { if (/\.(c|s)\.\d+$|items\.\d+\.v$|weeks\.\d+\.h$|\.hrsWeek$|dailyHrs$|^m9\.(w|o)$/.test(src)) return '4'; if (/\.checks\.\d+$/.test(src)) return true; if (/(date|from|to|end|At|at|planDue)$/.test(src)) return '2026-12-01'; return '(نموذج)'; };
        const b64 = (blob) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1] || ''); fr.onerror = rej; fr.readAsDataURL(blob); });
        const lg = V.logoPng70 ? await V.logoPng70().catch(() => '') : ''; const logo = lg ? [{ filename: 'logo.png', content: lg, content_type: 'image/png', content_id: 'logo64' }] : [];
        for (const kind of ['tr', 'gp']) { const r = N.sample(kind); r.id = (kind === 'tr' ? 'TR' : 'GP') + '-SAMPLE'; r.sid = 'SAMPLE'; r.st = kind === 'tr' ? 'closed' : 'final_ok'; r.data.s = { ar: 'محمد عبد الله (نموذج)', en: 'Mohammad Abdullah (sample)', id: '000000000', nat: 'نموذج', ph: '—' };
          for (let pass = 0; pass < 3; pass++) for (const c of Object.keys(N.FD)) { const D = N.FD[c]; if (D.k !== kind) continue; let L = []; try { L = D.f(r, D.subs ? ((D.subs(r) || [])[0] || [''])[0] : '') || []; } catch (e) { continue; } for (const x of L) { const src = x[4] || ''; if (!src || /^stu\./.test(src) || src === 'hrsNeed') continue; set(r.data, src, val(x[0], x[1], src)); } }
          const d = r.data, S1 = '12026001'; d.isup = S1; d.gsup = S1; d.usup = S1; r.sup = [S1]; d.dec = { to: 'approved', at: '2026-12-01' }; d.isupRec = { rec: 'yes', at: '2026-12-01' };
          (function walk(o, dep) { if (!o || typeof o !== 'object' || dep > 6) return; if (!Array.isArray(o) && o.at === undefined) o.at = '2026-12-01'; Object.keys(o).forEach((k) => { if (o[k] && typeof o[k] === 'object') walk(o[k], dep + 1); }); })(d, 0);
          d.app = d.app || {}; d.m6 = d.m6 || {}; d.m6.m1 = S1; d.m6.m2 = S1; d.m7 = d.m7 || {}; d.m7.m1 = S1; d.m7.m2 = S1; d.cmt = [S1, S1]; d.reqs = []; d.final = { at: '2026-12-01' }; d.finalOk = { at: '2026-12-01' };
          for (const c of N.NFO.filter((c) => N.NF[c].k === kind)) { try { const h = await N.build(c, r, 'SAMPLE-' + c, new Date().toISOString()); const blob = await mkBlob(h, 'pdf'); const pdf = await b64(blob);
              const t = (N.FD[c] && N.FD[c].t) || [c, c], unit = kind === 'tr' ? { title: 'وحدة التدريب الميداني', titleEn: 'Field Training Unit' } : { title: 'وحدة مشاريع التخرج', titleEn: 'Graduation Projects Unit' };
              const B = V.mailDoc70({ subject: 'نموذج ' + c + ' — ' + t[0], titleAr: 'نموذج للمراجعة: ' + t[0] + ' (' + c + ')', titleEn: 'Sample for review: ' + t[1], dearAr: 'الإدارة المركزية', dearEn: 'Central Administration', bodyAr: 'مرفق نموذج الوثيقة كما تصدر من بوابة الخريجين، مُعبّأً ببيانات تجريبية، برقم ورمز QR للتحقق. يُرجى المراجعة والاعتماد من «مراجعة النماذج واعتمادها» قبل إصدارها رسمياً.', bodyEn: 'Attached is the document as issued by the Graduates Portal, filled with sample data, with a number and a QR code. Please review and approve it under “Review & approve forms” before it is issued officially.', sender: unit });
              const x = await V.fn63({ action: 'mail', type: 'sample', ref_id: 'ft284:' + c, to, subject: '[نموذج للمراجعة / Sample] ' + c + ' — ' + t[0] + ' / ' + t[1], html: B.html, text: B.text, cred_without: '', cred_without_text: '', cred_with: '', cred_with_text: '', from_name: B.from_name, reply_to: B.reply_to || '', attachments: logo.concat([{ filename: 'sample-' + c.replace('ت-', 'T').replace('م-', 'G') + '.pdf', content: pdf, content_type: 'application/pdf' }]) });
              if (x && x.ok) out.sent++; else out.bad.push(c + ':' + ((x && x.error) || 'x')); } catch (e) { out.bad.push(c + ':' + String(e.message).slice(0, 60)); } } }
        if (out.sent) { try { await sb.rpc('ft_cfg_set', { p: { pdf279: { at: new Date().toISOString(), n: out.sent } } }); } catch (e) {} }
        return out; });
      console.log('TASK ft-pdf-samples', JSON.stringify(rs)); }
  } catch (e) { console.log('TASK ft-pdf-samples FAIL', String(e).slice(0, 200)); }
  // v272: مهام خاصة بإذن الإدارة (لا تُطبع أسماء ولا عناوين)
  // v274: نماذج كل رسائل البريد إلى بريد المعهد للمراجعة (لا يصل شيء لأحد غيره)
  if (process.env.TASK === 'mail-samples') {
    const r = await p.evaluate(async () => { const V = window.V51, out = {}; const to = String((S.home || {}).em || '').trim(); if (!/@/.test(to)) return { err: 'no_inst_email' };
      const tag = '[نموذج للمراجعة / Sample] ', lg = V.logoPng70 ? await V.logoPng70().catch(() => '') : '';
      const att = lg ? [{ filename: 'logo.png', content: lg, content_type: 'image/png', content_id: 'logo64' }] : [];
      const go = async (k, B, subj) => { try { const x = await V.fn63({ action: 'mail', type: 'sample', ref_id: 'sample', to, subject: tag + subj, html: B.html, text: B.text, cred_without: '', cred_without_text: '', cred_with: '', cred_with_text: '', from_name: B.from_name, reply_to: B.reply_to || '', attachments: att }); out[k] = !!(x && x.ok); } catch (e) { out[k] = 'E'; } };
      try { const x = await V.fn63({ action: 'samples' }); out.server = x && x.sent ? x.sent : (x && x.error) || 'x'; } catch (e) { out.server = 'E'; }
      const D = (o) => V.mailDoc70(Object.assign({ dearAr: 'عزيزي الطالب محمد عبد الله (نموذج)،', dearEn: 'Dear Mohammad Abdullah (sample),' }, o));
      await go('reg', D({ subject: 'اعتماد تسجيل المقررات — معهد التمهيد', titleAr: 'اعتماد تسجيل المقررات', titleEn: 'Course registration approved', bodyAr: 'اعتُمد تسجيلكم في مقررات الفصل الدراسي الأول 2026، ويمكنكم الاطلاع على جدولكم في البوابة.', bodyEn: 'Your registration in the courses of the First Semester 2026 has been approved; your timetable is in the portal.', sender: { title: 'قسم القبول والتسجيل', titleEn: 'Admission & Registration Department' } }), 'اعتماد تسجيل المقررات — معهد التمهيد');
      await go('plt', D({ subject: 'نتيجة المفاضلة — معهد التمهيد', titleAr: 'نتيجة اختبار تحديد المستوى', titleEn: 'Placement test result', bodyAr: 'درجتك في اختبار تحديد المستوى: 78 / 100.', bodyEn: 'Your placement test score: 78 / 100.', sender: { title: 'قسم القبول والتسجيل', titleEn: 'Admission & Registration Department' } }), 'نتيجة المفاضلة — معهد التمهيد');
      await go('general', D({ subject: 'رسالة من المعهد', titleAr: 'رسالة من المعهد', titleEn: 'A message from the Institute', bodyAr: 'نموذج رسالة عامة لا تُحدَّد فيها جهة: تُذيَّل باسم الإدارة العامة.', bodyEn: 'Sample general message with no specific department: signed by the General Administration.' }), 'رسالة من المعهد (بلا جهة محددة)');
      try { if (V.mailText77) { for (const st of ['review', 'accepted', 'rejected']) { const T = V.mailText77({ id: 'A-SAMPLE', name: 'محمد عبد الله (نموذج)', nameEn: 'Mohammad Abdullah (sample)', email: to, prog: 1000 }, st, '', null); const B = V.mailDoc70(T); await go('app_' + st, B, T.subject); } } } catch (e) { out.app = 'E ' + String(e.message).slice(0, 60); }
      try { const s0 = (S.students || []).find((x) => x && !x.deleted && x.email); const f0 = (S.faculty || []).find((x) => x && !x.deleted && x.email);
        for (const [ty, id] of [['admit', s0 && s0.id], ['grad', s0 && s0.id], ['reset', s0 && s0.id], ['appoint', f0 && f0.id]]) { if (!id || !V.mailBuild64) continue; let B; if (ty === 'appoint') { const A0 = f0.appt64, N0 = f0.name, E0 = f0.nameEn; f0.appt64 = Object.assign({}, A0 || {}, { rank: 'أستاذ مساعد', rankEn: 'Assistant Professor', dept: 'قسم الدراسات اللغوية والترجمة', deptEn: 'Department of Linguistic Studies and Translation', type: 'contract', start: '2026-12-01', end: '2027-11-30', decNo: '15/1448', decDate: '2026-11-20', decBy: 'مجلس الشؤون التعليمية', decByEn: 'Board of Educational Affairs', duties: 'تدريس مقررات المهارات اللغوية في المستوى الأول.\nالإشراف الأكاديمي على طلاب المستوى الأول ومتابعة تقدمهم.\nرصد الدرجات وتقييم الطلاب في المقررات المسندة.', dutiesEn: 'Teaching the language-skills courses of Level 1; academic supervision of Level 1 students and following up their progress; recording grades and assessing students in the assigned courses.' }); f0.name = 'أحمد كريم (نموذج)'; f0.nameEn = ''; try { B = V.mailBuild64(ty, id, {}); } finally { f0.appt64 = A0; f0.name = N0; f0.nameEn = E0; } } else B = V.mailBuild64(ty, id, {}); if (!B) { out['acc_' + ty] = 'nob'; continue; }
          const strip = (h) => String(h || '').replace(/\[\[CRED\]\]/g, '(بيانات الدخول تظهر هنا في الرسالة الفعلية / Sign-in details appear here in the real message)');
          await go('acc_' + ty, { html: strip(B.html), text: strip(B.text), from_name: B.from_name, reply_to: B.reply_to }, B.subject); } } catch (e) { out.acc = 'E ' + String(e.message).slice(0, 60); }
      return out; });
    console.log('TASK mail-samples', JSON.stringify(r)); await b.close(); process.exit(0);
  }
  if (/^rcpt-(preview|send)$/.test(process.env.TASK || '')) {
    const r = await p.evaluate((m) => window.fin263rcptBatch ? window.fin263rcptBatch(m) : { err: ['nofn'] }, process.env.TASK.slice(5));
    console.log('TASK', process.env.TASK, JSON.stringify(r)); await b.close(); process.exit(0);
  }
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
          let ov = []; try { const host = document.createElement('div'); host.className = 'tmw'; host.style.cssText = 'position:fixed;left:-9000px;top:0'; host.innerHTML = h; document.body.appendChild(host); await new Promise((z) => setTimeout(z, 150)); host.querySelectorAll('.nfbd').forEach((bd, pi) => { const k = [...bd.children]; for (let i = 0; i + 1 < k.length; i++) { const a = k[i].getBoundingClientRect(), b = k[i + 1].getBoundingClientRect(); if (a.height && b.height && a.bottom > b.top + 2) ov.push((pi + 1) + ':' + i); } bd.querySelectorAll('.sig').forEach((sg) => { if (getComputedStyle(sg).position === 'absolute') ov.push((pi + 1) + ':sig-abs'); }); }); host.remove(); } catch (e) { ov.push('ERR ' + e.message); }
          out[c] = { ov, miss: m, pages: (h.match(/class="g9p/g) || []).length, vals: (h.match(/TEST-/g) || []).length, sig: /l59-sgs|data-sg289/.test(h) /* v288: لا ختم في النماذج؛ الختم في السجل الأكاديمي وحده */, seal: /l59-seal" src/.test(h), qr: (h.match(/l59-qr|data-qr289/g) || []).length, term: /الفصل الدراسي: الفصل/.test(h), err }; } }
      return out; });
    console.log('CHECK autofill', Object.values(af).every((x) => !x.err && x.pages > 0 && x.sig && !x.seal && x.qr >= x.pages && !(x.ov || []).length) ? 'OK' : 'FAIL', JSON.stringify(af));
    // v293: أرشيف المشاريع العام، ومعاينة استبيان الخريجين، وتبويبا الإدارة الجديدان
    const v293 = await p.evaluate(async () => { const o = {}; location.hash = '#/projects'; go(); await new Promise((z) => setTimeout(z, 4000)); const t = (document.querySelector('#app') || {}).innerText || ''; o.archive = /أرشيف مشاريع التخرج/.test(t) && !/تعذّر تحميل الأرشيف/.test(t);
      location.hash = '#/alumni-survey/SAMPLE'; go(); await new Promise((z) => setTimeout(z, 4000)); o.survey = !!document.querySelector('#app form') && /معاينة/.test((document.querySelector('#app') || {}).innerText || '');
      try { V51.h.ft279v('load'); await new Promise((z) => setTimeout(z, 3000)); o.load = /عبء الإشراف|المشرف/.test(document.body.innerText); V51.h.ft279v('alumni'); await new Promise((z) => setTimeout(z, 3000)); o.alumni = /متابعة الخريجين|استبيان/.test(document.body.innerText); V51.h.ft279v('eval'); await new Promise((z) => setTimeout(z, 3000)); o.eval = /تقييم|التقييمات/.test(document.body.innerText); V51.h.ft279v('annual'); await new Promise((z) => setTimeout(z, 1500)); o.annual = !!document.getElementById('af296'); location.hash = '#/alumni'; go(); await new Promise((z) => setTimeout(z, 3000)); o.dir = /دليل خريجي المعهد/.test((document.querySelector('#app') || {}).innerText || ''); location.hash = '#/jobs'; go(); await new Promise((z) => setTimeout(z, 3000)); o.jobs = /فرص العمل للخريجين/.test((document.querySelector('#app') || {}).innerText || ''); location.hash = '#/board'; go(); await new Promise((z) => setTimeout(z, 4000)); o.board = /الجودة والمتابعة/.test((document.querySelector('#app') || {}).innerText || ''); } catch (e) { o.err = e.message; }
      return o; });
    console.log('CHECK v293', v293.archive && v293.survey ? 'OK' : 'FAIL', JSON.stringify(v293));
    // v291: الخطابات على نموذج خطاب التعيين: الإطار الرسمي، لا ختم ولا جداول، رابط الموقع وعبارة التحقق، ورابط الدخول حيث يلزم (لا إصدار ولا حفظ)
    const lt = await p.evaluate(async () => { const out = {}; const st = (S.students || []).find((x) => !x.deleted) || {}, fa = (S.faculty || [])[0] || {}, mb = ((S.v51 || {}).members || [])[0];
      const C = [['acc', { type: 'acc', rec: 'TEST-ACC', sid: st.id, uid: st.id, name: st.name, prog: st.prog, date: '2026-12-01', lang: 'ar' }, 'student-services'], ['rec', { type: 'rec', rec: 'TEST-REC', sid: st.id, uid: st.id, name: st.name, prog: st.prog, date: '2026-12-01', lang: 'ar' }, ''], ['appt-f', { type: 'appt', rec: 'TEST-APF', uid: fa.id, name: fa.name, date: '2026-12-01' }, 'faculty-services']];
      if (mb) C.push(['appt-s', { type: 'appt', rec: 'TEST-APS', uid: mb.id, name: mb.name, date: '2026-12-01' }, 'login/staff']);
      for (const [k, c, lg] of C) { try { const h = certHTML(c); out[k] = { frame: /data-l28[79]/.test(h), noTable: !/l59-tb/.test(h), noSeal: !/(l59|m9|k3|sp6|g6|g5)-seal" src/.test(h), site: /attamhid\.com/.test(h), verify: /للتحقق يرجى مسح الرمز/.test(h), login: !lg || h.indexOf(lg) >= 0 }; } catch (e) { out[k] = { err: e.message }; } }
      return out; });
    console.log('CHECK letters289', Object.values(lt).every((x) => !x.err && x.frame && x.noTable && x.noSeal && x.site && x.verify && x.login) ? 'OK' : 'FAIL', JSON.stringify(lt));
    // v298: وثيقة التخرج بالتصميم المعتمد (نهج الإمام) — تُختبر لخريج حقيقي ولأسماء طويلة، شاشة وجوال، وPDF؛ المخرجات أرقام وأعلام فقط (لا بيانات شخصية)
    for (const vw of [1280, 390]) {
      await p.setViewportSize({ width: vw, height: 900 });
      const g8 = await p.evaluate(async () => { const o = {}; try {
        const gs = (S.students || []).filter((x) => !x.deleted && /متخرج|graduat/i.test(x.status || '')); const st = gs[0] || (S.students || [])[0] || {}; o.realGrad = !!gs.length;
        const real = (S.certs || []).filter((c) => c && c.type === 'dgrad' && !/g8-draft/.test(certHTML(c)))[0]; o.realDoc = !!real;
        const mk = (nm, ne, sex) => real ? Object.assign({}, real, nm ? { name: nm, nameEn: ne, sex: sex } : {}) : ({ type: 'dgrad', rec: 'TEST-DG', sid: st.id, uid: st.id, name: nm || st.name, nameEn: ne || st.nameEn, prog: st.prog, nat: st.nat, natEn: st.natEn, pid: 'TEST', date: '2026-12-01', gdate: '2026-12-01', gpa: '3.85', sex: sex || st.sex, lang: 'bi' });
        const cases = [mk(), mk('عبد الرحمن بن محمد بن عبد الله بن إبراهيم بن عبد العزيز الأنصاري (اختبار)', 'Abdur Rahman Bin Mohammad Bin Abdullah Bin Ibrahim Bin Abdul Aziz Al-Ansari (TEST)', 'ذكر'), mk('فاطمة الزهراء (اختبار)', 'Fatema Al-Zahra (TEST)', 'أنثى')];
        o.cases = [];
        for (const c of cases) { const h = certHTML(c); const r = { skin: / g8x g8i"/.test(h), verify: /للتحقق يرجى مسح الرمز/.test(h), site: /attamhid\.com/.test(h), qr: /g8-qr/.test(h) };
          const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-9000px;top:0'; host.innerHTML = h; document.body.appendChild(host); await new Promise((z) => setTimeout(z, 300));
          if (window.__fit170) window.__fit170(host); const root = host.querySelector('.g8'); const ob = root.getBoundingClientRect();
          r.draft = /g8-draft/.test(h); r.inScaled = !r.draft && getComputedStyle(host.querySelector('.g8-in')).transform !== 'none';
          r.nameFit = [...host.querySelectorAll('.g8-ra.nm,.g8-re.nm')].every((e) => e.scrollWidth <= e.clientWidth + 2);
          const B = [...host.querySelectorAll('.g8-ra,.g8-re,.g8-fr,.g8-fl,.g8-sg')].map((e) => e.getBoundingClientRect());
          r.inside = B.every((b) => b.left >= ob.left - 1 && b.right <= ob.right + 1 && b.bottom <= ob.bottom + 1);
          const ar = [...host.querySelectorAll('.g8-ra')].map((e) => e.getBoundingClientRect()), en = [...host.querySelectorAll('.g8-re')].map((e) => e.getBoundingClientRect());
          r.colsClear = [...host.querySelectorAll('.g8-ra,.g8-re')].every((e) => { const rg = document.createRange(); rg.selectNodeContents(e); return rg.getBoundingClientRect().width <= e.clientWidth + 4; });
          host.remove();
          try { const cv = await mkCanvas(h, 1); r.canvas = cv.width + 'x' + cv.height; } catch (e) { r.canvas = 'ERR ' + e.message; }
          try { const cv2 = await mkCanvas(h, 2); const d = pdfNew(cv2, 2); d.addImage(cv2.toDataURL('image/jpeg', .92), 'JPEG', 0, 0, cv2.width / 2, cv2.height / 2); const bl = d.output('blob'); r.pdf = bl && bl.size > 50000; } catch (e) { r.pdf = 'ERR ' + e.message; } /* تصيير PDF للتصميم نفسه؛ قيود الإصدار (الدرجات/البيانات) تُختبر في مواضعها */
          o.cases.push(r); }
      } catch (e) { o.err = e.message; } return o; });
      const ok = !g8.err && g8.cases.length === 3 && g8.cases.every((r) => r.skin && r.verify && r.site && r.qr && !r.inScaled && r.nameFit && r.inside && r.colsClear && (r.pdf === true || (r.draft && /ناقصة/.test(String(r.pdf)))) && r.canvas === '1123x794');
      console.log('CHECK grad298 w' + vw, ok ? 'OK' : 'FAIL', JSON.stringify(g8));
    }
    await p.setViewportSize({ width: 1280, height: 900 });
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
      const ad = await p.evaluate(() => { const a = document.getElementById('app'); const s = a && a.querySelector('.adm255'); const bx = [...document.querySelectorAll('#app .ft231adm,#app .idn235adm')]; return { sec: !!s, inSec: bx.filter((b) => s && s.contains(b)).length, boxes: bx.length, last: !!(s && a.lastElementChild === s), fin: !!(s && s.querySelector('.fin263adm')) }; });
      console.log('CHECK fin-adm-box', ad.fin ? 'OK' : 'FAIL', JSON.stringify({ fin: ad.fin }));
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
    // v279: المرحلة الأولى — قسم «التدريب الميداني ومشروع التخرج» في أقسام اللوحة، وقائمة الاستحقاق من الخادم، والعزل (بلا أسماء في السجل)
    try { const z = await p.evaluate(async () => { const X = window.V51, FT = X.ft225, T = (X.TABS51 || []).find((x) => x[0] === 'ft279'); const o = { tab: !!T };
        if (!FT.ld) await FT.load(1); const L1 = await sb.rpc('ft_elig_list'); o.list = !L1.error && Array.isArray(L1.data); o.n = o.list ? L1.data.length : -1; o.items = o.list && L1.data.every((x) => Array.isArray(x.items) && x.items.length === 8);
        FT.elig = L1.data || []; FT.exc = (await sb.rpc('ft_exc_list')).data || []; X.h.ft279v('sum'); const h1 = T ? T[3]() : ''; X.h.ft279v('elig'); const h2 = T ? T[3]() : ''; X.h.ft279v('cfg'); const h3 = T ? T[3]() : ''; X.h.ft279v('sum');
        o.sum = /يحتاج إجراء الآن/.test(h1); o.elig = /الاستثناءات/.test(h2); o.cfg = /ft279c/.test(h3);
        o.nav = (typeof NAV === 'undefined') || !NAV.some((x) => /admin|ft279/.test(String(x[0])));
        const bad = await sb.rpc('ft_exc_set', { p_sid: '__none__', p_k: 'x', p_reason: 'robot check' }); o.excGuard = !!bad.error;
        const r = await fetch(SB_URL + '/rest/v1/rpc/ft_elig_list', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }, body: '{}' }); o.anonBlocked = !r.ok;
        const r2 = await fetch(SB_URL + '/rest/v1/rpc/ft_elig_detail', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }, body: JSON.stringify({ p_sid: '0' }) }); o.anonDetail = !r2.ok;
        return o; });
      console.log('CHECK ft279-admin', z.tab && z.list && z.items !== false && z.sum && z.elig && z.cfg && z.nav && z.excGuard && z.anonBlocked && z.anonDetail ? 'OK' : 'FAIL', JSON.stringify(z)); } catch (e) { console.log('CHECK ft279-admin FAIL', String(e).slice(0, 200)); }
    // v263: السجل المالي — يفتح للإدارة المركزية، والإجمالي التراكمي من التأكيدات فقط
    try { await p.evaluate(() => { location.hash = '#/fin'; }); await p.waitForFunction(() => /السجل المالي/.test((document.querySelector('#app') || {}).innerText || '') && document.querySelector('#app .fin263g'), null, { timeout: 45000 });
      const fz = await p.evaluate(() => { const a = document.querySelector('#app'); const k = [...a.querySelectorAll('.fin263k')].map((x) => x.innerText.replace(/\s+/g, ' ')); return { cards: k.length, cum: k[0] || '', rows: a.querySelectorAll('.fin263t tbody tr').length, adm: !!a }; });
      console.log('CHECK fin-admin', fz.cards >= 6 && /BDT/.test(fz.cum) ? 'OK' : 'FAIL', JSON.stringify(fz)); } catch (e) { console.log('CHECK fin-admin FAIL', String(e).slice(0, 200)); }
    // v270: قسم «نشر نتائج الفصل»
    try { await p.evaluate(() => { location.hash = '#/admin'; tab = 'v270r'; window.__force71 = 1; go(); }); await p.waitForSelector('#app .pub270', { timeout: 40000 });
      const pz = await p.evaluate(() => { const a = document.querySelector('#app .pub270'); return { len: a.innerText.length, btn: !!a.querySelector('.pub270b button'), cards: a.querySelectorAll('.fin263k').length, grp: /نشر نتائج الفصل/.test((document.getElementById('tabs69') || {}).innerText || '') }; });
      console.log('CHECK pub-tab', pz.btn && pz.cards >= 6 ? 'OK' : 'FAIL', JSON.stringify(pz)); } catch (e) { console.log('CHECK pub-tab FAIL', String(e).slice(0, 200)); }
    // v269: السجل المالي قسم في بوابة الإدارة، بأقسامه الستة
    try { await p.evaluate(() => { location.hash = '#/admin'; }); await p.waitForTimeout(5000); await p.evaluate(() => { tab = 'v263f'; window.__force71 = 1; go(); }); await p.waitForSelector('#app .fin263nav', { timeout: 40000 });
      const vs = {}; for (const v of ['dash', 'claims', 'stmts', 'sch', 'rep', 'set']) { await p.evaluate((v) => V51.h.fin263v(v), v); await p.waitForTimeout(700); vs[v] = await p.evaluate(() => { const a = document.querySelector('#app .fin263'); return a ? a.innerText.replace(/\s+/g, ' ').length : 0; }); }
      const grp = await p.evaluate(() => { const t = document.getElementById('tabs69'); return t ? /السجل المالي/.test(t.innerText) : null; });
      console.log('CHECK fin-tab', Object.values(vs).every((n) => n > 300) ? 'OK' : 'FAIL', JSON.stringify({ vs, grp })); } catch (e) { console.log('CHECK fin-tab FAIL', String(e).slice(0, 200)); }
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
        // v279: الطالب يرى ما استوفاه وما بقي عليه؛ ولا يرى قائمة غيره ولا قسم الإدارة
        if (role === 'student') { const el = await q.evaluate(async () => { const b = document.querySelector('#app .sec279'); const L1 = await sb.rpc('ft_elig_list'); const T = (V51.TABS51 || []).find((x) => x[0] === 'ft279'); return { box: !!b, items: document.querySelectorAll('#app .c279').length, next: !!document.querySelector('#app .nx279'), listBlocked: !!L1.error, tabEmpty: !T || T[3]() === '' }; });
          console.log('CHECK ft279-student', el.box && el.items >= 20 && el.next && el.listBlocked && el.tabEmpty ? 'OK' : 'FAIL', JSON.stringify(el)); }
        if (role === 'faculty') { const fl = await q.evaluate(async () => { const L1 = await sb.rpc('ft_exc_set', { p_sid: '__none__', p_k: '*', p_reason: 'robot check' }); return { excBlocked: !!L1.error }; });
          console.log('CHECK ft279-faculty', fl.excBlocked ? 'OK' : 'FAIL', JSON.stringify(fl)); }
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
      // v270: لا يرى الطالب أي درجة قبل النشر؛ النشر بالزر، والمعلّق يُنشر عند تأكيد الرسوم
      if (role === 'student' && process.env.GITHUB_EVENT_NAME === 'workflow_dispatch') { try {
        const T = 'T270-TEST', cid = 'P23-1101';
        const set1 = await p.evaluate(async (a) => { const r = await sb.from('students').select('id,data').eq('id', a.ref).maybeSingle(); const d = r.data.data; d.gr = d.gr || {}; d.gr[a.cid] = { fin: 1, rel: 1, relDate: '2026-11-25', score: 85, gl: 'ب+', pts: 4.5, ok: true, src: 'exam' }; const u = await sb.from('students').update({ data: d }).eq('id', a.ref); const r2 = await sb.from('students').select('id,data').eq('id', a.ref).maybeSingle(); return { err: u.error && u.error.message, rel: r2.data.data.gr[a.cid].rel }; }, { ref, cid });
        const see = async () => q.evaluate(async (cid) => { const r = await sb.from('students_me').select('id,data').maybeSingle(); const direct = await sb.from('students').select('id').limit(5); return { has: !!(r.data && r.data.data.gr && r.data.data.gr[cid]), direct: (direct.data || []).length }; }, cid);
        const s0 = await see();
        const pt = await p.evaluate(async (a) => (await sb.rpc('pub_term', { p_term: a.T, items: [{ sid: a.ref, cids: [a.cid], ok: false, termName: 'TEST' }], p_mail: false })).data, { ref, cid, T });
        const s1 = await see();
        const fi = await p.evaluate(async (a) => { await sb.rpc('fin_admin', { act: 'sem', p_id: null, p: { items: [{ ref: a.ref, name: 'TEST', term: a.T, base: 1000, pct: 0 }] } }); const r = await sb.from('fin263').select('id').eq('ref', a.ref).eq('term', a.T).maybeSingle(); const c = (await sb.rpc('fin_admin', { act: 'confirm', p_id: r.data.id, p: {} })).data; return { id: r.data.id, c }; }, { ref, T });
        const s2 = await see();
        await p.evaluate(async (id) => { await sb.rpc('fin_admin', { act: 'void', p_id: id, p: { note: 'robot test cleanup' } }); await sb.rpc('fin_admin', { act: 'cancel', p_id: id, p: { note: 'robot test cleanup' } }); }, fi.id);
        const ok = !set1.err && +set1.rel === 0 && !s0.has && s0.direct === 0 && pt && pt.ok && pt.held === 1 && !s1.has && fi.c && fi.c.ok && s2.has;
        console.log('CHECK pub-cycle', ok ? 'OK' : 'FAIL', JSON.stringify({ set1, s0, pt, s1, fi, s2 }));
      } catch (e) { console.log('CHECK pub-cycle FAIL', String(e).slice(0, 300)); } }
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

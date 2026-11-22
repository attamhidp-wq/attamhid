#!/usr/bin/env python3
"""v134 — صفحات البرامج القابلة للفهرسة في محركات البحث + خريطة الموقع.
يعمل بطريقتين:
  python3 tools/seo.py            ← من اللقطة tools/seo-data.json
  python3 tools/seo.py --fetch    ← يجلب البيانات العامة من الخادم (يُستعمل في GitHub Actions) ثم يولّد الصفحات
"""
import json, os, re, sys, html, datetime, urllib.request
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://attamhid.com'
SB = 'https://ttuelhswxyjbjdnydmns.supabase.co'
SNAP = os.path.join(R, 'tools', 'seo-data.json')
E = lambda x: html.escape(str(x if x is not None else ''), quote=True)

def fetch():
    src = open(os.path.join(R, 'src', 'index.html'), encoding='utf-8').read()
    key = re.search(r"SB_KEY='([^']+)'", src).group(1)
    def get(path):
        rq = urllib.request.Request(SB + '/rest/v1/' + path, headers={'apikey': key, 'Authorization': 'Bearer ' + key})
        return json.load(urllib.request.urlopen(rq, timeout=30))
    sp = get('v60_short_programs?select=id,data&deleted_at=is.null')
    dp = get('programs?select=id,data&id=eq.1000')
    drop = {'k75', 'urlSeen67', 'url', 'trainerEmail', 'trainerSig', 'trainerFid', 'examId', 'links131'}
    sp = [{'id': r['id'], 'data': {k: v for k, v in (r['data'] or {}).items() if k not in drop}} for r in sp if str((r['data'] or {}).get('deleted', '')) not in ('1', 'true', 'True')]
    sp.sort(key=lambda r: str(r['data'].get('start', '')))
    d = dp[0]['data'] if dp else {}
    dip = {'id': '1000', 'name': d.get('name'), 'nameEn': d.get('nameEn'), 'plan': d.get('plan'), 'planEn': d.get('planEn'), 'fee': d.get('fee'), 'hours': d.get('hours'),
           'courses': [{'code': c.get('code'), 'name': c.get('name'), 'nameEn': c.get('nameEn'), 'term': c.get('term'), 'hrs': c.get('hrs', c.get('hours')), 'type': c.get('type')} for c in (d.get('courses') or []) if not c.get('deleted')]}
    nw = get('news?select=id,data')
    news = [r['data'] for r in nw if r.get('data') and str(r['data'].get('deleted', '')) not in ('1', 'true', 'True') and str(r['data'].get('hidden', '')) not in ('1', 'true')]
    data = {'sp': sp, 'dip': dip, 'news': news}
    json.dump(data, open(SNAP, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    return data

KIND = {'prg': ('برنامج', 'Programme'), 'crs': ('دورة', 'Course'), 'ws': ('ورشة عمل', 'Workshop'), 'wsh': ('ورشة عمل', 'Workshop'), 'lec': ('محاضرة', 'Lecture'), 'sem': ('ندوة', 'Seminar'), 'conf': ('ملتقى', 'Forum')}
CERT = {'att': ('شهادة حضور', 'Certificate of Attendance'), 'par': ('شهادة مشاركة', 'Certificate of Participation'), 'cmp': ('شهادة إتمام', 'Certificate of Completion')}
AR_M = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
EN_M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

def tzs(P):
    try: off = -int(P.get('tzOff', -180))
    except Exception: off = 180
    return ('+' if off >= 0 else '-') + '%02d:%02d' % (abs(off) // 60, abs(off) % 60)
def iso(x, P):
    x = str(x or '')
    if not x: return ''
    if len(x) == 10: return x
    return x[:16] + ':00' + tzs(P)
def dt(x):
    try: return datetime.datetime.strptime(str(x)[:16], '%Y-%m-%dT%H:%M')
    except Exception:
        try: return datetime.datetime.strptime(str(x)[:10], '%Y-%m-%d')
        except Exception: return None
def dAr(d): return '%d %s %d' % (d.day, AR_M[d.month - 1], d.year) if d else ''
def dEn(d): return '%d %s %d' % (d.day, EN_M[d.month - 1], d.year) if d else ''
def tm(d): return '' if not d or (d.hour == 0 and d.minute == 0) or (d.hour == 23 and d.minute == 59) else '%02d:%02d' % (d.hour, d.minute)
def status(P, now):
    s, e = dt(P.get('start')), dt(P.get('end') or P.get('start'))
    if e and (e if tm(e) else e.replace(hour=23, minute=59)) < now: return 'past'
    if s and s <= now: return 'live'
    return 'soon'

CSS = """*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;font-family:'IBM Plex Sans Arabic',system-ui,sans-serif;background:#F6F8FA;color:#14284B;line-height:1.8}
a{color:#1f4c8f}header{background:#fff;border-bottom:1px solid #dfe4ec}.w{max-width:960px;margin:0 auto;padding:0 16px}header .w{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:10px;padding-bottom:10px;flex-wrap:wrap}
header img{height:44px;width:auto}nav a{margin-inline-start:14px;text-decoration:none;font-weight:600;color:#14284B}main{padding:22px 0 40px}.card{background:#fff;border:1px solid #dfe4ec;border-radius:14px;padding:20px;margin:0 0 16px}
h1{font-size:1.6rem;line-height:1.5;margin:.2em 0 .4em}h2{font-size:1.2rem;margin:1.2em 0 .5em}.mu{color:#5b6b82}.tag{display:inline-block;background:#eef2f8;border-radius:999px;padding:2px 10px;font-size:.85rem;margin:0 0 6px 6px}
.tag.ok{background:#e6f4ea;color:#1c6b33}.tag.wn{background:#fdf3e1;color:#7a5200}dl{display:grid;grid-template-columns:max-content 1fr;gap:6px 16px;margin:12px 0}dt{color:#5b6b82}dd{margin:0;font-weight:600}
.btn{display:inline-block;background:#14284B;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:700;margin:6px 0 0 8px}.btn.s{background:#fff;color:#14284B;border:1px solid #14284B}
table{width:100%;border-collapse:collapse;font-size:.95rem}th,td{padding:8px;border-bottom:1px solid #edf0f5;text-align:start}th{color:#5b6b82;font-weight:600}.en{direction:ltr;text-align:left;font-family:system-ui,sans-serif}
.list a.it{display:block;text-decoration:none;color:inherit}.list .it h3{margin:.1em 0;font-size:1.05rem}footer{border-top:1px solid #dfe4ec;padding:18px 0;color:#5b6b82;font-size:.9rem;background:#fff}
@media (max-width:560px){dl{grid-template-columns:1fr}dt{margin-top:6px}h1{font-size:1.35rem}nav a{margin-inline-start:10px;font-size:.95rem}}"""

# v231: سياسة أمان محتوى صارمة لكل صفحة ثابتة (الحد الممكن عبر meta دون ترويسات خادم) ومنع التضمين في إطارات
FB_JS = "if(self===top){var a=document.getElementById('afc');if(a)a.parentNode.removeChild(a)}else{try{top.location.replace(self.location.href)}catch(e){}}"
FB_SHA = __import__('base64').b64encode(__import__('hashlib').sha256(FB_JS.encode()).digest()).decode()
CSP_STATIC = ("default-src 'none'; script-src 'sha256-%s'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; "
              "img-src 'self' data: https:; connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'; frame-src 'none'; upgrade-insecure-requests") % FB_SHA
SEC_HEAD = ('<meta http-equiv="Content-Security-Policy" content="%s"><meta name="referrer" content="strict-origin-when-cross-origin">'
            '<style id="afc">html{display:none!important}</style><noscript><style>html{display:block!important}</style></noscript><script>%s</script>') % (CSP_STATIC, FB_JS)

def redirect_page(src, dst):
    """صفحة تحويل ثابتة لرابط قديم مهم: canonical إلى الرابط الجديد، وnoindex، وتحويل فوري"""
    u = SITE + dst
    return ('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' + SEC_HEAD +
            '<meta name="robots" content="noindex,follow"><link rel="canonical" href="%s"><meta http-equiv="refresh" content="0;url=%s">'
            '<title>نُقلت الصفحة | معهد التمهيد</title></head><body><p>نُقلت هذه الصفحة إلى <a href="%s">%s</a>.</p></body></html>') % (E(u), E(dst), E(dst), E(u))

# روابط قديمة مهمة (صفحات برامج قصيرة سابقة ونسخة قديمة للصفحة الرئيسية) تُحوَّل إلى مكانها الحالي
REDIRECTS = {
    '/index.html.html': '/',
    '/programs/SP-L1792335113821.html': '/programs/', '/programs/SP-L1792350463325.html': '/programs/',
    '/programs/SP-L1792350602852.html': '/programs/', '/programs/SP-L1792416682327.html': '/programs/',
    '/programs/SP-L1792476038696.html': '/programs/', '/programs/SP-L1792873323937.html': '/programs/',
    '/programs/SP-mw7fxy76vcq3.html': '/programs/',
}

def page(path, title, desc, body, ld, en_title=''):
    url = SITE + path
    return ('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' + SEC_HEAD + '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>%s</title><meta name="description" content="%s"><link rel="canonical" href="%s">'
        '<meta property="og:type" content="website"><meta property="og:site_name" content="معهد التمهيد — At Tamhid Institute"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:url" content="%s"><meta property="og:image" content="%s/img/app-512-v132.png"><meta property="og:locale" content="ar_AR"><meta property="og:locale:alternate" content="en_US">'
        '<meta name="theme-color" content="#14284B"><link rel="icon" href="/img/favicon-512aae70.png"><link rel="manifest" href="/manifest.webmanifest">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">'
        '<style>%s</style><script type="application/ld+json">%s</script></head><body>'
        '<header><div class="w"><a href="/" aria-label="معهد التمهيد"><img src="/img/logo-a8d46018.webp" alt="معهد التمهيد — At Tamhid Institute" width="163" height="44"></a>'
        '<nav><a href="/">الرئيسية</a><a href="/programs/">البرامج</a><a href="/news/">الأخبار</a><a href="/#/register">التقديم</a><a href="/#/verify">التحقق من وثيقة</a></nav></div></header>'
        '<main class="w">%s</main><footer><div class="w"><p><a href="/student-services/">الخدمات الذاتية للطلاب والطالبات</a> · <a href="/faculty-services/">الخدمات الذاتية لأعضاء هيئة التدريس</a> · <a href="/training/">بوابة التدريب</a> · <a href="/graduates/">بوابة الخريجين</a></p>© %d معهد التمهيد — At Tamhid Institute (ATI) · <a href="/">attamhid.com</a></div></footer></body></html>') % (
        E(title), E(desc), E(url), E(title), E(desc), E(url), SITE, CSS, json.dumps(ld, ensure_ascii=False).replace('</', '<\\/'), body, datetime.date.today().year)

ORG = {'@type': 'EducationalOrganization', 'name': 'معهد التمهيد', 'alternateName': ['At Tamhid Institute', 'ATI', 'আত তামহীদ ইনস্টিটিউট'], 'url': SITE + '/', 'logo': SITE + '/img/app-512-v132.png', 'address': {'@type': 'PostalAddress', 'addressCountry': 'BD'}}

def sp_page(P, now):
    pid = P['id']; path = '/programs/%s.html' % pid
    k = KIND.get(P.get('kind'), ('برنامج', 'Programme')); c = CERT.get(P.get('ctype'))
    s, e = dt(P.get('start')), dt(P.get('end') or P.get('start')); st = status(P, now)
    same = s and e and s.date() == e.date()
    when_ar = dAr(s) + ('' if same or not e else ' – ' + dAr(e)) + ((' · من الساعة ' + tm(s) + ((' إلى ' + tm(e)) if tm(e) and same else '')) if tm(s) else '')
    when_en = dEn(s) + ('' if same or not e else ' – ' + dEn(e)) + ((' · ' + tm(s) + (('–' + tm(e)) if tm(e) and same else '')) if tm(s) else '')
    remote = P.get('mode') == 'remote'
    where_ar = 'عن بُعد (أونلاين)' if remote else (P.get('place') or 'حضوري في المعهد')
    where_en = 'Online' if remote else (P.get('place') or 'On campus')
    tr_ar = ((P.get('trainerTitleAr') or '') + ': ' if P.get('trainerTitleAr') else '') + (P.get('trainerAr') or '')
    tr_en = P.get('trainerEn') or ''
    fee = P.get('fee') or ''
    free = bool(fee) and ('مجان' in fee or fee.strip().lower() in ('free', '0'))
    paid = bool(fee) and not free
    can_reg = st != 'past' and str(P.get('selfReg', 1)) != '0'
    stt = {'soon': ('<span class="tag ok">التسجيل متاح</span>' if can_reg else '<span class="tag">قادم</span>'), 'live': '<span class="tag wn">جارٍ الآن</span>', 'past': '<span class="tag">انعقد</span>'}[st]
    nameAr, nameEn = P.get('nameAr') or '', P.get('nameEn') or ''
    desc = '%s «%s» في معهد التمهيد — %s، %s%s.' % (k[0], nameAr, when_ar, where_ar, ('، مع ' + tr_ar) if P.get('trainerAr') else '')
    rows = [('النوع', k[0]), ('الموعد', when_ar), ('المدة', ('%s ساعة' % P.get('hours')) if P.get('hours') else ''), ('المكان', where_ar), (P.get('trainerTitleAr') or 'المدرب', P.get('trainerAr') or ''), ('الموضوع', P.get('topicAr') or ''), ('الرسوم', 'مجاني' if free else (fee if paid else '')), ('الشهادة', c[0] if c else ''), ('الفئة', 'مفتوح للجميع' if P.get('aud') == 'public' else 'لطلاب المعهد')]
    rows_en = [('Type', k[1]), ('Date', when_en), ('Duration', ('%s hours' % P.get('hours')) if P.get('hours') else ''), ('Venue', where_en), (P.get('trainerTitleEn') or 'Trainer', tr_en), ('Topic', P.get('topicEn') or ''), ('Fee', 'Free' if free else ''), ('Certificate', c[1] if c else ''), ('Audience', 'Open to all' if P.get('aud') == 'public' else 'Institute students')]
    dl = lambda R: '<dl>' + ''.join('<dt>%s</dt><dd>%s</dd>' % (E(a), E(b)) for a, b in R if b) + '</dl>'
    cta = ('<a class="btn" href="/#/sp/%s">سجّل الآن</a>' % E(pid)) if can_reg else '<a class="btn s" href="/programs/">برامج أخرى</a>'
    body = ('<p class="mu"><a href="/programs/">البرامج</a> › %s</p><article class="card"><div>%s<span class="tag">%s</span></div><h1>%s</h1>%s%s%s</article>' % (
        E(k[0]), stt, E(k[0]), E(nameAr), ('<p class="mu">' + E(P.get('parentAr')) + '</p>') if P.get('parentAr') else '', dl(rows), cta))
    if nameEn:
        body += '<section class="card en" lang="en"><h2>%s</h2>%s%s%s</section>' % (E(nameEn), ('<p class="mu">' + E(P.get('parentEn')) + '</p>') if P.get('parentEn') else '', dl(rows_en), ('<a class="btn" href="/#/sp/%s">Register now</a>' % E(pid)) if can_reg else '')
    inst = {'@type': 'CourseInstance', 'courseMode': 'online' if remote else 'onsite', 'startDate': iso(P.get('start'), P), 'endDate': iso(P.get('end') or P.get('start'), P)}
    if P.get('trainerAr') or tr_en: inst['instructor'] = {'@type': 'Person', 'name': tr_en or P.get('trainerAr')}
    if not remote: inst['location'] = {'@type': 'Place', 'name': P.get('place') or 'معهد التمهيد', 'address': {'@type': 'PostalAddress', 'addressCountry': 'BD'}}
    if P.get('hours'): inst['courseWorkload'] = 'PT%sH' % re.sub(r'\D', '', str(P.get('hours'))) if re.sub(r'\D', '', str(P.get('hours'))) else None
    inst = {a: b for a, b in inst.items() if b}
    ld = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'Course', 'name': nameAr, 'alternateName': nameEn or None, 'description': desc, 'url': SITE + path, 'inLanguage': 'ar', 'provider': ORG, 'hasCourseInstance': [inst],
         'offers': {'@type': 'Offer', 'category': 'Free' if free else ('Paid' if paid else None), 'price': 0 if free else None, 'priceCurrency': 'BDT' if free else None, 'url': SITE + '/#/sp/' + pid}},
        {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'معهد التمهيد', 'item': SITE + '/'}, {'@type': 'ListItem', 'position': 2, 'name': 'البرامج', 'item': SITE + '/programs/'}, {'@type': 'ListItem', 'position': 3, 'name': nameAr}]}]}
    ld['@graph'][0]['offers'] = {a: b for a, b in ld['@graph'][0]['offers'].items() if b is not None}
    ld['@graph'][0] = {a: b for a, b in ld['@graph'][0].items() if b is not None}
    # v161: عقدة «فعالية» ليظهر البرنامج بتاريخه في نتائج Google وقسم الفعاليات
    if P.get('start'):
        ev = {'@type': 'EducationEvent', 'name': nameAr, 'alternateName': nameEn or None, 'description': desc, 'url': SITE + path, 'inLanguage': 'ar',
              'startDate': iso(P.get('start'), P), 'endDate': iso(P.get('end') or P.get('start'), P),
              'eventStatus': 'https://schema.org/EventScheduled',
              'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode' if remote else 'https://schema.org/OfflineEventAttendanceMode',
              'location': {'@type': 'VirtualLocation', 'url': SITE + '/#/sp/' + pid} if remote else {'@type': 'Place', 'name': P.get('place') or 'معهد التمهيد', 'address': {'@type': 'PostalAddress', 'addressCountry': 'BD'}},
              'organizer': {'@type': 'EducationalOrganization', 'name': 'معهد التمهيد', 'alternateName': 'At Tamhid Institute', 'url': SITE + '/'},
              'performer': {'@type': 'Person', 'name': tr_en or P.get('trainerAr')} if (P.get('trainerAr') or tr_en) else None,
              'image': [u for u in [P.get('annImg'), P.get('annImgEn')] if isinstance(u, str) and u.startswith('https://')] or [SITE + '/img/app-512-v132.png'],
              'isAccessibleForFree': True if free else None,
              'offers': {'@type': 'Offer', 'url': SITE + '/#/sp/' + pid, 'price': 0, 'priceCurrency': 'BDT', 'availability': 'https://schema.org/InStock' if can_reg else 'https://schema.org/SoldOut', 'validFrom': iso(P.get('annAt') or P.get('start'), P)[:10] or None} if free else None}
        if ev['offers']: ev['offers'] = {a: b for a, b in ev['offers'].items() if b is not None}
        ld['@graph'].insert(1, {a: b for a, b in ev.items() if b is not None})
    title = '%s — %s | معهد التمهيد' % (nameAr, k[0])
    return path, page(path, title, desc, body, ld)

def dip_page(D):
    path = '/programs/diploma.html'
    name = 'دبلوم عام في اللغة العربية لغير الناطقين بها'
    C = D.get('courses') or []; lv = {}
    for c in C: lv.setdefault(str(c.get('term') or '1'), []).append(c)
    tot = sum(int(re.sub(r'\D', '', str(c.get('hrs') or 0)) or 0) for c in C) or D.get('hours')
    LN = {'1': 'المستوى الأول', '2': 'المستوى الثاني', '3': 'المستوى الثالث', '4': 'المستوى الرابع'}
    LE = {'1': 'Level 1', '2': 'Level 2', '3': 'Level 3', '4': 'Level 4'}
    desc = 'دبلوم عام في اللغة العربية لغير الناطقين بها في معهد التمهيد ببنغلاديش: لمدة سنتين في أربعة فصول دراسية و%s ساعة معتمدة، يجمع مهارات اللغة العربية والعلوم الشرعية.' % tot
    body = ('<p class="mu"><a href="/programs/">البرامج</a> › الدبلوم العام</p><article class="card"><span class="tag ok">البرنامج الرئيس</span><h1>%s</h1>'
            '<p>برنامج تأسيسي متكامل لغير الناطقين بالعربية، يبني مهارات القراءة والكتابة والاستماع والمحادثة والنحو والصرف والمعجم والبلاغة والترجمة، مع مقررات في القرآن الكريم والحديث والفقه والعقيدة والسيرة، وينتهي بمشروع تخرج وتدريب ميداني.</p>'
            '<dl><dt>المدة</dt><dd>سنتان (أربعة فصول دراسية)</dd><dt>الساعات المعتمدة</dt><dd>%s ساعة</dd><dt>لغة الدراسة</dt><dd>العربية</dd>%s<dt>الشهادة</dt><dd>درجة دبلوم عام في اللغة العربية لغير الناطقين بها</dd></dl>'
            '<a class="btn" href="/#/register">قدّم طلب الالتحاق</a><a class="btn s" href="/#/programs">تفاصيل أكثر على الموقع</a></article>') % (E(name), E(tot), '<dt>المنح الدراسية</dt><dd>من 20% إلى 100% بحسب استيفاء الشروط</dd>')
    body += '<section class="card"><h2>الخطة الدراسية</h2>'
    for k in sorted(lv):
        h = sum(int(re.sub(r'\D', '', str(c.get('hrs') or 0)) or 0) for c in lv[k])
        body += '<h3>%s <small class="mu">(%s ساعة)</small></h3><table><tr><th>الرمز</th><th>المقرر</th><th>الساعات</th></tr>%s</table>' % (E(LN.get(k, 'المستوى ' + k)), h, ''.join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % (E(c.get('code')), E(c.get('name')), E(c.get('hrs'))) for c in lv[k]))
    body += '</section><section class="card en" lang="en"><h2>Diploma in Arabic for Non-Native Speakers</h2><p>A two-year foundation programme (four semesters, %s credit hours) that builds reading, writing, listening, speaking, grammar, morphology, lexicography, rhetoric and translation in Arabic, alongside courses in the Qur’an, Hadith, Fiqh, Creed and Seerah, ending with a graduation project and field training.</p>' % E(tot)
    for k in sorted(lv):
        body += '<h3>%s</h3><p class="mu">%s</p>' % (LE.get(k, 'Level ' + k), E(', '.join(c.get('nameEn') or '' for c in lv[k])))
    body += '<a class="btn" href="/#/register">Apply now</a></section>'
    ld = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'Course', 'name': name, 'alternateName': 'Diploma in Arabic for Non-Native Speakers', 'description': desc, 'url': SITE + path, 'inLanguage': 'ar', 'provider': ORG,
         'educationalCredentialAwarded': 'دبلوم عام في اللغة العربية لغير الناطقين بها', 'numberOfCredits': tot, 'timeRequired': 'P2Y',
         'hasCourseInstance': [{'@type': 'CourseInstance', 'courseMode': 'onsite', 'courseSchedule': {'@type': 'Schedule', 'duration': 'P2Y', 'repeatFrequency': 'P6M', 'repeatCount': 4}}],
         'offers': {'@type': 'Offer', 'category': 'Paid', 'url': SITE + '/#/register'}, 'hasPart': [{'@type': 'Course', 'courseCode': str(c.get('code') or ''), 'name': c.get('name') or '', 'alternateName': c.get('nameEn') or None, 'numberOfCredits': c.get('hrs'), 'inLanguage': 'ar', 'provider': {'@type': 'EducationalOrganization', 'name': 'معهد التمهيد', 'url': SITE + '/'}} for c in C], 'syllabusSections': [{'@type': 'Syllabus', 'name': LN.get(k, k), 'description': '، '.join(c.get('name') or '' for c in lv[k])} for k in sorted(lv)]},
        {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'معهد التمهيد', 'item': SITE + '/'}, {'@type': 'ListItem', 'position': 2, 'name': 'البرامج', 'item': SITE + '/programs/'}, {'@type': 'ListItem', 'position': 3, 'name': 'الدبلوم العام'}]}]}
    return path, page(path, name + ' | معهد التمهيد', desc, body, ld)

def index_page(D, SP, now):
    path = '/programs/'
    up = [P for P in SP if status(P, now) != 'past']; past = [P for P in SP if status(P, now) == 'past'][::-1]
    def item(P):
        k = KIND.get(P.get('kind'), ('برنامج', 'Programme')); s = dt(P.get('start'))
        return '<a class="it card" href="/programs/%s.html"><span class="tag">%s</span><h3>%s</h3><span class="mu">%s%s</span></a>' % (E(P['id']), E(k[0]), E(P.get('nameAr')), E(dAr(s)), (' · ' + E(P.get('trainerAr'))) if P.get('trainerAr') else '')
    body = ('<h1>البرامج والدورات في معهد التمهيد</h1><p class="mu">دبلوم عام في اللغة العربية لغير الناطقين بها، وبرامج قصيرة ودورات وورش عمل في اللغة العربية والعلوم الشرعية والبحث العلمي.</p>'
            '<div class="list"><a class="it card" href="/programs/diploma.html"><span class="tag ok">البرنامج الرئيس</span><h3>دبلوم عام في اللغة العربية لغير الناطقين بها</h3><span class="mu">سنتان · أربعة فصول دراسية · %s ساعة معتمدة</span></a></div>') % E(D.get('hours') or 84)
    body += '<h2>البرامج القصيرة القادمة</h2><div class="list">%s</div>' % (''.join(item(P) for P in up) or '<p class="mu">تُعلن البرامج القادمة قريباً.</p>')
    if past: body += '<h2>برامج انعقدت</h2><div class="list">%s</div>' % ''.join(item(P) for P in past)
    ld = {'@context': 'https://schema.org', '@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': SITE + u} for i, u in enumerate(['/programs/diploma.html'] + ['/programs/%s.html' % P['id'] for P in up + past])]}
    return path, page(path, 'البرامج والدورات | معهد التمهيد — At Tamhid Institute', 'برامج معهد التمهيد: دبلوم عام في اللغة العربية لغير الناطقين بها، وبرامج قصيرة ودورات وورش عمل.', body, ld)

def news_pages(N):
    out = []; N = sorted(N, key=lambda n: str(n.get('date') or ''), reverse=True)
    for n in N:
        nid = re.sub(r'[^A-Za-z0-9_-]', '', str(n.get('id') or ''))
        if not nid: continue
        path = '/news/%s.html' % nid; t = n.get('title') or 'خبر'; body = str(n.get('body') or '')
        d = dt(n.get('date')); desc = re.sub(r'\s+', ' ', body)[:155]
        paras = ''.join('<p>%s</p>' % E(x) for x in re.split(r'\n+', body) if x.strip())
        en = ('<section class="card en" lang="en"><h2>%s</h2>%s</section>' % (E(n.get('titleEn')), ''.join('<p>%s</p>' % E(x) for x in re.split(r'\n+', str(n.get('bodyEn') or '')) if x.strip()))) if n.get('titleEn') else ''
        img = n.get('img') if str(n.get('img') or '').startswith('http') else ''
        bd = '<p class="mu"><a href="/news/">الأخبار</a> › %s</p><article class="card"><span class="tag">%s</span> <span class="mu">%s</span><h1>%s</h1>%s%s<a class="btn s" href="/#/news">كل الأخبار على الموقع</a></article>%s' % (E(t[:60]), E(n.get('type') or 'خبر'), E(dAr(d)), E(t), ('<img src="%s" alt="" style="max-width:100%%;border-radius:10px">' % E(img)) if img else '', paras, en)
        ld = {'@context': 'https://schema.org', '@type': 'NewsArticle', 'headline': t[:110], 'datePublished': str(n.get('date') or '')[:10], 'inLanguage': 'ar', 'publisher': ORG, 'author': ORG, 'mainEntityOfPage': SITE + path, 'description': desc}
        if img: ld['image'] = [img]
        out.append((path, page(path, t + ' | أخبار معهد التمهيد', desc, bd, ld), n))
    items = ''.join('<a class="it card" href="/news/%s.html"><span class="tag">%s</span><h3>%s</h3><span class="mu">%s</span></a>' % (E(re.sub(r'[^A-Za-z0-9_-]', '', str(n.get('id')))), E(n.get('type') or 'خبر'), E(n.get('title')), E(dAr(dt(n.get('date'))))) for n in N)
    idx = ('/news/', page('/news/', 'أخبار معهد التمهيد — At Tamhid Institute', 'آخر أخبار معهد التمهيد وإعلاناته وفعالياته.', '<h1>أخبار معهد التمهيد</h1><div class="list">%s</div>' % (items or '<p class="mu">لا أخبار بعد.</p>'), {'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': 'أخبار معهد التمهيد', 'url': SITE + '/news/'}), None)
    return [idx] + out

# ---------------------------------------------------------------------------
# v227 — صفحات عامة ثابتة لكل بوابة وخدماتها بالعربية والإنجليزية والبنغالية (قابلة للفهرسة)
# ---------------------------------------------------------------------------
PORTALS = [
 ('student-services', '/#/student',
  ('الخدمات الذاتية للطلاب والطالبات', 'Student Self-Service', 'Student Self-Service'),
  ('خدمات الطلاب والطالبات في معهد التمهيد في مكان واحد: التسجيل والجداول، والدرجات والسجل الأكاديمي، والإرشاد الأكاديمي، والطلبات والوثائق.',
   'Services for At Tamhid Institute students in one place: registration and timetables, grades and academic record, academic advising, and requests and documents.',
   'আত তামহীদ ইনস্টিটিউটের শিক্ষার্থীদের সেবা এক জায়গায়: নিবন্ধন ও সময়সূচি, ফলাফল ও একাডেমিক রেকর্ড, একাডেমিক পরামর্শ, এবং আবেদন ও নথিপত্র।'),
  [('التسجيل والجداول', 'Registration & timetables', 'নিবন্ধন ও সময়সূচি'),
   ('الدرجات والسجل الأكاديمي', 'Grades & academic record', 'ফলাফল ও একাডেমিক রেকর্ড'),
   ('الإرشاد الأكاديمي', 'Academic advising', 'একাডেমিক পরামর্শ'),
   ('الاختبارات ومواعيدها', 'Exams & schedules', 'পরীক্ষা ও সময়সূচি'),
   ('الكفاية والانتقال والتخرج', 'Proficiency, progression & graduation', 'দক্ষতা, অগ্রগতি ও স্নাতক'),
   ('الطلبات والوثائق', 'Requests & documents', 'আবেদন ও নথিপত্র')]),
 ('faculty-services', '/#/fp',
  ('الخدمات الذاتية لأعضاء هيئة التدريس', 'Faculty Self-Service', 'Faculty Self-Service'),
  ('خدمات أعضاء هيئة التدريس في معهد التمهيد: المقررات والشعب، والجداول، وإدخال الدرجات، والحضور، والطلبات والوثائق.',
   'Services for At Tamhid Institute faculty: courses and sections, timetables, grade entry, attendance, and requests and documents.',
   'আত তামহীদ ইনস্টিটিউটের শিক্ষকদের সেবা: কোর্স ও সেকশন, সময়সূচি, নম্বর প্রদান, উপস্থিতি, এবং আবেদন ও নথিপত্র।'),
  [('المقررات والشعب', 'Courses & sections', 'কোর্স ও সেকশন'),
   ('الجدول التدريسي', 'Teaching timetable', 'পাঠদানের সময়সূচি'),
   ('إدخال الدرجات', 'Grade entry', 'নম্বর প্রদান'),
   ('الحضور والغياب', 'Attendance', 'উপস্থিতি'),
   ('الطلبات والوثائق', 'Requests & documents', 'আবেদন ও নথিপত্র')]),
 ('training', '/#/training',
  ('بوابة التدريب', 'Training Portal', 'Training Portal'),
  ('بوابة التدريب في معهد التمهيد: حساب واحد للتسجيل في البرامج القصيرة والدورات وورش العمل بضغطة واحدة، والحصول على الشهادات فور صدورها.',
   'The At Tamhid Institute Training Portal: one account to register for short programmes, courses and workshops in one click, and to receive certificates as soon as they are issued.',
   'আত তামহীদ ইনস্টিটিউটের Training Portal: একটি অ্যাকাউন্টে এক ক্লিকে স্বল্পমেয়াদি প্রোগ্রাম, কোর্স ও কর্মশালায় নিবন্ধন, এবং প্রকাশের সঙ্গে সঙ্গে সনদ গ্রহণ।'),
  [('البرامج القصيرة والدورات وورش العمل', 'Short programmes, courses & workshops', 'স্বল্পমেয়াদি প্রোগ্রাম, কোর্স ও কর্মশালা'),
   ('التسجيل بضغطة واحدة', 'One-click registration', 'এক ক্লিকে নিবন্ধন'),
   ('الشهادات', 'Certificates', 'সনদ')]),
 ('graduates', '/#/graduates',
  ('بوابة الخريجين', 'Graduates Portal', 'Graduates Portal'),
  ('بوابة الخريجين في معهد التمهيد: التدريب الميداني ونماذجه، ومشروع التخرج ونماذجه، وخدمات التخرج، والتحقق من الوثائق برمز QR، وسجل المرشحين.',
   'The At Tamhid Institute Graduates Portal: field training and its forms, the graduation project and its forms, graduation services, QR document verification, and the candidates register.',
   'আত তামহীদ ইনস্টিটিউটের Graduates Portal: মাঠ প্রশিক্ষণ ও এর ফরম, স্নাতক প্রকল্প ও এর ফরম, স্নাতক সেবা, QR কোডে নথি যাচাই, এবং প্রার্থী তালিকা।'),
  [('التدريب الميداني (النماذج ت-1 إلى ت-18)', 'Field training (forms T-1 to T-18)', 'মাঠ প্রশিক্ষণ (ফরম T-1 থেকে T-18)'),
   ('مشروع التخرج (النماذج م-1 إلى م-10)', 'Graduation project (forms P-1 to P-10)', 'স্নাতক প্রকল্প (ফরম P-1 থেকে P-10)'),
   ('خدمات التخرج', 'Graduation services', 'স্নাতক সেবা'),
   ('التحقق من الوثائق برمز QR', 'QR document verification', 'QR কোডে নথি যাচাই'),
   ('سجل المرشحين', 'Candidates register', 'প্রার্থী তালিকা')]),
]
PL = {'ar': ('ar', 'rtl', 0, '', 'ar_AR'), 'en': ('en', 'ltr', 1, '/en', 'en_US'), 'bn': ('bn', 'ltr', 2, '/bn', 'bn_BD')}
UI = {'home': ('الرئيسية', 'Home', 'হোম'), 'prog': ('البرامج', 'Programmes', 'প্রোগ্রাম'), 'news': ('الأخبار', 'News', 'সংবাদ'),
      'svc': ('الخدمات', 'Services', 'সেবাসমূহ'), 'enter': ('الدخول إلى الخدمة', 'Sign in to the service', 'সেবায় প্রবেশ করুন'),
      'others': ('خدمات أخرى في المعهد', 'Other institute services', 'ইনস্টিটিউটের অন্যান্য সেবা'), 'verify': ('التحقق من وثيقة', 'Verify a document', 'নথি যাচাই'),
      'inst': ('معهد التمهيد', 'At Tamhid Institute', 'আত তামহীদ ইনস্টিটিউট')}

def portal_page(P, lang):
    slug, app, names, descs, svcs = P
    lg, dr, i, pre, loc = PL[lang]
    path = pre + '/' + slug + '/'; url = SITE + path; nm = names[i]; desc = descs[i]
    alt = ''.join('<link rel="alternate" hreflang="%s" href="%s%s/%s/">' % (k, SITE, PL[k][3], slug) for k in ('ar', 'en', 'bn')) + '<link rel="alternate" hreflang="x-default" href="%s/%s/">' % (SITE, slug)
    ln = ' · '.join('<a href="%s%s/%s/" lang="%s" hreflang="%s"%s>%s</a>' % (SITE, PL[k][3], slug, k, k, ' aria-current="true"' if k == lang else '', {'ar': 'العربية', 'en': 'English', 'bn': 'বাংলা'}[k]) for k in ('ar', 'en', 'bn'))
    oth = ''.join('<li><a href="%s/%s/">%s</a></li>' % (pre, Q[0], E(Q[2][i])) for Q in PORTALS if Q[0] != slug)
    body = ('<nav class="mu" aria-label="breadcrumb"><a href="/">%s</a> › %s</nav><article class="card"><h1>%s</h1><p>%s</p><h2>%s</h2><ul>%s</ul>'
            '<a class="btn" href="%s">%s</a></article><section class="card"><h2>%s</h2><ul>%s<li><a href="/#/verify">%s</a></li><li><a href="/programs/">%s</a></li></ul><p class="mu">%s</p></section>') % (
        E(UI['inst'][i]), E(nm), E(nm), E(desc), E(UI['svc'][i]), ''.join('<li>%s</li>' % E(s[i]) for s in svcs), app, E(UI['enter'][i]),
        E(UI['others'][i]), oth, E(UI['verify'][i]), E(UI['prog'][i]), ln)
    ld = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'WebPage', '@id': url, 'url': url, 'name': nm, 'description': desc, 'inLanguage': lg, 'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@id': SITE + '/#org'},
         'potentialAction': {'@type': 'Action', 'name': UI['enter'][i], 'target': SITE + app}},
        {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': UI['inst'][i], 'item': SITE + '/'}, {'@type': 'ListItem', 'position': 2, 'name': nm, 'item': url}]},
        dict(ORG, **{'@id': SITE + '/#org'}), {'@type': 'WebSite', '@id': SITE + '/#website', 'url': SITE + '/', 'name': 'معهد التمهيد', 'alternateName': 'At Tamhid Institute', 'inLanguage': ['ar', 'en', 'bn']}]}
    title = '%s | %s' % (nm, 'معهد التمهيد — At Tamhid Institute' if lang == 'ar' else 'At Tamhid Institute — معهد التمهيد')
    h = page(path, title, desc, body, ld)
    h = h.replace('<html lang="ar" dir="rtl">', '<html lang="%s" dir="%s">' % (lg, dr), 1).replace('<link rel="canonical"', alt + '<link rel="canonical"', 1)
    h = h.replace('<meta name="theme-color"', '<meta property="og:locale" content="%s"><meta property="og:image" content="%s/img/app-512-v132.png"><meta name="theme-color"' % (loc, SITE), 1)
    if lang != 'ar':
        h = h.replace('<nav><a href="/">الرئيسية</a><a href="/programs/">البرامج</a><a href="/news/">الأخبار</a><a href="/#/register">التقديم</a><a href="/#/verify">التحقق من وثيقة</a></nav>',
                      '<nav><a href="/">%s</a><a href="/programs/">%s</a><a href="/news/">%s</a><a href="/#/verify">%s</a></nav>' % (E(UI['home'][i]), E(UI['prog'][i]), E(UI['news'][i]), E(UI['verify'][i])), 1)
        h = h.replace("font-family:'IBM Plex Sans Arabic',system-ui,sans-serif", "font-family:system-ui,'Noto Sans Bengali','IBM Plex Sans Arabic',sans-serif", 1)
    if lang != 'ar':
        for a, b in (('الخدمات الذاتية للطلاب والطالبات', 'Student Self-Service'), ('الخدمات الذاتية لأعضاء هيئة التدريس', 'Faculty Self-Service'), ('>بوابة التدريب<', '>Training Portal<'), ('>بوابة الخريجين<', '>Graduates Portal<')):
            h = h.replace(a, b) if a.startswith('>') else h.replace('>' + a + '</a> ·', '>' + b + '</a> ·', 1)
        h = h.replace('href="/student-services/"', 'href="%s/student-services/"' % pre).replace('href="/faculty-services/"', 'href="%s/faculty-services/"' % pre).replace('href="/training/"', 'href="%s/training/"' % pre).replace('href="/graduates/"', 'href="%s/graduates/"' % pre)
    return path, h

def portal_pages():
    return [portal_page(P, l) for P in PORTALS for l in ('ar', 'en', 'bn')]

def main():
    data = fetch() if '--fetch' in sys.argv else json.load(open(SNAP, encoding='utf-8'))
    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None) + datetime.timedelta(hours=3)
    SP = [dict(r['data'], id=r['id']) for r in data.get('sp', []) if r.get('data')]
    out = os.path.join(R, 'programs'); os.makedirs(out, exist_ok=True)
    pages = [index_page(data['dip'], SP, now), dip_page(data['dip'])] + [sp_page(P, now) for P in SP]
    NP = news_pages(data.get('news') or [])
    os.makedirs(os.path.join(R, 'news'), exist_ok=True)
    pages = pages + [(a, b) for a, b, c in NP]
    PP = portal_pages()
    for a, b in PP: os.makedirs(os.path.join(R, a.strip('/')), exist_ok=True)
    pages = pages + PP
    have = {a for a, b in pages}
    pages = pages + [(a, redirect_page(a, b)) for a, b in REDIRECTS.items() if a not in have]
    keep = set()
    for path, h in pages:
        fn = os.path.join(R, path.strip('/'), 'index.html') if path.endswith('/') else os.path.join(R, path.strip('/'))
        keep.add(os.path.abspath(fn)); old = open(fn, encoding='utf-8').read() if os.path.exists(fn) else None
        if old != h: open(fn, 'w', encoding='utf-8').write(h)
    for dd in (out, os.path.join(R, 'news')):
        for f in os.listdir(dd):
            p = os.path.abspath(os.path.join(dd, f))
            if f.endswith('.html') and p not in keep: os.remove(p)
    today = datetime.date.today().isoformat()
    lm = lambda P: str(P.get('u') or P.get('at') or today)[:10]
    urls = [(SITE + '/', today, '1.0'), (SITE + '/programs/', today, '0.9'), (SITE + '/programs/diploma.html', today, '0.9')] + [(SITE + '/programs/%s.html' % P['id'], lm(P), '0.7') for P in SP] + [(SITE + a, str((c or {}).get('date') or today)[:10] if c else today, '0.6') for a, b, c in NP] + [(SITE + a, today, '0.8') for a, b in PP]
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('<url><loc>%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>\n' % (E(u), d, p) for u, d, p in urls) + '</urlset>\n'
    open(os.path.join(R, 'sitemap.xml'), 'w', encoding='utf-8').write(sm)
    open(os.path.join(R, 'robots.txt'), 'w', encoding='utf-8').write('User-agent: *\nAllow: /\nDisallow: /tools/\nDisallow: /supabase/\nDisallow: /src/\n\nSitemap: %s/sitemap.xml\n' % SITE)
    print('seo pages:', len(pages), 'sitemap urls:', len(urls))

if __name__ == '__main__':
    main()

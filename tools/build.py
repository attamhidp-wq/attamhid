#!/usr/bin/env python3
"""يبني index.html الخفيف من src/index.html: تُفصل السكربتات الكبيرة إلى ملفات js/ مستقلة (بالترتيب نفسه)
حتى يخزّنها المتصفح ويعيد استخدامها دون إعادة تحميل أو إعادة تحليل، وتُحمَّل الخطوط دون حجب العرض.
التعديل يكون دائماً في src/index.html ثم: python3 tools/build.py"""
import re, hashlib, json, os, sys, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UG = os.path.join(R, 'tools/uglify/bin/uglifyjs')
CACHE = os.path.join(R, 'tools/.mincache')
os.makedirs(CACHE, exist_ok=True)
def minify(body, h):
    """ضغط آمن: يُبقي الأسماء العامة كما هي (السكربتات تتشارك النطاق العام) ويحافظ على أسماء الدوال"""
    cp = os.path.join(CACHE, h + '.js')
    if os.path.exists(cp):
        return open(cp, encoding='utf-8').read()
    try:
        r = subprocess.run(['node', UG, '-c', 'merge_vars=false', '-m', '--keep-fnames', '--comments', 'false'], input=body.encode('utf-8'), capture_output=True, timeout=600)
        if r.returncode != 0 or not r.stdout:
            print('minify failed', h, r.stderr.decode()[:300]); return body
        out = r.stdout.decode('utf-8')
        open(cp, 'w', encoding='utf-8').write(out)
        return out
    except Exception as e:
        print('minify error', e); return body
src = open(os.path.join(R, 'src/index.html'), encoding='utf-8').read()
MIN = 3000
MINV = 'm2:merge_vars=false;'
LAZY = {'jsqr'}  # تُحمَّل عند الحاجة فقط
files = []
n = [0]
def repl(m):
    attrs, body = m.group(1), m.group(2)
    if re.search(r'\bsrc\s*=', attrs) or len(body.encode()) < MIN or re.search(r'type\s*=\s*"(?!text/javascript)', attrs):
        return m.group(0)
    n[0] += 1
    idm = re.search(r'\bid="([^"]+)"', attrs)
    name = (idm.group(1) if idm else 's%02d' % n[0])
    # MINV: يتغيّر مع تغيّر إعدادات الضغط حتى لا يبقى في ذاكرة المتصفح ملف قديم بالاسم نفسه
    h = hashlib.sha256((MINV + body).encode()).hexdigest()[:10]
    fn = 'js/%s-%s.js' % (re.sub(r'[^A-Za-z0-9_-]', '', name), h)
    with open(os.path.join(R, fn), 'w', encoding='utf-8', newline='') as f:
        f.write(minify(body, h) if '--no-min' not in sys.argv else body)
    files.append(fn)
    if name in LAZY:
        return '<script>window.__%s=%s</script>' % (name.upper(), json.dumps(fn))
    return '<script%s charset="utf-8" src="%s"></script>' % (attrs, fn)
out = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', repl, src)
def crepl(m):
    attrs, body = m.group(1), m.group(2)
    if len(body.encode()) < MIN or 'boot71' in attrs or 'media=' in attrs:
        return m.group(0)
    n[0] += 1
    idm = re.search(r'\bid="([^"]+)"', attrs)
    name = (idm.group(1) if idm else 'c%02d' % n[0])
    body = re.sub(r'/\*[\s\S]*?\*/', '', body)
    h = hashlib.sha256(body.encode()).hexdigest()[:10]
    fn = 'js/%s-%s.css' % (re.sub(r'[^A-Za-z0-9_-]', '', name), h)
    open(os.path.join(R, fn), 'w', encoding='utf-8', newline='').write(body)
    files.append(fn)
    return '<link rel="stylesheet"%s href="%s">' % ((' id="%s"' % idm.group(1)) if idm else '', fn)
out = re.sub(r'<style([^>]*)>([\s\S]*?)</style>', crepl, out)
# الخطوط: لا تحجب العرض
def font(m):
    t = m.group(0)
    if 'fonts.googleapis.com' not in t or 'media=' in t or "'+l.href+'" in t:
        return t
    return t[:-1] + ' media="print" onload="this.media=\'all\'">'
out = re.sub(r'<link[^>]*rel="stylesheet"[^>]*>|<link[^>]*href="https://fonts[^>]*>', font, out, count=0)
if 'rel="preconnect" href="https://fonts.gstatic.com"' not in out:
    out = out.replace('<head>', '<head>\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>\n<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>', 1)
open(os.path.join(R, 'index.html'), 'w', encoding='utf-8', newline='').write(out)
# تنظيف: يبقى ملف البناء الحالي والسابق فقط (حتى لا تنكسر صفحة محفوظة مؤقتاً لدى زائر)
mp = os.path.join(R, 'js/manifest.json')
prev = []
if os.path.exists(mp):
    try: prev = json.load(open(mp)).get('cur', [])
    except Exception: prev = []
keep = set(files) | (set(prev) if set(prev) != set(files) else set(json.load(open(mp)).get('prev', [])) if os.path.exists(mp) else set())
for f in os.listdir(os.path.join(R, 'js')):
    p = 'js/' + f
    if (f.endswith('.js') or f.endswith('.css')) and p not in keep:
        os.remove(os.path.join(R, p))
json.dump({'cur': files, 'prev': prev if set(prev) != set(files) else (json.load(open(mp)).get('prev', []) if os.path.exists(mp) else [])}, open(mp, 'w'), indent=0)
# v132: عامل الخدمة (تطبيق قابل للتثبيت يعمل دون اتصال): يُولَّد بإصدار البناء وقائمة الملفات الحالية
try:
    bv = re.search(r"__BUILD__='(v\d+)'", src).group(1)
    pre = files + ['i18n-bn.js?v=' + bv, 'manifest.webmanifest', 'img/app-192-v132.png', 'img/logom-243bc940.webp', 'img/logo-a8d46018.webp', 'img/favicon-512aae70.png', 'fonts/tmh-400-v170.woff', 'fonts/tmh-700-v170.woff']
    tpl = open(os.path.join(R, 'tools/sw.tpl.js'), encoding='utf-8').read()
    open(os.path.join(R, 'sw.js'), 'w', encoding='utf-8', newline='').write(tpl.replace('__V__', bv + '-' + hashlib.sha256(''.join(files).encode()).hexdigest()[:8]).replace('__PRE__', json.dumps(pre)))
except Exception as e:
    print('sw build failed', e)
print('index.html', len(out.encode()), 'bytes;', len(files), 'js files;', sum(os.path.getsize(os.path.join(R, f)) for f in files), 'bytes')

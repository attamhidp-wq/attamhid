#!/usr/bin/env python3
"""يبني index.html الخفيف من src/index.html: تُفصل السكربتات الكبيرة إلى ملفات js/ مستقلة (بالترتيب نفسه)
حتى يخزّنها المتصفح ويعيد استخدامها دون إعادة تحميل أو إعادة تحليل، وتُحمَّل الخطوط دون حجب العرض.
التعديل يكون دائماً في src/index.html ثم: python3 tools/build.py"""
import re, hashlib, json, os, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(R, 'src/index.html'), encoding='utf-8').read()
MIN = 3000
files = []
n = [0]
def repl(m):
    attrs, body = m.group(1), m.group(2)
    if re.search(r'\bsrc\s*=', attrs) or len(body.encode()) < MIN or re.search(r'type\s*=\s*"(?!text/javascript)', attrs):
        return m.group(0)
    n[0] += 1
    idm = re.search(r'\bid="([^"]+)"', attrs)
    name = (idm.group(1) if idm else 's%02d' % n[0])
    h = hashlib.sha256(body.encode()).hexdigest()[:10]
    fn = 'js/%s-%s.js' % (re.sub(r'[^A-Za-z0-9_-]', '', name), h)
    with open(os.path.join(R, fn), 'w', encoding='utf-8', newline='') as f:
        f.write(body)
    files.append(fn)
    extra = ' defer' if name == 'jsqr' else ''
    return '<script%s charset="utf-8"%s src="%s"></script>' % (attrs, extra, fn)
out = re.sub(r'<script([^>]*)>([\s\S]*?)</script>', repl, src)
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
    if f.endswith('.js') and p not in keep:
        os.remove(os.path.join(R, p))
json.dump({'cur': files, 'prev': prev if set(prev) != set(files) else (json.load(open(mp)).get('prev', []) if os.path.exists(mp) else [])}, open(mp, 'w'), indent=0)
print('index.html', len(out.encode()), 'bytes;', len(files), 'js files;', sum(os.path.getsize(os.path.join(R, f)) for f in files), 'bytes')

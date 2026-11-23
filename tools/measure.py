#!/usr/bin/env python3
"""v249 — أداة القياس لمشروع تقسيم الشيفرة: حجم ما يُحمَّل عند دخول البوابات (خام ومضغوط)، والفرق بين بناءين.
الاستعمال: python3 tools/measure.py            (البناء الحالي)
           python3 tools/measure.py REV1 REV2  (ما يُعاد تنزيله بين التزامين: ملفات js جديدة الاسم)"""
import re, os, sys, gzip, json, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def files_of(html):
    return re.findall(r'<script[^>]*src="(js/[^"]+\.js)"', html) + re.findall(r'href="(js/[^"]+\.css)"', html)
def size(rev, f):
    b = subprocess.run(['git', 'show', rev + ':' + f], cwd=R, capture_output=True).stdout if rev else open(os.path.join(R, f), 'rb').read()
    return len(b), len(gzip.compress(b, 6))
def app(rev):
    return subprocess.run(['git', 'show', rev + ':app.html'], cwd=R, capture_output=True, text=True).stdout if rev else open(os.path.join(R, 'app.html'), encoding='utf-8').read()
if len(sys.argv) == 3:
    a, b = sys.argv[1], sys.argv[2]
    fa, fb = set(files_of(app(a))), files_of(app(b))
    new = [f for f in fb if f not in fa]
    tot = [size(b, f) for f in new]
    print(json.dumps({'from': a, 'to': b, 'changed_files': len(new), 'raw_kb': round(sum(x[0] for x in tot) / 1024), 'gzip_kb': round(sum(x[1] for x in tot) / 1024), 'files': new}, ensure_ascii=False, indent=1))
else:
    fs = files_of(app(None)); S = [(f,) + size(None, f) for f in fs]
    js = [x for x in S if x[0].endswith('.js')]
    print(json.dumps({'js_files': len(js), 'js_raw_kb': round(sum(x[1] for x in js) / 1024), 'js_gzip_kb': round(sum(x[2] for x in js) / 1024),
      'css_gzip_kb': round(sum(x[2] for x in S if x[0].endswith('.css')) / 1024),
      'top': [(x[0], round(x[1] / 1024), round(x[2] / 1024)) for x in sorted(js, key=lambda y: -y[2])[:10]]}, ensure_ascii=False, indent=1))

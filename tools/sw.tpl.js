/* معهد التمهيد — عامل الخدمة (يُولَّد من tools/build.py؛ لا يُعدَّل يدوياً) */
var V='__V__',SHELL='ati-shell-'+V,ASSET='ati-asset',EXT='ati-ext',PRE=__PRE__;
self.addEventListener('install',function(e){e.waitUntil(caches.open(ASSET).then(function(c){return Promise.all(PRE.map(function(u){return c.match(u).then(function(h){return h||c.add(u).catch(function(){})})}))}).then(function(){return caches.open(SHELL)}).then(function(c){return c.add(new Request('./',{cache:'reload'})).catch(function(){})}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(K){return Promise.all(K.filter(function(k){return /^ati-shell-/.test(k)&&k!==SHELL}).map(function(k){return caches.delete(k)}))}).then(function(){return caches.open(ASSET)}).then(function(c){return c.keys().then(function(R){return Promise.all(R.filter(function(r){var p=new URL(r.url).pathname;return /\/js\//.test(p)&&!PRE.some(function(u){return p.slice(-u.length)===u})}).map(function(r){return c.delete(r)}))})}).then(function(){return self.clients.claim()}))});
var EXTH=/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)$/;
function put(n,req,res){if(res&&(res.ok||res.type==='opaque')){var c=res.clone();caches.open(n).then(function(x){x.put(req,c)}).catch(function(){})}return res}
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
 if(u.origin!==self.location.origin){if(EXTH.test(u.hostname))e.respondWith(caches.match(r).then(function(h){var n=fetch(r).then(function(x){return put(EXT,r,x)}).catch(function(){return h});return h||n}));return}
 var p=u.pathname;if(/\/(version\.json|sw\.js)$/.test(p))return;
 if(r.mode==='navigate'&&!/^\/(index\.html)?$/.test(p)){e.respondWith(fetch(r).then(function(x){return put(ASSET,r,x)}).catch(function(){return caches.match(r).then(function(h){return h||caches.match('./',{cacheName:SHELL})})}));return}
 if(r.mode==='navigate'||/^\/(index\.html)?$/.test(p)){e.respondWith(fetch(r).then(function(x){if(x.ok){var c=x.clone();caches.open(SHELL).then(function(s){s.put('./',c)})}return x}).catch(function(){return caches.match('./',{cacheName:SHELL}).then(function(h){return h||caches.match('./')})}));return}
 if(/\/(js|img)\//.test(p)||/\.(js|css|webp|png|jpg|svg|woff2?)$/.test(p)){e.respondWith(caches.match(r).then(function(h){return h||fetch(r).then(function(x){return put(ASSET,r,x)})}));return}
 e.respondWith(fetch(r).then(function(x){return put(ASSET,r,x)}).catch(function(){return caches.match(r)}))});
self.addEventListener('message',function(e){if(e.data==='skip')self.skipWaiting()});

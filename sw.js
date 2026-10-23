const V='invite-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./firebase-config.js','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.hostname.endsWith('googleapis.com')||u.hostname==='firestore.googleapis.com'||u.hostname.includes('identitytoolkit'))return; // live Firebase traffic: never cache
 // network first (so updates arrive), cache fallback (works offline)
 e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));
});

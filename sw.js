// Eko Hustle service worker. Pages and scripts always load fresh from the network
// (so the installed app never gets stuck on an old version) and fall back to the
// cache only when the player is offline. Images and sounds are cached for speed.
const V = "eh-assets-v2";
const CORE = [
  "./", 
  "./index.html", 
  "./config.js", 
  "./manifest.json",
  "./city3d.js",
  "./wow3d.js",
  "./real3d.js"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE).catch(() => {})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;            // never touch Supabase, Paystack, CDNs
  const isDoc = r.mode === "navigate" || /\.(html|js|json)$/.test(u.pathname) || u.pathname.endsWith("/");
  if (isDoc) {
    e.respondWith(
      fetch(u.href, { cache: "no-store" })
        .then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })
        .catch(() => caches.match(r).then(m => m || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    caches.match(r).then(m => {
      const net = fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => m);
      return m || net;
    })
  );
});

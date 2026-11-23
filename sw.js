const CACHE = "winter-party-v4";
const SHELL = ["./", "./index.html", "./styles.css", "./manifest.webmanifest", "./icon.svg", "./NEW RW LOGO WHITE - HORIZONTAL.png"];
self.addEventListener("install", event => {
  // add files one by one so a single missing file cannot stop the whole install
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(SHELL.map(url => cache.add(url).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Network-first: always get the newest files when online, fall back to cache when offline.
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(c => c || caches.match("./index.html"))));
});

// Service worker simples: deixa o roteiro em si abrir sem sinal.
// Mapa, fotos e previsão do tempo continuam precisando de internet.
// A página em si é sempre buscada da rede primeiro (quando há sinal),
// pra nunca travar numa versão antiga depois de um novo deploy —
// só cai pro cache quando está offline de verdade.
const CACHE = "ml-mendoza-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return; // fontes, mapa, fotos e previsão seguem direto pra rede
  if(e.request.method !== "GET") return;

  const isPage = e.request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/";
  if(isPage){
    e.respondWith(
      fetch(e.request)
        .then(res => { if(res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if(res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

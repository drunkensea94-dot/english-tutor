// 앱 화면을 저장해 두어 휴대폰에서 빠르게 열리게 합니다. (/api 요청은 항상 서버로)
const CACHE = "sunny-tutor-v4";
const ASSETS = ["./", "index.html", "style.css", "app.js", "auth.js", "open-external.js", "lessons.js", "scenarios.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // 같은 사이트의 화면 파일만 저장해요 (구글 로그인 등 다른 사이트 요청은 건드리지 않아요)
  if (e.request.method !== "GET" || url.origin !== self.location.origin || url.pathname.includes("/api/")) return;
  // 네트워크 우선, 안 되면 저장본
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

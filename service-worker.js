const CACHE_NAME = 'gmp-payroll-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/headshot.png',
  '/blog/payroll-automation-google-sheets-apps-script/'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

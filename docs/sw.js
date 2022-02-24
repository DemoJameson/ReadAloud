importScripts("precache-manifest.fb24636af970e79e4b386de8fa1f6e70.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");



self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Install');
});
  
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
});
  
self.addEventListener('fetch', function(event) {
    console.log('[ServiceWorker] Fetch');
});

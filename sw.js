
var current_version = 'ta-dir-v8';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(current_version).then(cache => {
      return cache.addAll([
        '/ta-dir/',
        '/ta-dir/index.html',
        '/ta-dir/dist/app.css',
        '/ta-dir/dist/jquery.min.js',
        '/ta-dir/dist/app.js',
        '/ta-dir/dist/trello.js',
        '/ta-dir/icons/favicon-16x16.png',
        '/ta-dir/icons/favicon-32x32.png',
        '/ta-dir/icons/favicon-96x96.png',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      ])
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = [current_version];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

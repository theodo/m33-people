
var current_version = 'm33-people-v17';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(current_version).then(cache => {
      return cache.addAll([
        '/m33-people/',
        '/m33-people/index.html',
        '/m33-people/dist/app.css',
        '/m33-people/dist/jquery.min.js',
        '/m33-people/dist/app.js',
        '/m33-people/dist/trello.js',
        '/m33-people/icons/favicon-16x16.png',
        '/m33-people/icons/favicon-32x32.png',
        '/m33-people/icons/favicon-96x96.png',
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

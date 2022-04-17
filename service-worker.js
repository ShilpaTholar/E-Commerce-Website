const staticCacheName = 'site-static';
const assets = [
  "/",
  "index.html",
  "login.html",
  "style.css",
  "shirt.jpg",
  "watch.jpg",
  "camera.jpg",
  "intro-bg_1.jpg"
  
];
self.addEventListener('install', evt => {
  console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});



self.addEventListener('fetch', evt => {
  console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});

self.addEventListener('push', e=> {
   console.log('push', e);
  var body;

  if (e.data) {
    body = e.data.text();
  } else {
    body = 'Push message no payload';
  }

  var options = {
    body: body,
    icon: 'watch.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'Explore this new world',
        icon: 'shirt.jpg'},
      {action: 'close', title: 'I don\'t want any of this',
        icon: 'watch.jpg'},
    ]
  };
  e.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

self.addEventListener('sync', function(event) {
	console.log("sync event", event);
    }
);

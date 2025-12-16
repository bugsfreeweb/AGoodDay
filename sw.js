// Professional Service Worker for PWA functionality
const CACHE_NAME = 'agoodday-calendar-pro-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './assets/agoodday.png',
  'https://unpkg.com/feather-icons',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background synchronization of data
  return new Promise((resolve) => {
    console.log('Background sync completed');
    resolve();
  });
}

// Push notifications (for future feature)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New calendar event!',
    icon: './assets/agoodday.png',
    badge: './assets/agoodday.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Calendar',
        icon: './assets/agoodday.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: './assets/agoodday.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('A Good Day Calendar Pro', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});
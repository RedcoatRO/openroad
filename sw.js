// sw.js - Service Worker for Open Road Leasing PWA

const CACHE_NAME = 'openroad-leasing-cache-v1';

// Lista resurselor esențiale (App Shell) care vor fi stocate în cache la instalare.
// Acestea asigură că aplicația se încarcă rapid și funcționează offline.
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx', // Aceste fișiere .tsx sunt referințe, browser-ul va cere .js
  '/App.tsx',
  '/components/LoadingSpinner.tsx',
  '/logo192.png',
  '/logo512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://unpkg.com/recharts/umd/Recharts.min.js'
];

// Evenimentul 'install': Se declanșează la prima vizită sau la o actualizare a service worker-ului.
self.addEventListener('install', event => {
  console.log('Service Worker: Se instalează...');
  // Așteaptă până când toate resursele esențiale sunt adăugate în cache.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Adaugă resursele esențiale în cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('Eroare la adăugarea în cache în timpul instalării:', error);
      })
  );
  // Forțează noul service worker să devină activ imediat.
  self.skipWaiting();
});

// Evenimentul 'activate': Se declanșează după instalare.
// Este momentul potrivit pentru a curăța cache-urile vechi.
self.addEventListener('activate', event => {
  console.log('Service Worker: Se activează...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Șterge cache-ul vechi:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Preia controlul paginilor deschise imediat.
  return self.clients.claim();
});

// Evenimentul 'fetch': Se declanșează pentru fiecare cerere de rețea făcută de pagină.
// Implementează o strategie "Cache-First, then Network & Cache".
self.addEventListener('fetch', event => {
  // Ignorăm cererile care nu sunt de tip GET.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Răspunde la cerere fie cu resursa din cache, fie prin rețea.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Dacă resursa este găsită în cache, o returnăm imediat.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Dacă resursa nu e în cache, o cerem din rețea.
        return fetch(event.request).then(
          networkResponse => {
            // Verificăm dacă am primit un răspuns valid.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              // Unele resurse (ex: CDN-uri fără CORS) pot da răspunsuri 'opaque'. Le lăsăm să treacă.
               if(networkResponse.type === 'opaque') {
                   // Nu putem verifica statusul, deci o adăugăm oricum în cache.
               } else {
                   return networkResponse;
               }
            }
            
            // Clonăm răspunsul, deoarece poate fi citit o singură dată.
            const responseToCache = networkResponse.clone();

            // Deschidem cache-ul și adăugăm noul răspuns.
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            // Returnăm răspunsul original către pagină.
            return networkResponse;
          }
        ).catch(error => {
            // În caz de eroare de rețea (ex: offline), fetch-ul va eșua.
            // Aici s-ar putea returna o pagină de fallback, dar pentru moment lăsăm eroarea să se propage.
            console.error('Service Worker: Eroare la fetch:', error);
            // Aruncăm eroarea pentru a semnala că cererea a eșuat.
            throw error;
        });
      })
  );
});
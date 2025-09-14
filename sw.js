// sw.js - Service Worker for Open Road Leasing PWA

const CACHE_NAME = 'openroad-leasing-cache-v2'; // Bumped cache version

// Lista resurselor esențiale (App Shell) care vor fi stocate în cache la instalare.
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/utils/adminDataService.ts',
  '/utils/firebase.ts',
  '/utils/formUtils.ts',
  '/utils/imageCompressor.ts',
  '/contexts/AuthContext.tsx',
  '/contexts/FavoritesContext.tsx',
  '/contexts/ThemeContext.tsx',
  // Components
  '/components/BookingCalendar.tsx',
  '/components/Breadcrumbs.tsx',
  '/components/ComparisonModal.tsx',
  '/components/DocumentItem.tsx',
  '/components/FavoritesModal.tsx',
  '/components/FleetBuilder.tsx',
  '/components/Footer.tsx',
  '/components/Header.tsx',
  '/components/icons.tsx',
  '/components/Image.tsx',
  '/components/InteractiveMap.tsx',
  '/components/QuoteModal.tsx',
  '/components/SearchBar.tsx',
  '/components/StockAlertModal.tsx',
  '/components/StructuredData.tsx',
  '/components/TCOCalculator.tsx',
  '/components/Vehicle360Viewer.tsx',
  '/components/VehicleCard.tsx',
  '/components/VehicleDetailModal.tsx',
  '/components/VehicleReviews.tsx',
  // Admin Components
  '/components/admin/ChartWidget.tsx',
  '/components/admin/ConfirmDeleteModal.tsx',
  '/components/admin/DataTable.tsx',
  '/components/admin/KPIcard.tsx',
  '/components/admin/ProtectedRoute.tsx',
  '/components/admin/Sidebar.tsx',
  '/components/admin/Topbar.tsx',
  '/components/admin/VehicleFormModal.tsx',
  // Pages
  '/pages/AboutPage.tsx',
  '/pages/AdminDashboardPage.tsx',
  '/pages/BenefitsPage.tsx',
  '/pages/BookingPage.tsx',
  '/pages/ContactPage.tsx',
  '/pages/DocumentsPage.tsx',
  '/pages/HomePage.tsx',
  '/pages/ReferralPage.tsx',
  '/pages/ServiceLeasingPage.tsx',
  '/pages/ServiceRentalPage.tsx',
  '/pages/ServicesPage.tsx',
  '/pages/VehiclesPage.tsx',
  // Admin Pages
  '/pages/admin/AuditLogPage.tsx',
  '/pages/admin/ClientManagementPage.tsx',
  '/pages/admin/ContentManagementPage.tsx',
  '/pages/admin/ImageGalleryPage.tsx',
  '/pages/admin/LoginPage.tsx',
  '/pages/admin/ReportsPage.tsx',
  '/pages/admin/RequestManagementPage.tsx',
  '/pages/admin/TwoFactorAuthPage.tsx',
  '/pages/admin/UserManagementPage.tsx',
  '/pages/admin/VehicleManagementPage.tsx',
  '/pages/admin/VisualEditorPage.tsx',
  // Assets
  '/logo192.png',
  '/logo512.png',
];

const CDN_FILES_TO_CACHE = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css',
  'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js',
];

const ASSETS_TO_CACHE = [...APP_SHELL_FILES, ...CDN_FILES_TO_CACHE];


// Evenimentul 'install': Se declanșează la prima vizită sau la o actualizare a service worker-ului.
self.addEventListener('install', event => {
  console.log('Service Worker: Se instalează...');
  // Așteaptă până când toate resursele esențiale sunt adăugate în cache.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Adaugă resursele esențiale în cache');
        const cachePromises = ASSETS_TO_CACHE.map(asset => {
            return cache.add(asset).catch(err => {
                console.warn(`Nu s-a putut adăuga în cache: ${asset}`, err);
            });
        });
        return Promise.all(cachePromises);
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
// Implementează o strategie "Stale-While-Revalidate" pentru un echilibru bun între viteză și actualizări.
self.addEventListener('fetch', event => {
  // Ignorăm cererile care nu sunt de tip GET sau care sunt pentru extensii de browser.
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchedResponsePromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
             cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        return cachedResponse || fetchedResponsePromise;
      });
    })
  );
});
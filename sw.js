// sw.js - Service Worker for Open Road Leasing PWA

const CACHE_NAME = 'openroad-leasing-cache-v8'; // Versiune cache incrementată pentru a forța actualizarea

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
  '/contexts/AuthContext.tsx',
  '/contexts/FavoritesContext.tsx',
  '/contexts/ThemeContext.tsx',
  // Components
  '/components/BookingCalendar.tsx',
  '/components/Breadcrumbs.tsx',
  '/components/ComparisonModal.tsx',
  '/components/DocumentItem.tsx',
  '/components/FAQAccordionItem.tsx',
  '/components/FavoritesModal.tsx',
  '/components/FleetBuilder.tsx',
  '/components/Footer.tsx',
  '/components/Header.tsx',
  '/components/icons.tsx',
  '/components/Image.tsx',
  '/components/InteractiveMap.tsx',
  '/components/Logo.tsx',
  '/components/QuoteModal.tsx',
  '/components/SearchBar.tsx',
  '/components/StockAlertModal.tsx',
  '/components/StructuredData.tsx',
  '/components/TCOCalculator.tsx',
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
  '/pages/PrivacyPolicyPage.tsx',
  '/pages/ReferralPage.tsx',
  '/pages/ServiceLeasingPage.tsx',
  '/pages/ServiceRentalPage.tsx',
  '/pages/ServicesPage.tsx',
  '/pages/TermsAndConditionsPage.tsx',
  '/pages/VehiclesPage.tsx',
  // Admin Pages
  '/pages/admin/AuditLogPage.tsx',
  '/pages/admin/ClientManagementPage.tsx',
  '/pages/admin/ContentManagementPage.tsx',
  '/pages/admin/ImageGalleryPage.tsx',
  '/pages/admin/LoginPage.tsx',
  '/pages/admin/ReportsPage.tsx',
  '/pages/admin/RequestManagementPage.tsx',
  '/pages/admin/UserManagementPage.tsx',
  '/pages/admin/VehicleManagementPage.tsx',
  '/pages/admin/VisualEditorPage.tsx',
];

const CDN_FILES_TO_CACHE = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

const ASSETS_TO_CACHE = [...APP_SHELL_FILES, ...CDN_FILES_TO_CACHE];

self.addEventListener('install', event => {
  console.log('Service Worker: Se instalează...');
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
  self.skipWaiting();
});

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
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignorăm cererile care nu sunt GET sau cele pentru extensii de browser
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Ocolim complet cache-ul pentru cererile către Firestore pentru a garanta date în timp real.
  if (request.url.includes('firestore.googleapis.com')) {
    return; // Lasă browser-ul să gestioneze cererea, fără intervenția Service Worker-ului.
  }

  // STRATEGIE: Network First pentru paginile HTML (navigation requests)
  // Asigură că utilizatorul primește întotdeauna cea mai nouă versiune a aplicației dacă este online.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Răspunsul a venit cu succes de la rețea. Îl clonăm și îl punem în cache.
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Rețeaua a eșuat (utilizatorul este offline). Încercăm să servim din cache.
          return caches.match(request);
        })
    );
    return; // Oprim execuția aici pentru cererile de navigare
  }

  // STRATEGIE: Stale-While-Revalidate pentru celelalte resurse (JS, CSS, imagini, etc.)
  // Răspunde rapid din cache, dar actualizează resursa în fundal pentru următoarea vizită.
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(networkResponse => {
        // Verificăm dacă răspunsul de la rețea este valid înainte de a-l adăuga în cache.
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(err => {
          // Dacă fetch-ul eșuează, nu facem nimic, pentru că vom returna răspunsul din cache mai jos (dacă există).
      });

      // Returnează răspunsul din cache imediat (dacă există), altfel așteaptă răspunsul de la rețea.
      return cachedResponse || fetchPromise;
    })
  );
});
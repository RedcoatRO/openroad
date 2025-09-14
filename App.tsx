

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import FavoritesModal from './components/FavoritesModal';
import VehicleDetailModal from './components/VehicleDetailModal'; 
import StockAlertModal from './components/StockAlertModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import VehiclesPage from './pages/VehiclesPage';
import BenefitsPage from './pages/BenefitsPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Sidebar from './components/admin/Sidebar';
import Topbar from './components/admin/Topbar';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { Vehicle } from './types'; 
import StructuredData from './components/StructuredData';

// Importăm contextul și componentele de autentificare
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import LoginPage from './pages/admin/LoginPage';

// Importăm paginile de destinație
import ServiceLeasingPage from './pages/ServiceLeasingPage';
import ServiceRentalPage from './pages/ServiceRentalPage';
import ReferralPage from './pages/ReferralPage';

// Importăm paginile de administrare existente și noi
import VehicleManagementPage from './pages/admin/VehicleManagementPage';
import RequestManagementPage from './pages/admin/RequestManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import ClientManagementPage from './pages/admin/ClientManagementPage';
import ReportsPage from './pages/admin/ReportsPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import VisualEditorPage from './pages/admin/VisualEditorPage';
import ImageGalleryPage from './pages/admin/ImageGalleryPage';
import { ContentProvider } from './contexts/ContentContext';

const MainLayout: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isFavoritesModalOpen, setFavoritesModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isStockAlertModalOpen, setStockAlertModalOpen] = useState(false);
    const [stockAlertVehicle, setStockAlertVehicle] = useState<Vehicle | null>(null);

    const handleViewDetails = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setDetailModalOpen(true);
    };
    
    const handleStockAlertClick = (vehicle: Vehicle) => {
        setStockAlertVehicle(vehicle);
        setStockAlertModalOpen(true);
    };

    const outletContext = {
        onQuoteClick: (model?: string) => setModalOpen(true),
        onFavoritesClick: () => setFavoritesModalOpen(true),
        onViewDetails: handleViewDetails,
        onStockAlertClick: handleStockAlertClick,
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Corporate Name",
        "url": "https://www.openroadleasing.com",
        "logo": "https://www.openroadleasing.com/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+40-744-000-000",
            "contactType": "customer service"
        }
    };
    
    // Script to enable visual editing when inside an iframe
    useEffect(() => {
        const isInsideIframe = window.self !== window.top;
        if (!isInsideIframe) return;

        let observer: MutationObserver | null = null;

        const attachClickListener = (el: Element) => {
            el.addEventListener('click', handleElementClick);
        };

        const handleElementClick = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();

            const el = e.currentTarget as Element;
            const id = el.getAttribute('data-editable-id');
            if (!id) return;

            const isImageTag = el.tagName === 'IMG';
            const isBgImage = el instanceof HTMLElement && el.style.backgroundImage && el.style.backgroundImage !== 'none';
            const isImage = isImageTag || isBgImage;

            let content: string | null = '';
            let elementType: 'text' | 'image';

            if (isImage) {
                elementType = 'image';
                if (isImageTag) {
                    content = (el as HTMLImageElement).src;
                } else {
                    const bgImage = (el as HTMLElement).style.backgroundImage;
                    const match = bgImage.match(/url\((['"])?(.*?)\1\)/);
                    content = match ? match[2] : '';
                }
            } else {
                elementType = 'text';
                content = el.textContent;
            }
            
            window.top?.postMessage({
                type: 'FL_PRO_ELEMENT_CLICKED',
                payload: { id, type: elementType, content }
            }, '*');
        };
        
        const activateEditMode = () => {
            document.body.classList.add('visual-editor-active');
                
            const style = document.createElement('style');
            style.id = 'visual-editor-styles';
            style.innerHTML = `
                .visual-editor-active [data-editable-id] {
                    outline: 2px dashed #0B5FFF !important;
                    outline-offset: 4px !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease-in-out;
                }
                .visual-editor-active [data-editable-id]:hover {
                    outline-style: solid !important;
                    background-color: rgba(11, 95, 255, 0.1) !important;
                }
            `;
            document.head.appendChild(style);

            // Attach listeners to existing elements
            document.querySelectorAll('[data-editable-id]').forEach(attachClickListener);

            // Observe for new elements being added to the DOM
            observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof HTMLElement) {
                            if (node.hasAttribute('data-editable-id')) {
                                attachClickListener(node);
                            }
                            node.querySelectorAll('[data-editable-id]').forEach(attachClickListener);
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        };
        
        const deactivateEditMode = () => {
             document.body.classList.remove('visual-editor-active');
             const style = document.getElementById('visual-editor-styles');
             if (style) style.remove();
             document.querySelectorAll('[data-editable-id]').forEach(el => {
                 el.removeEventListener('click', handleElementClick);
             });
             if (observer) {
                 observer.disconnect();
                 observer = null;
             }
        };

        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data;

            if (type === 'FL_PRO_EDIT_MODE') {
                activateEditMode();
            } else if (type === 'FL_PRO_UPDATE_CONTENT') {
                const { id, content } = payload;
                const element = document.querySelector(`[data-editable-id="${id}"]`);
                if (element) {
                    if (element.tagName === 'IMG') {
                        (element as HTMLImageElement).src = content;
                    } else if (element instanceof HTMLElement && element.style.backgroundImage) {
                         element.style.backgroundImage = `url('${content}')`;
                    } else {
                        element.textContent = content;
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);
        window.top?.postMessage({ type: 'FL_PRO_IFRAME_READY' }, '*');

        return () => {
            window.removeEventListener('message', handleMessage);
            deactivateEditMode();
        };
    }, []);


    return (
        <ContentProvider>
            <div className="font-sans text-text-main bg-bg-main dark:bg-gray-900 transition-colors duration-300">
                <StructuredData schema={organizationSchema} />
                <Header onQuoteClick={() => setModalOpen(true)} onFavoritesClick={() => setFavoritesModalOpen(true)} />
                <main>
                    <Outlet context={outletContext} />
                </main>
                <Footer />
                <QuoteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                <FavoritesModal 
                    isOpen={isFavoritesModalOpen} 
                    onClose={() => setFavoritesModalOpen(false)} 
                    onQuoteClick={(model) => setModalOpen(true)}
                    onViewDetails={handleViewDetails}
                    onStockAlertClick={handleStockAlertClick}
                />
                <VehicleDetailModal 
                    isOpen={isDetailModalOpen} 
                    onClose={() => setDetailModalOpen(false)} 
                    vehicle={selectedVehicle}
                />
                <StockAlertModal
                    isOpen={isStockAlertModalOpen}
                    onClose={() => setStockAlertModalOpen(false)}
                    vehicle={stockAlertVehicle}
                />
            </div>
        </ContentProvider>
    );
};

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-bg-admin-alt text-text-main font-sans no-print">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-admin-alt p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="despre-noi" element={<AboutPage />} />
                <Route path="servicii" element={<ServicesPage />} />
                <Route path="servicii/leasing-operational" element={<ServiceLeasingPage />} />
                <Route path="servicii/inchiriere-termen-lung" element={<ServiceRentalPage />} />
                <Route path="masini" element={<VehiclesPage />} />
                <Route path="avantaje" element={<BenefitsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="programare" element={<BookingPage />} />
                <Route path="documente-utile" element={<DocumentsPage />} />
                <Route path="program-recomandare" element={<ReferralPage />} />
              </Route>
              
              {/* Rutele de administrare sunt acum protejate */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="autoturisme" element={<VehicleManagementPage />} />
                  <Route path="solicitari" element={<RequestManagementPage />} />
                  <Route path="utilizatori" element={<UserManagementPage />} />
                  <Route path="continut" element={<ContentManagementPage />} />
                  <Route path="editor-vizual" element={<VisualEditorPage />} />
                  <Route path="ilustratii" element={<ImageGalleryPage />} />
                  <Route path="clienti" element={<ClientManagementPage />} />
                  <Route path="rapoarte" element={<ReportsPage />} />
                  <Route path="istoric" element={<AuditLogPage />} />
              </Route>

              {/* Rutele publice pentru autentificare */}
              <Route path="/admin/login" element={<LoginPage />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;
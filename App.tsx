
import React, { useState } from 'react';
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
import TwoFactorAuthPage from './pages/admin/TwoFactorAuthPage';

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
        "name": "FleetLease Pro",
        "url": "https://www.fleetlease.pro",
        "logo": "https://www.fleetlease.pro/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+40-744-000-000",
            "contactType": "customer service"
        }
    };

    return (
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
                  <Route path="clienti" element={<ClientManagementPage />} />
                  <Route path="rapoarte" element={<ReportsPage />} />
                  <Route path="istoric" element={<AuditLogPage />} />
              </Route>

              {/* Rutele publice pentru autentificare */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/2fa" element={<TwoFactorAuthPage />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;

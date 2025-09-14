import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import StructuredData from '../components/StructuredData';
import { EuroIcon, ShieldCheckIcon, WrenchIcon, CheckCircleIcon } from '../components/icons';
import { adminDataService } from '../utils/adminDataService';

const ServiceLeasingPage: React.FC = () => {
    const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
    const [contentOverrides, setContentOverrides] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Stabilește un listener în timp real pentru conținutul editabil
    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = adminDataService.listenToContentOverrides((content) => {
            setContentOverrides(content);
            console.log('Content Overrides updated for ServiceLeasingPage:', content);
            setIsLoading(false);
        });

        // Curăță listener-ul la demontarea componentei
        return () => unsubscribe();
    }, []);

    const getContent = (id: string, fallback: string) => contentOverrides[id] || fallback;

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Leasing Operațional Auto",
        "provider": {
            "@type": "Organization",
            "name": "Open Road Leasing"
        },
        "description": "Soluția completă care externalizează toate riscurile și costurile administrative ale flotei, de la achiziție și mentenanță, la asigurări și management.",
        "areaServed": {
            "@type": "Country",
            "name": "Romania"
        }
    };
    
    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Se încarcă...</div>;
    }


    return (
        <>
            <StructuredData schema={serviceSchema} />
            {/* Hero Section */}
            <section data-editable-id="leasing-hero-bg" className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: `url('${getContent('leasing-hero-bg', 'https://picsum.photos/seed/leasing/1920/1080')}')` }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="leasing-hero-title" className="text-4xl md:text-5xl font-bold">{getContent('leasing-hero-title', 'Leasing Operațional')}</h1>
                    <p data-editable-id="leasing-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('leasing-hero-subtitle', 'Mobilitate predictibilă, costuri optimizate și zero griji administrative.')}</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 data-editable-id="leasing-benefits-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('leasing-benefits-title', 'Avantajele Leasingului Operațional')}</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center"><EuroIcon className="w-10 h-10 text-primary mx-auto mb-3"/><h3 className="font-bold text-lg">Costuri Fixe</h3><p className="text-sm text-muted">O singură rată lunară fixă acoperă totul.</p></div>
                        <div className="text-center"><WrenchIcon className="w-10 h-10 text-primary mx-auto mb-3"/><h3 className="font-bold text-lg">Mentenanță Inclusă</h3><p className="text-sm text-muted">Ne ocupăm noi de revizii și reparații.</p></div>
                        <div className="text-center"><ShieldCheckIcon className="w-10 h-10 text-primary mx-auto mb-3"/><h3 className="font-bold text-lg">Riscuri Externalizate</h3><p className="text-sm text-muted">Valoarea reziduală și riscurile sunt preluate de noi.</p></div>
                    </div>
                </div>
            </section>
            
            {/* How it works */}
            <section className="py-20 bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4">
                     <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 data-editable-id="leasing-how-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('leasing-how-title', 'Cum funcționează?')}</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div><strong className="text-primary text-4xl block">1</strong><p className="mt-2 font-semibold">Consultanță</p><p className="text-sm text-muted">Analizăm nevoile tale.</p></div>
                        <div><strong className="text-primary text-4xl block">2</strong><p className="mt-2 font-semibold">Configurare</p><p className="text-sm text-muted">Alegem mașinile potrivite.</p></div>
                        <div><strong className="text-primary text-4xl block">3</strong><p className="mt-2 font-semibold">Livrare</p><p className="text-sm text-muted">Predăm vehiculele gata de drum.</p></div>
                        <div><strong className="text-primary text-4xl block">4</strong><p className="mt-2 font-semibold">Management</p><p className="text-sm text-muted">Ne ocupăm de administrare.</p></div>
                    </div>
                </div>
            </section>
            
            {/* Closing CTA */}
            <section className="bg-primary text-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 data-editable-id="leasing-cta-title" className="text-3xl font-bold">{getContent('leasing-cta-title', 'Gata să externalizezi managementul flotei?')}</h2>
                    <p data-editable-id="leasing-cta-subtitle" className="mt-4 max-w-2xl mx-auto text-blue-100">{getContent('leasing-cta-subtitle', 'Contactează-ne pentru o ofertă personalizată și descoperă eficiența leasingului operațional.')}</p>
                    <button onClick={onQuoteClick} className="mt-8 inline-block bg-white text-primary font-bold px-8 py-3 rounded-btn hover:bg-blue-50 transition-colors">
                        Solicită ofertă
                    </button>
                </div>
            </section>
        </>
    );
};

export default ServiceLeasingPage;
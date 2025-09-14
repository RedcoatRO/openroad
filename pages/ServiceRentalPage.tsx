
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import StructuredData from '../components/StructuredData';
import { ClockIcon, ArrowLeftRightIcon, CarIcon } from '../components/icons';
import { adminDataService } from '../utils/adminDataService';

const ServiceRentalPage: React.FC = () => {
    const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
    const [contentOverrides, setContentOverrides] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Încarcă conținutul editabil de la Firestore
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const content = await adminDataService.getContentOverrides();
                setContentOverrides(content);
            } catch (error) {
                console.error("Eroare la încărcarea conținutului:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

    const getContent = (id: string, fallback: string) => contentOverrides[id] || fallback;

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Închiriere Auto pe Termen Lung",
        "provider": {
            "@type": "Organization",
            "name": "Open Road Leasing"
        },
        "description": "Flexibilitate maximă pentru nevoile tale de mobilitate pe o perioadă de 12-48 luni, cu pachete personalizabile și costuri fixe, predictibile.",
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
            <section data-editable-id="rental-hero-bg" className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: `url('${getContent('rental-hero-bg', 'https://picsum.photos/seed/rental/1920/1080')}')` }}>
                <div className="absolute inset-0 bg-gray-900/70"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="rental-hero-title" className="text-4xl md:text-5xl font-bold">{getContent('rental-hero-title', 'Închiriere pe Termen Lung')}</h1>
                    <p data-editable-id="rental-hero-subtitle" className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">{getContent('rental-hero-subtitle', 'Flexibilitate și control total asupra flotei tale, fără angajamente pe viață.')}</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 data-editable-id="rental-benefits-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('rental-benefits-title', 'De ce să alegi închirierea pe termen lung?')}</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center"><ClockIcon className="w-10 h-10 text-primary mx-auto mb-3"/><h3 className="font-bold text-lg">Perioade Flexibile</h3><p className="text-sm text-muted">Contracte de la 12 la 48 de luni, adaptate proiectelor tale.</p></div>
                        <div className="text-center"><ArrowLeftRightIcon className="w-10 h-10 text-primary mx-auto mb-3"/><h3 className="font-bold text-lg">Scalabilitate Ușoară</h3><p className="text-sm text-muted">Adaugă sau înlocuiește vehicule rapid, în funcție de nevoi.</p></div>
                        <div className="text-center"><CarIcon className="w-10 h-10 text-primary mx-auto mb-3"/><h3 className="font-bold text-lg">Flotă Modernă</h3><p className="text-sm text-muted">Acces la cele mai noi modele, fără grija devalorizării.</p></div>
                    </div>
                </div>
            </section>
            
            {/* Closing CTA */}
            <section className="bg-primary text-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 data-editable-id="rental-cta-title" className="text-3xl font-bold">{getContent('rental-cta-title', 'Nevoie de flexibilitate pentru flota ta?')}</h2>
                    <p data-editable-id="rental-cta-subtitle" className="mt-4 max-w-2xl mx-auto text-blue-100">{getContent('rental-cta-subtitle', 'Alege mașinile de care ai nevoie, pentru perioada de care ai nevoie. Simplu și eficient.')}</p>
                    <button onClick={onQuoteClick} className="mt-8 inline-block bg-white text-primary font-bold px-8 py-3 rounded-btn hover:bg-blue-50 transition-colors">
                        Configurează-ți flota
                    </button>
                </div>
            </section>
        </>
    );
};

export default ServiceRentalPage;

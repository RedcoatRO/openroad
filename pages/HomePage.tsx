import React, { useState, useEffect } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import type { Testimonial, Vehicle } from '../types';
import { CarIcon, ClockIcon, ShieldCheckIcon, StarIcon, CheckCircleIcon, EuroIcon, WrenchIcon, PiggyBankIcon } from '../components/icons';
import Image from '../components/Image';
import VehicleCard from '../components/VehicleCard';
import { adminDataService } from '../utils/adminDataService';

interface OutletContextType {
    onQuoteClick: (model?: string) => void;
    onViewDetails: (vehicle: Vehicle) => void;
    onStockAlertClick: (vehicle: Vehicle) => void; 
}

// Date statice care nu se schimbă des
const kpiData = [
    { icon: <CarIcon className="w-8 h-8 text-primary" />, value: "2.500+", label: "vehicule în administrare" },
    { icon: <ClockIcon className="w-8 h-8 text-primary" />, value: "10-15 zile", label: "Livrare în medie" },
    { icon: <ShieldCheckIcon className="w-8 h-8 text-primary" />, value: "98%", label: "uptime flotă" },
    { icon: <StarIcon className="w-8 h-8 text-primary" />, value: "4,9★", label: "din 300+ recenzii B2B" },
];

const benefitsData = [
    { icon: <EuroIcon className="w-10 h-10 text-primary" />, title: "Costuri fixe lunare", description: "Predictibilitate bugetară, fără surprize." },
    { icon: <WrenchIcon className="w-10 h-10 text-primary" />, title: "Mentenanță inclusă", description: "Revizii, consumabile și asistență rutieră." },
    { icon: <ShieldCheckIcon className="w-10 h-10 text-primary" />, title: "Asigurări & înlocuire", description: "RCA/CASCO gestionate integral, mașină de schimb." },
    { icon: <PiggyBankIcon className="w-10 h-10 text-primary" />, title: "Fără investiție inițială", description: "Zero avans; păstrezi capitalul pentru business." },
];

const servicesData = [
    { 
        id: "home-service-1",
        title: "Închiriere pe termen lung (12–48 luni)", 
        description: "Contracte flexibile, kilometraj adaptat, livrare rapidă.", 
        link: "/servicii", 
        image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=600&h=400&fit=crop&fm=jpg" 
    },
    { 
        id: "home-service-2",
        title: "Flote personalizate pentru companii", 
        description: "Sedan, SUV, electrice sau utilitare – configurate pe nevoile tale.", 
        link: "/servicii", 
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&h=400&fit=crop&fm=jpg" 
    },
    { 
        id: "home-service-3",
        title: "Leasing operațional", 
        description: "Externalizezi riscurile și administrativele – noi ne ocupăm de tot.", 
        link: "/servicii", 
        image: "https://images.unsplash.com/photo-1511920170033-f832d73bae36?q=80&w=600&h=400&fit=crop&fm=jpg" 
    },
];

const HomePage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('Toate');
    const { onQuoteClick, onViewDetails, onStockAlertClick } = useOutletContext<OutletContextType>();

    // Stări pentru datele dinamice și pentru starea de încărcare
    const [vehiclesForHomepage, setVehiclesForHomepage] = useState<Vehicle[]>([]);
    const [contentOverrides, setContentOverrides] = useState<Record<string, string>>({});
    const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
    const [partners, setPartners] = useState<{ id: string, logoUrl: string, name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect pentru a încărca toate datele necesare asincron la montarea componentei
    useEffect(() => {
        const fetchPageData = async () => {
            try {
                // Folosim Promise.all pentru a încărca datele în paralel
                const [vehicles, content, testimonials, partnersData] = await Promise.all([
                    adminDataService.getVehicles(),
                    adminDataService.getContentOverrides(),
                    adminDataService.getTestimonials(),
                    adminDataService.getPartners()
                ]);
                
                // Setăm stările cu datele primite de la Firestore
                setVehiclesForHomepage(vehicles.slice(0, 3));
                setContentOverrides(content);
                console.log('Content Overrides loaded for HomePage:', content);
                setTestimonialsData(testimonials);
                setPartners(partnersData);
            } catch (error) {
                console.error("Eroare la încărcarea datelor pentru pagina principală:", error);
                // Aici se poate adăuga o stare de eroare pentru a o afișa utilizatorului
            } finally {
                setIsLoading(false);
            }
        };

        fetchPageData();
    }, []);

    // Funcție ajutătoare pentru a obține conținutul, cu fallback
    const getContent = (id: string, fallback: string) => contentOverrides[id] || fallback;

    // Afișează o stare de încărcare cât timp datele sunt aduse de la server
    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Se încarcă...</div>;
    }

    return (
        <>
            {/* Hero Section */}
            <section data-editable-id="home-hero-bg" className="relative h-[600px] bg-cover bg-center text-white flex items-center" style={{ backgroundImage: `url('${getContent('home-hero-bg', 'https://picsum.photos/seed/fleet/1920/1080')}')` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/40"></div>
                <div className="relative container mx-auto px-4 z-10">
                    <div className="max-w-3xl">
                        <h1 data-editable-id="home-hero-title" className="text-4xl md:text-5xl font-bold leading-tight">{getContent('home-hero-title', 'Închirieri auto pe termen lung pentru companii')}</h1>
                        <p data-editable-id="home-hero-subtitle" className="mt-4 text-lg md:text-xl text-blue-100">{getContent('home-hero-subtitle', 'Costuri lunare fixe, flotă flexibilă, fără grija mentenanței.')}</p>
                        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button onClick={() => onQuoteClick()} className="bg-primary text-white font-semibold px-8 py-3 rounded-btn hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">Solicită ofertă</button>
                            <a href="#catalog" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-btn border border-white/50 hover:bg-white/30 transition-colors text-center">Vezi oferta de mașini</a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-200">
                            <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-accent" /> Asigurare CASCO inclusă</span>
                            <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-accent" /> Mentenanță completă</span>
                            <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-accent" /> Mașină de înlocuire</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* KPI Bar */}
            <section className="bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {kpiData.map(item => (
                            <div key={item.label} className="flex flex-col items-center">
                                {item.icon}
                                <div className="text-2xl font-bold mt-2 text-text-main dark:text-white">{item.value}</div>
                                <div className="text-sm text-muted dark:text-gray-400">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-text-main dark:text-white">Mobilitate fără bătăi de cap</h2>
                        <p className="mt-4 text-muted dark:text-gray-400">Beneficiile unui parteneriat cu Open Road Leasing merg dincolo de simple închirieri.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefitsData.map(benefit => (
                            <div key={benefit.title} className="bg-white dark:bg-gray-800 p-6 rounded-card shadow-soft text-center">
                                <div className="flex justify-center mb-4">{benefit.icon}</div>
                                <h3 className="font-bold text-lg text-text-main dark:text-white">{benefit.title}</h3>
                                <p className="text-muted dark:text-gray-400 text-sm mt-2">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* About Us Summary */}
            <section className="py-20 bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                         <div className="lg:w-1/2">
                            <Image 
                                data-editable-id="home-about-image"
                                src={getContent('home-about-image', "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=600&h=400&fit=crop&fm=jpg")} 
                                alt="Echipa Open Road Leasing" 
                                className="rounded-card shadow-md" />
                         </div>
                         <div className="lg:w-1/2">
                            <h2 data-editable-id="home-about-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('home-about-title', 'Partenerul de încredere pentru flota ta')}</h2>
                            <p data-editable-id="home-about-text" className="mt-4 text-muted dark:text-gray-400">{getContent('home-about-text', 'Cu peste 10 ani de experiență în industrie, oferim soluții de mobilitate corporativă personalizate, eficiente și predictibile. Misiunea noastră este să simplificăm managementul flotei tale, astfel încât tu să te poți concentra pe creșterea afacerii tale.')}</p>
                            <NavLink to="/despre-noi" className="mt-6 inline-block text-primary font-semibold hover:underline">Află mai multe despre noi &rarr;</NavLink>
                         </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-text-main dark:text-white">Servicii complete pentru mobilitatea afacerii tale</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {servicesData.map(service => (
                            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-card shadow-soft overflow-hidden group">
                                <Image data-editable-id={`${service.id}-image`} src={getContent(`${service.id}-image`, service.image)} alt={service.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="p-6">
                                    <h3 data-editable-id={`${service.id}-title`} className="font-bold text-lg text-text-main dark:text-white">{getContent(`${service.id}-title`, service.title)}</h3>
                                    <p data-editable-id={`${service.id}-desc`} className="text-muted dark:text-gray-400 text-sm mt-2">{getContent(`${service.id}-desc`, service.description)}</p>
                                    <NavLink to={service.link} className="mt-4 inline-block text-primary font-semibold text-sm hover:underline">Află detalii &rarr;</NavLink>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vehicle Catalog Teaser */}
            <section id="catalog" className="py-20 bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-text-main dark:text-white">Descoperă flota noastră</h2>
                        <p className="mt-4 text-muted dark:text-gray-400">O selecție de vehicule noi, perfect adaptate nevoilor de business.</p>
                    </div>
                    <div className="flex justify-center space-x-2 mb-8">
                        {['Toate', 'Sedan', 'SUV', 'Electrică'].map(filter => (
                            <button 
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeFilter === filter ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-muted dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehiclesForHomepage
                         .filter(v => activeFilter === 'Toate' || v.type === activeFilter)
                         .map(vehicle => (
                            <VehicleCard 
                                key={vehicle.id}
                                vehicle={vehicle}
                                onQuoteClick={() => onQuoteClick(vehicle.model)}
                                onViewDetails={onViewDetails}
                                onStockAlertClick={onStockAlertClick}
                            />
                         ))}
                    </div>
                    <p className="text-center text-xs text-muted dark:text-gray-500 mt-8">*Preț orientativ. Contract minim 12 luni. Include RCA/CASCO și mentenanță.</p>
                </div>
            </section>
            
            {/* Mid-page CTA */}
            <section className="bg-primary text-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold">Nu știi ce flotă ți se potrivește?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-blue-100">Îți oferim gratuit o analiză de costuri și recomandări personalizate.</p>
                    <NavLink to="/programare" className="mt-8 inline-block bg-white text-primary font-bold px-8 py-3 rounded-btn hover:bg-blue-50 transition-colors">
                        Programează o consultanță
                    </NavLink>
                </div>
            </section>

            {/* Testimonials & Partners */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                     <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-text-main dark:text-white">Clienții noștri ne recomandă</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                       {testimonialsData.map((testimonial, index) => (
                         <div key={index} className="bg-bg-alt dark:bg-gray-800 p-8 rounded-card">
                            <p className="text-muted dark:text-gray-400 italic">"{testimonial.quote}"</p>
                            <div className="mt-4 font-semibold text-text-main dark:text-white">— {testimonial.author}, <span className="font-normal text-muted dark:text-gray-400">{testimonial.role}, {testimonial.company}</span></div>
                         </div>
                       ))}
                    </div>
                    {/* Partner Logos */}
                    <div className="mt-16 text-center">
                        <p className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-6">Parteneri de încredere</p>
                        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                            {partners.map(partner => (
                                <Image
                                    key={partner.id}
                                    data-editable-id={partner.id}
                                    src={getContent(partner.id, partner.logoUrl)}
                                    alt={partner.name}
                                    className="h-8 w-32 object-contain"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Closing CTA */}
            <section className="relative bg-cover bg-center text-white" style={{ backgroundImage: "url('https://picsum.photos/seed/cityroad/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                 <div className="relative container mx-auto px-4 py-20 text-center">
                    <h2 className="text-4xl font-bold">Construiește-ți flota azi!</h2>
                    <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">Trimite-ne cerințele și revenim cu o ofertă în 24–48h.</p>
                    <button onClick={() => onQuoteClick()} className="mt-8 bg-primary text-white font-bold px-8 py-3 rounded-btn hover:bg-primary-600 border-2 border-primary hover:border-primary-600 transition-colors">Solicită ofertă</button>
                </div>
            </section>
        </>
    );
};

export default HomePage;
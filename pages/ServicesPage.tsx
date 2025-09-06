
import React from 'react';
import { NavLink } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { CheckCircleIcon, EuroIcon, WrenchIcon } from '../components/icons';
import { adminDataService } from '../utils/adminDataService';

const services = [
    {
        id: "services-leasing",
        title: "Leasing Operațional",
        description: "Soluția completă care externalizează toate riscurile și costurile administrative ale flotei, de la achiziție și mentenanță, la asigurări și management.",
        link: "/servicii/leasing-operational",
        icon: <EuroIcon className="w-10 h-10 text-primary" />,
    },
    {
        id: "services-rental",
        title: "Închiriere pe Termen Lung",
        description: "Flexibilitate maximă pentru nevoile tale de mobilitate pe o perioadă de 12-48 luni, cu pachete personalizabile și costuri fixe, predictibile.",
        link: "/servicii/inchiriere-termen-lung",
        icon: <WrenchIcon className="w-10 h-10 text-primary" />,
    },
];

const ServicesPage: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section data-editable-id="services-hero-bg" className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: `url('${adminDataService.getSingleContent('services-hero-bg', 'https://picsum.photos/seed/services/1920/1080')}')` }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="services-hero-title" className="text-4xl md:text-5xl font-bold">{adminDataService.getSingleContent('services-hero-title', 'Serviciile noastre')}</h1>
                    <p data-editable-id="services-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{adminDataService.getSingleContent('services-hero-subtitle', 'Soluții complete de mobilitate pe termen lung pentru companii.')}</p>
                    <div className="mt-8">
                        <Breadcrumbs />
                    </div>
                </div>
            </section>

             {/* Service Hub Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                     <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 data-editable-id="services-main-title" className="text-3xl font-bold text-text-main dark:text-white">{adminDataService.getSingleContent('services-main-title', 'Alege soluția potrivită pentru afacerea ta')}</h2>
                        <p data-editable-id="services-main-subtitle" className="mt-4 text-muted dark:text-gray-400">{adminDataService.getSingleContent('services-main-subtitle', 'Indiferent de mărimea flotei sau de specificul activității tale, avem un pachet de servicii conceput pentru a-ți oferi eficiență, predictibilitate și costuri optimizate. Explorează opțiunile de mai jos pentru a afla mai multe.')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {services.map(service => (
                             <div key={service.title} className="bg-white dark:bg-gray-800 p-8 rounded-card shadow-soft hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                                {service.icon}
                                <h3 data-editable-id={`${service.id}-title`} className="text-2xl font-bold text-text-main dark:text-white mt-4">{adminDataService.getSingleContent(`${service.id}-title`, service.title)}</h3>
                                <p data-editable-id={`${service.id}-desc`} className="text-muted dark:text-gray-400 mt-2 flex-grow">{adminDataService.getSingleContent(`${service.id}-desc`, service.description)}</p>
                                <NavLink 
                                    to={service.link}
                                    className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2.5 rounded-btn hover:bg-primary-600 transition-colors"
                                >
                                    Află detalii
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ServicesPage;
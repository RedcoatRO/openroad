
import React from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import { TargetIcon, ArrowLeftRightIcon, ShieldCheckIcon, UsersIcon, CarIcon, CalendarIcon, StarIcon } from '../components/icons';
import Image from '../components/Image';
import Breadcrumbs from '../components/Breadcrumbs'; 
import { adminDataService } from '../utils/adminDataService';

const valuesData = [
    { icon: <TargetIcon className="w-8 h-8 text-primary" />, title: "Predictibilitate", description: "Costuri fixe și clare." },
    { icon: <ArrowLeftRightIcon className="w-8 h-8 text-primary" />, title: "Flexibilitate", description: "Flotă adaptată nevoilor tale." },
    { icon: <ShieldCheckIcon className="w-8 h-8 text-primary" />, title: "Siguranță", description: "Asigurări și mentenanță completă." },
    { icon: <UsersIcon className="w-8 h-8 text-primary" />, title: "Parteneriat", description: "Relații pe termen lung, bazate pe încredere." }
];

const timelineData = [
    { year: "2015", event: "Fondarea companiei, cu primii 50 de clienți B2B." },
    { year: "2018", event: "Extindere la peste 500 de vehicule." },
    { year: "2021", event: "Introducerea flotei de vehicule electrice." },
    { year: "2024", event: "2.500+ vehicule și clienți din toate industriile." }
];

// Replaced pravatar with Unsplash for WebP compatibility
const teamData = [
    { 
        name: "Andrei Popescu", 
        role: "CEO", 
        quote: "Cred că mobilitatea trebuie să fie simplă și accesibilă pentru fiecare companie.", 
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop&fm=jpg" 
    },
    { 
        name: "Elena Ionescu", 
        role: "Head of Operations", 
        quote: "Eficiența și satisfacția clientului sunt pilonii pe care construim fiecare parteneriat.", 
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop&fm=jpg" 
    },
    { 
        name: "Mihai Constantinescu", 
        role: "Fleet Manager", 
        quote: "O flotă bine întreținută este o flotă productivă. Ne asigurăm de asta în fiecare zi.", 
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&h=150&fit=crop&fm=jpg" 
    },
];

const kpiData = [
    { icon: <CarIcon className="w-10 h-10 text-primary" />, value: "2.500+", label: "vehicule gestionate" },
    { icon: <UsersIcon className="w-10 h-10 text-primary" />, value: "200+", label: "clienți activi" },
    { icon: <CalendarIcon className="w-10 h-10 text-primary" />, value: "10", label: "ani de experiență" },
    { icon: <StarIcon className="w-10 h-10 text-primary" />, value: "98%", label: "satisfacție clienți" }
];

const AboutPage: React.FC = () => {
    const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();

    return (
        <>
            {/* Hero Section */}
            <section data-editable-id="about-hero-bg" className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: `url('${adminDataService.getSingleContent('about-hero-bg', 'https://picsum.photos/seed/about/1920/1080')}')` }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="about-hero-title" className="text-4xl md:text-5xl font-bold">{adminDataService.getSingleContent('about-hero-title', 'Despre noi')}</h1>
                    <p data-editable-id="about-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{adminDataService.getSingleContent('about-hero-subtitle', 'Partenerul tău de încredere pentru mobilitate corporativă pe termen lung.')}</p>
                    <div className="mt-8">
                        <Breadcrumbs />
                    </div>
                </div>
            </section>
            
            {/* Mission & Values */}
            <section className="py-20" aria-labelledby="mission-title">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <h2 data-editable-id="about-mission-title" id="mission-title" className="text-3xl font-bold text-text-main dark:text-white">{adminDataService.getSingleContent('about-mission-title', 'Misiunea noastră')}</h2>
                            <p data-editable-id="about-mission-text" className="mt-4 text-muted dark:text-gray-400">{adminDataService.getSingleContent('about-mission-text', 'Oferim companiilor soluții de mobilitate flexibile și previzibile, prin servicii de închiriere auto pe termen lung, cu accent pe transparență, eficiență și suport constant.')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8" aria-label="Valorile companiei">
                           {valuesData.map(value => (
                               <div key={value.title} className="flex items-start space-x-4">
                                   <div className="flex-shrink-0">{value.icon}</div>
                                   <div>
                                       <h3 className="font-bold text-text-main dark:text-white">{value.title}</h3>
                                       <p className="text-sm text-muted dark:text-gray-400">{value.description}</p>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Story Timeline */}
            <section className="py-20 bg-bg-alt dark:bg-gray-800" aria-labelledby="story-title">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 data-editable-id="about-story-title" id="story-title" className="text-3xl font-bold text-text-main dark:text-white">{adminDataService.getSingleContent('about-story-title', 'Povestea noastră')}</h2>
                        <p data-editable-id="about-story-text" className="mt-4 text-muted dark:text-gray-400">{adminDataService.getSingleContent('about-story-text', 'O călătorie marcată de creștere constantă și parteneriate de succes.')}</p>
                    </div>
                    <div className="relative">
                        {/* The line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border dark:bg-gray-700 -translate-y-1/2"></div>
                        <div className="grid md:grid-cols-4 gap-y-12 md:gap-y-0">
                           {timelineData.map((item, index) => (
                               <div key={item.year} className="relative px-4 text-center">
                                   {/* The dot */}
                                   <div className="hidden md:block absolute top-1/2 left-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
                                   <h3 className="font-bold text-2xl text-primary">{item.year}</h3>
                                   <p className="mt-2 text-sm text-muted dark:text-gray-400">{item.event}</p>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership & Team */}
            <section className="py-20" aria-labelledby="team-title">
                <div className="container mx-auto px-4">
                     <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 data-editable-id="about-team-title" id="team-title" className="text-3xl font-bold text-text-main dark:text-white">{adminDataService.getSingleContent('about-team-title', 'Echipa noastră de leadership')}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamData.map(member => (
                            <div key={member.name} className="bg-white dark:bg-gray-800 rounded-card shadow-soft text-center p-8">
                                <Image src={member.image} alt={`Portret ${member.name}`} className="w-24 h-24 rounded-full mx-auto mb-4" />
                                <h3 className="font-bold text-lg text-text-main dark:text-white">{member.name}</h3>
                                <p className="text-sm text-primary font-medium">{member.role}</p>
                                <p className="text-sm text-muted dark:text-gray-400 mt-4 italic">"{member.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Stats */}
            <section className="bg-bg-alt dark:bg-gray-800" aria-label="Statistici cheie">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {kpiData.map(kpi => (
                            <div key={kpi.label} className="flex flex-col items-center">
                                {kpi.icon}
                                <div className="text-3xl font-bold mt-2 text-text-main dark:text-white">{kpi.value}</div>
                                <div className="text-sm text-muted dark:text-gray-400">{kpi.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Partners */}
            <section className="py-20" aria-labelledby="partners-title">
                <div className="container mx-auto px-4 text-center">
                    <h2 id="partners-title" className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-8">Companii care au încredere în noi</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-8 grayscale opacity-60 dark:opacity-40">
                        {[...Array(6)].map((_, i) => (
                             <div key={i} className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded" title={`Logo Partener ${i + 1}`}></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section data-editable-id="about-cta-bg" className="relative bg-cover bg-center text-white" style={{ backgroundImage: `url('${adminDataService.getSingleContent('about-cta-bg', 'https://picsum.photos/seed/cityroad/1920/1080')}')` }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                 <div className="relative container mx-auto px-4 py-20 text-center">
                    <h2 data-editable-id="about-cta-title" className="text-4xl font-bold">{adminDataService.getSingleContent('about-cta-title', 'Hai să construim parteneriatul potrivit pentru compania ta.')}</h2>
                    <p data-editable-id="about-cta-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{adminDataService.getSingleContent('about-cta-subtitle', 'Contactează-ne pentru o ofertă personalizată de flotă.')}</p>
                    <button onClick={onQuoteClick} className="mt-8 bg-primary text-white font-bold px-8 py-3 rounded-btn hover:bg-primary-600 border-2 border-primary hover:border-primary-600 transition-colors">Solicită ofertă</button>
                </div>
            </section>
        </>
    );
};

export default AboutPage;
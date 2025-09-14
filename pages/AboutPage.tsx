
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import { TargetIcon, ArrowLeftRightIcon, ShieldCheckIcon, UsersIcon, CarIcon, CalendarIcon, StarIcon } from '../components/icons';
import Image from '../components/Image';
import Breadcrumbs from '../components/Breadcrumbs'; 
import { adminDataService } from '../utils/adminDataService';
import { ContentContext } from '../contexts/ContentContext';
import { TeamMember } from '../types';

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

const kpiData = [
    { icon: <CarIcon className="w-10 h-10 text-primary" />, value: "2.500+", label: "vehicule gestionate" },
    { icon: <UsersIcon className="w-10 h-10 text-primary" />, value: "200+", label: "clienți activi" },
    { icon: <CalendarIcon className="w-10 h-10 text-primary" />, value: "10", label: "ani de experiență" },
    { icon: <StarIcon className="w-10 h-10 text-primary" />, value: "98%", label: "satisfacție clienți" }
];

const AboutPage: React.FC = () => {
    const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
    const { getContent, isLoading: isContentLoading } = useContext(ContentContext)!;
    const [teamData, setTeamData] = useState<TeamMember[]>([]);
    const [isTeamLoading, setIsTeamLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            setIsTeamLoading(true);
            try {
                const team = await adminDataService.getTeamMembers();
                setTeamData(team);
            } catch (error) {
                console.error("Failed to load team members:", error);
            } finally {
                setIsTeamLoading(false);
            }
        };
        fetchTeam();
    }, []);
    
    const isLoading = isContentLoading || isTeamLoading;

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Se încarcă...</div>;
    }

    return (
        <>
            {/* Hero Section */}
            <section data-editable-id="about-hero-bg" className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: `url('${getContent('about-hero-bg', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&h=600&fit=crop&fm=jpg')}')` }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="about-hero-title" className="text-4xl md:text-5xl font-bold">{getContent('about-hero-title', 'Partenerul de încredere pentru mobilitatea afacerii tale')}</h1>
                    <p data-editable-id="about-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('about-hero-subtitle', 'Descoperă povestea, valorile și echipa care fac din Open Road Leasing liderul în soluții de mobilitate B2B.')}</p>
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
                            <h2 data-editable-id="about-mission-title" id="mission-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('about-mission-title', 'Misiunea Noastră: Mobilitate Simplificată')}</h2>
                            <p data-editable-id="about-mission-text" className="mt-4 text-muted dark:text-gray-400">{getContent('about-mission-text', 'Ne dedicăm să oferim companiilor soluții de mobilitate complete și predictibile, eliminând complexitatea administrării unei flote auto. Prin parteneriate strategice și servicii all-inclusive, permitem clienților noștri să se concentreze pe creșterea afacerii, având siguranța unei flote eficiente și mereu funcționale.')}</p>
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
                        <h2 data-editable-id="about-story-title" id="story-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('about-story-title', 'Povestea Noastră')}</h2>
                        <p data-editable-id="about-story-text" className="mt-4 text-muted dark:text-gray-400">{getContent('about-story-text', 'De la un startup ambițios la un jucător cheie pe piața de leasing operațional, parcursul nostru a fost definit de inovație și dedicare față de client.')}</p>
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
                        <h2 data-editable-id="about-team-title" id="team-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('about-team-title', 'Echipa din spatele succesului')}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamData.map((member, index) => (
                            <div key={member.name} className="bg-white dark:bg-gray-800 rounded-card shadow-soft text-center p-8">
                                <Image data-editable-id={`team-${index}-image`} src={member.image} alt={`Portret ${member.name}`} className="w-24 h-24 rounded-full mx-auto mb-4" />
                                <h3 data-editable-id={`team-${index}-name`} className="font-bold text-lg text-text-main dark:text-white">{member.name}</h3>
                                <p data-editable-id={`team-${index}-role`} className="text-sm text-primary font-medium">{member.role}</p>
                                <p data-editable-id={`team-${index}-quote`} className="text-sm text-muted dark:text-gray-400 mt-4 italic">"{member.quote}"</p>
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
                    <h2 data-editable-id="about-partners-title" id="partners-title" className="text-sm font-semibold text-muted dark:text-gray-400 uppercase tracking-wider mb-8">{getContent('about-partners-title', 'Companii care au încredere în noi')}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-8 grayscale opacity-60 dark:opacity-40">
                        {[...Array(6)].map((_, i) => (
                             <div key={i} className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded" title={`Logo Partener ${i + 1}`}></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section data-editable-id="about-cta-bg" className="relative bg-cover bg-center text-white" style={{ backgroundImage: `url('${getContent('about-cta-bg', 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1920&h=600&fit=crop&fm=jpg')}')` }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                 <div className="relative container mx-auto px-4 py-20 text-center">
                    <h2 data-editable-id="about-cta-title" className="text-4xl font-bold">{getContent('about-cta-title', 'Ești gata să îți optimizezi flota?')}</h2>
                    <p data-editable-id="about-cta-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('about-cta-subtitle', 'Contactează-ne pentru o ofertă personalizată și descoperă cum putem contribui la succesul afacerii tale.')}</p>
                    <button onClick={onQuoteClick} className="mt-8 bg-primary text-white font-bold px-8 py-3 rounded-btn hover:bg-primary-600 border-2 border-primary hover:border-primary-600 transition-colors">Solicită ofertă</button>
                </div>
            </section>
        </>
    );
};

export default AboutPage;

import React, { useContext } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import TCOCalculator from '../components/TCOCalculator';
import { EuroIcon, PiggyBankIcon, ShieldCheckIcon, WrenchIcon, CalculatorIcon } from '../components/icons';
import { ContentContext } from '../contexts/ContentContext';

const benefitsData = [
    { icon: <EuroIcon className="w-8 h-8 text-primary"/>, title: "Costuri previzibile", description: "Plăți lunare fixe, fără surprize bugetare." },
    { icon: <PiggyBankIcon className="w-8 h-8 text-primary"/>, title: "Zero investiție inițială", description: "Capitalul rămâne disponibil pentru afacerea ta." },
    { icon: <WrenchIcon className="w-8 h-8 text-primary"/>, title: "Administrare completă", description: "Noi ne ocupăm de revizii, asigurări și reparații." },
    { icon: <ShieldCheckIcon className="w-8 h-8 text-primary"/>, title: "Flexibilitate", description: "Flotă adaptată și ajustabilă nevoilor." },
]

const BenefitsPage: React.FC = () => {
    const { getContent, isLoading } = useContext(ContentContext)!;

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Se încarcă...</div>;
    }

    return (
        <>
            <section className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/benefits/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="benefits-hero-title" className="text-4xl md:text-5xl font-bold">{getContent('benefits-hero-title', 'Avantaje pentru companii')}</h1>
                    <p data-editable-id="benefits-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('benefits-hero-subtitle', 'De ce să alegi închirierea auto pe termen lung?')}</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefitsData.map(benefit => (
                             <div key={benefit.title} className="flex items-start space-x-4">
                                <div className="flex-shrink-0">{benefit.icon}</div>
                                <div>
                                    <h3 className="font-bold text-lg text-text-main dark:text-white">{benefit.title}</h3>
                                    <p className="text-sm text-muted dark:text-gray-400 mt-1">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Secțiune nouă pentru Calculatorul TCO */}
            <section className="py-20 bg-bg-alt dark:bg-gray-800" aria-labelledby="tco-title">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                         <CalculatorIcon className="w-12 h-12 text-primary mx-auto mb-4"/>
                        <h2 data-editable-id="benefits-tco-title" id="tco-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('benefits-tco-title', 'Calculator Cost Total de Proprietate (TCO)')}</h2>
                        <p data-editable-id="benefits-tco-subtitle" className="mt-4 text-muted dark:text-gray-400">{getContent('benefits-tco-subtitle', 'Estimează și compară costurile reale între leasingul operațional și achiziția directă a unui vehicul. Vezi exact cât poți economisi.')}</p>
                    </div>
                    <TCOCalculator />
                </div>
            </section>

            {/* Alte secțiuni pot fi adăugate aici */}
             <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 data-editable-id="benefits-extra-title" className="text-3xl font-bold text-text-main dark:text-white">{getContent('benefits-extra-title', 'Beneficii Financiare și Operaționale')}</h2>
                    <p data-editable-id="benefits-extra-subtitle" className="mt-4 text-muted dark:text-gray-400">{getContent('benefits-extra-subtitle', 'Această secțiune va detalia avantajele parteneriatului cu Open Road Leasing.')}</p>
                </div>
            </section>
        </>
    );
};

export default BenefitsPage;
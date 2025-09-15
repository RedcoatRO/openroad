import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-bg-alt dark:bg-gray-800 py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-main dark:text-white">Politica de Confidențialitate</h1>
                    <p className="mt-4 text-lg text-muted dark:text-gray-400">Angajamentul nostru pentru protejarea datelor tale.</p>
                    <div className="mt-8">
                        <Breadcrumbs />
                    </div>
                </div>
            </section>
            
            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose dark:prose-invert max-w-none space-y-6 text-muted dark:text-gray-400">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">1. Cine suntem?</h2>
                        <p>Open Road Leasing SRL, cu sediul în Bd. Exemplu 123, București, România, suntem operatorul datelor cu caracter personal pe care ni le furnizați prin intermediul acestui site web.</p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white">2. Ce date colectăm?</h2>
                        <p>Colectăm următoarele tipuri de date:</p>
                        <ul>
                            <li>Date de identificare și de contact (nume, prenume, email, telefon, denumire companie, CUI) atunci când completați formularele noastre de contact, solicitare ofertă sau programare.</li>
                            <li>Date tehnice (adresa IP, tip browser, sistem de operare) colectate automat prin cookie-uri și tehnologii similare.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white">3. În ce scop folosim datele?</h2>
                        <p>Utilizăm datele dumneavoastră pentru:</p>
                        <ul>
                            <li>A răspunde solicitărilor și a vă furniza ofertele cerute.</li>
                            <li>A procesa programările pentru consultații.</li>
                            <li>A îmbunătăți serviciile noastre și experiența pe site.</li>
                            <li>A vă trimite comunicări de marketing (newsletter), doar cu consimțământul dumneavoastră.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white">4. Drepturile dumneavoastră</h2>
                        <p>Conform GDPR, aveți următoarele drepturi:</p>
                        <ul>
                            <li>Dreptul de acces la date.</li>
                            <li>Dreptul la rectificarea datelor.</li>
                            <li>Dreptul la ștergerea datelor ("dreptul de a fi uitat").</li>
                            <li>Dreptul la restricționarea prelucrării.</li>
                            <li>Dreptul la portabilitatea datelor.</li>
                            <li>Dreptul la opoziție.</li>
                        </ul>
                        <p>Pentru a exercita aceste drepturi, ne puteți contacta la adresa de email <a href="mailto:gdpr@openroadleasing.com">gdpr@openroadleasing.com</a>.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PrivacyPolicyPage;
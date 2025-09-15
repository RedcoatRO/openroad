import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const TermsAndConditionsPage: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-bg-alt dark:bg-gray-800 py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-main dark:text-white">Termeni și Condiții</h1>
                    <p className="mt-4 text-lg text-muted dark:text-gray-400">Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</p>
                    <div className="mt-8">
                        <Breadcrumbs />
                    </div>
                </div>
            </section>
            
            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose dark:prose-invert max-w-none space-y-6 text-muted dark:text-gray-400">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">1. Introducere</h2>
                        <p>Bun venit la Open Road Leasing. Acești termeni și condiții descriu regulile și regulamentele pentru utilizarea site-ului web al Open Road Leasing. Prin accesarea acestui site web, presupunem că acceptați acești termeni și condiții. Nu continuați să utilizați Open Road Leasing dacă nu sunteți de acord să respectați toți termenii și condițiile enunțate pe această pagină.</p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white">2. Utilizarea Site-ului</h2>
                        <p>Aveți permisiunea de a utiliza site-ul nostru pentru scopuri proprii și pentru a imprima, descărca și partaja materiale de pe acest site, cu condiția să nu modificați niciun conținut fără consimțământul nostru scris. Materialele de pe acest site nu trebuie republicate online sau offline fără permisiunea noastră.</p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white">3. Drepturi de Proprietate Intelectuală</h2>
                        <p>Drepturile de autor și alte drepturi de proprietate intelectuală asupra tuturor materialelor de pe acest site sunt proprietatea noastră sau a licențiatorilor noștri și nu trebuie reproduse fără consimțământul nostru prealabil. Cu respectarea paragrafului de mai sus, nicio parte a acestui site nu poate fi reprodusă fără permisiunea noastră scrisă prealabilă.</p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white">4. Limitarea Răspunderii</h2>
                        <p>Informațiile de pe acest site sunt furnizate "ca atare", fără nicio garanție. Deși ne străduim să asigurăm că informațiile sunt corecte, nu garantăm completitudinea sau acuratețea acestora. Nu ne asumăm răspunderea pentru nicio pierdere sau daună directă sau indirectă rezultată din utilizarea acestui site.</p>
                        
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">5. Legea aplicabilă</h2>
                        <p>Acești termeni și condiții sunt guvernați de și interpretați în conformitate cu legile din România, și orice litigii legate de acești termeni și condiții vor fi supuse jurisdicției exclusive a instanțelor din București.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TermsAndConditionsPage;
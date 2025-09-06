
import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import DocumentItem from '../components/DocumentItem';

// Datele pentru documente (ar putea veni dintr-un API în viitor)
const documentsData = [
    {
        title: "Draft Contract de Leasing Operațional",
        description: "Un model standard al contractului nostru de leasing operațional. Acest document este furnizat în scop informativ.",
        fileUrl: "#download-draft-contract", // Placeholder
    },
    {
        title: "Termeni și Condiții Generale",
        description: "Documentul complet care guvernează termenii și condițiile serviciilor FleetLease Pro.",
        fileUrl: "#download-terms", // Placeholder
    },
    {
        title: "Politica de Confidențialitate (GDPR)",
        description: "Detalii complete despre cum colectăm, utilizăm și protejăm datele dumneavoastră personale.",
        fileUrl: "#download-privacy", // Placeholder
    },
    {
        title: "Ghid de Utilizare Vehicul",
        description: "Un ghid practic cu recomandări pentru întreținerea și utilizarea corectă a vehiculelor din flota noastră.",
        fileUrl: "#download-guide", // Placeholder
    },
];

const DocumentsPage: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/documents/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">Documente Utile</h1>
                    <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">Resurse și documente importante pentru partenerii noștri.</p>
                    <div className="mt-8">
                        <Breadcrumbs />
                    </div>
                </div>
            </section>
            
            {/* Lista de documente */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-6">
                            {documentsData.map((doc, index) => (
                                <DocumentItem
                                    key={index}
                                    title={doc.title}
                                    description={doc.description}
                                    fileUrl={doc.fileUrl}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DocumentsPage;

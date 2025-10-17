import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import DocumentItem from '../components/DocumentItem';

// Datele pentru documente au fost actualizate cu linkuri reale către Firebase Storage.
// Aceste linkuri permit descărcarea directă a fișierelor PDF.
const documentsData = [
    {
        title: "Draft Contract de Leasing Operațional",
        description: "Un model standard al contractului nostru de leasing operațional. Acest document este furnizat în scop informativ.",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/open-road-leasing.firebasestorage.app/o/documents%2FCONTRACT%20DE%20LEASING%20OPERA%C8%9AIONAL.pdf?alt=media&token=8e58e5f5-14bc-47ba-b11c-a10b951f7df1",
    },
    {
        title: "Termeni și Condiții Generale",
        description: "Documentul complet care guvernează termenii și condițiile serviciilor Open Road Leasing.",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/open-road-leasing.firebasestorage.app/o/documents%2FTERMENI%20%C8%98I%20CONDI%C8%9AII%20GENERALE.pdf?alt=media&token=6e4933ae-6ef8-4699-a298-1b0edfffac8a",
    },
    {
        title: "Politica de Confidențialitate (GDPR)",
        description: "Detalii complete despre cum colectăm, utilizăm și protejăm datele dumneavoastră personale.",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/open-road-leasing.firebasestorage.app/o/documents%2FPOLITICA%20DE%20CONFIDEN%C8%9AIALITATE.pdf?alt=media&token=82ee08eb-2caf-4f20-a956-bc3621f5b0ae",
    },
    {
        title: "Ghid de Utilizare Vehicul",
        description: "Un ghid practic cu recomandări pentru întreținerea și utilizarea corectă a vehiculelor din flota noastră.",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/open-road-leasing.firebasestorage.app/o/documents%2FGhid%20de%20Utilizare%20Vehicul.pdf?alt=media&token=a40945a2-17cc-4884-8c1c-845439572884",
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
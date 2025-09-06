
import React, { useEffect } from 'react';

interface StructuredDataProps {
  schema: object;
}

/**
 * O componentă care inserează un script JSON-LD în <head>-ul documentului.
 * Aceasta nu randează nimic vizibil în DOM-ul React.
 * Este utilă pentru adăugarea de date structurate (Schema.org) pentru SEO.
 * @param {object} schema - Obiectul JSON care reprezintă schema.
 */
const StructuredData: React.FC<StructuredDataProps> = ({ schema }) => {
  useEffect(() => {
    // Creează un element de tip script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    // Setează conținutul scriptului la obiectul schema, convertit în string JSON
    script.innerHTML = JSON.stringify(schema);
    
    // Adaugă scriptul la <head>-ul documentului
    document.head.appendChild(script);

    // Funcția de cleanup: elimină scriptul la demontarea componentei
    // Acest lucru este important în aplicațiile Single Page Application (SPA)
    // pentru a evita acumularea de scripturi la navigarea între pagini.
    return () => {
      document.head.removeChild(script);
    };
  }, [schema]); // Rulează efectul ori de câte ori obiectul schema se schimbă

  // Componenta nu randează nimic vizibil
  return null;
};

export default StructuredData;

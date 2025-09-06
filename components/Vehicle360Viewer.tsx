import React, { useEffect, useRef } from 'react';

// Extindem interfața Window pentru a informa TypeScript despre existența bibliotecii Pannellum,
// care este încărcată global printr-un tag <script> în index.html.
declare global {
    interface Window {
        pannellum: any;
    }
}

interface Vehicle360ViewerProps {
    src: string;
}

/**
 * Componenta de vizualizare 360° interactivă, utilizând biblioteca Pannellum.
 * Aceasta încarcă o imagine panoramică (equirectangulară) și permite utilizatorului
 * să navigheze liber în interiorul ei.
 * @param {string} src - URL-ul către imaginea panoramică.
 */
const Vehicle360Viewer: React.FC<Vehicle360ViewerProps> = ({ src }) => {
    // useRef este folosit pentru a obține o referință directă la elementul DOM
    // în care va fi randat vizualizatorul Pannellum.
    const viewerRef = useRef<HTMLDivElement>(null);

    // useEffect gestionează ciclul de viață al vizualizatorului:
    // - Inițializează Pannellum când componenta este montată sau când sursa (src) se schimbă.
    // - Distruge instanța Pannellum la demontarea componentei pentru a elibera resursele.
    useEffect(() => {
        // Verificăm dacă sursa imaginii și elementul container sunt disponibile.
        if (!src || !viewerRef.current) {
            return;
        }

        // Verificăm dacă biblioteca Pannellum a fost încărcată corect în `window`.
        if (typeof window.pannellum === 'undefined') {
            console.error("Biblioteca Pannellum nu este încărcată.");
            return;
        }

        // Inițializăm vizualizatorul Pannellum cu opțiunile dorite.
        // 'equirectangular' este tipul pentru imaginile panoramice 360°.
        // 'autoLoad: true' încarcă automat imaginea.
        const viewer = window.pannellum.viewer(viewerRef.current, {
            type: 'equirectangular',
            panorama: src,
            autoLoad: true,
            showControls: true, // Afișează butoanele de control (zoom, fullscreen)
            compass: false, // Dezactivăm busola pentru o interfață mai curată
        });

        // Funcția de cleanup: Aceasta este esențială în React.
        // Se execută la demontarea componentei (de ex. la închiderea modalului).
        // `viewer.destroy()` eliberează memoria și resursele utilizate de Pannellum,
        // prevenind memory leaks.
        return () => {
            viewer.destroy();
        };
    }, [src]); // Dependența `src` asigură re-inițializarea vizualizatorului dacă se schimbă imaginea (ex: de la exterior la interior).

    // Dacă nu există o sursă de imagine, afișăm un mesaj corespunzător.
    if (!src) {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-muted dark:text-gray-400">Vizualizare 360° indisponibilă.</p>
            </div>
        );
    }

    // Acesta este elementul container. Pannellum va prelua controlul asupra conținutului său.
    // Asigurăm că are dimensiuni complete pentru a umple spațiul alocat.
    return (
        <div ref={viewerRef} className="w-full h-full"></div>
    );
};

export default Vehicle360Viewer;
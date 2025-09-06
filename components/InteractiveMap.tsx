
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const InteractiveMap: React.FC = () => {
    const themeContext = useContext(ThemeContext);
    const isDarkMode = themeContext?.theme === 'dark';

    // URL-ul de embed de la Google Maps.
    // Cheia API nu este necesară pentru un embed simplu.
    const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.885311894038!2d26.10253841549426!3d44.43613587910207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff3f7e6f8a49%3A0x6a2c2c9d8f3a3c3b!2sPiata%20Universitatii!5e0!3m2!1sro!2sro!4v1626875952111!5m2!1sro!2sro";
    
    // Stilurile pentru iframe pot fi ajustate pentru a se potrivi cu tema dark.
    // Google Maps nu suportă un parametru "dark mode" direct în URL, 
    // dar putem aplica un filtru CSS pentru a ajusta vizual aspectul.
    const iframeStyle: React.CSSProperties = {
        filter: isDarkMode ? 'invert(90%) hue-rotate(180deg)' : 'none',
        transition: 'filter 0.3s ease-in-out',
    };

    return (
        <div className="w-full h-96 bg-gray-300 dark:bg-gray-700">
            <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, ...iframeStyle }}
                allowFullScreen={true}
                loading="lazy"
                title="Locație FleetLease Pro"
                aria-label="Harta cu locația sediului FleetLease Pro"
            ></iframe>
        </div>
    );
};

export default InteractiveMap;

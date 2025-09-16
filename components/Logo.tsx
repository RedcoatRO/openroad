import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

/**
 * Componenta centralizată pentru logo-ul Open Road Leasing.
 * SVG-ul este stilizat cu clase Tailwind pentru a se adapta automat
 * la tema selectată (light/dark).
 */
const Logo: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 180 26" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Folosim clase Tailwind pentru a permite adaptarea la tema dark. 
            'font-sans' asigură consistența cu restul site-ului. */}
        <text x="0" y="20" className="font-sans text-[20px] font-bold fill-text-main dark:fill-white">
            Open Road
            {/* Partea "Leasing" își schimbă culoarea în dark mode */}
            <tspan className="fill-muted dark:fill-gray-400"> Leasing</tspan>
        </text>
    </svg>
);

export default Logo;
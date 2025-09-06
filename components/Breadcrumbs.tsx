import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from './icons';

// Maparea segmentelor de URL către denumiri prietenoase
const pathnames: { [key: string]: string } = {
    'despre-noi': 'Despre noi',
    'servicii': 'Servicii',
    'masini': 'Mașini',
    'avantaje': 'Avantaje',
    'contact': 'Contact'
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    // Obține segmentele căii URL, eliminând elementele goale (de ex. de la primul '/')
    const pathSegments = location.pathname.split('/').filter(i => i);

    return (
        <nav aria-label="breadcrumb">
            <ol className="flex items-center justify-center text-xs text-blue-100 dark:text-blue-200">
                <li>
                    <NavLink to="/" className="hover:underline opacity-80">Acasă</NavLink>
                </li>
                {pathSegments.map((segment, index) => {
                    // Construiește calea completă până la segmentul curent
                    const routeTo = `/${pathSegments.slice(0, index + 1).join('/')}`;
                    // Verifică dacă este ultimul segment în cale
                    const isLast = index === pathSegments.length - 1;
                    // Obține denumirea prietenoasă sau folosește segmentul ca atare
                    const name = pathnames[segment] || segment;

                    return (
                        <li key={routeTo} className="flex items-center">
                            <ChevronRightIcon className="w-4 h-4 mx-1" />
                            {isLast ? (
                                <span className="font-semibold text-white">{name}</span>
                            ) : (
                                <NavLink to={routeTo} className="hover:underline opacity-80">{name}</NavLink>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
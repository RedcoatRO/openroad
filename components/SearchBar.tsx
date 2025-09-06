
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { SearchIcon, XIcon, CarIcon } from './icons';
import { vehiclesData } from '../data/vehicles';
import type { SearchResult } from '../types';

// Sursa de date centralizată pentru paginile site-ului
const pageData: SearchResult[] = [
    { type: 'page', title: 'Despre noi', path: '/despre-noi', description: 'Misiunea, valorile și echipa noastră.' },
    { type: 'page', title: 'Servicii', path: '/servicii', description: 'Soluții complete de mobilitate.' },
    { type: 'page', title: 'Mașini', path: '/masini', description: 'Vezi catalogul nostru complet.' },
    { type: 'page', title: 'Avantaje', path: '/avantaje', description: 'Beneficii financiare și operaționale.' },
    { type: 'page', title: 'Programare', path: '/programare', description: 'Programează o consultație online.' },
    { type: 'page', title: 'Contact', path: '/contact', description: 'Ia legătura cu echipa noastră.' },
];

const SearchBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Funcția de căutare cu debounce
    const performSearch = useCallback((currentQuery: string) => {
        if (currentQuery.length < 2) {
            setResults([]);
            return;
        }
        
        const lowerCaseQuery = currentQuery.toLowerCase();
        
        // Caută în vehicule
        const vehicleResults: SearchResult[] = vehiclesData
            .filter(v => v.model.toLowerCase().includes(lowerCaseQuery))
            .map(v => ({
                type: 'vehicle',
                title: v.model,
                description: `${v.type} • ${v.fuelType}`,
                path: `/masini` // Poate fi extins să ancoreze la vehicul
            }));
            
        // Caută în pagini
        const pageResults: SearchResult[] = pageData
            .filter(p => p.title.toLowerCase().includes(lowerCaseQuery) || p.description?.toLowerCase().includes(lowerCaseQuery))

        setResults([...vehicleResults, ...pageResults].slice(0, 6)); // Limitează la 6 rezultate
    }, []);

    // Efect pentru a implementa debounce la căutare
    useEffect(() => {
        const handler = setTimeout(() => {
            performSearch(query);
        }, 300); // Așteaptă 300ms după ce utilizatorul nu mai tastează

        return () => {
            clearTimeout(handler);
        };
    }, [query, performSearch]);

    // Efect pentru a închide căutarea la click în afara componentei
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Deschide bara de căutare și focusează input-ul
    const openSearch = () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <div ref={searchRef} className="relative">
            {!isOpen && (
                <button
                    onClick={openSearch}
                    className="p-2 rounded-full text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Deschide căutarea"
                >
                    <SearchIcon className="w-5 h-5" />
                </button>
            )}

            {isOpen && (
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-64 sm:w-80">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Caută vehicule sau pagini..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-border dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    </div>
                    {results.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 overflow-hidden">
                            <ul>
                                {results.map((result, index) => (
                                    <li key={index}>
                                        <NavLink 
                                            to={result.path} 
                                            onClick={() => { setIsOpen(false); setQuery(''); }}
                                            className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex-shrink-0 bg-bg-alt dark:bg-gray-700/50 p-2 rounded-md">
                                               {result.type === 'vehicle' ? <CarIcon className="w-5 h-5 text-primary"/> : <SearchIcon className="w-5 h-5 text-muted"/>}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-text-main dark:text-white">{result.title}</p>
                                                {result.description && <p className="text-xs text-muted dark:text-gray-400">{result.description}</p>}
                                            </div>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

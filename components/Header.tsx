
import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon, HeartIcon, SearchIcon } from './icons';
import { ThemeContext } from '../contexts/ThemeContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import SearchBar from './SearchBar';
import Image from './Image';
import { adminDataService } from '../utils/adminDataService';

interface HeaderProps {
    onQuoteClick: () => void;
    onFavoritesClick: () => void;
}

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const activeClassName = "text-primary font-semibold dark:text-primary";
    const inactiveClassName = "text-text-main hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors";
    
    return (
        <NavLink to={to} className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName}` }>
            {children}
        </NavLink>
    );
};

const ThemeToggle: React.FC = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        return null;
    }
    const { theme, toggleTheme } = context;

    return (
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Activează modul ${theme === 'light' ? 'întunecat' : 'luminos'}`}
        >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ onQuoteClick, onFavoritesClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const favoritesContext = useContext(FavoritesContext);
    const themeContext = useContext(ThemeContext);

    // Stare pentru a stoca conținutul editabil (ex: URL-ul logoului) din Firestore.
    const [contentOverrides, setContentOverrides] = useState<Record<string, string>>({});

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Stabilește un listener în timp real care actualizează starea
        // de fiecare dată când datele din `content/overrides` se schimbă în Firestore.
        const unsubscribe = adminDataService.listenToContentOverrides((data) => {
            setContentOverrides(data || {});
        });
        
        // Funcția de cleanup care elimină listener-ul la demontarea componentei
        // pentru a preveni memory leaks.
        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribe();
        };
    }, []);
    
    // Funcție ajutătoare pentru a obține conținutul unui element editabil.
    const getContent = (id: string) => contentOverrides[id] || '';

    // URL-uri SVG sub formă de data URI, folosite ca fallback dacă nu există un logo setat în admin.
    const DEFAULT_LOGO = "data:image/svg+xml,%3Csvg width='228' height='32' viewBox='0 0 228 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.text { font-family: Inter, sans-serif; font-size: 22px; font-weight: bold; }%3C/style%3E%3Ctext x='0' y='24' class='text' fill='%230B5FFF'%3EOpen Road %3Ctspan fill='%236B7280'%3ELeasing%3C/tspan%3E%3C/text%3E%3C/svg%3E";
    const DEFAULT_LOGO_DARK = "data:image/svg+xml,%3Csvg width='228' height='32' viewBox='0 0 228 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.text { font-family: Inter, sans-serif; font-size: 22px; font-weight: bold; }%3C/style%3E%3Ctext x='0' y='24' class='text' fill='%230B5FFF'%3EOpen Road %3Ctspan fill='%239CA3AF'%3ELeasing%3C/tspan%3E%3C/text%3E%3C/svg%3E";

    const navLinks = [
        { to: "/", label: "Acasă" },
        { to: "/despre-noi", label: "Despre noi" },
        { to: "/servicii", label: "Servicii" },
        { to: "/masini", label: "Mașini" },
        { to: "/avantaje", label: "Avantaje" },
        { to: "/programare", label: "Programare" },
        { to: "/documente-utile", label: "Documente" },
        { to: "/contact", label: "Contact" },
        // Link temporar pentru acces la admin
        { to: "/admin", label: "Admin" },
    ];

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-soft' : 'bg-white dark:bg-gray-900'}`}>
            <div className={`container mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
                <div className="flex justify-between items-center">
                    <NavLink to="/" aria-label="Open Road Leasing Homepage">
                        {/* Aici se afișează logoul corespunzător temei (light/dark).
                            Fiecare imagine are un ID unic (`data-editable-id`) pentru a putea fi modificată
                            din panoul de administrare (Editor Vizual). */}
                        {themeContext?.theme === 'dark' ? (
                            <Image
                                src={getContent('site-logo-dark') || getContent('site-logo') || DEFAULT_LOGO_DARK || DEFAULT_LOGO}
                                alt="Open Road Leasing"
                                data-editable-id="site-logo-dark"
                                className="h-8 w-auto"
                            />
                        ) : (
                            <Image
                                src={getContent('site-logo') || DEFAULT_LOGO}
                                alt="Open Road Leasing"
                                data-editable-id="site-logo"
                                className="h-8 w-auto"
                            />
                        )}
                    </NavLink>
                    
                    <nav className="hidden lg:flex items-center space-x-6">
                        {navLinks.map(link => <NavItem key={link.to} to={link.to}>{link.label}</NavItem>)}
                    </nav>

                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <SearchBar />
                        <ThemeToggle />
                        <button
                          onClick={onFavoritesClick}
                          className="p-2 rounded-full text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                          aria-label="Vezi vehiculele favorite"
                        >
                            <HeartIcon className="w-5 h-5"/>
                            {favoritesContext && favoritesContext.favoriteIds.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-xs">
                                    {favoritesContext.favoriteIds.length}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={onQuoteClick}
                            className="hidden lg:inline-block bg-primary text-white font-semibold px-6 py-2.5 rounded-btn hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                        >
                            Solicită ofertă
                        </button>

                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="lg:hidden p-2 rounded-md text-muted hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-border dark:border-gray-700">
                    <nav className="flex flex-col items-center space-y-4 p-4">
                       {navLinks.map(link => (
                          <NavLink 
                            key={link.to} 
                            to={link.to} 
                            onClick={() => setIsMenuOpen(false)}
                            className={({isActive}) => `w-full text-center py-2 rounded-md ${isActive ? 'bg-blue-50 dark:bg-blue-900/50 text-primary font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200'}`}
                          >
                            {link.label}
                          </NavLink>
                        ))}
                        <button 
                            onClick={() => {
                                onQuoteClick();
                                setIsMenuOpen(false);
                            }}
                            className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-btn hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 mt-4"
                        >
                            Solicită ofertă
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

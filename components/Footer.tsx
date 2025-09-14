
import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MailIcon, PhoneIcon, MapPinIcon } from './icons';
import Image from './Image';
import { adminDataService } from '../utils/adminDataService';
import { ThemeContext } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
    // Stări și logică pentru a face logoul dinamic și editabil, similar cu Header-ul.
    const themeContext = useContext(ThemeContext);
    const [contentOverrides, setContentOverrides] = useState<Record<string, string>>({});

    useEffect(() => {
        // Ascultă modificările din Firestore pentru conținutul editabil.
        const unsubscribe = adminDataService.listenToContentOverrides((data) => {
            setContentOverrides(data || {});
        });
        return () => unsubscribe();
    }, []);

    const getContent = (id: string) => contentOverrides[id] || '';
    const DEFAULT_LOGO = "data:image/svg+xml,%3Csvg width='228' height='32' viewBox='0 0 228 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.text { font-family: Inter, sans-serif; font-size: 22px; font-weight: bold; }%3C/style%3E%3Ctext x='0' y='24' class='text' fill='%230B5FFF'%3EOpen Road %3Ctspan fill='%236B7280'%3ELeasing%3C/tspan%3E%3C/text%3E%3C/svg%3E";
    const DEFAULT_LOGO_DARK = "data:image/svg+xml,%3Csvg width='228' height='32' viewBox='0 0 228 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.text { font-family: Inter, sans-serif; font-size: 22px; font-weight: bold; }%3C/style%3E%3Ctext x='0' y='24' class='text' fill='%230B5FFF'%3EOpen Road %3Ctspan fill='%239CA3AF'%3ELeasing%3C/tspan%3E%3C/text%3E%3C/svg%3E";


    return (
        <footer className="bg-bg-alt dark:bg-gray-800 text-muted dark:text-gray-400 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Col 1: Brand & Brief */}
                    <div className="space-y-4">
                        {/* Logoul este acum o imagine editabilă, la fel ca în Header */}
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
                        <p className="text-sm">Partenerul tău pentru mobilitate predictibilă și eficientă.</p>
                    </div>

                    {/* Col 2: Linkuri */}
                    <div>
                        <h3 className="text-text-main dark:text-white font-semibold mb-4">Linkuri</h3>
                        <ul className="space-y-2 text-sm">
                            <li><NavLink to="/" className="hover:text-primary transition-colors">Acasă</NavLink></li>
                            <li><NavLink to="/despre-noi" className="hover:text-primary transition-colors">Despre noi</NavLink></li>
                            <li><NavLink to="/servicii" className="hover:text-primary transition-colors">Servicii</NavLink></li>
                            <li><NavLink to="/masini" className="hover:text-primary transition-colors">Mașini</NavLink></li>
                            <li><NavLink to="/avantaje" className="hover:text-primary transition-colors">Avantaje</NavLink></li>
                            <li><NavLink to="/documente-utile" className="hover:text-primary transition-colors">Documente</NavLink></li>
                             <li><NavLink to="/program-recomandare" className="hover:text-primary transition-colors">Program de Recomandare</NavLink></li>
                            <li><NavLink to="/contact" className="hover:text-primary transition-colors">Contact</NavLink></li>
                        </ul>
                    </div>

                    {/* Col 3: Contact */}
                    <div>
                        <h3 className="text-text-main dark:text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <MailIcon className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />
                                <a href="mailto:office@openroadleasing.com" className="hover:text-primary transition-colors">office@openroadleasing.com</a>
                            </li>
                            <li className="flex items-start">
                                <PhoneIcon className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />
                                <a href="tel:+40744000000" className="hover:text-primary transition-colors">+40 744 000 000</a>
                            </li>
                            <li className="flex items-start">
                                <MapPinIcon className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />
                                <span>Bd. Exemplu 123, București</span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Newsletter */}
                    <div>
                        <h3 className="text-text-main dark:text-white font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm mb-4">Fii la curent cu ultimele noastre oferte și noutăți.</p>
                        <form className="flex">
                            <input type="email" placeholder="adresa@email.com" className="w-full px-3 py-2 text-sm border border-border dark:border-gray-600 rounded-l-md focus:ring-primary focus:border-primary focus:outline-none bg-white dark:bg-gray-700 dark:text-white" aria-label="Email for newsletter" />
                            <button type="submit" className="bg-primary text-white px-4 py-2 text-sm font-semibold rounded-r-md hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">Abonează-te</button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-border dark:border-gray-700 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
                    <p>&copy; {new Date().getFullYear()} Open Road Leasing. Toate drepturile rezervate.</p>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <a href="#" className="hover:text-primary transition-colors">Termeni și condiții</a>
                        <span className="text-gray-400 dark:text-gray-600">|</span>
                        <a href="#" className="hover:text-primary transition-colors">Politica de confidențialitate</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

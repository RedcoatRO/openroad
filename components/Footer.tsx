
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MailIcon, PhoneIcon, MapPinIcon } from './icons';
import { ContentContext } from '../contexts/ContentContext';
import { fallbackLogoUri } from '../utils/siteData';

const Footer: React.FC = () => {
    const contentContext = useContext(ContentContext);

    return (
        <footer className="bg-bg-alt dark:bg-gray-800 text-muted dark:text-gray-400 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Col 1: Brand & Brief */}
                    <div className="space-y-4">
                        <img 
                            data-editable-id="site-logo" 
                            src={contentContext?.getContent('site-logo', fallbackLogoUri)} 
                            alt="Open Road Leasing Logo" 
                            className="h-8 w-auto" 
                        />
                        <p data-editable-id="footer-brief" className="text-sm">{contentContext?.getContent('footer-brief', 'Partenerul tău pentru mobilitate predictibilă și eficientă.')}</p>
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
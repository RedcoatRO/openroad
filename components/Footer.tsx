import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MailIcon, PhoneIcon, MapPinIcon } from './icons';
import Logo from './Logo'; // Am importat noua componentă Logo
import { adminDataService } from '../utils/adminDataService';

const Footer: React.FC = () => {
    // Stări pentru gestionarea formularului de newsletter
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    // Funcție asincronă pentru a trimite emailul de abonare la newsletter
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail.includes('@')) { // Validare simplă
            alert("Te rugăm să introduci o adresă de email validă.");
            return;
        }
        setNewsletterStatus('submitting');
        try {
            // Salvează datele în colecția 'submissions' cu tipul 'newsletter'
            await adminDataService.addSubmission({ email: newsletterEmail }, 'newsletter');
            setNewsletterStatus('success');
            setNewsletterEmail('');
        } catch (error) {
            console.error("Failed to subscribe to newsletter:", error);
            alert("A apărut o eroare la abonare. Vă rugăm încercați din nou.");
            setNewsletterStatus('idle');
        }
    };


    return (
        <footer className="bg-bg-alt dark:bg-gray-800 text-muted dark:text-gray-400 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Col 1: Brand & Brief */}
                    <div className="space-y-4">
                        {/* Logoul este acum componenta statică, la fel ca în Header */}
                        <Logo className="h-32 w-auto" />
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
                                <a href="mailto:office@openroad.ro" className="hover:text-primary transition-colors">office@openroadleasing.com</a>
                            </li>
                            <li className="flex items-start">
                                <PhoneIcon className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />
                                <a href="tel:+40792313921" className="hover:text-primary transition-colors">+40 744 000 000</a>
                            </li>
                            <li className="flex items-start">
                                <MapPinIcon className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />
                                <span>Str. Copilului 6-12, Sc. E, Sector 1 , București, România</span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Newsletter */}
                    <div>
                        <h3 className="text-text-main dark:text-white font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm mb-4">Fii la curent cu ultimele noastre oferte și noutăți.</p>
                        {newsletterStatus === 'success' ? (
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-sm font-semibold rounded-md">
                                Mulțumim pentru abonare!
                            </div>
                        ) : (
                             <form onSubmit={handleNewsletterSubmit} className="flex">
                                <input 
                                    type="email" 
                                    placeholder="adresa@email.com" 
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    disabled={newsletterStatus === 'submitting'}
                                    className="w-full px-3 py-2 text-sm border border-border dark:border-gray-600 rounded-l-md focus:ring-primary focus:border-primary focus:outline-none bg-white dark:bg-gray-700 dark:text-white" aria-label="Email for newsletter" />
                                <button type="submit" disabled={newsletterStatus === 'submitting'} className="bg-primary text-white px-4 py-2 text-sm font-semibold rounded-r-md hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-400">
                                     {newsletterStatus === 'submitting' ? '...' : 'Abonează-te'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-border dark:border-gray-700 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
                    <p>&copy; {new Date().getFullYear()} Open Road Leasing. Toate drepturile rezervate.</p>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        {/* Linkurile au fost transformate în NavLink pentru a naviga corect în aplicație */}
                        <NavLink to="/termeni-si-conditii" className="hover:text-primary transition-colors">Termeni și condiții</NavLink>
                        <span className="text-gray-400 dark:text-gray-600">|</span>
                        <NavLink to="/politica-de-confidentialitate" className="hover:text-primary transition-colors">Politica de confidențialitate</NavLink>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
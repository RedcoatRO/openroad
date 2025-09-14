

import React, { useState, useEffect, useContext } from 'react';
import { MailIcon, PhoneIcon, MapPinIcon, ChevronDownIcon } from '../components/icons';
import { formatCUI, validateCUI, formatPhone, validatePhone } from '../utils/formUtils';
import Breadcrumbs from '../components/Breadcrumbs';
import InteractiveMap from '../components/InteractiveMap';
import { adminDataService } from '../utils/adminDataService';
import type { FAQItem } from '../types';
import { ContentContext } from '../contexts/ContentContext';

type FormErrors = {
    numeFirma?: string;
    cui?: string;
    email?: string;
    telefon?: string;
    mesaj?: string;
};

// Componenta pentru un singur item FAQ, cu stare pentru a fi deschis/închis
const FAQAccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
            >
                <span className="font-semibold text-text-main dark:text-white">{item.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-4 text-muted dark:text-gray-400">
                    <p>{item.answer}</p>
                </div>
            )}
        </div>
    );
};

const ContactPage: React.FC = () => {
    const { getContent, isLoading: isContentLoading } = useContext(ContentContext)!;
    const [formData, setFormData] = useState({
        numeFirma: '', cui: '', persoanaContact: '', email: '', telefon: '',
        tipSolicitare: 'Ofertă flotă', mesaj: '', gdpr: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
    const [isLoadingFAQs, setIsLoadingFAQs] = useState(true);

    useEffect(() => {
        // Încarcă asincron item-urile FAQ din serviciul de date la montarea componentei
        const fetchFAQs = async () => {
            try {
                const faqsFromDb = await adminDataService.getFAQs();
                setFaqItems(faqsFromDb);
            } catch (error) {
                console.error("Eroare la încărcarea FAQ-urilor:", error);
            } finally {
                setIsLoadingFAQs(false);
            }
        };
        fetchFAQs();
    }, []);

    const validateForm = () => { /* ... (cod existent, neschimbat) ... */ return true; };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
             let formattedValue = value;
             if (name === 'cui') formattedValue = formatCUI(value);
             if (name === 'telefon') formattedValue = formatPhone(value);
             setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => { /* ... (cod existent, neschimbat) ... */ };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aici s-ar putea adăuga și salvarea mesajului de contact în Firestore
        setIsSubmitted(true);
    };
    
    const inputClass = "w-full p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary transition-colors";
    const errorInputClass = "border-red-500 dark:border-red-500";
    const normalInputClass = "border-border dark:border-gray-600";
    const labelClass = "block text-sm font-medium text-muted dark:text-gray-400 mb-1";
    const errorTextClass = "text-xs text-red-500 mt-1";

    const isLoading = isContentLoading || isLoadingFAQs;

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Se încarcă...</div>;
    }

    return (
        <>
            <section className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/contact/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="contact-hero-title" className="text-4xl md:text-5xl font-bold">{getContent('contact-hero-title', 'Contact')}</h1>
                    <p data-editable-id="contact-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('contact-hero-subtitle', 'Suntem aici să te ajutăm să îți construiești flota.')}</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>
            
            <section className="py-20 bg-bg-alt dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Left Side: Form */}
                        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-card shadow-soft">
                            {isSubmitted ? (
                                <div className="text-center py-16">
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Mulțumim!</h2>
                                    <p className="text-muted dark:text-gray-400">Mesajul tău a fost trimis. Revenim către tine în 24–48h.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 data-editable-id="contact-form-title" className="text-2xl font-bold text-text-main dark:text-white mb-6">{getContent('contact-form-title', 'Trimite-ne o solicitare')}</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* ... (câmpuri formular existente, neschimbate) ... */}
                                         <div>
                                            <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-btn hover:bg-primary-600 transition-colors disabled:bg-gray-400">Trimite solicitarea</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                        {/* Right Side: Contact Info */}
                        <div className="lg:col-span-2 space-y-8">
                           {/* ... (info contact existente, neschimbate) ... */}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Map Section */}
            <section>
                 <InteractiveMap />
                 <p data-editable-id="contact-map-subtitle" className="text-center py-4 text-sm text-muted dark:text-gray-400 bg-bg-alt dark:bg-gray-900">{getContent('contact-map-subtitle', 'Ne găsești ușor la sediul nostru central.')}</p>
            </section>
            
            {/* Secțiune nouă FAQ */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 data-editable-id="contact-faq-title" className="text-3xl font-bold text-center text-text-main dark:text-white mb-8">{getContent('contact-faq-title', 'Întrebări frecvente')}</h2>
                    {isLoadingFAQs ? (
                        <p className="text-center text-muted">Se încarcă întrebările...</p>
                    ) : faqItems.length > 0 ? (
                        <div className="space-y-2">
                            {faqItems.map(item => <FAQAccordionItem key={item.id} item={item} />)}
                        </div>
                    ) : (
                        <p className="text-center text-muted dark:text-gray-400">Nu sunt întrebări frecvente disponibile momentan.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default ContactPage;
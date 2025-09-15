import React, { useState, useEffect } from 'react';
import { MailIcon, PhoneIcon, MapPinIcon } from '../components/icons';
import { formatCUI, validateCUI, formatPhone, validatePhone } from '../utils/formUtils';
import Breadcrumbs from '../components/Breadcrumbs';
import InteractiveMap from '../components/InteractiveMap';
import { adminDataService } from '../utils/adminDataService';
import type { FAQItem } from '../types';
import FAQAccordionItem from '../components/FAQAccordionItem'; // Am importat noua componentă

type FormErrors = {
    numeFirma?: string;
    cui?: string;
    email?: string;
    telefon?: string;
    mesaj?: string;
};

// Componenta FAQAccordionItem a fost mutată într-un fișier separat (components/FAQAccordionItem.tsx)
// pentru a respecta structura proiectului și pentru a fi reutilizabilă.

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        numeFirma: '', cui: '', persoanaContact: '', email: '', telefon: '',
        tipSolicitare: 'Ofertă flotă', mesaj: '', gdpr: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    // Funcția handleSubmit a fost actualizată pentru a fi asincronă și a salva datele
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Salvează datele în colecția 'submissions' cu tipul 'contact'
            await adminDataService.addSubmission(formData, 'contact');
            setIsSubmitted(true);
        } catch (error) {
            console.error("Failed to submit contact form:", error);
            alert("A apărut o eroare la trimiterea mesajului. Vă rugăm încercați din nou.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const inputClass = "w-full p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary transition-colors";
    const labelClass = "block text-sm font-medium text-muted dark:text-gray-400 mb-1";

    return (
        <>
            <section className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/contact/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">Contact</h1>
                    <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">Suntem aici să te ajutăm să îți construiești flota.</p>
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
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-6">Trimite-ne o solicitare</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div><label className={labelClass}>Nume Firmă</label><input type="text" name="numeFirma" required className={inputClass} onChange={handleInputChange} /></div>
                                            <div><label className={labelClass}>CUI</label><input type="text" name="cui" value={formData.cui} required className={inputClass} onChange={handleInputChange}/></div>
                                            <div><label className={labelClass}>Persoană Contact</label><input type="text" name="persoanaContact" required className={inputClass} onChange={handleInputChange} /></div>
                                            <div><label className={labelClass}>Telefon</label><input type="tel" name="telefon" value={formData.telefon} required className={inputClass} onChange={handleInputChange} /></div>
                                            <div className="sm:col-span-2"><label className={labelClass}>Email</label><input type="email" name="email" required className={inputClass} onChange={handleInputChange} /></div>
                                            <div className="sm:col-span-2"><label className={labelClass}>Tip Solicitare</label><select name="tipSolicitare" className={inputClass} onChange={handleInputChange}><option>Ofertă flotă</option><option>Întrebare generală</option><option>Parteneriat</option></select></div>
                                            <div className="sm:col-span-2"><label className={labelClass}>Mesajul tău</label><textarea name="mesaj" rows={5} required className={inputClass} onChange={handleInputChange}></textarea></div>
                                        </div>
                                         <div>
                                            <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-semibold py-3 rounded-btn hover:bg-primary-600 transition-colors disabled:bg-gray-400">
                                                {isSubmitting ? 'Se trimite...' : 'Trimite solicitarea'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                        {/* Right Side: Contact Info */}
                        <div className="lg:col-span-2 space-y-8">
                           <div className="flex items-start">
                               <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mr-4"><MailIcon className="w-6 h-6 text-primary"/></div>
                               <div>
                                   <h3 className="font-bold text-lg text-text-main dark:text-white">Email</h3>
                                   <p className="text-muted dark:text-gray-400">Pentru întrebări generale sau oferte.</p>
                                   <a href="mailto:office@openroadleasing.com" className="text-primary font-semibold hover:underline">office@openroadleasing.com</a>
                               </div>
                           </div>
                           <div className="flex items-start">
                                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mr-4"><PhoneIcon className="w-6 h-6 text-primary"/></div>
                               <div>
                                   <h3 className="font-bold text-lg text-text-main dark:text-white">Telefon</h3>
                                   <p className="text-muted dark:text-gray-400">Contactează-ne direct pentru o discuție rapidă.</p>
                                   <a href="tel:+40744000000" className="text-primary font-semibold hover:underline">+40 744 000 000</a>
                               </div>
                           </div>
                           <div className="flex items-start">
                                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mr-4"><MapPinIcon className="w-6 h-6 text-primary"/></div>
                               <div>
                                   <h3 className="font-bold text-lg text-text-main dark:text-white">Sediu</h3>
                                   <p className="text-muted dark:text-gray-400">Bd. Exemplu 123, Etaj 4, București, România</p>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Map Section */}
            <section>
                 <InteractiveMap />
                 <p className="text-center py-4 text-sm text-muted dark:text-gray-400 bg-bg-alt dark:bg-gray-900">Ne găsești ușor la sediul nostru central.</p>
            </section>
            
            {/* Secțiune nouă FAQ */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center text-text-main dark:text-white mb-8">Întrebări frecvente</h2>
                    {/* Logica de afișare pentru FAQ */}
                    {isLoadingFAQs ? (
                        <p className="text-center text-muted">Se încarcă întrebările...</p>
                    ) : faqItems.length > 0 ? (
                        <div className="space-y-2">
                            {/* Folosim componenta importată pentru a randa fiecare item */}
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

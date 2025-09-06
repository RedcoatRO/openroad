
import React, { useState } from 'react';
import { formatCUI, validateCUI, formatPhone, validatePhone } from '../utils/formUtils';
import type { FleetItem, QuoteRequest } from '../types';
import FleetBuilder from './FleetBuilder';
import { adminDataService } from '../utils/adminDataService'; // Importăm serviciul

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FormErrors = {
    cui?: string;
    phone?: string;
};

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '', cui: '', contactPerson: '', email: '', phone: '',
        fleet: [] as FleetItem[], 
        notes: '', gdpr: false,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    if (!isOpen) return null;
    
    const hasErrorsInStep1 = !!errors.cui || !!errors.phone;
    const isFleetEmpty = formData.fleet.length === 0;

    const handleNext = () => {
        if (step === 1 && hasErrorsInStep1) return;
        if (step === 2 && isFleetEmpty) return;
        setStep(prev => prev + 1);
    };
    const handleBack = () => setStep(prev => prev - 1);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasErrorsInStep1 || isFleetEmpty) return;
        
        // Creăm un obiect de tip QuoteRequest și îl salvăm
        const newRequest: Omit<QuoteRequest, 'id' | 'date' | 'status'> = {
            ...formData
        };
        adminDataService.addRequest(newRequest);
        
        console.log('Form Submitted and Saved to localStorage:', newRequest);
        setIsSubmitted(true);
    };
    
    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep(1);
            setIsSubmitted(false);
            setErrors({});
            setFormData({
                companyName: '', cui: '', contactPerson: '', email: '', phone: '',
                fleet: [], notes: '', gdpr: false,
            });
        }, 300);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            let formattedValue = value;
            if (name === 'cui') formattedValue = formatCUI(value);
            if (name === 'phone') formattedValue = formatPhone(value);
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let error: string | null = null;
        if (name === 'cui') error = validateCUI(value);
        if (name === 'phone') error = validatePhone(value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleFleetChange = (newFleet: FleetItem[]) => {
        setFormData(prev => ({ ...prev, fleet: newFleet }));
    };
    
    const inputClass = "w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary";
    const errorInputClass = "border-red-500 dark:border-red-500";
    const normalInputClass = "border-border dark:border-gray-600";
    const labelClass = "block text-sm font-medium text-muted dark:text-gray-400 mb-1";
    const errorTextClass = "text-xs text-red-500 mt-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-white dark:bg-gray-800 rounded-card shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 sm:p-8 border-b border-border dark:border-gray-700 flex-shrink-0">
                    <div className="flex justify-between items-start">
                       <div>
                            {!isSubmitted && <span className="text-xs text-muted dark:text-gray-400 font-semibold tracking-wider uppercase">Pasul {step} din 3</span>}
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mt-1">
                                {isSubmitted ? 'Solicitare trimisă!' : 'Solicitare Ofertă Personalizată'}
                            </h2>
                       </div>
                        <button onClick={handleClose} className="text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-white">&times;</button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {isSubmitted ? (
                        <div className="text-center py-12 flex flex-col justify-center items-center h-full">
                            <p className="text-lg text-text-main dark:text-white mb-2">Mulțumim!</p>
                            <p className="text-muted dark:text-gray-400">Solicitarea a fost trimisă și administratorii au fost notificați. Te contactăm în 24–48h.</p>
                            <button onClick={handleClose} className="mt-8 bg-primary text-white font-semibold px-6 py-2.5 rounded-btn hover:bg-primary-600 transition-colors">Închide</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                           <div className="p-6 sm:p-8 flex-grow">
                                {/* Step 1 */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-text-main dark:text-white mb-2">Date companie</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div><label className={labelClass}>Denumire firmă</label><input type="text" name="companyName" required className={`${inputClass} ${normalInputClass}`} onChange={handleInputChange} /></div>
                                            <div>
                                                <label className={labelClass}>CUI</label>
                                                <input type="text" name="cui" value={formData.cui} required className={`${inputClass} ${errors.cui ? errorInputClass : normalInputClass}`} onChange={handleInputChange} onBlur={handleBlur} />
                                                {errors.cui && <p className={errorTextClass}>{errors.cui}</p>}
                                            </div>
                                            <div><label className={labelClass}>Persoană de contact</label><input type="text" name="contactPerson" required className={`${inputClass} ${normalInputClass}`} onChange={handleInputChange} /></div>
                                            <div><label className={labelClass}>Email</label><input type="email" name="email" required className={`${inputClass} ${normalInputClass}`} onChange={handleInputChange} /></div>
                                            <div>
                                                <label className={labelClass}>Telefon</label>
                                                <input type="tel" name="phone" value={formData.phone} required className={`${inputClass} ${errors.phone ? errorInputClass : normalInputClass}`} onChange={handleInputChange} onBlur={handleBlur} />
                                                {errors.phone && <p className={errorTextClass}>{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Fleet Builder */}
                                {step === 2 && (
                                    <FleetBuilder
                                        currentFleet={formData.fleet}
                                        onFleetChange={handleFleetChange}
                                    />
                                )}

                                {/* Step 3 */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-text-main dark:text-white mb-2">Comentarii finale</h3>
                                        <div>
                                            <label className={labelClass}>Alte note sau preferințe</label>
                                            <textarea name="notes" rows={6} className={`${inputClass} ${normalInputClass}`} onChange={handleInputChange} placeholder="Ex: Mărci preferate, dată de livrare dorită etc."></textarea>
                                        </div>
                                        <div className="flex items-start pt-4">
                                            <input type="checkbox" id="gdpr" name="gdpr" required className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mt-1" onChange={handleInputChange} />
                                            <label htmlFor="gdpr" className="ml-2 block text-sm text-muted dark:text-gray-400">Sunt de acord cu prelucrarea datelor.</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Navigation */}
                            <div className="p-6 sm:p-8 border-t border-border dark:border-gray-700 flex-shrink-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        {step > 1 && <button type="button" onClick={handleBack} className="text-muted dark:text-gray-400 font-semibold px-4 py-2 rounded-btn hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Înapoi</button>}
                                    </div>
                                    <div>
                                        {step < 3 && <button type="button" onClick={handleNext} disabled={(step === 1 && hasErrorsInStep1) || (step === 2 && isFleetEmpty)} className="bg-primary text-white font-semibold px-6 py-2.5 rounded-btn hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">Continuă</button>}
                                        {step === 3 && <button type="submit" className="bg-accent text-white font-bold px-8 py-2.5 rounded-btn hover:bg-green-600 transition-colors">Trimite solicitarea</button>}
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuoteModal;

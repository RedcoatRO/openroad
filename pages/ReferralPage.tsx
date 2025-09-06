
import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { GiftIcon, Share2Icon, CheckCircleIcon } from '../components/icons';

const ReferralPage: React.FC = () => {
    const [formData, setFormData] = useState({
        referrerName: '', referrerCompany: '', referrerEmail: '',
        referredName: '', referredCompany: '', referredEmail: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulare trimitere
        console.log("Recomandare trimisă:", formData);
        setIsSubmitted(true);
    };
    
    const inputClass = "w-full p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm";
    const labelClass = "block text-xs font-medium text-muted dark:text-gray-400 mb-1";

    return (
        <>
            {/* Hero Section */}
            <section className="bg-bg-alt dark:bg-gray-800 py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-main dark:text-white">Program de Recomandare</h1>
                    <p className="mt-4 text-lg text-muted dark:text-gray-400 max-w-2xl mx-auto">Recomandă-ne și câștigă! Parteneriatele de succes merită recompensate.</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>
            
            {/* How it works */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-text-main dark:text-white">Cum funcționează? Simplu în 3 pași.</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <Share2Icon className="w-12 h-12 text-primary mx-auto mb-4"/>
                            <h3 className="font-bold text-lg">1. Recomandă</h3>
                            <p className="text-sm text-muted">Spune-le partenerilor tăi de afaceri despre serviciile noastre.</p>
                        </div>
                        <div>
                            <CheckCircleIcon className="w-12 h-12 text-accent mx-auto mb-4"/>
                            <h3 className="font-bold text-lg">2. Contract Semnat</h3>
                            <p className="text-sm text-muted">Când compania recomandată semnează un contract cu noi...</p>
                        </div>
                        <div>
                            <GiftIcon className="w-12 h-12 text-primary mx-auto mb-4"/>
                            <h3 className="font-bold text-lg">3. Câștigă</h3>
                            <p className="text-sm text-muted">...primești un beneficiu (ex: reducere la factura ta lunară).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4">
                     <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900/50 p-8 rounded-card shadow-lg">
                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <h2 className="text-2xl font-bold text-text-main dark:text-white">Recomandare trimisă!</h2>
                                <p className="mt-2 text-muted dark:text-gray-400">Mulțumim! Vom lua legătura cu persoana recomandată și te vom ține la curent.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-center text-text-main dark:text-white mb-8">Trimite o recomandare</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Referrer Details */}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Datele tale</h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div><label className={labelClass}>Numele tău</label><input type="text" name="referrerName" required onChange={handleInputChange} className={inputClass} /></div>
                                            <div><label className={labelClass}>Compania ta</label><input type="text" name="referrerCompany" required onChange={handleInputChange} className={inputClass} /></div>
                                            <div className="sm:col-span-2"><label className={labelClass}>Email-ul tău</label><input type="email" name="referrerEmail" required onChange={handleInputChange} className={inputClass} /></div>
                                        </div>
                                    </div>
                                    {/* Referred Details */}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Datele companiei recomandate</h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div><label className={labelClass}>Nume contact</label><input type="text" name="referredName" required onChange={handleInputChange} className={inputClass} /></div>
                                            <div><label className={labelClass}>Nume companie</label><input type="text" name="referredCompany" required onChange={handleInputChange} className={inputClass} /></div>
                                            <div className="sm:col-span-2"><label className={labelClass}>Email contact</label><input type="email" name="referredEmail" required onChange={handleInputChange} className={inputClass} /></div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-btn hover:bg-primary-600 transition-colors">Trimite recomandarea</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ReferralPage;



import React, { useState, useContext } from 'react';
import BookingCalendar from '../components/BookingCalendar';
import Breadcrumbs from '../components/Breadcrumbs';
import { ClockIcon, UsersIcon, PhoneIcon, MailIcon } from '../components/icons';
import { adminDataService } from '../utils/adminDataService';
import { ContentContext } from '../contexts/ContentContext';

// Intervale orare disponibile (hardcodate pentru demonstrație)
const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

const BookingPage: React.FC = () => {
    const { getContent, isLoading: isContentLoading } = useContext(ContentContext)!;
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Resetează ora la selectarea unei noi date
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Salvează datele programării în Firestore
            const bookingData = { 
                ...formData, 
                date: selectedDate?.toISOString() || new Date().toISOString(), 
                time: selectedTime 
            };
            await adminDataService.addBooking(bookingData);
            
            console.log("Programare trimisă:", bookingData);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Eroare la trimiterea programării:", error);
            alert("A apărut o eroare. Vă rugăm încercați din nou.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const inputClass = "w-full p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm";
    const labelClass = "block text-xs font-medium text-muted dark:text-gray-400 mb-1";

    if (isContentLoading) {
        return <div className="h-screen flex items-center justify-center">Se încarcă...</div>;
    }

    if (isSubmitted) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                 <h1 className="text-3xl font-bold text-text-main dark:text-white">Programare confirmată!</h1>
                 <p className="mt-4 text-muted dark:text-gray-400">
                    Mulțumim, {formData.name}! Consultația ta pentru data de <strong>{selectedDate?.toLocaleDateString('ro-RO')}</strong>, ora <strong>{selectedTime}</strong>, a fost înregistrată.
                 </p>
                 <p className="text-sm text-muted dark:text-gray-400 mt-2">Vei primi un email de confirmare în scurt timp.</p>
            </div>
        );
    }

    return (
        <>
            <section className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/booking/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="booking-hero-title" className="text-4xl md:text-5xl font-bold">{getContent('booking-hero-title', 'Programează o consultație')}</h1>
                    <p data-editable-id="booking-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('booking-hero-subtitle', 'Discută cu un expert despre nevoile flotei tale.')}</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>
            
            <section className="py-20 bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-gray-900/50 p-8 rounded-card shadow-lg">
                        {/* Partea stângă: Calendar și Ore */}
                        <div>
                            <div>
                                <h2 className="font-bold text-lg text-text-main dark:text-white mb-2">1. Alege o dată</h2>
                                <BookingCalendar onDateSelect={handleDateSelect} />
                            </div>

                            {selectedDate && (
                                <div className="mt-6">
                                    <h2 className="font-bold text-lg text-text-main dark:text-white mb-3">2. Alege o oră</h2>
                                    <div className="grid grid-cols-3 gap-2">
                                        {timeSlots.map(time => (
                                            <button 
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`p-2 rounded-md text-sm font-semibold transition-colors border ${selectedTime === time ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-700 text-muted dark:text-gray-300 border-border dark:border-gray-600 hover:border-primary hover:text-primary'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Partea dreaptă: Formular */}
                        <div>
                           <h2 className="font-bold text-lg text-text-main dark:text-white mb-2">3. Completează datele</h2>
                           {selectedDate && selectedTime ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-md text-sm font-semibold text-blue-800 dark:text-blue-200">
                                        Data selectată: {selectedDate.toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} la ora {selectedTime}
                                    </div>
                                     <div><label className={labelClass}>Nume complet</label><input type="text" name="name" required onChange={handleInputChange} className={inputClass} /></div>
                                     <div><label className={labelClass}>Nume companie</label><input type="text" name="company" required onChange={handleInputChange} className={inputClass} /></div>
                                     <div><label className={labelClass}>Email</label><input type="email" name="email" required onChange={handleInputChange} className={inputClass} /></div>
                                     <div><label className={labelClass}>Telefon</label><input type="tel" name="phone" required onChange={handleInputChange} className={inputClass} /></div>
                                     <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-3 rounded-btn hover:bg-primary-600 transition-colors disabled:bg-gray-400">
                                         {isSubmitting ? 'Se confirmă...' : 'Confirmă programarea'}
                                     </button>
                                </form>
                           ) : (
                               <div className="h-full flex items-center justify-center text-center p-8 bg-bg-alt dark:bg-gray-800 rounded-md">
                                   <p className="text-muted dark:text-gray-400">Te rugăm să selectezi o dată și o oră pentru a continua.</p>
                               </div>
                           )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BookingPage;
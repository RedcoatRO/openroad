
import React, { useState } from 'react';
import type { Vehicle } from '../types';
import { XIcon, BellIcon } from './icons';

interface StockAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}

const StockAlertModal: React.FC<StockAlertModalProps> = ({ isOpen, onClose, vehicle }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen || !vehicle) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulare salvare: salvăm în localStorage un obiect cu email-ul și ID-ul vehiculului
        const subscriptions = JSON.parse(localStorage.getItem('stockSubscriptions') || '[]');
        subscriptions.push({ email, vehicleId: vehicle.id, model: vehicle.model });
        localStorage.setItem('stockSubscriptions', JSON.stringify(subscriptions));
        
        console.log(`Subscribed ${email} for alerts on ${vehicle.model}`);
        setIsSubmitted(true);
    };
    
    // Resetarea stării la închidere
    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setEmail('');
            setIsSubmitted(false);
        }, 300); // Așteaptă finalizarea animației de ieșire
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-white dark:bg-gray-800 rounded-card shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 flex justify-between items-start border-b border-border dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                           <BellIcon className="w-5 h-5 text-primary"/> 
                           {isSubmitted ? 'Notificare setată!' : 'Setează alertă stoc'}
                        </h2>
                        {!isSubmitted && <p className="text-sm text-muted dark:text-gray-400 mt-1">Pentru modelul: <strong>{vehicle.model}</strong></p>}
                    </div>
                    <button onClick={handleClose} className="text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-white p-1 -mt-1 -mr-1">&times;</button>
                </div>

                <div className="p-8">
                    {isSubmitted ? (
                        <div className="text-center">
                            <p className="text-text-main dark:text-white">Te vom anunța pe adresa <strong>{email}</strong> imediat ce vehiculul revine în stoc.</p>
                            <button onClick={handleClose} className="mt-6 w-full bg-primary text-white font-semibold py-2.5 rounded-btn hover:bg-primary-600 transition-colors">
                                Închide
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p className="text-sm text-muted dark:text-gray-400 mb-4">
                                Acest model este momentan indisponibil. Introdu adresa ta de email și te vom anunța automat când va fi din nou disponibil pentru închiriere.
                            </p>
                            <div>
                                <label htmlFor="stock-email" className="block text-sm font-medium text-muted dark:text-gray-400 mb-1">Adresă de email</label>
                                <input
                                    id="stock-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="nume@companie.ro"
                                    className="w-full p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <button type="submit" className="mt-6 w-full bg-primary text-white font-semibold py-2.5 rounded-btn hover:bg-primary-600 transition-colors">
                                Trimite
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockAlertModal;

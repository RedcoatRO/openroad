import React, { useContext } from 'react';
import { XIcon, HeartIcon } from './icons';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { vehiclesData } from '../data/vehicles';
import VehicleCard from './VehicleCard';
import type { Vehicle } from '../types';

// FIX: Add onStockAlertClick to the props interface to be able to pass it down.
interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onQuoteClick: (model: string) => void;
    onViewDetails: (vehicle: Vehicle) => void;
    onStockAlertClick: (vehicle: Vehicle) => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose, onQuoteClick, onViewDetails, onStockAlertClick }) => {
    const favoritesContext = useContext(FavoritesContext);

    if (!isOpen) return null;

    if (!favoritesContext) {
        return <div>Error: Favorites context not available.</div>;
    }

    const { favoriteIds } = favoritesContext;
    const favoriteVehicles = vehiclesData.filter(v => favoriteIds.includes(v.id));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="favorites-title">
            <div className="bg-white dark:bg-gray-800 rounded-card shadow-xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 flex justify-between items-center border-b border-border dark:border-gray-700">
                    <h2 id="favorites-title" className="text-2xl font-bold text-text-main dark:text-white flex items-center">
                        <HeartIcon className="w-6 h-6 mr-3 text-red-500" />
                        Vehicule Favorite
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Închide fereastra de favorite">
                        <XIcon className="w-6 h-6 text-muted dark:text-gray-400" />
                    </button>
                </div>
                <div className="flex-grow overflow-auto p-8">
                    {favoriteVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {favoriteVehicles.map(vehicle => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    onQuoteClick={onQuoteClick}
                                    onViewDetails={onViewDetails}
                                    onStockAlertClick={onStockAlertClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center flex flex-col items-center justify-center h-full">
                            <HeartIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-semibold text-text-main dark:text-white">Nu ai încă vehicule favorite.</h3>
                            <p className="text-muted dark:text-gray-400 mt-2">Apasă pe iconița inimă de pe un vehicul pentru a-l adăuga aici.</p>
                            <button onClick={onClose} className="mt-6 bg-primary text-white font-semibold px-6 py-2.5 rounded-btn hover:bg-primary-600 transition-colors">
                                Vezi flota
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritesModal;
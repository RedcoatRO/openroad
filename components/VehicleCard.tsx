import React, { useContext } from 'react';
import type { Vehicle } from '../types';
import { CheckCircleIcon, ScaleIcon, CogIcon, EngineIcon, FuelIcon, HeartIcon, BellIcon } from '../components/icons';
import Image from './Image';
import { FavoritesContext } from '../contexts/FavoritesContext';

interface VehicleCardProps {
    vehicle: Vehicle;
    onQuoteClick: (model: string) => void;
    onCompareToggle?: (vehicle: Vehicle) => void;
    isInCompare?: boolean;
    onViewDetails: (vehicle: Vehicle) => void;
    onStockAlertClick: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onQuoteClick, onCompareToggle, isInCompare, onViewDetails, onStockAlertClick }) => {
    const favoritesContext = useContext(FavoritesContext);
    
    if (!favoritesContext) {
        return <div>Error: Favorites context not available.</div>;
    }

    const { toggleFavorite, isFavorite } = favoritesContext;
    const isFav = isFavorite(vehicle.id);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-card shadow-soft overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-300 border border-border dark:border-gray-700">
             <div className="relative">
                <div 
                    className="overflow-hidden h-48 cursor-pointer"
                    onClick={() => onViewDetails(vehicle)}
                >
                    <Image 
                        src={vehicle.image} 
                        alt={vehicle.model} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                </div>
                
                {!vehicle.isAvailable && (
                     <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                        Stoc epuizat
                    </div>
                )}

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {onCompareToggle && (
                         <button 
                            onClick={() => onCompareToggle(vehicle)}
                            title="Compară"
                            aria-label={`Compară ${vehicle.model}`}
                            className={`p-2 rounded-full transition-colors backdrop-blur-sm ${isInCompare ? 'bg-primary text-white' : 'bg-white/70 dark:bg-gray-800/70 text-muted dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-primary'}`}
                        >
                            <ScaleIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => toggleFavorite(vehicle.id)}
                        title={isFav ? "Elimină de la favorite" : "Adaugă la favorite"}
                        aria-label={isFav ? `Elimină ${vehicle.model} de la favorite` : `Adaugă ${vehicle.model} la favorite`}
                        className={`p-2 rounded-full transition-colors backdrop-blur-sm ${isFav ? 'bg-red-500 text-white' : 'bg-white/70 dark:bg-gray-800/70 text-muted dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-red-500'}`}
                    >
                        <HeartIcon className={`w-5 h-5 ${isFav ? 'fill-current' : 'fill-none'}`} />
                    </button>
                </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-xl text-text-main dark:text-white">{vehicle.model}</h3>
                <div className="flex flex-wrap gap-2 my-3">
                    {vehicle.tags.map(tag => <span key={tag} className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">{tag}</span>)}
                </div>
                
                <div className="flex-grow">
                    <ul className="space-y-2 text-sm text-muted dark:text-gray-400 my-4">
                        {vehicle.perks.map(perk => <li key={perk} className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-accent flex-shrink-0"/>{perk}</li>)}
                    </ul>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                        <div className="flex items-center text-muted dark:text-gray-400" title="Transmisie">
                            <CogIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center text-muted dark:text-gray-400" title="Motorizare">
                            <EngineIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{vehicle.engine}</span>
                        </div>
                        <div className="flex items-center text-muted dark:text-gray-400" title="Consum">
                            <FuelIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{vehicle.consumption}</span>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-border dark:border-gray-700 pt-4 mt-auto">
                    <p className="text-sm text-muted dark:text-gray-400">de la <span className="text-2xl font-bold text-text-main dark:text-white">{vehicle.price} €/lună</span> + TVA</p>
                    {vehicle.isAvailable ? (
                        <button onClick={() => onQuoteClick(vehicle.model)} className="mt-4 w-full bg-primary text-white font-semibold py-2.5 rounded-btn hover:bg-primary-600 transition-colors">Solicită ofertă pentru acest model</button>
                    ) : (
                        <button onClick={() => onStockAlertClick(vehicle)} className="mt-4 w-full bg-gray-500 text-white font-semibold py-2.5 rounded-btn hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                            <BellIcon className="w-4 h-4" />
                            Notifică-mă
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;

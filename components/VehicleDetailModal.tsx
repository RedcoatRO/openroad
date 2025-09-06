
import React, { useState, useEffect } from 'react';
import type { Vehicle } from '../types';
import { XIcon, CogIcon, EngineIcon, FuelIcon, MessageSquareIcon } from './icons';
import Image from './Image';
import Vehicle360Viewer from './Vehicle360Viewer';
import VehicleReviews from './VehicleReviews';
import StructuredData from './StructuredData';

interface VehicleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ isOpen, onClose, vehicle }) => {
    type Tab = 'galerie' | 'exterior' | 'interior' | 'recenzii';
    const [activeTab, setActiveTab] = useState<Tab>('galerie');
    const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        if (vehicle) {
            // Setează tab-ul default în mod inteligent, în funcție de datele disponibile
            const defaultTab: Tab = vehicle.gallery && vehicle.gallery.length > 0 
                ? 'galerie' 
                : (vehicle.view360?.exterior ? 'exterior' : 'recenzii');
            setActiveTab(defaultTab);
            setSelectedGalleryImage(vehicle.gallery ? vehicle.gallery[0] : undefined);
        }
    }, [vehicle]);

    if (!isOpen || !vehicle) return null;

    const hasGallery = vehicle.gallery && vehicle.gallery.length > 0;
    const has360Exterior = !!vehicle.view360?.exterior;
    const has360Interior = !!vehicle.view360?.interior;
    
    const vehicleSchema = {
        // ... (schema data, unchanged)
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="vehicle-detail-title">
            <StructuredData schema={vehicleSchema} />
            <div className="bg-white dark:bg-gray-800 rounded-card shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 flex justify-between items-center border-b border-border dark:border-gray-700">
                    <h2 id="vehicle-detail-title" className="text-2xl font-bold text-text-main dark:text-white">{vehicle.model}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Închide fereastra de detalii">
                        <XIcon className="w-6 h-6 text-muted dark:text-gray-400" />
                    </button>
                </div>
                
                <div className="flex-grow overflow-auto grid grid-cols-1 lg:grid-cols-3 gap-0">
                    <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-900 flex flex-col">
                        <div className="p-2 border-b border-border dark:border-gray-700 flex-shrink-0">
                            <div className="flex justify-center flex-wrap gap-2">
                                {hasGallery && <button onClick={() => setActiveTab('galerie')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'galerie' ? 'bg-primary text-white' : 'text-muted dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Galerie</button>}
                                {has360Exterior && <button onClick={() => setActiveTab('exterior')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'exterior' ? 'bg-primary text-white' : 'text-muted dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Exterior 360°</button>}
                                {has360Interior && <button onClick={() => setActiveTab('interior')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'interior' ? 'bg-primary text-white' : 'text-muted dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Interior 360°</button>}
                                <button onClick={() => setActiveTab('recenzii')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${activeTab === 'recenzii' ? 'bg-primary text-white' : 'text-muted dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}><MessageSquareIcon className="w-4 h-4"/>Recenzii</button>
                            </div>
                        </div>
                        <div className="flex-grow relative">
                          {activeTab === 'exterior' && has360Exterior && <Vehicle360Viewer src={vehicle.view360!.exterior} />}
                          {activeTab === 'interior' && has360Interior && <Vehicle360Viewer src={vehicle.view360!.interior} />}
                          {activeTab === 'galerie' && hasGallery && (
                             <div className="w-full h-full flex flex-col p-4 gap-4">
                                <div className="flex-grow flex items-center justify-center">
                                    <Image src={selectedGalleryImage || ''} alt="Imagine selectată" className="max-w-full max-h-full object-contain"/>
                                </div>
                                <div className="flex-shrink-0 flex items-center justify-center gap-2 overflow-x-auto pb-2">
                                    {vehicle.gallery!.map((imgUrl, index) => (
                                        <Image 
                                            key={index}
                                            src={imgUrl}
                                            alt={`Thumbnail ${index + 1}`}
                                            onClick={() => setSelectedGalleryImage(imgUrl)}
                                            className={`w-20 h-14 object-cover rounded-md cursor-pointer border-2 transition-all ${selectedGalleryImage === imgUrl ? 'border-primary' : 'border-transparent hover:border-blue-300'}`}
                                        />
                                    ))}
                                </div>
                             </div>
                          )}
                          {activeTab === 'recenzii' && (
                            <VehicleReviews vehicleId={vehicle.id} initialReviews={vehicle.reviews || []} />
                          )}
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Specificații Cheie</h3>
                         <p className="text-sm text-muted dark:text-gray-400 mb-6">de la <span className="text-3xl font-bold text-text-main dark:text-white">{vehicle.price} €/lună</span> + TVA</p>
                        <div className="space-y-4 text-sm">
                             <div className="flex items-center text-muted dark:text-gray-300">
                                <CogIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                                <div>
                                    <strong>Transmisie:</strong> {vehicle.transmission}
                                </div>
                            </div>
                             <div className="flex items-center text-muted dark:text-gray-300">
                                <EngineIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                                 <div>
                                    <strong>Motorizare:</strong> {vehicle.engine}
                                </div>
                            </div>
                             <div className="flex items-center text-muted dark:text-gray-300">
                                <FuelIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                                 <div>
                                    <strong>Consum:</strong> {vehicle.consumption}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailModal;

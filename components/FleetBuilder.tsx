
import React, { useMemo, useState, useEffect } from 'react';
import type { FleetItem, Vehicle } from '../types';
import { adminDataService } from '../utils/adminDataService';
import Image from './Image';
import { XIcon } from './icons';

interface FleetBuilderProps {
    currentFleet: FleetItem[];
    onFleetChange: (newFleet: FleetItem[]) => void;
}

const FleetBuilder: React.FC<FleetBuilderProps> = ({ currentFleet, onFleetChange }) => {
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Încarcă asincron toate vehiculele din serviciul de date la montarea componentei
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehiclesFromDb = await adminDataService.getVehicles();
                setAllVehicles(vehiclesFromDb);
            } catch (error) {
                console.error("Eroare la încărcarea vehiculelor pentru FleetBuilder:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const fleetDetails = useMemo(() => {
        return currentFleet.map(item => {
            const vehicle = allVehicles.find(v => v.id === item.vehicleId);
            return { ...vehicle, quantity: item.quantity };
        }).filter(item => item.id !== undefined) as (Vehicle & { quantity: number })[];
    }, [currentFleet, allVehicles]);

    const handleQuantityChange = (vehicleId: string, quantity: number) => {
        const newQuantity = Math.max(0, quantity);
        const existingItem = currentFleet.find(item => item.vehicleId === vehicleId);

        let newFleet: FleetItem[];

        if (existingItem) {
            if (newQuantity === 0) {
                newFleet = currentFleet.filter(item => item.vehicleId !== vehicleId);
            } else {
                newFleet = currentFleet.map(item =>
                    item.vehicleId === vehicleId ? { ...item, quantity: newQuantity } : item
                );
            }
        } else if (newQuantity > 0) {
            newFleet = [...currentFleet, { vehicleId, quantity: newQuantity }];
        } else {
            newFleet = [...currentFleet];
        }
        onFleetChange(newFleet);
    };
    
    const handleRemove = (vehicleId: string) => {
        onFleetChange(currentFleet.filter(item => item.vehicleId !== vehicleId));
    };

    const inputClass = "w-20 p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm text-center";
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Lista de vehicule disponibile */}
            <div className="lg:col-span-2 h-full overflow-y-auto pr-4 -mr-4">
                 <h3 className="font-semibold text-lg text-text-main dark:text-white mb-4">1. Alege vehiculele și cantitatea</h3>
                 {isLoading ? (
                     <p className="text-muted">Se încarcă lista de vehicule...</p>
                 ) : (
                    <div className="space-y-3">
                        {allVehicles.map(vehicle => (
                            <div key={vehicle.id} className={`flex items-center justify-between p-3 rounded-lg ${!vehicle.isAvailable ? 'opacity-50' : 'bg-bg-alt dark:bg-gray-800/50'}`}>
                                <div className="flex items-center gap-4">
                                    <Image src={vehicle.image} alt={vehicle.model} className="w-20 h-14 object-cover rounded-md"/>
                                    <div>
                                        <p className="font-semibold text-text-main dark:text-white">{vehicle.model}</p>
                                        <p className="text-xs text-muted dark:text-gray-400">{vehicle.type} &bull; {vehicle.engine}</p>
                                        {!vehicle.isAvailable && <p className="text-xs font-semibold text-red-500">Indisponibil</p>}
                                    </div>
                                </div>
                                <input 
                                    type="number"
                                    min="0"
                                    value={currentFleet.find(item => item.vehicleId === vehicle.id)?.quantity || 0}
                                    onChange={(e) => handleQuantityChange(vehicle.id, parseInt(e.target.value, 10))}
                                    className={inputClass}
                                    aria-label={`Cantitate pentru ${vehicle.model}`}
                                    disabled={!vehicle.isAvailable}
                                />
                            </div>
                        ))}
                    </div>
                 )}
            </div>

            {/* Sumar flotă */}
            <div className="lg:col-span-1 bg-bg-alt dark:bg-gray-800/50 rounded-lg p-6 flex flex-col">
                <h3 className="font-semibold text-lg text-text-main dark:text-white mb-4 flex-shrink-0">2. Sumar flotă</h3>
                {fleetDetails.length > 0 ? (
                    <div className="space-y-3 overflow-y-auto flex-grow">
                        {fleetDetails.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-md">
                                <div>
                                    <p className="font-medium text-sm text-text-main dark:text-white">{item.model}</p>
                                    <p className="text-xs text-muted dark:text-gray-400">Cantitate: {item.quantity}</p>
                                </div>
                                <button type="button" onClick={() => handleRemove(item.id)} className="p-1 text-muted dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-center text-sm text-muted dark:text-gray-400">
                        <p>Flota ta este goală. <br/> Adaugă vehicule din lista din stânga.</p>
                    </div>
                )}
                 <p className="text-xs text-muted dark:text-gray-500 mt-4 flex-shrink-0">
                    Acesta este un sumar preliminar. Vei primi o ofertă finală personalizată.
                </p>
            </div>
        </div>
    );
};

export default FleetBuilder;

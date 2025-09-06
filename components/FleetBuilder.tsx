import React, { useMemo } from 'react';
import type { FleetItem, Vehicle } from '../types';
import { vehiclesData } from '../data/vehicles';
import Image from './Image';
import { XIcon } from './icons';

interface FleetBuilderProps {
    currentFleet: FleetItem[];
    onFleetChange: (newFleet: FleetItem[]) => void;
}

const FleetBuilder: React.FC<FleetBuilderProps> = ({ currentFleet, onFleetChange }) => {
    // Găsește detaliile vehiculelor din flotă pentru a le afișa în sumar
    const fleetDetails = useMemo(() => {
        return currentFleet.map(item => {
            const vehicle = vehiclesData.find(v => v.id === item.vehicleId);
            return { ...vehicle, quantity: item.quantity };
        }).filter(item => item.id !== undefined) as (Vehicle & { quantity: number })[];
    }, [currentFleet]);

    // Funcție pentru a actualiza cantitatea unui vehicul sau a-l adăuga în flotă
    const handleQuantityChange = (vehicleId: number, quantity: number) => {
        const newQuantity = Math.max(0, quantity); // Asigură că nu avem cantități negative
        const existingItem = currentFleet.find(item => item.vehicleId === vehicleId);

        let newFleet: FleetItem[];

        if (existingItem) {
            if (newQuantity === 0) {
                // Elimină vehiculul dacă noua cantitate este 0
                newFleet = currentFleet.filter(item => item.vehicleId !== vehicleId);
            } else {
                // Actualizează cantitatea dacă vehiculul există deja
                newFleet = currentFleet.map(item =>
                    item.vehicleId === vehicleId ? { ...item, quantity: newQuantity } : item
                );
            }
        } else if (newQuantity > 0) {
            // Adaugă un vehicul nou dacă nu există și cantitatea e pozitivă
            newFleet = [...currentFleet, { vehicleId, quantity: newQuantity }];
        } else {
            // Dacă nu există și cantitatea e 0, nu face nimic
            newFleet = [...currentFleet];
        }
        onFleetChange(newFleet);
    };
    
    // Funcție pentru a elimina complet un vehicul din flotă
    const handleRemove = (vehicleId: number) => {
        onFleetChange(currentFleet.filter(item => item.vehicleId !== vehicleId));
    };

    const inputClass = "w-20 p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm text-center";
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Lista de vehicule disponibile */}
            <div className="lg:col-span-2 h-full overflow-y-auto pr-4 -mr-4">
                 <h3 className="font-semibold text-lg text-text-main dark:text-white mb-4">1. Alege vehiculele și cantitatea</h3>
                 <div className="space-y-3">
                    {vehiclesData.map(vehicle => (
                        <div key={vehicle.id} className="flex items-center justify-between p-3 bg-bg-alt dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <Image src={vehicle.image} alt={vehicle.model} className="w-20 h-14 object-cover rounded-md"/>
                                <div>
                                    <p className="font-semibold text-text-main dark:text-white">{vehicle.model}</p>
                                    <p className="text-xs text-muted dark:text-gray-400">{vehicle.type} &bull; {vehicle.engine}</p>
                                </div>
                            </div>
                            <input 
                                type="number"
                                min="0"
                                value={currentFleet.find(item => item.vehicleId === vehicle.id)?.quantity || 0}
                                onChange={(e) => handleQuantityChange(vehicle.id, parseInt(e.target.value, 10))}
                                className={inputClass}
                                aria-label={`Cantitate pentru ${vehicle.model}`}
                            />
                        </div>
                    ))}
                 </div>
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

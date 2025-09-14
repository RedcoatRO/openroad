
import React, { useMemo, useState, useEffect, useRef } from 'react';
import type { FleetItem, Vehicle } from '../types';
import { adminDataService } from '../utils/adminDataService';
import Image from './Image';
import { XIcon, SearchIcon } from './icons';

interface FleetBuilderProps {
    currentFleet: FleetItem[];
    onFleetChange: (newFleet: FleetItem[]) => void;
}

const FleetBuilder: React.FC<FleetBuilderProps> = ({ currentFleet, onFleetChange }) => {
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);


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
    
    // Închide dropdown-ul de căutare la click în afara componentei
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fleetDetails = useMemo(() => {
        return currentFleet.map(item => {
            const vehicle = allVehicles.find(v => v.id === item.vehicleId);
            return { ...vehicle, quantity: item.quantity };
        }).filter(item => item.id !== undefined) as (Vehicle & { quantity: number })[];
    }, [currentFleet, allVehicles]);
    
    // Filtrează vehiculele pentru auto-completare pe baza textului introdus.
    // Exclude vehiculele deja selectate sau cele care nu sunt disponibile.
    const searchResults = useMemo(() => {
        if (searchQuery.length < 2) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();
        return allVehicles.filter(vehicle => {
            const isAlreadySelected = currentFleet.some(item => item.vehicleId === vehicle.id);
            if (isAlreadySelected || !vehicle.isAvailable) return false;
            return vehicle.model.toLowerCase().includes(lowerCaseQuery) || vehicle.brand.toLowerCase().includes(lowerCaseQuery);
        }).slice(0, 5); // Limitează la 5 rezultate pentru performanță
    }, [searchQuery, allVehicles, currentFleet]);
    
    // Adaugă un vehicul în flotă din rezultatele căutării
    const handleAddVehicle = (vehicle: Vehicle) => {
        onFleetChange([...currentFleet, { vehicleId: vehicle.id, quantity: 1 }]);
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    // Actualizează cantitatea unui vehicul din flotă
    const handleQuantityChange = (vehicleId: string, quantity: number) => {
        const newQuantity = Math.max(1, quantity); // Cantitatea minimă este 1
        const newFleet = currentFleet.map(item =>
            item.vehicleId === vehicleId ? { ...item, quantity: newQuantity } : item
        );
        onFleetChange(newFleet);
    };
    
    // Elimină un vehicul din flotă
    const handleRemove = (vehicleId: string) => {
        onFleetChange(currentFleet.filter(item => item.vehicleId !== vehicleId));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Partea stângă: Căutare și adăugare vehicule */}
            <div className="lg:col-span-2 h-full flex flex-col">
                <h3 className="font-semibold text-lg text-text-main dark:text-white mb-4 flex-shrink-0">1. Adaugă vehicule în flotă</h3>
                <div ref={searchRef} className="relative flex-shrink-0">
                    <div className="relative">
                       <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="Caută model sau marcă..."
                            className="w-full pl-10 p-3 border border-border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label="Căutare vehicul"
                        />
                    </div>
                    {isDropdownOpen && searchResults.length > 0 && (
                        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-border dark:border-gray-600 z-10 max-h-80 overflow-y-auto">
                            <ul>
                                {searchResults.map(vehicle => (
                                    <li key={vehicle.id}>
                                        <button
                                            onClick={() => handleAddVehicle(vehicle)}
                                            className="w-full text-left flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <Image src={vehicle.image} alt={vehicle.model} className="w-20 h-14 object-cover rounded-md flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-text-main dark:text-white">{vehicle.model}</p>
                                                <p className="text-xs text-muted dark:text-gray-400">{vehicle.type} &bull; {vehicle.engine}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                 <div className="flex-grow mt-4 text-center text-sm text-muted dark:text-gray-400 p-4">
                    {isLoading ? "Se încarcă vehiculele..." : "Folosește bara de căutare pentru a găsi și adăuga mașini în sumar."}
                </div>
            </div>

            {/* Partea dreaptă: Sumar flotă */}
            <div className="lg:col-span-1 bg-bg-alt dark:bg-gray-800/50 rounded-lg p-6 flex flex-col">
                <h3 className="font-semibold text-lg text-text-main dark:text-white mb-4 flex-shrink-0">2. Sumar flotă</h3>
                {fleetDetails.length > 0 ? (
                    <div className="space-y-3 overflow-y-auto flex-grow -mr-2 pr-2">
                        {fleetDetails.map(item => (
                             <div key={item.id} className="flex items-center justify-between gap-3 p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                                <Image src={item.image || ''} alt={item.model || ''} className="w-16 h-11 object-cover rounded-md flex-shrink-0"/>
                                <div className="flex-grow">
                                    <p className="font-medium text-sm text-text-main dark:text-white">{item.model}</p>
                                </div>
                                <input 
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                    className="w-16 p-1 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-white text-sm text-center"
                                    aria-label={`Cantitate pentru ${item.model}`}
                                />
                                <button type="button" onClick={() => handleRemove(item.id)} className="p-1 text-muted dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 flex-shrink-0">
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

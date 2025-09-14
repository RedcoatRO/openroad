

import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Vehicle } from '../types';
import { CheckCircleIcon, ChevronDownIcon } from '../components/icons';
import ComparisonModal from '../components/ComparisonModal';
import { adminDataService } from '../utils/adminDataService';
import VehicleCard from '../components/VehicleCard';
import Breadcrumbs from '../components/Breadcrumbs'; 
import { ContentContext } from '../contexts/ContentContext';

interface OutletContextType {
    onQuoteClick: (model?: string) => void;
    onViewDetails: (vehicle: Vehicle) => void;
    onStockAlertClick: (vehicle: Vehicle) => void;
}

const benefitsData = [
    { text: "Asigurare completă RCA & CASCO" },
    { text: "Mentenanță periodică și reparații" },
    { text: "Asistență rutieră 24/7" },
    { text: "Vehicul de înlocuire gratuit" },
]

const CompareBar: React.FC<{
    items: Vehicle[];
    onCompare: () => void;
    onRemove: (vehicleId: string) => void;
    onClear: () => void;
}> = ({ items, onCompare, onRemove, onClear }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-text-main text-white p-4 shadow-2xl z-40">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <p className="font-bold text-lg hidden sm:block">Compară:</p>
                    <div className="flex items-center gap-3">
                        {items.map(item => (
                            <div key={item.id} className="relative bg-gray-600 rounded-md p-1" title={item.model}>
                               <span className="text-xs font-bold">{item.model.split(' ')[0]}</span>
                                <button onClick={() => onRemove(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" aria-label={`Scoate ${item.model} din comparație`}>&times;</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onClear} className="text-sm text-gray-300 hover:underline">Șterge selecția</button>
                    <button onClick={onCompare} className="bg-primary font-semibold px-6 py-2 rounded-btn hover:bg-primary-600 transition-colors">
                        Compară ({items.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

const VehiclesPage: React.FC = () => {
    const { onQuoteClick, onViewDetails, onStockAlertClick } = useOutletContext<OutletContextType>();
    const { getContent, isLoading: isContentLoading } = useContext(ContentContext)!;
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);
    const [comparisonList, setComparisonList] = useState<Vehicle[]>([]);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);
    
    const [fuelFilter, setFuelFilter] = useState<string>('Toate');
    const [powerFilter, setPowerFilter] = useState({ min: '', max: '' });
    const [featureFilters, setFeatureFilters] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>('popularity-desc');
    const [showFeatures, setShowFeatures] = useState(false);

    // Încarcă toate vehiculele asincron de la Firestore la montarea componentei
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehiclesFromDb = await adminDataService.getVehicles();
                setAllVehicles(vehiclesFromDb);
            } catch (error) {
                console.error("Eroare la încărcarea vehiculelor:", error);
            } finally {
                setIsVehiclesLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const allFeatures = useMemo(() => {
        const featuresSet = new Set<string>();
        allVehicles.forEach(v => v.features.forEach(f => featuresSet.add(f)));
        return Array.from(featuresSet).sort();
    }, [allVehicles]);

    const handleFeatureChange = (feature: string) => {
        setFeatureFilters(prev => 
            prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
        );
    };

    const filteredAndSortedVehicles = useMemo(() => {
        let result = [...allVehicles];

        if (fuelFilter !== 'Toate') {
            result = result.filter(v => v.fuelType === fuelFilter);
        }

        const minPower = parseInt(powerFilter.min, 10);
        const maxPower = parseInt(powerFilter.max, 10);
        if (!isNaN(minPower)) {
            result = result.filter(v => v.power >= minPower);
        }
        if (!isNaN(maxPower)) {
            result = result.filter(v => v.power <= maxPower);
        }

        if (featureFilters.length > 0) {
            result = result.filter(v => featureFilters.every(f => v.features.includes(f)));
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'model-asc': return a.model.localeCompare(b.model);
                case 'popularity-desc': return b.popularity - a.popularity;
                default: return 0;
            }
        });

        return result;
    }, [allVehicles, fuelFilter, powerFilter, featureFilters, sortBy]);

    const handleToggleCompare = (vehicle: Vehicle) => {
        setComparisonList(prevList => {
            const isInList = prevList.some(v => v.id === vehicle.id);
            if (isInList) {
                return prevList.filter(v => v.id !== vehicle.id);
            } else {
                if (prevList.length < 4) return [...prevList, vehicle];
                else {
                    alert("Poți compara maxim 4 vehicule.");
                    return prevList;
                }
            }
        });
    };
    
    const handleRemoveFromCompare = (vehicleId: string) => {
        setComparisonList(prevList => prevList.filter(v => v.id !== vehicleId));
    };

    const handleClearCompare = () => setComparisonList([]);

    const inputClass = "w-full p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm";
    const isLoading = isContentLoading || isVehiclesLoading;

    return (
        <>
            <section className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/road/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 data-editable-id="vehicles-hero-title" className="text-4xl md:text-5xl font-bold">{getContent('vehicles-hero-title', 'Mașini disponibile')}</h1>
                    <p data-editable-id="vehicles-hero-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('vehicles-hero-subtitle', 'Alege vehiculele potrivite pentru compania ta.')}</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>
            
            <div className="sticky top-[70px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <select value={fuelFilter} onChange={e => setFuelFilter(e.target.value)} className={inputClass} aria-label="Tip combustibil">
                            <option value="Toate">Combustibil (toate)</option>
                            <option>Benzină</option> <option>Diesel</option>
                            <option>Hibrid</option> <option>Electrică</option>
                        </select>
                        <input type="number" placeholder="Putere min (CP)" value={powerFilter.min} onChange={e => setPowerFilter(p => ({...p, min: e.target.value}))} className={inputClass} aria-label="Putere minimă"/>
                        <input type="number" placeholder="Putere max (CP)" value={powerFilter.max} onChange={e => setPowerFilter(p => ({...p, max: e.target.value}))} className={inputClass} aria-label="Putere maximă"/>
                        <button onClick={() => setShowFeatures(!showFeatures)} className={`${inputClass} text-left flex justify-between items-center col-span-2 md:col-span-1`}>
                           <span>Dotări specifice</span> <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
                        </button>

                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`${inputClass} col-span-2 md:col-span-3 lg:col-span-1`} aria-label="Sortează după">
                           <option value="popularity-desc">Sortează: Popularitate</option>
                           <option value="price-asc">Sortează: Preț crescător</option>
                           <option value="price-desc">Sortează: Preț descrescător</option>
                           <option value="model-asc">Sortează: Model (A-Z)</option>
                        </select>
                    </div>

                    {showFeatures && (
                        <div className="pt-4 border-t border-border dark:border-gray-700">
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {allFeatures.map(feature => (
                                    <label key={feature} className="flex items-center space-x-2 text-sm text-muted dark:text-gray-300 cursor-pointer">
                                        <input type="checkbox" checked={featureFilters.includes(feature)} onChange={() => handleFeatureChange(feature)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                        <span>{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <main className="container mx-auto px-4 py-16">
                {isLoading ? (
                     <div className="text-center py-16">Se încarcă vehiculele...</div>
                ) : filteredAndSortedVehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAndSortedVehicles.map(vehicle => (
                            <VehicleCard 
                                key={vehicle.id} 
                                vehicle={vehicle} 
                                onQuoteClick={() => onQuoteClick(vehicle.model)}
                                onCompareToggle={handleToggleCompare}
                                isInCompare={comparisonList.some(v => v.id === vehicle.id)}
                                onViewDetails={onViewDetails}
                                onStockAlertClick={onStockAlertClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted">Niciun vehicul nu corespunde filtrelor selectate.</div>
                )}

                <p className="text-center text-xs text-muted dark:text-gray-500 mt-12 max-w-3xl mx-auto">
                    *Prețurile afișate sunt orientative...
                </p>
            </main>
            
            <section className="bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4 py-16">
                    <h2 data-editable-id="vehicles-benefits-title" className="text-2xl font-bold text-center text-text-main dark:text-white mb-8">{getContent('vehicles-benefits-title', 'Ce este inclus în costul lunar?')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {benefitsData.map(benefit => (
                            <div key={benefit.text} className="flex flex-col items-center">
                                <CheckCircleIcon className="w-8 h-8 text-accent mb-3"/>
                                <p className="text-text-main dark:text-white font-medium">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="relative bg-cover bg-center text-white" style={{ backgroundImage: "url('https://picsum.photos/seed/cityroad/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                 <div className="relative container mx-auto px-4 py-20 text-center">
                    <h2 data-editable-id="vehicles-cta-title" className="text-4xl font-bold">{getContent('vehicles-cta-title', 'Găsește mașina perfectă pentru echipa ta.')}</h2>
                    <p data-editable-id="vehicles-cta-subtitle" className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">{getContent('vehicles-cta-subtitle', 'Contactează-ne și primești o ofertă personalizată în 24–48h.')}</p>
                    <button onClick={() => onQuoteClick()} className="mt-8 bg-primary text-white font-bold px-8 py-3 rounded-btn hover:bg-primary-600 transition-colors">Solicită ofertă</button>
                </div>
            </section>

            {comparisonList.length > 0 && (
                <CompareBar 
                    items={comparisonList} 
                    onCompare={() => setCompareModalOpen(true)}
                    onRemove={handleRemoveFromCompare}
                    onClear={handleClearCompare}
                />
            )}
            <ComparisonModal 
                isOpen={isCompareModalOpen}
                onClose={() => setCompareModalOpen(false)}
                vehicles={comparisonList}
            />
        </>
    );
};

export default VehiclesPage;
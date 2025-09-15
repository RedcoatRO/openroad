
import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Vehicle } from '../types';
import { CheckCircleIcon, ChevronDownIcon, SearchIcon } from '../components/icons';
import ComparisonModal from '../components/ComparisonModal';
import { adminDataService } from '../utils/adminDataService';
import VehicleCard from '../components/VehicleCard';
import Breadcrumbs from '../components/Breadcrumbs'; 
import { firebase } from '../utils/firebase'; // Import pentru tipul DocumentSnapshot

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

// Componenta pentru bara de jos, care afișează vehiculele selectate pentru comparație.
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

// Numărul de vehicule de încărcat pe pagină.
const PAGE_SIZE = 9;

const VehiclesPage: React.FC = () => {
    const { onQuoteClick, onViewDetails, onStockAlertClick } = useOutletContext<OutletContextType>();
    // Starea `allVehicles` acumulează vehiculele încărcate pe parcursul paginării.
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [comparisonList, setComparisonList] = useState<Vehicle[]>([]);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);

    // Stări noi pentru gestionarea paginării de tip "încarcă mai multe"
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Indică dacă se încarcă un nou set de vehicule.
    const [lastVisible, setLastVisible] = useState<firebase.firestore.DocumentSnapshot | null>(null); // Cursorul pentru Firestore.
    const [hasMore, setHasMore] = useState(true); // Indică dacă mai există vehicule de încărcat.

    // Stări pentru filtrele adăugate
    const [searchQuery, setSearchQuery] = useState('');
    const [brandFilter, setBrandFilter] = useState('Toate');
    const [typeFilter, setTypeFilter] = useState('Toate');
    const [fuelFilter, setFuelFilter] = useState<string>('Toate');
    const [powerFilter, setPowerFilter] = useState({ min: '', max: '' });
    const [featureFilters, setFeatureFilters] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>('popularity-desc');
    const [showFeatures, setShowFeatures] = useState(false);

    // Funcție pentru a încărca primul set (prima pagină) de vehicule.
    const fetchFirstPage = async () => {
        setIsLoading(true);
        try {
            const { vehicles: initialVehicles, lastVisible: newLastVisible } = await adminDataService.getVehicles(PAGE_SIZE);
            setAllVehicles(initialVehicles);
            setLastVisible(newLastVisible);
            // Dacă numărul de vehicule primite este mai mic decât limita paginii, înseamnă că nu mai sunt altele.
            setHasMore(initialVehicles.length === PAGE_SIZE);
        } catch (error) {
            console.error("Eroare la încărcarea primului set de vehicule:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Încarcă prima pagină la montarea componentei.
    useEffect(() => {
        fetchFirstPage();
    }, []);

    // Funcție pentru a încărca paginile următoare.
    const loadMoreVehicles = async () => {
        if (!hasMore || isLoadingMore) return; // Previne încărcări multiple simultane.

        setIsLoadingMore(true);
        try {
            // Trimite cursorul `lastVisible` pentru a prelua următorul set de date.
            const { vehicles: newVehicles, lastVisible: newLastVisible } = await adminDataService.getVehicles(PAGE_SIZE, lastVisible);
            // Adaugă noile vehicule la lista existentă.
            setAllVehicles(prevVehicles => [...prevVehicles, ...newVehicles]);
            setLastVisible(newLastVisible);
            setHasMore(newVehicles.length === PAGE_SIZE);
        } catch (error) {
            console.error("Eroare la încărcarea următorului set de vehicule:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };


    // Generează dinamic listele de opțiuni pentru filtre, fără duplicate
    const allBrands = useMemo(() => Array.from(new Set(allVehicles.map(v => v.brand))).sort(), [allVehicles]);
    const allTypes = useMemo(() => Array.from(new Set(allVehicles.map(v => v.type))).sort(), [allVehicles]);
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

    // Logica de filtrare și sortare client-side. Aceasta se aplică pe lista de vehicule încărcate până în prezent.
    const filteredAndSortedVehicles = useMemo(() => {
        let result = [...allVehicles];

        // 1. Filtru de căutare (marcă sau model)
        if (searchQuery.length > 1) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(v => 
                v.model.toLowerCase().includes(lowerCaseQuery) || 
                v.brand.toLowerCase().includes(lowerCaseQuery)
            );
        }
        
        // 2. Filtru după marcă
        if (brandFilter !== 'Toate') {
            result = result.filter(v => v.brand === brandFilter);
        }
        
        // 3. Filtru după tip caroserie
        if (typeFilter !== 'Toate') {
            result = result.filter(v => v.type === typeFilter);
        }

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
    }, [allVehicles, searchQuery, brandFilter, typeFilter, fuelFilter, powerFilter, featureFilters, sortBy]);

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
    
    return (
        <>
            <section className="relative bg-cover bg-center text-white py-24" style={{ backgroundImage: "url('https://picsum.photos/seed/road/1920/1080')" }}>
                <div className="absolute inset-0 bg-blue-900/80"></div>
                <div className="relative container mx-auto px-4 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">Mașini disponibile</h1>
                    <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">Alege vehiculele potrivite pentru compania ta.</p>
                    <div className="mt-8"> <Breadcrumbs /> </div>
                </div>
            </section>
            
            <div className="sticky top-[70px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
                        {/* Câmpul de căutare nou */}
                        <div className="relative col-span-2">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input 
                                type="text" 
                                placeholder="Caută marcă sau model..." 
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                                className={`${inputClass} pl-9`} 
                                aria-label="Caută vehicul"
                            />
                        </div>
                        
                        {/* Filtrul nou pentru Marcă */}
                        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className={inputClass} aria-label="Marcă">
                            <option value="Toate">Marcă (toate)</option>
                            {allBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                        </select>
                        
                        {/* Filtrul nou pentru Caroserie */}
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={inputClass} aria-label="Tip caroserie">
                            <option value="Toate">Caroserie (toate)</option>
                            {allTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        
                        {/* Filtrele existente */}
                        <select value={fuelFilter} onChange={e => setFuelFilter(e.target.value)} className={inputClass} aria-label="Tip combustibil">
                            <option value="Toate">Combustibil (toate)</option>
                            <option>Benzină</option> <option>Diesel</option>
                            <option>Hibrid</option> <option>Electrică</option>
                        </select>

                        <input type="number" placeholder="Putere min (CP)" value={powerFilter.min} onChange={e => setPowerFilter(p => ({...p, min: e.target.value}))} className={inputClass} aria-label="Putere minimă"/>
                        <input type="number" placeholder="Putere max (CP)" value={powerFilter.max} onChange={e => setPowerFilter(p => ({...p, max: e.target.value}))} className={inputClass} aria-label="Putere maximă"/>
                        
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`${inputClass} col-span-2 md:col-span-1`} aria-label="Sortează după">
                           <option value="popularity-desc">Sortează: Popularitate</option>
                           <option value="price-asc">Sortează: Preț crescător</option>
                           <option value="price-desc">Sortează: Preț descrescător</option>
                           <option value="model-asc">Sortează: Model (A-Z)</option>
                        </select>
                        
                        <button onClick={() => setShowFeatures(!showFeatures)} className={`${inputClass} text-left flex justify-between items-center col-span-2 md:col-span-2`}>
                           <span>Dotări specifice</span> <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${showFeatures ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Container animat pentru dotări. */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFeatures ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <div className="border-t border-border dark:border-gray-700 pt-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {allFeatures.map(feature => (
                                    <label key={feature} className="flex items-center space-x-2 text-sm text-muted dark:text-gray-300 cursor-pointer">
                                        <input type="checkbox" checked={featureFilters.includes(feature)} onChange={() => handleFeatureChange(feature)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                        <span>{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <main className="container mx-auto px-4 py-16">
                {isLoading ? (
                     <div className="text-center py-16">Se încarcă vehiculele...</div>
                ) : filteredAndSortedVehicles.length > 0 ? (
                    <>
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
                        {hasMore && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={loadMoreVehicles}
                                    disabled={isLoadingMore}
                                    className="bg-primary text-white font-semibold px-8 py-3 rounded-btn hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoadingMore ? 'Se încarcă...' : 'Încarcă mai multe'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16 text-muted">
                        {allVehicles.length > 0
                            ? 'Niciun vehicul nu corespunde filtrelor selectate.'
                            : 'Nu există vehicule disponibile momentan.'
                        }
                    </div>
                )}

                <p className="text-center text-xs text-muted dark:text-gray-500 mt-12 max-w-3xl mx-auto">
                    *Prețurile afișate sunt orientative...
                </p>
            </main>
            
            <section className="bg-bg-alt dark:bg-gray-800">
                <div className="container mx-auto px-4 py-16">
                    <h2 className="text-2xl font-bold text-center text-text-main dark:text-white mb-8">Ce este inclus în costul lunar?</h2>
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
                    <h2 className="text-4xl font-bold">Găsește mașina perfectă pentru echipa ta.</h2>
                    <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">Contactează-ne și primești o ofertă personalizată în 24–48h.</p>
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

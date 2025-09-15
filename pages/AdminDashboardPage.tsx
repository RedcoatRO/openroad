import React, { useState, useEffect, useCallback } from 'react';
import KPICard from '../components/admin/KPIcard';
import ChartWidget from '../components/admin/ChartWidget';
import { adminDataService } from '../utils/adminDataService';
import type { QuoteRequest, Vehicle } from '../types';

// Definirea componentelor widget
const mainChartWidget = (
    <div className="lg:col-span-2">
        <ChartWidget />
    </div>
);

const AdminDashboardPage: React.FC = () => {
    // Stări pentru datele dinamice și starea de încărcare
    const [kpiData, setKpiData] = useState({ totalVehicles: 0, availableVehicles: 0, activeContracts: 0, pendingRequests: 0 });
    const [recentRequests, setRecentRequests] = useState<QuoteRequest[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Funcție pentru a încărca dinamic datele pentru dashboard
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Preia simultan vehiculele și solicitările
            const [vehiclesResponse, requests] = await Promise.all([
                adminDataService.getVehicles(999), // Preia toate vehiculele pentru statistici
                adminDataService.getRequests()
            ]);

            const allVehicles = vehiclesResponse.vehicles;
            setVehicles(allVehicles); // Salvează vehiculele pentru a putea afișa modelele

            // Calculează valorile pentru cardurile KPI
            const totalVehicles = allVehicles.length;
            const availableVehicles = allVehicles.filter(v => v.isAvailable).length;
            const activeContracts = requests.filter(r => r.status === 'Finalizată').length;
            const pendingRequests = requests.filter(r => r.status === 'Nouă').length;

            setKpiData({ totalVehicles, availableVehicles, activeContracts, pendingRequests });

            // Setează ultimele 5 solicitări (serviciul le returnează deja sortate descrescător după dată)
            setRecentRequests(requests.slice(0, 5));

        } catch (error) {
            console.error("Nu s-au putut încărca datele pentru panoul general:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Funcție ajutătoare pentru a găsi numele unui model de vehicul după ID
    const getVehicleModel = (id: string) => {
        return vehicles.find(v => v.id === id)?.model || 'ID necunoscut';
    };
    
    // Definirea widget-urilor cu date dinamice
    const kpiWidget = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Autoturisme totale" value={isLoading ? '...' : kpiData.totalVehicles.toString()} />
            <KPICard title="Disponibile" value={isLoading ? '...' : kpiData.availableVehicles.toString()} />
            <KPICard title="Contracte active" value={isLoading ? '...' : `${kpiData.activeContracts}+`} />
            <KPICard title="Solicitări în așteptare" value={isLoading ? '...' : kpiData.pendingRequests.toString()} />
        </div>
    );
    
    const activityWidget = (
        <div className="bg-white p-6 rounded-lg shadow-soft">
            <h2 className="text-lg font-semibold text-text-main mb-4">Ultimele solicitări</h2>
            {isLoading ? <p>Se încarcă...</p> : (
                <div className="space-y-4">
                    {recentRequests.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                             <div>
                                <p className="font-semibold text-text-main">{item.companyName}</p>
                                <p className="text-muted text-xs">{item.fleet.map(f => `${f.quantity}x ${getVehicleModel(f.vehicleId)}`).join(', ')}</p>
                            </div>
                            <div className="text-right">
                                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                     item.status === 'Nouă' ? 'bg-blue-100 text-blue-800' :
                                     item.status === 'În lucru' ? 'bg-yellow-100 text-yellow-800' :
                                     item.status === 'Contactat' ? 'bg-purple-100 text-purple-800' :
                                     'bg-green-100 text-green-800'
                                 }`}>{item.status}</span>
                                 <p className="text-muted text-xs mt-1">{new Date(item.date).toLocaleDateString('ro-RO')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Definirea widget-urilor cu ID-uri unice pentru funcționalitatea de drag-and-drop
    const widgets = {
        kpis: { id: 'kpis', component: kpiWidget },
        chart: { id: 'chart', component: mainChartWidget },
        activity: { id: 'activity', component: activityWidget },
    };
    
    const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
        const savedOrder = localStorage.getItem('adminDashboardOrder');
        return savedOrder ? JSON.parse(savedOrder) : ['kpis', 'chart', 'activity'];
    });

    const dragItem = React.useRef<number | null>(null);
    const dragOverItem = React.useRef<number | null>(null);

    useEffect(() => {
        localStorage.setItem('adminDashboardOrder', JSON.stringify(widgetOrder));
    }, [widgetOrder]);

    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newWidgetOrder = [...widgetOrder];
        const draggedItemContent = newWidgetOrder.splice(dragItem.current, 1)[0];
        newWidgetOrder.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setWidgetOrder(newWidgetOrder);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold text-text-main">Panou general</h1>
            
            {widgetOrder.map((widgetId, index) => {
                 const widgetComponent = (widgets as any)[widgetId]?.component;
                 if (!widgetComponent) return null;

                 return (
                     <div
                         key={widgetId}
                         draggable
                         onDragStart={() => (dragItem.current = index)}
                         onDragEnter={() => (dragOverItem.current = index)}
                         onDragEnd={handleDragSort}
                         onDragOver={(e) => e.preventDefault()}
                         className="cursor-move"
                     >
                         {widgetComponent}
                     </div>
                 );
            })}
        </div>
    );
};

export default AdminDashboardPage;

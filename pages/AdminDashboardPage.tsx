
import React, { useState, useEffect } from 'react';
import KPICard from '../components/admin/KPIcard';
import ChartWidget from '../components/admin/ChartWidget';
import DataTable from '../components/admin/DataTable';

const recentActivity = [
    { client: 'TechNova SRL', request: '3 x Sedan Business', date: '2 ore în urmă', status: 'Nouă' },
    { client: 'Construct Group', request: '5 x Utilitară', date: 'Ieri', status: 'În lucru' },
    { client: 'Global Logistics', request: '1 x SUV Premium', date: 'Ieri', status: 'Finalizată' },
];

// Definirea componentelor widget
const kpiWidget = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Autoturisme totale" value="2500" />
        <KPICard title="Disponibile" value="1750" />
        <KPICard title="Contracte active" value="200+" />
        <KPICard title="Solicitări în așteptare" value="12" />
    </div>
);

const mainChartWidget = (
    <div className="lg:col-span-2">
        <ChartWidget />
    </div>
);

const activityWidget = (
    <div className="bg-white p-6 rounded-lg shadow-soft">
        <h2 className="text-lg font-semibold text-text-main mb-4">Ultimele solicitări</h2>
        <div className="space-y-4">
            {recentActivity.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    {/* ... conținut activitate ... */}
                     <div>
                        <p className="font-semibold text-text-main">{item.client}</p>
                        <p className="text-muted">{item.request}</p>
                    </div>
                    <div className="text-right">
                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                             item.status === 'Nouă' ? 'bg-blue-100 text-blue-800' :
                             item.status === 'În lucru' ? 'bg-yellow-100 text-yellow-800' :
                             'bg-green-100 text-green-800'
                         }`}>{item.status}</span>
                         <p className="text-muted text-xs mt-1">{item.date}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const AdminDashboardPage: React.FC = () => {
    // Definirea widget-urilor cu ID-uri unice
    const widgets = {
        kpis: { id: 'kpis', component: kpiWidget },
        chart: { id: 'chart', component: mainChartWidget },
        activity: { id: 'activity', component: activityWidget },
    };
    
    // Starea pentru ordinea widget-urilor, citită din localStorage
    const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
        const savedOrder = localStorage.getItem('adminDashboardOrder');
        return savedOrder ? JSON.parse(savedOrder) : ['kpis', 'chart', 'activity'];
    });

    const dragItem = React.useRef<number | null>(null);
    const dragOverItem = React.useRef<number | null>(null);

    // Salvează ordinea în localStorage de fiecare dată când se schimbă
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

    // Combină widget-urile de chart și activity într-un grid
    const combinedChartActivity = (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {widgetOrder.includes('chart') && widgetOrder.indexOf('chart') < widgetOrder.indexOf('activity') ? [widgets.chart.component, widgets.activity.component] : [widgets.activity.component, widgets.chart.component]}
        </div>
    );
    
    // O nouă mapare pentru a gestiona layout-ul complex
    const orderedWidgetsMap = {
        kpis: widgets.kpis.component,
        chart: combinedChartActivity,
        activity: null, // Deja inclus în combinedChartActivity
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold text-text-main">Panou general</h1>
            
            {widgetOrder.map((widgetId, index) => {
                 // Găsește componenta pe baza ID-ului
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
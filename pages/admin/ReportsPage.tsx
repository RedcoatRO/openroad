
import React, { useState, useEffect } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Vehicle } from '../../types';

// --- Date Simulate (păstrate pentru demonstrație) ---
const trafficSourceData = [
    { name: 'Organic Search', value: 400 },
    { name: 'Direct', value: 300 },
    { name: 'Referral', value: 200 },
    { name: 'Social Media', value: 100 },
];
const COLORS = ['#0B5FFF', '#22C55E', '#F97316', '#8B5CF6'];

// --- Componente Reutilizabile pentru Grafice ---
const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-soft h-96 flex flex-col">
        <h2 className="text-lg font-semibold text-text-main mb-4">{title}</h2>
        <div className="flex-grow">{children}</div>
    </div>
);

const ReportsPage: React.FC = () => {
    const [popularVehiclesData, setPopularVehiclesData] = useState<{name: string, Popularitate: number}[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Încarcă datele necesare pentru grafice la montarea componentei
    useEffect(() => {
        const fetchDataForCharts = async () => {
            try {
                const vehicles = await adminDataService.getVehicles();
                const popularData = vehicles
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 5)
                    .map(v => ({ name: v.model, Popularitate: v.popularity }));
                setPopularVehiclesData(popularData);
            } catch (error) {
                console.error("Eroare la generarea datelor pentru raport:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDataForCharts();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold text-text-main">Analize și Rapoarte</h1>

            {isLoading ? (
                <p>Se încarcă rapoartele...</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Grafic Cele mai Populare Vehicule */}
                    <ChartContainer title="Top 5 Cele mai Populare Vehicule">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={popularVehiclesData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                <Bar dataKey="Popularitate" fill="#0B5FFF" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Grafic Surse de Trafic */}
                    <ChartContainer title="Surse de Trafic (Simulat)">
                        <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie data={trafficSourceData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                                    {trafficSourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            )}
             {/* Puteți adăuga mai multe grafice aici */}
        </div>
    );
};

export default ReportsPage;

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const chartData = [
  { name: 'Ian', Ocupate: 220, Disponibile: 1780 },
  { name: 'Feb', Ocupate: 250, Disponibile: 1750 },
  { name: 'Mar', Ocupate: 300, Disponibile: 1700 },
  { name: 'Apr', Ocupate: 320, Disponibile: 1680 },
  { name: 'Mai', Ocupate: 410, Disponibile: 1590 },
  { name: 'Iun', Ocupate: 550, Disponibile: 1450 },
  { name: 'Iul', Ocupate: 750, Disponibile: 1250 },
];

const ChartWidget: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-soft h-96">
            <h2 className="text-lg font-semibold text-text-main mb-4">Ocupare flotă (ultimele 6 luni)</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}/>
                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                    <Bar dataKey="Ocupate" stackId="a" fill="#0B5FFF" name="Vehicule Ocupate" />
                    <Bar dataKey="Disponibile" stackId="a" fill="#E5E7EB" name="Vehicule Disponibile" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartWidget;

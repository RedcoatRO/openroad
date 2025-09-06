
import React from 'react';

const vehicleData = [
  { id: 1, model: 'Sedan Business A4', type: 'Sedan', status: 'Activ', price: 399, available: 'Nu' },
  { id: 2, model: 'SUV Premium Q5', type: 'SUV', status: 'În revizie', price: 549, available: 'Nu' },
  { id: 3, model: 'Electric City ID.3', type: 'Electrică', status: 'Activ', price: 449, available: 'Da' },
  { id: 4, model: 'Utilitară Pro', type: 'Utilitară', status: 'Activ', price: 350, available: 'Da' },
  { id: 5, model: 'Sedan Business A6', type: 'Sedan', status: 'Activ', price: 499, available: 'Nu' },
];

const DataTable: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-soft overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    {/* Filters would go here */}
                </div>
                <button className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">Adaugă autoturism nou</button>
            </div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Model</th>
                        <th scope="col" className="px-6 py-3">Tip</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Preț/lună</th>
                        <th scope="col" className="px-6 py-3">Disponibilitate</th>
                        <th scope="col" className="px-6 py-3">Acțiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicleData.map(v => (
                        <tr key={v.id} className="bg-white border-b hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{v.model}</th>
                            <td className="px-6 py-4">{v.type}</td>
                            <td className="px-6 py-4">{v.status}</td>
                            <td className="px-6 py-4">€{v.price}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${v.available === 'Da' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v.available}</span>
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button className="text-primary hover:underline font-medium">Editează</button>
                                <button className="text-red-600 hover:underline font-medium">Șterge</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;

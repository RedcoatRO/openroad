
import React, { useState, useEffect, useCallback } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { QuoteRequest, RequestStatus, Vehicle } from '../../types';
import { DownloadIcon, PrinterIcon } from '../../components/icons';

const RequestManagementPage: React.FC = () => {
    const [requests, setRequests] = useState<QuoteRequest[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Încarcă atât solicitările, cât și vehiculele, pentru a avea datele complete
            const [reqs, vecs] = await Promise.all([
                adminDataService.getRequests(),
                adminDataService.getVehicles()
            ]);
            setRequests(reqs);
            setVehicles(vecs);
        } catch (error) {
            console.error("Eroare la încărcarea datelor:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
        try {
            await adminDataService.updateRequestStatus(requestId, newStatus);
            // Reîncarcă datele pentru a reflecta modificarea
            await loadData();
        } catch (error) {
            console.error("Eroare la actualizarea statusului:", error);
        }
    };

    // Obține modelul vehiculului pe baza ID-ului, folosind lista deja încărcată
    const getVehicleModel = (id: string) => {
        return vehicles.find(v => v.id === id)?.model || 'Vehicul șters';
    };
    
    const handleExportCSV = () => {
        const headers = ["ID Solicitare", "Data", "Companie", "Contact", "Email", "Status"];
        const rows = requests.map(r => [r.id, new Date(r.date).toLocaleDateString('ro-RO'), `"${r.companyName.replace(/"/g, '""')}"`, r.contactPerson, r.email, r.status].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lista_solicitari.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => window.print();

    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                <h1 className="text-3xl font-semibold text-text-main">Management Solicitări</h1>
                 <div className="flex items-center gap-2">
                     <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-2 rounded-lg hover:bg-gray-50"><DownloadIcon className="w-4 h-4"/>Export CSV</button>
                     <button onClick={handleExportPDF} className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-2 rounded-lg hover:bg-gray-50"><PrinterIcon className="w-4 h-4"/>Export PDF</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft overflow-x-auto printable-area">
                 <h2 className="text-xl font-bold mb-4 hidden print:block">Raport Solicitări Ofertă</h2>
                {isLoading ? (
                    <div className="text-center py-8">Se încarcă solicitările...</div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Dată</th>
                                <th className="px-6 py-3">Flotă Solicitată</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{req.companyName}</p>
                                        <p className="text-xs text-gray-500">{req.contactPerson} ({req.email})</p>
                                    </td>
                                    <td className="px-6 py-4">{new Date(req.date).toLocaleString('ro-RO')}</td>
                                    <td className="px-6 py-4">
                                        <ul className="list-disc list-inside">
                                            {req.fleet.map(item => (
                                                <li key={item.vehicleId}>{item.quantity} x {getVehicleModel(item.vehicleId)}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusChange(req.id, e.target.value as RequestStatus)}
                                            className={`p-1.5 text-xs font-semibold rounded-md border-2 no-print ${
                                                req.status === 'Nouă' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                                req.status === 'În lucru' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                req.status === 'Contactat' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                                                'bg-green-50 border-green-200 text-green-800'
                                            }`}
                                        >
                                            <option>Nouă</option>
                                            <option>În lucru</option>
                                            <option>Contactat</option>
                                            <option>Finalizată</option>
                                        </select>
                                        <span className="hidden print:inline">{req.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RequestManagementPage;

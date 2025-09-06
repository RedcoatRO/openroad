import React, { useState, useEffect } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { Client, QuoteRequest, Vehicle } from '../../types';

const ClientManagementPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    useEffect(() => {
        setClients(adminDataService.getClients());
        setVehicles(adminDataService.getVehicles()); // Încarcă datele actualizate ale vehiculelor
    }, []);

    const getVehicleModel = (id: number) => vehicles.find(v => v.id === id)?.model || 'Necunoscut';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-text-main">Bază de Date Clienți</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lista de clienți */}
                <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-soft h-[75vh] overflow-y-auto">
                    <h2 className="font-semibold text-lg mb-4 sticky top-0 bg-white pb-2">Clienți ({clients.length})</h2>
                    <ul className="space-y-2">
                        {clients.map(client => (
                            <li key={client.cui}>
                                <button 
                                    onClick={() => setSelectedClient(client)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedClient?.cui === client.cui ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                                >
                                    <p className="font-semibold">{client.companyName}</p>
                                    <p className={`text-xs ${selectedClient?.cui === client.cui ? 'text-blue-200' : 'text-muted'}`}>{client.contactPerson}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Detalii client selectat */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-soft h-[75vh] overflow-y-auto">
                    {selectedClient ? (
                        <div>
                            <h2 className="font-bold text-2xl mb-1">{selectedClient.companyName}</h2>
                            <p className="text-sm text-muted mb-4">CUI: {selectedClient.cui}</p>
                            
                            <div className="mb-6">
                                <h3 className="font-semibold text-md mb-2">Detalii Contact</h3>
                                <p><strong>Persoană:</strong> {selectedClient.contactPerson}</p>
                                <p><strong>Email:</strong> {selectedClient.email}</p>
                                <p><strong>Telefon:</strong> {selectedClient.phone}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-md mb-2">Istoric Solicitări ({selectedClient.requests.length})</h3>
                                <div className="space-y-4">
                                    {selectedClient.requests.map(req => (
                                        <div key={req.id} className="p-4 border rounded-lg bg-gray-50">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold">{new Date(req.date).toLocaleDateString('ro-RO')}</p>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                     req.status === 'Nouă' ? 'bg-blue-100 text-blue-800' :
                                                     req.status === 'În lucru' ? 'bg-yellow-100 text-yellow-800' :
                                                     'bg-green-100 text-green-800'
                                                }`}>{req.status}</span>
                                            </div>
                                            <ul className="list-disc list-inside text-sm mt-2">
                                                {req.fleet.map(item => (
                                                    <li key={item.vehicleId}>{item.quantity} x {getVehicleModel(item.vehicleId)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-muted">
                            <p>Selectează un client din listă pentru a vedea detaliile.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientManagementPage;
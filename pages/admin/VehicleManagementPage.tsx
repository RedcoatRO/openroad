import React, { useState, useEffect, useCallback } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { Vehicle } from '../../types';
import VehicleFormModal from '../../components/admin/VehicleFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { DownloadIcon, PrinterIcon } from '../../components/icons';

const VehicleManagementPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    // Funcție `useCallback` pentru a încărca vehiculele, pentru a putea fi refolosită
    const loadVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            // FIX: The getVehicles function requires a limit and returns a paginated response.
            const data = await adminDataService.getVehicles(999);
            // FIX: Access the 'vehicles' property from the response and update the state.
            setVehicles(data.vehicles);
        } catch (error) {
            console.error("Eroare la încărcarea vehiculelor:", error);
            // Aici se poate afișa o notificare de eroare
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Încarcă datele la prima randare a componentei
    useEffect(() => {
        loadVehicles();
    }, [loadVehicles]);

    const handleOpenModal = (vehicle: Vehicle | null = null) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
    };

    const handleOpenDeleteModal = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedVehicle(null);
    };

    const handleSave = async (vehicleData: Omit<Vehicle, 'id'> | Vehicle) => {
        try {
            if ('id' in vehicleData) {
                await adminDataService.updateVehicle(vehicleData);
            } else {
                await adminDataService.addVehicle(vehicleData);
            }
            await loadVehicles(); // Reîncarcă lista după salvare
        } catch (error) {
            console.error("Eroare la salvarea vehiculului:", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async () => {
        if (selectedVehicle) {
            try {
                await adminDataService.deleteVehicle(selectedVehicle.id);
                await loadVehicles(); // Reîncarcă lista după ștergere
            } catch (error) {
                console.error("Eroare la ștergerea vehiculului:", error);
            } finally {
                handleCloseDeleteModal();
            }
        }
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Model", "Brand", "Tip", "Pret", "Disponibil"];
        const rows = vehicles.map(v => [v.id, v.model, v.brand, v.type, v.price, v.isAvailable ? 'Da' : 'Nu'].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lista_vehicule.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                <h1 className="text-3xl font-semibold text-text-main">Management Autoturisme</h1>
                <div className="flex items-center gap-2">
                     <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-2 rounded-lg hover:bg-gray-50"><DownloadIcon className="w-4 h-4"/>Export CSV</button>
                     <button onClick={handleExportPDF} className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-2 rounded-lg hover:bg-gray-50"><PrinterIcon className="w-4 h-4"/>Export PDF</button>
                    <button onClick={() => handleOpenModal()} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">Adaugă Autoturism</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft overflow-x-auto printable-area">
                <h2 className="text-xl font-bold mb-4 hidden print:block">Raport Autoturisme</h2>
                 {isLoading ? (
                    <div className="text-center py-8">Se încarcă datele...</div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Model</th>
                                <th className="px-6 py-3">Tip</th>
                                <th className="px-6 py-3">Preț/lună (€)</th>
                                <th className="px-6 py-3">Disponibil</th>
                                <th className="px-6 py-3 no-print">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map(v => (
                                <tr key={v.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{v.model}</td>
                                    <td className="px-6 py-4">{v.type}</td>
                                    <td className="px-6 py-4">{v.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${v.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {v.isAvailable ? 'Da' : 'Nu'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2 no-print">
                                        <button onClick={() => handleOpenModal(v)} className="text-primary hover:underline font-medium">Editează</button>
                                        <button onClick={() => handleOpenDeleteModal(v)} className="text-red-600 hover:underline font-medium">Șterge</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && <VehicleFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} vehicle={selectedVehicle} />}
            {isDeleteModalOpen && selectedVehicle && <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDelete} itemName={selectedVehicle.model} />}
        </div>
    );
};

export default VehicleManagementPage;
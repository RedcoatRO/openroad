
import React, { useState, useEffect } from 'react';
import type { Vehicle } from '../../types';

interface VehicleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vehicle: Vehicle | Omit<Vehicle, 'id'>) => void;
    vehicle: Vehicle | null;
}

// Starea inițială goală pentru formularul de adăugare
const emptyFormState = {
    model: '', brand: '', sku: '', type: 'Sedan', tags: '', perks: '',
    price: 0, image: '', transmission: 'Manuală', engine: '',
    consumption: '', fuelType: 'Benzină', power: 0, features: '',
    popularity: 50, isAvailable: true,
    view360_exterior: '', view360_interior: ''
};

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, onSave, vehicle }) => {
    // Starea internă a formularului, inițializată cu datele vehiculului (dacă există) sau cu valori goale
    const [formData, setFormData] = useState(emptyFormState);

    useEffect(() => {
        if (vehicle) {
            // Populează formularul cu datele vehiculului selectat pentru editare
            setFormData({
                ...vehicle,
                tags: vehicle.tags.join(', '),
                perks: vehicle.perks.join(', '),
                features: vehicle.features.join(', '),
                view360_exterior: vehicle.view360?.exterior || '',
                view360_interior: vehicle.view360?.interior || '',
            });
        } else {
            // Resetează formularul la starea goală pentru adăugarea unui vehicul nou
             setFormData(emptyFormState);
        }
    }, [vehicle, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Se construiește obiectul vehicul final, procesând string-urile (ex: tags) înapoi în array-uri
        // și asamblând obiectul view360.
        const vehiclePayload = {
            ...formData,
            type: formData.type as Vehicle['type'],
            transmission: formData.transmission as Vehicle['transmission'],
            fuelType: formData.fuelType as Vehicle['fuelType'],
            tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
            perks: formData.perks.split(',').map(s => s.trim()).filter(Boolean),
            features: formData.features.split(',').map(s => s.trim()).filter(Boolean),
            view360: {
                exterior: formData.view360_exterior,
                interior: formData.view360_interior,
            }
        };
        // Se elimină câmpurile temporare din payload
        delete (vehiclePayload as any).view360_exterior;
        delete (vehiclePayload as any).view360_interior;

        if (vehicle) {
            onSave({ ...vehicle, ...vehiclePayload });
        } else {
            onSave(vehiclePayload);
        }
    };

    const inputClass = "w-full p-2 border border-gray-300 rounded-md text-sm";
    const labelClass = "block text-xs font-medium text-gray-600 mb-1";
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{vehicle ? 'Editează Autoturism' : 'Adaugă Autoturism Nou'}</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className={labelClass}>Model</label><input type="text" name="model" value={formData.model} onChange={handleChange} className={inputClass} required/></div>
                        <div><label className={labelClass}>Brand</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass} required/></div>
                        <div><label className={labelClass}>SKU</label><input type="text" name="sku" value={formData.sku} onChange={handleChange} className={inputClass} required/></div>
                        <div><label className={labelClass}>Tip Vehicul</label><select name="type" value={formData.type} onChange={handleChange} className={inputClass}><option>Sedan</option><option>SUV</option><option>Electrică</option><option>Utilitară</option></select></div>
                        <div><label className={labelClass}>Preț/lună (€)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} required/></div>
                        <div><label className={labelClass}>Putere (CP)</label><input type="number" name="power" value={formData.power} onChange={handleChange} className={inputClass} required/></div>
                        <div><label className={labelClass}>Motorizare</label><input type="text" name="engine" value={formData.engine} onChange={handleChange} className={inputClass}/></div>
                        <div><label className={labelClass}>Consum</label><input type="text" name="consumption" value={formData.consumption} onChange={handleChange} className={inputClass}/></div>
                        <div><label className={labelClass}>Tip Combustibil</label><select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClass}><option>Benzină</option><option>Diesel</option><option>Hibrid</option><option>Electrică</option></select></div>
                        <div><label className={labelClass}>Transmisie</label><select name="transmission" value={formData.transmission} onChange={handleChange} className={inputClass}><option>Manuală</option><option>Automată</option></select></div>
                         <div className="md:col-span-2"><label className={labelClass}>URL Imagine Principală</label><input type="text" name="image" value={formData.image} onChange={handleChange} className={inputClass} required/></div>
                         <div className="md:col-span-2"><label className={labelClass}>URL Imagine 360° Exterior (panoramic)</label><input type="text" name="view360_exterior" value={formData.view360_exterior} onChange={handleChange} className={inputClass} placeholder="https://..."/></div>
                         <div className="md:col-span-2"><label className={labelClass}>URL Imagine 360° Interior (panoramic)</label><input type="text" name="view360_interior" value={formData.view360_interior} onChange={handleChange} className={inputClass} placeholder="https://..."/></div>
                         <div className="md:col-span-2"><label className={labelClass}>Etichete (separate prin virgulă)</label><input type="text" name="tags" value={formData.tags} onChange={handleChange} className={inputClass}/></div>
                         <div className="md:col-span-2"><label className={labelClass}>Beneficii (separate prin virgulă)</label><input type="text" name="perks" value={formData.perks} onChange={handleChange} className={inputClass}/></div>
                         <div className="md:col-span-2"><label className={labelClass}>Dotări (separate prin virgulă)</label><input type="text" name="features" value={formData.features} onChange={handleChange} className={inputClass}/></div>
                        <div><label className={labelClass}>Popularitate (0-100)</label><input type="range" min="0" max="100" name="popularity" value={formData.popularity} onChange={handleChange} className="w-full"/></div>
                        <div className="flex items-center space-x-2"><input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="h-4 w-4"/><label>Este Disponibil?</label></div>
                    </div>
                </form>
                <div className="p-4 border-t flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Anulează</button>
                    <button type="submit" onClick={handleSubmit} form="vehicle-form" className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Salvează</button>
                </div>
            </div>
        </div>
    );
};

export default VehicleFormModal;

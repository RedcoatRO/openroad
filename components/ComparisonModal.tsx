import React, { useState } from 'react';
import type { Vehicle } from '../types';
import { XIcon, EyeIcon, EyeOffIcon } from './icons';
import Image from './Image';

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicles: Vehicle[];
}

const attributes: { key: keyof Vehicle; label: string }[] = [
    { key: 'model', label: 'Model' },
    { key: 'price', label: 'Preț lunar (€ + TVA)' },
    { key: 'transmission', label: 'Transmisie' },
    { key: 'engine', label: 'Motorizare' },
    { key: 'consumption', label: 'Consum' },
    { key: 'tags', label: 'Etichete' },
    { key: 'perks', label: 'Dotări' },
];

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, vehicles }) => {
    const [hiddenRows, setHiddenRows] = useState<string[]>([]);

    if (!isOpen || vehicles.length === 0) return null;

    const toggleRowVisibility = (key: string) => {
        setHiddenRows(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const renderValue = (vehicle: Vehicle, key: keyof Vehicle) => {
        const value = vehicle[key];
        if (Array.isArray(value)) {
            if (value.length === 0) return '-';
            return (
                <ul className="list-disc list-inside space-y-1">
                    {value.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            );
        }
        
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="comparison-title">
            <div className="bg-white dark:bg-gray-800 rounded-card shadow-xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 flex justify-between items-center border-b border-border dark:border-gray-700">
                    <h2 id="comparison-title" className="text-2xl font-bold text-text-main dark:text-white">Compară Vehicule</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Închide fereastra de comparație">
                        <XIcon className="w-6 h-6 text-muted dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-4 border-b border-border dark:border-gray-700">
                    <p className="text-sm font-semibold mb-2 text-text-main dark:text-white">Personalizează comparația:</p>
                    <div className="flex flex-wrap gap-2">
                        {attributes.map(attr => {
                            const isHidden = hiddenRows.includes(attr.key);
                            return (
                                <button
                                    key={attr.key}
                                    onClick={() => toggleRowVisibility(attr.key)}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                                        isHidden
                                            ? 'bg-gray-100 dark:bg-gray-700 text-muted dark:text-gray-400 border-transparent'
                                            : 'bg-blue-50 dark:bg-blue-900/50 text-primary border-blue-200 dark:border-blue-800'
                                    }`}
                                >
                                    {isHidden ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    {attr.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-grow overflow-auto">
                    <div className={`grid grid-cols-${vehicles.length + 1} gap-px bg-border dark:bg-gray-700 text-left`}>
                        <div className="bg-bg-alt dark:bg-gray-700 p-4 font-semibold text-text-main dark:text-white sticky top-0 z-10">Caracteristică</div>
                        {vehicles.map(v => (
                            <div key={v.id} className="bg-white dark:bg-gray-800 p-4 text-center sticky top-0 z-10">
                                <Image src={v.image} alt={v.model} className="w-full h-24 object-contain mx-auto mb-2" />
                                <h3 className="font-bold text-lg text-text-main dark:text-white">{v.model}</h3>
                            </div>
                        ))}

                        {attributes.map(attr => (
                            !hiddenRows.includes(attr.key) && (
                                <React.Fragment key={attr.key}>
                                    <div className="bg-bg-alt dark:bg-gray-700 p-4 font-semibold text-text-main dark:text-white">{attr.label}</div>
                                    {vehicles.map(v => (
                                        <div key={`${v.id}-${attr.key}`} className="bg-white dark:bg-gray-800 p-4 text-sm text-muted dark:text-gray-400">
                                            {renderValue(v, attr.key as keyof Vehicle)}
                                        </div>
                                    ))}
                                </React.Fragment>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonModal;

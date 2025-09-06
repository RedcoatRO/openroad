
import React from 'react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-lg font-bold">Confirmare Ștergere</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ești sigur că vrei să ștergi "<strong>{itemName}</strong>"? Această acțiune nu poate fi anulată.
                    </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Anulează</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Șterge</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;

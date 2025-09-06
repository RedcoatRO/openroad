
import React, { useState, useEffect } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { FAQItem } from '../../types';

const ContentManagementPage: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [isEditing, setIsEditing] = useState<FAQItem | null>(null);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    useEffect(() => {
        setFaqs(adminDataService.getFAQs());
    }, []);

    const handleEditClick = (faq: FAQItem) => {
        setIsEditing(faq);
        setNewQuestion(faq.question);
        setNewAnswer(faq.answer);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setNewQuestion('');
        setNewAnswer('');
    };

    const handleSave = () => {
        if (isEditing) {
            adminDataService.updateFAQ({ ...isEditing, question: newQuestion, answer: newAnswer });
        } else {
            adminDataService.addFAQ({ question: newQuestion, answer: newAnswer });
        }
        setFaqs(adminDataService.getFAQs());
        handleCancel();
    };

    const handleDelete = (faqId: number) => {
        adminDataService.deleteFAQ(faqId);
        setFaqs(adminDataService.getFAQs());
    };
    
    const inputClass = "w-full p-2 border border-gray-300 rounded-md text-sm";
    const labelClass = "block text-xs font-medium text-gray-600 mb-1";

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-text-main">Management Conținut (FAQ)</h1>

            {/* Formular de adăugare/editare */}
            <div className="bg-white p-6 rounded-lg shadow-soft space-y-4">
                <h2 className="text-lg font-semibold">{isEditing ? 'Editează Întrebare' : 'Adaugă Întrebare Nouă'}</h2>
                <div>
                    <label className={labelClass}>Întrebare</label>
                    <input type="text" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Răspuns</label>
                    <textarea value={newAnswer} onChange={e => setNewAnswer(e.target.value)} rows={3} className={inputClass}></textarea>
                </div>
                <div className="flex space-x-2">
                    <button onClick={handleSave} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-600">Salvează</button>
                    {isEditing && <button onClick={handleCancel} className="bg-gray-200 px-4 py-2 rounded-lg">Anulează</button>}
                </div>
            </div>

            {/* Lista de FAQ-uri existente */}
            <div className="bg-white p-6 rounded-lg shadow-soft space-y-4">
                <h2 className="text-lg font-semibold">Listă Întrebări Frecvente</h2>
                {faqs.map(faq => (
                    <div key={faq.id} className="border-b pb-2">
                        <p className="font-semibold">{faq.question}</p>
                        <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                        <div className="flex space-x-2 mt-2">
                            <button onClick={() => handleEditClick(faq)} className="text-primary text-sm hover:underline">Editează</button>
                            <button onClick={() => handleDelete(faq.id)} className="text-red-600 text-sm hover:underline">Șterge</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentManagementPage;

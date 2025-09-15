import React, { useState } from 'react';
import type { FAQItem } from '../types';
import { ChevronDownIcon } from './icons';

/**
 * Componentă reutilizabilă pentru afișarea unui item de tip FAQ (Întrebare Frecventă).
 * Gestionează propria stare de vizibilitate (expandat/restrâns) și afișează
 * întrebarea și răspunsul corespunzător.
 * @param {FAQItem} item - Obiectul care conține întrebarea și răspunsul.
 */
const FAQAccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
    // Stare internă pentru a determina dacă răspunsul este vizibil sau nu.
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-border dark:border-gray-700">
            {/* Butonul care conține întrebarea și acționează ca un comutator */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
            >
                <span className="font-semibold text-text-main dark:text-white">{item.question}</span>
                {/* Iconița se rotește pentru a indica starea de expandare */}
                <ChevronDownIcon className={`w-5 h-5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {/* Răspunsul este randat condiționat, bazat pe starea `isOpen` */}
            {isOpen && (
                <div 
                    id={`faq-answer-${item.id}`}
                    className="pb-4 text-muted dark:text-gray-400"
                    role="region"
                >
                    <p>{item.answer}</p>
                </div>
            )}
        </div>
    );
};

export default FAQAccordionItem;

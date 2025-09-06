
import React from 'react';
import { FileDownIcon } from './icons';

interface DocumentItemProps {
    title: string;
    description: string;
    fileUrl: string;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ title, description, fileUrl }) => {
    
    // Funcția de descărcare este simulată
    const handleDownload = (e: React.MouseEvent) => {
        // Într-o aplicație reală, acest link ar duce direct la fișier.
        // Pentru demonstrație, prevenim acțiunea default dacă este un placeholder.
        if (fileUrl === '#') {
            e.preventDefault();
            alert(`Simulare descărcare pentru: ${title}`);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-border dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-text-main dark:text-white">{title}</h3>
                <p className="text-sm text-muted dark:text-gray-400 mt-1">{description}</p>
            </div>
            <a
                href={fileUrl}
                onClick={handleDownload}
                download
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-btn hover:bg-primary-600 transition-colors text-sm w-full sm:w-auto"
            >
                <FileDownIcon className="w-4 h-4" />
                Descarcă
            </a>
        </div>
    );
};

export default DocumentItem;

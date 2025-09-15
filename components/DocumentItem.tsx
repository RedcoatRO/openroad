import React from 'react';
import { FileDownIcon } from './icons';

interface DocumentItemProps {
    title: string;
    description: string;
    fileUrl: string;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ title, description, fileUrl }) => {
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-border dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-text-main dark:text-white">{title}</h3>
                <p className="text-sm text-muted dark:text-gray-400 mt-1">{description}</p>
            </div>
            {/* 
              - Linkul este acum un <a> tag standard care duce direct la fișierul din Firebase Storage.
              - `download` este un atribut HTML5 care sugerează browserului să descarce fișierul.
              - `target="_blank"` și `rel="noopener noreferrer"` sunt bune practici pentru deschiderea link-urilor externe/fișierelor într-un tab nou.
            */}
            <a
                href={fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-btn hover:bg-primary-600 transition-colors text-sm w-full sm:w-auto"
            >
                <FileDownIcon className="w-4 h-4" />
                Descarcă
            </a>
        </div>
    );
};

export default DocumentItem;
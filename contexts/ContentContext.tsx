import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { adminDataService } from '../utils/adminDataService';

interface ContentContextType {
    contentOverrides: Record<string, string>;
    isLoading: boolean;
    getContent: (id: string, fallback?: string) => string;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [contentOverrides, setContentOverrides] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = adminDataService.listenToContentOverrides((content) => {
            setContentOverrides(content);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getContent = (id: string, fallback: string = ''): string => {
        // Returnează valoarea din baza de date dacă există, altfel returnează valoarea de rezervă.
        // Folosim `??` (nullish coalescing) pentru a trata corect string-urile goale salvate intenționat.
        return contentOverrides[id] ?? fallback;
    };
    
    const value = { contentOverrides, isLoading, getContent };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};

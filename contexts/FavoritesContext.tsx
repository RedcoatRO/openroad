
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface FavoritesContextType {
    favoriteIds: string[]; // Modificat din number[] în string[]
    toggleFavorite: (id: string) => void; // Modificat din number în string
    isFavorite: (id: string) => boolean; // Modificat din number în string
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
    children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
    // Inițializarea stării listei de favorite, citind din localStorage.
    const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
        try {
            const savedFavorites = localStorage.getItem('favoriteVehicles');
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        } catch (error) {
            console.error("Failed to parse favorites from localStorage", error);
            return [];
        }
    });

    // Efect care rulează ori de câte ori lista `favoriteIds` se schimbă.
    useEffect(() => {
        // Salvează lista curentă de favorite în localStorage.
        localStorage.setItem('favoriteVehicles', JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    // Funcție pentru a adăuga sau elimina un ID din lista de favorite.
    const toggleFavorite = useCallback((id: string) => {
        setFavoriteIds(prevIds => {
            if (prevIds.includes(id)) {
                // Elimină ID-ul dacă există deja
                return prevIds.filter(favId => favId !== id);
            } else {
                // Adaugă ID-ul dacă nu există
                return [...prevIds, id];
            }
        });
    }, []);

    // Funcție pentru a verifica dacă un ID este în lista de favorite.
    const isFavorite = useCallback((id: string) => {
        return favoriteIds.includes(id);
    }, [favoriteIds]);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// Crearea contextului cu o valoare default. Va fi suprascrisă de Provider.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Inițializarea stării temei, încercând să citească din localStorage.
    // Folosește 'light' ca default dacă nu găsește nicio valoare salvată.
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'light';
    });

    // Efect care rulează ori de câte ori starea `theme` se schimbă.
    useEffect(() => {
        const root = window.document.documentElement;
        
        // Elimină clasa veche și adaugă clasa curentă pe elementul <html>
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);

        // Salvează preferința curentă a temei în localStorage.
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Funcție pentru a comuta între teme.
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

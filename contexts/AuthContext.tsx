
import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';

// Tipul pentru stările posibile de autentificare
type AuthState = 'loggedOut' | 'requires2FA' | 'loggedIn';

// Interfața pentru valorile expuse de context
interface AuthContextType {
    authState: AuthState;
    login: (user: string, pass: string) => boolean;
    verify2FA: (code: string) => boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Funcție helper pentru a citi starea inițială din sessionStorage
const getInitialAuthState = (): AuthState => {
    try {
        const storedState = sessionStorage.getItem('authState');
        // Permite continuarea sesiunii dacă utilizatorul era logat sau în așteptarea 2FA
        if (storedState === 'loggedIn' || storedState === 'requires2FA') {
            return storedState as AuthState;
        }
    } catch (e) {
        console.error('Nu s-a putut citi starea de autentificare din session storage', e);
    }
    return 'loggedOut';
};

/**
 * Provider-ul de context pentru autentificare.
 * Înfășoară aplicația și oferă acces la starea și funcțiile de autentificare.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);

    // Funcție centralizată pentru a actualiza starea și a o persista
    const updateAuthState = useCallback((newState: AuthState) => {
        setAuthState(newState);
        try {
            sessionStorage.setItem('authState', newState);
        } catch (e) {
            console.error('Nu s-a putut scrie starea de autentificare în session storage', e);
        }
    }, []);

    // Funcția de login (Pasul 1)
    const login = useCallback((user: string, pass: string): boolean => {
        // Simulare validare username/parolă cu noile credențiale.
        if (user === 'lucian' && pass === '_rent_a_car') {
            updateAuthState('requires2FA'); // Trecem la starea de așteptare 2FA
            return true;
        }
        return false;
    }, [updateAuthState]);

    // Funcția de verificare a codului 2FA (Pasul 2)
    const verify2FA = useCallback((code: string): boolean => {
        // Simulare validare cod 2FA cu noul cod.
        if (code === '086420') {
            updateAuthState('loggedIn'); // Utilizatorul este complet autentificat
            return true;
        }
        return false;
    }, [updateAuthState]);

    // Funcția de logout
    const logout = useCallback(() => {
        updateAuthState('loggedOut'); // Resetează starea
        try {
            // Curăță starea din sessionStorage la deconectare
            sessionStorage.removeItem('authState');
        } catch (e) {
            console.error('Nu s-a putut șterge starea de autentificare din session storage', e);
        }
    }, [updateAuthState]);
    
    // Memorăm valoarea contextului pentru a preveni re-render-uri inutile
    // la componentele consumatoare, atunci când starea nu se schimbă.
    const value = useMemo(() => ({
        authState,
        login,
        verify2FA,
        logout
    }), [authState, login, verify2FA, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

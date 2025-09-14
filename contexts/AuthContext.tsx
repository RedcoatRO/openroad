import React, { createContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

// Tipul pentru stările posibile de autentificare
// FIX: Add 'requires2FA' to AuthState type to fix type error in TwoFactorAuthPage.tsx.
type AuthState = 'loading' | 'loggedOut' | 'loggedIn' | 'requires2FA';

// Interfața pentru valorile expuse de context
interface AuthContextType {
    authState: AuthState;
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    // FIX: Add 'verify2FA' to AuthContextType to fix type error in TwoFactorAuthPage.tsx.
    verify2FA: (code: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider-ul de context pentru autentificare.
 * Înfășură aplicația și oferă acces la starea și funcțiile de autentificare Firebase.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>('loading');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // onAuthStateChanged este un listener care notifică despre schimbările stării de autentificare.
        // Acesta gestionează persistența sesiunii.
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setAuthState('loggedIn');
            } else {
                setUser(null);
                setAuthState('loggedOut');
            }
        });

        // Curăță listener-ul la demontarea componentei pentru a preveni memory leaks.
        return () => unsubscribe();
    }, []);

    // Funcția de login (asincronă)
    const login = useCallback(async (email: string, pass: string) => {
        // Apelează funcția de login a Firebase. Va arunca o eroare în caz de eșec.
        await signInWithEmailAndPassword(auth, email, pass);
    }, []);

    // Funcția de logout (asincronă)
    const logout = useCallback(async () => {
        await signOut(auth);
    }, []);
    
    // FIX: Add a mock implementation for verify2FA to resolve compilation errors.
    const verify2FA = useCallback((code: string): boolean => {
        console.warn('verify2FA is a mock implementation and will not be triggered with current login flow.');
        if (code === '123456') {
            setAuthState('loggedIn');
            return true;
        }
        return false;
    }, []);
    
    // Memorăm valoarea contextului pentru a preveni re-render-uri inutile.
    const value = useMemo(() => ({
        authState,
        user,
        login,
        logout,
        verify2FA
    }), [authState, user, login, logout, verify2FA]);

    // Afișează un ecran de încărcare global cât timp Firebase verifică starea de autentificare
    if (authState === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg-main">
                <p>Se încarcă...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
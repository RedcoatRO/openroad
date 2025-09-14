import React, { createContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { auth, firebase } from '../utils/firebase'; // Importăm serviciul de autentificare real

// Tipul pentru utilizatorul Firebase. Va fi null dacă nu este nimeni autentificat.
export type FirebaseUser = firebase.User;

// Tipul pentru stările posibile de autentificare
type AuthState = 'loading' | 'loggedOut' | 'loggedIn';

// Interfața pentru valorile expuse de context
interface AuthContextType {
    authState: AuthState;
    user: FirebaseUser | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider-ul de context pentru autentificare reală cu Firebase.
 * Gestionează starea de login a utilizatorului și sesiunea acestuia.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>('loading');
    const [user, setUser] = useState<FirebaseUser | null>(null);

    // La încărcarea inițială, adăugăm un listener care reacționează la schimbările
    // stării de autentificare din Firebase.
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                // Dacă există un utilizator, actualizăm starea ca "logat"
                setUser(firebaseUser);
                setAuthState('loggedIn');
            } else {
                // Dacă nu, starea devine "delogat"
                setUser(null);
                setAuthState('loggedOut');
            }
        });

        // Curățăm listener-ul la demontarea componentei pentru a preveni memory leaks.
        return () => unsubscribe();
    }, []);

    // Funcția de login reală, care folosește signInWithEmailAndPassword de la Firebase
    const login = useCallback(async (email: string, pass: string) => {
        await auth.signInWithEmailAndPassword(email, pass);
    }, []);

    // Funcția de logout reală, care folosește signOut de la Firebase
    const logout = useCallback(async () => {
        await auth.signOut();
    }, []);
    
    // Memorăm valoarea contextului pentru a preveni re-render-uri inutile
    const value = useMemo(() => ({
        authState,
        user,
        login,
        logout,
    }), [authState, user, login, logout]);

    // Afișează un ecran de încărcare global cât timp Firebase verifică starea sesiunii
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
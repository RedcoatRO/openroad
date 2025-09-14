
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { fallbackLogoUri } from '../../utils/siteData';

/**
 * Pagina de Login care folosește acum sistemul de autentificare real Firebase.
 */
const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@openroad.ro'); // Pre-populat pentru comoditate
    const [password, setPassword] = useState('password'); // Pre-populat pentru comoditate
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!auth) {
            setError("Serviciul de autentificare nu este disponibil.");
            setIsLoading(false);
            return;
        }

        try {
            await auth.login(email, password);
            // Navigarea la panoul de admin este gestionată automat de ProtectedRoute
            navigate('/admin');
        } catch (err: any) {
            // Gestionează erorile specifice Firebase pentru un feedback mai bun
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Email sau parolă incorecte.');
                    break;
                case 'auth/invalid-email':
                    setError('Adresa de email nu este validă.');
                    break;
                case 'auth/too-many-requests':
                     setError('Prea multe încercări eșuate. Încearcă din nou mai târziu.');
                     break;
                default:
                    setError('A apărut o eroare neașteptată. Vă rugăm încercați din nou.');
                    console.error(err);
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-admin-alt">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-soft">
                <div className="text-center">
                    <img src={fallbackLogoUri} alt="Open Road Leasing Logo" className="h-8 w-auto mx-auto" />
                    <h1 className="mt-4 text-2xl font-bold text-text-main">Autentificare Admin</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted">Parolă</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-btn hover:bg-primary-600 disabled:bg-gray-400">
                            {isLoading ? 'Se autentifică...' : 'Autentificare'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

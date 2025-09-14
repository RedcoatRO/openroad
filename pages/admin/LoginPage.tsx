import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Logo } from '../../components/icons';

/**
 * Pagina de Login care folosește Firebase Authentication.
 */
const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            // Navigarea la panoul de admin este gestionată automat de ProtectedRoute la schimbarea stării
            navigate('/admin');
        } catch (err: any) {
            // Gestionează erorile specifice Firebase
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Email sau parolă incorecte.');
            } else {
                setError('A apărut o eroare la autentificare.');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-admin-alt">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-soft">
                <div className="text-center">
                    <Logo />
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
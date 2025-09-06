
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Logo } from '../../components/icons';

/**
 * Pagina de verificare 2FA (Pasul 2 al autentificării).
 * Utilizatorul introduce codul de 6 cifre.
 */
const TwoFactorAuthPage: React.FC = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirecționează utilizatorul la login dacă nu a parcurs primul pas
    useEffect(() => {
        if (auth?.authState !== 'requires2FA') {
            navigate('/admin/login');
        }
    }, [auth, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (auth && auth.verify2FA(code)) {
            // Dacă codul este corect, navighează la panoul de administrare
            navigate('/admin');
        } else {
            setError('Codul de verificare este incorect.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-admin-alt">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-soft">
                <div className="text-center">
                    <Logo />
                    <h1 className="mt-4 text-2xl font-bold text-text-main">Verificare 2FA</h1>
                    <p className="mt-2 text-sm text-muted">Introdu codul din aplicația de autentificare.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted">Cod de 6 cifre</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Permite doar cifre
                            maxLength={6}
                            required
                            className="w-full px-3 py-2 mt-1 text-center text-lg tracking-[0.5em] border rounded-md"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button type="submit" className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-btn hover:bg-primary-600">
                            Verifică
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorAuthPage;

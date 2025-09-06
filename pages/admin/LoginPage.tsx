
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Logo } from '../../components/icons';

/**
 * Pagina de Login (Pasul 1 al autentificării).
 * Utilizatorul introduce numele de utilizator și parola.
 */
const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (auth && auth.login(username, password)) {
            // Dacă datele sunt corecte, navighează la pagina de 2FA
            navigate('/admin/2fa');
        } else {
            setError('Nume de utilizator sau parolă incorecte.');
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
                        <label className="block text-sm font-medium text-muted">Utilizator (Hint: admin)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted">Parolă (Hint: password123)</label>
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
                        <button type="submit" className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-btn hover:bg-primary-600">
                            Continuă
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

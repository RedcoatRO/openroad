
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

/**
 * O componentă "gardian" care protejează rutele.
 * Verifică starea de autentificare din AuthContext.
 * Dacă utilizatorul nu este complet autentificat, îl redirecționează la pagina de login.
 * Altfel, randează componenta copil (pagina protejată).
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const auth = useContext(AuthContext);
    const location = useLocation();

    // Verifică dacă contextul este disponibil
    if (!auth) {
        // Acest caz nu ar trebui să apară dacă aplicația este înfășurată corect în AuthProvider
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Verifică dacă starea de autentificare este 'loggedIn'
    if (auth.authState !== 'loggedIn') {
        // Redirecționează la pagina de login, păstrând locația curentă
        // pentru a putea reveni la ea după autentificare.
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Dacă utilizatorul este autentificat, permite accesul la rută
    return children;
};

export default ProtectedRoute;

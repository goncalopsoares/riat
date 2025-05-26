import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useState, useEffect, useRef } from 'react';
import { useUser } from "../contexts/UserContext";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const { setUser } = useUser();
    const hasLoggedOut = useRef(false);

    useEffect(() => {
        auth().catch(() => logout());
    }, []);

    const logout = () => {
        if (hasLoggedOut.current) return;
        hasLoggedOut.current = true;

        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem('user');
        alert('Your session has expired. Please log in again.');
        setIsAuthorized(false);
        setUser(null);
    };


    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) return logout();

        try {
            const response = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            if (response.status === 200) {
                const newAccess = response.data.access;
                localStorage.setItem(ACCESS_TOKEN, newAccess);
                scheduleLogout(newAccess);
                setIsAuthorized(true);
            } else {
                logout();
            }
        } catch (error) {
            logout();
        }
    };

    const scheduleLogout = (token) => {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp;
        const now = Date.now() / 1000;
        const timeLeft = expirationTime - now;

        if (timeLeft > 0) {
            setTimeout(() => {
                logout();
            }, timeLeft * 1000);
        } else {
            logout();
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return logout();

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            scheduleLogout(token);
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
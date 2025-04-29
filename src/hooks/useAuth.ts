import { useState, useEffect, useCallback } from 'react';

/**
 * Interface for the authentication state
 */
interface AuthState {
    isAuthenticated: boolean;
    userToken: string | null;
    userId: string | null;
}

/**
 * Interface for the authentication context value
 */
interface UseAuthReturn extends AuthState {
    login: (token: string, userId: string) => void;
    logout: () => void;
}

/**
 * A custom hook for handling authentication state
 * Checks localStorage for userToken and provides login/logout functionality
 */
const useAuth = (): UseAuthReturn => {
    // Initialize state with values from localStorage
    const [authState, setAuthState] = useState<AuthState>(() => {
        const token = localStorage.getItem('userToken');
        const userId = localStorage.getItem('userId');

        return {
            isAuthenticated: !!token,
            userToken: token,
            userId: userId
        };
    });

    // Login function - sets token in localStorage and updates state
    const login = useCallback((token: string, userId: string) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', userId);

        setAuthState({
            isAuthenticated: true,
            userToken: token,
            userId: userId
        });
    }, []);

    // Logout function - removes token from localStorage and updates state
    const logout = useCallback(() => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');

        setAuthState({
            isAuthenticated: false,
            userToken: null,
            userId: null
        });
    }, []);

    // Effect to check for token changes in localStorage (useful for multiple tabs)
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('userToken');
            const userId = localStorage.getItem('userId');

            // Update state if token changed
            if (!!token !== authState.isAuthenticated) {
                setAuthState({
                    isAuthenticated: !!token,
                    userToken: token,
                    userId: userId
                });
            }
        };

        // Listen for storage events to handle changes in other tabs
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, [authState.isAuthenticated]);

    return {
        ...authState,
        login,
        logout
    };
};

export default useAuth;
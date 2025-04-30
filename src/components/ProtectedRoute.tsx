import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Define the props for the ProtectedRoute component
interface ProtectedRouteProps {
    isAuthenticated: boolean;
    authenticationPath: string;
    redirectPath?: string;
    children?: React.ReactNode;
}

/**
 * A wrapper component that protects routes from unauthenticated access - please note that for production this will need
 * to be paired with backend-dispensed JWTs to validate the frontend authentication - ensuring that means such as request
 * tunneling cannot circumvent login requirements.
 * @param isAuthenticated - Boolean flag indicating if the user is authenticated
 * @param authenticationPath - Path to redirect to if user is not authenticated
 * @param redirectPath - Optional path to redirect to if user is authenticated
 * @param children - Child components to render if user is authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  isAuthenticated,
                                                                  authenticationPath,
                                                                  redirectPath,
                                                                  children
                                                              }) => {
    const location = useLocation();

    // If redirect path is provided and user is authenticated, redirect to that path
    if (redirectPath && isAuthenticated) {
        return <Navigate to={redirectPath} />;
    }

    // If user is not authenticated, redirect to authentication path
    if (!isAuthenticated) {
        // Save the attempted location for redirection after login
        return <Navigate to={authenticationPath} state={{ from: location }} replace />;
    }

    // If the user is authenticated, render the children or the outlet for nested routes
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
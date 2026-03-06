import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If authenticated, redirect based on role
    if (isAuthenticated) {
        const { user } = useAuthStore.getState();
        if (user?.role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    // Otherwise, allow access to public routes (Login, Register, etc.)
    return <Outlet />;
};

export default PublicRoute;

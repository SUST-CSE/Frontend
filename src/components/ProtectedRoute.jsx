import { Navigate } from 'react-router-dom';
import useStore from '../zustand/store';
import { ROLES } from '../utils/constants';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useStore();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles) {
        // Check both 'role' (for admin) and 'userType' (for student/teacher)
        const userRole = (user?.role || user?.userType)?.toLowerCase();
        const allowed = allowedRoles.map(r => r.toLowerCase());

        // Debug logging to help troubleshoot
        console.log('🔒 ProtectedRoute Check:', {
            user: user,
            userRole: userRole,
            allowedRoles: allowed,
            isAllowed: allowed.includes(userRole)
        });

        if (!allowed.includes(userRole)) {
            console.warn('❌ Access denied - redirecting to home');
            return <Navigate to="/" replace />;
        }

        console.log('✅ Access granted');
    }

    return children;
};

export default ProtectedRoute;

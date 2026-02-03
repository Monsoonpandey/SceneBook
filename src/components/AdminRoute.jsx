import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children, user }) => {
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'admin') {
        // Redirect to home if not admin
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
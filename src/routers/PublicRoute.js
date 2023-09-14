import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ isAuthenticated, redirectPath = '/panel' }) => {
    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />
    }
    return <Outlet />;
}

export default PublicRoute;
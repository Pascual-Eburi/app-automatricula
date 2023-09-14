import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, redirectPath = '/login' }) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace={true} />
    }
    return <Outlet />;
}

export default PrivateRoute;
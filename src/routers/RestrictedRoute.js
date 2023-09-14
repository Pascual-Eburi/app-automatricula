import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RestrictedRoute = ({ allowedRoles,userRole, redirectPath = '/panel' }) => {
    if (!(allowedRoles.includes(userRole))) {
        return <Navigate to={redirectPath} replace={true} />
    }
    return <Outlet />;
}

export default RestrictedRoute;
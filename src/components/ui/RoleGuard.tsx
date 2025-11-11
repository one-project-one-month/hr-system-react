import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface RoleGuardProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
    const { user, isAuthenticated } = useAuthStore();

    console.log(user?.roleName, isAuthenticated)
    // Not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (user && !allowedRoles.includes(user.roleName.toLocaleLowerCase())) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Authorized → render children
    return <>{children}</>;
};

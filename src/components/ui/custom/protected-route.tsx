import type { ProtectedRouteProps } from "@/types/auth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAllowed,
    redirect = "/unauthorized",
    children,
}) => {
    if (!isAllowed) return <Navigate to={redirect} replace />;
    return <>{children}</>;
};

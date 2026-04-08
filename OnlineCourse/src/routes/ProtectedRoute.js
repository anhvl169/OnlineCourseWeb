import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, hasRole } from "../utils/authUtils";

export default function ProtectedRoute({ roles }) {
    // chưa login
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    //sai role
    if (roles && !hasRole(roles)) {
        return <Navigate to="/unauthorized" />;
    }

    //OK
    return <Outlet />;
}
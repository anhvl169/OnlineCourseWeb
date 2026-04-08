import jwt_decode from "jwt-decode";

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    const token = getToken();
    if (!token) return null;

    try {
        return jwt_decode(token);
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const hasRole = (roles) => {
    const user = getUser();
    if (!user) return false;

    return roles.includes(user.role);
};
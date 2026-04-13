import { jwtDecode } from "jwt-decode";

// Lấy token từ localStorage
export const getToken = () => {
    return localStorage.getItem("token");
};

// Lấy user data từ token
export const getUserFromToken = () => {
    try {
        const token = getToken();
        if (!token) return null;
        return jwtDecode(token);
    } catch {
        return null;
    }
};

// Lấy user role
export const getUserRole = () => {
    const user = getUserFromToken();
    return user?.roles || [];
};

export const hasRole = (roles) => {
    const user = getUserFromToken();

    if (!user || !user.roles) return false;

    const userRoles = user.roles.map(r => r.toLowerCase());

    return roles.some(role => userRoles.includes(role.toLowerCase()));
};
// Lấy user id
export const getUserId = () => {
    const user = getUserFromToken();
    return user?.userId || null;
};

// Lấy user name
export const getUserName = () => {
    const user = getUserFromToken();
    return user?.name || null;
};

// Check xem user đã đăng nhập chưa
export const isAuthenticated = () => {
    const user = getUserFromToken();
    if (!user) return false;

    return user.exp > Date.now() / 1000;
};

// Logout
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};
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
        
        const decoded = jwtDecode(token);
        return decoded;
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
};

// Lấy user role
export const getUserRole = () => {
    const user = getUserFromToken();
    return user?.role || null;
};

export const hasRole = (roles) => {
    const user = getUserFromToken();
    
    if (!user) return false;

    return roles.includes(user.role);
};
// Lấy user id
export const getUserId = () => {
    const user = getUserFromToken();
    return user?.id || null;
};

// Lấy user name
export const getUserName = () => {
    const user = getUserFromToken();
    return user?.name || null;
};

// Check xem user đã đăng nhập chưa
export const isAuthenticated = () => {
    return !!getToken();
};

// Logout
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};

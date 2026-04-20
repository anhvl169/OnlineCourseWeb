// context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let token = localStorage.getItem("token");

        if (!token) {
            const params = new URLSearchParams(window.location.search);
            token = params.get("token");

            if (token) {
                localStorage.setItem("token", token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("token");
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
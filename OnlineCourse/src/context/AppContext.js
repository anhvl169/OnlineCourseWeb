import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ChatProvider } from "./ChatContext";
import { createContext } from "react";
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>
                <ChatProvider>
                    {children}
                </ChatProvider>
            </CartProvider>
        </AuthProvider>
    );
}


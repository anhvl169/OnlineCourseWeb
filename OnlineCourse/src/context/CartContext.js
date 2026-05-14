import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Lấy cart từ server
    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(response.data.items || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Lỗi lấy giỏ hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    // Thêm vào giỏ hàng
    const addToCart = async (courseId, price, courseTitle, courseImg) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/cart/add',
                { courseId, price },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchCart();

            return { success: true, message: 'Thêm vào giỏ hàng thành công' };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Lỗi thêm vào giỏ hàng';
            return { success: false, message: errorMsg };
        }
    };

    // Xóa khỏi giỏ hàng
    const removeFromCart = async (cartItemId) => {
        try {
            const itemToRemove = cart.find(item => item.cart_item_id === cartItemId);
            if (!itemToRemove) return { success: false, message: 'Item không tồn tại' };

            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/cart/${cartItemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchCart();

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCart();
        }
    }, []);

    return (
        <CartContext.Provider value={{
            cart,
            total,
            loading,
            addToCart,
            removeFromCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart phải được sử dụng trong CartProvider');
    }
    return context;
};

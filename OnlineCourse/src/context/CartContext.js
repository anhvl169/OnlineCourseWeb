import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const { user } = useContext(AuthContext);

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // fetch cart
    const fetchCart = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');

            if (!token) return;

            const response = await axios.get(
                'http://localhost:5000/api/cart',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCart(response.data.items || []);
            setTotal(response.data.total || 0);

        } catch (error) {
            console.error('Lỗi lấy giỏ hàng:', error);

            setCart([]);
            setTotal(0);

        } finally {
            setLoading(false);
        }
    };

    // add
    const addToCart = async (courseId, price) => {
        try {

            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost:5000/api/cart/add',
                { courseId, price },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchCart();

            return {
                success: true,
                message: 'Thêm vào giỏ hàng thành công'
            };

        } catch (error) {

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    'Lỗi thêm vào giỏ hàng'
            };
        }
    };

    // remove
    const removeFromCart = async (cartItemId) => {
        try {

            const token = localStorage.getItem('token');

            await axios.delete(
                `http://localhost:5000/api/cart/${cartItemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchCart();

            return { success: true };

        } catch (error) {

            return {
                success: false,
                message: error.response?.data?.message
            };
        }
    };

    useEffect(() => {

        if (user) {
            fetchCart();
        } else {
            setCart([]);
            setTotal(0);
        }

    }, [user]);

    return (
        <CartContext.Provider
            value={{
                cart,
                total,
                loading,
                addToCart,
                removeFromCart,
                fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            'useCart phải được sử dụng trong CartProvider'
        );
    }

    return context;
};
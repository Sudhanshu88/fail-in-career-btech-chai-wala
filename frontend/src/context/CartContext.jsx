import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user || user.role === 'admin') return;
        try {
            setLoading(true);
            const res = await api.get('/cart');
            setCart(res.data);
        } catch (error) {
            console.error('Error fetching cart', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role !== 'admin') {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user]);

    const addToCart = async (product_id, quantity = 1) => {
        if (!user) {
            alert("Please login to add items to cart.");
            return;
        }
        try {
            await api.post('/cart', { product_id, quantity });
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Error adding to cart', error);
        }
    };

    const updateQuantity = async (cart_id, quantity) => {
        try {
            await api.put(`/cart/${cart_id}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error('Error updating cart', error);
        }
    };

    const removeFromCart = async (cart_id) => {
        try {
            await api.delete(`/cart/${cart_id}`);
            fetchCart();
        } catch (error) {
            console.error('Error removing from cart', error);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart');
            fetchCart();
        } catch (error) {
            console.error('Error clearing cart', error);
        }
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

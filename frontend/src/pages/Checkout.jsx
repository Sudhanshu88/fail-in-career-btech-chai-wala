import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const gst = cartTotal * 0.05;
    const finalTotal = cartTotal + gst;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        
        const cartItems = cart.map(item => ({ product_id: item.product_id, quantity: item.quantity, price: item.price }));
        
        try {
            await api.post('/orders', { mobile, delivery_address: address, payment_method: paymentMethod, cart_items: cartItems });
            clearCart();
            alert('Order placed successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to place order. Please try again.');
        }
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-chai-cream py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-chai-dark mb-8 text-center">Checkout</h1>
                
                {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}
                
                <div className="bg-white rounded-xl shadow-md p-6">
                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number for Delivery</label>
                            <input type="tel" required value={mobile} onChange={(e)=>setMobile(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-chai-orange" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                            <textarea required rows="3" value={address} onChange={(e)=>setAddress(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-chai-orange"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                            <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-chai-orange">
                                <option value="COD">Cash on Delivery (COD)</option>
                                <option value="UPI">UPI (Demo)</option>
                                <option value="CARD">Card (Demo)</option>
                            </select>
                        </div>
                        
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                            <div className="flex justify-between text-gray-600">
                                <span>Total Amount</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 bg-chai-orange text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-md">
                            Place Order (₹{finalTotal.toFixed(2)})
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

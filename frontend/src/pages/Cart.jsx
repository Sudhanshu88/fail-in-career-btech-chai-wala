import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const gst = cartTotal * 0.05;
    const finalTotal = cartTotal + gst;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-chai-cream text-chai-dark">
                <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any delicious chai or snacks yet!</p>
                <Link to="/menu" className="bg-chai-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-chai-cream py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-chai-dark mb-8">Your Cart</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {cart.map(item => (
                                    <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center gap-4">
                                        <div className="w-24 h-24 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                                            {item.image_url ? (
                                                <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex justify-center items-center text-gray-400">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-lg font-bold text-chai-dark">{item.name}</h3>
                                            <p className="text-chai-orange font-semibold">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                                                <FaMinus className="text-xs" />
                                            </button>
                                            <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                                                <FaPlus className="text-xs" />
                                            </button>
                                        </div>
                                        <div className="font-bold text-lg w-20 text-right">
                                            ₹{item.price * item.quantity}
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2">
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-200">
                                <button onClick={clearCart} className="text-red-500 hover:underline text-sm font-medium">Clear Cart</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-chai-dark mb-4 border-b pb-2">Order Summary</h2>
                            <div className="space-y-3 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">GST (5%)</span>
                                    <span className="font-medium">₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between items-center text-lg font-bold text-chai-dark">
                                    <span>Total</span>
                                    <span>₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-chai-orange text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
